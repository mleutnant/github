// s07 (9:16) — „Keine Stolperkante im Durchgangsbereich: bequem für Kinder, Großeltern – und das volle Tablett.“
// Hochformat: Kamera nah an der bündigen Schwelle (Seitenansicht im Schnitt, links innen, rechts Terrasse).
// Start nah auf Kind + Schwelle (Stolperkanten-Gag), dann Rückfahrt, damit Opa ins Bild kommt, danach
// Schwenk nach rechts mit Opa und Anna, die ein volles Tablett Limonade nach draußen trägt (nichts schwappt). Die Lupe (bildfest, rechts unter den Chips) zeigt live die
// in die Schwelle eingelassene Führungsschiene; ihre Verbindungslinien folgen der Kamera.
(function () {
  const FLOOR = 820; // Bodenlinie innen = Terrasse außen
  const TH = { x0: 926, x1: 994, y1: 870 }; // Schwellenprofil (Welt)
  const PLANE = 941; // Türebene / Plissee-Linie
  const YF = 1316; // Bodenlinie im Bild (knapp über der Untertitel-Zone)
  // Lupe: Bildmitte (x,y), Radius, Vergrößerung (Bild-px je Welt-px), Weltmittelpunkt
  const LENS = { x: 818, y: 604, r: 150, z: 3.2, cx: 958, cy: 822 };
  const S_OPA = 0.8, S_KID = 0.9, S_ANNA = 0.74;
  const KID_WAIT = 828, KID_PARK = 1780, KID_GAP = 14;
  const OPA = { v: 220, T: 0.92, beta: 0.62, alpha: 5, rdx: 42 }; // Gehtempo (px/s), Zyklus (s), Standphase, Vorlage (°), Rollator-Versatz
  const GRIP = { x: 82 + 42, y: -257 }; // Griffmitte im Opa-Basisraum (inkl. Rollator-Versatz)

  // ---------- Hilfen ----------
  // Dreh-/Skalier-Gruppe mit Drehpunkt (px,py) um ein vorhandenes SVGK.G-Element legen
  function pivot(el, px, py) {
    const { S } = SVGK;
    const w = el._wrap, parent = w.parentNode;
    const pw = S("g", { transform: `translate(${px},${py})` });
    parent.insertBefore(pw, w);
    const pi = S("g", null, pw);
    const back = S("g", { transform: `translate(${-px},${-py})` }, pi);
    back.appendChild(w);
    pi._wrap = pw;
    return pi;
  }
  const smooth = (u) => (u <= 0 ? 0 : u >= 1 ? 1 : u * u * (3 - 2 * u));
  const rotP = (deg, x, y) => {
    const r = (deg * Math.PI) / 180, c = Math.cos(r), s = Math.sin(r);
    return [x * c - y * s, x * s + y * c];
  };

  // ---------- Opa-Gangzyklus (prozedural, deterministisch) ----------
  // Füße stehen in der Standphase fest am Boden (Ferse-, Fuß-, Ballen-Abrollen), Schwungbein im Bogen,
  // Hüfthöhe folgt der Beinreichweite (Körper wippt), Hand per IK exakt am Rollatorgriff.
  function buildGait() {
    const L1 = 112, L2 = 104, A1 = 96, A2 = 84, N = 240;
    const { v, T, beta, alpha } = OPA;
    const Sb = (v / S_OPA) * T; // Weg je Doppelschritt in Basis-Einheiten
    const eps = 0.08, TAU = Math.PI * 2;
    const Gb = (tau) => Sb * tau + ((Sb * eps) / (2 * TAU)) * Math.sin(2 * TAU * (tau - 0.06));
    const ar = (alpha * Math.PI) / 180, ca = Math.cos(ar), sa = Math.sin(ar);
    const rot = (x, y) => [x * ca - y * sa, x * sa + y * ca];
    const P1 = 0.08, P2 = 0.4, PSI_HS = -14, PSI_TO = 30, LIFT = 24;
    const HEEL = [-18, 4], TOE = [26, 4];
    function foot(phi) {
      // relativ zur Fersenposition beim Aufsetzen: [Knöchel x, Knöchel y, Fußneigung]
      if (phi < P1) {
        const psi = PSI_HS * (1 - smooth(phi / P1));
        const h = rotP(psi, HEEL[0], HEEL[1]);
        return [-h[0], -h[1], psi];
      }
      if (phi < P2) return [18, -4, 0];
      if (phi < beta) {
        const psi = PSI_TO * smooth((phi - P2) / (beta - P2));
        const t = rotP(psi, TOE[0], TOE[1]);
        return [44 - t[0], -t[1], psi];
      }
      const u = (phi - beta) / (1 - beta);
      const t = rotP(PSI_TO, TOE[0], TOE[1]), a0 = [44 - t[0], -t[1]];
      const h = rotP(PSI_HS, HEEL[0], HEEL[1]), a1 = [Sb - h[0], -h[1]];
      const k = smooth(u);
      return [a0[0] + (a1[0] - a0[0]) * k, a0[1] + (a1[1] - a0[1]) * k - LIFT * Math.sin(Math.PI * Math.pow(u, 0.8)), PSI_TO + (PSI_HS - PSI_TO) * smooth(Math.min(1, u * 1.25))];
    }
    const legs = [
      { key: "legR", side: 1, off: 0 },
      { key: "legL", side: -1, off: 0.5 },
    ];
    const d = [-sa, ca]; // Richtung der Wipp-Verschiebung (Lean-Gruppe ist um alpha gedreht)
    legs.forEach((L) => {
      const hx = rot(L.side * 6, -232 + 20)[0];
      L.h0 = hx + 6 - 18 + (Gb(0.31) - Gb(0));
    });
    const ankle = (L, tau) => {
      let loc = tau - L.off;
      loc -= Math.floor(loc);
      const f = foot(loc);
      return { x: L.h0 + f[0] - (Gb(loc) - Gb(0)), y: f[1], pitch: f[2], stance: loc < beta };
    };
    const hip = (side, b) => { const p = rot(side * 6, -232 + b); return { x: p[0], y: p[1] }; };
    // minimale Absenkung b, damit das Standbein (fast gestreckt) den Boden erreicht
    const K = 0.972 * (L1 + L2);
    const needB = (side, a) => {
      const h0 = hip(side, 0), w = [h0.x - a.x, h0.y - a.y];
      const wd = w[0] * d[0] + w[1] * d[1], ww = w[0] * w[0] + w[1] * w[1];
      const disc = wd * wd - ww + K * K;
      return -wd - Math.sqrt(Math.max(0, disc));
    };
    const bReq = [];
    for (let i = 0; i < N; i++) {
      const tau = i / N;
      let b = 8;
      legs.forEach((L) => { const a = ankle(L, tau); if (a.stance) b = Math.max(b, needB(L.side, a)); });
      bReq.push(b);
    }
    const blur = (arr, w) => arr.map((_, i) => { let s = 0; for (let k = -w; k <= w; k++) s += arr[(i + k + N) % N]; return s / (2 * w + 1); });
    let bob = blur(bReq, 10).map((b, i) => Math.max(b, bReq[i]));
    bob = blur(bob, 4).map((b) => b + 0.6);
    const ch = { legR: [[], [], []], legL: [[], [], []], arm: [[], [], []], bob, head: [] };
    const HAND_PITCH = -18;
    for (let i = 0; i < N; i++) {
      const tau = i / N, b = bob[i];
      legs.forEach((L) => {
        const a = ankle(L, tau);
        const [ub, f] = ANIM.ik(hip(L.side, b), a, L1, L2, 1);
        ch[L.key][0].push(ub - alpha);
        ch[L.key][1].push(f);
        ch[L.key][2].push(a.pitch - ub - f);
      });
      const sp = rot(14, -430 + b);
      const hp = rotP(HAND_PITCH, 0, 4);
      const [ub, f] = ANIM.ik({ x: sp[0], y: sp[1] }, { x: GRIP.x - hp[0], y: GRIP.y - hp[1] }, A1, A2, -1);
      ch.arm[0].push(ub - alpha);
      ch.arm[1].push(f);
      ch.arm[2].push(HAND_PITCH - ub - f);
      ch.head.push(-4 + 1.4 * Math.sin(2 * TAU * (tau - 0.12)));
    }
    const sample = (arr, tau) => {
      let fr = tau - Math.floor(tau);
      const x = fr * N, i0 = Math.floor(x) % N, t = x - Math.floor(x);
      return arr[i0] * (1 - t) + arr[(i0 + 1) % N] * t;
    };
    return { Gb, ch, sample, legs, ankle, Sb };
  }

  // Kamera-Kurven als reine Funktionen (deterministisch, beim Seeken exakt)
  const E = {
    sine: (u) => -(Math.cos(Math.PI * u) - 1) / 2,
    p2: (u) => (u < 0.5 ? 2 * u * u : 1 - Math.pow(-2 * u + 2, 2) / 2),
  };
  const clamp01 = (u) => (u < 0 ? 0 : u > 1 ? 1 : u);

  (window.SCENES = window.SCENES || {}).s07 = {
    set: "access",
    setup(R, ctx) {
      const { S, G, C, rng } = SVGK;
      const svg = R.svg;
      const defs = svg.querySelector("defs") || S("defs", null, svg);
      const root = S("g", { id: "set-access" }, svg);
      const st = { root };
      R.sets.access = st;
      S("rect", { x: 0, y: 0, width: SVGK.F.W, height: SVGK.F.H, fill: C.cream }, root);
      const cam = SETS.camera(root);
      st.cam = cam;
      const scene = S("g", { id: "acc-scene" }, cam.pos);
      st.sky = S("g", null, scene);
      st.far = S("g", null, scene);
      st.fg = S("g", null, scene);
      const fg = st.fg;

      // Muster: Schraffur für Schnittflächen
      const hatch = (id, col, gap, w, op) => {
        const p = S("pattern", { id, width: gap, height: gap, patternUnits: "userSpaceOnUse", patternTransform: "rotate(45)" }, defs);
        S("line", { x1: 0, y1: 0, x2: 0, y2: gap, stroke: col, "stroke-width": w, opacity: op }, p);
        return `url(#${id})`;
      };
      const hatchWall = hatch("accHatchW", C.cream3, 16, 3, 0.9);
      const hatchSlab = hatch("accHatchS", C.an3, 18, 2.2, 0.16);

      // ---------- Himmel (Parallaxe langsam) — reicht im Hochformat weit nach oben ----------
      const sky = SETS.gradient(svg, "accSky", [[0, "#fff4dc"], [0.5, "#fde6b5"], [0.84, "#fbd27f"], [1, "#fbd27f"]]);
      S("rect", { x: 600, y: -900, width: 1900, height: 1760, fill: sky }, st.sky);
      S("circle", { cx: 1330, cy: 690, r: 190, fill: "#fff4dc", opacity: 0.32 }, st.sky);
      S("circle", { cx: 1330, cy: 690, r: 78, fill: "#fff8e8" }, st.sky);
      st.clouds = [];
      [[1210, -150, 0.9], [1480, 120, 0.7], [1170, 400, 0.55], [1640, 470, 0.6]].forEach(([x, y, s]) => {
        const c = G(st.sky, { x, y, s });
        S("path", { d: "M-90,20 Q-90,-10 -60,-12 Q-50,-44 -14,-40 Q10,-66 44,-44 Q84,-46 88,-10 Q112,-4 108,20 Z", fill: "#fff", opacity: 0.7 }, c);
        st.clouds.push(c);
      });

      // ---------- Ferne: Hügel, Hecke, Baum (Parallaxe mittel) ----------
      S("path", { d: "M640,690 Q960,610 1200,652 T1660,640 T2260,662 V830 H640 Z", fill: C.g4 }, st.far);
      const hedge = S("g", null, st.far);
      for (let i = 0; i < 24; i++) {
        S("circle", { cx: 660 + i * 72, cy: 748 + (i % 3) * 7, r: 52 + (i % 2) * 9, fill: i % 2 ? C.g2 : C.g3 }, hedge);
      }
      S("rect", { x: 640, y: 752, width: 1760, height: 70, fill: C.g2 }, hedge);
      S("rect", { x: 640, y: 800, width: 1760, height: 22, fill: C.g3 }, hedge); // Rasenkante
      const tree = S("g", null, st.far);
      S("rect", { x: 1478, y: 470, width: 24, height: 340, fill: "#6f4a2e" }, tree);
      [[1490, 420, 120, C.g1], [1410, 486, 76, C.g2], [1560, 476, 86, C.g1], [1486, 330, 86, C.g2]].forEach(([x, y, r, c]) => S("circle", { cx: x, cy: y, r, fill: c }, tree));

      // ---------- Innenraum ----------
      S("path", { d: `M-200,-900 H896 V196 H${PLANE} V${FLOOR} H-200 Z`, fill: C.cream }, fg);
      const glowG = S("radialGradient", { id: "accGlow", cx: 1, cy: 0.78, r: 0.9 }, defs);
      [[0, "#fde6b5", 0.85], [1, "#fde6b5", 0]].forEach(([o, c, op]) => S("stop", { offset: o, "stop-color": c, "stop-opacity": op }, glowG));
      S("rect", { x: 300, y: -200, width: PLANE - 300, height: FLOOR + 200, fill: "url(#accGlow)", opacity: 0.55 }, fg);
      S("rect", { x: 896, y: 196, width: PLANE - 896, height: FLOOR - 196, fill: C.cream2 }, fg); // Laibung innen
      // Bild (Markenmotiv als Kunst), etwas kleiner und näher an der Tür
      const art = S("g", { transform: "translate(612,372) scale(0.8) translate(-352,-318)" }, fg);
      S("rect", { x: 352, y: 318, width: 200, height: 240, fill: "#fff", stroke: C.cream3, "stroke-width": 10 }, art);
      S("path", { d: "M386,508 V360 H500", stroke: C.yellow, "stroke-width": 9, fill: "none" }, art);
      S("path", { d: "M424,540 V410 H522", stroke: C.red, "stroke-width": 9, fill: "none" }, art);
      // Lichtschalter
      S("rect", { x: 842, y: 470, width: 30, height: 30, rx: 4, fill: "#fbf8f2", stroke: C.cream3, "stroke-width": 2 }, fg);
      S("rect", { x: 853, y: 478, width: 8, height: 14, rx: 2, fill: C.cream3 }, fg);
      // Pflanze im Topf (links, Bildrand)
      const pot = S("g", { transform: "translate(440,0)" }, fg);
      S("path", { d: "M78,812 L64,730 H196 L182,812 Z", fill: C.cream3 }, pot);
      S("rect", { x: 58, y: 720, width: 144, height: 18, rx: 6, fill: "#d6c5a8" }, pot);
      SETS.plant(pot, 130, 724, 0.8, 9, [C.g1, C.g2, C.g1, C.g3]);
      // Sockelleiste
      S("rect", { x: -200, y: 804, width: 1096, height: 16, fill: "#e8dcc6" }, fg);

      // ---------- Wand über der Tür (Schnitt) ----------
      S("rect", { x: 896, y: -900, width: 140, height: 1096, fill: C.cream2 }, fg);
      S("rect", { x: 896, y: -900, width: 140, height: 1096, fill: hatchWall }, fg);
      S("rect", { x: 896, y: -900, width: 6, height: 1096, fill: "#fbf8f2" }, fg); // Innenputz
      S("rect", { x: 1030, y: -900, width: 6, height: 1096, fill: "#ffffff" }, fg); // Außenputz
      S("rect", { x: 896, y: 190, width: 140, height: 6, fill: C.cream3 }, fg);
      // Rahmenprofil oben (Sturz) in Anthrazit
      S("rect", { x: TH.x0, y: 196, width: TH.x1 - TH.x0, height: 44, rx: 2, fill: C.an1 }, fg);
      S("rect", { x: TH.x0 + 6, y: 202, width: 24, height: 14, rx: 2, fill: "#20262a" }, fg);
      S("rect", { x: TH.x0 + 36, y: 202, width: 26, height: 14, rx: 2, fill: "#20262a" }, fg);
      S("rect", { x: TH.x0 + 6, y: 222, width: 56, height: 10, rx: 2, fill: "#20262a" }, fg);
      S("rect", { x: TH.x0, y: 236, width: TH.x1 - TH.x0, height: 4, fill: C.an3 }, fg);
      S("rect", { x: PLANE - 7, y: 238, width: 14, height: 8, rx: 2, fill: C.an3 }, fg); // obere Führung InScreen

      // ---------- InScreen-Plissee als Netzlinie in der Türebene ----------
      const mesh = S("g", null, fg);
      st.mesh = mesh;
      S("rect", { x: PLANE - 4, y: 246, width: 8, height: FLOOR - 244, fill: C.an3, opacity: 0.22 }, mesh);
      let zz = `M${PLANE - 3.5},246`;
      for (let y = 252, i = 0; y <= FLOOR; y += 6, i++) zz += ` L${i % 2 ? PLANE - 3.5 : PLANE + 3.5},${y}`;
      S("path", { d: zz, stroke: C.an2, "stroke-width": 1.5, fill: "none", opacity: 0.75, "stroke-linejoin": "round" }, mesh);
      S("path", { d: zz, stroke: "#fff", "stroke-width": 0.8, fill: "none", opacity: 0.55, transform: "translate(1,0)" }, mesh);

      // ---------- Erdreich unter allem (Hochformat zeigt mehr Tiefe) ----------
      const SOIL = FLOOR + 362;
      S("rect", { x: -200, y: SOIL, width: 2600, height: 900, fill: "#e6d8bf" }, fg);
      const rs = rng(41);
      for (let i = 0; i < 140; i++) {
        S("ellipse", { cx: -150 + rs() * 2500, cy: SOIL + 20 + rs() * 820, rx: 4 + rs() * 7, ry: 3 + rs() * 4, fill: "none", stroke: "#d2c3aa", "stroke-width": 2, opacity: 0.6 }, fg);
      }

      // ---------- Bodenaufbau innen (Schnitt) ----------
      const fl = S("g", null, fg);
      S("rect", { x: -200, y: FLOOR, width: TH.x0 + 200, height: 8, fill: "#d39a5e" }, fl);
      S("rect", { x: -200, y: FLOOR + 8, width: TH.x0 + 200, height: 18, fill: C.oak2 }, fl);
      for (let x = -164; x < TH.x0; x += 128) S("rect", { x, y: FLOOR + 8, width: 3, height: 18, fill: C.oak1, opacity: 0.8 }, fl);
      S("rect", { x: -200, y: FLOOR + 26, width: TH.x0 + 200, height: 38, fill: C.cream2 }, fl); // Estrich
      const rd = rng(17);
      for (let i = 0; i < 80; i++) S("circle", { cx: -180 + rd() * (TH.x0 + 160), cy: FLOOR + 31 + rd() * 28, r: 1.6 + rd() * 1.8, fill: C.cream3 }, fl);
      S("rect", { x: -200, y: FLOOR + 64, width: TH.x0 + 200, height: 38, fill: C.b6 }, fl); // Dämmung
      let zi = `M-200,${FLOOR + 83}`;
      for (let x = -190, i = 0; x <= TH.x0; x += 14, i++) zi += ` L${x},${FLOOR + (i % 2 ? 70 : 96)}`;
      S("path", { d: zi, stroke: C.b5, "stroke-width": 2.4, fill: "none" }, fl);
      S("rect", { x: -200, y: FLOOR + 102, width: 1236, height: 260, fill: C.cream3 }, fl); // Bodenplatte
      S("rect", { x: -200, y: FLOOR + 102, width: 1236, height: 260, fill: hatchSlab }, fl);
      S("rect", { x: -200, y: FLOOR + 102, width: 1236, height: 3, fill: "#d2c3aa" }, fl);
      S("rect", { x: -200, y: SOIL - 3, width: 1236, height: 3, fill: "#d2c3aa" }, fl);

      // ---------- Terrasse außen (Schnitt) ----------
      const tr = S("g", null, fg);
      S("rect", { x: TH.x1, y: FLOOR, width: 1500, height: 26, fill: "#e6dac6" }, tr);
      S("rect", { x: TH.x1, y: FLOOR, width: 1500, height: 3, fill: "#f1e8d8" }, tr);
      for (let x = TH.x1 + 150; x < 2500; x += 168) S("rect", { x, y: FLOOR, width: 3, height: 26, fill: "#d2c3aa" }, tr);
      S("rect", { x: TH.x1, y: FLOOR + 26, width: 1500, height: 30, fill: C.cream3 }, tr); // Splittbett
      S("rect", { x: 1036, y: FLOOR + 56, width: 1460, height: SOIL - FLOOR - 56, fill: "#e9dcc4" }, tr); // Kies
      const rg = rng(23);
      for (let i = 0; i < 110; i++) {
        const x = 1040 + rg() * 1420, y = FLOOR + 30 + rg() * (SOIL - FLOOR - 40);
        S("ellipse", { cx: x, cy: y, rx: 4 + rg() * 6, ry: 3 + rg() * 4, fill: "none", stroke: "#d2c3aa", "stroke-width": 2, opacity: 0.75 }, tr);
      }
      S("rect", { x: TH.x1, y: FLOOR + 56, width: 1036 - TH.x1, height: 46, fill: C.b6 }, tr); // Perimeterdämmung
      // Dämmsockel unter der Schwelle
      S("rect", { x: TH.x0 - 4, y: TH.y1, width: TH.x1 - TH.x0 + 8, height: FLOOR + 102 - TH.y1, fill: C.b4 }, tr);
      for (let y = TH.y1 + 8; y < FLOOR + 100; y += 10) S("line", { x1: TH.x0, y1: y, x2: TH.x1, y2: y, stroke: C.b3, "stroke-width": 1.6, opacity: 0.35 }, tr);

      // ---------- Schwelle (bündig) mit eingelassener Führungsschiene ----------
      const th = S("g", null, fg);
      st.threshold = th;
      const ALU = "#c9cdd0";
      S("rect", { x: TH.x0, y: FLOOR, width: TH.x1 - TH.x0, height: TH.y1 - FLOOR, rx: 3, fill: C.an1 }, th);
      S("rect", { x: TH.x0, y: FLOOR, width: TH.x1 - TH.x0, height: 7, fill: C.an2 }, th); // Deckplatte, bündig
      S("rect", { x: TH.x0, y: FLOOR, width: TH.x1 - TH.x0, height: 1.6, fill: C.an3 }, th);
      S("rect", { x: TH.x0 + 4, y: FLOOR + 16, width: 22, height: 12, rx: 2, fill: "#20262a" }, th);
      S("rect", { x: TH.x0 + 30, y: FLOOR + 16, width: 34, height: 12, rx: 2, fill: "#20262a" }, th);
      S("rect", { x: TH.x0 + 4, y: FLOOR + 32, width: 60, height: 13, rx: 2, fill: "#20262a" }, th);
      S("rect", { x: TH.x0 + 26, y: FLOOR + 13, width: 4, height: 36, fill: C.b4 }, th); // thermische Trennung
      // Führungsschiene InScreen: in die Schwelle eingelassen, Oberkante bündig
      S("rect", { x: PLANE - 8, y: FLOOR, width: 16, height: 12, rx: 1.5, fill: "#151a1d" }, th);
      S("rect", { x: PLANE - 6, y: FLOOR + 1.4, width: 12, height: 9.5, rx: 1.5, fill: ALU }, th);
      S("rect", { x: PLANE - 1.6, y: FLOOR + 1.4, width: 3.2, height: 5.5, fill: "#151a1d" }, th);
      // Laufschiene Schiebeflügel (ebenfalls versenkt)
      S("rect", { x: 964, y: FLOOR, width: 16, height: 9, rx: 1.5, fill: "#151a1d" }, th);
      S("rect", { x: 967, y: FLOOR + 1.6, width: 10, height: 7, rx: 2.5, fill: ALU, opacity: 0.85 }, th);

      // ---------- Effekte + Figuren ----------
      st.fxBack = S("g", null, fg);
      st.chars = S("g", null, fg);
      st.fx = S("g", null, fg);
      st.kid = CHAR.makeKid(st.chars, { s: S_KID });
      st.anna = CHAR.makeAnna(st.chars, { s: S_ANNA });
      st.tray = CHAR.makeTray(st.anna.lean, { x: 0, y: -262 });
      st.opa = CHAR.makeOpa(st.chars, { s: S_OPA });

      // Opa: Rollator aus der Körpergruppe lösen (bleibt am Boden, wippt nicht mit), Körper leicht vorgebeugt
      const opa = st.opa;
      const rol = opa.rwheels[0]._wrap.parentNode;
      opa.base.insertBefore(rol, opa.lean._wrap);
      rol.setAttribute("transform", `translate(${OPA.rdx},0)`);
      S("path", { d: "M100,-251 L60,-263", stroke: C.an1, "stroke-width": 13, "stroke-linecap": "round" }, rol); // Griff
      opa.lean._wrap.setAttribute("transform", `rotate(${OPA.alpha})`);
      // Finger über dem Griff (vor der Hand)
      st.opaFingers = S("path", { d: "M-9,-2 Q0,-12 10,-4", stroke: C.skin2, "stroke-width": 3.4, fill: "none", "stroke-linecap": "round", opacity: 0.9 }, opa.armR.h);

      // Kind: Drehpunkte an Hinter- und Vorderrad (Wheelie / Bremsnicken)
      const kid = st.kid;
      st.kidRear = pivot(kid.bounce, -62, -1);
      st.kidFront = pivot(st.kidRear, 64, -1);
      st.kidHead = kid.head;
      // Fahrtwind-Linien (hinter dem Auto, bewegen sich mit)
      st.kidLines = S("g", null);
      kid.root.insertBefore(st.kidLines, kid.root.firstChild);
      st.speed = [[-118, -48, 120], [-128, -98, 150], [-112, -150, 96]].map(([x, y, l]) =>
        S("path", { d: `M${x},${y} H${x - l}`, stroke: "#fff", "stroke-width": 7, "stroke-linecap": "round", fill: "none", opacity: 0.9 }, st.kidLines));


      // Stolperkante (Geister-Absatz, wird plattgedrückt) + Null-Niveau-Linie
      st.bump = G(st.fx, { x: 960, y: FLOOR });
      S("path", { d: "M-44,0 L-32,-28 L32,-28 L44,0", stroke: C.red, "stroke-width": 5, "stroke-dasharray": "11 8", fill: C.red, "fill-opacity": 0.1, "stroke-linejoin": "round" }, st.bump);
      st.level0 = G(st.fxBack, { x: 960, y: FLOOR - 1 });
      S("line", { x1: -84, y1: 0, x2: 84, y2: 0, stroke: "#fff", "stroke-width": 3, "stroke-dasharray": "9 7", "stroke-linecap": "round", opacity: 0.9 }, st.level0);

      // ---------- Lupe (bildfest; live: <use> auf die Szene) ----------
      const lensLayer = S("g", null, root);
      st.lensLayer = lensLayer;
      // Markierung + Verbindungslinien liegen in der Welt hinter den Figuren
      const mr = LENS.r / LENS.z;
      st.markCircle = S("circle", { cx: LENS.cx, cy: LENS.cy, r: mr, fill: "none", stroke: "#fff", "stroke-width": 4 }, st.fxBack);
      st.conn = [0, 1].map(() => S("line", { x1: LENS.cx, y1: LENS.cy, x2: LENS.cx, y2: LENS.cy, stroke: "#fff", "stroke-width": 3.4, "stroke-linecap": "round", opacity: 0 }, st.fxBack));
      st.lens = G(lensLayer, { x: LENS.x, y: LENS.y });
      const cp = S("clipPath", { id: "acc-lens-clip" }, defs);
      S("circle", { cx: 0, cy: 0, r: LENS.r }, cp);
      S("circle", { cx: 8, cy: 14, r: LENS.r + 10, fill: C.blue, opacity: 0.16 }, st.lens);
      S("circle", { cx: 0, cy: 0, r: LENS.r, fill: C.cream }, st.lens);
      const clipG = S("g", { "clip-path": "url(#acc-lens-clip)" }, st.lens);
      const zoom = S("g", { transform: `scale(${LENS.z}) translate(${-LENS.cx},${-LENS.cy})` }, clipG);
      S("use", { href: "#acc-scene" }, zoom);
      // Wasserwaage in der Lupe (liegt über der Fuge innen/Schwelle/außen)
      const fy = (FLOOR - LENS.cy) * LENS.z; // Bodenlinie in Lupen-Koordinaten
      st.levelTool = G(clipG, { x: 0, y: fy });
      const lv = st.levelTool;
      S("rect", { x: -104, y: -38, width: 208, height: 38, rx: 6, fill: C.yellow }, lv);
      S("rect", { x: -104, y: -38, width: 208, height: 7, rx: 3, fill: "#fff", opacity: 0.3 }, lv);
      S("rect", { x: -104, y: -38, width: 16, height: 38, rx: 4, fill: C.an1 }, lv);
      S("rect", { x: 88, y: -38, width: 16, height: 38, rx: 4, fill: C.an1 }, lv);
      S("rect", { x: -36, y: -31, width: 72, height: 24, rx: 12, fill: "#fff4dc", stroke: C.an1, "stroke-width": 2.5 }, lv);
      S("rect", { x: -33, y: -28, width: 66, height: 18, rx: 9, fill: C.g4, opacity: 0.75 }, lv);
      st.bubble = G(lv, { x: 0, y: -19 });
      S("ellipse", { cx: 0, cy: 0, rx: 10, ry: 6.5, fill: "#fff" }, st.bubble);
      [-13, 13].forEach((x) => S("line", { x1: x, y1: -30, x2: x, y2: -8, stroke: C.an1, "stroke-width": 2.4 }, lv));
      st.railRing = G(clipG, { x: (PLANE - LENS.cx) * LENS.z, y: (FLOOR + 5 - LENS.cy) * LENS.z });
      S("circle", { cx: 0, cy: 0, r: 30, fill: "none", stroke: C.red, "stroke-width": 4.5 }, st.railRing);
      // Ring + Markenrahmen
      S("circle", { cx: 0, cy: 0, r: LENS.r, fill: "none", stroke: "#fff", "stroke-width": 12 }, st.lens);
      S("circle", { cx: 0, cy: 0, r: LENS.r + 10, fill: "none", stroke: C.yellow, "stroke-width": 4 }, st.lens);

      // ---------- Texte (oben gestapelt, Label links neben der Lupe) ----------
      const h = R.huds[ctx.id];
      const css = document.createElement("style");
      css.textContent = `
        .s07-head { font-size: 76px; padding: 12px 34px 16px 22px; gap: 18px; align-items: stretch; }
        .s07-head .bar { width: 8px; height: auto; }
        .s07-head .ht { line-height: 1.04; }
        .s07-head .ht span { font-size: 54px; }
        .s07-sub { font-size: 46px; padding: 12px 28px 14px 20px; gap: 14px; }
        .s07-sub .bar { height: 46px; }
        .s07-lbl { font-size: 40px; line-height: 1.12; padding: 16px 26px 18px 18px; gap: 14px; }
        .s07-lbl .bar { height: 92px; }
      `;
      document.head.appendChild(css);
      st.chip1 = ANIM.el("div", "chip s07-head", h, '<div class="bar"></div><div class="ht">Keine Stolperkante<br><span>im Durchgangsbereich</span></div>');
      st.chip1.style.left = "60px"; st.chip1.style.top = "214px";
      st.lbl = ANIM.el("div", "chip s07-lbl", h, '<div class="bar"></div><div>Führungsschiene<br>eingelassen</div>');
      st.lbl.style.right = SVGK.F.W - (LENS.x - LENS.r - 34) + "px"; st.lbl.style.top = LENS.y + "px";
      gsap.set(st.chip1, { opacity: 0, transformOrigin: "0% 50%" });
      gsap.set(st.lbl, { opacity: 0, yPercent: -50, transformOrigin: "100% 50%" });
    },

    build(ctx, tl, R) {
      const st = R.sets.access;
      const { C, rng } = SVGK;
      const O0 = CHAR.O0;
      const t0 = ctx.t0, t1 = ctx.t1;
      const tA = t0 - 0.6, tB = t1 + 1.5, DUR = tB - tA; // Dauerbewegungen laufen über das Fenster hinaus
      const tKeine = ctx.w("keine");
      const tStol = ctx.w("stolperkante"), tStolE = ctx.w("stolperkante", "e");
      const tDurch = ctx.w("durchgangsbereich");
      const tKind = ctx.w("kinder");
      const tGross = ctx.w("großeltern");
      const tTab = ctx.w("tablett");
      const kid = st.kid, opa = st.opa, anna = st.anna;

      // Zeitfunktionen über eigene Ease-Kurve exakt in die Timeline schreiben (seekbar, deterministisch)
      const fnEase = (fn) => (p) => fn(tA + p * DUR);
      const drive = (el, prop, fn, origin) => {
        const from = {}, to = { duration: DUR, ease: fnEase(fn) };
        from[prop] = 0; to[prop] = 1;
        if (origin) { Object.assign(from, O0); Object.assign(to, O0); }
        tl.fromTo(el, from, to, tA);
      };
      const driveAttr = (el, name, fn) => {
        const a0 = {}, a1 = {};
        a0[name] = 0; a1[name] = 1;
        tl.fromTo(el, { attr: a0 }, { attr: a1, duration: DUR, ease: fnEase(fn) }, tA);
      };

      // ---------- Kamera: nah auf die Schwelle → Rückfahrt (Opa kommt) → Schwenk nach rechts ----------
      // X = Bild-x der Türebene, z = Zoom; die Bodenlinie bleibt bei YF.
      const KEYS = [
        { t: tA, X: 628, z: 1.46 },
        { t: tStolE + 0.05, X: 618, z: 1.55, e: E.sine },
        { t: tDurch - 0.15, X: 618, z: 1.55 },
        { t: tKind + 0.1, X: 540, z: 1.17, e: E.p2 },
        { t: tGross - 0.05, X: 540, z: 1.17 },
        { t: t1 + 0.1, X: 335, z: 1.12, e: E.sine },
      ];
      const camAt = (t) => {
        let k = 0;
        while (k < KEYS.length - 2 && t > KEYS[k + 1].t) k++;
        const a = KEYS[k], b = KEYS[k + 1];
        const u = clamp01((t - a.t) / (b.t - a.t)), f = b.e ? b.e(u) : u;
        const X = a.X + (b.X - a.X) * f, z = a.z + (b.z - a.z) * f;
        return { X, z, cx: PLANE - (X - 540) / z, cy: FLOOR + (960 - YF) / z };
      };
      drive(st.cam.pos, "x", (t) => -camAt(t).cx, false);
      drive(st.cam.pos, "y", (t) => -camAt(t).cy, false);
      drive(st.cam.sc, "scale", (t) => camAt(t).z, true);
      const toScreenX = (wx, t) => { const c = camAt(t); return 540 + (wx - c.cx) * c.z; };
      // Parallaxe: Ferne und Himmel bleiben gegenüber der Kamera zurück
      const cx0 = camAt(tA).cx;
      drive(st.far, "x", (t) => (camAt(t).cx - cx0) * 0.35, false);
      drive(st.sky, "x", (t) => (camAt(t).cx - cx0) * 0.75, false);
      st.clouds.forEach((c, i) => tl.fromTo(c, { x: 0 }, { x: 26 + i * 12, duration: DUR, ease: "sine.inOut" }, tA));

      // ---------- Kind auf dem Bobbycar ----------
      kid.init(tl);
      gsap.set(kid.root, { x: KID_WAIT, y: FLOOR });
      gsap.set(st.speed, { drawSVG: "0% 0%" });
      const kidDist = KID_PARK - KID_WAIT, Dk = 1.15;
      const tCross = tKind + 0.05;
      const pX = Math.sqrt(((960 - KID_WAIT) / kidDist) / 2); // power1.inOut (quad) bis zur Türebene
      const tL = tCross - pX * Dk; // Start
      const tStop = tL + Dk;
      // Warten: Motor-Brummen, Blick zurück zu Opa
      const nR = Math.max(1, Math.floor((tL - 0.45 - tA) / 0.22));
      tl.fromTo(kid.root, { y: FLOOR }, { y: FLOOR - 2.5, duration: 0.11, ease: "sine.inOut", yoyo: true, repeat: nR * 2 - 1 }, tA);
      tl.fromTo(st.kidHead, Object.assign({ rotation: 0 }, O0), Object.assign({ rotation: -3, duration: 0.42, ease: "sine.inOut", yoyo: true, repeat: Math.max(1, Math.floor((tL - 0.5 - tA) / 0.42)) - 1 }, O0), tA);
      kid.look(tl, 0, 3, 0, 0).brows(tl, 0, "happy", 0);
      kid.look(tl, tStol + 0.2, -5, 1, 0.18);
      kid.look(tl, tDurch - 0.1, 4, 0, 0.16).brows(tl, tDurch - 0.1, "sly");
      kid.look(tl, tL - 0.75, -5, 1, 0.16);
      kid.look(tl, tL - 0.35, 5, -1, 0.14).brows(tl, tL - 0.35, "angry", 0.14);
      kid.blinks(tl, tA, tL - 0.5, 4);
      // Ausholen: kurz zurück, Wheelie
      tl.to(kid.root, { x: KID_WAIT - 8, duration: 0.22, ease: "power2.out" }, tL - 0.42);
      kid.roll(tl, tL - 0.42, 0.22, -8 / S_KID);
      tl.to(st.kidRear, Object.assign({ rotation: -3, duration: 0.2, ease: "power2.out" }, O0), tL - 0.42);
      // Los!
      tl.fromTo(kid.root, { x: KID_WAIT - 8 }, { x: KID_PARK, duration: Dk, ease: "power1.inOut", immediateRender: false }, tL);
      kid.roll(tl, tL, Dk, kidDist / S_KID);
      tl.to(st.kidRear, Object.assign({ rotation: -8, duration: 0.16, ease: "power3.out" }, O0), tL);
      tl.to(st.kidRear, Object.assign({ rotation: 0, duration: 0.45, ease: "back.out(2.4)" }, O0), tL + 0.2);
      kid.mouth(tl, tL, "open").brows(tl, tL, "surprised", 0.1);
      kid.mouth(tl, tCross - 0.08, "grin").brows(tl, tCross - 0.08, "happy", 0.12);
      kid.eyesClosed(tl, tCross - 0.02, true);
      kid.eyesClosed(tl, tCross + 0.4, false);
      // Haare im Fahrtwind, Kopf wippt
      tl.to(kid.hair, { skewX: 16, duration: 0.3, ease: "power2.out", transformOrigin: "100% 100%" }, tL + 0.08);
      tl.to(kid.hair, { skewX: 0, duration: 0.5, ease: "back.out(3)", transformOrigin: "100% 100%" }, tStop - 0.1);
      tl.to(st.kidHead, Object.assign({ rotation: -7, duration: 0.18, ease: "power2.out" }, O0), tL + 0.05);
      tl.to(st.kidHead, Object.assign({ rotation: -2, duration: 0.12, ease: "sine.inOut", yoyo: true, repeat: 3 }, O0), tL + 0.25);
      tl.to(st.kidHead, Object.assign({ rotation: 6, duration: 0.22, ease: "power2.out" }, O0), tStop - 0.22);
      tl.to(st.kidHead, Object.assign({ rotation: 0, duration: 0.4, ease: "back.out(2)" }, O0), tStop);
      // Bremsen: nach vorn nicken, zurückfedern (passiert schon außerhalb des Bildes)
      tl.to(st.kidFront, Object.assign({ rotation: 4, duration: 0.24, ease: "power2.in" }, O0), tStop - 0.26);
      tl.to(st.kidFront, Object.assign({ rotation: 0, duration: 0.42, ease: "back.out(2.6)" }, O0), tStop - 0.02);
      // Fahrtwind-Linien
      st.speed.forEach((p, i) => {
        const ts = tL + 0.18 + i * 0.05;
        tl.fromTo(p, { drawSVG: "0% 0%" }, { drawSVG: "0% 100%", duration: 0.24, ease: "power2.out", immediateRender: false }, ts);
        tl.to(p, { drawSVG: "100% 100%", opacity: 0, duration: 0.3, ease: "power2.in" }, ts + 0.42);
      });
      kid.look(tl, tStop + 0.25, -5, 0, 0.18).brows(tl, tStop + 0.25, "happy", 0.15);
      kid.blinks(tl, tStop + 0.3, tB, 12);
      ANIM.sfx(tL - 0.42, "roll", -10, { dur: 0.25 });
      ANIM.sfx(tL, "roll", -3, { dur: Dk });
      ANIM.sfx(tCross - 0.2, "whoosh", -3);
      ANIM.sfx(tStop - 0.25, "slide", -12, { dur: 0.3 }); // Bremsen (schon außerhalb des Bildes)

      // ---------- Opa mit Rollator ----------
      opa.init(tl);
      const gait = buildGait();
      const kidRear = KID_WAIT - 8 - 102 * S_KID; // Heck des Bobbycars
      const frontOff = S_OPA * (150 + 16 + OPA.rdx); // vorderste Rollatorkante relativ zum Fußpunkt
      const wheelOff = S_OPA * (150 + OPA.rdx);
      // Vorderrad über die Schwelle auf „Großeltern“, aber nie ins wartende Kind laufen
      const Tc = Math.max(tGross + 0.4, tL + (960 - wheelOff + frontOff - (kidRear - KID_GAP)) / OPA.v);
      const rootC = 960 - wheelOff;
      // Gangphase so wählen, dass ein Fuß flach auf der Schwelle steht (Lupe!)
      let tRef = Tc, best = 1e9;
      for (let k = 0; k < 100; k++) {
        const trf = Tc + k * 0.01;
        const Xr = rootC - S_OPA * gait.Gb((Tc - trf) / OPA.T);
        gait.legs.forEach((L) => {
          for (let c = -8; c <= 8; c++) {
            const ths = trf + (c + L.off) * OPA.T;
            const heel = Xr + S_OPA * (gait.Gb((ths - trf) / OPA.T) + L.h0);
            const e = Math.abs(heel + S_OPA * 22 - 962);
            if (e < best) { best = e; tRef = trf; }
          }
        });
      }
      const Xref = rootC - S_OPA * gait.Gb((Tc - tRef) / OPA.T);
      const tauOf = (t) => (t - tRef) / OPA.T;
      const Xopa = (t) => Xref + S_OPA * gait.Gb(tauOf(t));
      gsap.set(opa.root, { y: FLOOR });
      drive(opa.root, "x", Xopa, false);
      const Gc = gait.ch, smp = gait.sample;
      ["legR", "legL"].forEach((k) => {
        drive(opa[k].u, "rotation", (t) => smp(Gc[k][0], tauOf(t)), true);
        drive(opa[k].f, "rotation", (t) => smp(Gc[k][1], tauOf(t)), true);
        drive(opa[k].h, "rotation", (t) => smp(Gc[k][2], tauOf(t)), true);
      });
      drive(opa.armR.u, "rotation", (t) => smp(Gc.arm[0], tauOf(t)), true);
      drive(opa.armR.f, "rotation", (t) => smp(Gc.arm[1], tauOf(t)), true);
      drive(opa.armR.h, "rotation", (t) => smp(Gc.arm[2], tauOf(t)), true);
      drive(opa.lean, "y", (t) => smp(Gc.bob, tauOf(t)), false);
      drive(opa.head, "rotation", (t) => smp(Gc.head, tauOf(t)), true);
      opa.rwheels.forEach((w) => drive(w, "rotation", (t) => (gait.Gb(tauOf(t)) / (2 * Math.PI * 16)) * 360, true));
      opa.breathe(tl, tA, tB, 0.004, 1.6);
      // Mimik: zufrieden, staunt dem Kind nach, dann in die Kamera, zum Schluss Blick zurück zu Anna
      opa.look(tl, 0, 3, 1, 0).brows(tl, 0, "happy", 0).mouth(tl, 0, "smile");
      opa.blinks(tl, tA, tB, 21);
      opa.look(tl, tCross - 0.15, 5, -1, 0.14).brows(tl, tCross - 0.15, "surprised", 0.14).mouth(tl, tCross - 0.15, "o");
      opa.mouth(tl, tCross + 0.35, "grin").brows(tl, tCross + 0.35, "happy", 0.2);
      opa.look(tl, tGross - 0.05, -1, 0, 0.18);
      opa.mouth(tl, tGross + 0.6, "smile");
      opa.look(tl, tGross + 0.9, 4, 2, 0.2);
      opa.look(tl, tTab - 0.25, -4, 2, 0.2);
      ANIM.sfx(tGross, "roll", -11, { dur: 1.6 });

      // ---------- Anna mit vollem Tablett: folgt Opa im gleichen Tempo, kreuzt die Türebene auf „Tablett“ ----------
      anna.init(tl);
      const VA = OPA.v, tAX = tTab + 0.1;
      const annaX = (t) => PLANE + VA * (t - tAX);
      gsap.set(anna.root, { x: annaX(tA), y: FLOOR });
      drive(anna.root, "x", annaX, false);
      R._s07 = { gait, Xopa, tRef, Tc, tL, tStop, tCross, annaX, camAt };
      const ar = ANIM.RIG.anna, grip = st.tray.grip;
      anna.pose(tl, tA, {
        armL: ANIM.ik({ x: ar.armL.sx, y: ar.armL.sy }, { x: -grip, y: -258 }, ar.armL.l1, ar.armL.l2, 1),
        armR: ANIM.ik({ x: ar.armR.sx, y: ar.armR.sy }, { x: grip, y: -258 }, ar.armR.l1, ar.armR.l2, -1),
        head: 0,
      }, 0);
      ANIM.walk(tl, anna, tA, DUR, { step: 0.32, swing: 15 });
      anna.expr(tl, tA, "smile", "happy", [3, 3]);
      anna.blinks(tl, tA, tAX - 0.6, 41);
      // kurz vor der Schwelle: prüfender Blick auf die Gläser … dann stolz in die Kamera
      anna.look(tl, tAX - 0.6, 1, 6, 0.18).brows(tl, tAX - 0.6, "worried", 0.2).mouth(tl, tAX - 0.6, "o");
      anna.look(tl, tAX + 0.06, 0, 0, 0.14).brows(tl, tAX + 0.06, "happy", 0.16).mouth(tl, tAX + 0.06, "grin");
      anna.eyesClosed(tl, tAX + 0.3, true);
      anna.eyesClosed(tl, tAX + 0.48, false);
      ANIM.sfx(tAX + 0.08, "sparkle", -12);

      // ---------- „Keine Stolperkante“ ----------
      const tC1 = tKeine + 0.06;
      tl.fromTo(st.chip1, { opacity: 0, x: -50, scale: 0.9 }, { opacity: 1, x: 0, scale: 1, duration: 0.5, ease: "back.out(1.7)", immediateRender: false }, tC1);
      tl.fromTo(st.chip1.querySelector(".bar"), { scaleY: 0 }, { scaleY: 1, duration: 0.35, ease: "power3.out", immediateRender: false }, tC1 + 0.12);
      ANIM.sfx(tC1, "pop", -6);
      // Geister-Absatz taucht auf … und wird plattgedrückt
      gsap.set(st.bump, Object.assign({ scaleY: 0, opacity: 0 }, O0));
      tl.to(st.bump, Object.assign({ scaleY: 1, opacity: 1, duration: 0.22, ease: "back.out(2.6)" }, O0), tStol + 0.02);
      ANIM.sfx(tStol + 0.02, "boing", -10);
      const tCrush = tStol + 0.38;
      tl.to(st.bump, Object.assign({ scaleY: 1.12, duration: 0.1, ease: "power2.out" }, O0), tCrush - 0.12);
      tl.to(st.bump, Object.assign({ scaleY: 0.04, duration: 0.12, ease: "power4.in" }, O0), tCrush - 0.02);
      tl.to(st.bump, { opacity: 0, duration: 0.18, ease: "power1.out" }, tCrush + 0.12);
      ANIM.burst(tl, st.fx, 960, FLOOR - 6, tCrush + 0.1, { n: 7, color: C.yellow, len: 26, r0: 30, w: 5, seed: 7 });
      ANIM.sfx(tCrush + 0.08, "stamp", -5);
      gsap.set(st.level0, Object.assign({ scaleX: 0 }, O0));
      tl.to(st.level0, Object.assign({ scaleX: 1, duration: 0.45, ease: "power3.out" }, O0), tCrush + 0.1);

      // ---------- Lupe ----------
      const tLens = tCrush + 0.06;
      gsap.set(st.markCircle, { drawSVG: "0% 0%" });
      gsap.set(st.lens, Object.assign({ scale: 0 }, O0));
      gsap.set(st.railRing, Object.assign({ scale: 0, opacity: 0 }, O0));
      tl.to(st.markCircle, { drawSVG: "0% 100%", duration: 0.28, ease: "power2.inOut" }, tLens);
      // Verbindungslinien (äußere Tangenten Markierung ↔ Lupe), Lupe ist bildfest → Weltpunkt folgt der Kamera
      const tConn = tLens + 0.12, dConn = 0.3;
      let cache = { t: NaN, v: null };
      const tang = (t) => {
        if (t === cache.t) return cache.v;
        const c = camAt(t);
        const c1 = { x: LENS.cx, y: LENS.cy }, r1 = LENS.r / LENS.z;
        const c2 = { x: c.cx + (LENS.x - 540) / c.z, y: c.cy + (LENS.y - 960) / c.z }, r2 = (LENS.r + 6) / c.z;
        const dx = c2.x - c1.x, dy = c2.y - c1.y, dd = Math.hypot(dx, dy), thA = Math.atan2(dy, dx);
        const g = Math.acos(Math.max(-1, Math.min(1, -(r2 - r1) / dd)));
        const rev = E.p2(clamp01((t - tConn) / dConn));
        const v = [1, -1].map((sg) => {
          const a = thA + sg * g;
          const x1 = c1.x + r1 * Math.cos(a), y1 = c1.y + r1 * Math.sin(a);
          const x2 = c2.x + r2 * Math.cos(a), y2 = c2.y + r2 * Math.sin(a);
          return { x1, y1, x2: x1 + (x2 - x1) * rev, y2: y1 + (y2 - y1) * rev };
        });
        cache = { t, v };
        return v;
      };
      st.conn.forEach((ln, i) => ["x1", "y1", "x2", "y2"].forEach((k) => driveAttr(ln, k, (t) => tang(t)[i][k])));
      tl.set(st.conn, { opacity: 0.95 }, tConn);
      tl.to(st.lens, Object.assign({ scale: 1, duration: 0.48, ease: "back.out(1.6)" }, O0), tLens + 0.2);
      ANIM.sfx(tLens + 0.16, "whooshSoft", -8);
      tl.fromTo(st.lbl, { opacity: 0, x: 26 }, { opacity: 1, x: 0, duration: 0.4, ease: "power3.out", immediateRender: false }, tLens + 0.42);
      // Libelle pendelt aus und rastet exakt mittig ein — vor der Durchfahrt wird die Waage weggenommen
      const tLift = tL - 0.3;
      const tClick = Math.min(tLens + 0.86, tLift - 0.22);
      gsap.set(st.bubble, { x: 24 });
      tl.to(st.bubble, { x: -13, duration: 0.24, ease: "sine.inOut" }, tClick - 0.5);
      tl.to(st.bubble, { x: 7, duration: 0.2, ease: "sine.inOut" }, tClick - 0.26);
      tl.to(st.bubble, { x: 0, duration: 0.2, ease: "back.out(3)" }, tClick - 0.06);
      ANIM.sfx(tClick, "click", -3);
      tl.fromTo(st.levelTool, { scale: 1 }, { scale: 1.06, duration: 0.08, ease: "power2.out", yoyo: true, repeat: 1, transformOrigin: "50% 100%", immediateRender: false }, tClick);
      tl.to(st.levelTool, { y: -260, opacity: 0, duration: 0.36, ease: "power2.in" }, tLift);
      // danach markiert ein kleiner Ring die eingelassene Schiene
      tl.to(st.railRing, Object.assign({ scale: 1, opacity: 1, duration: 0.35, ease: "back.out(2.5)" }, O0), tLift + 0.24);

    },
  };
})();
