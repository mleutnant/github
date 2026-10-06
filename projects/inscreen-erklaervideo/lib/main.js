// Baut die Master-Timeline aus timing.js + Szenen-Modulen (scenes/sXX.js).
(function () {
  const T = window.TIMING;
  const { S, C } = window.SVGK;
  const tl = gsap.timeline({ paused: true });
  const svg = document.getElementById("scene");
  const hud = document.getElementById("hud");
  const R = { svg, hud, tl, sets: {}, huds: {}, T };
  window.R = R;

  // Kontext je Abschnitt: Fenster + Wortzeiten
  const byId = {};
  T.segments.forEach((s) => (byId[s.id] = s));
  function ctxFor(id) {
    const s = byId[id];
    const norm = (x) => x.toLowerCase().replace(/[^a-zäöüß0-9-]/g, "");
    return {
      id, seg: s, t0: s.winStart, t1: s.winEnd, dur: s.winEnd - s.winStart,
      vo0: s.start, vo1: s.end,
      // Wortzeit: w("stolperkante") -> Start des ersten Worts, das den Schlüssel enthält
      w(key, edge, nth) {
        const k = norm(key);
        const hits = s.words.filter((w) => w.k.includes(k));
        const hit = hits[nth || 0];
        if (!hit) { console.warn(`[${id}] Wort nicht gefunden: ${key}`); return s.start; }
        return edge === "e" ? hit.e : hit.s;
      },
    };
  }
  R.ctx = ctxFor;

  // gemeinsames Wohnzimmer-Set + Besetzung
  const lr = SETS.makeLivingRoom(svg, { id: "set-lr" });
  R.sets.lr = lr;
  R.anna = CHAR.makeAnna(lr.charLayer, { x: 0, y: 0, s: 0.92 }).init(tl);
  R.mIn = [
    CHAR.makeMosquito(lr.fgLayer, { tone: C.b3, mouth: "smirk" }).init(tl),
    CHAR.makeMosquito(lr.fgLayer, { tone: C.an3, mouth: "grin" }).init(tl),
    CHAR.makeMosquito(lr.fgLayer, { tone: C.b2, mouth: "smirk" }).init(tl),
  ];
  R.mOut = [
    CHAR.makeMosquito(lr.outLayer, { tone: C.b3, mouth: "smirk" }).init(tl),
    CHAR.makeMosquito(lr.outLayer, { tone: C.an3, mouth: "grin" }).init(tl),
    CHAR.makeMosquito(lr.outLayer, { tone: C.b2, mouth: "smirk" }).init(tl),
  ];
  [...R.mIn, ...R.mOut].forEach((m) => gsap.set(m.root, { x: -400, y: -400 }));

  // Szenen in Reihenfolge aufbauen
  const order = T.segments.map((s) => s.id);
  const sceneSet = {};
  order.forEach((id) => {
    const sc = (window.SCENES || {})[id];
    const h = document.createElement("div");
    h.className = "hud-layer";
    h.id = "hud-" + id;
    hud.appendChild(h);
    R.huds[id] = h;
    gsap.set(h, { visibility: "hidden" });
    if (!sc) return;
    try {
      if (sc.setup) sc.setup(R, ctxFor(id));
      sceneSet[id] = sc.set || "lr";
    } catch (e) {
      console.error(`[${id}] setup fehlgeschlagen: ${e && e.stack ? e.stack : e}`);
    }
  });
  Object.values(R.sets).forEach((st) => gsap.set(st.root, { visibility: "hidden" }));

  // Clip-Pfade für Übergänge
  const defs = svg.querySelector("defs") || S("defs", null, svg);
  function clipFor(name) {
    const st = R.sets[name];
    if (st._clip) return st._clip;
    const cp = S("clipPath", { id: "clip-" + name }, defs);
    const rect = S("rect", { x: 0, y: 0, width: 1920, height: 1080 }, cp);
    const circ = S("circle", { cx: 960, cy: 540, r: 0 }, cp);
    st.root.setAttribute("clip-path", `url(#clip-${name})`);
    st._clip = { cp, rect, circ };
    return st._clip;
  }
  const trLayer = S("g", { id: "transitions" }, svg);
  const bars = [C.yellow, C.red].map((col) => S("rect", { x: -60, y: -20, width: 34, height: 1120, fill: col, opacity: 0 }, trLayer));
  const ring = S("circle", { cx: 960, cy: 540, r: 0, fill: "none", stroke: C.yellow, "stroke-width": 16, opacity: 0 }, trLayer);
  const scanLine = S("rect", { x: -20, y: -10, width: 1960, height: 10, fill: C.yellow, opacity: 0 }, trLayer);

  // Übergangstypen (eingehende Szene -> Typ)
  const TRANS = {
    s03: { type: "wipe", dir: 1 }, s04: { type: "iris", cx: 1010, cy: 520 }, s05: { type: "scan" },
    s06: { type: "scan", up: true }, s07: { type: "wipe", dir: -1 }, s08: { type: "wipe", dir: 1 },
    s09: { type: "wipe", dir: 1 }, s11: { type: "iris", cx: 960, cy: 560 },
  };
  const D = 0.62; // Dauer eines Set-Wechsels

  function transition(prevId, id) {
    const a = sceneSet[prevId], b = sceneSet[id];
    const tb = byId[id].winStart;
    const hA = R.huds[prevId], hB = R.huds[id];
    if (!a || !b) {
      // Szene fehlt (noch) — HUD-Ebenen trotzdem sauber umschalten
      tl.set(hB, { visibility: "visible", opacity: 1 }, tb - 0.3);
      tl.set(hA, { visibility: "hidden" }, tb);
      if (b && R.sets[b]) tl.set(R.sets[b].root, { visibility: "visible" }, tb - 0.3);
      if (a && R.sets[a] && a !== b) tl.set(R.sets[a].root, { visibility: "hidden" }, tb);
      return;
    }
    if (a === b) {
      tl.to(hA, { opacity: 0, duration: 0.25, ease: "power1.in" }, tb - 0.12);
      tl.set(hA, { visibility: "hidden" }, tb + 0.14);
      tl.set(hB, { visibility: "visible", opacity: 1 }, tb - 0.12);
      return;
    }
    const tr = TRANS[id] || { type: "wipe", dir: 1 };
    const t0 = tb - D * 0.45, t1 = t0 + D;
    const clip = clipFor(b);
    tl.set(R.sets[b].root, { visibility: "visible" }, t0);
    tl.set(hB, { visibility: "visible", opacity: 1 }, t0);
    if (tr.type === "wipe") {
      const L = tr.dir > 0;
      tl.fromTo(clip.rect, { attr: { x: L ? 0 : 1920, width: 0 } }, { attr: { x: 0, width: 1920 }, immediateRender: false, duration: D, ease: "power3.inOut" }, t0);
      tl.fromTo(hB, { clipPath: L ? "inset(0% 100% 0% 0%)" : "inset(0% 0% 0% 100%)" }, { clipPath: "inset(0% 0% 0% 0%)", immediateRender: false, duration: D, ease: "power3.inOut" }, t0);
      tl.to(hA, { clipPath: L ? "inset(0% 0% 0% 100%)" : "inset(0% 100% 0% 0%)", duration: D, ease: "power3.inOut" }, t0);
      bars.forEach((bar, i) => {
        tl.set(bar, { opacity: 1 }, t0);
        tl.fromTo(bar, { x: L ? -60 - i * 46 : 1980 + i * 46 }, { x: L ? 1980 + i * 46 : -60 - i * 46, immediateRender: false, duration: D + 0.04, ease: "power3.inOut" }, t0 + i * 0.03);
        tl.set(bar, { opacity: 0 }, t1 + 0.1);
      });
    } else if (tr.type === "iris") {
      const rr = Math.hypot(Math.max(tr.cx, 1920 - tr.cx), Math.max(tr.cy, 1080 - tr.cy)) + 20;
      tl.set(clip.circ, { attr: { cx: tr.cx, cy: tr.cy } }, t0);
      tl.set(clip.rect, { attr: { width: 0 } }, t0);
      tl.fromTo(clip.circ, { attr: { r: 0 } }, { attr: { r: rr }, immediateRender: false, duration: D + 0.1, ease: "power2.inOut" }, t0);
      tl.set(ring, { attr: { cx: tr.cx, cy: tr.cy }, opacity: 1 }, t0);
      tl.fromTo(ring, { attr: { r: 0 } }, { attr: { r: rr }, immediateRender: false, duration: D + 0.1, ease: "power2.inOut" }, t0);
      tl.set(ring, { opacity: 0 }, t1 + 0.12);
      tl.fromTo(hB, { opacity: 0 }, { opacity: 1, immediateRender: false, duration: 0.3, ease: "sine.out" }, t0 + D * 0.5);
      tl.to(hA, { opacity: 0, duration: 0.3, ease: "sine.in" }, t0);
      tl.set(clip.rect, { attr: { width: 1920, x: 0 } }, t1 + 0.12);
      tl.set(clip.circ, { attr: { r: 0 } }, t1 + 0.12);
    } else if (tr.type === "scan") {
      const up = !!tr.up;
      tl.fromTo(clip.rect, { attr: { y: up ? 1080 : 0, height: 0 } }, { attr: { y: 0, height: 1080 }, immediateRender: false, duration: D, ease: "power2.inOut" }, t0);
      tl.set(scanLine, { opacity: 1 }, t0);
      tl.fromTo(scanLine, { y: up ? 1080 : -10 }, { y: up ? -10 : 1080, immediateRender: false, duration: D, ease: "power2.inOut" }, t0);
      tl.set(scanLine, { opacity: 0 }, t1);
      tl.fromTo(hB, { clipPath: up ? "inset(100% 0% 0% 0%)" : "inset(0% 0% 100% 0%)" }, { clipPath: "inset(0% 0% 0% 0%)", immediateRender: false, duration: D, ease: "power2.inOut" }, t0);
      tl.to(hA, { clipPath: up ? "inset(0% 0% 100% 0%)" : "inset(100% 0% 0% 0%)", duration: D, ease: "power2.inOut" }, t0);
    }
    tl.set(R.sets[a].root, { visibility: "hidden" }, t1 + 0.14);
    tl.set(hA, { visibility: "hidden" }, t1 + 0.14);
    ANIM.sfx(t0 + 0.05, tr.type === "iris" ? "whooshSoft" : "whoosh", -2);
  }

  // Erster Zustand
  const first = order[0];
  gsap.set(R.sets[sceneSet[first] || "lr"].root, { visibility: "visible" });
  gsap.set(R.huds[first], { visibility: "visible" });

  order.forEach((id, i) => {
    const sc = (window.SCENES || {})[id];
    if (sc && sc.build && sceneSet[id]) {
      try { sc.build(ctxFor(id), tl, R); } catch (e) { console.error(`[${id}] build fehlgeschlagen: ${e && e.stack ? e.stack : e}`); }
    }
    if (i > 0) transition(order[i - 1], id);
  });

  window.__timelines = window.__timelines || {};
  window.__timelines["inscreen-erklaervideo"] = tl;
  window.MASTER_TL = tl;
})();
