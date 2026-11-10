//! The microphone and speaker on Android, through JNI, as Mavio's
//! `VoiceSession` uses them:
//! - `AudioRecord` at 16 kHz from `VOICE_COMMUNICATION`, else
//!   `VOICE_RECOGNITION`, else the plain microphone, with the device's echo
//!   canceler and noise suppressor on its session, read in 20 ms frames on a
//!   thread of its own;
//! - an `AudioTrack` of `USAGE_VOICE_COMMUNICATION` on the record's session,
//!   so the tutor's speech is what the echo canceler removes, written on a
//!   thread of its own; pausing and flushing it drops what was queued;
//! - a phone plays a call's audio from its earpiece, so while no headset is
//!   on the audio goes to its speaker (`setCommunicationDevice`, Android 12
//!   and later), and the mode it had comes back at the end.
//!
//! The permission is `RECORD_AUDIO`, asked for through Native Shell's
//! `Permissions` (nsh::permissions).

use std::{
    sync::{
        Arc, Mutex,
        atomic::{AtomicBool, AtomicU64, Ordering},
        mpsc,
    },
    thread,
    time::Duration,
};

use nsh_core::prelude::blocking;
use nsh::{
    jni::{
        JNIEnv,
        objects::{GlobalRef, JObject, JValue},
    },
    permissions,
};
use tokio::sync::oneshot;

use crate::{SAMPLE_RATE, SHARED, loudness};

const RECORD_AUDIO: &str = "android.permission.RECORD_AUDIO";
/// 20 ms at 16 kHz.
const FRAME: i32 = 320;
/// `MediaRecorder.AudioSource`: `VOICE_COMMUNICATION`, `VOICE_RECOGNITION`, `MIC`.
const SOURCES: [i32; 3] = [7, 6, 1];
/// `AudioFormat`: `CHANNEL_IN_MONO`, `CHANNEL_OUT_MONO`, `ENCODING_PCM_16BIT`.
const CHANNEL_IN_MONO: i32 = 16;
const CHANNEL_OUT_MONO: i32 = 4;
const PCM_16BIT: i32 = 2;
/// `AudioAttributes`: `USAGE_VOICE_COMMUNICATION`, `CONTENT_TYPE_SPEECH`.
const USAGE_VOICE_COMMUNICATION: i32 = 2;
const CONTENT_TYPE_SPEECH: i32 = 1;
/// `AudioTrack.MODE_STREAM`, `AudioRecord.STATE_INITIALIZED`, `RECORDSTATE_RECORDING`.
const MODE_STREAM: i32 = 1;
const STATE_INITIALIZED: i32 = 1;
const RECORDING: i32 = 3;
/// `AudioManager.MODE_IN_COMMUNICATION`.
const MODE_IN_COMMUNICATION: i32 = 3;
/// `AudioDeviceInfo` types: the earpiece, the speaker, and headsets.
const EARPIECE: i32 = 1;
const SPEAKER: i32 = 2;
const HEADSETS: [i32; 5] = [3, 4, 7, 22, 26];

/// A conversation's audio.
struct Session {
    record: GlobalRef,
    track: GlobalRef,
    effects: Vec<GlobalRef>,
    audio: Option<GlobalRef>,
    previous_mode: i32,
    routed: bool,
    running: Arc<AtomicBool>,
    /// Chunks to play, with the drop generation they were sent in.
    play: mpsc::Sender<(u64, Vec<i16>)>,
    /// The track's head when it was last flushed.
    base: Arc<AtomicU64>,
}

static SESSION: Mutex<Option<Session>> = Mutex::new(None);

fn session() -> std::sync::MutexGuard<'static, Option<Session>> {
    SESSION.lock().unwrap_or_else(|e| e.into_inner())
}

