# /// script
# requires-python = ">=3.10"
# dependencies = ["numpy", "scipy"]
# ///
"""Eigene Musik + Sounddesign für das InScreen-Erklärvideo — komplett synthetisiert, keine Samples.

    uv run projects/inscreen-erklaervideo/scripts/audio/synth.py

Musik: verspieltes Marimba/Zupfbass/Glockenspiel-Arrangement (C-Dur, 100 BPM), Abschnitte an den
Szenenfenstern aus script/timing.json ausgerichtet. SFX: alle Namen, die ANIM.sfx() verwendet.
Schreibt assets/audio/music.wav und assets/audio/sfx/<name>.wav (48 kHz).
"""

from __future__ import annotations

import json
from pathlib import Path

import numpy as np
from scipy import signal
from scipy.io import wavfile

SR = 48000
PROJECT = Path(__file__).resolve().parents[2]
OUT = PROJECT / "assets" / "audio"
RNG = np.random.default_rng(1950)


# ---------------------------------------------------------------- Helfer
def t_axis(dur):
    return np.arange(int(dur * SR)) / SR


def midi(n):
    return 440.0 * 2 ** ((n - 69) / 12)


def env_exp(n, tau):
    return np.exp(-np.arange(n) / (tau * SR))


def adsr(n, a=0.005, r=0.05):
    e = np.ones(n)
    na, nr = max(1, int(a * SR)), max(1, int(r * SR))
    e[:na] = np.linspace(0, 1, na)
    e[-nr:] *= np.linspace(1, 0, nr)
    return e


def bp(x, lo, hi, order=2):
    sos = signal.butter(order, [lo, hi], btype="bandpass", fs=SR, output="sos")
    return signal.sosfilt(sos, x)


def lp(x, f, order=2):
    sos = signal.butter(order, f, btype="lowpass", fs=SR, output="sos")
    return signal.sosfilt(sos, x)


def hp(x, f, order=2):
    sos = signal.butter(order, f, btype="highpass", fs=SR, output="sos")
    return signal.sosfilt(sos, x)


def noise(n):
    return RNG.standard_normal(n)


def addp(*xs):
    """Summiert Mono-Arrays unterschiedlicher Länge (mit Null-Auffüllung)."""
    n = max(len(x) for x in xs)
    out = np.zeros(n)
    for x in xs:
        out[: len(x)] += x
    return out


def norm_peak(x, peak=0.9):
    m = np.max(np.abs(x)) + 1e-12
    return x * (peak / m)


def place(buf, x, t, gain=1.0, pan=0.0):
    """Mono-Klang x zur Zeit t in Stereo-Puffer buf (2, N) legen. pan -1..1 (gleiche Leistung)."""
    i = int(round(t * SR))
    if i >= buf.shape[1]:
        return
    if i < 0:
        x = x[-i:]
        i = 0
    n = min(len(x), buf.shape[1] - i)
    a = (pan + 1) * np.pi / 4
    buf[0, i:i + n] += x[:n] * gain * np.cos(a)
    buf[1, i:i + n] += x[:n] * gain * np.sin(a)


def sweep_filter(x, centers, width_oct=1.0):
    """Zeitvariabler Bandpass über STFT-Maske; centers = Mittenfrequenz je Sample (Array)."""
    f, tt, Z = signal.stft(x, fs=SR, nperseg=1024, noverlap=768)
    idx = np.clip((tt * SR).astype(int), 0, len(centers) - 1)
    c = centers[idx][None, :]
    lf = np.log2(np.maximum(f[:, None], 1.0) / c)
    mask = np.exp(-0.5 * (lf / (width_oct / 2.0)) ** 2)
    _, y = signal.istft(Z * mask, fs=SR, nperseg=1024, noverlap=768)
    return y[: len(x)]


