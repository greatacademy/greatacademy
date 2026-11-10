//! The microphone and the speaker of spoken conversations (`ga/voice`,
//! docs/english-curriculum.md §13.3). The app's script speaks to the voice
//! service; this crate only captures and plays its audio: 16-bit
//! little-endian mono PCM at [`SAMPLE_RATE`] both ways.
//!
//! It follows what the voice client of the Mavio project learned:
//! - On iOS one `AVAudioEngine` with voice processing on captures and plays,
//!   so that the tutor's speech is cancelled from what the microphone hears,
//!   in an audio session of `playAndRecord` and `voiceChat` that plays on the
//!   speaker and a Bluetooth headset.
//! - The microphone is resampled to 16 kHz by averaging over each output
//!   sample's span, so that what is above 8 kHz does not fold into speech.
//! - Capture starts as the microphone opens, so the page can show its level;
//!   the script takes what was captured every few tens of milliseconds and
//!   holds it until the socket is open.
//!
//! The audio threads only fill [`Shared`]: the script polls it with
//! [`Microphone::take`] and the levels, so nothing crosses to the engine's
//! thread from them.

// The capture and playback helpers serve the platforms that have them.
#![cfg_attr(not(any(target_os = "ios", target_os = "android")), allow(dead_code))]

#[cfg(target_os = "android")]
mod android;
#[cfg(target_os = "android")]
use android as platform;
#[cfg(target_os = "ios")]
mod ios;
#[cfg(target_os = "ios")]
use ios as platform;

use std::sync::{
    Mutex,
    atomic::{AtomicU32, AtomicU64, Ordering},
};

use nsh_core::prelude::*;

/// SAMPLE_RATE is the rate of audio in both directions, in hertz.
pub const SAMPLE_RATE: u32 = 16_000;

/// FRAME_BYTES is one 20 ms frame of audio, in bytes.
pub const FRAME_BYTES: usize = SAMPLE_RATE as usize / 50 * 2;

/// MAX_HELD_BYTES is the most audio kept for the script, 10 s: older audio
/// goes once it is not taken.
const MAX_HELD_BYTES: usize = FRAME_BYTES * 500;

/// Shared is what the audio threads and the script share.
pub(crate) struct Shared {
    /// Audio captured and not yet taken, whole frames and a part.
    captured: Mutex<Vec<u8>>,
    /// The microphone's level and the tutor's, as `f32` bits.
    input: AtomicU32,
    output: AtomicU32,
    /// Samples of the tutor's speech queued and played, since the last drop.
    pub(crate) queued: AtomicU64,
    pub(crate) played: AtomicU64,
    /// Counts drops, so that what a drop stopped is not counted as played.
    pub(crate) generation: AtomicU64,
}

/// SHARED is the one microphone's state: the device has one.
pub(crate) static SHARED: Shared = Shared {
    captured: Mutex::new(Vec::new()),
    input: AtomicU32::new(0),
    output: AtomicU32::new(0),
    queued: AtomicU64::new(0),
    played: AtomicU64::new(0),
    generation: AtomicU64::new(0),
};

impl Shared {
    /// capture appends 16 kHz PCM, dropping the oldest beyond what is held.
    pub(crate) fn capture(&self, pcm: &[u8]) {
        let mut held = self.captured.lock().unwrap_or_else(|e| e.into_inner());
        held.extend_from_slice(pcm);
        if held.len() > MAX_HELD_BYTES {
            let len = held.len();
            let extra = (len - MAX_HELD_BYTES).div_ceil(FRAME_BYTES) * FRAME_BYTES;
            held.drain(..extra.min(len));
        }
    }

    /// take removes the whole frames captured.
    fn take(&self) -> Vec<u8> {
        let mut held = self.captured.lock().unwrap_or_else(|e| e.into_inner());
        let whole = held.len() / FRAME_BYTES * FRAME_BYTES;
        held.drain(..whole).collect()
    }

    pub(crate) fn set_input(&self, level: f32) {
        self.input.store(level.to_bits(), Ordering::Relaxed);
    }

    pub(crate) fn set_output(&self, level: f32) {
        self.output.store(level.to_bits(), Ordering::Relaxed);
    }

    /// reset forgets what was captured and played, as a session ends.
    pub(crate) fn reset(&self) {
        self.captured.lock().unwrap_or_else(|e| e.into_inner()).clear();
        self.set_input(0.0);
        self.set_output(0.0);
        self.generation.fetch_add(1, Ordering::SeqCst);
        self.queued.store(0, Ordering::SeqCst);
        self.played.store(0, Ordering::SeqCst);
    }
}

/// loudness is how loud samples are, from 0 to about 1: speech's RMS spans
/// roughly 0.01 to 0.3, which its square root spreads out.
pub(crate) fn loudness(samples: &[f32]) -> f32 {
    if samples.is_empty() {
        return 0.0;
    }
    let mean = samples.iter().map(|s| s * s).sum::<f32>() / samples.len() as f32;
    (mean.sqrt().sqrt() * 1.5).min(1.0)
}

/// Resampler turns audio at a device's rate into 16 kHz 16-bit PCM,
/// averaging over each output sample's span.
#[derive(Debug, Clone)]
pub(crate) struct Resampler {
    ratio: f64,
    acc: f64,
    sum: f32,
    count: u32,
}

impl Resampler {
    /// new resamples from `rate` hertz.
    pub(crate) fn new(rate: f64) -> Self {
        Resampler { ratio: (rate / f64::from(SAMPLE_RATE)).max(1.0), acc: 0.0, sum: 0.0, count: 0 }
    }

