// Baut die Master-Timeline aus timing.js + Szenen-Modulen (scenes/sXX.js).
(function () {
  const T = window.TIMING;
  const { S, C, F } = window.SVGK;
  const FW = F.W, FH = F.H;
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

  // Masken für Übergänge: eingehendes und ausgehendes Set werden gegenläufig maskiert,
  // dadurch ist die Ebenen-Reihenfolge der Sets egal.
  const defs = svg.querySelector("defs") || S("defs", null, svg);
  function maskFor(name) {
    const st = R.sets[name];
    if (st._mask) return st._mask;
    const m = S("mask", { id: "mask-" + name, maskUnits: "userSpaceOnUse", x: 0, y: 0, width: FW, height: FH }, defs);
    const rect = S("rect", { x: 0, y: 0, width: FW, height: FH, fill: "#fff" }, m);
    const circ = S("circle", { cx: FW / 2, cy: FH / 2, r: 0, fill: "#fff" }, m);
    const hole = S("circle", { cx: FW / 2, cy: FH / 2, r: 0, fill: "#000" }, m);
    st.root.setAttribute("mask", `url(#mask-${name})`);
    st._mask = { m, rect, circ, hole };
    return st._mask;
  }
  Object.keys(R.sets).forEach(maskFor);
  const trLayer = S("g", { id: "transitions" }, svg);
  const bars = [C.yellow, C.red].map((col) => S("rect", { x: -60, y: -20, width: 34, height: FH + 40, fill: col, opacity: 0 }, trLayer));
  const ring = S("circle", { cx: FW / 2, cy: FH / 2, r: 0, fill: "none", stroke: C.yellow, "stroke-width": 16, opacity: 0 }, trLayer);
  const scanLine = S("rect", { x: -20, y: -10, width: FW + 40, height: 10, fill: C.yellow, opacity: 0 }, trLayer);

  // Übergangstypen (eingehende Szene -> Typ)
  const TRANS = {
    s03: { type: "wipe", dir: 1 }, s04: { type: "iris", cx: 1010, cy: 520 }, s05: { type: "scan" },
    s06: { type: "scan", up: true }, s07: { type: "wipe", dir: -1 }, s08: { type: "wipe", dir: 1 },
    s09: { type: "wipe", dir: 1 }, s11: { type: "iris", cx: 960, cy: 560 },
  };
  const D = 0.62; // Dauer eines Set-Wechsels
  const IR = { immediateRender: false };

  function transition(prevId, id) {
    const a = sceneSet[prevId], b = sceneSet[id];
    const tb = byId[id].winStart;
    const hA = R.huds[prevId], hB = R.huds[id];
    if (!a || !b) {
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
    const scT = (window.SCENES || {})[id];
    const tr = (scT && scT.trans) || TRANS[id] || { type: "wipe", dir: 1 };
    const t0 = tb - D * 0.45, t1 = t0 + D;
    const mi = maskFor(b), mo = maskFor(a);
    const E = { duration: D, ease: "power3.inOut" };
    tl.set(R.sets[b].root, { visibility: "visible" }, t0);
    tl.set(hB, { visibility: "visible", opacity: 1 }, t0);
    if (tr.type === "wipe") {
      const L = tr.dir > 0;
      tl.fromTo(mi.rect, { attr: { x: L ? 0 : FW, width: 0 } }, Object.assign({ attr: { x: 0, width: FW } }, E, IR), t0);
      tl.fromTo(mo.rect, { attr: { x: 0, width: FW } }, Object.assign({ attr: { x: L ? FW : 0, width: 0 } }, E, IR), t0);
      tl.fromTo(hB, { clipPath: L ? "inset(0% 100% 0% 0%)" : "inset(0% 0% 0% 100%)" }, Object.assign({ clipPath: "inset(0% 0% 0% 0%)" }, E, IR), t0);
      tl.fromTo(hA, { clipPath: "inset(0% 0% 0% 0%)" }, Object.assign({ clipPath: L ? "inset(0% 0% 0% 100%)" : "inset(0% 100% 0% 0%)" }, E, IR), t0);
      bars.forEach((bar, i) => {
        tl.set(bar, { opacity: 1 }, t0);
        tl.fromTo(bar, { x: L ? -60 - i * 46 : FW + 60 + i * 46 }, Object.assign({ x: L ? FW + 60 + i * 46 : -60 - i * 46 }, E, IR, { duration: D + 0.04 }), t0 + i * 0.03);
        tl.set(bar, { opacity: 0 }, t1 + 0.1);
      });
    } else if (tr.type === "iris") {
      const rr = Math.hypot(Math.max(tr.cx, FW - tr.cx), Math.max(tr.cy, FH - tr.cy)) + 20;
      const EI = { duration: D + 0.1, ease: "power2.inOut" };
      tl.set(mi.rect, { attr: { width: 0 } }, t0);
      tl.set([mi.circ, mo.hole, ring], { attr: { cx: tr.cx, cy: tr.cy } }, t0);
      tl.fromTo(mi.circ, { attr: { r: 0 } }, Object.assign({ attr: { r: rr } }, EI, IR), t0);
      tl.fromTo(mo.hole, { attr: { r: 0 } }, Object.assign({ attr: { r: rr } }, EI, IR), t0);
      tl.set(ring, { opacity: 1 }, t0);
      tl.fromTo(ring, { attr: { r: 0 } }, Object.assign({ attr: { r: rr } }, EI, IR), t0);
      tl.set(ring, { opacity: 0 }, t1 + 0.12);
      tl.fromTo(hB, { clipPath: `circle(0px at ${tr.cx}px ${tr.cy}px)` }, Object.assign({ clipPath: `circle(${Math.round(rr)}px at ${tr.cx}px ${tr.cy}px)` }, EI, IR), t0);
      tl.set(hB, { clipPath: "none" }, t1 + 0.12);
      tl.to(hA, { opacity: 0, duration: 0.18, ease: "power1.in" }, t0);
      tl.set(mi.rect, { attr: { width: FW, x: 0 } }, t1 + 0.12);
      tl.set(mi.circ, { attr: { r: 0 } }, t1 + 0.12);
    } else if (tr.type === "scan") {
      const up = !!tr.up;
      const ES = { duration: D, ease: "power2.inOut" };
      tl.fromTo(mi.rect, { attr: { y: up ? FH : 0, height: 0 } }, Object.assign({ attr: { y: 0, height: FH } }, ES, IR), t0);
      tl.fromTo(mo.rect, { attr: { y: 0, height: FH } }, Object.assign({ attr: { y: up ? 0 : FH, height: 0 } }, ES, IR), t0);
      tl.set(scanLine, { opacity: 1 }, t0);
      tl.fromTo(scanLine, { y: up ? FH : -10 }, Object.assign({ y: up ? -10 : FH }, ES, IR), t0);
      tl.set(scanLine, { opacity: 0 }, t1);
      tl.fromTo(hB, { clipPath: up ? "inset(100% 0% 0% 0%)" : "inset(0% 0% 100% 0%)" }, Object.assign({ clipPath: "inset(0% 0% 0% 0%)" }, ES, IR), t0);
      tl.fromTo(hA, { clipPath: "inset(0% 0% 0% 0%)" }, Object.assign({ clipPath: up ? "inset(0% 0% 100% 0%)" : "inset(100% 0% 0% 0%)" }, ES, IR), t0);
    }
    // ausgehendes Set verstecken und Maske zurücksetzen
    tl.set(R.sets[a].root, { visibility: "hidden" }, t1 + 0.14);
    tl.set(hA, { visibility: "hidden" }, t1 + 0.14);
    tl.set(mo.rect, { attr: { x: 0, y: 0, width: FW, height: FH } }, t1 + 0.16);
    tl.set(mo.hole, { attr: { r: 0 } }, t1 + 0.16);
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

  window.MASTER_TL = tl; // Registrierung in index.html / vertical.html
})();