def reverb(st, rt=1.3, wet=0.18, seed=3):
    """Einfacher Faltungshall mit synthetischer Impulsantwort (stereo dekorreliert)."""
    n = int(rt * SR)
    r = np.random.default_rng(seed)
    out = np.zeros_like(st)
    for ch in range(2):
        ir = r.standard_normal(n) * np.exp(-6.9 * np.arange(n) / n)
        ir = lp(ir, 5200)
        ir[: int(0.012 * SR)] *= np.linspace(0, 1, int(0.012 * SR))
        ir /= np.sqrt(np.sum(ir ** 2))
        out[ch] = signal.fftconvolve(st[ch], ir)[: st.shape[1]]
    return st * (1 - wet) + out * wet * 2.2


# ---------------------------------------------------------------- Instrumente
def marimba(note, dur=0.9, vel=1.0):
    f = midi(note)
    t = t_axis(dur)
    x = (np.sin(2 * np.pi * f * t) * env_exp(len(t), 0.42)
         + 0.32 * np.sin(2 * np.pi * f * 3.93 * t) * env_exp(len(t), 0.07)
         + 0.10 * np.sin(2 * np.pi * f * 9.2 * t) * env_exp(len(t), 0.02))
    click = bp(noise(len(t)), 1800, 6000) * env_exp(len(t), 0.003) * 0.25
    return (x + click) * adsr(len(t), 0.002, 0.05) * vel


def glock(note, dur=1.6, vel=1.0):
    f = midi(note)
    t = t_axis(dur)
    x = sum(a * np.sin(2 * np.pi * f * r * t) * env_exp(len(t), d)
            for r, a, d in [(1, 1.0, 0.9), (2.76, 0.35, 0.35), (5.4, 0.18, 0.15), (8.93, 0.08, 0.06)])
    return x * adsr(len(t), 0.001, 0.1) * vel


def pluck_bass(note, dur=0.7, vel=1.0):
    f = midi(note)
    n = int(dur * SR)
    N = int(SR / f)
    exc = np.zeros(n)
    burst = lp(noise(N), 900) * np.hanning(N)
    exc[:N] = burst
    g = 0.996
    a = np.zeros(N + 2)
    a[0] = 1.0
    a[N] = -g / 2
    a[N + 1] = -g / 2
    y = signal.lfilter([1.0], a, exc)
    y = lp(y, 1400)
    y += 0.5 * np.sin(2 * np.pi * f * t_axis(dur)) * env_exp(n, 0.35)  # Grundton-Stütze
    return norm_peak(y, 1.0) * adsr(n, 0.004, 0.08) * vel


def kick(vel=1.0):
    t = t_axis(0.32)
    f = 46 + 90 * np.exp(-t / 0.035)
    ph = 2 * np.pi * np.cumsum(f) / SR
    return hp(np.sin(ph) * env_exp(len(t), 0.08), 45) * vel


def shaker(vel=1.0):
    n = int(0.07 * SR)
    x = bp(noise(n), 5200, 11000) * env_exp(n, 0.018)
    x[: int(0.004 * SR)] *= np.linspace(0, 1, int(0.004 * SR))
    return x * 0.5 * vel


def snap(vel=1.0):
    n = int(0.08 * SR)
    x = bp(noise(n), 1400, 4200, 3) * env_exp(n, 0.012) + 0.6 * np.sin(2 * np.pi * 2300 * t_axis(0.08)) * env_exp(n, 0.006)
    return x * vel


def clap(vel=1.0):
    n = int(0.22 * SR)
    x = np.zeros(n)
    for k, d in enumerate([0, 0.009, 0.019]):
        i = int(d * SR)
        m = n - i
        x[i:] += bp(noise(m), 900, 3200, 2) * env_exp(m, 0.012 if k < 2 else 0.07)
    return x * vel


def pad_chord(notes, dur, vel=1.0):
    t = t_axis(dur)
    x = np.zeros(len(t))
    for nt in notes:
        f = midi(nt)
        for det in (-0.07, 0.0, 0.08):
            ff = f * 2 ** (det / 12)
            x += signal.sawtooth(2 * np.pi * ff * t + RNG.random() * 6.28)
    x = lp(x, 1100, 2)
    e = np.minimum(1, t / 0.5) * np.minimum(1, (dur - t) / 0.6).clip(0, 1)
    return x * e * vel / (3 * len(notes))


