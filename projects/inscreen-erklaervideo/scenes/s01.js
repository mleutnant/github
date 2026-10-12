// s01 — „Sommerabend. Die Hebeschiebetür steht weit offen – herrlich.“
// Anna hebt den Griff, schiebt den Flügel auf, genießt die Abendluft.
(window.SCENES = window.SCENES || {}).s01 = {
  set: "lr",
  build(ctx, tl, R) {
    const { S, C } = SVGK;
    const lr = R.sets.lr, door = lr.door, anna = R.anna, cam = lr.cam;
    const O0 = CHAR.O0;
    const s = 0.92, FY = 952;
    const X0 = 1262;
    const tHeb = ctx.w("hebeschiebetür") - 0.05;
    const tOpen = ctx.w("steht") + 0.05;
    const slideDur = 1.25;
    const tHer = ctx.w("herrlich");

    // Startzustände
    gsap.set(anna.root, { x: X0, y: FY });
    door.setColorNow("anthrazit");
    door.setScreenNow(0);
    gsap.set(door.sash, { x: 0, y: 0 });
    cam.to(tl, 0, { x: 1040, y: 560, z: 1.16 }, 0);
    gsap.set(lr.beam, { opacity: 0.12 });

    // Kamera zieht langsam auf
    cam.to(tl, 0.15, { x: 975, y: 548, z: 1.0 }, tHer + 0.8 - 0.15, "sine.inOut");

    // Ambient: Wolken ziehen, Sonne glüht, Vögel
    lr.clouds.forEach((c, i) => tl.fromTo(c, { x: 0 }, { x: 60 + i * 25, duration: ctx.t1 + 4, ease: "sine.inOut" }, 0));
    tl.fromTo(lr.sun, { scale: 0.96 }, Object.assign({ scale: 1.04, duration: 2.2, ease: "sine.inOut", yoyo: true, repeat: 3 }, O0), 0);
    tl.to(lr.beam, { opacity: 0.42, duration: 1.6, ease: "sine.inOut" }, ctx.w("sommerabend") - 0.2);
    const birds = S("g", null, lr.outside);
    [[0, 0], [46, 18]].forEach(([dx, dy], i) => {
      const b = SVGK.G(birds, {});
      const wing = S("path", { d: "M-14,0 Q-7,-8 0,0 Q7,-8 14,0", stroke: C.b1, "stroke-width": 3.4, fill: "none", "stroke-linecap": "round" }, b);
      tl.fromTo(b, { x: 620 + dx, y: 300 + dy }, { x: 1500 + dx, y: 250 + dy, duration: 5.2, ease: "none" }, 0.2 + i * 0.15);
      tl.fromTo(wing, Object.assign({ scaleY: 1 }, O0), Object.assign({ scaleY: -0.6, duration: 0.22, ease: "sine.inOut", yoyo: true, repeat: 23 }, O0), 0.2 + i * 0.1);
    });

    // Anna: greift den Griff
    const grab = (tt, rootX, dur) => ANIM.reach(tl, tt, anna, "armR", door.handleWorld(0), { x: rootX, y: FY }, s, -1, dur);
    grab(0, X0, 0);
    anna.pose(tl, 0, { armL: [10, -6], head: 4 }, 0).look(tl, 0, 4, -2, 0).mouth(tl, 0, "smallSmile").brows(tl, 0, "neutral", 0);
    anna.breathe(tl, 0, R.T.total, 0.012, 1.8);
    anna.blinks(tl, 0.3, tHer - 0.2, 5);

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
    const tRel = tOpen + slideDur + 0.08;
    anna.pose(tl, tRel, { armR: [-8, 6], armL: [10, -6], lean: 0, head: 0 }, 0.3, "power2.out");
    tl.to(anna.root, { x: X1 + 70, duration: 0.55, ease: "power2.inOut" }, tRel + 0.1);
    ANIM.walk(tl, anna, tRel + 0.1, 0.5, { step: 0.25, swing: 12 });
    anna.look(tl, tRel + 0.2, 0, 0);
    // Antizipation: kurz in die Knie, dann Arme hoch
    tl.to(anna.lean, Object.assign({ scaleY: 0.97, duration: 0.16, ease: "power2.in" }, O0), tHer - 0.22);
    tl.to(anna.lean, Object.assign({ scaleY: 1.035, scaleX: 0.99, duration: 0.42, ease: "back.out(2)" }, O0), tHer - 0.06);
    anna.pose(tl, tHer - 0.08, { armL: [148, 22], armR: [-148, -22], head: -5 }, 0.45, "back.out(1.6)");
    anna.eyesClosed(tl, tHer, true).mouth(tl, tHer, "grin").brows(tl, tHer, "happy", 0.2);
    ANIM.sfx(tHer - 0.05, "breathIn", -12);
    // Brise: Windlinien aus der Öffnung, ein Blatt weht herein
    const wind = S("g", null, lr.fgLayer);
    ANIM.swoosh(tl, wind, "M1300,420 C1180,380 1100,460 980,420 S800,360 720,420", tHer - 0.1, { w: 6, dur: 0.6, hold: 0.5 });
    ANIM.swoosh(tl, wind, "M1340,610 C1200,560 1130,650 1000,610 S820,560 760,620", tHer + 0.05, { w: 5, dur: 0.6, hold: 0.55, opacity: 0.7 });
    ANIM.swoosh(tl, wind, "M1320,760 C1210,730 1120,790 1010,760", tHer + 0.18, { w: 4, dur: 0.5, hold: 0.45, opacity: 0.6 });
    const leaf = SVGK.G(lr.fgLayer, {});
    S("path", { d: "M0,0 C10,-6 20,-4 26,4 C16,8 8,8 0,0 Z", fill: C.g3 }, leaf);
    tl.fromTo(leaf, { x: 1380, y: 380, rotation: 0, opacity: 0 }, { motionPath: { path: [{ x: 1380, y: 380 }, { x: 1180, y: 470 }, { x: 960, y: 400 }, { x: 760, y: 520 }, { x: 600, y: 760 }], curviness: 1.4 }, rotation: 540, opacity: 1, duration: 2.4, ease: "sine.inOut" }, tHer - 0.1);
    tl.to(leaf, { opacity: 0, duration: 0.3 }, tHer + 2.1);
    ANIM.sfx(tHer, "breeze", -8);
  },
};
