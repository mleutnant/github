"""Soundtrack for the QuinLine® 74 vs. 84 showreel (30 s, 120 BPM).

Everything is synthesised here with numpy (no samples, no licences):
pad + bass + drums on a 120 BPM grid, a whoosh and a "lock" clack for every
pane slide, ticks for the title counters and soft plucks where values land.

Timing mirrors remotion/src/compositions/quinline/timing.ts (30 fps,
one beat = 15 frames). Run:

    python3 projects/quinline-vergleich/audio/make_soundtrack.py

Writes remotion/public/quinline/soundtrack.wav (48 kHz, 16 bit, stereo).
"""

from __future__ import annotations

import wave
from pathlib import Path

import numpy as np

SR = 48_000
FPS = 30
DUR = 30.0
N = int(SR * DUR)
BEAT = 0.5  # 120 BPM

# Absolute scene starts (frames) — keep in sync with timing.ts
SCENE_START = {
    "opener": 0,
    "titel": 90,
    "groesse": 165,
    "bautiefe": 270,
    "glas": 375,
    "typen": 450,
    "schwellen": 525,
    "waerme": 645,
    "antrieb": 735,
    "outro": 810,
}
TRANSITION = 15

S = SCENE_START

# Value landings / highlights (absolute frames) → soft pluck, (frame, pitch index into chord).
# Frames come from each scene's beat list (local frame + scene start).
PLUCKS: list[tuple[int, int]] = [
    (S["groesse"] + 45, 0), (S["groesse"] + 75, 2),      # Größe: height, width
    (S["bautiefe"] + 30, 0), (S["bautiefe"] + 60, 2),    # Bautiefe: +10 mm, +24 mm
    (S["glas"] + 45, 1), (S["glas"] + 50, 3),            # Verglasung: values, +10 mm
    (S["typen"] + 45, 0), (S["typen"] + 55, 2),          # Typen: 2- bis 4-teilig, Schema E
    (S["schwellen"] + 60, 1), (S["schwellen"] + 75, 3),  # Schwellen: 74-only rows, chips
    (S["waerme"] + 45, 0), (S["waerme"] + 60, 2),        # Wärme: values, Passivhaus rule
    (S["antrieb"] + 30, 1), (S["antrieb"] + 45, 3),      # Antrieb: eVOMATIC®, chip
    (S["outro"] + 30, 0), (S["outro"] + 45, 2),          # Outro: frame locks, systems line
]
# Dimension lines / counters snapping out → dry snap
SNAPS = [S["bautiefe"] + 15, S["bautiefe"] + 45, S["groesse"] + 15, S["groesse"] + 60]
# Marker cascade (Schwellen) and counter ticks (Wärme)
TICKS = [S["schwellen"] + f for f in range(15, 46, 5)] + [S["waerme"] + f for f in (22, 28, 33, 37, 41, 45)]
# Glass panes setting down (Verglasung)
TINKS = [S["glas"] + 15, S["glas"] + 22, S["glas"] + 30]
# Small mechanical moves inside scenes: (start frame, length s) whoosh / lock frame
MINI_WHOOSH = [(S["typen"] + 25, 0.4)]
LOCKS = [S["typen"] + 45, S["antrieb"] + 15, S["antrieb"] + 75]
# eVOMATIC® motor runs: (start, end) frames
MOTOR = [(S["antrieb"] + 18, S["antrieb"] + 42), (S["antrieb"] + 50, S["antrieb"] + 70)]

DROP = SCENE_START["titel"] / FPS          # beat kicks in with the title (3.0 s)
END_DRUMS = (SCENE_START["outro"] + TRANSITION) / FPS  # 27.5 s final hit

rng = np.random.default_rng(7)
t_all = np.arange(N) / SR


def f2s(frame: float) -> int:
    return int(round(frame / FPS * SR))


def midi(m: float) -> float:
    return 440.0 * 2 ** ((m - 69) / 12)


