// s01 (9:16) — „Sommerabend. Die Hebeschiebetür steht weit offen – herrlich.“
// Hochformat: Start nah auf Anna und den HST-Griff (Abendlicht, Vögel hinter dem Glas), nach dem Hebel
// zieht die Kamera mit dem Flügel nach links auf die ganze Tür auf. „herrlich“: Arme hoch, Brise und
// ein Blatt wehen in hohen Bögen durch die Öffnung um Anna herum.
(window.SCENES = window.SCENES || {}).s01 = {
  set: "lr",
  build(ctx, tl, R) {
    const { S, C } = SVGK;
    const lr = R.sets.lr, door = lr.door, anna = R.anna, cam = lr.cam;
    const O0 = CHAR.O0;
    const s = 0.92, FY = 952;
    const X0 = 1262;
    const tSom = ctx.w("sommerabend");
    const tHeb = ctx.w("hebeschiebetür") - 0.05;
    const tOpen = ctx.w("steht") + 0.05;
    const slideDur = 1.25;
    const tHer = ctx.w("herrlich");

    // Kamera (Bild 1080×1920, Weltpunkt x/y liegt in der Bildmitte 540/960)
    const CAM_NAH = { x: 1318, y: 656, z: 1.95 }; // nah: Annas Kopf oben, Griff rechts, Garten hinter dem Glas
    const CAM_NAH2 = { x: 1326, y: 650, z: 2.04 }; // langsamer Push-in zum Griff
    const CAM_TOT = { x: 1010, y: 745, z: 1.02 }; // ganze Tür: x 81–999, y 373–1087, Füße ≈ 1171
    const CAM_END = { x: 985, y: 730, z: 1.12 }; // nach dem Öffnen sanft auf Anna nachdrücken (= Startkamera s02)

    // Startzustände
    gsap.set(anna.root, { x: X0, y: FY });
    door.setColorNow("anthrazit");
    door.setScreenNow(0);
    gsap.set(door.sash, { x: 0, y: 0 });
    cam.to(tl, 0, CAM_NAH, 0);
    gsap.set(lr.beam, { opacity: 0.12 });

    // Kamera: Push-in nah -> nach dem Hebel Aufzug auf die ganze Tür -> sanft nachdrücken
    cam.to(tl, 0.05, CAM_NAH2, tHeb - 0.3, "sine.inOut");
    const tPull = tHeb + 0.42;
    const tTot = tOpen + 0.95; // Tür steht ganz im Bild, bevor der Flügel ankommt
    cam.to(tl, tPull, CAM_TOT, tTot - tPull, "power2.inOut");
    cam.to(tl, tTot + 0.25, CAM_END, ctx.t1 - (tTot + 0.25), "sine.inOut");

    // Ambient: Wolken ziehen, Sonne glüht, Vögel kreuzen das Glas im Nah-Bild
    lr.clouds.forEach((c, i) => tl.fromTo(c, { x: 0 }, { x: 60 + i * 25, duration: ctx.t1 + 4, ease: "sine.inOut" }, 0));
    tl.fromTo(lr.sun, { scale: 0.96 }, Object.assign({ scale: 1.04, duration: 2.2, ease: "sine.inOut", yoyo: true, repeat: 3 }, O0), 0);
    tl.to(lr.beam, { opacity: 0.42, duration: 1.6, ease: "sine.inOut" }, tSom - 0.2);
    const birds = S("g", null, lr.outside);
    const birdDur = 4.4;
    [[0, 0], [52, 22]].forEach(([dx, dy], i) => {
      const b = SVGK.G(birds, {});
      const wing = S("path", { d: "M-14,0 Q-7,-8 0,0 Q7,-8 14,0", stroke: C.b1, "stroke-width": 3.4, fill: "none", "stroke-linecap": "round" }, b);
      const p0 = { x: 1430 + dx, y: 330 + dy };
      tl.fromTo(b, { x: p0.x, y: p0.y }, { motionPath: { path: [p0, { x: 1210 + dx, y: 286 + dy }, { x: 900 + dx, y: 240 + dy }, { x: 520 + dx, y: 190 + dy }], curviness: 1.1 }, duration: birdDur, ease: "sine.inOut" }, 0.1 + i * 0.18);
      const nFlap = Math.max(1, Math.round((birdDur + 0.4) / 0.44));
      tl.fromTo(wing, Object.assign({ scaleY: 1 }, O0), Object.assign({ scaleY: -0.6, duration: 0.22, ease: "sine.inOut", yoyo: true, repeat: nFlap * 2 - 1 }, O0), 0.1 + i * 0.12);
    });

    // Anna: greift den Griff
    const grab = (tt, rootX, dur) => ANIM.reach(tl, tt, anna, "armR", door.handleWorld(0), { x: rootX, y: FY }, s, -1, dur);
    grab(0, X0, 0);
    anna.pose(tl, 0, { armL: [10, -6], head: 4 }, 0).look(tl, 0, 4, -2, 0).mouth(tl, 0, "smallSmile").brows(tl, 0, "neutral", 0);
    anna.breathe(tl, 0, R.T.total, 0.012, 1.8);
    anna.blinks(tl, 0.3, tHer - 0.2, 5);
    // „Sommerabend“: kurzer Blick nach draußen, dann zurück zum Griff
    anna.look(tl, tSom + 0.1, 6, -3, 0.22).mouth(tl, tSom + 0.15, "smile");
    anna.look(tl, tHeb - 0.45, 4, 1, 0.2);

    // Hebel umlegen (Heben)
    tl.to(anna.head, Object.assign({ rotation: 8, duration: 0.3, ease: "power2.out" }, O0), tHeb - 0.25);
    door.lift(tl, tHeb, true);
    tl.to(anna.lean, Object.assign({ y: 5, duration: 0.18, ease: "power2.in", yoyo: true, repeat: 1 }, O0), tHeb);
    ANIM.sfx(tHeb + 0.12, "clunk", -4);

    // Schieben: Flügel + Anna gehen gemeinsam nach links
    const X1 = X0 - door.sashTravel;
    door.slide(tl, tOpen, 1, slideDur, "power2.inOut");
    tl.to(anna.root, { x: X1, duration: slideDur, ease: "power2.inOut" }, tOpen);
    anna.pose(tl, tOpen - 0.15, { lean: -5 }, 0.25);
    ANIM.walk(tl, anna, tOpen + 0.05, slideDur - 0.1, { step: 0.29, swing: 15 });
    ANIM.sfx(tOpen, "slide", -6, { dur: slideDur });
    anna.mouth(tl, tOpen + 0.2, "smile").look(tl, tOpen + 0.1, -3, 0);
    // Flügel abgesetzt
    door.lift(tl, tOpen + slideDur + 0.02, false);
    ANIM.sfx(tOpen + slideDur + 0.02, "thud", -10);

    // loslassen, umdrehen, durchatmen — „herrlich“
    // (echte Stimme: „herrlich“ folgt direkt auf das Absetzen → Loslass-Pose nur, wenn Zeit bleibt,
    //  sonst gehen die Arme direkt hoch; nie zwei Arm-Tweens gleichzeitig)
    const tRel = tOpen + slideDur + 0.08;
    const tUp = Math.max(tHer - 0.08, tRel);
    if (tUp - tRel > 0.4) anna.pose(tl, tRel, { armR: [-8, 6], armL: [10, -6], lean: 0, head: 0 }, 0.3, "power2.out");
    else anna.pose(tl, tRel, { lean: 0 }, 0.3, "power2.out");
    tl.to(anna.root, { x: X1 + 70, duration: 0.55, ease: "power2.inOut" }, tRel + 0.1);
    ANIM.walk(tl, anna, tRel + 0.1, 0.5, { step: 0.25, swing: 12 });
    anna.look(tl, tRel + 0.2, 0, 0);
    // Antizipation: kurz in die Knie, dann Arme hoch
    tl.to(anna.lean, Object.assign({ scaleY: 0.97, duration: 0.16, ease: "power2.in" }, O0), tUp - 0.14);
    tl.to(anna.lean, Object.assign({ scaleY: 1.035, scaleX: 0.99, duration: 0.42, ease: "back.out(2)" }, O0), tUp + 0.02);
    anna.pose(tl, tUp, { armL: [148, 22], armR: [-148, -22], head: -5 }, 0.45, "back.out(1.6)");
    anna.eyesClosed(tl, tHer, true).mouth(tl, tHer, "grin").brows(tl, tHer, "happy", 0.2);
    ANIM.sfx(tHer - 0.05, "breathIn", -12);

    // Brise fürs Hochformat: gestaffelte Bögen aus der Öffnung über die ganze Bildhöhe. Die tiefen Linien
    // laufen HINTER Anna durch (sichtbar links und rechts von ihr), die oberste rollt sich über ihrem Kopf ein.
    const windBack = S("g", null);
    lr.charLayer.insertBefore(windBack, lr.charLayer.firstChild);
    const windFront = S("g", null, lr.fgLayer);
    ANIM.swoosh(tl, windFront, "M1410,286 C1310,240 1214,322 1100,290 S960,236 900,262 C852,284 850,332 890,338 C922,343 934,312 914,298", tHer - 0.12, { w: 7, dur: 0.62, hold: 0.6 });
    ANIM.swoosh(tl, windBack, "M1424,470 C1316,426 1236,516 1116,478 S944,414 840,468 S700,540 610,496", tHer + 0.0, { w: 7, dur: 0.6, hold: 0.55, opacity: 0.8 });
    ANIM.swoosh(tl, windBack, "M1420,640 C1320,600 1240,682 1124,644 S964,590 860,640 S736,700 650,672", tHer + 0.12, { w: 6, dur: 0.56, hold: 0.5, opacity: 0.7 });
    ANIM.swoosh(tl, windBack, "M1404,812 C1324,784 1254,834 1154,810 S1004,784 930,806", tHer + 0.22, { w: 5, dur: 0.46, hold: 0.42, opacity: 0.6 });
    // Blatt: weht hoch aus dem Garten herein, kreist über Annas Kopf und pendelt links neben ihr zu Boden
    const leafG = SVGK.G(lr.fgLayer, {});
    const leaf = SVGK.G(leafG, { s: 2.3 });
    S("path", { d: "M-13,0 C-3,-7 7,-5 13,4 C3,9 -5,8 -13,0 Z", fill: C.g2 }, leaf);
    S("path", { d: "M-11,0 C-2,1 6,2 12,4", stroke: C.g1, "stroke-width": 1.4, fill: "none", opacity: 0.7 }, leaf);
    const lp = [{ x: 1410, y: 236 }, { x: 1250, y: 300 }, { x: 1070, y: 244 }, { x: 930, y: 284 }, { x: 830, y: 262 }, { x: 750, y: 340 },
      { x: 700, y: 440 }, { x: 772, y: 540 }, { x: 690, y: 640 }, { x: 760, y: 750 }, { x: 700, y: 870 }];
    const leafDur = 2.7;
    tl.fromTo(leafG, { x: lp[0].x, y: lp[0].y, opacity: 0 }, { motionPath: { path: lp.slice(1), curviness: 1.25 }, opacity: 1, duration: leafDur, ease: "sine.inOut" }, tHer - 0.1);
    // Drehen beim Hereinwehen, danach Pendeln wie ein fallendes Blatt
    tl.fromTo(leaf, Object.assign({ rotation: 0 }, O0), Object.assign({ rotation: 400, duration: 1.0, ease: "power2.out" }, O0), tHer - 0.1);
    [-38, 34, -30, 26].forEach((r, k) => tl.to(leaf, Object.assign({ rotation: 400 + r, duration: 0.42, ease: "sine.inOut" }, O0), tHer + 0.9 + k * 0.42));
    tl.to(leafG, { opacity: 0, duration: 0.3, ease: "power1.in" }, tHer - 0.1 + leafDur - 0.3);
    ANIM.sfx(tHer, "breeze", -8);
  },
};
