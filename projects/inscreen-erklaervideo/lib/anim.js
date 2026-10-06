// Bewegungs-Helfer: IK-Greifen, Gehen, Flugbahnen, Text-Overlays, SFX-Cues, Übergänge.
(function () {
  const { S, G, C, rng } = window.SVGK;
  const O0 = { svgOrigin: "0 0" };
  const deg = (r) => (r * 180) / Math.PI;

  // 2-Gelenk-IK. Schulter in Weltkoordinaten, Ziel in Weltkoordinaten. bend: +1/-1 (Ellbogen-Seite)
  function ik(shoulder, target, l1, l2, bend) {
    const dx = target.x - shoulder.x, dy = target.y - shoulder.y;
    let d = Math.hypot(dx, dy);
    d = Math.min(d, (l1 + l2) * 0.995);
    d = Math.max(d, Math.abs(l1 - l2) + 1);
    const phi = Math.atan2(dy, dx);
    const a = Math.acos((l1 * l1 + d * d - l2 * l2) / (2 * l1 * d));
    const b = Math.acos((l1 * l1 + l2 * l2 - d * d) / (2 * l1 * l2));
    const up = phi - bend * a;
    const fore = up + bend * (Math.PI - b);
    return [deg(up) - 90, deg(fore - up)];
  }

  // Arm-Längen/Schulterpunkte der Figuren (lokal, vor Skalierung)
  const RIG = {
    anna: { armL: { sx: -47, sy: -380, l1: 78, l2: 72 + 14 }, armR: { sx: 47, sy: -380, l1: 78, l2: 72 + 14 } },
    ben: { armL: { sx: -62, sy: -440, l1: 92, l2: 86 + 17 }, armR: { sx: 62, sy: -440, l1: 92, l2: 86 + 17 } },
  };

  // Greifen: root = Weltposition der Figur (Füße) zu diesem Zeitpunkt, s = Skalierung
  function reach(tl, t, ch, side, target, root, s, bend, dur, ease) {
    const r = RIG[ch.name][side];
    const sh = { x: root.x + r.sx * s, y: root.y + r.sy * s };
    const [u, f] = ik(sh, target, r.l1 * s, r.l2 * s, bend === undefined ? (side === "armR" ? -1 : 1) : bend);
    const p = {};
    p[side] = [u, f];
    ch.pose(tl, t, p, dur === undefined ? 0.3 : dur, ease);
    return [u, f];
  }

  // Gehen (Seitwärts-Gang in 3/4-Ansicht): Beine pendeln, Körper wippt.
  function walk(tl, ch, t0, dur, o) {
    o = o || {};
    const step = o.step || 0.32;
    const n = Math.max(1, Math.round(dur / step));
    const sw = o.swing || 16;
    for (let i = 0; i < n; i++) {
      const t = t0 + i * step;
      const sgn = i % 2 ? 1 : -1;
      tl.to(ch.legL.u, Object.assign({ rotation: sw * sgn, duration: step, ease: "sine.inOut" }, O0), t);
      tl.to(ch.legR.u, Object.assign({ rotation: -sw * sgn, duration: step, ease: "sine.inOut" }, O0), t);
      tl.to(ch.legL.f, Object.assign({ rotation: sgn > 0 ? 0 : 14, duration: step, ease: "sine.inOut" }, O0), t);
      tl.to(ch.legR.f, Object.assign({ rotation: sgn > 0 ? 14 : 0, duration: step, ease: "sine.inOut" }, O0), t);
      tl.to(ch.lean, { y: -7, duration: step / 2, ease: "sine.out", yoyo: true, repeat: 1 }, t);
    }
    const te = t0 + n * step;
    tl.to([ch.legL.u, ch.legR.u, ch.legL.f, ch.legR.f], Object.assign({ rotation: 0, duration: 0.18, ease: "power2.out" }, O0), te);
    return te;
  }

  // Flugbahn über Weltpunkte (MotionPath), Ausrichtung nach Flugrichtung optional
  function fly(tl, m, t, pts, dur, ease, curv) {
    tl.to(m.root, { motionPath: { path: pts, curviness: curv === undefined ? 1.25 : curv }, duration: dur, ease: ease || "sine.inOut" }, t);
    return t + dur;
  }

  // ---------- HTML-Overlay-Text ----------
  function el(tag, cls, parent, html) {
    const e = document.createElement(tag);
    if (cls) e.className = cls;
    if (html !== undefined) e.innerHTML = html;
    (parent || document.getElementById("hud")).appendChild(e);
    return e;
  }

  // Wort-für-Wort-Reveal (deterministisch, ohne SplitText-Abhängigkeit)
  function words(container, text, wordCls) {
    container.innerHTML = "";
    return text.split(" ").map((w, i, arr) => {
      const sp = document.createElement("span");
      sp.className = wordCls || "w";
      sp.textContent = w;
      container.appendChild(sp);
      if (i < arr.length - 1) container.appendChild(document.createTextNode(" "));
      return sp;
    });
  }

  // ---------- SFX-Cues (werden vom Mixer ausgelesen) ----------
  window.SFX_CUES = window.SFX_CUES || [];
  function sfx(t, name, gain, opts) {
    window.SFX_CUES.push(Object.assign({ t: Math.round(t * 1000) / 1000, name, gain: gain === undefined ? 0 : gain }, opts || {}));
  }

  // ---------- Partikel ----------
  function burst(tl, parent, x, y, t, o) {
    o = o || {};
    const r = rng(o.seed || Math.round(t * 100));
    const n = o.n || 8;
    const g = S("g", { opacity: 0 }, parent);
    const parts = [];
    for (let i = 0; i < n; i++) {
      const a = (i / n) * Math.PI * 2 + r() * 0.4;
      const len = (o.len || 34) * (0.7 + r() * 0.6);
      const ln = S("line", { x1: x, y1: y, x2: x, y2: y, stroke: o.color || C.yellow, "stroke-width": o.w || 6, "stroke-linecap": "round" }, g);
      parts.push([ln, a, len]);
    }
    tl.set(g, { opacity: 1 }, t);
    const R0 = o.r0 || 18;
    parts.forEach(([ln, a, len]) => {
      const cx = Math.cos(a), cy = Math.sin(a);
      tl.fromTo(ln, { attr: { x1: x + cx * R0, y1: y + cy * R0, x2: x + cx * R0, y2: y + cy * R0 } }, { attr: { x1: x + cx * (R0 + len * 0.6), y1: y + cy * (R0 + len * 0.6), x2: x + cx * (R0 + len * 1.4), y2: y + cy * (R0 + len * 1.4) }, duration: 0.32, ease: "power3.out" }, t);
      tl.to(ln, { attr: { x1: x + cx * (R0 + len * 1.4), y1: y + cy * (R0 + len * 1.4) }, duration: 0.16, ease: "power2.in" }, t + 0.26);
    });
    tl.set(g, { opacity: 0 }, t + 0.45);
    return g;
  }

  // Wind-/Bewegungslinien: geschwungene Linien, die sich zeichnen und wieder auflösen
  function swoosh(tl, parent, d, t, o) {
    o = o || {};
    const p = S("path", { d, stroke: o.color || "#fff", "stroke-width": o.w || 6, fill: "none", "stroke-linecap": "round", opacity: o.opacity || 0.85 }, parent);
    tl.fromTo(p, { drawSVG: "0% 0%" }, { drawSVG: "0% 100%", duration: o.dur || 0.5, ease: "power2.out" }, t);
    tl.to(p, { drawSVG: "100% 100%", duration: (o.dur || 0.5) * 0.9, ease: "power2.in" }, t + (o.hold || 0.35));
    return p;
  }

  window.ANIM = { ik, reach, walk, fly, el, words, sfx, burst, swoosh, RIG };
})();
