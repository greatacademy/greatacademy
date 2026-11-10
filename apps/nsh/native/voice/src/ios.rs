//! The microphone and speaker on iOS: `AVAudioSession` and one
//! `AVAudioEngine`, messaged dynamically as Native Shell does with
//! AVFoundation, as Mavio's `VoiceSession` uses them:
//! - the audio session is `playAndRecord` in mode `voiceChat`, on the
//!   speaker and Bluetooth headsets, and what it was before comes back when
//!   the conversation ends;
//! - the engine's main mixer is made before voice processing is enabled
//!   (else the engine cannot start, -10875), and voice processing on the
//!   input cancels the echo of what the engine plays; where it cannot be
//!   enabled (the simulator) the input is captured without it;
//! - a tap on the input takes its first channel, the voice processing's;
//! - the tutor's speech plays through an `AVAudioPlayerNode` at 16 kHz,
//!   which stopping and playing again empties.
//!
//! The engine is started off the main thread: voice processing takes up to
//! a second or more to start.

use std::{
    ffi::CStr,
    ptr,
    sync::{Mutex, OnceLock, atomic::Ordering},
};

use block2::RcBlock;
use nsh_core::prelude::blocking;
use objc2::{
    msg_send,
    rc::{Allocated, Retained},
    runtime::{AnyClass, AnyObject, Bool},
};
use objc2_foundation::NSString;
use tokio::sync::oneshot;

use crate::{Resampler, SAMPLE_RATE, SHARED, loudness, samples};

/// `AVAudioSessionCategoryOptionAllowBluetooth` (HFP) and `DefaultToSpeaker`.
const BLUETOOTH_HFP: usize = 0x4;
const DEFAULT_TO_SPEAKER: usize = 0x8;
/// `AVAudioSessionSetActiveOptionNotifyOthersOnDeactivation`.
const NOTIFY_OTHERS: usize = 1;

/// An Objective-C object used from the engine's thread and a blocking one;
/// AVAudioEngine and its nodes may be messaged from any thread.
struct Shared<T: ?Sized = AnyObject>(Retained<T>);

// SAFETY: see the type's comment; the objects are only messaged under the
// session's lock.
unsafe impl<T: ?Sized> Send for Shared<T> {}

/// A conversation's audio.
struct Session {
    engine: Shared,
    input: Shared,
    player: Shared,
    /// The player's format: 16 kHz mono float.
    format: Shared,
    /// The audio session's category and mode before, when they were
    /// playback, which a video playing has.
    previous: Option<(Shared<NSString>, Shared<NSString>)>,
}

static SESSION: Mutex<Option<Session>> = Mutex::new(None);

fn session() -> std::sync::MutexGuard<'static, Option<Session>> {
    SESSION.lock().unwrap_or_else(|e| e.into_inner())
}

fn loaded() -> bool {
    static LOADED: OnceLock<bool> = OnceLock::new();
    *LOADED.get_or_init(|| {
        let framework: &CStr = c"/System/Library/Frameworks/AVFoundation.framework/AVFoundation";
        // SAFETY: loads a system framework; the handle is never closed.
        !unsafe { libc::dlopen(framework.as_ptr(), libc::RTLD_LAZY) }.is_null()
    })
}

fn class(name: &CStr) -> Result<&'static AnyClass, String> {
    AnyClass::get(name).ok_or_else(|| format!("no {}", name.to_string_lossy()))
}

fn audio_session() -> Result<Retained<AnyObject>, String> {
    let cls = class(c"AVAudioSession")?;
    // SAFETY: AVAudioSession's documented class method.
    Ok(unsafe { msg_send![cls, sharedInstance] })
}

/// Asks for the microphone, then starts the engine.
pub(crate) async fn open() -> Result<(), String> {
    if !loaded() {
        return Err("AVFoundation is missing".into());
    }
    close();
    let audio = audio_session()?;
    let (sender, receiver) = oneshot::channel::<bool>();
    let sender = Mutex::new(Some(sender));
    let asked = RcBlock::new(move |granted: Bool| {
        if let Some(s) = sender.lock().unwrap_or_else(|e| e.into_inner()).take() {
            let _ = s.send(granted.as_bool());
        }
    });
    // SAFETY: AVAudioSession's documented method; the system copies the block.
    unsafe {
        let _: () = msg_send![&audio, requestRecordPermission: &*asked];
    }
    drop(audio);
    if !receiver.await.unwrap_or(false) {
        return Err("denied".into());
    }
    blocking(start).await.map_err(|e| e.to_string())?
}

