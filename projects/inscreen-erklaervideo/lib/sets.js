// Kulissen: Wohnzimmer mit Hebeschiebetür (Hauptset mit Kamera) + Helfer für Erklär-Einschübe.
(function () {
  const { S, G, C, rng, F } = window.SVGK;
  const CX = F.W / 2, CY = F.H / 2;
  const O0 = { svgOrigin: "0 0" };

  function defs(svg) {
    let d = svg.querySelector("defs");
    if (!d) d = S("defs", null, svg);
    return d;
  }

  function gradient(svg, id, stops, vertical) {
    const g = S("linearGradient", { id, x1: 0, y1: 0, x2: vertical === false ? 1 : 0, y2: vertical === false ? 0 : 1 }, defs(svg));
    stops.forEach(([off, col, op]) => S("stop", { offset: off, "stop-color": col, "stop-opacity": op === undefined ? 1 : op }, g));
    return `url(#${id})`;
  }

  function radial(svg, id, stops) {
    const g = S("radialGradient", { id, cx: 0.5, cy: 0.5, r: 0.5 }, defs(svg));
    stops.forEach(([off, col, op]) => S("stop", { offset: off, "stop-color": col, "stop-opacity": op === undefined ? 1 : op }, g));
    return `url(#${id})`;
  }

  // Kamera: translate(960,540) · scale(z) · translate(-x,-y)
  function camera(parent) {
    const wrap = S("g", null, parent); // GSAP x/y = Bildmitte (+ Shake)
    const sc = S("g", null, wrap); // Zoom
    const pos = S("g", null, sc); // Pan
    gsap.set(wrap, { x: CX, y: CY });
    gsap.set(pos, { x: -960, y: -540 });
    const cam = { world: pos, sc, pos, wrap };
    cam.to = function (tl, t, p, dur, ease) {
      const e = ease || "power2.inOut";
      if (dur === 0) {
        if (t <= 0.0001) { gsap.set(pos, { x: -p.x, y: -p.y }); gsap.set(sc, Object.assign({ scale: p.z }, O0)); }
        else { tl.set(pos, { x: -p.x, y: -p.y }, t); tl.set(sc, Object.assign({ scale: p.z }, O0), t); }
      } else {
        tl.to(pos, { x: -p.x, y: -p.y, duration: dur, ease: e }, t);
        tl.to(sc, Object.assign({ scale: p.z, duration: dur, ease: e }, O0), t);
      }
      return cam;
    };
    cam.shake = function (tl, t, amp, dur) {
      const r = rng(Math.round(t * 1000) + 5);
      const n = Math.max(2, Math.round((dur || 0.3) / 0.05));
      for (let i = 0; i < n; i++) {
        const k = 1 - i / n;
        tl.to(wrap, { x: CX + (r() - 0.5) * amp * k, y: CY + (r() - 0.5) * amp * k, duration: 0.05, ease: "sine.inOut" }, t + i * 0.05);
      }
      tl.to(wrap, { x: CX, y: CY, duration: 0.06, ease: "sine.out" }, t + n * 0.05);
      return cam;
    };
    return cam;
  }

  // Gummibaum/Geigenfeige: Stiele mit großen ovalen Blättern
  function plant(parent, x, y, s, seed, cols) {
    const g = G(parent, { x, y, s });
    const r = rng(seed);
    const stems = [[-40, -250, -18], [10, -330, 4], [55, -230, 22]];
    stems.forEach(([sx, top, lean], k) => {
      S("path", { d: `M0,0 Q${sx * 0.4},${top * 0.5} ${sx},${top}`, stroke: "#6f4a2e", "stroke-width": 7, fill: "none", "stroke-linecap": "round" }, g);
      const n = 5;
      for (let i = 0; i < n; i++) {
        const f = 0.32 + (i / (n - 1)) * 0.7;
        const px = sx * f * (0.4 + f * 0.6), py = top * f;
        const side = (i + k) % 2 ? 1 : -1;
        const ang = side * (38 + r() * 22) + lean;
        const len = 64 + r() * 26 - i * 3;
        const col = cols[(i + k) % cols.length];
        const lf = S("g", { transform: `translate(${px},${py}) rotate(${ang})` }, g);
        S("path", { d: `M0,0 C${len * 0.45},${-len * 0.12} ${len * 0.5},${-len * 0.95} 0,${-len * 1.15} C${-len * 0.5},${-len * 0.95} ${-len * 0.45},${-len * 0.12} 0,0 Z`, fill: col }, lf);
        S("path", { d: `M0,-4 L0,${-len * 1.02}`, stroke: "#ffffff", "stroke-width": 2, opacity: 0.25 }, lf);
      }
      S("path", { d: `M${sx},${top} C${sx + 30},${top - 20} ${sx + 26},${top - 80} ${sx},${top - 90} C${sx - 26},${top - 80} ${sx - 30},${top - 20} ${sx},${top} Z`, fill: cols[k % cols.length] }, g);
    });
    return g;
  }

  // ---------------- Wohnzimmer ----------------
  function makeLivingRoom(svg, o) {
    o = o || {};
    const set = {};
    const root = S("g", { id: o.id || "lr" }, svg);
    set.root = root;
    const cam = camera(root);
    set.cam = cam;
    const W = cam.world;
    const DX = 560, DY = 170, DW = 900, DH = 700; // Türöffnung
    set.doorBox = { x: DX, y: DY, w: DW, h: DH };

    // ---- Außen (hinter der Tür) ----
    const out = S("g", null, W);
    set.outside = out;
    const sky = gradient(svg, "lrSky", [[0, "#fff4dc"], [0.45, "#fde6b5"], [0.8, "#fbd27f"], [1, "#f8b73a"]]);
    S("rect", { x: DX - 80, y: DY - 80, width: DW + 160, height: DH + 120, fill: sky }, out);
    set.sun = G(out, { x: 1265, y: 600 });
    S("circle", { cx: 0, cy: 0, r: 150, fill: "#fff4dc", opacity: 0.35 }, set.sun);
    S("circle", { cx: 0, cy: 0, r: 64, fill: "#fff8e8" }, set.sun);
    // Wolken
    set.clouds = [];
    [[760, 300, 1], [1180, 250, 0.8], [980, 380, 0.6]].forEach(([x, y, s], i) => {
      const c = G(out, { x, y, s });
      S("path", { d: "M-90,20 Q-90,-10 -60,-12 Q-50,-44 -14,-40 Q10,-66 44,-44 Q84,-46 88,-10 Q112,-4 108,20 Z", fill: "#fff", opacity: 0.75 }, c);
      set.clouds.push(c);
    });
    // Hügel, Nachbarhaus, Hecke, Baum
    S("path", { d: `M${DX - 80},690 Q760,610 960,650 T1300,630 T${DX + DW + 80},650 V${DY + DH + 40} H${DX - 80} Z`, fill: C.g4 }, out);
    const house = S("g", null, out);
    S("rect", { x: 640, y: 560, width: 190, height: 140, fill: "#fbf7ef" }, house);
    S("path", { d: "M620,566 L735,490 L850,566 Z", fill: C.b4 }, house);
    S("rect", { x: 672, y: 600, width: 44, height: 50, fill: C.b5 }, house);
    S("rect", { x: 750, y: 600, width: 44, height: 50, fill: C.b5 }, house);
    const hedge = S("g", null, out);
    for (let i = 0; i < 12; i++) {
      S("circle", { cx: DX - 60 + i * 88, cy: 720 + (i % 3) * 8, r: 64 + (i % 2) * 10, fill: i % 2 ? C.g2 : C.g3 }, hedge);
    }
    S("rect", { x: DX - 80, y: 730, width: DW + 160, height: 60, fill: C.g2 }, hedge);
    const tree = S("g", null, out);
    S("rect", { x: 1376, y: 470, width: 26, height: 300, fill: "#6f4a2e" }, tree);
    [[1390, 420, 120, C.g1], [1310, 480, 80, C.g2], [1460, 470, 90, C.g1], [1380, 330, 90, C.g2]].forEach(([x, y, r2, c]) => S("circle", { cx: x, cy: y, r: r2, fill: c }, tree));
    // Terrasse auf gleicher Höhe wie der Innenboden (keine Stolperkante)
    S("rect", { x: DX - 80, y: 780, width: DW + 160, height: 140, fill: "#e6dac6" }, out);
    for (let i = 0; i < 9; i++) S("line", { x1: DX - 80 + i * 130, y1: 780, x2: DX - 160 + i * 150, y2: 920, stroke: "#d2c3aa", "stroke-width": 3 }, out);
    S("line", { x1: DX - 80, y1: 826, x2: DX + DW + 80, y2: 826, stroke: "#d2c3aa", "stroke-width": 3 }, out);
    // Lounge-Sessel (Geflecht) + Gräser im Topf
    const chair = S("g", null, out);
    S("path", { d: "M1150,780 L1166,700 Q1220,668 1290,700 L1300,780", stroke: C.b4, "stroke-width": 10, fill: "none", "stroke-linecap": "round" }, chair);
    S("path", { d: "M1160,740 Q1230,756 1296,740 L1300,760 Q1230,776 1158,760 Z", fill: C.b5 }, chair);
    for (let i = 0; i < 6; i++) S("line", { x1: 1172 + i * 20, y1: 700, x2: 1186 + i * 20, y2: 740, stroke: C.b5, "stroke-width": 3 }, chair);
    const grass = S("g", null, out);
    S("path", { d: "M640,790 L652,730 L706,730 L718,790 Z", fill: "#c47e3f" }, grass);
    const rg = rng(4);
    for (let i = 0; i < 16; i++) {
      const x = 660 + rg() * 40;
      S("path", { d: `M${x},732 Q${x + (rg() - 0.5) * 50},${660 - rg() * 40} ${x + (rg() - 0.5) * 90},${600 - rg() * 50}`, stroke: i % 2 ? C.g2 : C.g3, "stroke-width": 4, fill: "none", "stroke-linecap": "round" }, grass);
    }
    // Abenddämmerung (für den Abschluss)
    set.dusk = S("rect", { x: DX - 80, y: DY - 80, width: DW + 160, height: DH + 120, fill: C.b2, opacity: 0 }, out);
    set.stars = S("g", { opacity: 0 }, out);
    const rs = rng(21);
    for (let i = 0; i < 18; i++) S("circle", { cx: DX + rs() * DW, cy: DY + 30 + rs() * 260, r: 1.6 + rs() * 2, fill: "#fff4dc" }, set.stars);

    // Mücken draußen (hinter Glas und Plissee)
    set.outLayer = S("g", null, W);

    // ---- Tür ----
    set.door = DOOR.makeDoor(W, { x: DX, y: DY, w: DW, h: DH, variant: o.variant || "anthrazit", screen: 0 });

    // ---- Wand mit Öffnung ----
    const wall = S("path", {
      d: `M-400,-1300 H2320 V${DY + DH} H-400 Z M${DX},${DY} V${DY + DH} H${DX + DW} V${DY} Z`,
      "fill-rule": "evenodd", fill: C.cream,
    }, W);
    set.wall = wall;
    // Wand-Licht: warmer Schein rund um die Tür
    const glow = radial(svg, "lrGlow", [[0, "#fde6b5", 0.9], [1, "#fde6b5", 0]]);
    S("ellipse", { cx: DX + DW / 2, cy: DY + DH * 0.62, rx: 760, ry: 470, fill: glow, opacity: 0.32 }, W);
    // Laibung (Wandtiefe) links/oben
    S("path", { d: `M${DX - 26},${DY - 22} H${DX + DW + 26} L${DX + DW},${DY} H${DX} Z`, fill: C.cream3 }, W);
    S("path", { d: `M${DX - 26},${DY - 22} L${DX},${DY} V${DY + DH} L${DX - 26},${DY + DH} Z`, fill: C.cream2 }, W);
    S("path", { d: `M${DX + DW + 26},${DY - 22} L${DX + DW},${DY} V${DY + DH} L${DX + DW + 26},${DY + DH} Z`, fill: C.cream3 }, W);
    // Bild an der Wand (Markenmotiv als Kunst)
    const art = S("g", null, W);
    S("rect", { x: 110, y: 260, width: 270, height: 330, fill: "#fff", stroke: C.cream3, "stroke-width": 10 }, art);
    S("path", { d: "M150,520 V330 H300", stroke: C.yellow, "stroke-width": 10, fill: "none" }, art);
    S("path", { d: "M200,560 V400 H340", stroke: C.red, "stroke-width": 10, fill: "none" }, art);
    // Steckdose/Lichtschalter-Detail
    S("rect", { x: 1500, y: 470, width: 34, height: 34, rx: 4, fill: "#fbf8f2", stroke: C.cream3, "stroke-width": 2 }, W);
    // Boden
    const floorG = gradient(svg, "lrFloor", [[0, "#d39a5e"], [1, "#c58a4f"]]);
    S("rect", { x: -400, y: DY + DH, width: 2720, height: 1700, fill: floorG }, W);
    for (let i = -12; i <= 30; i++) {
      const xt = 960 + (i - 9) * 70, xb = 960 + (i - 9) * 150;
      S("line", { x1: xt, y1: DY + DH, x2: xt + (xb - xt) * 2.6, y2: DY + DH + (1400 - DY - DH) * 2.6, stroke: "#b77b42", "stroke-width": 3, opacity: 0.55 }, W);
    }
    S("rect", { x: -400, y: DY + DH - 6, width: 2720, height: 10, fill: "#e8dcc6" }, W); // Sockelleiste
    S("rect", { x: DX, y: DY + DH - 6, width: DW, height: 10, fill: "#00000000" }, W);
    // Lichtkegel auf dem Boden
    set.beam = S("path", { d: `M${DX + 30},${DY + DH} H${DX + DW - 10} L${DX + DW + 420},1180 H${DX - 220} Z`, fill: "#fde6b5", opacity: 0.42 }, W);
    // Teppich
    S("ellipse", { cx: 1000, cy: 1004, rx: 640, ry: 86, fill: C.b4, opacity: 0.45 }, W);
    S("ellipse", { cx: 1000, cy: 1004, rx: 585, ry: 70, fill: "none", stroke: C.b6, "stroke-width": 6, opacity: 0.55 }, W);

    // Sofa links
    const sofa = S("g", null, W);
    set.sofa = sofa;
    S("rect", { x: 20, y: 640, width: 470, height: 170, rx: 40, fill: C.b2 }, sofa);
    S("rect", { x: 40, y: 740, width: 430, height: 110, rx: 24, fill: C.b3 }, sofa);
    S("rect", { x: 0, y: 700, width: 80, height: 160, rx: 30, fill: C.b1 }, sofa);
    S("rect", { x: 430, y: 700, width: 80, height: 160, rx: 30, fill: C.b1 }, sofa);
    S("rect", { x: 60, y: 852, width: 18, height: 26, fill: C.an1 }, sofa);
    S("rect", { x: 430, y: 852, width: 18, height: 26, fill: C.an1 }, sofa);
    S("rect", { x: 100, y: 660, width: 120, height: 96, rx: 22, fill: C.y2, transform: "rotate(-8 160 708)" }, sofa);
    S("rect", { x: 300, y: 664, width: 110, height: 92, rx: 22, fill: C.cream, transform: "rotate(6 355 710)" }, sofa);
    // Bogenlampe (wie in der Broschüre)
    const lamp = S("g", null, W);
    set.lamp = lamp;
    S("ellipse", { cx: 470, cy: 866, rx: 46, ry: 10, fill: "#c9cdd0" }, lamp);
    S("path", { d: "M470,866 V420 Q470,250 640,250 Q700,250 720,300", stroke: "#c9cdd0", "stroke-width": 8, fill: "none", "stroke-linecap": "round" }, lamp);
    set.lampGlow = S("ellipse", { cx: 722, cy: 380, rx: 160, ry: 120, fill: "#fff4dc", opacity: 0 }, lamp);
    S("path", { d: "M682,300 A40,40 0 0,1 762,300 Z", fill: "#dde0e2" }, lamp);
    set.lampBulb = S("ellipse", { cx: 722, cy: 302, rx: 30, ry: 6, fill: "#fff8e8", opacity: 0.6 }, lamp);
    // Beistelltisch + Limonade
    const table = S("g", null, W);
    S("ellipse", { cx: 560, cy: 790, rx: 70, ry: 14, fill: C.oak2 }, table);
    S("rect", { x: 554, y: 792, width: 12, height: 76, fill: C.oak1 }, table);
    S("ellipse", { cx: 560, cy: 868, rx: 34, ry: 6, fill: C.oak1 }, table);
    set.glass = G(W, { x: 548, y: 790 });
    S("path", { d: "M-16,-62 L16,-62 L12,0 L-12,0 Z", fill: "#fff", opacity: 0.55 }, set.glass);
    S("path", { d: "M-14,-44 L14,-44 L12,0 L-12,0 Z", fill: C.y1, opacity: 0.85 }, set.glass);
    S("circle", { cx: 6, cy: -50, r: 9, fill: C.y2 }, set.glass);
    S("line", { x1: -4, y1: -80, x2: 4, y2: -20, stroke: C.red, "stroke-width": 4 }, set.glass);
    // Monstera rechts
    const pot = S("g", null, W);
    S("path", { d: "M1590,870 L1572,760 H1748 L1730,870 Z", fill: C.cream3 }, pot);
    S("rect", { x: 1566, y: 750, width: 188, height: 22, rx: 6, fill: "#d6c5a8" }, pot);
    set.plant = plant(W, 1660, 756, 1.25, 9, [C.g1, C.g2, C.g1, C.g3]);

    // Figuren-Ebene innen
    set.charLayer = S("g", null, W);
    set.fgLayer = S("g", null, W);
    return set;
  }

  // ---------------- Erklär-Einschub-Bühne (SCHMIDT-Blau) ----------------
  function makeStage(svg, o) {
    o = o || {};
    const st = {};
    const root = S("g", { id: o.id }, svg);
    st.root = root;
    S("rect", { x: 0, y: 0, width: F.W, height: F.H, fill: o.bg || C.blue }, root);
    // feines Punkt-Raster + große, angeschnittene Bildmarken-Linie als Hintergrund-Ebene
    const dots = S("g", { opacity: o.dotOpacity || 0.08 }, root);
    for (let y = 40; y < F.H; y += 48) for (let x = 40; x < F.W; x += 48) S("circle", { cx: x, cy: y, r: 2.2, fill: "#fff" }, dots);
    const glow = radial(svg, (o.id || "st") + "Glow", [[0, "#2c5a6e", 0.9], [1, "#2c5a6e", 0]]);
    S("ellipse", { cx: o.gx || CX, cy: o.gy || F.H * 0.52, rx: F.portrait ? 760 : 900, ry: F.portrait ? 1100 : 620, fill: glow }, root);
    st.layer = S("g", null, root);
    return st;
  }

  window.SETS = { makeLivingRoom, makeStage, camera, gradient, radial, plant };
})();