def whistle(note, dur, vel=1.0):
    f = midi(note)
    t = t_axis(dur)
    vib = 1 + 0.006 * np.sin(2 * np.pi * 5.2 * t) * np.minimum(1, t / 0.25)
    ph = 2 * np.pi * np.cumsum(f * vib) / SR
    x = np.sin(ph) + 0.12 * np.sin(2 * ph) + 0.04 * bp(noise(len(t)), f * 0.8, f * 3)
    e = np.minimum(1, t / 0.04) * np.minimum(1, (dur - t) / 0.08).clip(0, 1)
    return x * e * vel


# ---------------------------------------------------------------- Musik
CH = {  # Akkorde als MIDI (Bass, Voicing)
    "C": (36, [60, 64, 67]), "Am": (33, [57, 60, 64]), "F": (29, [57, 60, 65]), "G": (31, [59, 62, 67]),
    "Dm": (38, [57, 62, 65]), "Em": (40, [59, 64, 67]), "E": (40, [56, 59, 64]), "Bb": (34, [58, 62, 65]),
}


def compose(total, timing):
    bpm = 100
    beat = 60 / bpm
    bar = 4 * beat
    st = np.zeros((2, int((total + 3) * SR)))
    segs = {s["id"]: s for s in timing["segments"]}
    t_problem = (segs["s03"]["winStart"], segs["s04"]["winStart"])
    t_reveal = segs["s04"]["winStart"]
    t_outro = segs["s11"]["winStart"]
    t_end = segs["s11"]["end"] + 1.2  # Schlussakkord nach dem letzten Wort

    def section(t):
        if t < 1.0:
            return "intro"
        if t_problem[0] - 0.2 <= t < t_problem[1] - 0.2:
            return "problem"
        if t >= t_outro - 0.2:
            return "outro"
        return "main"

    prog = {
        "main": ["C", "Am", "F", "G", "C", "Em", "F", "G", "Am", "F", "C", "G"],
        "problem": ["Am", "Dm", "E", "Am"],
        "outro": ["F", "G", "Em", "Am", "F", "G", "C", "C"],
    }
    counters = {"main": 0, "problem": 0, "outro": 0}
    # Takt-Raster ab 0; Akkordwechsel pro Takt (Outro halbtaktig für Schwung)
    t = 0.0
    arp_pattern = [0, 2, 1, 2, 0, 2, 1, 2]
    while t < t_end:
        sec = section(t)
        if sec == "intro":
            # Auftakt: aufsteigende Marimba + Glitzer
            for k, nt in enumerate([67, 72, 76, 79]):
                place(st, marimba(nt, 0.8, 0.55), 0.1 + k * beat / 2, pan=-0.2 + k * 0.13)
            place(st, glock(84, 1.4, 0.35), 0.1 + 2 * beat, pan=0.3)
            t = 1.0  # erster Takt fällt auf das erste Wort
            continue
        lst = prog[sec]
        name = lst[counters[sec] % len(lst)]
        counters[sec] += 1
        bass, voic = CH[name]
        dur_bar = bar if sec != "outro" else bar
        # Pad
        place(st, pad_chord([v - 12 for v in voic], dur_bar + 0.3, 0.2 if sec != "problem" else 0.16), t, pan=0.0)
        # Bass: Grundton auf 1, Quinte auf 3 (im Problem-Teil hüpfender Staccato-Bass)
        if sec == "problem":
            for k, off in enumerate([0, 7, 12, 7]):
                place(st, pluck_bass(bass + off, beat * 0.55, 0.5), t + k * beat, pan=0.0)
        else:
            place(st, pluck_bass(bass, beat * 1.8, 0.55), t, pan=0.0)
            place(st, pluck_bass(bass + 7, beat * 0.9, 0.4), t + 2 * beat, pan=0.0)
            place(st, pluck_bass(bass + 12, beat * 0.45, 0.35), t + 3.5 * beat, pan=0.0)
        # Marimba-Arpeggio (Achtel), im Problem-Teil synkopiert und gedämpft
        for k in range(8):
            if sec == "problem" and k in (1, 5):
                continue
            nt = voic[arp_pattern[k]] + (12 if k in (3, 7) and sec != "problem" else 0)
            vel = 0.72 if k % 2 else 0.95
            place(st, marimba(nt, 0.6, vel), t + k * beat / 2, pan=-0.35 + 0.1 * (k % 4))
        # Percussion
        for k in range(4):
            if k in (0, 2) and sec != "problem":
                place(st, kick(0.32), t + k * beat)
            if k in (1, 3):
                place(st, snap(0.5) if sec != "outro" else clap(0.45), t + k * beat, pan=0.25)
        for k in range(8):
            place(st, shaker(0.6 if k % 2 else 0.35), t + k * beat / 2 + 0.01, pan=0.45)
        if sec == "problem":
            place(st, kick(0.3), t)
        t += dur_bar

    # Melodie-Akzente: Reveal-Glissando + Pfeif-Motiv, Outro-Motiv
    for k, nt in enumerate([60, 62, 64, 65, 67, 69, 71, 72, 74, 76]):
        place(st, glock(nt + 12, 0.9, 0.45), t_reveal + 0.55 + k * 0.045, pan=-0.4 + k * 0.08)
    motif = [(72, 0.5), (76, 0.5), (79, 1.0), (77, 0.5), (76, 0.5), (74, 1.0)]
    tt = t_reveal + 1.4
    for nt, d in motif:
        place(st, whistle(nt, d * beat * 0.95, 0.22), tt, pan=0.15)
        tt += d * beat
    tt = t_outro + 0.4
    for nt, d in [(76, 0.5), (79, 0.5), (84, 1.0), (83, 0.5), (79, 0.5), (81, 1.5), (79, 0.5), (84, 2.0)]:
        place(st, whistle(nt, d * beat * 0.95, 0.24), tt, pan=0.15)
        place(st, glock(nt, 1.0, 0.18), tt, pan=-0.2)
        tt += d * beat
    # Schlussakkord + Glitzer
    for nt in [48, 60, 64, 67, 72, 76]:
        place(st, marimba(nt, 2.6, 0.6), t_end, pan=(nt - 62) / 30)
    place(st, pluck_bass(36, 2.4, 0.5), t_end)
    for k, nt in enumerate([84, 88, 91, 96]):
        place(st, glock(nt, 2.0, 0.3), t_end + 0.05 + k * 0.06, pan=0.3)

    st = st[:, : int(total * SR)]
    st = reverb(st, 1.4, 0.2)
    # weiches Ausblenden am Ende
    nf = int(1.2 * SR)
    st[:, -nf:] *= np.linspace(1, 0, nf) ** 1.5
    st = hp(st, 55)
    st = st - 0.45 * lp(st, 170)  # Low-Shelf ca. -5 dB: leicht und luftig statt wummernd
    return norm_peak(st, 0.8)


