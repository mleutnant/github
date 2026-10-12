// s02 — „Wären da nur nicht die ungebetenen Gäste.“
// Drei Mücken schwirren durch die offene Tür, umkreisen Anna — ihr Lächeln kippt.
(window.SCENES = window.SCENES || {}).s02 = {
  set: "lr",
  build(ctx, tl, R) {
    const lr = R.sets.lr, anna = R.anna, cam = lr.cam;
    const O0 = CHAR.O0;
    const t0 = ctx.t0;
    const tNur = ctx.w("nur");
    const tUng = ctx.w("ungebetenen");
    const tGae = ctx.w("gäste");
    const ax = R._annaX = R._annaX || 0;

    // Kamera rückt an Anna + Gäste heran
    cam.to(tl, t0 + 0.05, { x: 1120, y: 480, z: 1.36 }, ctx.t1 - t0 - 0.1, "power2.inOut");

    // Mücken: draußen klein im Garten -> durch die Öffnung -> innen um Annas Kopf
    const P = [
      { far: [{ x: 1330, y: 560 }, { x: 1290, y: 520 }, { x: 1250, y: 560 }], door: { x: 1230, y: 520 }, end: { x: 1270, y: 400 } },
      { far: [{ x: 1180, y: 640 }, { x: 1230, y: 600 }, { x: 1290, y: 620 }], door: { x: 1300, y: 600 }, end: { x: 1350, y: 478 } },
      { far: [{ x: 1400, y: 470 }, { x: 1350, y: 450 }, { x: 1330, y: 500 }], door: { x: 1340, y: 470 }, end: { x: 1250, y: 560 } },
    ];
    const head = { x: 1000, y: 470 };
    R.mOut.forEach((m, i) => {
      const p = P[i];
      const tin = t0 - 0.2 + i * 0.18;
      tl.set(m.root, { x: p.far[0].x, y: p.far[0].y, scale: 0.28, opacity: 1 }, t0 - 0.25);
      m.face_(tl, t0 - 0.24, -1);
      m.buzz(tl, t0 - 0.25, tNur + 0.6);
      tl.to(m.root, { motionPath: { path: [...p.far.slice(1), p.door], curviness: 1.3 }, scale: 0.8, duration: tNur - tin + 0.15, ease: "sine.in" }, tin);
      tl.set(m.root, { opacity: 0 }, tNur + 0.15 + i * 0.05);
    });
    R.mIn.forEach((m, i) => {
      const p = P[i];
      const tsw = tNur + 0.15 + i * 0.05;
      tl.set(m.root, { x: p.door.x, y: p.door.y, scale: 0.8, opacity: 1 }, tsw);
      m.face_(tl, tsw, -1);
      m.buzz(tl, tsw, ctx.t1 + 0.8);
      // Kreis um den Kopf, dann Aufstellung vor dem Gesicht
      const r = 150 + i * 28;
      const loop = [];
      for (let k = 0; k <= 6; k++) {
        const a = -0.4 + (k / 6) * Math.PI * 2 + i * 1.3;
        loop.push({ x: head.x + Math.cos(a) * r, y: head.y + Math.sin(a) * r * 0.55 });
      }
      const tEnd = tGae - 0.05 + i * 0.07;
      tl.to(m.root, { motionPath: { path: [...loop, p.end], curviness: 1.2 }, scale: 1.05, duration: tEnd - tsw, ease: "sine.inOut" }, tsw);
      // Blickrichtung je nach Kreislauf: kurze Wechsel
      m.face_(tl, tsw + (tEnd - tsw) * 0.35, 1);
      m.face_(tl, tsw + (tEnd - tsw) * 0.72, -1);
      m.hover(tl, tEnd, ctx.t1 + 0.6, 30 + i, 9);
      m.expr(tl, tEnd, i === 1 ? "grin" : "smirk", "sly");
    });
    ANIM.sfx(t0 - 0.2, "buzzIn", -6, { dur: ctx.t1 - t0 + 0.4 });

    // Anna: Augen auf … Moment mal … Grimasse
    anna.eyesClosed(tl, tNur - 0.05, false);
    anna.look(tl, tNur - 0.05, 5, -2, 0.12).brows(tl, tNur - 0.05, "surprised").mouth(tl, tNur - 0.05, "O");
    tl.to(anna.lean, Object.assign({ scaleY: 1, scaleX: 1, duration: 0.3, ease: "power2.out" }, O0), tNur);
    anna.pose(tl, tNur + 0.05, { armL: [40, -40], armR: [-40, 40], head: 6 }, 0.5, "power2.inOut");
    anna.blink(tl, tNur + 0.35);
    // Pupillen folgen den Kreisen
    anna.look(tl, tNur + 0.5, -4, 3, 0.25).look(tl, tNur + 0.85, 5, 2, 0.25).look(tl, tUng + 0.2, 6, -1, 0.2);
    anna.mouth(tl, tUng, "flat").brows(tl, tUng, "annoyed", 0.22);
    tl.to(anna.head, Object.assign({ rotation: -6, duration: 0.3, ease: "power2.out" }, O0), tUng + 0.05);
    anna.mouth(tl, tGae, "grimace").brows(tl, tGae, "angry", 0.15);
    anna.pose(tl, tGae, { armL: [60, -113], armR: [-60, 113] }, 0.32, "back.out(1.7)"); // Hände in die Hüften
    anna.blinks(tl, tNur + 0.4, ctx.t1, 9);
    // Ausholen zum Wedeln — der Wisch geht in den Szenenwechsel über
    anna.pose(tl, ctx.t1 - 0.42, { armR: [-160, -30] }, 0.18, "power3.out");
    anna.pose(tl, ctx.t1 - 0.22, { armR: [-60, -20] }, 0.16, "power4.in");
    ANIM.sfx(ctx.t1 - 0.22, "swish", -6);
  },
};
