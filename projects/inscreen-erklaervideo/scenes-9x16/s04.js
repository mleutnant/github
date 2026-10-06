// s04 (9:16) — „Hier kommt InScreen: der Insektenschutz, integriert in die QuinLine-Hebeschiebetür.“
// Hochformat: Iris öffnet auf Annas Gesicht (halbnah, Tür-Öffnung rechts, Mücken im Garten). Bei „kommt“
// zieht die Kamera auf und schiebt den Raum nach unten, die Titelkarte fällt oben ins Bild (y ≈ 236–700),
// darunter die ganze Tür mit Anna. Das Plissee gleitet zu, die Mücken bremsen draußen scharf ab.
(function () {
  // Kamera-Kadrierungen (Bild 1080×1920; Weltpunkt x/y liegt in der Bildmitte 540/960)
  const AX = 905, FY = 952;
  const CAM_S = { x: 1080, y: 600, z: 1.3 }; // halbnah: Anna Kopf ≈ (312, 820), Öffnung x 449–1003
  const CAM_L = { x: 1010, y: 469, z: 0.77 }; // Layout: Tür x 193–887 / y 730–1269, Füße ≈ 1332
  const CAM_L2 = { x: 1010, y: 470.3, z: 0.785 }; // minimaler Push-in um die Türmitte
  const headScr = (c) => ({ cx: Math.round(540 + (AX - c.x) * c.z), cy: Math.round(960 + (FY - 0.92 * 500 - c.y) * c.z) });
  const IRIS = headScr(CAM_S);

  (window.SCENES = window.SCENES || {}).s04 = {
    set: "lr",
    trans: { type: "iris", cx: IRIS.cx, cy: IRIS.cy },
    setup(R, ctx) {
      const h = R.huds[ctx.id];
      const card = ANIM.el("div", "s04-card", h);
      card.innerHTML = `
        <div class="s04-l s04-ly"></div><div class="s04-l s04-lr"></div>
        <div class="s04-eyebrow">Insektenschutz für die Hebeschiebetür</div>
        <div class="s04-title">InScreen</div>
        <div class="s04-sub"><span class="w">Direkt</span> <span class="w s04-hl">integriert</span> <span class="w">in</span> <span class="w">die</span></div>
        <div class="s04-row"><div class="s04-badge">QuinLine<sup>®</sup></div><div class="s04-hst">Hebeschiebetür</div></div>`;
      const css = document.createElement("style");
      // Karte: x 88–968 (+ L-Rahmen 62–998), y 236–664 (+ roter Winkel bis 692)
      css.textContent = `
        .s04-card { position:absolute; left:88px; top:236px; width:880px; background:#fff; padding:40px 52px 30px; box-shadow:0 24px 60px rgba(18,52,66,.22); }
        .s04-l { position:absolute; background:transparent; }
        .s04-ly { left:-26px; top:-26px; width:300px; height:240px; border-left:14px solid var(--sch-yellow); border-top:14px solid var(--sch-yellow); }
        .s04-lr { right:-30px; bottom:-28px; width:250px; height:200px; border-right:14px solid var(--sch-red); border-bottom:14px solid var(--sch-red); }
        .s04-eyebrow { font-weight:700; font-size:40px; line-height:1.1; white-space:nowrap; color:var(--sch-blue); letter-spacing:0; }
        .s04-title { font-weight:900; font-size:164px; line-height:.92; color:var(--sch-blue); margin-top:8px; letter-spacing:-.02em; }
        .s04-sub { font-weight:700; font-size:58px; line-height:1.1; color:var(--sch-blue); margin-top:12px; }
        .s04-hl { position:relative; }
        .s04-hl::after { content:""; position:absolute; left:-4px; right:-4px; bottom:4px; height:18px; background:var(--sch-yellow); opacity:.55; z-index:-1; transform-origin:left center; transform:scaleX(var(--hl,0)); }
        .s04-row { display:flex; align-items:center; gap:18px; margin-top:10px; }
        .s04-badge { background:var(--sch-red); color:#fff; font-weight:800; font-size:52px; line-height:1.1; padding:4px 18px 8px; }
        .s04-hst { font-weight:700; font-size:52px; line-height:1.1; color:var(--sch-blue); }
        .s04-badge sup { font-size:26px; }
      `;
      document.head.appendChild(css);
      R._s04 = { card };
    },
    build(ctx, tl, R) {
      const { S, C } = SVGK;
      const lr = R.sets.lr, door = lr.door, anna = R.anna, cam = lr.cam;
      const O0 = CHAR.O0;
      const t0 = ctx.t0, tPre = t0 - 0.32;
      const tHier = ctx.w("hier");
      const tKommt = ctx.w("kommt");
      const tIn = ctx.w("inscreen");
      const tIns = ctx.w("insektenschutz");
      const tInt = ctx.w("integriert");
      const tQL = ctx.w("quinline");
      const card = R._s04.card;
      const q = (sel) => card.querySelector(sel);

      // Neu aufstellen (vor der Iris): Kamera halbnah, Tür offen, Plissee offen
      cam.to(tl, tPre, CAM_S, 0);
      tl.set(door.sash, { x: -door.sashTravel, y: 0 }, tPre);
      tl.set(door.lever, Object.assign({ rotation: 0 }, O0), tPre);
      door.screen(tl, tPre, 0, 0);
      tl.set(anna.root, { x: AX, y: FY }, tPre);
      anna.pose(tl, tPre, { armL: [10, -6], armR: [-10, 6], legL: [0, 0], legR: [0, 0], head: 0, lean: 0 }, 0);
      tl.set(anna.lean, Object.assign({ scaleX: 1, scaleY: 1, y: 0 }, O0), tPre);
      anna.eyesClosed(tl, tPre, false);
      anna.expr(tl, tPre, "smile", "neutral", [5, 0]);
      R.mIn.forEach((m) => tl.set(m.root, { opacity: 0 }, tPre));

      // Kamera: bei „kommt“ aufziehen — der Raum rutscht nach unten, oben entsteht Platz für die Titelkarte
      const tMove = tKommt + 0.05;
      const dMove = Math.max(0.6, tIn + 0.22 - tMove);
      cam.to(tl, tMove, CAM_L, dMove, "power3.inOut");
      cam.to(tl, tMove + dMove, CAM_L2, ctx.t1 - (tMove + dMove), "sine.inOut");

      // Mücken draußen nähern sich im Garten und bremsen vor dem Plissee — über die Öffnungshöhe verteilt
      const far = [{ x: 1350, y: 380 }, { x: 1250, y: 560 }, { x: 1400, y: 680 }];
      const stop = [{ x: 1300, y: 300 }, { x: 1222, y: 452 }, { x: 1352, y: 602 }];
      R.mOut.forEach((m, i) => {
        tl.set(m.root, { x: far[i].x + 60, y: far[i].y - 30, scale: 0.3, opacity: 1 }, tPre);
        m.face_(tl, tPre, -1);
        m.expr(tl, tPre, "smirk", "sly");
        m.buzz(tl, tPre, ctx.t1 + 0.7);
        tl.to(m.root, { motionPath: { path: [far[i], { x: (far[i].x + stop[i].x) / 2 + 40, y: (far[i].y + stop[i].y) / 2 - 30 }, stop[i]], curviness: 1.4 }, scale: 1.0, duration: tIns - tPre + 0.05 + i * 0.08, ease: "power2.in" }, tPre + 0.05);
      });

      // Anna: „Hier kommt …“ — Finger hoch, dann präsentiert sie die Tür
      anna.pose(tl, tHier - 0.1, { armR: [-150, -26], head: -4 }, 0.3, "back.out(1.8)");
      anna.brows(tl, tHier - 0.1, "surprised").mouth(tl, tHier - 0.05, "open");
      anna.look(tl, tHier, 4, -3, 0.18);
      anna.pose(tl, tIn - 0.12, { armR: [-112, 28], armL: [24, -20], head: 6 }, 0.32, "power3.out");
      anna.look(tl, tIn - 0.1, 6, 0).mouth(tl, tIn + 0.1, "grin").brows(tl, tIn, "happy");
      anna.blinks(tl, t0 + 0.2, ctx.t1, 13);

      // Das Plissee gleitet zu — mit Klick an der Zarge
      const glide = 0.95;
      door.screen(tl, tIn - 0.05, 1, glide, "power3.inOut");
      ANIM.sfx(tIn - 0.05, "zip", -3, { dur: glide });
      ANIM.sfx(tIn - 0.05 + glide, "magnet", -2);
      const gp = door.gripWorld(1);
      ANIM.burst(tl, lr.fgLayer, gp.x, gp.y - 40, tIn - 0.02 + glide, { n: 9, len: 50, w: 8, r0: 24, color: C.yellow, seed: 4 });
      ANIM.sfx(tIn + glide, "sparkle", -6);

      // Mücken bremsen scharf ab: große Augen, Rückstoß
      R.mOut.forEach((m, i) => {
        const ts = tIns + 0.05 + i * 0.08;
        tl.to(m.bob, Object.assign({ rotation: -18, x: 10, duration: 0.12, ease: "power2.out" }, { transformOrigin: "50% 50%" }), ts);
        tl.to(m.bob, Object.assign({ rotation: 4, x: 0, duration: 0.5, ease: "elastic.out(1,0.45)" }, { transformOrigin: "50% 50%" }), ts + 0.12);
        m.expr(tl, ts, "O", "surprised");
        m.hover(tl, ts + 0.65, ctx.t1 + 0.6, 50 + i, 6);
        m.expr(tl, ts + 0.9 + i * 0.1, i === 1 ? "frown" : "wavy", "annoyed");
      });
      ANIM.sfx(tIns + 0.05, "buzzShort", -8);
      ANIM.sfx(tIns + 0.1, "boing", -10);

      // Titelkarte: fällt von oben in den frei gewordenen Platz und wächst Zeile für Zeile mit dem Text
      // (Höhen aus den festen Zeilenhöhen: Titel 273 px, + Unterzeile 349 px, + QuinLine-Zeile 428 px)
      const CH = { title: 273, sub: 349, full: 428 };
      gsap.set(card, { height: CH.title });
      tl.to(card, { height: CH.sub, duration: 0.34, ease: "power3.out" }, tInt - 0.46);
      tl.to(card, { height: CH.full, duration: 0.34, ease: "power3.out" }, tQL - 0.3);
      tl.fromTo(card, { opacity: 0, y: -90, rotation: -1.5 }, { opacity: 1, y: 0, rotation: 0, duration: 0.55, ease: "back.out(1.5)" }, tIn - 0.05);
      tl.fromTo(q(".s04-ly"), { clipPath: "inset(0 100% 100% 0)" }, { clipPath: "inset(0 0% 0% 0)", duration: 0.5, ease: "power3.out" }, tIn + 0.12);
      tl.fromTo(q(".s04-lr"), { clipPath: "inset(100% 0 0 100%)" }, { clipPath: "inset(0% 0 0 0%)", duration: 0.5, ease: "power3.out" }, tIn + 0.24);
      tl.fromTo(q(".s04-eyebrow"), { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: 0.4, ease: "power2.out" }, tIn + 0.05);
      tl.fromTo(q(".s04-title"), { opacity: 0, scale: 0.7, transformOrigin: "0% 80%" }, { opacity: 1, scale: 1, duration: 0.5, ease: "back.out(2.2)" }, tIn);
      ANIM.sfx(tIn, "pop", -4);
      const ws = card.querySelectorAll(".s04-sub .w");
      tl.fromTo(ws, { opacity: 0, y: 18 }, { opacity: 1, y: 0, duration: 0.32, ease: "power3.out", stagger: 0.08 }, tInt - 0.22);
      tl.fromTo(q(".s04-hl"), { "--hl": 0 }, { "--hl": 1, duration: 0.4, ease: "power2.inOut" }, tInt + 0.1);
      tl.fromTo(q(".s04-badge"), { opacity: 0, scale: 0.4, transformOrigin: "0% 50%" }, { opacity: 1, scale: 1, duration: 0.42, ease: "back.out(2.4)" }, tQL - 0.05);
      tl.fromTo(q(".s04-hst"), { opacity: 0, x: -16 }, { opacity: 1, x: 0, duration: 0.4, ease: "power2.out" }, tQL + 0.25);
      ANIM.sfx(tQL - 0.05, "pop", -6);

      // „integriert“: InScreen-Bauteile leuchten kurz gelb auf (Vorgriff auf den Röntgenblick)
      const g = door.geo;
      const hl = S("g", { opacity: 0 }, lr.fgLayer);
      const ox = lr.doorBox.x, oy = lr.doorBox.y;
      S("rect", { x: ox + g.sx0, y: oy + g.ft + 8, width: 16, height: lr.doorBox.h - g.th - g.ft - 10, fill: "none", stroke: C.yellow, "stroke-width": 9 }, hl);
      S("line", { x1: ox + g.sx0, y1: oy + g.ft + 6, x2: ox + g.sx1, y2: oy + g.ft + 6, stroke: C.yellow, "stroke-width": 9 }, hl);
      S("line", { x1: ox + g.sx0, y1: oy + lr.doorBox.h - g.th, x2: ox + g.sx1, y2: oy + lr.doorBox.h - g.th, stroke: C.yellow, "stroke-width": 9 }, hl);
      tl.to(hl, { opacity: 1, duration: 0.2, ease: "power1.out" }, tInt);
      tl.to(hl, { opacity: 0.0, duration: 0.5, ease: "sine.inOut" }, tInt + 0.9);
      ANIM.sfx(tInt, "ding", -10);
      // Anna zufrieden: Hände in die Hüften
      anna.pose(tl, tInt + 0.3, { armL: [60, -113], armR: [-60, 113], head: -3 }, 0.4, "power2.inOut");
      anna.mouth(tl, tQL, "smile").look(tl, tQL, -3, 0);
    },
  };
})();