# ---------------------------------------------------------------- SFX
def sfx_whoosh(dur=0.5, lo=300, hi=3200, end=900):
    n = int(dur * SR)
    t = np.linspace(0, 1, n)
    c = np.where(t < 0.55, lo * (hi / lo) ** (t / 0.55), hi * (end / hi) ** ((t - 0.55) / 0.45))
    x = sweep_filter(noise(n), c, 1.4)
    e = np.sin(np.pi * np.clip(t, 0, 1)) ** 1.6
    return x * e


def sfx_pop():
    t = t_axis(0.12)
    f = 260 + 520 * np.exp(-t / 0.018)
    x = np.sin(2 * np.pi * np.cumsum(f) / SR) * env_exp(len(t), 0.03)
    x += 0.3 * bp(noise(len(t)), 2000, 6000) * env_exp(len(t), 0.003)
    return x


def sfx_click():
    n = int(0.06 * SR)
    x = np.zeros(n)
    for d, f, a in [(0, 3200, 1.0), (0.006, 4600, 0.7)]:
        i = int(d * SR)
        m = n - i
        x[i:] += a * bp(noise(m), f * 0.7, f * 1.4) * env_exp(m, 0.0025)
    x += 0.4 * np.sin(2 * np.pi * 180 * t_axis(0.06)) * env_exp(n, 0.012)
    return x


