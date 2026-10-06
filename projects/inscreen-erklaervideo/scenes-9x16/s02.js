// s02 (9:16) — „Wären da nur nicht die ungebetenen Gäste.“
// Hochformat: aus der Tür-Totalen drückt die Kamera auf halbnah. Drei Mücken kommen klein aus dem Garten
// durch die Öffnung, kreisen um Annas Kopf und stellen sich schräg ÜBER ihr (oben rechts) auf —
// Anna unten links, Mücken oben rechts, nichts vor dem Gesicht. Annas Lächeln kippt.
(window.SCENES = window.SCENES || {}).s02 = {
  set: "lr",
  build(ctx, tl, R) {
    const lr = R.sets.lr, door = lr.door, anna = R.anna, cam = lr.cam;
    const O0 = CHAR.O0;
    const t0 = ctx.t0;
    const tNur = ctx.w("nur");
    const tUng = ctx.w("ungebetenen");
    const tGae = ctx.w("gäste");
    const AX = 906, FY = 952; // Annas Platz nach s01 (Füße)

    // Kamera: Start = Endkamera s01 (Tür-Totale), dann halbnah: Annas Kopf ≈ Bild (400, 900),
    // darüber (Bild y 300–750, rechts) ist Platz für die Mücken
    const CAM_START = { x: 985, y: 730, z: 1.12 };
    const CAM_H = { x: 982, y: 524, z: 1.85 };
    const CAM_H2 = { x: 988, y: 519, z: 1.9 };
    cam.to(tl, t0, CAM_START, 0);
    cam.to(tl, t0 + 0.1, CAM_H, tGae - 0.05 - (t0 + 0.1), "power2.inOut");
    cam.to(tl, tGae - 0.05, CAM_H2, ctx.t1 - (tGae - 0.05), "sine.out");

    // Startzustände (Anschluss an s01: Tür offen, Anna mit Armen oben, Augen zu)
    tl.set(anna.root, { x: AX, y: FY }, t0);
    anna.pose(tl, t0, { armL: [148, 22], armR: [-148, -22], head: -5 }, 0);
    tl.set(anna.lean, Object.assign({ scaleX: 0.99, scaleY: 1.035 }, O0), t0);
    anna.eyesClosed(tl, t0, true).mouth(tl, t0, "grin").brows(tl, t0, "happy", 0);
    tl.set(door.sash, { x: -door.sashTravel, y: 0 }, t0);
    door.screen(tl, t0, 0, 0);

    // Mücken: draußen klein im Garten -> durch die Öffnung -> innen um Annas Kopf -> schräg darüber
    const P = [
      // end = Bild (640,600) / (820,420) / (880,700) in der Endkamera: schräg über Annas Kopf, rechts
      { far: [{ x: 1330, y: 520 }, { x: 1290, y: 478 }, { x: 1250, y: 520 }], door: { x: 1170, y: 470 }, end: { x: 1036, y: 329 } },
      { far: [{ x: 1190, y: 650 }, { x: 1240, y: 606 }, { x: 1300, y: 624 }], door: { x: 1222, y: 580 }, end: { x: 1133, y: 232 } },
      { far: [{ x: 1400, y: 430 }, { x: 1350, y: 404 }, { x: 1330, y: 452 }], door: { x: 1284, y: 400 }, end: { x: 1166, y: 384 } },
    ];
    const head = { x: 912, y: 478 };
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
      // Kreis um den Kopf (rund statt flach: nutzt die Bildhöhe). Start und Ende rechts oben am Kopf,
      // im Uhrzeigersinn: rechts runter, unter dem Kinn durch, links hoch, über den Kopf — dann raus
      // nach oben rechts auf den Endplatz (der letzte Weg kreuzt nie das Gesicht).
      // Drei verschiedene Bahnen (Größe, Form, Drehsinn), damit die Mücken nicht zu einem Klumpen werden.
      const O = [{ rx: 150, ry: 132, a0: -0.5, dir: 1 }, { rx: 188, ry: 162, a0: -0.8, dir: -1 }, { rx: 132, ry: 182, a0: -0.25, dir: 1 }][i];
      const loop = [];
      for (let k = 0; k <= 7; k++) {
        const a = O.a0 + O.dir * (k / 7) * Math.PI * 2;
        loop.push({ x: head.x + Math.cos(a) * O.rx, y: head.y + Math.sin(a) * O.ry });
      }
      const tEnd = tGae - 0.1 + i * 0.09;
      tl.to(m.root, { motionPath: { path: [...loop, p.end], curviness: 1.2 }, scale: 0.86, duration: tEnd - tsw, ease: "sine.inOut" }, tsw);
      // Blickrichtung je nach Kreislauf: links hoch/über den Kopf nach rechts, am Ende schauen alle zu Anna
      // (beide Drehsinne: bis zur Bahnhälfte nach links, danach nach rechts; zum Schluss wieder zu Anna)
      m.face_(tl, tsw + (tEnd - tsw) * 0.53, 1);
      m.face_(tl, tsw + (tEnd - tsw) * 0.8, -1);
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
    // Pupillen folgen den Kreisen (Blick-Tweens nie überlappend)
    const tL1 = tNur + 0.45, tL2 = tL1 + 0.32, tL3 = Math.max(tUng + 0.2, tL2 + 0.24);
    anna.look(tl, tL1, -4, 4, 0.2).look(tl, tL2, 5, 3, 0.2).look(tl, tL3, 6, -5, 0.2);
    anna.mouth(tl, tUng, "flat").brows(tl, tUng, "annoyed", 0.22);
    tl.to(anna.head, Object.assign({ rotation: -6, duration: 0.3, ease: "power2.out" }, O0), tUng + 0.05);
    anna.mouth(tl, tGae, "grimace").brows(tl, tGae, "angry", 0.15);
    // „Gäste“: linke Hand in die Hüfte, rechte holt zum Wedeln aus — der Wisch geht in den Szenenwechsel über
    anna.pose(tl, tGae, { armL: [60, -113] }, 0.32, "back.out(1.7)");
    const tWind = Math.min(tGae - 0.08, ctx.t1 - 0.42);
    anna.pose(tl, tWind, { armR: [-128, -62] }, 0.2, "power3.out"); // Hand neben dem Kopf, nicht davor
    anna.pose(tl, Math.max(ctx.t1 - 0.22, tWind + 0.22), { armR: [-60, -20] }, 0.16, "power4.in");
    ANIM.sfx(ctx.t1 - 0.22, "swish", -6);
    anna.blinks(tl, tNur + 0.4, ctx.t1, 9);
  },
};