def env_ad(n: int, attack: float, decay: float) -> np.ndarray:
    t = np.arange(n) / SR
    a = np.clip(t / max(attack, 1e-4), 0, 1)
    return a * np.exp(-np.maximum(t - attack, 0) / decay)


def fft_filter(x: np.ndarray, lo: float | None = None, hi: float | None = None, slope: float = 1.0) -> np.ndarray:
    """Soft band-pass in the frequency domain (whole-buffer, zero-phase)."""
    X = np.fft.rfft(x)
    f = np.fft.rfftfreq(len(x), 1 / SR)
    g = np.ones_like(f)
    if lo:
        g *= 1 / (1 + (lo / np.maximum(f, 1)) ** (2 * slope))
    if hi:
        g *= 1 / (1 + (f / hi) ** (2 * slope))
    return np.fft.irfft(X * g, len(x))


def add(buf: np.ndarray, start: int, sig: np.ndarray, gain: float = 1.0, pan: float = 0.0) -> None:
    """Mix mono `sig` into stereo `buf` at sample `start` with equal-power pan (-1 … 1)."""
    if start >= N:
        return
    if start < 0:
        sig = sig[-start:]
        start = 0
    end = min(N, start + len(sig))
    s = sig[: end - start] * gain
    ang = (pan + 1) * np.pi / 4
    buf[start:end, 0] += s * np.cos(ang)
    buf[start:end, 1] += s * np.sin(ang)


def reverb(x: np.ndarray, seconds: float = 2.2, mix: float = 0.25) -> np.ndarray:
    """Cheap stereo convolution reverb with decaying-noise impulse responses."""
    n_ir = int(seconds * SR)
    t = np.arange(n_ir) / SR
    out = np.zeros_like(x)
    for ch in range(2):
        ir = rng.standard_normal(n_ir) * np.exp(-t * 6.5 / seconds)
        ir = fft_filter(ir, lo=200, hi=6000)
        ir /= np.sqrt(np.sum(ir**2))
        L = len(x) + n_ir
        nfft = 1 << (L - 1).bit_length()
        wet = np.fft.irfft(np.fft.rfft(x[:, ch], nfft) * np.fft.rfft(ir, nfft), nfft)[: len(x)]
        out[:, ch] = x[:, ch] * (1 - mix) + wet * mix
    return out


# ---------------------------------------------------------------- instruments

def kick() -> np.ndarray:
    n = int(0.45 * SR)
    t = np.arange(n) / SR
    f = 46 + 110 * np.exp(-t / 0.045)
    phase = 2 * np.pi * np.cumsum(f) / SR
    body = np.sin(phase) * np.exp(-t / 0.22)
    click = fft_filter(rng.standard_normal(n), lo=1500, hi=7000) * np.exp(-t / 0.004) * 0.35
    return np.tanh(1.6 * (body + click))


def clap() -> np.ndarray:
    n = int(0.5 * SR)
    t = np.arange(n) / SR
    noise = fft_filter(rng.standard_normal(n), lo=900, hi=5200)
    e = np.zeros(n)
    for off in (0.0, 0.011, 0.022):
        e += np.where(t >= off, np.exp(-(t - off) / (0.012 if off < 0.02 else 0.13)), 0)
    return noise * e * 0.6


def hat(open_: bool = False) -> np.ndarray:
    n = int((0.22 if open_ else 0.06) * SR)
    t = np.arange(n) / SR
    noise = fft_filter(rng.standard_normal(n), lo=7000, hi=13000)
    return noise * np.exp(-t / (0.07 if open_ else 0.014))


def bass_note(freq: float, length: float) -> np.ndarray:
    n = int(length * SR)
    t = np.arange(n) / SR
    x = np.sin(2 * np.pi * freq * t) + 0.35 * np.sin(2 * np.pi * 2 * freq * t)
    e = np.minimum(1, t / 0.005) * np.exp(-t / 0.18)
    return np.tanh(1.8 * x) * e