/// Runs `f` with this thread's JNI env in a local frame, clearing a Java
/// exception it left.
fn with_env<R>(f: impl FnOnce(&mut JNIEnv<'_>) -> Result<R, String>) -> Result<R, String> {
    let mut env = permissions::java_vm().attach_current_thread_permanently().map_err(jni)?;
    let mut out = None;
    let framed = env.with_local_frame(64, |env| -> Result<(), nsh::jni::errors::Error> {
        out = Some(f(env));
        Ok(())
    });
    if env.exception_check().unwrap_or(false) {
        let _ = env.exception_describe();
        let _ = env.exception_clear();
    }
    framed.map_err(jni)?;
    out.unwrap_or_else(|| Err("no result".into()))
}

/// jni turns a JNI error into the message the voice module reports.
fn jni(e: nsh::jni::errors::Error) -> String {
    e.to_string()
}

/// Asks for the microphone, then opens it and the speaker.
pub(crate) async fn open() -> Result<(), String> {
    close();
    let (sender, receiver) = oneshot::channel();
    permissions::request_permission(RECORD_AUDIO, move |granted| {
        let _ = sender.send(granted);
    });
    if !receiver.await.unwrap_or(false) {
        return Err("denied".into());
    }
    blocking(start).await.map_err(|e| e.to_string())?
}

fn start() -> Result<(), String> {
    let (record, effects) = with_env(open_record)?;
    let (audio, previous_mode, routed) = with_env(route).unwrap_or((None, 0, false));
    let track = match with_env(|env| make_track(env, &record)) {
        Ok(t) => t,
        Err(e) => {
            let _ = with_env(|env| release_record(env, &record, &effects));
            return Err(e);
        }
    };
    let running = Arc::new(AtomicBool::new(true));
    let base = Arc::new(AtomicU64::new(0));
    let (play, chunks) = mpsc::channel();
    {
        let (record, running) = (record.clone(), running.clone());
        thread::Builder::new().name("ga-voice-capture".into()).spawn(move || capture(record, running)).map_err(|e| e.to_string())?;
    }
    {
        let (track, running, base) = (track.clone(), running.clone(), base.clone());
        thread::Builder::new()
            .name("ga-voice-play".into())
            .spawn(move || speak(track, running, base, chunks))
            .map_err(|e| e.to_string())?;
    }
    *session() = Some(Session { record, track, effects, audio, previous_mode, routed, running, play, base });
    Ok(())
}

/// Opens the first source that has a microphone, its effects on, and starts it.
fn open_record(env: &mut JNIEnv<'_>) -> Result<(GlobalRef, Vec<GlobalRef>), String> {
    let min = env
        .call_static_method("android/media/AudioRecord", "getMinBufferSize", "(III)I", &[
            JValue::Int(SAMPLE_RATE as i32),
            JValue::Int(CHANNEL_IN_MONO),
            JValue::Int(PCM_16BIT),
        ])
        .and_then(|v| v.i())
        .map_err(jni)?;
    let size = min.max(FRAME * 2 * 10);
    for source in SOURCES {
        let Ok(record) = env.new_object("android/media/AudioRecord", "(IIIII)V", &[
            JValue::Int(source),
            JValue::Int(SAMPLE_RATE as i32),
            JValue::Int(CHANNEL_IN_MONO),
            JValue::Int(PCM_16BIT),
            JValue::Int(size),
        ]) else {
            let _ = env.exception_clear();
            continue;
        };
        let state = env.call_method(&record, "getState", "()I", &[]).and_then(|v| v.i()).unwrap_or(0);
        if state != STATE_INITIALIZED {
            let _ = env.call_method(&record, "release", "()V", &[]);
            continue;
        }
        let session = env.call_method(&record, "getAudioSessionId", "()I", &[]).and_then(|v| v.i()).map_err(jni)?;
        let mut effects = Vec::new();
        for class in ["android/media/audiofx/AcousticEchoCanceler", "android/media/audiofx/NoiseSuppressor"] {
            let available = env.call_static_method(class, "isAvailable", "()Z", &[]).and_then(|v| v.z()).unwrap_or(false);
            if !available {
                continue;
            }
            let sig = format!("(I)L{class};");
            if let Ok(effect) = env.call_static_method(class, "create", &sig, &[JValue::Int(session)]).and_then(|v| v.l())
                && !effect.is_null()
            {
                let _ = env.call_method(&effect, "setEnabled", "(Z)I", &[JValue::Bool(1)]);
                effects.push(env.new_global_ref(effect).map_err(jni)?);
            }
            let _ = env.exception_clear();
        }
        let record = env.new_global_ref(record).map_err(jni)?;
        let _ = env.call_method(record.as_obj(), "startRecording", "()V", &[]);
        let _ = env.exception_clear();
        let recording = env.call_method(record.as_obj(), "getRecordingState", "()I", &[]).and_then(|v| v.i()).unwrap_or(0);
        if recording == RECORDING {
            return Ok((record, effects));
        }
        release_record(env, &record, &effects)?;
    }
    Err("no microphone".into())
}

fn release_record(env: &mut JNIEnv<'_>, record: &GlobalRef, effects: &[GlobalRef]) -> Result<(), String> {
    for e in effects {
        let _ = env.call_method(e.as_obj(), "release", "()V", &[]);
    }
    let _ = env.call_method(record.as_obj(), "stop", "()V", &[]);
    let _ = env.exception_clear();
    let _ = env.call_method(record.as_obj(), "release", "()V", &[]);
    let _ = env.exception_clear();
    Ok(())
}

/// Sends a phone's call audio to its speaker while no headset is on.
fn route(env: &mut JNIEnv<'_>) -> Result<(Option<GlobalRef>, i32, bool), String> {
    let Some(context) = permissions::context() else { return Ok((None, 0, false)) };
    let name = env.new_string("audio").map_err(jni)?;
    let audio = env
        .call_method(context.as_obj(), "getSystemService", "(Ljava/lang/String;)Ljava/lang/Object;", &[JValue::Object(&name)])
        .and_then(|v| v.l())
        .map_err(jni)?;
    if audio.is_null() {
        return Ok((None, 0, false));
    }
    let previous = env.call_method(&audio, "getMode", "()I", &[]).and_then(|v| v.i()).map_err(jni)?;
    let sdk = env.get_static_field("android/os/Build$VERSION", "SDK_INT", "I").and_then(|v| v.i()).unwrap_or(0);
    let mut routed = false;
    if sdk >= 31 {
        let devices = env.call_method(&audio, "getAvailableCommunicationDevices", "()Ljava/util/List;", &[]).and_then(|v| v.l()).map_err(jni)?;
        let count = env.call_method(&devices, "size", "()I", &[]).and_then(|v| v.i()).map_err(jni)?;
        let (mut earpiece, mut headset, mut speaker) = (false, false, None::<JObject<'_>>);
        for i in 0..count {
            let device = env.call_method(&devices, "get", "(I)Ljava/lang/Object;", &[JValue::Int(i)]).and_then(|v| v.l()).map_err(jni)?;
            let kind = env.call_method(&device, "getType", "()I", &[]).and_then(|v| v.i()).map_err(jni)?;
            earpiece |= kind == EARPIECE;
            headset |= HEADSETS.contains(&kind);
            if kind == SPEAKER {
                speaker = Some(device);
            }
        }
        if let Some(speaker) = speaker.filter(|_| earpiece && !headset) {
            env.call_method(&audio, "setMode", "(I)V", &[JValue::Int(MODE_IN_COMMUNICATION)]).map_err(jni)?;
            routed = env
                .call_method(&audio, "setCommunicationDevice", "(Landroid/media/AudioDeviceInfo;)Z", &[JValue::Object(&speaker)])
                .and_then(|v| v.z())
                .map_err(jni)?;
        }
    }
    Ok((Some(env.new_global_ref(audio).map_err(jni)?), previous, routed))
}

/// An `AudioTrack` of voice communication at 16 kHz on the record's session, playing.
fn make_track(env: &mut JNIEnv<'_>, record: &GlobalRef) -> Result<GlobalRef, String> {
    let builder = env.new_object("android/media/AudioAttributes$Builder", "()V", &[]).map_err(jni)?;
    let sig = "(I)Landroid/media/AudioAttributes$Builder;";
    let builder = env.call_method(&builder, "setUsage", sig, &[JValue::Int(USAGE_VOICE_COMMUNICATION)]).and_then(|v| v.l()).map_err(jni)?;
    let builder = env.call_method(&builder, "setContentType", sig, &[JValue::Int(CONTENT_TYPE_SPEECH)]).and_then(|v| v.l()).map_err(jni)?;
    let attributes = env.call_method(&builder, "build", "()Landroid/media/AudioAttributes;", &[]).and_then(|v| v.l()).map_err(jni)?;
    let builder = env.new_object("android/media/AudioFormat$Builder", "()V", &[]).map_err(jni)?;
    let sig = "(I)Landroid/media/AudioFormat$Builder;";
    let builder = env.call_method(&builder, "setEncoding", sig, &[JValue::Int(PCM_16BIT)]).and_then(|v| v.l()).map_err(jni)?;
    let builder = env.call_method(&builder, "setSampleRate", sig, &[JValue::Int(SAMPLE_RATE as i32)]).and_then(|v| v.l()).map_err(jni)?;
    let builder = env.call_method(&builder, "setChannelMask", sig, &[JValue::Int(CHANNEL_OUT_MONO)]).and_then(|v| v.l()).map_err(jni)?;
    let format = env.call_method(&builder, "build", "()Landroid/media/AudioFormat;", &[]).and_then(|v| v.l()).map_err(jni)?;
    let min = env
        .call_static_method("android/media/AudioTrack", "getMinBufferSize", "(III)I", &[
            JValue::Int(SAMPLE_RATE as i32),
            JValue::Int(CHANNEL_OUT_MONO),
            JValue::Int(PCM_16BIT),
        ])
        .and_then(|v| v.i())
        .map_err(jni)?;
    let session = env.call_method(record.as_obj(), "getAudioSessionId", "()I", &[]).and_then(|v| v.i()).map_err(jni)?;
    let track = env
        .new_object("android/media/AudioTrack", "(Landroid/media/AudioAttributes;Landroid/media/AudioFormat;III)V", &[
            JValue::Object(&attributes),
            JValue::Object(&format),
            JValue::Int(min.max(SAMPLE_RATE as i32 / 5 * 2)),
            JValue::Int(MODE_STREAM),
            JValue::Int(session),
        ])
        .map_err(jni)?;
    env.call_method(&track, "play", "()V", &[]).map_err(jni)?;
    env.new_global_ref(track).map_err(jni)
}

/// Reads the microphone's 20 ms frames until the session ends.
fn capture(record: GlobalRef, running: Arc<AtomicBool>) {
    let Ok(mut env) = permissions::java_vm().attach_current_thread_permanently() else { return };
    let Ok(array) = env.new_short_array(FRAME) else { return };
    let mut frame = vec![0i16; FRAME as usize];
    let mut bytes = Vec::with_capacity(FRAME as usize * 2);
    let mut floats = vec![0f32; FRAME as usize];
    while running.load(Ordering::SeqCst) {
        let read = env
            .call_method(record.as_obj(), "read", "([SII)I", &[JValue::Object(&array), JValue::Int(0), JValue::Int(FRAME)])
            .and_then(|v| v.i())
            .unwrap_or(-1);
        if read <= 0 {
            let _ = env.exception_clear();
            thread::sleep(Duration::from_millis(20));
            continue;
        }
        let n = read as usize;
        if env.get_short_array_region(&array, 0, &mut frame[..n]).is_err() {
            continue;
        }
        bytes.clear();
        for (i, s) in frame[..n].iter().enumerate() {
            bytes.extend_from_slice(&s.to_le_bytes());
            floats[i] = f32::from(*s) / 32768.0;
        }
        SHARED.set_input(loudness(&floats[..n]));
        SHARED.capture(&bytes);
    }
}

/// Writes the tutor's speech to the track until the session ends, counting
/// what it played into `SHARED.played`.
fn speak(track: GlobalRef, running: Arc<AtomicBool>, base: Arc<AtomicU64>, chunks: mpsc::Receiver<(u64, Vec<i16>)>) {
    let Ok(mut env) = permissions::java_vm().attach_current_thread_permanently() else { return };
    while running.load(Ordering::SeqCst) {
        let head = env.call_method(track.as_obj(), "getPlaybackHeadPosition", "()I", &[]).and_then(|v| v.i());
        let _ = env.exception_clear();
        if let Ok(head) = head {
            SHARED.played.store(u64::from(head as u32).saturating_sub(base.load(Ordering::SeqCst)), Ordering::SeqCst);
        }
        let (generation, chunk) = match chunks.recv_timeout(Duration::from_millis(50)) {
            Ok(c) => c,
            Err(mpsc::RecvTimeoutError::Timeout) => {
                SHARED.set_output(0.0);
                continue;
            }
            Err(mpsc::RecvTimeoutError::Disconnected) => return,
        };
        if generation != SHARED.generation.load(Ordering::SeqCst) || chunk.is_empty() {
            continue;
        }
        let floats: Vec<f32> = chunk.iter().map(|s| f32::from(*s) / 32768.0).collect();
        SHARED.set_output(loudness(&floats));
        let _ = env.with_local_frame(4, |env| {
            let array = env.new_short_array(chunk.len() as i32)?;
            env.set_short_array_region(&array, 0, &chunk)?;
            env.call_method(track.as_obj(), "write", "([SII)I", &[JValue::Object(&array), JValue::Int(0), JValue::Int(chunk.len() as i32)])?;
            Ok::<_, nsh::jni::errors::Error>(())
        });
        let _ = env.exception_clear();
    }
}

/// Plays 16 kHz PCM after what was queued.
pub(crate) fn play(pcm: &[u8]) {
    let guard = session();
    let Some(s) = guard.as_ref() else { return };
    let samples: Vec<i16> = pcm.as_chunks::<2>().0.iter().map(|b| i16::from_le_bytes(*b)).collect();
    SHARED.queued.fetch_add(samples.len() as u64, Ordering::SeqCst);
    let _ = s.play.send((SHARED.generation.load(Ordering::SeqCst), samples));
}

/// Drops what was queued and not played.
pub(crate) fn stop_playing() {
    let guard = session();
    let Some(s) = guard.as_ref() else { return };
    let head = with_env(|env| {
        let t = s.track.as_obj();
        env.call_method(t, "pause", "()V", &[]).map_err(jni)?;
        env.call_method(t, "flush", "()V", &[]).map_err(jni)?;
        env.call_method(t, "play", "()V", &[]).map_err(jni)?;
        env.call_method(t, "getPlaybackHeadPosition", "()I", &[]).and_then(|v| v.i()).map_err(jni)
    });
    s.base.store(head.map(|h| u64::from(h as u32)).unwrap_or(0), Ordering::SeqCst);
    SHARED.set_output(0.0);
}

/// The name of the microphone in use.
pub(crate) fn device() -> String {
    let guard = session();
    let Some(s) = guard.as_ref() else { return String::new() };
    with_env(|env| {
        let device = env.call_method(s.record.as_obj(), "getRoutedDevice", "()Landroid/media/AudioDeviceInfo;", &[]).and_then(|v| v.l()).map_err(jni)?;
        if device.is_null() {
            return Ok(String::new());
        }
        let name = env.call_method(&device, "getProductName", "()Ljava/lang/CharSequence;", &[]).and_then(|v| v.l()).map_err(jni)?;
        let name = env.call_method(&name, "toString", "()Ljava/lang/String;", &[]).and_then(|v| v.l()).map_err(jni)?;
        Ok(String::from(env.get_string(&name.into()).map_err(jni)?))
    })
    .unwrap_or_default()
}

/// Stops capturing and playing, and gives the audio back.
pub(crate) fn close() {
    let Some(s) = session().take() else { return };
    s.running.store(false, Ordering::SeqCst);
    drop(s.play);
    let _ = with_env(|env| {
        release_record(env, &s.record, &s.effects)?;
        let _ = env.call_method(s.track.as_obj(), "stop", "()V", &[]);
        let _ = env.exception_clear();
        let _ = env.call_method(s.track.as_obj(), "release", "()V", &[]);
        if let Some(audio) = &s.audio {
            if s.routed {
                let _ = env.call_method(audio.as_obj(), "clearCommunicationDevice", "()V", &[]);
                let _ = env.call_method(audio.as_obj(), "setMode", "(I)V", &[JValue::Int(s.previous_mode)]);
            }
        }
        let _ = env.exception_clear();
        Ok(())
    });
}