def sfx_clunk():
    t = t_axis(0.3)
    x = 0.9 * np.sin(2 * np.pi * (85 + 40 * np.exp(-t / 0.02)) * t) * env_exp(len(t), 0.08)
    x += 0.5 * bp(noise(len(t)), 400, 1100) * env_exp(len(t), 0.03)
    x += 0.35 * bp(noise(len(t)), 3000, 7000) * env_exp(len(t), 0.004)
    return x


def sfx_thud():
    t = t_axis(0.35)
    x = np.sin(2 * np.pi * (55 + 50 * np.exp(-t / 0.03)) * t) * env_exp(len(t), 0.1)
    x += 0.35 * lp(noise(len(t)), 600) * env_exp(len(t), 0.05)
    return x


def sfx_slide(dur=1.2):
    n = int(dur * SR)
    t = np.linspace(0, 1, n)
    x = bp(noise(n), 180, 1600) * (0.6 + 0.4 * np.sin(2 * np.pi * 22 * t_axis(dur)) ** 2)
    x += 0.3 * bp(noise(n), 2000, 5000) * 0.3
    e = np.minimum(1, t / 0.12) * np.minimum(1, (1 - t) / 0.18)
    return x * e ** 1.2


def sfx_zip(dur=0.9):
    n = int(dur * SR)
    t = t_axis(dur)
    rate = 70 * (1 - 0.6 * (t / dur))  # Falten-Ticks werden langsamer
    ph = np.cumsum(rate) / SR
    ticks = (np.sin(2 * np.pi * ph) > 0.92).astype(float)
    x = bp(noise(n), 2200, 7500) * (0.35 + ticks)
    x += 0.4 * bp(noise(n), 500, 1500)
    e = np.minimum(1, t / 0.05) * np.minimum(1, (dur - t) / 0.12).clip(0, 1)
    return x * e


def sfx_boing():
    t = t_axis(0.6)
    f = 210 * (1 + 0.35 * np.exp(-t / 0.25) * np.sin(2 * np.pi * 11 * t)) * (1 + 0.25 * t)
    x = np.sin(2 * np.pi * np.cumsum(f) / SR) * env_exp(len(t), 0.2)
    x += 0.25 * np.sin(4 * np.pi * np.cumsum(f) / SR) * env_exp(len(t), 0.1)
    return x * adsr(len(t), 0.003, 0.08)


def sfx_bonk():
    t = t_axis(0.25)
    f = 430 + 160 * np.exp(-t / 0.02)
    x = np.sin(2 * np.pi * np.cumsum(f) / SR) * env_exp(len(t), 0.05)
    x += 0.4 * np.sin(2 * np.pi * np.cumsum(f * 2.7) / SR) * env_exp(len(t), 0.02)
    x += 0.3 * bp(noise(len(t)), 800, 2500) * env_exp(len(t), 0.006)
    return x


def sfx_trip():
    t = t_axis(0.32)
    f = 380 * (2.4 ** (t / 0.32))
    return whistle_like(f) * np.sin(np.pi * t / 0.32) ** 0.7


def whistle_like(fcurve):
    ph = 2 * np.pi * np.cumsum(fcurve) / SR
    return np.sin(ph) + 0.15 * np.sin(2 * ph)


def sfx_stars():
    out = np.zeros(int(1.0 * SR))
    for k, nt in enumerate([96, 100, 103, 100, 96]):
        g = glock(nt, 0.6, 0.6)
        i = int(k * 0.09 * SR)
        out[i:i + len(g)] += g[: len(out) - i]
    return out


def sfx_drill(dur=1.2):
    t = t_axis(dur)
    n = len(t)
    rev = np.clip(np.minimum(t / 0.18, 1) * np.minimum((dur - t) / 0.25, 1), 0, 1)
    f = 95 + 75 * rev + 6 * np.sin(2 * np.pi * 9 * t)
    ph = 2 * np.pi * np.cumsum(f) / SR
    x = signal.sawtooth(ph) * 0.6 + 0.4 * signal.square(ph * 3.01)
    x = bp(x, 300, 4200) + 0.25 * bp(noise(n), 1500, 6000) * (0.6 + 0.4 * np.sin(2 * np.pi * 37 * t))
    return x * rev ** 0.6


