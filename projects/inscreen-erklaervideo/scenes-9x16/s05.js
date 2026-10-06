// s05 (9:16) — „Sein Rahmen sitzt im Festflügel und in der Schwelle.“
// Röntgenblick auf DIESELBE QuinLine®-Tür: weiße Blueprint-Linien, der InScreen-Rahmen leuchtet gelb
// auf und zeichnet sich nach, das Profil im Festflügel pulsiert („Festflügel“-Label sitzt auf dem
// Festflügel), dann zoomt die Kamera auf die Schwelle: Schwelle oben, Lupe mit Querschnitt darunter,
// Bildunterschrift „Schwelle | Führungsschiene eingelassen“ unter der Lupe. Das Festflügel-Label
// gleitet beim Zoom mit dem Profil nach oben (bleibt angedockt) — gestapelte Labels, nichts daneben.
(function () {
  // Tür-Linienzeichnung in lokalen Koordinaten 900×700, im Layout bei FB. Die Szenen-Kamera startet
  // auf der Bildlage der Wohnzimmer-Tür am Ende von s04 und gleitet nach dem Scan ins Layout (build).
  const W = 900, H = 700, FT = 24, TH = 20;
  const FB = { x: 105, y: 446, s: 0.97 }; // Layout: Tür x 105–978, y 446–1125
  const PXL = 466; // Profil-Mitte (lokal)
  const LEADL = 150; // Festflügel-Hinweislinie (lokale Höhe am Profil, Phase A)
  // Kamera-Ziel „Schwelle“: Profil-Fuß/Schwelle (lokal) landet bei SCR, Gesamt-Zoom Z
  const Z = 2.1, FOC = { x: PXL, y: 685 }, SCR = { x: 420, y: 520 };
  const DRIFT = 1.025; // leichter Push-in vor der Fahrt (Zentrum = Label-Anker am Profil)
  const CHIP_RB = 336, LEAD_B = 330; // Festflügel-Label nach dem Zoom (rechte Kante / Mitte)
  const LENS = { x: 540, y: 922, r: 300 }; // Lupe unter der Schwelle
  const LK = LENS.r / 250; // Lupen-Inhalt ist auf r = 250 gezeichnet
  const CALL = { x: 650, y: SCR.y, r: 46 }; // Detailkreis auf der unteren Führungsschiene (nach dem Zoom)
  const CAP_Y = 1246; // Bildunterschrift unter der Lupe
  const rp = (x0, y0, x1, y1) => `M${x0},${y0} H${x1} V${y1} H${x0} Z`;

  // Tür als Linienzeichnung (lokale Türkoordinaten 900×700, Geometrie wie lib/door.js, Flügel offen)
  function doorLines(gMain, gThin, gHidden, gPleat) {
    const { S } = SVGK;
    const P = (g, d) => S("path", { d }, g);
    // Blendrahmen + Schwelle
    P(gMain, rp(0, 0, W, H));
    P(gMain, rp(FT, FT, W - FT, H - TH));
    P(gThin, `M0,${H - TH} H${FT} M${W - FT},${H - TH} H${W} M${FT},${H - TH + 13} H${W - FT}`);
    // Festflügel (hinter dem Schiebeflügel → verdeckte Kanten gestrichelt)
    P(gHidden, rp(54, 54, 428, 650));
    // Schiebeflügel, offen über dem Festflügel
    P(gMain, rp(34, FT, 468, H - TH));
    P(gMain, rp(70, 60, 432, 644));
    P(gThin, "M104,236 L236,104 M128,292 L292,128 M330,610 L410,530");
    S("rect", { x: 441, y: 348, width: 18, height: 32, rx: 6 }, gMain); // HST-Griff
    S("rect", { x: 443, y: 268, width: 14, height: 104, rx: 7 }, gMain);
    // InScreen (erst weiß, später gelb nachgezeichnet)
    P(gMain, rp(458, FT, 876, 36)); // obere Führungsschiene
    P(gMain, rp(458, 36, 474, 680)); // Integrationsprofil
    S("rect", { x: 858, y: 36, width: 18, height: 644, rx: 3 }, gMain); // Griffleiste
    S("rect", { x: 863, y: 322, width: 8, height: 70, rx: 4 }, gMain);
    P(gThin, rp(458, 680, 876, 690)); // untere Führungsschiene (in der Schwelle)
    // Plissee geschlossen
    if (gPleat) {
      const n = 44, plW = 386;
      for (let i = 1; i < n; i++) {
        const x = 472 + (plW / n) * i;
        S("line", { x1: x, y1: 37, x2: x, y2: 677, opacity: i % 2 ? 0.55 : 1 }, gPleat);
      }
    }
  }

  // Schraffur „/“ in einem Rechteck
  function hatch(g, xa, ya, xb, yb, step) {
    for (let c = xa + ya + step; c < xb + yb; c += step) {
      const x1 = Math.max(xa, c - yb), x2 = Math.min(xb, c - ya);
      if (x2 > x1) SVGK.S("line", { x1, y1: c - x1, x2, y2: c - x2 }, g);
    }
  }

  (window.SCENES = window.SCENES || {}).s05 = {
    set: "xray",
    setup(R, ctx) {
      const { S, G, C, rng, F } = SVGK;
      const svg = R.svg;
      const defs = svg.querySelector("defs") || S("defs", null, svg);
      const st = SETS.makeStage(svg, { id: "set-xray", dotOpacity: 0.05, gy: 760 });
      R.sets.xray = st;
      const q = (st.q = {});
      const Y = C.yellow;
      const RG = { filterUnits: "userSpaceOnUse", x: -900, y: -900, width: 2800, height: 2700 };

      // ---- defs: Glow, Scan-Band-Maske, Lupen-Clip ----
      const fW = S("filter", Object.assign({ id: "s05blur" }, RG), defs);
      S("feGaussianBlur", { stdDeviation: 6 }, fW);
      const fY = S("filter", Object.assign({ id: "s05blurY" }, RG), defs);
      S("feGaussianBlur", { stdDeviation: 7 }, fY);
      const bandG = S("linearGradient", { id: "s05band", x1: 0, y1: 0, x2: 0, y2: 1 }, defs);
      [[0, "#000"], [0.8, "#fff"], [1, "#fff"]].forEach(([o, c]) => S("stop", { offset: o, "stop-color": c }, bandG));
      const mask = S("mask", { id: "s05mask", maskUnits: "userSpaceOnUse", x: -600, y: -600, width: F.W + 1200, height: F.H + 1200 }, defs);
      q.band = S("rect", { x: -600, y: -330, width: F.W + 1200, height: 330, fill: "url(#s05band)" }, mask);
      const lc = S("clipPath", { id: "s05lensClip" }, defs);
      S("circle", { cx: 0, cy: 0, r: 247 }, lc);

      // ---- Kamera: äußere Gruppe = Verschiebung (x/y), innere = Zoom (svgOrigin 0 0) ----
      q.camT = S("g", null, st.layer);
      q.camS = S("g", null, q.camT);
      gsap.set(q.camT, { x: 0, y: 0 });
      gsap.set(q.camS, { scale: 1, svgOrigin: "0 0" });
      const cam = q.camS;

      q.bases = [];
      const base = (parent, attrs) => { const g = S("g", attrs || null, parent); q.bases.push(g); return g; };
      // Millimeterraster in der Welt (zoomt mit; Bildschirm-Koordinaten bei Zoom 1)
      q.grid = S("g", { stroke: "#fff", "stroke-width": 1, opacity: 0.045 }, cam);
      for (let x = 12 - 50 * 12; x <= F.W + 600; x += 50) S("line", { x1: x, y1: -400, x2: x, y2: F.H + 500 }, q.grid);
      for (let y = 40 - 50 * 8; y <= F.H + 500; y += 50) S("line", { x1: -600, y1: y, x2: F.W + 600, y2: y }, q.grid);

      // Boden-Linie mit Schraffur (lokale Türkoordinaten)
      const wB = base(cam);
      q.ground = S("g", { stroke: "#fff", "stroke-width": 3, opacity: 0.6, fill: "none" }, wB);
      S("line", { x1: -200, y1: H, x2: W + 200, y2: H }, q.ground);
      S("line", { x1: -200, y1: H + 30, x2: W + 200, y2: H + 30, opacity: 0.45 }, q.ground);
      q.hatch = S("g", { stroke: "#fff", "stroke-width": 2, opacity: 0.3 }, wB);
      for (let x = -168; x <= W + 200; x += 22) S("line", { x1: x, y1: H + 3, x2: x - 25, y2: H + 28 }, q.hatch);

      // Maßlinien (ohne Zahlen) — technischer Look
      q.dims = S("g", { stroke: C.b5, "stroke-width": 2, opacity: 0.75, fill: "none" }, wB);
      q.dimLines = [];
      q.dimTicks = [];
      const dl = (d) => { const p = S("path", { d }, q.dims); q.dimLines.push(p); return p; };
      const tick = (x, y) => { const p = S("path", { d: `M${x - 9},${y + 9} L${x + 9},${y - 9}`, "stroke-width": 3 }, q.dims); q.dimTicks.push(p); };
      const DY = -40, DX = -40;
      dl(`M0,${DY} H${W}`);
      dl(`M0,-10 V${DY - 14} M${PXL - 8},-10 V${DY - 14} M${W},-10 V${DY - 14}`);
      [0, PXL - 8, W].forEach((x) => tick(x, DY));
      dl(`M${DX},0 V${H}`);
      dl(`M-10,0 H${DX - 14} M-10,${H} H${DX - 14}`);
      [0, H].forEach((y) => tick(DX, y));

      // Nachglühen: (a) Band, das der Scanlinie folgt, (b) allgemeiner Glow, der abklingt
      q.glowBand = S("g", { mask: "url(#s05mask)", opacity: 1 }, cam);
      const gb = S("g", { stroke: "#dff3ff", "stroke-width": 10, fill: "none", filter: "url(#s05blur)" }, base(q.glowBand));
      doorLines(gb, gb, gb, null);
      q.glowAll = S("g", { opacity: 0.6, stroke: "#dff3ff", "stroke-width": 8, fill: "none", filter: "url(#s05blur)" }, wB);
      doorLines(q.glowAll, q.glowAll, q.glowAll, null);

      // ---- Tür-Linien ----
      const D = S("g", null, wB);
      q.D = D;
      q.fixHL = S("rect", { x: FT, y: FT, width: 458 - FT, height: H - TH - FT, fill: "#fff", opacity: 0 }, D);
      q.lines = S("g", { opacity: 1, fill: "none", stroke: "#fff", "stroke-linejoin": "round" }, D);
      q.gHidden = S("g", { "stroke-width": 2.5, "stroke-dasharray": "10 8", opacity: 0.5 }, q.lines);
      q.gPleat = S("g", { "stroke-width": 1.3, opacity: 0.55 }, q.lines);
      q.gThin = S("g", { "stroke-width": 2, opacity: 0.62 }, q.lines);
      q.gMain = S("g", { "stroke-width": 3.5 }, q.lines);
      doorLines(q.gMain, q.gThin, q.gHidden, q.gPleat);

      // ---- InScreen-Rahmen in Gelb (Glow, Füllung, Strich) ----
      const yPaths = {
        profile: "M466,36 H458 V680 H474 V36 H466", // Start oben Mitte → 50 % = Fuß
        bottom: "M876,685 V680 H458 V690 H876 V685", // 50 % = linkes Ende
        top: "M876,30 V24 H458 V36 H876 V30",
        grip: "M867,680 H858 V36 H876 V680 H867", // 50 % = oben Mitte
        handle: rp(863, 322, 871, 392),
      };
      const yRects = { profile: [458, 36, 16, 644], bottom: [458, 680, 418, 10], top: [458, 24, 418, 12], grip: [858, 36, 18, 644], handle: [863, 322, 8, 70] };
      q.yGlowG = S("g", { stroke: Y, "stroke-width": 14, fill: "none", "stroke-linejoin": "round", filter: "url(#s05blurY)", opacity: 0 }, D);
      q.yFillG = S("g", { fill: Y, opacity: 0 }, D);
      q.yStrokeG = S("g", { stroke: Y, "stroke-width": 4.5, fill: "none", "stroke-linejoin": "round" }, D);
      q.yS = {};
      q.yG = {};
      Object.keys(yPaths).forEach((k) => {
        const [x, y, w, h] = yRects[k];
        S("rect", { x, y, width: w, height: h }, q.yFillG);
        q.yG[k] = S("path", { d: yPaths[k] }, q.yGlowG);
        q.yS[k] = S("path", { d: yPaths[k] }, q.yStrokeG);
      });
      q.pFlash = S("rect", { x: 458, y: 36, width: 16, height: 644, fill: Y, opacity: 0 }, D);
      q.bFlash = S("rect", { x: 458, y: 680, width: 418, height: 10, fill: Y, opacity: 0 }, D);
      q.rings = [0, 1].map(() => {
        const g = G(D, { x: 466, y: 358 });
        S("rect", { x: -8, y: -322, width: 16, height: 644, fill: "none", stroke: Y, "stroke-width": 3, "vector-effect": "non-scaling-stroke" }, g);
        gsap.set(g, { opacity: 0, scaleX: 1, scaleY: 1, svgOrigin: "0 0" });
        return g;
      });

      // ---- Bildschirm-Ebene (zoomt nicht) ----
      const ov = S("g", null, st.layer);
      q.ov = ov;
      // Passermarken an den Ecken der Inhaltszone
      const cm = S("g", { stroke: "#fff", "stroke-width": 2, opacity: 0.35, fill: "none" }, ov);
      [[44, 214, 1, 1], [1036, 214, -1, 1], [44, 1334, 1, -1], [1036, 1334, -1, -1]].forEach(([x, y, sx, sy]) => {
        S("path", { d: `M${x},${y + sy * 44} V${y} H${x + sx * 44}` }, cm);
      });

      // Festflügel-Hinweislinie (Anker gleitet bei der Kamerafahrt am Profil mit) — Lage setzt build()
      q.fLine = S("line", { x1: 0, y1: 0, x2: 0, y2: 0, stroke: "#fff", "stroke-width": 3.5, "stroke-linecap": "round", opacity: 0 }, ov);
      const fa = S("g", null, ov);
      q.fAnchor = fa;
      q.fDotMove = S("g", null, fa); // nur x/y
      q.fDot = S("g", null, q.fDotMove); // nur scale (svgOrigin)
      S("circle", { r: 16, fill: "none", stroke: "#fff", "stroke-width": 2.5, opacity: 0.7 }, q.fDot);
      S("circle", { r: 8, fill: "#fff" }, q.fDot);
      gsap.set(q.fDot, { scale: 0, svgOrigin: "0 0" });

      // Detailkreis auf der Schwelle + Tangenten zur Lupe
      const dx = LENS.x - CALL.x, dy = LENS.y - CALL.y, dd = Math.hypot(dx, dy);
      const ux = -dx / dd, uy = -dy / dd, nx = -uy, ny = ux; // u zeigt von der Lupe zum Detailkreis
      const sn = (LENS.r - CALL.r) / dd, cs = Math.sqrt(1 - sn * sn);
      q.tangents = [1, -1].map((sg) => {
        const vx = sg * cs * nx + sn * ux, vy = sg * cs * ny + sn * uy;
        const p1 = { x: LENS.x + LENS.r * vx, y: LENS.y + LENS.r * vy }, p2 = { x: CALL.x + CALL.r * vx, y: CALL.y + CALL.r * vy };
        const ln = S("line", { x1: p2.x, y1: p2.y, x2: p2.x, y2: p2.y, stroke: "#fff", "stroke-width": 2.5, "stroke-dasharray": "9 7", opacity: 0.75 }, ov);
        ln._p1 = p1;
        return ln;
      });
      const cw = G(ov, { x: CALL.x, y: CALL.y });
      q.call = cw;
      S("circle", { r: CALL.r, fill: "#fff", opacity: 0.07 }, cw);
      S("circle", { r: CALL.r, fill: "none", stroke: "#fff", "stroke-width": 4 }, cw);
      gsap.set(cw, { scale: 0.01, svgOrigin: "0 0" });

      // ---- Lupe mit Schwellen-Querschnitt (Inhalt auf r = 250 gezeichnet, Wrapper skaliert) ----
      const lw = G(ov, { x: LENS.x, y: LENS.y, s: LK });
      q.lens = lw;
      S("circle", { r: 254, fill: "none", stroke: "#0a1f28", "stroke-width": 22, opacity: 0.5 }, lw);
      S("circle", { r: 250, fill: "#0d2732" }, lw);
      const cl = S("g", { "clip-path": "url(#s05lensClip)" }, lw);
      const lg = S("g", { stroke: "#fff", "stroke-width": 1, opacity: 0.07 }, cl);
      for (let v = -240; v <= 240; v += 30) { S("line", { x1: v, y1: -260, x2: v, y2: 260 }, lg); S("line", { x1: -260, y1: v, x2: 260, y2: v }, lg); }
      // Querschnitt vergrößert: Schwellen-Mitte (20|Y0) → Lupen-Mitte, Faktor 1,45
      const sec = S("g", { transform: "translate(0,22) scale(1.45) translate(-20,-40)" }, cl);
      const Y0 = 40, L = -300, T0 = -84, T1 = 124, RR = 300;
      const wl = { fill: "none", stroke: "#fff", "stroke-width": 2 };
      // innen: Bodenbelag, Estrich, Dämmung
      S("rect", { x: L, y: Y0, width: T0 - L, height: 16, fill: C.b2, stroke: "#fff", "stroke-width": 2 }, sec);
      const pq = S("g", { stroke: "#fff", "stroke-width": 1.2, opacity: 0.5 }, sec);
      for (let x = T0 - 40; x > L; x -= 52) S("line", { x1: x, y1: Y0 + 2, x2: x, y2: Y0 + 14 }, pq);
      S("rect", Object.assign({ x: L, y: Y0 + 16, width: T0 - L, height: 84 }, wl), sec);
      const hs = S("g", { stroke: "#fff", "stroke-width": 1.2, opacity: 0.35 }, sec);
      hatch(hs, L, Y0 + 16, T0, Y0 + 100, 14);
      S("rect", Object.assign({ x: L, y: Y0 + 100, width: T0 - L, height: 160 }, wl), sec);
      let zz = `M${L},${Y0 + 140}`;
      for (let x = L, k = 0; x < T0; x += 14, k++) zz += ` L${x + 14},${Y0 + (k % 2 ? 140 : 116)}`;
      S("path", { d: zz, fill: "none", stroke: "#fff", "stroke-width": 1.5, opacity: 0.4 }, sec);
      // außen: Terrassenplatte auf Splitt (gleiche Höhe)
      S("rect", { x: T1, y: Y0, width: RR - T1, height: 28, fill: C.b2, stroke: "#fff", "stroke-width": 2 }, sec);
      S("line", { x1: 212, y1: Y0, x2: 212, y2: Y0 + 28, stroke: "#fff", "stroke-width": 1.6, opacity: 0.7 }, sec);
      const gr = S("g", { fill: "#fff", opacity: 0.32 }, sec);
      const r = rng(505);
      for (let i = 0; i < 60; i++) S("circle", { cx: T1 + 6 + r() * (RR - T1 - 6), cy: Y0 + 36 + r() * 150, r: 1.3 + r() * 2.2 }, gr);
      // Rohbau unter Schwelle und Terrasse (Beton-Signatur)
      S("rect", { x: T0, y: Y0 + 110, width: RR - T0, height: 120, fill: "none", stroke: "#fff", "stroke-width": 1.6, opacity: 0.55 }, sec);
      const bt = S("g", { fill: "none", stroke: "#fff", "stroke-width": 1.2, opacity: 0.3 }, sec);
      const rb = rng(506);
      for (let i = 0; i < 26; i++) {
        const x = T0 + 10 + rb() * (T1 - T0 - 20), y = Y0 + 122 + rb() * 70, a = rb() * 6.28, k = 5 + rb() * 3;
        S("path", { d: `M${x + Math.cos(a) * k},${y + Math.sin(a) * k} L${x + Math.cos(a + 2.1) * k},${y + Math.sin(a + 2.1) * k} L${x + Math.cos(a + 4.2) * k},${y + Math.sin(a + 4.2) * k} Z` }, bt);
      }
      // Schwellenprofil mit eingelassener Führungsschiene (bündig)
      S("path", { d: `M${T0},${Y0} H-70 V${Y0 + 36} H-16 V${Y0} H${T1} V${Y0 + 110} H${T0} Z`, fill: C.b1, stroke: "#fff", "stroke-width": 2.6, "stroke-linejoin": "round" }, sec);
      const ch = S("g", { fill: "none", stroke: "#fff", "stroke-width": 1.5, opacity: 0.7 }, sec);
      S("rect", { x: -72, y: Y0 + 48, width: 66, height: 52 }, ch);
      S("rect", { x: 46, y: Y0 + 20, width: 66, height: 80 }, ch);
      S("rect", { x: 66, y: Y0, width: 14, height: 14 }, ch); // Laufschiene Schiebeflügel
      S("rect", { x: 4, y: Y0 + 20, width: 30, height: 80 }, ch);
      const tb = S("g", { stroke: "#fff", "stroke-width": 1.1, opacity: 0.6 }, sec);
      hatch(tb, 4, Y0 + 20, 34, Y0 + 100, 9);
      // InScreen-Teile: Führungsschiene gelb, Gleiter rot
      q.railFill = S("rect", { x: -68, y: Y0 + 1, width: 50, height: 33, fill: Y, opacity: 0.35 }, sec);
      S("path", { d: `M-68,${Y0} V${Y0 + 34} H-18 V${Y0}`, fill: "none", stroke: Y, "stroke-width": 4, "stroke-linejoin": "round" }, sec);
      S("path", { d: `M-58,${Y0} V${Y0 + 22} H-28 V${Y0}`, fill: "none", stroke: Y, "stroke-width": 2 }, sec);
      S("rect", { x: -50, y: Y0 + 6, width: 14, height: 13, rx: 2, fill: C.red }, sec);
      // Plissee steht in der Schiene
      let pz = `M-43,${Y0 + 6}`;
      for (let y = Y0 - 3, k = 0; y > -175; y -= 8, k++) pz += ` L${k % 2 ? -43 + 4 : -43 - 4},${y}`;
      q.zig = S("path", { d: pz, fill: "none", stroke: "#fff", "stroke-width": 1.8, "stroke-linejoin": "round" }, sec);
      // gleiche Höhe innen/außen: rote Niveau-Linie + Höhenmarken
      q.level = S("path", { d: `M-175,${Y0} H215`, stroke: C.red, "stroke-width": 2.4, fill: "none" }, sec);
      q.levelTri = [-120, 162].map((x) => S("path", { d: `M${x - 10},${Y0 - 20} H${x + 10} L${x},${Y0 - 3} Z`, fill: "none", stroke: C.red, "stroke-width": 2.2, "stroke-linejoin": "round" }, sec));
      S("circle", { r: 250, fill: "none", stroke: "#fff", "stroke-width": 6 }, lw);
      gsap.set(lw, { scale: 0.2, opacity: 0, svgOrigin: "0 0" });

      // ---- HUD-Texte ----
      const hud = R.huds[ctx.id];
      const css = (e, o) => Object.assign(e.style, o);
      q.title = ANIM.el("div", "t-label", hud, "Innenansicht");
      css(q.title, { left: "84px", top: "232px", color: "#fff", fontSize: "34px", opacity: 0.8 });
      q.legend = ANIM.el("div", "t-label", hud, '<span style="display:inline-block;width:64px;height:8px;border-radius:4px;background:#f6a206;vertical-align:middle;margin:-4px 18px 0 0"></span>InScreen-Rahmen');
      css(q.legend, { right: "84px", top: "232px", color: "#fff", fontSize: "34px" });
      q.fChip = ANIM.el("div", "chip", hud, '<span class="bar"></span>Festflügel');
      css(q.fChip, { fontSize: "44px", transformOrigin: "100% 50%" });
      // Bildunterschrift der Lupe: Chip + Zusatz in einer Zeile, mittig unter der Lupe
      q.cap = ANIM.el("div", null, hud);
      css(q.cap, { position: "absolute", left: LENS.x + "px", top: CAP_Y + "px", transform: "translateX(-50%)", display: "flex", alignItems: "center", gap: "24px", whiteSpace: "nowrap" });
      q.sChip = ANIM.el("div", "chip", q.cap, '<span class="bar"></span>Schwelle');
      css(q.sChip, { position: "relative", fontSize: "44px", transformOrigin: "0% 50%" });
      q.sSub = ANIM.el("div", "t-body", q.cap, "Führungsschiene eingelassen");
      css(q.sSub, { position: "relative", fontSize: "38px", lineHeight: "1.1" });
      q.inLbl = ANIM.el("div", "t-body", hud, "innen");
      css(q.inLbl, { left: LENS.x - 165 * LK + "px", top: LENS.y - 96 * LK + "px", fontSize: "34px" });
      q.outLbl = ANIM.el("div", "t-body", hud, "außen");
      css(q.outLbl, { left: LENS.x + 142 * LK + "px", top: LENS.y - 96 * LK + "px", fontSize: "34px" });
      gsap.set([q.inLbl, q.outLbl], { xPercent: -50, yPercent: -50 });
      gsap.set([q.legend, q.fChip, q.sChip, q.sSub, q.inLbl, q.outLbl], { opacity: 0 });
    },

    build(ctx, tl, R) {
      const q = R.sets.xray.q;
      const { F } = SVGK;
      const CX = F.W / 2, CY = F.H / 2;
      const t0 = ctx.t0, t1 = ctx.t1;
      const tScan = t0 - 0.62 * 0.45; // Scan-Übergang aus main.js (Start + Dauer 0,62 s)
      const tRah = ctx.w("rahmen"), tFest = ctx.w("festflügel"), tSch = ctx.w("schwelle");
      const dC = 0.54, tC = Math.max(tFest + 0.8, tSch - 0.47); // Kamera kommt auf „Schwelle“ an

      // Lage: die Blueprint-Tür steht im Layout fest bei FB. Damit der Scan nahtlos ist, startet die
      // Szenen-Kamera so, dass die Tür exakt auf der Wohnzimmer-Tür am Ende von s04 liegt (aus deren
      // letztem Kamera-Tween; Hochformat: Bild = (540, 960) + z · (Welt − Kamerapunkt)), und gleitet
      // nach dem Scan ins Layout. Ohne lesbare s04-Kamera startet sie direkt im Layout.
      const B = FB;
      const G0 = { x: 0, y: 0, s: 1 };
      try {
        const lr = R.sets.lr, last = (el) => tl.getTweensOf(el).filter((tw) => tw.startTime() < t0 - 0.05)
          .sort((a, b) => a.startTime() + a.duration() - (b.startTime() + b.duration())).pop();
        const tp = last(lr.cam.pos), ts = last(lr.cam.sc);
        const px = tp && typeof tp.vars.x === "number" ? tp.vars.x : gsap.getProperty(lr.cam.pos, "x");
        const py = tp && typeof tp.vars.y === "number" ? tp.vars.y : gsap.getProperty(lr.cam.pos, "y");
        const z = ts && typeof ts.vars.scale === "number" ? ts.vars.scale : gsap.getProperty(lr.cam.sc, "scaleX");
        const db = lr.doorBox, ds = (z * db.w) / W;
        const dx = CX + z * (db.x + px), dy = CY + z * (db.y + py);
        if (ds > 0.6 && ds < 1.5 && dx > -250 && dx < 400 && dy > 0 && dy < 900) {
          G0.s = ds / B.s; G0.x = dx - G0.s * B.x; G0.y = dy - G0.s * B.y;
        }
      } catch (e) { console.warn("[s05] Tür-Position aus s04 nicht lesbar, Kamera startet im Layout"); }
      q.bases.forEach((g) => g.setAttribute("transform", `translate(${B.x},${B.y}) scale(${B.s})`));
      gsap.set(q.camT, { x: G0.x, y: G0.y });
      gsap.set(q.camS, { scale: G0.s, svgOrigin: "0 0" });

      // Festflügel-Label: Phase A auf dem Festflügel (links vom Profil), Phase B oben links, angedockt
      const ax0 = B.x + B.s * PXL; // Profil-Mitte vor dem Zoom (Bildschirm)
      const leadA = B.y + B.s * LEADL;
      const chipRA = ax0 - 118 * B.s;
      q.fLine.setAttribute("x1", ax0); q.fLine.setAttribute("x2", ax0);
      q.fLine.setAttribute("y1", leadA); q.fLine.setAttribute("y2", leadA);
      q.fAnchor.setAttribute("transform", `translate(${ax0},${leadA})`);
      Object.assign(q.fChip.style, { right: F.W - chipRA + "px", top: leadA - 40 + "px" });
      // Kamera-Ziel: lokaler Punkt FOC → SCR bei Gesamt-Zoom Z
      const cS = Z / B.s, cX = SCR.x - cS * B.x - Z * FOC.x, cY = SCR.y - cS * B.y - Z * FOC.y;

      // 1) Linienzeichnung steht — Nachglühen hinter der Scanlinie, Maßlinien zeichnen sich
      // (Band liegt in Kamera-Koordinaten → auf die Startkamera G0 umrechnen)
      tl.fromTo(q.band, { attr: { y: (-330 * G0.s - G0.y) / G0.s, height: 330 } },
        { attr: { y: (F.H - 330 * G0.s - G0.y) / G0.s }, duration: 0.62, ease: "power2.inOut" }, tScan);
      tl.to(q.glowBand, { opacity: 0, duration: 0.5, ease: "sine.out" }, t0 + 0.28);
      tl.to(q.glowAll, { opacity: 0.12, duration: 1.0, ease: "power2.out" }, t0 + 0.05);
      tl.to(q.lines, { opacity: 0.85, duration: 0.8, ease: "sine.inOut" }, t0 + 0.1);
      tl.fromTo(q.dimLines, { drawSVG: "0% 0%" }, { drawSVG: "0% 100%", duration: 0.55, ease: "power2.out", stagger: 0.07 }, t0 - 0.05);
      tl.fromTo(q.dimTicks, { opacity: 0 }, { opacity: 1, duration: 0.2, ease: "power1.out", stagger: 0.04 }, t0 + 0.3);
      // nach dem Scan: von der s04-Türlage ins Layout gleiten, dann leichter Push-in bis zur Kamerafahrt
      // (Zentrum = Label-Anker am Profil, damit er sitzt)
      const tG = t0 + 0.3, tD = tG + 0.6;
      tl.to(q.camT, { x: 0, y: 0, duration: tD - tG, ease: "power2.inOut" }, tG);
      tl.to(q.camS, { scale: 1, svgOrigin: "0 0", duration: tD - tG, ease: "power2.inOut" }, tG);
      tl.to(q.camT, { x: ax0 * (1 - DRIFT), y: leadA * (1 - DRIFT), duration: tC - tD, ease: "sine.inOut" }, tD);
      tl.to(q.camS, { scale: DRIFT, svgOrigin: "0 0", duration: tC - tD, ease: "sine.inOut" }, tD);

      // 2) „Rahmen“: InScreen-Rahmen leuchtet gelb auf und zeichnet sich nach
      const yd = (k, t, dur, ease, mid) =>
        tl.fromTo([q.yS[k], q.yG[k]], { drawSVG: mid ? "50% 50%" : "0% 0%" }, { drawSVG: "0% 100%", duration: dur, ease }, t);
      yd("profile", tRah - 0.06, 0.36, "power2.inOut", true);
      yd("bottom", tRah + 0.08, 0.42, "power2.out", true);
      yd("top", tRah + 0.24, 0.38, "power2.inOut", true);
      yd("grip", tRah + 0.5, 0.32, "power2.inOut", true);
      yd("handle", tRah + 0.74, 0.22, "power2.out", false);
      tl.to(q.yGlowG, { opacity: 1, duration: 0.25, ease: "power2.out" }, tRah - 0.06);
      tl.to(q.yGlowG, { opacity: 0.45, duration: 0.5, ease: "sine.inOut" }, tRah + 0.95);
      tl.to(q.yFillG, { opacity: 0.2, duration: 0.45, ease: "sine.out" }, tRah + 0.3);
      ANIM.burst(tl, q.D, 466, 30, tRah + 0.27, { n: 7, len: 22, w: 4, r0: 14, seed: 551 });
      ANIM.burst(tl, q.D, 867, 686, tRah + 0.8, { n: 7, len: 22, w: 4, r0: 14, seed: 552 });
      tl.fromTo(q.legend, { opacity: 0, x: 30 }, { opacity: 1, x: 0, duration: 0.45, ease: "power3.out" }, tRah + 0.12);
      ANIM.sfx(tRah - 0.02, "sparkle", -3);
      // Glow atmet bis zum Szenenende
      const tB = tRah + 1.45, per = 0.62, nB = Math.floor((t1 - tB) / per);
      if (nB >= 1) tl.to(q.yGlowG, { opacity: 0.85, duration: per, ease: "sine.inOut", yoyo: true, repeat: nB - 1 }, tB);

      // 3) „Festflügel“: Profil pulsiert, Hinweislinie + Label auf dem Festflügel
      tl.to(q.fixHL, { opacity: 0.08, duration: 0.25, ease: "power2.out" }, tFest - 0.06);
      tl.to(q.fixHL, { opacity: 0.035, duration: 0.6, ease: "sine.inOut" }, tFest + 0.45);
      [0, 0.32].forEach((dt, i) => {
        tl.to(q.pFlash, { opacity: 0.85, duration: 0.12, ease: "power2.out" }, tFest - 0.04 + dt);
        tl.to(q.pFlash, { opacity: 0.25, duration: 0.2, ease: "sine.inOut" }, tFest + 0.08 + dt);
        tl.fromTo(q.rings[i], { scaleX: 1, scaleY: 1, opacity: 0.9, svgOrigin: "0 0" },
          { scaleX: 3.6, scaleY: 1.025, opacity: 0, duration: 0.55, ease: "power2.out", svgOrigin: "0 0", immediateRender: false }, tFest - 0.04 + dt);
      });
      tl.to(q.fDot, { scale: 1, duration: 0.3, ease: "back.out(2.5)", svgOrigin: "0 0" }, tFest - 0.08);
      tl.set(q.fLine, { opacity: 1 }, tFest - 0.06);
      tl.to(q.fLine, { attr: { x2: chipRA + 4 }, duration: 0.32, ease: "expo.out" }, tFest - 0.06);
      tl.fromTo(q.fChip, { opacity: 0, x: 26, scale: 0.85 }, { opacity: 1, x: 0, scale: 1, duration: 0.42, ease: "back.out(1.7)" }, tFest + 0.02);
      ANIM.sfx(tFest, "ding", -4);

      // 4) „Schwelle“: Kamera zoomt flott auf die Schwelle (oben im Bild), Lupe mit Querschnitt darunter
      const eC = "power3.inOut";
      tl.to(q.camT, { x: cX, y: cY, duration: dC, ease: eC }, tC);
      tl.to(q.camS, { scale: cS, svgOrigin: "0 0", duration: dC, ease: eC }, tC);
      // Strichstärken mitführen, damit die Linien beim Zoom nicht klobig werden
      [[q.gMain, 2.5], [q.gThin, 1.5], [q.gHidden, 1.6], [q.gPleat, 0.95], [q.yStrokeG, 3.2], [q.yGlowG, 9],
        [q.glowAll, 5], [q.ground, 2], [q.hatch, 1.4], [q.grid, 0.6]].forEach(([el, v]) =>
        tl.to(el, { attr: { "stroke-width": v }, duration: dC, ease: eC }, tC));
      // Festflügel-Label gleitet mit: Anker bleibt auf dem Profil, Label wandert nach oben links
      const axB = SCR.x + Z * (PXL - FOC.x); // Profil-Mitte nach dem Zoom
      tl.to(q.fLine, { attr: { x1: axB, x2: CHIP_RB + 4, y1: LEAD_B, y2: LEAD_B }, duration: dC, ease: eC }, tC);
      tl.to(q.fDotMove, { x: axB - ax0, y: LEAD_B - leadA, duration: dC, ease: eC }, tC);
      tl.to(q.fChip, { x: CHIP_RB - chipRA, y: LEAD_B - leadA, duration: dC, ease: eC }, tC);
      tl.to(q.title, { opacity: 0, duration: 0.3, ease: "power1.in" }, tC);
      ANIM.sfx(tC, "whooshSoft", -4);

      tl.to(q.bFlash, { opacity: 0.8, duration: 0.18, ease: "power2.out" }, tSch - 0.1);
      tl.to(q.bFlash, { opacity: 0.3, duration: 0.45, ease: "sine.inOut" }, tSch + 0.1);
      tl.to(q.call, { scale: 1, duration: 0.32, ease: "back.out(2)", svgOrigin: "0 0" }, tSch - 0.12);
      q.tangents.forEach((ln) => tl.to(ln, { attr: { x2: ln._p1.x, y2: ln._p1.y }, duration: 0.3, ease: "power2.out" }, tSch - 0.08));
      tl.to(q.lens, { scale: 1, opacity: 1, duration: 0.48, ease: "back.out(1.5)", svgOrigin: "0 0" }, tSch - 0.08);
      tl.fromTo(q.zig, { drawSVG: "0% 0%" }, { drawSVG: "0% 100%", duration: 0.42, ease: "power2.out" }, tSch + 0.06);
      tl.fromTo(q.level, { drawSVG: "50% 50%" }, { drawSVG: "0% 100%", duration: 0.4, ease: "power3.out" }, tSch + 0.14);
      tl.fromTo(q.levelTri, { opacity: 0, y: -12 }, { opacity: 1, y: 0, duration: 0.3, ease: "back.out(2)", stagger: 0.06 }, tSch + 0.28);
      tl.to(q.railFill, { opacity: 0.85, duration: 0.18, ease: "power2.out" }, tSch + 0.16);
      tl.to(q.railFill, { opacity: 0.42, duration: 0.4, ease: "sine.inOut" }, tSch + 0.34);
      tl.fromTo(q.sChip, { opacity: 0, y: -22, scale: 0.85 }, { opacity: 1, y: 0, scale: 1, duration: 0.42, ease: "back.out(1.7)" }, tSch + 0.02);
      tl.fromTo(q.sSub, { opacity: 0, x: -16 }, { opacity: 1, x: 0, duration: 0.36, ease: "power2.out" }, tSch + 0.14);
      tl.fromTo([q.inLbl, q.outLbl], { opacity: 0 }, { opacity: 0.9, duration: 0.3, ease: "power1.out", stagger: 0.05 }, tSch + 0.16);
      ANIM.sfx(tSch, "ding", -3);
      // 5) Halten bis ctx.t1 (Glow atmet weiter), danach Scan-Übergang
    },
  };
})();