def pad_chord(notes: list[float], length: float, bright: float = 1.0) -> np.ndarray:
    """Detuned additive saw voices with a soft high roll-off and slow swell."""
    n = int(length * SR)
    t = np.arange(n) / SR
    out = np.zeros(n)
    for m in notes:
        for det in (-0.08, 0.0, 0.08):
            f0 = midi(m + det)
            ph = rng.uniform(0, 2 * np.pi)
            for k in range(1, 14):
                fk = f0 * k
                if fk > 9000:
                    break
                amp = (1 / k) / (1 + (fk / (1400 * bright)) ** 2)
                out += amp * np.sin(2 * np.pi * fk * t + ph * k)
    a = np.minimum(1, t / 0.35)
    r = np.minimum(1, (length - t) / 0.4)
    return out * a * np.clip(r, 0, 1) / (len(notes) * 3)


def pluck(freq: float) -> np.ndarray:
    n = int(0.9 * SR)
    t = np.arange(n) / SR
    x = sum((1 / k) * np.exp(-t * (6 + 5 * k)) * np.sin(2 * np.pi * freq * k * t) for k in range(1, 7))
    return x * np.minimum(1, t / 0.002)


def tick(freq: float = 2600) -> np.ndarray:
    n = int(0.03 * SR)
    t = np.arange(n) / SR
    return np.sin(2 * np.pi * freq * t) * np.exp(-t / 0.006)


def tink(freq: float) -> np.ndarray:
    """Glass pane touching down: inharmonic bell partials, short."""
    n = int(0.6 * SR)
    t = np.arange(n) / SR
    x = sum(a * np.sin(2 * np.pi * freq * r * t) * np.exp(-t * d) for r, a, d in ((1, 1, 9), (2.76, 0.5, 14), (5.4, 0.25, 22)))
    return x * np.minimum(1, t / 0.001)


def snap() -> np.ndarray:
    n = int(0.08 * SR)
    t = np.arange(n) / SR
    return fft_filter(rng.standard_normal(n), lo=2500, hi=9000) * np.exp(-t / 0.008)


def motor(length: float) -> np.ndarray:
    """Soft electric drive hum with a gentle rise and fall."""
    n = int(length * SR)
    t = np.arange(n) / SR
    f = 110 + 25 * np.sin(np.pi * t / length)
    ph = 2 * np.pi * np.cumsum(f) / SR
    x = sum((0.8 ** k) * np.sin(k * ph) for k in range(1, 9))
    x = fft_filter(x, lo=80, hi=1800)
    return x * np.sin(np.pi * np.clip(t / length, 0, 1)) ** 0.8 / 3


def whoosh(length: float = 0.62) -> np.ndarray:
    """Noise swell whose band sweeps up then down — the sash gliding by."""
    n = int(length * SR)
    hop, win = 256, 1024
    noise = rng.standard_normal(n + win)
    out = np.zeros(n + win)
    w = np.hanning(win)
    freqs = np.fft.rfftfreq(win, 1 / SR)
    for i, s in enumerate(range(0, n, hop)):
        p = s / n
        centre = 500 + 3800 * np.sin(np.pi * p) ** 1.5
        g = np.exp(-0.5 * (np.log(np.maximum(freqs, 20) / centre) / 0.7) ** 2)
        seg = np.fft.irfft(np.fft.rfft(noise[s : s + win] * w) * g, win)
        out[s : s + win] += seg * w
    e = np.sin(np.pi * np.clip(np.arange(n + win) / n, 0, 1)) ** 2
    return (out * e)[:n] / 6


def clack() -> np.ndarray:
    """Sash locking down: short low thump plus a dry mechanical click."""
    n = int(0.25 * SR)
    t = np.arange(n) / SR
    thump = np.sin(2 * np.pi * (70 + 60 * np.exp(-t / 0.02)) * t) * np.exp(-t / 0.06)
    click = fft_filter(rng.standard_normal(n), lo=1800, hi=6000) * np.exp(-t / 0.003)
    return 0.8 * thump + 0.5 * click