def sfx_ding():
    return addp(glock(88, 1.6, 1.0), 0.4 * glock(95, 1.2, 0.6))


def sfx_sparkle():
    out = np.zeros(int(1.4 * SR))
    for k, nt in enumerate([84, 88, 91, 96, 100]):
        g = glock(nt, 1.0, 0.55 + 0.08 * k)
        i = int(k * 0.055 * SR)
        out[i:i + len(g)] += g[: len(out) - i]
    return out


def sfx_tap():
    t = t_axis(0.05)
    return np.sin(2 * np.pi * 1700 * t) * env_exp(len(t), 0.008) + 0.3 * bp(noise(len(t)), 3000, 8000) * env_exp(len(t), 0.002)


def mosquito_voice(dur, f0, seed):
    r = np.random.default_rng(seed)
    t = t_axis(dur)
    wob = np.cumsum(r.standard_normal(len(t))) / SR * 30
    wob = lp(wob, 6)
    f = f0 * (1 + 0.04 * np.sin(2 * np.pi * (5 + r.random() * 3) * t) + 0.03 * wob)
    ph = 2 * np.pi * np.cumsum(f) / SR
    x = signal.sawtooth(ph) * 0.7 + 0.3 * signal.sawtooth(ph * 2.002)
    x = bp(x, 450, 5000)
    am = 0.7 + 0.3 * np.sin(2 * np.pi * (2 + r.random() * 2) * t + r.random() * 6)
    return x * am


def sfx_buzzIn(dur=3.5):
    n = int(dur * SR)
    st = np.zeros((2, n))
    for k, (f0, pan_rate) in enumerate([(560, 0.7), (640, 1.1), (600, 0.9)]):
        v = mosquito_voice(dur, f0, 10 + k)
        t = t_axis(dur)
        pan = 0.7 * np.sin(2 * np.pi * pan_rate * t / dur * 2 + k * 2)
        a = (pan + 1) * np.pi / 4
        st[0] += v * np.cos(a)
        st[1] += v * np.sin(a)
    t = np.linspace(0, 1, n)
    e = np.minimum(1, t / 0.15) * np.minimum(1, (1 - t) / 0.12)
    return st * e


def sfx_buzzShort():
    dur = 0.9
    t = t_axis(dur)
    v = mosquito_voice(dur, 620, 77) * (1 - 0.15 * t)
    e = np.sin(np.pi * t / dur) ** 0.8
    return v * e


def sfx_breeze(dur=1.8):
    n = int(dur * SR)
    t = np.linspace(0, 1, n)
    c = 500 + 700 * np.sin(np.pi * t) + 150 * np.sin(2 * np.pi * 3 * t)
    x = sweep_filter(noise(n), c, 1.8)
    return x * np.sin(np.pi * t) ** 1.4


def sfx_breathIn():
    n = int(0.7 * SR)
    t = np.linspace(0, 1, n)
    x = sweep_filter(noise(n), 700 + 900 * t, 1.6)
    return x * np.sin(np.pi * t * 0.9) ** 1.2


def sfx_robot(dur=1.4):
    t = t_axis(dur)
    x = 0.5 * np.sin(2 * np.pi * 118 * t) + 0.25 * np.sin(2 * np.pi * 236 * t) + 0.25 * bp(noise(len(t)), 900, 3500) * (0.6 + 0.4 * np.sin(2 * np.pi * 31 * t))
    e = np.minimum(1, t / 0.15) * np.minimum(1, (dur - t) / 0.3).clip(0, 1)
    return x * e


def sfx_beep():
    out = np.zeros(int(0.32 * SR))
    for d, f in [(0, 1250), (0.14, 1650)]:
        t = t_axis(0.1)
        b = np.sin(2 * np.pi * f * t) * adsr(len(t), 0.003, 0.03)
        i = int(d * SR)
        out[i:i + len(b)] += b
    return out


