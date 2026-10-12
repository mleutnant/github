// s08 (9:16) — „Das Fiberglas-Plissee gleitet stufenlos auf und zu. Die Mücken? Bleiben draußen.“
// Hochformat: Kamera auf Tür + Anna (ganze Figur unter den Texten), Gewebe-Lupe und Chips oben.
// Anna bedient die Griffleiste mit einer Hand, die Kamera schwenkt mit. Auf „Mücken“ leichte Ranfahrt:
// eine Mücke prallt links neben Anna ans Gewebe, die Bande zieht beleidigt nach links in den Garten ab.
(window.SCENES = window.SCENES || {}).s08 = {
  set: "lr",
  setup(R, ctx) {
    const h = R.huds[ctx.id];
    const css = document.createElement("style");
    css.textContent = `
      .s08-mesh { position:absolute; left:744px; top:234px; width:232px; height:232px; border-radius:50%; overflow:hidden;
        background-color:#e9eef0;
        background-image: repeating-linear-gradient(0deg, rgba(47,53,58,.55) 0 3px, transparent 3px 14px), repeating-linear-gradient(90deg, rgba(47,53,58,.55) 0 3px, transparent 3px 14px);
        box-shadow: 0 0 0 10px #fff, 0 0 0 16px var(--sch-yellow), 0 20px 50px rgba(18,52,66,.25); }
      .s08-chip { position:absolute; font-size:52px; padding:14px 30px 16px 22px; gap:16px; }
      .s08-chip .bar { height:50px; }
    `;
    document.head.appendChild(css);
    const mesh = ANIM.el("div", "s08-mesh", h);
    const c1 = ANIM.el("div", "chip s08-chip", h, '<div class="bar"></div>Fiberglas-Plissee');
    c1.style.left = "60px"; c1.style.top = "250px";
    const c2 = ANIM.el("div", "chip s08-chip", h, '<div class="bar"></div>stufenlos');
    c2.style.left = "60px"; c2.style.top = "362px";
    gsap.set([c1, c2], { transformOrigin: "0% 50%" });
    R._s08 = { mesh, c1, c2 };
  },
  build(ctx, tl, R) {
    const { S, C, G, rng } = SVGK;
    const lr = R.sets.lr, door = lr.door, anna = R.anna, cam = lr.cam;
    const O0 = CHAR.O0;
    const { mesh, c1, c2 } = R._s08;
    const t0 = ctx.t0, t1 = ctx.t1, tPre = t0 - 0.32;
    const tFib = ctx.w("fiberglas");
    const tGl = ctx.w("gleitet");
    const tStu = ctx.w("stufenlos");
    const tAuf = ctx.w("auf");
    const tZu = ctx.w("zu");
    const tMue = ctx.w("mücken");
    const tBle = ctx.w("bleiben");
    const tDra = ctx.w("draußen");
    const FY = 952, s = 0.92;
    // Kamera: Füße bei Bild-y ≈ 1336, Kopf (Dutt) bleibt unter den Texten (Bild-y > 500)
    const CAM0 = { x: 1110, y: 687, z: 1.42 };
    const CAM1 = { x: 1235, y: 687, z: 1.42 };
    const CAM2 = { x: 1245, y: 670, z: 1.52 };

    // Startzustand
    door.screen(tl, tPre, 0.015, 0);
    cam.to(tl, tPre, CAM0, 0);
    R.mIn.forEach((m) => tl.set(m.root, { opacity: 0 }, tPre));
    const g0 = door.gripWorld(0.015);
    const off = 98; // Anna steht links von der Griffleiste
    tl.set(anna.root, { x: g0.x - off, y: FY }, tPre);
    tl.set(anna.lean, Object.assign({ scaleX: 1, scaleY: 1, y: 0, rotation: 0 }, O0), tPre);
    anna.pose(tl, tPre, { armL: [10, -6], legL: [0, 0], legR: [0, 0], head: 4 }, 0);
    const reachAt = (t, dur) => ANIM.reach(tl, t, anna, "armR", { x: g0.x, y: g0.y + 30 }, { x: g0.x - off, y: FY }, s, -1, dur);
    reachAt(tPre, 0);
    anna.expr(tl, tPre, "smile", "neutral", [5, 1]);
    anna.blinks(tl, t0 + 0.2, t1, 23);

    // Mücken draußen: warten im Garten (rechts von Anna, im noch offenen Teil der Tür)
    const wait = [{ x: 1116, y: 762 }, { x: 1300, y: 476 }, { x: 1386, y: 800 }];
    R.mOut.forEach((m, i) => {
      tl.set(m.root, { x: wait[i].x, y: wait[i].y, scale: 0.5, opacity: 1 }, tPre);
      tl.set(m.bob, { scaleX: 1, scaleY: 1, x: 0, y: 0, rotation: 0, transformOrigin: "50% 50%" }, tPre);
      m.face_(tl, tPre, -1);
      m.expr(tl, tPre, "smirk", "sly");
      m.buzz(tl, tPre, t1 + 0.7);
      m.hover(tl, tPre, tMue - (i ? 0.3 : 0.45), 70 + i, 6);
    });

    // Fiberglas: Gewebe-Lupe + Chip (oben)
    tl.fromTo(mesh, { opacity: 0, scale: 0.5 }, { opacity: 1, scale: 1, duration: 0.45, ease: "back.out(1.8)" }, tFib - 0.05);
    tl.fromTo(mesh, { backgroundPosition: "0px 0px" }, { backgroundPosition: "28px 14px", duration: t1 - tFib, ease: "sine.inOut" }, tFib);
    tl.fromTo(c1, { opacity: 0, x: -40 }, { opacity: 1, x: 0, duration: 0.4, ease: "power3.out" }, tFib + 0.15);
    ANIM.sfx(tFib - 0.05, "pop", -8);

    // stufenlos auf und zu — Anna zieht in Etappen, die Griffleiste bleibt an jeder Stelle stehen
    const stops = [
      [tGl - 0.1, 0.42, 0.75, "power2.inOut"],
      [tStu + 0.05, 0.72, 0.55, "power3.out"],
      [tAuf - 0.05, 0.46, 0.45, "power2.inOut"],
      [tZu - 0.05, 1.0, 0.55, "power3.inOut"],
    ];
    stops.forEach(([t, f, d, e], i) => {
      door.screen(tl, t, f, d, e);
      tl.to(anna.root, { x: door.gripWorld(f).x - off, duration: d, ease: e }, t);
      ANIM.walk(tl, anna, t + 0.02, d - 0.05, { step: Math.max(0.18, d / 3), swing: 11 });
      ANIM.sfx(t, "slide", -12, { dur: d });
      if (i === 3) ANIM.sfx(t + d, "magnet", -4);
    });
    tl.fromTo(c2, { opacity: 0, x: -40 }, { opacity: 1, x: 0, duration: 0.4, ease: "back.out(1.6)" }, tStu + 0.05);
    ANIM.sfx(tStu + 0.05, "pop", -10);
    anna.look(tl, tGl, 6, 0).mouth(tl, tGl + 0.1, "grin").brows(tl, tGl, "happy");
    // Kamera schwenkt ruhig mit (folgt nicht jedem Hin und Her)
    const tPan = tGl - 0.1, tPanE = tZu + 0.22;
    cam.to(tl, tPan, CAM1, tPanE - tPan, "sine.inOut");

    // Mücken: Anlauf … und PATSCH ans Gewebe (links neben Anna)
    const tEnd = stops[3][0] + stops[3][2];
    const tR = Math.max(tEnd + 0.1, tMue - 0.25);
    anna.pose(tl, tR, { armR: [-60, 113], armL: [60, -113], head: -4 }, 0.35, "power2.inOut");
    tl.to(anna.root, { x: door.gripWorld(1).x - off + 30, duration: 0.4, ease: "power2.inOut" }, tR + 0.05);
    ANIM.walk(tl, anna, tR + 0.05, 0.36, { step: 0.18, swing: 10 });
    tl.to(anna.head, Object.assign({ rotation: 8, duration: 0.3, ease: "power2.out" }, O0), tMue + 0.05);
    anna.look(tl, tR + 0.2, -6, -1).mouth(tl, tR + 0.25, "smirk").brows(tl, tR + 0.25, "sly");
    const tCh = tMue - 0.45; // Anlauf der Mücke
    cam.to(tl, Math.max(tCh, tPanE + 0.02), CAM2, tMue + 0.12 - Math.max(tCh, tPanE + 0.02), "power2.inOut");
    cam.to(tl, tMue + 0.2, { x: CAM2.x - 6, y: CAM2.y + 2, z: CAM2.z + 0.03 }, t1 - tMue - 0.2, "sine.inOut");

    const hit = { x: 1130, y: 540 };
    const m0 = R.mOut[0];
    tl.to(m0.root, { motionPath: { path: [{ x: 1090, y: 716 }, { x: 1096, y: 622 }, hit], curviness: 1.2 }, scale: 1.05, duration: 0.55, ease: "power3.in" }, tCh);
    ANIM.sfx(tCh, "buzzShort", -6);
    const tHit = tMue + 0.1;
    tl.to(m0.bob, Object.assign({ scaleX: 0.55, scaleY: 1.3, duration: 0.06, ease: "power4.out" }, { transformOrigin: "50% 50%" }), tHit);
    m0.expr(tl, tHit, "grimace", "surprised");
    ANIM.sfx(tHit, "bonk", -2);
    ANIM.sfx(tHit + 0.02, "boing", -6);
    cam.shake(tl, tHit, 10, 0.25);
    // Aufprall-Strahlen vor dem Gewebe (im Hochformat deutlicher lesbar)
    ANIM.burst(tl, lr.fgLayer, hit.x + 6, hit.y, tHit, { n: 8, color: C.yellow, len: 30, r0: 60, w: 5, seed: 12 });
    // Abdruck im Gewebe (kleine Delle)
    const dent = S("ellipse", { cx: hit.x + 8, cy: hit.y, rx: 34, ry: 46, fill: "none", stroke: "#2f353a", "stroke-width": 2, opacity: 0 }, lr.fgLayer);
    tl.to(dent, { opacity: 0.35, duration: 0.05 }, tHit);
    tl.to(dent, { opacity: 0, duration: 0.6, ease: "sine.out" }, tHit + 0.15);
    // abrutschen, benommen
    tl.to(m0.root, { y: hit.y + 60, duration: 0.5, ease: "power2.in" }, tHit + 0.1);
    tl.to(m0.bob, Object.assign({ scaleX: 1, scaleY: 1, duration: 0.5, ease: "elastic.out(1,0.4)" }, { transformOrigin: "50% 50%" }), tHit + 0.12);
    const stars = G(lr.outLayer, {});
    tl.set(stars, { opacity: 0 }, 0.01);
    const starEls = [0, 1, 2].map(() => S("path", { d: "M0,-9 L3,-3 L9,0 L3,3 L0,9 L-3,3 L-9,0 L-3,-3 Z", fill: C.yellow }, stars));
    tl.set(stars, { x: hit.x, y: hit.y + 10, opacity: 1 }, tHit + 0.3);
    starEls.forEach((st, k) => {
      const a0 = (k / 3) * Math.PI * 2;
      const pts = [];
      for (let j = 0; j <= 8; j++) { const a = a0 + (j / 8) * Math.PI * 2; pts.push({ x: Math.cos(a) * 34, y: 10 + Math.sin(a) * 12 }); }
      tl.fromTo(st, { x: pts[0].x, y: pts[0].y }, { motionPath: { path: pts, curviness: 1.5 }, duration: 0.9, ease: "none" }, tHit + 0.3);
    });
    tl.to(stars, { y: hit.y + 60, duration: 0.5, ease: "power2.in" }, tHit + 0.1);
    tl.to(stars, { opacity: 0, duration: 0.25 }, tHit + 1.1);
    ANIM.sfx(tHit + 0.3, "stars", -10);

    // die anderen zwei kommen hinter Anna hervor, bremsen, starren — alle schmollen
    const stare = [null, { x: 1196, y: 742 }, { x: 1052, y: 806 }];
    [1, 2].forEach((i) => {
      const m = R.mOut[i];
      tl.to(m.root, { x: stare[i].x, y: stare[i].y, scale: 0.78, duration: 0.5, ease: "power2.out" }, tMue - 0.3);
      if (i === 2) m.face_(tl, tMue - 0.1, 1);
      m.expr(tl, tHit + 0.05, "O", "surprised");
      m.hover(tl, tMue + 0.25, tDra + 0.1, 80 + i, 5);
    });
    R.mOut.forEach((m, i) => m.expr(tl, tBle + 0.05 + i * 0.08, "frown", "sad"));
    anna.mouth(tl, tBle, "grin").brows(tl, tBle, "happy");
    // Anna winkt zum Abschied
    anna.pose(tl, tBle + 0.1, { armR: [-150, -30] }, 0.25, "back.out(1.8)");
    for (let k = 0; k < 4; k++) anna.pose(tl, tBle + 0.35 + k * 0.2, { armR: [-150, k % 2 ? -30 : 10] }, 0.18, "sine.inOut");
    ANIM.sfx(tBle + 0.1, "swish", -14);

    // „draußen“: beleidigter Abflug nach links hinten in den Garten
    const from = [{ x: hit.x - 20, y: hit.y + 30 }, { x: stare[1].x - 30, y: stare[1].y - 50 }, { x: stare[2].x - 30, y: stare[2].y - 40 }];
    const away = [{ x: 930, y: 560 }, { x: 1000, y: 700 }, { x: 880, y: 760 }];
    R.mOut.forEach((m, i) => {
      const ta = tDra - 0.05 + i * 0.12;
      m.face_(tl, ta, -1);
      tl.to(m.root, { motionPath: { path: [from[i], away[i]], curviness: 1.1 }, scale: 0.3, duration: t1 - ta + 0.4, ease: "power1.in" }, ta);
    });
    ANIM.sfx(tDra, "buzzShort", -12);
  },
};