def riser(length: float) -> np.ndarray:
    n = int(length * SR)
    t = np.arange(n) / SR
    p = t / length
    noise = fft_filter(rng.standard_normal(n), lo=1200, hi=9000)
    tone = np.sin(2 * np.pi * np.cumsum(220 + 660 * p**2) / SR)
    return (noise * 0.5 + tone * 0.15) * p**2.5


def impact() -> np.ndarray:
    n = int(2.5 * SR)
    t = np.arange(n) / SR
    boom = np.sin(2 * np.pi * (40 + 70 * np.exp(-t / 0.05)) * t) * np.exp(-t / 0.7)
    air = fft_filter(rng.standard_normal(n), lo=300, hi=4000) * np.exp(-t / 0.35) * 0.3
    return np.tanh(1.4 * boom) + air


# ---------------------------------------------------------------- arrangement

music = np.zeros((N, 2))
drums = np.zeros((N, 2))
sfx = np.zeros((N, 2))

# Am – F – C – G, one bar (2 s) each, from the drop; outro resolves on C.
CHORDS = [
    [57, 60, 64, 71],  # Am(add9-ish voicing)
    [53, 57, 60, 67],  # F(add9)
    [48, 55, 60, 64],  # C
    [55, 59, 62, 69],  # G(add9)
]
ROOTS = [33, 29, 36, 31]  # bass roots (A1, F1, C2, G1)

# Intro pad: Am swell under the opener
add(music, 0, pad_chord([57, 60, 64, 71], DROP + 0.4, bright=0.6), 1.0)

bar = 2.0
t = DROP
i = 0
while t < END_DRUMS - 1e-6:
    length = min(bar, END_DRUMS - t)
    c = i % 4
    add(music, int(t * SR), pad_chord(CHORDS[c], length + 0.35), 0.42)
    # Bass: eighth notes on the root, octave jump on the last eighth
    for e in range(int(round(length / (BEAT / 2)))):
        f = midi(ROOTS[c] + (12 if e == 7 else 0))
        add(music, int((t + e * BEAT / 2) * SR), bass_note(f, BEAT / 2), 0.36)
    t += bar
    i += 1

# Outro chord: C major with added 9, long tail
add(music, int(END_DRUMS * SR), pad_chord([48, 55, 60, 64, 74], DUR - END_DRUMS, bright=0.8), 0.55)

# Drums from the drop to the final hit
nb = int(round((END_DRUMS - DROP) / BEAT))
for b in range(nb):
    tb = DROP + b * BEAT
    add(drums, int(tb * SR), kick(), 0.72)
    add(drums, int((tb + BEAT / 2) * SR), hat(open_=True), 0.16, pan=0.25)
    add(drums, int((tb + BEAT / 4) * SR), hat(), 0.10, pan=-0.3)
    add(drums, int((tb + 3 * BEAT / 4) * SR), hat(), 0.10, pan=-0.3)
    if b % 2 == 1:
        add(drums, int(tb * SR), clap(), 0.5)

# Sidechain-style ducking of the music under every kick
duck = np.ones(N)
for b in range(nb):
    s = int((DROP + b * BEAT) * SR)
    d = np.arange(int(0.25 * SR)) / SR
    seg = 1 - 0.45 * np.exp(-d / 0.09)
    duck[s : s + len(seg)] = np.minimum(duck[s : s + len(seg)], seg[: N - s])
music *= duck[:, None]