    /// push resamples `samples`, appending little-endian 16-bit PCM to `out`.
    pub(crate) fn push(&mut self, samples: &[f32], out: &mut Vec<u8>) {
        for &s in samples {
            self.sum += s;
            self.count += 1;
            self.acc += 1.0;
            if self.acc < self.ratio {
                continue;
            }
            self.acc -= self.ratio;
            let v = (self.sum / self.count as f32).clamp(-1.0, 1.0);
            self.sum = 0.0;
            self.count = 0;
            let pcm = if v < 0.0 { (v * 32768.0) as i16 } else { (v * 32767.0) as i16 };
            out.extend_from_slice(&pcm.to_le_bytes());
        }
    }
}

/// samples reads little-endian 16-bit PCM as floats from -1 to 1.
pub(crate) fn samples(pcm: &[u8]) -> Vec<f32> {
    pcm.as_chunks::<2>().0.iter().map(|b| f32::from(i16::from_le_bytes(*b)) / 32768.0).collect()
}

/// The device's microphone and speaker for one conversation at a time.
#[module]
pub struct Microphone;

#[module]
impl Microphone {
    /// Whether this device can hold a conversation here.
    pub fn available() -> bool {
        cfg!(any(target_os = "ios", target_os = "android"))
    }

    /// Asks for the microphone (the system's prompt, the first time) and
    /// starts capturing and playing; throws `"denied"` when it is refused,
    /// and the reason when it cannot open.
    pub async fn open() -> Result<(), JsError> {
        SHARED.reset();
        #[cfg(any(target_os = "ios", target_os = "android"))]
        return platform::open().await.map_err(JsError::Error);
        #[cfg(not(any(target_os = "ios", target_os = "android")))]
        Err(JsError::Error("unavailable".into()))
    }

    /// The audio captured since the last call, in whole 20 ms frames of
    /// 16 kHz 16-bit little-endian PCM.
    pub fn take() -> Vec<u8> {
        SHARED.take()
    }

    /// Plays 16 kHz 16-bit little-endian PCM after what was queued.
    pub fn play(pcm: Vec<u8>) {
        #[cfg(any(target_os = "ios", target_os = "android"))]
        platform::play(&pcm);
        #[cfg(not(any(target_os = "ios", target_os = "android")))]
        let _ = pcm;
    }

    /// Stops what was queued and not yet played, as an interruption does.
    pub fn stop_playing() {
        SHARED.generation.fetch_add(1, Ordering::SeqCst);
        #[cfg(any(target_os = "ios", target_os = "android"))]
        platform::stop_playing();
        SHARED.queued.store(0, Ordering::SeqCst);
        SHARED.played.store(0, Ordering::SeqCst);
    }

    /// How long what was queued still plays, in seconds.
    pub fn left() -> f64 {
        let queued = SHARED.queued.load(Ordering::SeqCst);
        let played = SHARED.played.load(Ordering::SeqCst);
        queued.saturating_sub(played) as f64 / f64::from(SAMPLE_RATE)
    }

    /// How loud the microphone is now, from 0 to about 1.
    pub fn input_level() -> f64 {
        f64::from(f32::from_bits(SHARED.input.load(Ordering::Relaxed)))
    }

    /// How loud the tutor is now, from 0 to about 1.
    pub fn output_level() -> f64 {
        f64::from(f32::from_bits(SHARED.output.load(Ordering::Relaxed)))
    }

    /// The name of the microphone in use, as the system gives it.
    pub fn device() -> String {
        #[cfg(any(target_os = "ios", target_os = "android"))]
        return platform::device();
        #[cfg(not(any(target_os = "ios", target_os = "android")))]
        String::new()
    }

    /// Stops capturing and playing and gives the audio back to the system.
    pub fn close() {
        #[cfg(any(target_os = "ios", target_os = "android"))]
        platform::close();
        SHARED.reset();
    }
}

/// The crate's UI set: what the app imports from `ga/voice`.
#[native_module("ga/voice")]
fn native(registry: &mut Registry) {
    registry.module::<Microphone>();
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn resamples_48k_to_16k_averaging_each_span() {
        let mut r = Resampler::new(48_000.0);
        let mut out = Vec::new();
        r.push(&[0.3, 0.3, 0.3, -0.6, -0.6, -0.6, 0.0], &mut out);
        assert_eq!(out.len(), 4);
        let s = samples(&out);
        assert!((s[0] - 0.3).abs() < 0.001 && (s[1] + 0.6).abs() < 0.001);
    }

    #[test]
    fn resamples_a_fractional_ratio_to_the_right_count() {
        let mut r = Resampler::new(44_100.0);
        let mut out = Vec::new();
        r.push(&vec![0.1; 44_100], &mut out);
        assert!((out.len() / 2).abs_diff(16_000) <= 1);
    }

    #[test]
    fn takes_whole_frames_and_keeps_the_rest() {
        let shared = Shared {
            captured: Mutex::new(Vec::new()),
            input: AtomicU32::new(0),
            output: AtomicU32::new(0),
            queued: AtomicU64::new(0),
            played: AtomicU64::new(0),
            generation: AtomicU64::new(0),
        };
        shared.capture(&vec![1; FRAME_BYTES * 2 + 10]);
        assert_eq!(shared.take().len(), FRAME_BYTES * 2);
        assert_eq!(shared.take().len(), 0);
        shared.capture(&vec![1; MAX_HELD_BYTES + FRAME_BYTES * 3]);
        assert!(shared.take().len() <= MAX_HELD_BYTES);
    }

    #[test]
    fn measures_silence_as_nothing_and_speech_as_something() {
        assert_eq!(loudness(&[0.0; 160]), 0.0);
        let l = loudness(&[0.1; 160]);
        assert!(l > 0.3 && l <= 1.0);
    }
}