def sfx_roll(dur=1.3):
    n = int(dur * SR)
    t = t_axis(dur)
    x = lp(noise(n), 380) * 1.4 + 0.3 * bp(noise(n), 800, 2000) * (np.sin(2 * np.pi * 9 * t) > 0.9)
    e = np.minimum(1, t / 0.2) * np.minimum(1, (dur - t) / 0.3).clip(0, 1)
    return x * e


def sfx_stamp():
    return sfx_thud() * 0.8 + np.pad(bp(noise(int(0.08 * SR)), 1000, 4000) * env_exp(int(0.08 * SR), 0.01), (0, int(0.27 * SR)))[: int(0.35 * SR)]


def sfx_box():
    n = int(0.6 * SR)
    t = t_axis(0.6)
    x = 0.6 * np.pad(sfx_thud(), (0, n - int(0.35 * SR)))
    x += 0.5 * bp(noise(n), 700, 3000) * env_exp(n, 0.18) * (0.5 + 0.5 * np.sin(2 * np.pi * 13 * t) ** 2)
    return x


def sfx_scribble():
    n = int(0.6 * SR)
    t = t_axis(0.6)
    am = (np.sin(2 * np.pi * 7 * t) ** 2) * (0.6 + 0.4 * np.sin(2 * np.pi * 2.3 * t))
    return bp(noise(n), 1200, 4500) * am * adsr(n, 0.01, 0.08)


SFX = {
    "whoosh": lambda: sfx_whoosh(0.55, 260, 3400, 800),
    "whooshSoft": lambda: sfx_whoosh(0.8, 200, 1800, 500) * 0.8,
    "swish": lambda: sfx_whoosh(0.22, 900, 5200, 2400),
    "pop": sfx_pop, "click": sfx_click, "clunk": sfx_clunk, "thud": sfx_thud,
    "slide": sfx_slide, "zip": sfx_zip, "magnet": None, "boing": sfx_boing, "bonk": sfx_bonk,
    "trip": sfx_trip, "drill": sfx_drill, "ding": sfx_ding, "sparkle": sfx_sparkle, "tap": sfx_tap,
    "buzzIn": sfx_buzzIn, "buzzShort": sfx_buzzShort, "breeze": sfx_breeze, "breathIn": sfx_breathIn,
    "robot": sfx_robot, "beep": sfx_beep, "roll": sfx_roll, "magnet2": None, "stamp": sfx_stamp,
    "box": sfx_box, "scribble": sfx_scribble, "stars": sfx_stars,
}
# Längen-variable Klänge (bekommen {dur} aus dem Cue)
VARIABLE = {"slide": sfx_slide, "zip": sfx_zip, "drill": sfx_drill, "buzzIn": sfx_buzzIn, "robot": sfx_robot, "roll": sfx_roll, "breeze": sfx_breeze}


def magnet():
    knock = sfx_thud()[: int(0.12 * SR)] * 0.55
    c = sfx_click()
    out = np.zeros(int(0.2 * SR))
    out[: len(knock)] += knock
    out[int(0.01 * SR): int(0.01 * SR) + len(c)] += c
    return out


SFX["magnet"] = magnet
del SFX["magnet2"]


def write(path, x):
    path.parent.mkdir(parents=True, exist_ok=True)
    x = np.asarray(x, dtype=np.float64)
    if x.ndim == 2:
        x = x.T
    wavfile.write(str(path), SR, np.clip(x, -1, 1).astype(np.float32))


def main():
    timing = json.loads((PROJECT / "script" / "timing.json").read_text(encoding="utf-8"))
    total = timing["total"]
    music = compose(total, timing)
    write(OUT / "music.wav", music)
    for name, fn in SFX.items():
        x = fn()
        x = norm_peak(x, 0.9)
        write(OUT / "sfx" / f"{name}.wav", x)
    print(f"Musik {total:.2f} s + {len(SFX)} SFX geschrieben nach {OUT}")


if __name__ == "__main__":
    main()