/// Sets the audio session up and starts the engine, capturing and playing.
fn start() -> Result<(), String> {
    let audio = audio_session()?;
    // SAFETY: AVAudioSession's and AVAudioEngine's documented API; every
    // object is checked before it is used.
    unsafe {
        let category: Retained<NSString> = msg_send![&audio, category];
        let mode: Retained<NSString> = msg_send![&audio, mode];
        let previous = (category.to_string() == "AVAudioSessionCategoryPlayback")
            .then(|| (Shared(category), Shared(mode)));
        let mut error: *mut AnyObject = ptr::null_mut();
        let play_and_record = NSString::from_str("AVAudioSessionCategoryPlayAndRecord");
        let voice_chat = NSString::from_str("AVAudioSessionModeVoiceChat");
        let set: bool = msg_send![
            &audio,
            setCategory: &*play_and_record,
            mode: &*voice_chat,
            options: DEFAULT_TO_SPEAKER | BLUETOOTH_HFP,
            error: &mut error
        ];
        if !set {
            return Err("the audio session cannot record".into());
        }
        let active: bool = msg_send![&audio, setActive: true, error: &mut error];
        if !active {
            return Err("the audio session cannot start".into());
        }

        let engine: Retained<AnyObject> = msg_send![class(c"AVAudioEngine")?, new];
        // The output's unit made first: voice processing enabled before it
        // exists, the engine cannot start it (-10875).
        let mixer: Retained<AnyObject> = msg_send![&engine, mainMixerNode];
        let input: Retained<AnyObject> = msg_send![&engine, inputNode];
        let mut error: *mut AnyObject = ptr::null_mut();
        let processing: bool = msg_send![&input, setVoiceProcessingEnabled: true, error: &mut error];
        if !processing {
            log::warn!("voice processing is unavailable; capturing without echo cancellation");
        }
        let in_format: Option<Retained<AnyObject>> = msg_send![&input, outputFormatForBus: 0usize];
        let in_format = in_format.ok_or("no microphone")?;
        let rate: f64 = msg_send![&in_format, sampleRate];
        let channels: u32 = msg_send![&in_format, channelCount];
        if rate <= 0.0 || channels == 0 {
            restore(&audio, None);
            return Err("no microphone".into());
        }

        let resampler = Mutex::new(Resampler::new(rate));
        let tap = RcBlock::new(move |buffer: *mut AnyObject, _when: *mut AnyObject| {
            let Some(buffer) = buffer.as_ref() else { return };
            let Some(first) = channel(buffer) else { return };
            SHARED.set_input(loudness(first));
            let mut out = Vec::with_capacity(first.len());
            resampler.lock().unwrap_or_else(|e| e.into_inner()).push(first, &mut out);
            SHARED.capture(&out);
        });
        let _: () = msg_send![
            &input,
            installTapOnBus: 0usize,
            bufferSize: 1024u32,
            format: &*in_format,
            block: &*tap
        ];

        let format: Allocated<AnyObject> = msg_send![class(c"AVAudioFormat")?, alloc];
        let format: Option<Retained<AnyObject>> =
            msg_send![format, initStandardFormatWithSampleRate: f64::from(SAMPLE_RATE), channels: 1u32];
        let format = format.ok_or("no playback format")?;
        let player: Retained<AnyObject> = msg_send![class(c"AVAudioPlayerNode")?, new];
        let _: () = msg_send![&engine, attachNode: &*player];
        let _: () = msg_send![&engine, connect: &*player, to: &*mixer, format: &*format];
        let meter = RcBlock::new(move |buffer: *mut AnyObject, _when: *mut AnyObject| {
            if let Some(first) = buffer.as_ref().and_then(|b| channel(b)) {
                SHARED.set_output(loudness(first));
            }
        });
        let _: () = msg_send![
            &player,
            installTapOnBus: 0usize,
            bufferSize: 1024u32,
            format: &*format,
            block: &*meter
        ];

        let _: () = msg_send![&engine, prepare];
        let mut error: *mut AnyObject = ptr::null_mut();
        let started: bool = msg_send![&engine, startAndReturnError: &mut error];
        if !started {
            let _: () = msg_send![&input, removeTapOnBus: 0usize];
            let _: () = msg_send![&player, removeTapOnBus: 0usize];
            restore(&audio, previous.as_ref());
            return Err("the microphone cannot start".into());
        }
        let _: () = msg_send![&player, play];
        *session() = Some(Session {
            engine: Shared(engine),
            input: Shared(input),
            player: Shared(player),
            format: Shared(format),
            previous,
        });
    }
    Ok(())
}

