// s09 — „Für Sie als Fachpartner: Bestellt wird aus einer Hand, die Maße liegen schon vor.“
// Set „partner“ (Neubau, weiße QuinLine®-Hebeschiebetür). Ben winkt, bestellt per Tablet
// (Panel mit Schalter + vier Schritten), will messen — „Maße liegen vor“ — Maßband schnappt zurück.
// Das Set + Ben + Halte-Helfer werden hier angelegt und von s10 weiterbenutzt (R.partner).
(function () {
  const SC = (window.SCENES = window.SCENES || {});

  function setup(R, ctx) {
    const { S, G, C, rng } = SVGK;
    const svg = R.svg;
    const st = { root: S("g", { id: "set-partner" }, svg) };
    R.sets.partner = st;
    const cam = SETS.camera(st.root);
    st.cam = cam;
    const Wd = cam.world;

    // ---- Geometrie (Weltkoordinaten) ----
    const Cx = 1500, DW = 900, DH = 700, DY = 200;
    const DX = Cx - DW / 2, FL = DY + DH; // FL = Boden-/Wandkante
    const s = 0.9, BY = 945, Bx = Cx - 135;
    const P = { st, cam, Cx, DW, DH, DX, DY, FL, s, BY, Bx };
    R.partner = P;

    const L = {};
    ["out", "door", "wall", "props", "char", "mid", "front", "fx"].forEach((k) => (L[k] = S("g", { "data-l": k }, Wd)));
    P.L = L;

    // ---- Außen: heller Tag, Garten eines Neubaus ----
    const out = L.out;
    const sky = SETS.gradient(svg, "ptSky", [[0, "#d7e5ea"], [0.55, "#eef1e8"], [1, "#fff4dc"]]);
    S("rect", { x: DX - 60, y: DY - 60, width: DW + 120, height: DH + 120, fill: sky }, out);
    P.clouds = [[DX + 190, DY + 120, 0.9], [DX + 620, DY + 92, 0.7], [DX + 820, DY + 200, 0.55]].map(([x, y, sc]) => {
      const c = G(out, { x, y, s: sc });
      S("path", { d: "M-90,20 Q-90,-10 -60,-12 Q-50,-44 -14,-40 Q10,-66 44,-44 Q84,-46 88,-10 Q112,-4 108,20 Z", fill: "#fff", opacity: 0.85 }, c);
      return c;
    });
    S("path", { d: `M${DX - 60},${DY + 410} Q${DX + 180},${DY + 350} ${DX + 420},${DY + 400} T${DX + DW + 60},${DY + 380} V${FL + 60} H${DX - 60} Z`, fill: C.g4 }, out);
    // Nachbarhaus in der Ferne
    const hs = S("g", null, out);
    S("rect", { x: DX + 120, y: DY + 300, width: 170, height: 120, fill: "#fbf7ef" }, hs);
    S("path", { d: `M${DX + 102},${DY + 306} L${DX + 205},${DY + 238} L${DX + 308},${DY + 306} Z`, fill: C.b4 }, hs);
    S("rect", { x: DX + 150, y: DY + 336, width: 40, height: 44, fill: C.b5 }, hs);
    S("rect", { x: DX + 220, y: DY + 336, width: 40, height: 44, fill: C.b5 }, hs);
    const rt = rng(31);
    for (let i = 0; i < 11; i++) S("circle", { cx: DX - 40 + i * 96, cy: DY + 446 + (i % 3) * 10, r: 58 + rt() * 22, fill: i % 2 ? C.g3 : C.g2 }, out);
    S("rect", { x: DX - 60, y: DY + 460, width: DW + 120, height: 70, fill: C.g3 }, out);
    // junger Baum rechts
    S("rect", { x: DX + 712, y: DY + 260, width: 18, height: 250, fill: "#6f4a2e" }, out);
    [[DX + 720, DY + 230, 92, C.g1], [DX + 668, DY + 286, 58, C.g2], [DX + 778, DY + 280, 62, C.g1]].forEach(([x, y, r, c]) => S("circle", { cx: x, cy: y, r, fill: c }, out));
    // Holzzaun
    const fence = S("g", null, out);
    for (let i = 0; i < 26; i++) S("rect", { x: DX - 40 + i * 38, y: DY + 486, width: 26, height: 96, rx: 4, fill: i % 2 ? C.oak3 : "#e2b77f" }, fence);
    S("rect", { x: DX - 60, y: DY + 520, width: DW + 120, height: 10, fill: C.oak2 }, fence);
    // Rasen + Terrasse auf Bodenniveau (schwellenlos)
    S("rect", { x: DX - 60, y: DY + 570, width: DW + 120, height: 90, fill: C.g3 }, out);
    S("rect", { x: DX - 60, y: DY + 640, width: DW + 120, height: 140, fill: "#e6dac6" }, out);
    for (let i = 0; i < 8; i++) S("line", { x1: DX - 60 + i * 140, y1: DY + 640, x2: DX - 120 + i * 156, y2: DY + 780, stroke: "#d2c3aa", "stroke-width": 3 }, out);

    // ---- Tür (weiß, geöffnet, Plissee noch nicht eingeclipst) ----
    const door = DOOR.makeDoor(L.door, { x: DX, y: DY, w: DW, h: DH, variant: "weiss", screen: 0 });
    gsap.set(door.sash, { x: -door.sashTravel });
    gsap.set([door.pleat, door.grip], { opacity: 0 });
    P.door = door;
    // Welt-Geometrie des Plissees (für Hände/Kassette)
    const g = door.geo;
    P.gripX0 = DX + g.sx0 + 14 + g.plW * 0.015; // linke Kante Griffleiste (eingeclipst)
    P.gripCX = P.gripX0 + g.gripW / 2;
    P.cassTop = DY + g.ft + 8;
    P.cassH = DH - g.th - g.ft - 10;
    P.cassCY = P.cassTop + P.cassH / 2;

    // ---- Wand mit Öffnung, Laibung, Boden ----
    const W = L.wall;
    S("path", { d: `M-600,-400 H3600 V${FL} H-600 Z M${DX},${DY} V${FL} H${DX + DW} V${DY} Z`, "fill-rule": "evenodd", fill: C.cream }, W);
    const glow = SETS.radial(svg, "ptGlow", [[0, "#fff4dc", 0.9], [1, "#fff4dc", 0]]);
    S("ellipse", { cx: Cx, cy: DY + DH * 0.55, rx: 820, ry: 520, fill: glow, opacity: 0.55 }, W);
    S("path", { d: `M${DX - 26},${DY - 22} H${DX + DW + 26} L${DX + DW},${DY} H${DX} Z`, fill: C.cream3 }, W);
    S("path", { d: `M${DX - 26},${DY - 22} L${DX},${DY} V${FL} L${DX - 26},${FL} Z`, fill: C.cream2 }, W);
    S("path", { d: `M${DX + DW + 26},${DY - 22} L${DX + DW},${DY} V${FL} L${DX + DW + 26},${FL} Z`, fill: C.cream3 }, W);
    // Boden (Estrich, hell) + Fuge + Sonnenfleck
    const floorG = SETS.gradient(svg, "ptFloor", [[0, "#dcd6cc"], [1, "#cbc3b6"]]);
    S("rect", { x: -600, y: FL, width: 4200, height: 600, fill: floorG }, W);
    for (let i = -6; i <= 6; i++) S("line", { x1: Cx + i * 330, y1: FL, x2: Cx + i * 560, y2: FL + 300, stroke: "#bfb6a7", "stroke-width": 2.5, opacity: 0.6 }, W);
    S("line", { x1: -600, y1: FL + 110, x2: 3600, y2: FL + 110, stroke: "#bfb6a7", "stroke-width": 2.5, opacity: 0.45 }, W);
    S("path", { d: `M${DX + 40},${FL} H${DX + DW - 30} L${DX + DW + 260},${FL + 230} H${DX - 180} Z`, fill: "#fff4dc", opacity: 0.5 }, W);
    S("rect", { x: -600, y: FL - 8, width: DX + 600, height: 10, fill: "#fbf8f2" }, W);
    S("rect", { x: DX + DW, y: FL - 8, width: 3000, height: 10, fill: "#fbf8f2" }, W);

    // ---- Requisiten: Stehleiter + Eimer, Werkzeugkiste, Baustellenlampe, Steckdose ----
    const pr = L.props;
    const lad = S("g", null, pr);
    const lx = DX - 360, ly = FL + 40;
    S("path", { d: `M${lx - 40},${ly} L${lx + 2},${ly - 540} M${lx + 66},${ly} L${lx + 108},${ly - 540}`, stroke: C.cream2, "stroke-width": 16, "stroke-linecap": "round", transform: "translate(14,4)" }, lad);
    S("path", { d: `M${lx - 52},${ly} L${lx - 10},${ly - 540} M${lx + 54},${ly} L${lx + 96},${ly - 540}`, stroke: C.b4, "stroke-width": 13, "stroke-linecap": "round" }, lad);
    for (let i = 1; i <= 6; i++) {
      const k = i / 7, yy = ly - 540 * k;
      S("line", { x1: lx - 52 + 42 * k, y1: yy, x2: lx + 54 + 42 * k, y2: yy, stroke: C.b5, "stroke-width": 9, "stroke-linecap": "round" }, lad);
    }
    [[lx - 52, ly], [lx + 54, ly]].forEach(([x, y]) => S("rect", { x: x - 12, y: y - 6, width: 24, height: 12, rx: 4, fill: C.an1 }, lad));
    const pail = S("g", null, pr);
    const px = lx + 170, py = FL + 56;
    S("ellipse", { cx: px, cy: py + 2, rx: 50, ry: 8, fill: C.blue, opacity: 0.14 }, pail);
    S("path", { d: `M${px - 40},${py - 86} L${px - 34},${py} H${px + 34} L${px + 40},${py - 86} Z`, fill: "#fbf8f2" }, pail);
    S("rect", { x: px - 44, y: py - 94, width: 88, height: 14, rx: 5, fill: C.b4 }, pail);
    S("path", { d: `M${px - 38},${py - 88} Q${px},${py - 140} ${px + 38},${py - 88}`, stroke: C.an3, "stroke-width": 4, fill: "none" }, pail);
    S("path", { d: `M${px - 37},${py - 52} H${px + 37}`, stroke: C.b5, "stroke-width": 8 }, pail);
    const tb = S("g", null, pr);
    const tx = DX - 110, ty = FL + 64;
    S("ellipse", { cx: tx, cy: ty + 2, rx: 92, ry: 10, fill: C.blue, opacity: 0.14 }, tb);
    S("rect", { x: tx - 80, y: ty - 74, width: 160, height: 74, rx: 8, fill: C.an2 }, tb);
    S("rect", { x: tx - 84, y: ty - 92, width: 168, height: 26, rx: 7, fill: C.b3 }, tb);
    S("path", { d: `M${tx - 36},${ty - 92} V${ty - 114} H${tx + 36} V${ty - 92}`, stroke: C.an1, "stroke-width": 9, fill: "none", "stroke-linejoin": "round" }, tb);
    S("rect", { x: tx - 10, y: ty - 72, width: 20, height: 12, rx: 3, fill: C.red }, tb);
    const bulb = S("g", null, pr);
    const bx = DX - 220;
    S("line", { x1: bx, y1: -400, x2: bx, y2: 92, stroke: C.an2, "stroke-width": 4 }, bulb);
    S("rect", { x: bx - 9, y: 88, width: 18, height: 20, rx: 3, fill: C.an3 }, bulb);
    S("circle", { cx: bx, cy: 128, r: 34, fill: "#fff4dc", opacity: 0.6 }, bulb);
    S("ellipse", { cx: bx, cy: 126, rx: 17, ry: 21, fill: C.y3 }, bulb);
    S("path", { d: `M${bx - 6},${118} q6,10 12,0`, stroke: C.y1, "stroke-width": 2.5, fill: "none" }, bulb);
    S("rect", { x: DX + DW + 150, y: 612, width: 36, height: 36, rx: 5, fill: "#fbf8f2", stroke: C.cream3, "stroke-width": 2 }, pr);
    S("circle", { cx: DX + DW + 168, cy: 630, r: 9, fill: C.cream3 }, pr);

    // ---- Ben ----
    const ben = CHAR.makeBen(L.char, { x: Bx, y: BY, s });
    P.ben = ben;
    P.handR = Array.from(ben.armR.h.children);
    P.handL = Array.from(ben.armL.h.children);

    // Halter in den Händen: Ursprung am Griffpunkt, Inhalt in Weltmaßen (Skalierung 1/s kompensiert)
    const GY = 10;
    P.GY = GY;
    P.hold = {};
    ["armL", "armR"].forEach((side) => {
      const h = ben[side].h;
      const wrap = S("g", { transform: `translate(0,${GY})` }, null);
      h.insertBefore(wrap, h.firstChild);
      const rot = S("g", null, wrap);
      const content = S("g", { transform: `scale(${1 / s})` }, rot);
      P.hold[side] = { rot, content };
    });

    // Tablet (linke Hand, Griff am linken Rand)
    const tab = S("g", null, P.hold.armL.content);
    P.tablet = tab;
    S("rect", { x: -12, y: -46, width: 136, height: 92, rx: 11, fill: C.an1 }, tab);
    S("rect", { x: -3, y: -38, width: 118, height: 76, rx: 5, fill: "#fff" }, tab);
    S("rect", { x: -3, y: -38, width: 118, height: 14, fill: C.blue }, tab);
    S("rect", { x: 6, y: -15, width: 50, height: 9, rx: 3, fill: C.b4 }, tab);
    P.tabTrack = S("rect", { x: 82, y: -17, width: 26, height: 13, rx: 6.5, fill: C.b5 }, tab);
    P.tabKnob = S("circle", { cx: 88.5, cy: -10.5, r: 5, fill: "#fff" }, tab);
    for (let i = 0; i < 4; i++) {
      P["tabRow" + i] = S("g", { opacity: 0.25 }, tab);
      S("circle", { cx: 12, cy: 6 + i * 8.5, r: 3, fill: C.blue }, P["tabRow" + i]);
      S("rect", { x: 19, y: 4.5 + i * 8.5, width: 50 - i * 6, height: 3.4, rx: 1.7, fill: C.b3 }, P["tabRow" + i]);
    }
    P.tabCenter = { x: 56, y: 0 }; // im Tablet-Raum (Weltmaß)

    // Maßband (rechte Hand)
    const tape = S("g", { opacity: 0 }, P.hold.armR.content);
    P.tape = tape;
    const TL = 140;
    P.tapeL = TL;
    const blade = G(tape, { x: 20, y: 12 });
    P.blade = blade;
    S("rect", { x: 0, y: -6, width: TL, height: 12, fill: C.yellow }, blade);
    for (let i = 1; i * 10 < TL; i++) S("line", { x1: i * 10, y1: -6, x2: i * 10, y2: i % 5 ? -2 : 2, stroke: C.ink, "stroke-width": 1.6 }, blade);
    const hook = S("g", null, tape);
    P.hook = hook;
    S("rect", { x: 20, y: 3, width: 6, height: 19, rx: 2, fill: C.an3 }, hook);
    S("rect", { x: -24, y: -24, width: 48, height: 48, rx: 11, fill: C.an1 }, tape);
    S("circle", { cx: 0, cy: 0, r: 14, fill: C.an3 }, tape);
    S("circle", { cx: 0, cy: 0, r: 5, fill: C.b5 }, tape);
    S("rect", { x: -24, y: -8, width: 7, height: 16, rx: 3, fill: C.b4 }, tape);

    // ---- Halte-/Greif-Helfer (für s09 + s10) ----
    const RAD = Math.PI / 180;
    P.state = { armL: [10, -8], armR: [-10, 8], lean: 0, ang: { armL: 90, armR: 0 } };
    P.shoulder = (side, leanY) => ({ x: Bx + s * (side === "armR" ? 62 : -62), y: BY + s * (-440 + (leanY || 0)) });
    P.fk = (side, u, f, leanY) => {
      const sh = P.shoulder(side, leanY);
      const ex = sh.x - s * 92 * Math.sin(u * RAD), ey = sh.y + s * 92 * Math.cos(u * RAD);
      const a = (u + f) * RAD;
      return { x: ex - s * (86 + GY) * Math.sin(a), y: ey + s * (86 + GY) * Math.cos(a) };
    };
    P.ik = (side, target, leanY, bend) => ANIM.ik(P.shoulder(side, leanY), target, s * 92, s * (86 + GY), bend === undefined ? (side === "armR" ? -1 : 1) : bend);
    // Arm (Ziel {x,y} oder Winkel [u,f]) + Halter-Ausrichtung (Weltwinkel) synchron tweenen
    P.armTo = (tl, t, side, spec, dur, ease, o) => {
      o = o || {};
      const leanY = o.lean === undefined ? P.state.lean : o.lean;
      const uf = Array.isArray(spec) ? spec.slice() : P.ik(side, spec, leanY, o.bend);
      const ang = o.angle === undefined ? P.state.ang[side] : o.angle;
      const p = {};
      p[side] = uf;
      ben.pose(tl, t, p, dur, ease);
      const v = { rotation: ang - (uf[0] + uf[1]), svgOrigin: "0 0" };
      if (dur === 0 || t <= 0.0001) {
        if (t <= 0.0001) gsap.set(P.hold[side].rot, v);
        else tl.set(P.hold[side].rot, v, t);
      } else tl.to(P.hold[side].rot, Object.assign(v, { duration: dur, ease: ease || "power2.inOut" }), t);
      P.state[side] = uf;
      P.state.ang[side] = ang;
      return uf;
    };
    // Welt -> Bildschirm für eine Kamera-Einstellung
    P.toScreen = (pt, c) => ({ x: (pt.x - c.x) * c.z + 960, y: (pt.y - c.y) * c.z + 540 });
    P.CAM9 = { x: Bx + 395, y: 690, z: 1.3 };

    // ---- HUD: Tablet-/Bestell-Panel ----
    const h = R.huds[ctx.id];
    const css = document.createElement("style");
    css.textContent = `
      .p9-panel { position:absolute; left:892px; top:122px; width:940px; background:#fff; box-shadow:0 26px 64px rgba(18,52,66,.30); opacity:0; }
      .p9-l { position:absolute; }
      .p9-ly { left:-24px; top:-24px; width:250px; height:190px; border-left:12px solid var(--sch-yellow); border-top:12px solid var(--sch-yellow); }
      .p9-lr { right:-26px; bottom:-26px; width:220px; height:170px; border-right:12px solid var(--sch-red); border-bottom:12px solid var(--sch-red); }
      .p9-head { position:relative; height:94px; background:var(--sch-blue); color:#fff; font-weight:800; font-size:40px; display:flex; align-items:center; padding:0 40px; white-space:nowrap; }
      .p9-head sup { font-size:22px; margin-right:10px; }
      .p9-dots { position:absolute; right:34px; top:38px; display:flex; gap:10px; }
      .p9-dots i { display:block; width:14px; height:14px; border-radius:50%; background:#4b6f80; }
      .p9-row { display:flex; align-items:center; padding:24px 40px 22px; }
      .p9-name { font-weight:900; font-size:60px; color:var(--sch-blue); letter-spacing:-.01em; line-height:1; }
      .p9-state { margin-left:auto; margin-right:22px; font-weight:700; font-size:32px; color:#4b6f80; opacity:0; }
      .p9-tog { position:relative; width:132px; height:70px; border-radius:35px; background:#b9cad1; flex:none; }
      .p9-knob { position:absolute; left:7px; top:7px; width:56px; height:56px; border-radius:50%; background:#fff; box-shadow:0 3px 8px rgba(18,52,66,.28); }
      .p9-ring { position:absolute; left:-4px; top:-4px; width:78px; height:78px; border-radius:50%; border:5px solid var(--sch-red); opacity:0; }
      .p9-sep { height:3px; background:#e3ebee; margin:0 40px; }
      .p9-steps { padding:20px 40px 8px; }
      .p9-step { position:relative; display:flex; align-items:center; height:102px; }
      .p9-ic { width:82px; height:82px; border-radius:50%; border:4px solid var(--sch-blue); background:#fff; display:flex; align-items:center; justify-content:center; flex:none; opacity:0; }
      .p9-ic svg { width:52px; height:52px; overflow:visible; }
      .p9-lbl { margin-left:28px; font-weight:700; font-size:36px; color:var(--sch-blue); white-space:nowrap; opacity:0; }
      .p9-con { position:absolute; left:39px; top:-10px; width:5px; height:20px; background:var(--sch-red); transform-origin:50% 0%; transform:scaleY(0); }
      .p9-note { display:flex; align-items:center; gap:20px; margin:10px 40px 34px; padding:16px 26px; background:#e3ebee; font-weight:800; font-size:44px; color:var(--sch-blue); white-space:nowrap; opacity:0; }
      .p9-note .bar { width:7px; height:46px; background:var(--sch-red); flex:none; }
      .p9-note svg { width:66px; height:48px; margin-left:auto; overflow:visible; }
    `;
    document.head.appendChild(css);
    const ln = 'fill="none" stroke="#123442" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"';
    // Zahnrad-Pfad
    let gear = "";
    for (let i = 0; i < 16; i++) {
      const a0 = (i / 16) * Math.PI * 2, rr = i % 2 ? 15 : 21;
      const a1 = ((i + 1) / 16) * Math.PI * 2;
      gear += `${i ? "L" : "M"}${(26 + Math.cos(a0) * rr).toFixed(1)},${(26 + Math.sin(a0) * rr).toFixed(1)} L${(26 + Math.cos(a1) * rr).toFixed(1)},${(26 + Math.sin(a1) * rr).toFixed(1)} `;
    }
    const icons = [
      `<svg viewBox="0 0 52 52"><rect x="4" y="5" width="30" height="40" rx="3" ${ln}/><path d="M12 5v40M19 5v40M26 5v40" ${ln} stroke-width="2.5"/><path d="M30 25 L48 33 L40 36 L37 45 Z" fill="#fff" stroke="#123442" stroke-width="4" stroke-linejoin="round"/></svg>`,
      `<svg viewBox="0 0 52 52"><path d="${gear}Z" ${ln}/><circle cx="26" cy="26" r="7" ${ln}/></svg>`,
      `<svg viewBox="0 0 52 52"><path d="M4 46 V24 L16 32 V24 L28 32 V24 L40 32 V8 H48 V46 Z" ${ln}/><path d="M12 40h6M24 40h6" ${ln}/></svg>`,
      `<svg viewBox="0 0 52 52"><path d="M2 12 H30 V38 H2 Z" ${ln}/><path d="M30 20 H40 L49 29 V38 H30" ${ln}/><circle cx="12" cy="40" r="5" fill="#fff" stroke="#123442" stroke-width="4"/><circle cx="40" cy="40" r="5" fill="#fff" stroke="#123442" stroke-width="4"/></svg>`,
    ];
    const labels = ["InScreen auswählen", "Automatische Systemkonfiguration", "Passgenauer Zuschnitt und Produktion", "Plug-&amp;-Play-Set zur Auslieferung"];
    const panel = ANIM.el("div", "p9-panel", h);
    panel.innerHTML = `
      <div class="p9-l p9-ly"></div><div class="p9-l p9-lr"></div>
      <div class="p9-head">QuinLine<sup>®</sup> 74 · Auftrag<div class="p9-dots"><i></i><i></i><i></i></div></div>
      <div class="p9-row"><div class="p9-name">InScreen</div><div class="p9-state">bestellt</div><div class="p9-tog"><div class="p9-ring"></div><div class="p9-knob"></div></div></div>
      <div class="p9-sep"></div>
      <div class="p9-steps">${labels.map((l, i) => `<div class="p9-step">${i ? '<div class="p9-con"></div>' : ""}<div class="p9-ic">${icons[i]}</div><div class="p9-lbl">${l}</div></div>`).join("")}</div>
      <div class="p9-note"><div class="bar"></div>Maße liegen vor<svg viewBox="0 0 66 48"><path d="M2 40 L56 6 L64 18 L10 46 Z" ${ln}/><path d="M14 33 l3 5 M24 27 l4 6 M34 21 l3 5 M44 15 l4 6" ${ln} stroke-width="3"/></svg></div>`;
    P.panel = panel;
    P.q = (sel) => panel.querySelector(sel);
    P.qa = (sel) => panel.querySelectorAll(sel);
  }

  function build(ctx, tl, R) {
    const P = R.partner;
    const { C } = SVGK;
    const O0 = CHAR.O0;
    const ben = P.ben, cam = P.cam, Bx = P.Bx, BY = P.BY;
    const t0 = ctx.t0, t1 = ctx.t1, tPre = t0 - 0.32;
    const tFuer = ctx.w("für");
    const tFach = ctx.w("fachpartner");
    const tBest = ctx.w("bestellt");
    const tWird = ctx.w("wird");
    const tAus = ctx.w("aus");
    const tHand = ctx.w("hand");
    const tDie = ctx.w("die");
    const tMasse = ctx.w("maße");
    const tLieg = ctx.w("liegen");
    const tSchon = ctx.w("schon");
    const tVor = ctx.w("vor");

    // ---- Startzustand ----
    ben.init(tl);
    // Kamera: erst Ben mittig (Winken), dann Platz fürs Panel, danach sanftes Driften
    cam.to(tl, 0, { x: Bx + 190, y: P.CAM9.y + 8, z: 1.28 }, 0);
    P.armTo(tl, 0, "armL", [10, -8], 0, null, { angle: 88 });
    P.armTo(tl, 0, "armR", [-10, 8], 0, null, { angle: 0 });
    ben.pose(tl, 0, { head: 0 }, 0).look(tl, 0, 0, 1, 0).brows(tl, 0, "neutral", 0).mouth(tl, 0, "smile");
    gsap.set(P.blade, Object.assign({ scaleX: 0.02 }, O0));
    gsap.set(P.hook, { x: -P.tapeL * 0.98 });
    ben.breathe(tl, tPre, t1, 0.013, 1.7);
    ben.blinks(tl, tPre, tMasse - 0.2, 21);
    P.clouds.forEach((c, i) => tl.fromTo(c, { x: 0 }, { x: 40 + i * 18, duration: 16, ease: "sine.inOut" }, tPre));

    // ---- „Für Sie als Fachpartner“: Winken ----
    const tUp = tFuer - 0.12;
    tl.to(ben.lean, { y: 6, duration: 0.14, ease: "power2.in" }, tUp - 0.12);
    tl.to(ben.lean, { y: 0, duration: 0.4, ease: "back.out(2.2)" }, tUp + 0.02);
    P.armTo(tl, tUp, "armR", [-124, -55], 0.34, "back.out(1.7)");
    ben.brows(tl, tUp, "happy", 0.2).look(tl, tUp, 1, -1, 0.2);
    const nW = 4, per = 0.24;
    for (let i = 0; i < nW; i++) {
      ben.pose(tl, tUp + 0.34 + i * per, { armR: [undefined, i % 2 ? -32 : -82] }, per, "sine.inOut");
    }
    P.state.armR = [-124, -32];
    ben.mouth(tl, tFach - 0.04, "grin");
    tl.to(ben.head, Object.assign({ rotation: -7, duration: 0.3, ease: "back.out(2)" }, O0), tFach - 0.06);
    tl.to(ben.head, Object.assign({ rotation: 0, duration: 0.4, ease: "power2.inOut" }, O0), tFach + 0.5);
    ANIM.sfx(tUp + 0.05, "swish", -10);

    // ---- Tablet hoch, Panel springt heraus ----
    const tTab = tUp + 0.34 + nW * per - 0.06;
    const tabHand = { x: Bx - 52, y: BY - 300 };
    P.armTo(tl, tTab, "armL", tabHand, 0.36, "power3.out", { angle: -6 });
    ben.look(tl, tTab + 0.08, -3, 5, 0.18).mouth(tl, tTab + 0.1, "smile");
    // Bildschirm-Mitte des Tablets in Welt (Halter-Ursprung + Drehung)
    const uf = P.state.armL;
    const hp = P.fk("armL", uf[0], uf[1], 0);
    const a = -6 * Math.PI / 180;
    const tabC = { x: hp.x + P.tabCenter.x * Math.cos(a) - P.tabCenter.y * Math.sin(a), y: hp.y + P.tabCenter.x * Math.sin(a) + P.tabCenter.y * Math.cos(a) };
    P.tabC = tabC;
    const tPan = tTab + 0.14;
    cam.to(tl, tFach - 0.12, P.CAM9, tPan + 0.12 - (tFach - 0.12), "power2.inOut");
    cam.to(tl, tPan + 0.12, { x: P.CAM9.x - 12, y: P.CAM9.y + 4, z: 1.325 }, t1 - (tPan + 0.12), "sine.inOut");
    const scr = P.toScreen(tabC, P.CAM9);
    const panel = P.panel;
    gsap.set(panel, { transformOrigin: `${(scr.x - 892).toFixed(0)}px ${(scr.y - 122).toFixed(0)}px` });
    tl.fromTo(panel, { scale: 0.07, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.5, ease: "back.out(1.25)" }, tPan);
    tl.fromTo(P.q(".p9-ly"), { scaleX: 0, scaleY: 0, transformOrigin: "0% 0%" }, { scaleX: 1, scaleY: 1, duration: 0.45, ease: "power3.out" }, tPan + 0.32);
    tl.fromTo(P.q(".p9-lr"), { scaleX: 0, scaleY: 0, transformOrigin: "100% 100%" }, { scaleX: 1, scaleY: 1, duration: 0.45, ease: "power3.out" }, tPan + 0.4);
    ANIM.sfx(tPan, "whooshSoft", -6);
    ANIM.sfx(tPan + 0.38, "pop", -10);

    // ---- „Bestellt“: Tipp aufs Tablet, Schalter springt um ----
    const tapPt = { x: tabC.x + 26, y: tabC.y - 12 };
    const tTap = tBest + 0.02;
    P.armTo(tl, tTab + 0.06, "armR", { x: tapPt.x + 10, y: tapPt.y - 34 }, tTap - 0.1 - (tTab + 0.06), "power2.inOut", { bend: 1 });
    P.armTo(tl, tTap - 0.1, "armR", tapPt, 0.1, "power3.in", { bend: 1 });
    P.armTo(tl, tTap + 0.02, "armR", { x: tapPt.x + 8, y: tapPt.y - 26 }, 0.2, "power2.out", { bend: 1 });
    ben.look(tl, tTap - 0.3, -1, 6, 0.15).brows(tl, tTap - 0.3, "neutral", 0.2);
    const tSw = tTap + 0.03;
    tl.to(P.q(".p9-knob"), { x: 62, duration: 0.26, ease: "back.out(2.4)" }, tSw);
    tl.to(P.q(".p9-tog"), { backgroundColor: "#e3002c", duration: 0.16, ease: "power1.out" }, tSw);
    tl.fromTo(P.q(".p9-ring"), { scale: 0.7, opacity: 0.9 }, { scale: 1.5, opacity: 0, duration: 0.45, ease: "power2.out" }, tSw);
    tl.fromTo(P.q(".p9-state"), { opacity: 0, x: 24 }, { opacity: 1, x: 0, duration: 0.3, ease: "power3.out" }, tSw + 0.08);
    tl.to(P.tabKnob, { attr: { cx: 101.5 }, duration: 0.2, ease: "back.out(2)" }, tSw);
    tl.to(P.tabTrack, { fill: C.red, duration: 0.12, ease: "power1.out" }, tSw);
    ANIM.sfx(tTap, "tap", -6);
    ANIM.sfx(tSw + 0.02, "click", -4);
    ben.mouth(tl, tSw + 0.06, "grin").brows(tl, tSw + 0.04, "happy", 0.2);
    // zum Panel schauen, Nicken bei „wird“
    ben.look(tl, tSw + 0.35, 6, -1, 0.2);
    tl.to(ben.head, Object.assign({ rotation: 5, duration: 0.18, ease: "power2.out" }, O0), tWird - 0.05);
    tl.to(ben.head, Object.assign({ rotation: 0, duration: 0.3, ease: "back.out(2)" }, O0), tWird + 0.13);
    P.armTo(tl, tSw + 0.3, "armR", [-18, 14], 0.4, "power2.inOut");

    // ---- „aus einer Hand“: Ben präsentiert mit offener Hand, Schritte poppen auf ----
    const tPres = tAus - 0.05;
    P.armTo(tl, tPres, "armR", { x: Bx + 178, y: BY - 418 }, 0.38, "back.out(1.6)");
    ben.mouth(tl, tPres + 0.1, "smile");
    const steps = P.qa(".p9-step");
    const tS0 = tHand - 0.42;
    steps.forEach((el, i) => {
      const ts = tS0 + i * 0.21;
      const ic = el.querySelector(".p9-ic"), lb = el.querySelector(".p9-lbl"), con = el.querySelector(".p9-con");
      if (con) tl.to(con, { scaleY: 1, duration: 0.16, ease: "power2.out" }, ts - 0.08);
      tl.fromTo(ic, { scale: 0.2, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.36, ease: "back.out(2.6)" }, ts);
      tl.fromTo(lb, { opacity: 0, x: -26 }, { opacity: 1, x: 0, duration: 0.34, ease: "power3.out" }, ts + 0.05);
      tl.to(P["tabRow" + i], { opacity: 1, duration: 0.12, ease: "power1.out" }, ts);
      ANIM.sfx(ts, "pop", -7 - i);
    });
    ben.look(tl, tS0, 6, 1, 0.2).look(tl, tS0 + 0.45, 6, 3, 0.25);

    // ---- „die Maße“: Maßband ziehen ----
    const pouch = { x: Bx + P.s * 43, y: BY - P.s * 250 };
    const tGrab = tDie - 0.1;
    P.armTo(tl, tGrab, "armR", pouch, 0.26, "power2.inOut", { angle: 0 });
    ben.look(tl, tGrab, 3, 7, 0.16).brows(tl, tGrab, "sly", 0.2).mouth(tl, tGrab + 0.1, "smirk");
    tl.set(P.tape, { opacity: 1 }, tGrab + 0.26);
    ANIM.sfx(tGrab + 0.24, "swish", -9);
    const tPoint = tGrab + 0.32;
    P.armTo(tl, tPoint, "armR", { x: Bx + 128, y: BY - 318 }, tMasse + 0.05 - tPoint, "back.out(1.5)");
    const tOut = tMasse + 0.02;
    tl.to(P.blade, Object.assign({ scaleX: 1, duration: 0.3, ease: "power3.out" }, O0), tOut);
    tl.to(P.hook, { x: 0, duration: 0.3, ease: "power3.out" }, tOut);
    ANIM.sfx(tOut, "zip", -6, { dur: 0.3 });
    ben.look(tl, tOut + 0.05, 7, 3, 0.2).brows(tl, tOut, "annoyed", 0.2).mouth(tl, tOut + 0.05, "flat");
    tl.to(ben.head, Object.assign({ rotation: 4, duration: 0.3, ease: "power2.out" }, O0), tOut);

    // ---- „liegen“: Hinweis „Maße liegen vor“ ----
    const tNote = tLieg + 0.02;
    const note = P.q(".p9-note");
    tl.fromTo(note, { opacity: 0, scale: 0.7, y: 18 }, { opacity: 1, scale: 1, y: 0, duration: 0.42, ease: "back.out(2.2)" }, tNote);
    ANIM.sfx(tNote, "ding", -3);
    ben.look(tl, tNote + 0.1, 7, -2, 0.12).brows(tl, tNote + 0.1, "surprised", 0.14).mouth(tl, tNote + 0.12, "O");
    tl.to(ben.head, Object.assign({ rotation: -3, duration: 0.25, ease: "back.out(2)" }, O0), tNote + 0.1);

    // ---- „schon“: grinsendes Schulterzucken ----
    const tSh = tSchon - 0.06;
    tl.to(ben.lean, { y: -12, duration: 0.18, ease: "power2.out" }, tSh);
    tl.to(ben.lean, { y: 0, duration: 0.4, ease: "back.out(2)" }, tSh + 0.3);
    P.armTo(tl, tSh, "armR", { x: Bx + 150, y: BY - 360 }, 0.22, "power2.out");
    P.armTo(tl, tSh, "armL", { x: Bx - 74, y: BY - 336 }, 0.22, "power2.out");
    P.armTo(tl, tSh + 0.3, "armR", { x: Bx + 128, y: BY - 318 }, 0.38, "back.out(1.6)");
    P.armTo(tl, tSh + 0.3, "armL", tabHand, 0.38, "back.out(1.6)");
    tl.to(ben.head, Object.assign({ rotation: 9, duration: 0.22, ease: "power2.out" }, O0), tSh + 0.04);
    tl.to(ben.head, Object.assign({ rotation: 2, duration: 0.45, ease: "power2.inOut" }, O0), tSh + 0.42);
    ben.mouth(tl, tSh + 0.02, "grin").brows(tl, tSh, "happy", 0.18).look(tl, tSh + 0.05, -2, 0, 0.18);

    // ---- „vor“: Maßband schnappt zurück ----
    const tSnap = tVor;
    tl.to(P.blade, Object.assign({ scaleX: 0.02, duration: 0.12, ease: "power4.in" }, O0), tSnap);
    tl.to(P.hook, { x: -P.tapeL * 0.98, duration: 0.12, ease: "power4.in" }, tSnap);
    ANIM.sfx(tSnap, "zip", -4, { dur: 0.14 });
    const fR = P.state.armR[1];
    tl.to(ben.armR.f, Object.assign({ rotation: fR - 14, duration: 0.05, ease: "power2.out" }, O0), tSnap + 0.1);
    tl.to(ben.armR.f, Object.assign({ rotation: fR, duration: Math.max(0.08, Math.min(0.22, t1 - tSnap - 0.16)), ease: "back.out(3)" }, O0), tSnap + 0.15);
    ben.eyesClosed(tl, tSnap + 0.1, true).eyesClosed(tl, tSnap + 0.3, false);
    ben.blinks(tl, tSnap + 0.4, t1 + 0.2, 23);
    ben.look(tl, tSnap + 0.36, 0, 1, 0.2);
  }

  SC.s09 = { set: "partner", setup, build };
})();
