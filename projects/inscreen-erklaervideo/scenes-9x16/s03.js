// s03 (9:16) — „Klassische Fliegengitter: aufgesetzt, auffällig, mit Stolperkante – und gebohrt wird auch noch.“
// Hochformat-Neukomposition: Titel oben, darunter Wandausschnitt mit hoher Schiebetür, Anna rechts daneben,
// vier Labels als 2×2-Raster über der Untertitel-Zone. Stolpern als Nahaufnahme auf die Bodenschiene,
// danach Rückzug (Reveal mit Sternchen), beim Bohren ein langsamer Push-in.
// Weltkoordinaten = Bildkoordinaten in der Totale (Kamera {x:540, y:960, z:1}).
// Regel: x/y immer auf äußeren Gruppen, Rotation/Skalierung (svgOrigin "0 0") auf inneren Gruppen ohne x/y.
(function () {
  const FY = 1120; // Bodenlinie (Welt = Bild in der Totale)
  const AS = 0.88; // Anna-Skalierung
  const AX0 = 880; // Anna Start (Füße)
  const AXT = 840; // Anna am Stolperpunkt
  const AXR = 830; // Anna nach dem Fangen
  const FX = 500; // Gitter-Mitte
  const DOOR = { x: 290, y: 528, w: 420, h: FY - 528 };
  const FR = { hw: 244, h: 622, bar: 40, rail: 52, railHW: 262 }; // lokal, Ursprung unten Mitte
  const HX = FX - FR.hw + FR.bar / 2; // Mitte des linken Rahmenholms
  const HOLES = [{ x: HX, y: FY - 432 }, { x: HX, y: FY - 262 }];
  const DRILL = { x: HX + 11, y: HOLES[0].y }; // Bohrspitze am ersten Loch (Welt)
  const DS = 0.64; // Bohrmaschinen-Skalierung
  const WL = 70, WR = 1010, WT = 440; // Wandausschnitt
  const HDR = { solid: 392, fade: 430 }; // Kopfband hinter dem Titel (deckt die Welt bei Zooms ab)
  const CAM0 = { x: 540, y: 960, z: 1 }; // Totale
  const CAM_TRIP = { x: 792, y: 1060, z: 1.9 }; // Nahaufnahme Bodenschiene
  const CAM_DRILL = { x: 520, y: 956, z: 1.06 }; // langsamer Push-in beim Bohren
  const O0 = { svgOrigin: "0 0" };
  const o0 = (v) => Object.assign(v, O0);

  function star(r1, r2) {
    let d = "";
    for (let i = 0; i < 10; i++) {
      const a = -Math.PI / 2 + (i * Math.PI) / 5, r = i % 2 ? r2 : r1;
      d += (i ? "L" : "M") + (Math.cos(a) * r).toFixed(1) + "," + (Math.sin(a) * r).toFixed(1);
    }
    return d + "Z";
  }

  function setup(R, ctx) {
    const { S, G, C, F, rng } = SVGK;
    const svg = R.svg;
    const defs = svg.querySelector("defs") || S("defs", null, svg);
    const GX = 540, GY = 820;
    const st = SETS.makeStage(svg, { id: "set-problem", gx: GX, gy: GY });
    R.sets.problem = st;
    const cam = SETS.camera(st.layer);
    st.cam = cam;
    const W = cam.world;
    const P = (st.p = {});

    // ---------- Boden ----------
    S("rect", { x: -900, y: FY, width: 2880, height: 1700, fill: "#0d2733" }, W);
    for (let i = -9; i <= 9; i++) S("line", { x1: 540 + i * 120, y1: FY, x2: 540 + i * 330, y2: FY + 1300, stroke: C.b1, "stroke-width": 3, opacity: 0.6 }, W);
    S("rect", { x: -900, y: FY - 3, width: 2880, height: 7, fill: C.b2 }, W);
    // Lichtschein aus der Tür auf dem Boden
    const beam = SETS.gradient(svg, "s03Beam", [[0, "#fbd27f", 0.16], [1, "#fbd27f", 0]]);
    S("path", { d: `M${DOOR.x + 10},${FY + 4} H${DOOR.x + DOOR.w - 10} L${DOOR.x + DOOR.w + 120},${FY + 170} H${DOOR.x - 130} Z`, fill: beam }, W);

    // ---------- Wandausschnitt mit Türöffnung ----------
    S("path", { d: `M${WR},${WT + 14} L${WR + 20},${WT + 30} V${FY} H${WR} Z`, fill: "#163b4b" }, W); // Wandstärke rechts
    S("path", {
      d: `M${WL},${FY} V${WT + 18} Q${WL},${WT} ${WL + 18},${WT} H${WR - 18} Q${WR},${WT} ${WR},${WT + 18} V${FY} Z M${DOOR.x},${DOOR.y} V${FY} H${DOOR.x + DOOR.w} V${DOOR.y} Z`,
      "fill-rule": "evenodd", fill: C.b1,
    }, W);
    S("path", { d: `M${DOOR.x - 14},${DOOR.y - 14} H${DOOR.x + DOOR.w + 14} V${FY} H${DOOR.x + DOOR.w} V${DOOR.y} H${DOOR.x} V${FY} H${DOOR.x - 14} Z`, fill: "#183f50" }, W); // Laibung
    // Sockelleiste
    S("rect", { x: WL, y: FY - 16, width: DOOR.x - 14 - WL, height: 16, fill: C.b2 }, W);
    S("rect", { x: DOOR.x + DOOR.w + 14, y: FY - 16, width: WR - DOOR.x - DOOR.w - 14, height: 16, fill: C.b2 }, W);

    // ---------- Außenblick (warm) ----------
    const ox = (f) => DOOR.x + f * DOOR.w, oy = (f) => DOOR.y + f * DOOR.h;
    const cpo = S("clipPath", { id: "s03-out" }, defs);
    S("rect", { x: DOOR.x, y: DOOR.y, width: DOOR.w, height: DOOR.h }, cpo);
    const out = S("g", { "clip-path": "url(#s03-out)" }, W);
    const sky = SETS.gradient(svg, "s03Sky", [[0, "#fff4dc"], [0.5, "#fde6b5"], [1, "#fbd27f"]]);
    S("rect", { x: DOOR.x, y: DOOR.y, width: DOOR.w, height: DOOR.h, fill: sky }, out);
    S("circle", { cx: ox(0.7), cy: oy(0.5), r: 100, fill: "#fff4dc", opacity: 0.55 }, out);
    S("circle", { cx: ox(0.7), cy: oy(0.5), r: 44, fill: "#fff8e8" }, out);
    [[0.27, 0.16, 0.62, 0.8], [0.78, 0.07, 0.42, 0.65]].forEach(([fx, fy, s, op]) => {
      const cl = S("g", { transform: `translate(${ox(fx)},${oy(fy)}) scale(${s})` }, out);
      S("path", { d: "M-90,20 Q-90,-10 -60,-12 Q-50,-44 -14,-40 Q10,-66 44,-44 Q84,-46 88,-10 Q112,-4 108,20 Z", fill: "#fff", opacity: op }, cl);
    });
    S("path", { d: `M${DOOR.x},${oy(0.69)} Q${ox(0.23)},${oy(0.6)} ${ox(0.5)},${oy(0.645)} T${ox(1)},${oy(0.61)} V${FY} H${DOOR.x} Z`, fill: C.g4 }, out);
    S("rect", { x: ox(0.8) - 8, y: oy(0.36), width: 16, height: oy(0.71) - oy(0.36), fill: "#6f4a2e" }, out);
    [[0.82, 0.31, 56, C.g1], [0.7, 0.385, 38, C.g2], [0.93, 0.38, 42, C.g1]].forEach(([fx, fy, r, c]) => S("circle", { cx: ox(fx), cy: oy(fy), r, fill: c }, out));
    for (let i = 0; i < 8; i++) S("circle", { cx: DOOR.x + 8 + i * 60, cy: oy(0.77) + (i % 3) * 6, r: 40 + (i % 2) * 7, fill: i % 2 ? C.g2 : C.g3 }, out);
    S("rect", { x: DOOR.x, y: oy(0.8), width: DOOR.w, height: oy(0.87) - oy(0.8), fill: C.g2 }, out);
    S("rect", { x: DOOR.x, y: oy(0.87), width: DOOR.w, height: FY - oy(0.87) + 10, fill: "#e6dac6" }, out);
    for (let i = 0; i < 6; i++) S("line", { x1: DOOR.x + i * 84, y1: oy(0.87), x2: DOOR.x - 50 + i * 100, y2: FY, stroke: "#d2c3aa", "stroke-width": 3 }, out);

    // ---------- Generische Schiebetür (hellgrau) ----------
    const df = S("g", null, W);
    const ft = 20, th = 14, x = DOOR.x, y = DOOR.y, w = DOOR.w, mid = x + w / 2;
    const sash = (sx, sy, sw, sh, p, front) => {
      const g = S("g", null, df);
      S("rect", { x: sx + p, y: sy + p, width: sw - 2 * p, height: sh - 2 * p, fill: "#d8e6ea", opacity: 0.2 }, g);
      S("path", { d: `M${sx + p + (sw - 2 * p) * 0.2},${sy + p} h${(sw - 2 * p) * 0.22} L${sx + p + (sw - 2 * p) * 0.05},${sy + sh - p} h${-(sw - 2 * p) * 0.22} Z`, fill: "#fff", opacity: 0.16 }, g);
      S("path", { d: `M${sx + p + (sw - 2 * p) * 0.6},${sy + p} h${(sw - 2 * p) * 0.1} L${sx + p + (sw - 2 * p) * 0.32},${sy + sh - p} h${-(sw - 2 * p) * 0.1} Z`, fill: "#fff", opacity: 0.12 }, g);
      S("path", { d: `M${sx},${sy} H${sx + sw} V${sy + sh} H${sx} Z M${sx + p},${sy + p} V${sy + sh - p} H${sx + sw - p} V${sy + p} Z`, "fill-rule": "evenodd", fill: C.b5 }, g);
      S("rect", { x: sx + p - 4, y: sy + p - 4, width: sw - 2 * p + 8, height: 4, fill: C.b4 }, g);
      S("rect", { x: sx + sw - p, y: sy + p, width: 4, height: sh - 2 * p, fill: C.b4, opacity: 0.6 }, g);
      if (front) S("rect", { x: sx, y: sy, width: 5, height: sh, fill: "#fff", opacity: 0.35 }, g);
      return g;
    };
    S("path", { d: `M${x},${y} H${x + w} V${FY} H${x} Z M${x + ft},${y + ft} V${FY - th} H${x + w - ft} V${y + ft} Z`, "fill-rule": "evenodd", fill: C.b5 }, df);
    S("rect", { x, y: FY - th, width: w, height: th, fill: C.b4 }, df);
    S("rect", { x: x + ft, y: y + ft, width: w - 2 * ft, height: 4, fill: C.b4 }, df);
    sash(x + ft, y + ft, mid + 6 - (x + ft), FY - th - (y + ft), 24, false);
    sash(mid - 6, y + ft, x + w - ft - (mid - 6), FY - th - (y + ft), 27, true);
    S("rect", { x: mid + 2, y: y + DOOR.h * 0.47, width: 11, height: 68, rx: 5.5, fill: C.b3 }, df);

    // ---------- Klobiges, aufgesetztes Fliegengitter ----------
    const { hw, h, bar, rail, railHW } = FR;
    P.fWrap = G(W, { x: FX, y: FY }); // Fallen (y)
    P.fSq = G(P.fWrap, {}); // Squash / Wackeln (svgOrigin unten Mitte)
    P.fShadow = G(P.fSq, {}); // Schattenkante (x/y)
    const barsD = `M${-hw},${-h} H${hw} V${-rail} H${-hw} Z M${-hw + bar},${-h + bar} V${-rail} H${hw - bar} V${-h + bar} Z`;
    S("path", { d: barsD, "fill-rule": "evenodd", fill: "#061a22", opacity: 0.62 }, P.fShadow);
    P.fBody = G(P.fSq, {}); // Hüpfer (y)
    const fb = P.fBody;
    // Netz
    const ix0 = -hw + bar, ix1 = hw - bar, iy0 = -h + bar, iy1 = -rail;
    S("rect", { x: ix0, y: iy0, width: ix1 - ix0, height: iy1 - iy0, fill: C.an3, opacity: 0.32 }, fb);
    const mesh = S("g", { stroke: "#2f353a", "stroke-width": 1.5, opacity: 0.42 }, fb);
    for (let xx = ix0 + 12; xx < ix1; xx += 12) S("line", { x1: xx, y1: iy0, x2: xx, y2: iy1 }, mesh);
    for (let yy = iy0 + 12; yy < iy1; yy += 12) S("line", { x1: ix0, y1: yy, x2: ix1, y2: yy }, mesh);
    S("path", { d: `M${ix0 + 36},${iy1} Q${ix0 + 110},${(iy0 + iy1) / 2} ${ix0 + 54},${iy0}`, stroke: "#fff", "stroke-width": 10, fill: "none", opacity: 0.08 }, fb); // Netz-Glanz
    S("path", { d: `M${ix0},${iy0 + 4} H${ix1}`, stroke: "#2f353a", "stroke-width": 7, opacity: 0.3 }, fb);
    // Rahmen (Alu-Optik)
    S("path", { d: barsD, "fill-rule": "evenodd", fill: C.b6, stroke: C.b3, "stroke-width": 4, "stroke-linejoin": "round" }, fb);
    S("path", { d: `M${-hw + bar / 2},${-rail} V${-h + bar / 2} H${hw - bar / 2} V${-rail}`, stroke: "#cbd8dd", "stroke-width": 9, fill: "none" }, fb);
    S("path", { d: `M${-hw + bar / 2},${-rail} V${-h + bar / 2} H${hw - bar / 2} V${-rail}`, stroke: C.b4, "stroke-width": 1.6, fill: "none", opacity: 0.8 }, fb);
    S("path", { d: `M${-hw + 5},${-rail} V${-h + 5} H${hw - 6}`, stroke: "#fff", "stroke-width": 4, fill: "none", opacity: 0.85 }, fb);
    S("path", { d: `M${hw - 5},${-h + 6} V${-rail}`, stroke: C.b5, "stroke-width": 6, fill: "none" }, fb);
    S("path", { d: `M${-hw},${-h} L${-hw + bar},${-h + bar} M${hw},${-h} L${hw - bar},${-h + bar}`, stroke: C.b4, "stroke-width": 2.5 }, fb);
    // Bodenschiene = Stolperkante
    S("rect", { x: -railHW, y: -rail, width: railHW * 2, height: rail, rx: 7, fill: C.b6, stroke: C.b3, "stroke-width": 4 }, fb);
    S("rect", { x: -railHW + 6, y: -rail + 3, width: railHW * 2 - 12, height: 10, rx: 4, fill: "#fff", opacity: 0.9 }, fb);
    S("line", { x1: -railHW + 24, y1: -rail + 18, x2: railHW - 24, y2: -rail + 18, stroke: C.b4, "stroke-width": 3 }, fb);
    S("rect", { x: -railHW + 4, y: -15, width: railHW * 2 - 8, height: 11, fill: C.b5 }, fb);
    [-1, 1].forEach((sd) => S("rect", { x: sd < 0 ? -railHW : railHW - 24, y: -rail, width: 24, height: rail, rx: 7, fill: C.b5, stroke: C.b3, "stroke-width": 4 }, fb));
    // Schraubenköpfe
    const rs = rng(303);
    const screw = (sx, sy) => {
      S("circle", { cx: sx, cy: sy, r: 9.5, fill: "#f4f8f9", stroke: C.b3, "stroke-width": 2.6 }, fb);
      const a = rs() * Math.PI;
      S("line", { x1: sx - Math.cos(a) * 6, y1: sy - Math.sin(a) * 6, x2: sx + Math.cos(a) * 6, y2: sy + Math.sin(a) * 6, stroke: C.b3, "stroke-width": 2.8, "stroke-linecap": "round" }, fb);
    };
    [[-hw + 20, -h + 20], [hw - 20, -h + 20], [0, -h + 20], [-hw + 20, -h * 0.52], [hw - 20, -h * 0.52], [-hw + 20, -rail - 26], [hw - 20, -rail - 26], [-160, -rail / 2 - 6], [0, -rail / 2 - 6], [160, -rail / 2 - 6]].forEach(([a, b]) => screw(a, b));
    // Bohrlöcher (erscheinen beim Bohren)
    P.holes = HOLES.map((ho) => {
      const g = G(fb, { x: ho.x - FX, y: ho.y - FY });
      S("circle", { cx: 0, cy: 0, r: 13, fill: C.b5 }, g);
      S("circle", { cx: 0, cy: 0, r: 8.5, fill: C.ink }, g);
      S("path", { d: "M8,-10 l7,-9 M-11,6 l-9,5 M10,9 l6,8", stroke: C.b3, "stroke-width": 2.2, "stroke-linecap": "round", fill: "none" }, g);
      gsap.set(g, o0({ scale: 0 }));
      return g;
    });
    // Glanz-Sweep (nur auf dem Rahmen)
    const cpf = S("clipPath", { id: "s03-fclip" }, defs);
    S("path", { d: barsD, "clip-rule": "evenodd" }, cpf);
    S("rect", { x: -railHW, y: -rail, width: railHW * 2, height: rail }, cpf);
    const gl = S("g", { "clip-path": "url(#s03-fclip)" }, fb);
    P.glare = S("path", { d: `M-40,${-h - 60} h70 L-150,40 h-70 Z`, fill: "#fff", opacity: 0.85 }, gl);
    gsap.set(P.glare, { x: -480 });
    // Aufmerksamkeits-Striche („schreit“)
    P.att = [];
    const attG = S("g", { stroke: C.yellow, "stroke-width": 9, "stroke-linecap": "round", fill: "none" }, fb);
    const ray = (cx, cy, angDeg, r0, r1) => {
      const a = (angDeg * Math.PI) / 180;
      const p = S("path", { d: `M${(cx + Math.cos(a) * r0).toFixed(1)},${(cy + Math.sin(a) * r0).toFixed(1)} L${(cx + Math.cos(a) * r1).toFixed(1)},${(cy + Math.sin(a) * r1).toFixed(1)}` }, attG);
      gsap.set(p, { drawSVG: "0% 0%", opacity: 0 });
      return p;
    };
    P.att.push([ray(-hw, -h, -160, 26, 78), ray(-hw, -h, -132, 26, 84), ray(-hw, -h, -104, 26, 72)]);
    P.att.push([ray(hw, -h, -20, 26, 78), ray(hw, -h, -48, 26, 84), ray(hw, -h, -76, 26, 72)]);
    P.att.push([ray(-hw, -h * 0.55, 180, 22, 66), ray(-hw, -h * 0.55, 205, 22, 60), ray(hw, -h * 0.55, 0, 22, 66), ray(hw, -h * 0.55, -25, 22, 60)]);
    gsap.set(P.fWrap, { y: -1220 });
    gsap.set(P.fShadow, { x: 8, y: 6, opacity: 0 });

    // ---------- Ebenen ----------
    P.crossL = S("g", null, W);
    P.charL = S("g", null, W);
    P.fx = S("g", null, W);
    P.drL = S("g", null, W);

    // Rotes Kreuz (über der Türöffnung)
    const cx0 = DOOR.x + 30, cx1 = DOOR.x + DOOR.w - 30, cy0 = DOOR.y + 36, cy1 = FY - 56;
    P.cross = [
      S("path", { d: `M${cx0},${cy0} Q${(cx0 + cx1) / 2 - 10},${(cy0 + cy1) / 2 + 6} ${cx1},${cy1}`, stroke: C.red, "stroke-width": 26, "stroke-linecap": "round", fill: "none" }, P.crossL),
      S("path", { d: `M${cx1},${cy0} Q${(cx0 + cx1) / 2 + 14},${(cy0 + cy1) / 2 + 10} ${cx0},${cy1}`, stroke: C.red, "stroke-width": 26, "stroke-linecap": "round", fill: "none" }, P.crossL),
    ];
    P.cross.forEach((p) => gsap.set(p, { drawSVG: "0% 0%", opacity: 0 }));

    // Staubwölkchen beim Aufprall (2 Sätze × 2 Ecken)
    P.puffs = [0, 1].map(() => [-1, 1].map((sd) => {
      const arr = [];
      for (let i = 0; i < 5; i++) arr.push(S("circle", { cx: 0, cy: 0, r: 4, fill: i % 2 ? C.b5 : C.b6, opacity: 0 }, P.fx));
      return { sd, arr };
    }));
    // Bohrstaub + Häufchen
    P.heap = S("ellipse", { cx: HX - 49, cy: FY, rx: 0, ry: 0, fill: C.b5 }, P.fx);
    P.dust = [];
    for (let i = 0; i < 22; i++) P.dust.push(S("circle", { cx: 0, cy: 0, r: 4 + (i % 3) * 1.5, fill: [C.b6, C.b5, "#fff"][i % 3], opacity: 0 }, P.fx));

    // ---------- Anna ----------
    const anna = CHAR.makeAnna(P.charL, { x: 0, y: 0, s: AS });
    st.anna = anna;
    gsap.set(anna.root, { x: AX0, y: FY });
    // zusammengekniffene Augen
    P.squint = [
      S("path", { d: "M-42,-102 L-20,-90 L-42,-78", stroke: C.ink, "stroke-width": 5.5, fill: "none", "stroke-linecap": "round", "stroke-linejoin": "round", opacity: 0 }, anna.face.group),
      S("path", { d: "M42,-102 L20,-90 L42,-78", stroke: C.ink, "stroke-width": 5.5, fill: "none", "stroke-linecap": "round", "stroke-linejoin": "round", opacity: 0 }, anna.face.group),
    ];
    // Kringel-Sternchen um den Kopf
    P.stars = S("g", { opacity: 0 }, anna.head);
    P.orbit = [];
    P.orbitPath = "M-106,-170 A106,30 0 1,1 106,-170 A106,30 0 1,1 -106,-170 Z";
    for (let i = 0; i < 5; i++) {
      const g = S("g", null, P.stars);
      const spin = G(g, {});
      if (i % 2 === 0) {
        S("path", { d: star(27, 11.5), fill: i === 2 ? "#fff" : C.yellow, "stroke-linejoin": "round" }, spin);
      } else {
        S("path", { d: "M0,0 m-12,0 a12,12 0 1,1 24,0 a9,9 0 1,1 -18,0 a6,6 0 1,1 12,0", stroke: "#fff", "stroke-width": 5, fill: "none", "stroke-linecap": "round" }, spin);
      }
      P.orbit.push({ g, spin });
    }

    // ---------- Cartoon-Bohrmaschine (Spitze im Ursprung, zeigt nach rechts) ----------
    P.drWrap = G(P.drL, { x: DRILL.x, y: DRILL.y });
    P.drFly = S("g", null, P.drWrap); // Flug (x/y)
    P.drRot = G(P.drFly, {}); // Neigung (svgOrigin = Spitze)
    P.drVib = S("g", null, P.drRot); // Vibration / Schweben (x/y)
    const dg = S("g", { transform: `scale(${DS})` }, P.drVib);
    // Vibrations-Bögen (über und unter dem Gehäuse, damit nichts links aus dem Bild ragt)
    P.vib = [];
    ["M-290,-86 q40,-30 90,-14", "M-250,-110 q50,-34 110,-14", "M-100,60 q30,26 70,10"].forEach((d) => {
      P.vib.push(S("path", { d, stroke: "#fff", "stroke-width": 7, fill: "none", "stroke-linecap": "round", opacity: 0 }, dg));
    });
    // Akku + Griff
    S("path", { d: "M-262,30 L-196,30 L-212,162 L-284,162 Z", fill: C.b2 }, dg);
    for (let i = 0; i < 4; i++) S("line", { x1: -268 + i * 3, y1: 62 + i * 24, x2: -214 + i * 1, y2: 62 + i * 24, stroke: C.b1, "stroke-width": 5, "stroke-linecap": "round" }, dg);
    S("rect", { x: -322, y: 152, width: 150, height: 50, rx: 14, fill: C.b1 }, dg);
    S("rect", { x: -310, y: 160, width: 126, height: 9, rx: 4, fill: C.b3 }, dg);
    S("rect", { x: -196, y: 40, width: 15, height: 34, rx: 7, fill: C.red }, dg); // Abzug (kleiner Rot-Akzent)
    // Gehäuse
    S("rect", { x: -336, y: -56, width: 226, height: 100, rx: 44, fill: C.yellow }, dg);
    S("path", { d: "M-336,0 H-110 V0 Q-110,44 -154,44 H-292 Q-336,44 -336,0 Z", fill: C.yDark, opacity: 0.6 }, dg);
    S("rect", { x: -300, y: -46, width: 160, height: 12, rx: 6, fill: "#fff", opacity: 0.35 }, dg);
    S("rect", { x: -262, y: -24, width: 100, height: 40, rx: 14, fill: C.b2 }, dg);
    for (let i = 0; i < 3; i++) S("line", { x1: -318, y1: -24 + i * 16, x2: -296, y2: -24 + i * 16, stroke: C.yDark, "stroke-width": 5, "stroke-linecap": "round" }, dg);
    // Bohrfutter
    S("rect", { x: -120, y: -30, width: 48, height: 60, rx: 10, fill: C.b3 }, dg);
    S("path", { d: "M-72,-22 L-50,-12 L-50,12 L-72,22 Z", fill: C.b4 }, dg);
    [-108, -94, -80].forEach((xx) => S("line", { x1: xx, y1: -26, x2: xx, y2: 26, stroke: C.b2, "stroke-width": 3.5 }, dg));
    // Bohrer mit „drehender“ Spirale
    const bitD = "M-50,-8 L-16,-8 L4,0 L-16,8 L-50,8 Z";
    const cpb = S("clipPath", { id: "s03-bit" }, defs);
    S("path", { d: bitD }, cpb);
    S("path", { d: bitD, fill: C.b6 }, dg);
    const bitG = S("g", { "clip-path": "url(#s03-bit)" }, dg);
    P.bitStripes = S("g", null, bitG);
    for (let xx = -90; xx <= 30; xx += 16) S("line", { x1: xx, y1: 10, x2: xx + 12, y2: -10, stroke: C.b4, "stroke-width": 5 }, P.bitStripes);
    gsap.set(P.drFly, { x: -560, y: -170 });
    gsap.set(P.drRot, o0({ rotation: -28 }));

    // ---------- Kopfband hinter dem Titel ----------
    // Exakte Kopie des Bühnen-Hintergrunds (Farbe, Punktraster, Glow) oberhalb der Welt, weich ausgeblendet:
    // in der Totale unsichtbar, bei Zooms verdeckt es die Welt hinter dem Titel.
    const hm = S("mask", { id: "s03-hdrMask", maskUnits: "userSpaceOnUse", x: 0, y: 0, width: F.W, height: HDR.fade + 10 }, defs);
    const hg = SETS.gradient(svg, "s03HdrGrad", [[0, "#fff"], [HDR.solid / HDR.fade, "#fff"], [1, "#000"]]);
    S("rect", { x: 0, y: 0, width: F.W, height: HDR.fade, fill: hg }, hm);
    const hdr = S("g", { mask: "url(#s03-hdrMask)" }, st.root);
    S("rect", { x: 0, y: 0, width: F.W, height: HDR.fade + 10, fill: C.blue }, hdr);
    const hd = S("g", { opacity: 0.08 }, hdr);
    for (let yy = 40; yy < HDR.fade + 10; yy += 48) for (let xx = 40; xx < F.W; xx += 48) S("circle", { cx: xx, cy: yy, r: 2.2, fill: "#fff" }, hd);
    S("ellipse", { cx: GX, cy: GY, rx: 760, ry: 1100, fill: "url(#set-problemGlow)" }, hdr);
    // weicher Auslauf darunter — nur in der Nahaufnahme eingeblendet (kein harter Schnitt durch Anna)
    const SOFT = 610;
    const sm = S("mask", { id: "s03-softMask", maskUnits: "userSpaceOnUse", x: 0, y: 0, width: F.W, height: SOFT + 10 }, defs);
    const sg = SETS.gradient(svg, "s03SoftGrad", [[0, "#fff"], [HDR.fade / SOFT, "#fff"], [(HDR.fade + 60) / SOFT, "#fff", 0.55], [1, "#000"]]);
    S("rect", { x: 0, y: 0, width: F.W, height: SOFT, fill: sg }, sm);
    P.soft = S("g", { mask: "url(#s03-softMask)", opacity: 0 }, st.root);
    S("rect", { x: 0, y: 0, width: F.W, height: SOFT + 10, fill: C.blue }, P.soft);
    const sd = S("g", { opacity: 0.08 }, P.soft);
    for (let yy = 40; yy < SOFT + 10; yy += 48) for (let xx = 40; xx < F.W; xx += 48) S("circle", { cx: xx, cy: yy, r: 2.2, fill: "#fff" }, sd);
    S("ellipse", { cx: GX, cy: GY, rx: 760, ry: 1100, fill: "url(#set-problemGlow)" }, P.soft);

    // ---------- Texte (HUD) ----------
    const hud = R.huds[ctx.id];
    const title = ANIM.el("div", "t-title", hud);
    title.style.cssText = "left:0; top:222px; width:1080px; text-align:center; font-size:80px;";
    P.title = ["Klassische", "Fliegengitter"].map((t) => {
      const sp = ANIM.el("span", null, title, t);
      sp.style.display = "block";
      gsap.set(sp, { opacity: 0, y: 34 });
      return sp;
    });
    P.tbar = ANIM.el("div", null, hud);
    P.tbar.style.cssText = "position:absolute; left:492px; top:400px; width:96px; height:8px; background:#f6a206;";
    gsap.set(P.tbar, { scaleX: 0, transformOrigin: "50% 50%" });
    // 2×2-Raster über der Untertitel-Zone
    P.chips = ["aufgesetzt", "auffällig", "Stolperkante", "Bohren nötig"].map((t, i) => {
      const el = ANIM.el("div", "chip", hud, `<span class="bar"></span>${t}`);
      el.style.cssText = `left:${i % 2 ? 550 : 90}px; top:${i < 2 ? 1160 : 1252}px; width:440px; font-size:42px; padding:12px 24px 12px 22px;`;
      const bar = el.querySelector(".bar");
      bar.style.height = "42px";
      gsap.set(el, { opacity: 0, transformOrigin: "50% 50%" });
      gsap.set(bar, { scaleY: 0 });
      return { el, bar };
    });
  }

  function build(ctx, tl, R) {
    const { C } = SVGK;
    const st = R.sets.problem, P = st.p, cam = st.cam, anna = st.anna, f = anna.face;
    const r = SVGK.rng(3303);
    const t0 = ctx.t0, t1 = ctx.t1;
    const tK = ctx.w("klassische"), tFl = ctx.w("fliegengitter"), tA = ctx.w("aufgesetzt");
    const tF = ctx.w("auffällig"), tS = ctx.w("stolperkante"), tG = ctx.w("gebohrt");
    const tAuch = ctx.w("auch"), tNoch = ctx.w("noch");
    const L = (rx, lx, ly) => ({ x: rx + lx * AS, y: FY + ly * AS }); // Anna-lokal -> Welt
    const browsAsym = (t, dur) => {
      // skeptisch: linke Braue hoch, rechte gesenkt
      const a = o0({ rotation: -6, y: -12 }), b = o0({ rotation: -13, y: 3 });
      if (t <= 0.0001) { gsap.set(f.brows[0].el, a); gsap.set(f.brows[1].el, b); }
      else {
        tl.to(f.brows[0].el, Object.assign(a, { duration: dur, ease: "power2.out" }), t);
        tl.to(f.brows[1].el, Object.assign(b, { duration: dur, ease: "power2.out" }), t);
      }
    };
    const squint = (t, on) => {
      tl.set(f.eyes, { opacity: on ? 0 : 1 }, t);
      tl.set(P.squint, { opacity: on ? 1 : 0 }, t);
    };

    // ================= Startzustand (ab t0 - 0.3 sichtbar) =================
    cam.to(tl, 0, CAM0, 0);
    anna.init(tl);
    anna.mouth(tl, 0, "smirk").look(tl, 0, -5, -1, 0);
    anna.pose(tl, 0, { armL: [28, -118], head: 5, lean: 0 }, 0);
    ANIM.reach(tl, 0, anna, "armR", L(AX0, 26, -424), { x: AX0, y: FY }, AS, -1, 0);
    browsAsym(0);
    anna.breathe(tl, t0 - 0.3, t1, 0.014, 1.7);
    [t0 + 0.55, tFl + 0.78, tA + 0.55, tS - 0.45, tS + 0.98, tNoch + 0.22].forEach((t) => anna.blink(tl, t));

    // ================= „Klassische“ — Titel =================
    tl.to(P.title, { opacity: 1, y: 0, duration: 0.5, ease: "power3.out", stagger: 0.09 }, Math.max(tK, t0 + 0.32));
    tl.to(P.tbar, { scaleX: 1, duration: 0.45, ease: "power3.inOut" }, Math.max(tK, t0 + 0.32) + 0.2);
    ANIM.sfx(Math.max(tK, t0 + 0.32), "swish", -12);
    tl.to(anna.head, o0({ rotation: 9, duration: 0.4, ease: "sine.inOut" }), tK + 0.1);
    anna.look(tl, tK + 0.15, -6, -4, 0.2);

    // ================= „Fliegengitter“ — fällt von oben (hinter dem Titelband hervor), federt =================
    const tFall = tFl - 0.44;
    ANIM.sfx(tFall - 0.02, "whoosh", -4);
    tl.fromTo(P.fWrap, { y: -1220 }, { y: 0, duration: 0.44, ease: "power2.in" }, tFall);
    tl.fromTo(P.fSq, o0({ scaleX: 1, scaleY: 1 }), o0({ scaleX: 0.93, scaleY: 1.1, duration: 0.42, ease: "sine.in" }), tFall);
    tl.to(P.fShadow, { opacity: 1, duration: 0.12, ease: "power1.out" }, tFl - 0.03);
    tl.to(P.fSq, o0({ scaleX: 1.08, scaleY: 0.8, duration: 0.07, ease: "power2.out" }), tFl);
    tl.to(P.fSq, o0({ scaleX: 0.97, scaleY: 1.05, duration: 0.15, ease: "power2.out" }), tFl + 0.07);
    tl.to(P.fWrap, { y: -26, duration: 0.15, ease: "power2.out" }, tFl + 0.07);
    tl.to(P.fWrap, { y: 0, duration: 0.14, ease: "power2.in" }, tFl + 0.22);
    tl.to(P.fSq, o0({ scaleX: 1, scaleY: 1, duration: 0.14, ease: "sine.inOut" }), tFl + 0.22);
    tl.to(P.fSq, o0({ scaleX: 1.03, scaleY: 0.93, duration: 0.06, ease: "power1.out" }), tFl + 0.36);
    tl.to(P.fSq, o0({ scaleX: 1, scaleY: 1, duration: 0.45, ease: "back.out(3)" }), tFl + 0.42);
    ANIM.sfx(tFl, "thud", 0);
    ANIM.sfx(tFl + 0.07, "boing", -11);
    ANIM.sfx(tFl + 0.36, "thud", -9);
    cam.shake(tl, tFl, 20, 0.3);
    const puff = (set, t, k) => {
      P.puffs[set].forEach(({ sd, arr }) => {
        const cx = FX + sd * (FR.railHW - 6), cy = FY - 8;
        arr.forEach((c, i) => {
          const a = (-10 - i * 22) * (Math.PI / 180);
          const dx = sd * Math.cos(a) * (64 + i * 14) * k, dy = Math.sin(a) * (40 + i * 12) * k;
          tl.fromTo(c, { x: cx, y: cy, attr: { r: 8 }, opacity: 1 }, { x: cx + dx, y: cy + dy, attr: { r: (22 + i * 5) * k }, duration: 0.5, ease: "power2.out", immediateRender: false }, t + i * 0.015);
          tl.to(c, { opacity: 0, duration: 0.32, ease: "power1.in" }, t + 0.36 + i * 0.015);
        });
      });
    };
    puff(0, tFl, 1);
    puff(1, tFl + 0.36, 0.6);

    // Anna erschrickt — dann skeptisch, Hände in die Hüften
    tl.to(anna.root, { y: FY - 26, duration: 0.13, ease: "power2.out" }, tFl + 0.02);
    tl.to(anna.root, { y: FY, duration: 0.16, ease: "power2.in" }, tFl + 0.15);
    anna.pose(tl, tFl + 0.02, { armL: [70, -40], armR: [-70, 40], head: -3 }, 0.14, "back.out(2)");
    anna.mouth(tl, tFl + 0.02, "O").brows(tl, tFl + 0.02, "surprised", 0.1).look(tl, tFl + 0.02, -6, -3, 0.08);
    tl.to(anna.lean, o0({ scaleY: 0.94, scaleX: 1.03, duration: 0.08, ease: "power2.out" }), tFl + 0.31);
    tl.to(anna.lean, o0({ scaleY: 1, scaleX: 1, duration: 0.32, ease: "back.out(2.5)" }), tFl + 0.39);
    anna.pose(tl, tFl + 0.5, { armL: [28, -118], armR: [-34, 116], head: 4 }, 0.35, "power2.inOut");
    anna.mouth(tl, tFl + 0.52, "flat").look(tl, tFl + 0.6, -6, -1, 0.15);
    browsAsym(tFl + 0.55, 0.22);

    // ================= „aufgesetzt“ — steht sichtbar vor der Tür =================
    const tA0 = tA - 0.14;
    tl.to(P.fBody, { y: -18, duration: 0.16, ease: "power2.out" }, tA0);
    tl.to(P.fShadow, { x: 22, y: 16, duration: 0.36, ease: "back.out(2)" }, tA0 + 0.04);
    tl.to(P.fBody, { y: 0, duration: 0.13, ease: "power2.in" }, tA0 + 0.18);
    ANIM.sfx(tA0 + 0.31, "clunk", -7);
    anna.pose(tl, tA - 0.12, { armL: [100, -12], head: -4 }, 0.26, "back.out(1.8)");
    anna.mouth(tl, tA, "smirk").look(tl, tA - 0.1, -8, -2, 0.12).brows(tl, tA, "sly", 0.2);

    // ================= „auffällig“ — der Rahmen schreit =================
    tl.to(P.fSq, o0({ scaleX: 1.035, scaleY: 1.05, duration: 0.12, ease: "power2.out" }), tF - 0.06);
    tl.to(P.fSq, o0({ scaleX: 1, scaleY: 1, duration: 0.6, ease: "elastic.out(1, 0.4)" }), tF + 0.06);
    tl.to(P.glare, { x: 520, duration: 0.62, ease: "power2.inOut" }, tF - 0.1);
    const rays = (grp, t) => grp.forEach((p, i) => {
      tl.set(p, { opacity: 1 }, t + i * 0.035);
      tl.set(p, { opacity: 0 }, t + 0.57 + i * 0.02);
      tl.fromTo(p, { drawSVG: "0% 0%" }, { drawSVG: "0% 100%", duration: 0.2, ease: "power3.out", immediateRender: false }, t + i * 0.035);
      tl.to(p, { drawSVG: "100% 100%", duration: 0.2, ease: "power2.in" }, t + 0.36 + i * 0.02);
    });
    rays(P.att[0], tF - 0.04);
    rays(P.att[1], tF - 0.01);
    rays(P.att[2], tF + 0.24);
    ANIM.sfx(tF - 0.06, "sparkle", -6);
    ANIM.sfx(tF + 0.22, "buzzShort", -14);
    // Anna verzieht das Gesicht, schirmt die Augen ab
    ANIM.reach(tl, tF - 0.06, anna, "armL", L(AX0, -40, -556), { x: AX0, y: FY }, AS, 1, 0.2, "power3.out");
    tl.to(anna.head, o0({ rotation: 7, duration: 0.2, ease: "power3.out" }), tF - 0.04);
    tl.to(anna.lean, o0({ rotation: 4, duration: 0.22, ease: "power2.out" }), tF - 0.04);
    anna.mouth(tl, tF, "grimace").brows(tl, tF, "annoyed", 0.12).look(tl, tF, -4, 2, 0.1);
    tl.to(f.eyes, o0({ scaleY: 0.5, duration: 0.1, ease: "power2.out" }), tF);
    tl.to(f.eyes, o0({ scaleY: 1, duration: 0.14, ease: "power2.out" }), tF + 0.42);

    // ================= „mit Stolperkante“ — Nahaufnahme Bodenschiene, Anlauf, Stolpern =================
    const tW0 = Math.max(tF + 0.46, tS - 0.68);
    const nSt = 4, step = (tS - tW0) / nSt;
    cam.to(tl, tW0 - 0.04, CAM_TRIP, Math.min(0.62, tS - tW0 + 0.02), "power2.inOut");
    tl.to(P.soft, { opacity: 1, duration: 0.5, ease: "power1.inOut" }, tW0 + 0.04);
    ANIM.sfx(tW0 - 0.04, "whooshSoft", -11);
    anna.pose(tl, tW0 - 0.08, { armL: [16, -10], armR: [-16, 10], head: -2 }, 0.2, "power2.out");
    tl.to(anna.lean, o0({ rotation: -6, duration: 0.25, ease: "power2.inOut" }), tW0 - 0.06);
    anna.mouth(tl, tW0, "flat").brows(tl, tW0, "neutral", 0.15).look(tl, tW0, -7, 1, 0.12);
    tl.to(anna.root, { x: AXT, duration: tS - tW0, ease: "sine.in" }, tW0);
    for (let i = 0; i < nSt; i++) {
      const t = tW0 + i * step, sg = i % 2 ? 1 : -1, sw = 21;
      tl.to(anna.legL.u, o0({ rotation: sw * sg, duration: step, ease: "sine.inOut" }), t);
      tl.to(anna.legR.u, o0({ rotation: -sw * sg, duration: step, ease: "sine.inOut" }), t);
      tl.to(anna.legL.f, o0({ rotation: sg > 0 ? 0 : 16, duration: step, ease: "sine.inOut" }), t);
      tl.to(anna.legR.f, o0({ rotation: sg > 0 ? 16 : 0, duration: step, ease: "sine.inOut" }), t);
      tl.to(anna.root, { y: FY - 8, duration: step / 2, ease: "sine.out", yoyo: true, repeat: 1 }, t);
      if (i > 0) {
        tl.to(anna.armL.u, o0({ rotation: 16 - 14 * sg, duration: step, ease: "sine.inOut" }), t);
        tl.to(anna.armR.u, o0({ rotation: -16 - 14 * sg, duration: step, ease: "sine.inOut" }), t);
      }
      if (i < nSt - 1) ANIM.sfx(t + step, "tap", -15);
    }
    // Stolpern: Fuß hängt an der Schiene, Oberkörper kippt, Arme rudern
    ANIM.sfx(tS, "trip", -2);
    ANIM.burst(tl, P.fx, FX + FR.railHW + 4, FY - 30, tS, { n: 7, len: 26, r0: 14, w: 5, color: C.yellow, seed: 77 });
    tl.to(anna.root, { x: AXT - 30, duration: 0.26, ease: "power2.out" }, tS);
    tl.to(anna.lean, o0({ rotation: -21, duration: 0.24, ease: "power2.out" }), tS);
    anna.pose(tl, tS, { legL: [-8, 10], legR: [-38, -52] }, 0.16, "power2.out");
    const flail = [[150, 30, -60, -20], [55, -30, -155, -30], [165, 25, -70, -10], [80, -20, -165, -25]];
    flail.forEach((p, i) => anna.pose(tl, tS + i * 0.105, { armL: [p[0], p[1]], armR: [p[2], p[3]] }, 0.105, "sine.inOut"));
    anna.mouth(tl, tS, "O").brows(tl, tS, "surprised", 0.08);
    tl.to(f.eyes, o0({ scaleY: 1.18, scaleX: 1.1, duration: 0.08, ease: "power2.out" }), tS);
    tl.to(f.pupils, { scale: 0.6, transformOrigin: "50% 50%", duration: 0.08, ease: "power2.out" }, tS);
    tl.to(anna.head, o0({ rotation: -10, duration: 0.2, ease: "power2.out" }), tS);
    // Bonk an den Rahmen — Gitter wackelt, Sterne
    const tB = tS + 0.27;
    ANIM.sfx(tB, "bonk", -2);
    ANIM.sfx(tB + 0.06, "stars", -6);
    tl.to(P.fSq, o0({ rotation: -1.6, duration: 0.07, ease: "power2.out" }), tB);
    tl.to(P.fSq, o0({ rotation: 0, duration: 0.7, ease: "elastic.out(1.2, 0.3)" }), tB + 0.07);
    cam.shake(tl, tB, 10, 0.2);
    tl.to(anna.lean, o0({ rotation: 4, duration: 0.18, ease: "power2.out" }), tB);
    tl.to(anna.lean, o0({ rotation: 0, duration: 0.5, ease: "back.out(2.6)" }), tB + 0.18);
    tl.to(anna.root, { x: AXR, duration: 0.32, ease: "power2.out" }, tB);
    anna.pose(tl, tB + 0.04, { legL: [0, 0], legR: [0, 0] }, 0.26, "back.out(1.8)");
    tl.to(anna.head, o0({ rotation: 9, duration: 0.12, ease: "power2.out" }), tB);
    tl.to(anna.head, o0({ rotation: -6, duration: 0.22, ease: "sine.inOut" }), tB + 0.14);
    tl.to(anna.head, o0({ rotation: 4, duration: 0.24, ease: "sine.inOut" }), tB + 0.36);
    tl.to(anna.head, o0({ rotation: 0, duration: 0.24, ease: "sine.inOut" }), tB + 0.6);
    anna.eyesClosed(tl, tB, true).eyesClosed(tl, tB + 0.13, false);
    tl.to(f.eyes, o0({ scaleY: 1, scaleX: 1, duration: 0.16, ease: "power2.out" }), tB + 0.13);
    tl.to(f.pupils, { scale: 1, transformOrigin: "50% 50%", duration: 0.16, ease: "power2.out" }, tB + 0.13);
    tl.to(f.pupils[0], { x: 5, y: 1, duration: 0.12, ease: "power2.out" }, tB + 0.13);
    tl.to(f.pupils[1], { x: -5, y: 1, duration: 0.12, ease: "power2.out" }, tB + 0.13);
    anna.mouth(tl, tB + 0.13, "wavy").brows(tl, tB + 0.13, "worried", 0.15);
    // Hand an die Stirn, gefangen
    ANIM.reach(tl, tS + 0.44, anna, "armR", L(AXR, 34, -548), { x: AXR, y: FY }, AS, -1, 0.22, "back.out(1.6)");
    anna.pose(tl, tS + 0.44, { armL: [22, -16] }, 0.3, "power2.out");
    // Sternchen kreisen
    const tSt0 = tB + 0.04, tSt1 = Math.min(tG - 0.12, tSt0 + 1.1);
    tl.to(P.stars, { opacity: 1, duration: 0.1, ease: "power1.out" }, tSt0);
    P.orbit.forEach((o, i) => {
      const a0 = i / P.orbit.length;
      tl.fromTo(o.g, { motionPath: { path: P.orbitPath, start: a0, end: a0 } }, { motionPath: { path: P.orbitPath, start: a0, end: a0 + 1.4 }, duration: tSt1 - tSt0, ease: "sine.inOut", immediateRender: false }, tSt0);
      tl.fromTo(o.spin, o0({ rotation: 0, scale: 0.4 }), o0({ rotation: 300, scale: 1, duration: tSt1 - tSt0, ease: "power1.out", immediateRender: false }), tSt0);
    });
    tl.to(P.stars, { opacity: 0, duration: 0.16, ease: "power1.in" }, tSt1 - 0.12);
    // Kamera zieht nach dem Bonk zurück — Reveal: Anna mit Sternchen
    const tZo = tB + 0.05;
    cam.to(tl, tZo, CAM0, Math.min(0.5, tG - 0.55 - tZo), "power3.inOut");
    tl.to(P.soft, { opacity: 0, duration: 0.3, ease: "power1.in" }, tZo);
    ANIM.sfx(tZo, "whooshSoft", -12);
    const tRec = Math.min(tS + 0.85, tG - 0.62);
    tl.to(f.pupils, { x: -3, y: 0, duration: 0.18, ease: "power2.out" }, tRec + 0.05);
    anna.mouth(tl, tRec + 0.05, "frown").brows(tl, tRec + 0.05, "annoyed", 0.18);
    anna.pose(tl, tRec + 0.1, { armR: [-16, 10], armL: [16, -10] }, 0.3, "power2.inOut");

    // ================= „gebohrt“ — die Bohrmaschine =================
    const tDi = tG - 0.52;
    const tEnd = Math.max(tG + 0.55, tAuch - 0.08);
    const tMid = tG + (tEnd - tG) * 0.45;
    // langsamer Push-in, bleibt bis zum Szenenende
    cam.to(tl, tG - 0.2, CAM_DRILL, Math.max(0.6, t1 - (tG - 0.2)), "sine.inOut");
    ANIM.sfx(tDi, "swish", -5);
    tl.to(P.drFly, { x: -42, duration: 0.42, ease: "power3.out" }, tDi);
    tl.to(P.drFly, { y: 0, duration: 0.42, ease: "back.out(1.6)" }, tDi);
    tl.to(P.drRot, o0({ rotation: 0, duration: 0.46, ease: "back.out(2)" }), tDi);
    tl.to(P.drFly, { x: 0, duration: 0.1, ease: "power2.in" }, tG - 0.1);
    ANIM.sfx(tG - 0.02, "drill", -3, { dur: tEnd - tG + 0.05 });
    const nb = Math.max(1, Math.floor((tEnd - tG + 0.18) / 0.05) - 1);
    tl.fromTo(P.bitStripes, { x: 0 }, { x: 16, duration: 0.05, ease: "none", repeat: nb, immediateRender: false }, tG - 0.18);
    const nv = Math.max(1, 2 * Math.floor((tEnd - tG) / 0.07) - 1);
    tl.fromTo(P.drVib, { x: -1.8, y: -1.3 }, { x: 1.8, y: 1.3, duration: 0.035, ease: "sine.inOut", yoyo: true, repeat: nv, immediateRender: false }, tG);
    tl.to(P.drVib, { x: 0, y: 0, duration: 0.05, ease: "power1.out" }, tG + (nv + 1) * 0.035);
    P.vib.forEach((v, i) => tl.fromTo(v, { opacity: 0 }, { opacity: 0.8, duration: 0.06, ease: "sine.inOut", yoyo: true, repeat: Math.max(1, 2 * Math.floor((tEnd - tG) / 0.12) - 1), immediateRender: false }, tG + i * 0.03));
    // zum zweiten Loch
    tl.to(P.drFly, { x: -22, duration: 0.08, ease: "power2.out" }, tMid);
    tl.to(P.drFly, { y: HOLES[1].y - HOLES[0].y, duration: 0.16, ease: "power2.inOut" }, tMid + 0.04);
    tl.to(P.drFly, { x: 0, duration: 0.08, ease: "power2.in" }, tMid + 0.18);
    tl.to(P.holes[0], o0({ scale: 1, duration: tMid - tG - 0.06, ease: "power1.out" }), tG + 0.06);
    tl.to(P.holes[1], o0({ scale: 1, duration: tEnd - tMid - 0.3, ease: "power1.out" }), tMid + 0.28);
    // Bohrstaub
    const spawn = (tA_, tB_, ho, idx0, n) => {
      for (let i = 0; i < n; i++) {
        const c = P.dust[idx0 + i];
        const t = tA_ + ((tB_ - tA_) * (i + r() * 0.6)) / n;
        const sx = ho.x + 4, sy = ho.y + (r() - 0.5) * 8;
        const dx = -(16 + r() * 60), up = -(8 + r() * 26), down = 60 + r() * (FY - sy - 40);
        tl.fromTo(c, { x: sx, opacity: 1 }, { x: sx + dx, duration: 0.55, ease: "power2.out", immediateRender: false }, t);
        tl.fromTo(c, { y: sy }, { y: sy + up, duration: 0.14, ease: "power2.out", immediateRender: false }, t);
        tl.to(c, { y: Math.min(FY - 6, sy + down), duration: 0.42, ease: "power2.in" }, t + 0.14);
        tl.to(c, { opacity: 0, duration: 0.12, ease: "power1.in" }, t + 0.44);
      }
    };
    spawn(tG + 0.03, tMid - 0.02, HOLES[0], 0, 11);
    spawn(tMid + 0.26, tEnd - 0.04, HOLES[1], 11, 11);
    tl.to(P.heap, { attr: { rx: 28, ry: 10 }, duration: tEnd - tG, ease: "power1.out" }, tG + 0.3);
    // wegschweben (leicht abgesetzt, nach unten), dann schweben
    tl.to(P.drFly, { x: -10, y: 236, duration: 0.45, ease: "back.out(1.7)" }, tEnd + 0.03);
    tl.to(P.drRot, o0({ rotation: -9, duration: 0.45, ease: "back.out(2)" }), tEnd + 0.03);
    const tHov = tEnd + 0.48, nh = Math.max(1, 2 * Math.ceil((t1 - tHov) / 0.9) - 1);
    tl.fromTo(P.drVib, { y: 0 }, { y: -9, duration: 0.45, ease: "sine.inOut", yoyo: true, repeat: nh, immediateRender: false }, tHov);
    // Anna hält sich die Ohren zu
    const tE = tG - 0.12;
    ANIM.reach(tl, tE, anna, "armL", L(AXR, -84, -494), { x: AXR, y: FY }, AS, 1, 0.18, "back.out(1.6)");
    ANIM.reach(tl, tE, anna, "armR", L(AXR, 84, -494), { x: AXR, y: FY }, AS, -1, 0.18, "back.out(1.6)");
    squint(tG, true);
    anna.mouth(tl, tG, "grimace").brows(tl, tG, "angry", 0.1);
    const nhd = Math.max(1, 2 * Math.floor((tEnd - tG) / 0.16) - 1);
    tl.fromTo(anna.head, o0({ rotation: -2.5 }), o0({ rotation: 2.5, duration: 0.08, ease: "sine.inOut", yoyo: true, repeat: nhd, immediateRender: false }), tG + 0.02);
    tl.to(anna.head, o0({ rotation: 0, duration: 0.1, ease: "power1.out" }), tG + 0.02 + (nhd + 1) * 0.08);

    // ================= „auch noch“ — rotes Kreuz, Anna zuckt mit den Schultern =================
    const tC1 = Math.min(tAuch - 0.1, t1 - 0.9), tC2 = tC1 + 0.24;
    tl.set(P.cross[0], { opacity: 1 }, tC1);
    tl.set(P.cross[1], { opacity: 1 }, tC2);
    tl.fromTo(P.cross[0], { drawSVG: "0% 0%" }, { drawSVG: "0% 100%", duration: 0.28, ease: "power3.inOut", immediateRender: false }, tC1);
    tl.fromTo(P.cross[1], { drawSVG: "0% 0%" }, { drawSVG: "0% 100%", duration: 0.28, ease: "power3.inOut", immediateRender: false }, tC2);
    ANIM.sfx(tC1, "scribble", -4);
    ANIM.sfx(tC2, "scribble", -5);
    const tHd = tEnd + 0.06;
    anna.pose(tl, tHd, { armL: [14, -8], armR: [-14, 8] }, 0.3, "power2.out");
    squint(tHd, false);
    anna.mouth(tl, tHd, "flat").brows(tl, tHd, "annoyed", 0.15).look(tl, tHd, -7, 1, 0.14);
    const tSh = Math.max(tC2 + 0.12, tNoch - 0.05, tHd + 0.32);
    anna.pose(tl, tSh, { armL: [8, 112], armR: [-8, -112], head: 8 }, 0.32, "back.out(2)"); // kompaktes Schulterzucken (bleibt im Bild)
    tl.to(anna.lean, o0({ scaleY: 1.025, duration: 0.2, ease: "power2.out", yoyo: true, repeat: 1 }), tSh);
    anna.mouth(tl, tSh, "smirk").look(tl, tSh + 0.05, 2, -2, 0.15);
    browsAsym(tSh, 0.2);

    // ================= Labels (2×2-Raster) =================
    const chip = (i, t) => {
      const c = P.chips[i];
      tl.fromTo(c.el, { opacity: 0, scale: 0.6, y: 22 }, { opacity: 1, scale: 1, y: 0, duration: 0.42, ease: "back.out(2.2)", immediateRender: false }, t - 0.05);
      tl.to(c.bar, { scaleY: 1, duration: 0.3, ease: "power3.out" }, t + 0.06);
      ANIM.sfx(t - 0.04, "pop", -6);
    };
    chip(0, tA);
    chip(1, tF);
    chip(2, tS + 0.06);
    chip(3, tG);
  }

  (window.SCENES = window.SCENES || {}).s03 = { set: "problem", setup, build };
})();