/// The first channel of a float `AVAudioPCMBuffer`, while the buffer lives.
///
/// # Safety
/// `buffer` is an `AVAudioPCMBuffer`.
unsafe fn channel(buffer: &AnyObject) -> Option<&[f32]> {
    // SAFETY: AVAudioPCMBuffer's documented API; the pointer is checked.
    unsafe {
        let data: *const *mut f32 = msg_send![buffer, floatChannelData];
        let length: u32 = msg_send![buffer, frameLength];
        if data.is_null() || (*data).is_null() {
            return None;
        }
        Some(std::slice::from_raw_parts(*data, length as usize))
    }
}

/// Plays 16 kHz PCM after what was queued.
pub(crate) fn play(pcm: &[u8]) {
    let guard = session();
    let Some(s) = guard.as_ref() else { return };
    let floats = samples(pcm);
    if floats.is_empty() {
        return;
    }
    let count = floats.len() as u32;
    // SAFETY: AVAudioPCMBuffer's and AVAudioPlayerNode's documented API; the
    // buffer's channel is written within its capacity.
    unsafe {
        let Ok(cls) = class(c"AVAudioPCMBuffer") else { return };
        let buffer: Allocated<AnyObject> = msg_send![cls, alloc];
        let buffer: Option<Retained<AnyObject>> =
            msg_send![buffer, initWithPCMFormat: &*s.format.0, frameCapacity: count];
        let Some(buffer) = buffer else { return };
        let _: () = msg_send![&buffer, setFrameLength: count];
        let data: *const *mut f32 = msg_send![&buffer, floatChannelData];
        if data.is_null() || (*data).is_null() {
            return;
        }
        std::slice::from_raw_parts_mut(*data, floats.len()).copy_from_slice(&floats);
        SHARED.queued.fetch_add(u64::from(count), Ordering::SeqCst);
        let generation = SHARED.generation.load(Ordering::SeqCst);
        let done = RcBlock::new(move || {
            if SHARED.generation.load(Ordering::SeqCst) == generation {
                SHARED.played.fetch_add(u64::from(count), Ordering::SeqCst);
            }
        });
        let _: () = msg_send![&s.player.0, scheduleBuffer: &*buffer, completionHandler: &*done];
        let playing: bool = msg_send![&s.player.0, isPlaying];
        if !playing {
            let _: () = msg_send![&s.player.0, play];
        }
    }
}

/// Empties the player: stopping drops what was scheduled.
pub(crate) fn stop_playing() {
    let guard = session();
    let Some(s) = guard.as_ref() else { return };
    // SAFETY: AVAudioPlayerNode's documented API.
    unsafe {
        let _: () = msg_send![&s.player.0, stop];
        let _: () = msg_send![&s.player.0, play];
    }
    SHARED.set_output(0.0);
}

/// The name of the input in use.
pub(crate) fn device() -> String {
    let Ok(audio) = audio_session() else { return String::new() };
    // SAFETY: AVAudioSession's documented API; each object is checked.
    unsafe {
        let route: Option<Retained<AnyObject>> = msg_send![&audio, currentRoute];
        let Some(route) = route else { return String::new() };
        let inputs: Retained<AnyObject> = msg_send![&route, inputs];
        let first: Option<Retained<AnyObject>> = msg_send![&inputs, firstObject];
        let Some(first) = first else { return String::new() };
        let name: Retained<NSString> = msg_send![&first, portName];
        name.to_string()
    }
}

/// Stops the engine and gives the audio session back.
pub(crate) fn close() {
    let Some(s) = session().take() else { return };
    // SAFETY: AVAudioEngine's documented API.
    unsafe {
        let _: () = msg_send![&s.input.0, removeTapOnBus: 0usize];
        let _: () = msg_send![&s.player.0, removeTapOnBus: 0usize];
        let _: () = msg_send![&s.player.0, stop];
        let _: () = msg_send![&s.engine.0, stop];
    }
    if let Ok(audio) = audio_session() {
        restore(&audio, s.previous.as_ref());
    }
}

/// Gives the audio session back: a video playing plays on as it was, else
/// the session ends and others' audio resumes.
fn restore(audio: &AnyObject, previous: Option<&(Shared<NSString>, Shared<NSString>)>) {
    let mut error: *mut AnyObject = ptr::null_mut();
    // SAFETY: AVAudioSession's documented API.
    unsafe {
        match previous {
            Some((category, mode)) => {
                let _: bool = msg_send![audio, setCategory: &*category.0, mode: &*mode.0, options: 0usize, error: &mut error];
            }
            None => {
                let _: bool = msg_send![audio, setActive: false, withOptions: NOTIFY_OTHERS, error: &mut error];
            }
        }
    }
}