# Opener: "Heben." lift tone, "Schieben." whoosh, "Öffnen." soft hit
lift = np.sin(2 * np.pi * np.cumsum(np.linspace(180, 360, int(0.4 * SR))) / SR) * env_ad(int(0.4 * SR), 0.05, 0.15)
add(sfx, f2s(0), lift, 0.45)                       # "Heben." — sashes lift
add(sfx, f2s(12), whoosh(1.1), 1.6, pan=0.3)        # "Schieben." — slide peaks ~f30
add(sfx, f2s(45), clack(), 0.8)                     # sash lowers and locks
add(sfx, f2s(47), pluck(midi(76)), 0.4, pan=-0.2)   # "Öffnen." lands
add(sfx, f2s(60), pluck(midi(81)), 0.32, pan=0.2)   # red frame starts
# Riser into the drop
add(sfx, f2s(SCENE_START["titel"]) - int(1.4 * SR), riser(1.4), 0.8)

# Every pane slide: whoosh sweeping right → left, clack when the sash locks
for key, start in SCENE_START.items():
    if key == "opener":
        continue
    w = whoosh()
    n_w = len(w)
    pan = np.linspace(0.7, -0.7, n_w)
    s0 = f2s(start) - int(0.1 * SR)
    for ch, fn in ((0, np.cos), (1, np.sin)):
        ang = (pan + 1) * np.pi / 4
        e = min(N, s0 + n_w)
        sfx[s0:e, ch] += (w * fn(ang))[: e - s0] * 0.85
    add(sfx, f2s(start + TRANSITION), clack(), 0.42, pan=-0.5)

for fr in SNAPS:
    add(sfx, f2s(fr), snap(), 0.35, pan=-0.3)
for k, fr in enumerate(TICKS):
    add(sfx, f2s(fr), tick(2400 if k % 2 else 2000), 0.13, pan=0.35 if k % 2 else -0.35)
for k, fr in enumerate(TINKS):
    add(sfx, f2s(fr), tink(midi(88 + 2 * k)), 0.12, pan=-0.3 + 0.3 * k)
for fr, length in MINI_WHOOSH:
    add(sfx, f2s(fr), whoosh(length), 0.45, pan=0.2)
for fr in LOCKS:
    add(sfx, f2s(fr), clack(), 0.3, pan=0.4)
for a_fr, b_fr in MOTOR:
    add(sfx, f2s(a_fr), motor((b_fr - a_fr) / FPS), 0.5, pan=0.45)

# Title counters: accelerating ticks while 00 → 74 / 84 count up
for k in range(18):
    p = k / 17
    fr = SCENE_START["titel"] + 6 + 30 * (1 - (1 - p) ** 2)
    add(sfx, f2s(fr), tick(2200 + 900 * p), 0.16, pan=-0.4 if k % 2 else 0.4)

# Value landings
for fr, idx in PLUCKS:
    sec = fr / FPS
    chord = [48, 55, 60, 64] if sec >= END_DRUMS else CHORDS[max(0, int((sec - DROP) // bar)) % 4]
    note = chord[idx % 4] + 12
    add(sfx, f2s(fr), pluck(midi(note)), 0.2, pan=0.0)

# Final impact with the outro
add(sfx, f2s(SCENE_START["outro"] + TRANSITION), impact(), 0.55)

# ---------------------------------------------------------------- mix

mix = reverb(music, 2.6, 0.3) * 0.8 + drums * 0.75 + reverb(sfx, 1.6, 0.18) * 0.9

# Fade in/out
fade_in = np.minimum(1, t_all / 0.05)
fade_out = np.clip((DUR - t_all) / 1.2, 0, 1)
mix *= (fade_in * fade_out)[:, None]

# Gentle bus limiter, then normalise: peak -1 dBFS minus headroom (≈ -14 LUFS)
mix = np.tanh(mix * 1.1)
mix *= 10 ** (-3 / 20) / np.max(np.abs(mix))

out = Path(__file__).resolve().parents[3] / "remotion" / "public" / "quinline" / "soundtrack.wav"
out.parent.mkdir(parents=True, exist_ok=True)
pcm = (mix * 32767).astype("<i2")
with wave.open(str(out), "wb") as w:
    w.setnchannels(2)
    w.setsampwidth(2)
    w.setframerate(SR)
    w.writeframes(pcm.tobytes())
print(out)
