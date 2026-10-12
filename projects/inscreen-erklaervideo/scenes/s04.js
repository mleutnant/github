// s04 — „Hier kommt InScreen: der Insektenschutz, integriert in die QuinLine-Hebeschiebetür.“
// Produkt-Auftritt: Das Plissee gleitet aus dem Festflügel, die Mücken bremsen draußen scharf ab.
(window.SCENES = window.SCENES || {}).s04 = {
  set: "lr",
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
    css.textContent = `
      .s04-card { position:absolute; left:70px; top:118px; width:730px; height:500px; background:#fff; padding:58px 56px 0 64px; box-shadow:0 24px 60px rgba(18,52,66,.22); }
      .s04-l { position:absolute; background:transparent; }
      .s04-ly { left:-26px; top:-26px; width:300px; height:250px; border-left:14px solid var(--sch-yellow); border-top:14px solid var(--sch-yellow); }
      .s04-lr { right:-30px; bottom:-30px; width:250px; height:210px; border-right:14px solid var(--sch-red); border-bottom:14px solid var(--sch-red); }
      .s04-eyebrow { font-weight:700; font-size:30px; white-space:nowrap; color:var(--sch-blue); letter-spacing:.01em; }
      .s04-title { font-weight:900; font-size:128px; line-height:1; color:var(--sch-blue); margin-top:14px; letter-spacing:-.02em; }
      .s04-sub { font-weight:700; font-size:40px; color:var(--sch-blue); margin-top:26px; }
      .s04-hl { position:relative; }
      .s04-hl::after { content:""; position:absolute; left:-4px; right:-4px; bottom:2px; height:14px; background:var(--sch-yellow); opacity:.55; z-index:-1; transform-origin:left center; transform:scaleX(var(--hl,0)); }
      .s04-row { display:flex; align-items:center; gap:18px; margin-top:16px; }
      .s04-badge { background:var(--sch-red); color:#fff; font-weight:800; font-size:40px; padding:6px 18px 8px; }
      .s04-hst { font-weight:700; font-size:40px; color:var(--sch-blue); }
      .s04-badge sup { font-size:20px; }
    `;
    document.head.appendChild(css);
    R._s04 = { card };
  },
  build(ctx, tl, R) {
    const { S, C, G } = SVGK;
    const lr = R.sets.lr, door = lr.door, anna = R.anna, cam = lr.cam;
    const O0 = CHAR.O0;
    const t0 = ctx.t0, tPre = t0 - 0.32;
    const tHier = ctx.w("hier");
    const tIn = ctx.w("inscreen");
    const tIns = ctx.w("insektenschutz");
    const tInt = ctx.w("integriert");
    const tQL = ctx.w("quinline");
    const card = R._s04.card;
    const q = (sel) => card.querySelector(sel);

    // Neu aufstellen (vor der Iris)
    const AX = 905, FY = 952;
    cam.to(tl, tPre, { x: 930, y: 548, z: 1.0 }, 0);
    tl.set(anna.root, { x: AX, y: FY }, tPre);
    anna.pose(tl, tPre, { armL: [10, -6], armR: [-10, 6], legL: [0, 0], legR: [0, 0], head: 0, lean: 0 }, 0);
    tl.set(anna.lean, Object.assign({ scaleX: 1, scaleY: 1, y: 0 }, O0), tPre);
    anna.expr(tl, tPre, "smile", "neutral", [5, 0]);
    R.mIn.forEach((m) => tl.set(m.root, { opacity: 0 }, tPre));
    door.screen(tl, tPre, 0, 0);
    // Mücken draußen nähern sich im Garten
    const far = [{ x: 1330, y: 470 }, { x: 1250, y: 600 }, { x: 1390, y: 640 }];
    const stop = [{ x: 1250, y: 420 }, { x: 1170, y: 560 }, { x: 1340, y: 610 }];
    R.mOut.forEach((m, i) => {
      tl.set(m.root, { x: far[i].x + 60, y: far[i].y - 30, scale: 0.3, opacity: 1 }, tPre);
      m.face_(tl, tPre, -1);
      m.expr(tl, tPre, "smirk", "sly");
      m.buzz(tl, tPre, ctx.t1 + 0.7);
      tl.to(m.root, { motionPath: { path: [far[i], { x: (far[i].x + stop[i].x) / 2 + 40, y: (far[i].y + stop[i].y) / 2 - 30 }, stop[i]], curviness: 1.4 }, scale: 0.86, duration: tIns - tPre + 0.05 + i * 0.08, ease: "power2.in" }, tPre + 0.05);
    });

    // Anna: „Hier kommt …“ — Finger hoch, dann präsentiert sie die Tür
    anna.pose(tl, tHier - 0.1, { armR: [-150, -26], head: -4 }, 0.3, "back.out(1.8)");
    anna.brows(tl, tHier - 0.1, "surprised").mouth(tl, tHier - 0.05, "open");
    anna.pose(tl, tIn - 0.12, { armR: [-112, 28], armL: [24, -20], head: 6 }, 0.32, "power3.out");
    anna.look(tl, tIn - 0.1, 6, 0).mouth(tl, tIn + 0.1, "grin").brows(tl, tIn, "happy");
    anna.blinks(tl, t0 + 0.2, ctx.t1, 13);

    // Das Plissee gleitet zu — mit Klick an der Zarge
    const glide = 0.95;
    door.screen(tl, tIn - 0.05, 1, glide, "power3.inOut");
    ANIM.sfx(tIn - 0.05, "zip", -3, { dur: glide });
    ANIM.sfx(tIn - 0.05 + glide, "magnet", -2);
    const gp = door.gripWorld(1);
    ANIM.burst(tl, lr.fgLayer, gp.x, gp.y - 40, tIn - 0.02 + glide, { n: 9, len: 38, color: C.yellow, seed: 4 });
    ANIM.sfx(tIn + glide, "sparkle", -6);
    cam.to(tl, tIn + 0.2, { x: 960, y: 536, z: 1.06 }, ctx.t1 - tIn - 0.2, "sine.inOut");

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

    // Titelkarte
    tl.fromTo(card, { opacity: 0, x: -60, rotation: -2 }, { opacity: 1, x: 0, rotation: 0, duration: 0.55, ease: "back.out(1.5)" }, tIn - 0.05);
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
    S("rect", { x: ox + g.sx0, y: oy + g.ft + 8, width: 16, height: lr.doorBox.h - g.th - g.ft - 10, fill: "none", stroke: C.yellow, "stroke-width": 6 }, hl);
    S("line", { x1: ox + g.sx0, y1: oy + g.ft + 6, x2: ox + g.sx1, y2: oy + g.ft + 6, stroke: C.yellow, "stroke-width": 6 }, hl);
    S("line", { x1: ox + g.sx0, y1: oy + lr.doorBox.h - g.th, x2: ox + g.sx1, y2: oy + lr.doorBox.h - g.th, stroke: C.yellow, "stroke-width": 6 }, hl);
    tl.to(hl, { opacity: 1, duration: 0.2, ease: "power1.out" }, tInt);
    tl.to(hl, { opacity: 0.0, duration: 0.5, ease: "sine.inOut" }, tInt + 0.9);
    ANIM.sfx(tInt, "ding", -10);
    // Anna zufrieden: Hände in die Hüften
    anna.pose(tl, tInt + 0.3, { armL: [60, -113], armR: [-60, 113], head: -3 }, 0.4, "power2.inOut");
    anna.mouth(tl, tQL, "smile").look(tl, tQL, -3, 0);
  },
};
