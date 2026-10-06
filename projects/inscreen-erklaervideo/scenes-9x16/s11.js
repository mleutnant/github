// s11 — „Integriert, barrierefrei, schnell montiert: Darum ist InScreen die beste Insektenschutzlösung für Hebeschiebetüren.“
// Abenddämmerung, Anna mit Limonade, Mücken schmollen draußen — Vorteils-Trio, dann Marken-Endkarte.
(window.SCENES = window.SCENES || {}).s11 = {
  set: "lr",
  setup(R, ctx) {
    const { S, G, C } = SVGK;
    const h = R.huds[ctx.id];
    const css = document.createElement("style");
    css.textContent = `
      .s11-panel { position:absolute; left:64px; top:190px; width:650px; padding:34px 40px 30px 40px; background:#fff; box-shadow:0 20px 56px rgba(18,52,66,.25); }
      .s11-row { display:flex; align-items:center; gap:22px; padding:16px 0; }
      .s11-row img { width:76px; height:76px; }
      .s11-row b { font-weight:900; font-size:52px; color:var(--sch-blue); white-space:nowrap; letter-spacing:-.01em; }
      .s11-mark { width:8px; height:62px; background:var(--sch-red); }
      .s11-end { position:absolute; inset:0; background:#fff; overflow:hidden; }
      .s11-ly { position:absolute; left:110px; top:96px; width:820px; height:560px; border-left:24px solid var(--sch-yellow); border-top:24px solid var(--sch-yellow); }
      .s11-lr { position:absolute; right:110px; bottom:96px; width:700px; height:440px; border-right:24px solid var(--sch-red); border-bottom:24px solid var(--sch-red); }
      .s11-copy { position:absolute; left:230px; top:196px; width:1400px; }
      .s11-pre { font-weight:700; font-size:50px; color:var(--sch-blue); }
      .s11-title { font-weight:900; font-size:224px; line-height:.95; color:var(--sch-blue); letter-spacing:-.025em; margin-top:6px; }
      .s11-claim { font-weight:700; font-size:66px; line-height:1.18; color:var(--sch-blue); margin-top:26px; max-width:1180px; }
      .s11-foot { position:absolute; left:230px; right:230px; bottom:178px; display:flex; align-items:center; justify-content:space-between; }
      .s11-ql { display:flex; align-items:center; gap:18px; font-weight:800; font-size:40px; color:var(--sch-blue); }
      .s11-ql .b { background:var(--sch-red); color:#fff; padding:6px 18px 8px; }
      .s11-ql sup { font-size:20px; }
      .s11-logo { width:400px; height:auto; }
      .s11-svg { position:absolute; inset:0; width:1920px; height:1080px; }
      .s11-fade { position:absolute; inset:0; background:#fff; opacity:0; }
    `;
    document.head.appendChild(css);
    const panel = ANIM.el("div", "s11-panel", h);
    panel.innerHTML = [
      ["farbfaecher", "Integriert"],
      ["barrierefrei", "Barrierefrei"],
      ["renovierung", "Schnell montiert"],
    ].map(([ic, t]) => `<div class="s11-row"><div class="s11-mark"></div><img src="assets/brand/icons/${ic}.svg" crossorigin="anonymous"><b>${t}</b></div>`).join("");
    const end = ANIM.el("div", "s11-end", h);
    end.innerHTML = `
      <div class="s11-ly"></div><div class="s11-lr"></div>
      <div class="s11-copy">
        <div class="s11-pre">Darum ist</div>
        <div class="s11-title">InScreen</div>
        <div class="s11-claim"></div>
      </div>
      <div class="s11-foot">
        <div class="s11-ql"><span class="b">QuinLine<sup>®</sup></span><span>74 | 84</span></div>
        <img class="s11-logo" src="assets/brand/logo-schmidt-color.svg" crossorigin="anonymous">
      </div>`;
    const claimWords = ANIM.words(end.querySelector(".s11-claim"), "die beste Insektenschutzlösung für Hebeschiebetüren.");
    // Mini-Gag auf der Endkarte: SVG-Ebene mit Mücke + kleinem Plissee
    const svg = document.createElementNS(SVGK.NS, "svg");
    svg.setAttribute("class", "s11-svg");
    svg.setAttribute("viewBox", "0 0 1920 1080");
    end.appendChild(svg);
    const mini = G(svg, { x: 1330, y: 236 });
    const miniPl = G(mini, {});
    S("rect", { x: 0, y: 0, width: 46, height: 214, fill: "#3a4147", opacity: 0.16 }, miniPl);
    for (let i = 0; i <= 8; i++) S("line", { x1: i * 5.75, y1: 0, x2: i * 5.75, y2: 214, stroke: i % 2 ? "#2f353a" : "#9aa6ad", "stroke-width": 1.6, opacity: 0.6, "vector-effect": "non-scaling-stroke" }, miniPl);
    S("rect", { x: -6, y: -8, width: 58, height: 10, rx: 3, fill: "#2f353a" }, mini);
    S("rect", { x: -6, y: 212, width: 58, height: 10, rx: 3, fill: "#2f353a" }, mini);
    const mq = CHAR.makeMosquito(svg, { tone: C.b3, mouth: "smirk" });
    const fade = ANIM.el("div", "s11-fade", h);
    // Limonade in Annas Hand
    const glass = G(R.anna.armR.h, { x: 0, y: 2 });
    const gl = G(glass, {});
    S("path", { d: "M-15,-50 L15,-50 L12,10 L-12,10 Z", fill: "#fff", opacity: 0.7 }, gl);
    S("path", { d: "M-14,-32 L14,-32 L12,10 L-12,10 Z", fill: C.y1, opacity: 0.9 }, gl);
    S("circle", { cx: 7, cy: -40, r: 8, fill: C.y2 }, gl);
    S("line", { x1: -4, y1: -70, x2: 3, y2: -14, stroke: C.red, "stroke-width": 4 }, gl);
    gsap.set(glass, { opacity: 0 });
    const soft = SETS.radial(R.svg, "s11LampGlow", [[0, "#fff4dc", 0.95], [0.6, "#fde6b5", 0.35], [1, "#fde6b5", 0]]);
    R.sets.lr.lampGlow.setAttribute("fill", soft);
    R.sets.lr.lampGlow.setAttribute("rx", 260); R.sets.lr.lampGlow.setAttribute("ry", 210);
    R._s11 = { panel, end, claimWords, mini, miniPl, mq, fade, glass, gl };
  },
  build(ctx, tl, R) {
    const { S, C } = SVGK;
    const lr = R.sets.lr, door = lr.door, anna = R.anna, cam = lr.cam;
    const O0 = CHAR.O0;
    const k = R._s11;
    const t0 = ctx.t0, tPre = t0 - 0.32;
    const tInt = ctx.w("integriert");
    const tBar = ctx.w("barrierefrei");
    const tSch = ctx.w("schnell");
    const tDar = ctx.w("darum");
    const tIns = ctx.w("inscreen");
    const tBes = ctx.w("beste");
    const tHeb = ctx.w("hebeschiebetüren");
    const T1 = ctx.t1;
    const FY = 952, s = 0.92, AX = 900;

    // Startzustand: Plissee zu, Anna mit Limonade links der Öffnung
    door.screen(tl, tPre, 1, 0);
    cam.to(tl, tPre, { x: 870, y: 540, z: 1.0 }, 0);
    tl.set(anna.root, { x: AX, y: FY }, tPre);
    tl.set(anna.lean, Object.assign({ scaleX: 1, scaleY: 1, y: 0, rotation: 0 }, O0), tPre);
    anna.pose(tl, tPre, { armL: [60, -113], armR: [-34, -70], legL: [0, 0], legR: [0, 0], head: 0 }, 0);
    tl.set(k.glass, { opacity: 1 }, tPre);
    tl.set(k.gl, Object.assign({ rotation: 104 }, O0), tPre); // hält das Glas aufrecht
    anna.expr(tl, tPre, "smile", "happy", [5, -1]);
    anna.blinks(tl, t0 + 0.4, tDar, 29);
    R.mIn.forEach((m) => tl.set(m.root, { opacity: 0 }, tPre));

    // Dämmerung zieht auf, Lampe geht an
    tl.to(lr.dusk, { opacity: 0.5, duration: 2.6, ease: "sine.inOut" }, t0);
    tl.to(lr.stars, { opacity: 0.9, duration: 2.0, ease: "sine.inOut" }, t0 + 0.8);
    tl.to(lr.beam, { opacity: 0.08, duration: 2.0, ease: "sine.inOut" }, t0);
    tl.to(lr.lampGlow, { opacity: 0.6, duration: 0.5, ease: "power2.out" }, t0 + 0.9);
    tl.to(lr.lampBulb, { opacity: 1, duration: 0.3, ease: "power2.out" }, t0 + 0.9);
    ANIM.sfx(t0 + 0.9, "click", -12);

    // Anna nippt an der Limonade
    const mouth = { x: AX + 14, y: FY - 446 * s };
    const tSip = t0 + 0.35;
    const [u, f] = ANIM.reach(tl, tSip, anna, "armR", mouth, { x: AX, y: FY }, s, -1, 0.45, "power2.inOut");
    tl.to(k.gl, Object.assign({ rotation: -(u + f) + 30, duration: 0.45, ease: "power2.inOut" }, O0), tSip);
    tl.to(anna.head, Object.assign({ rotation: -8, duration: 0.4, ease: "sine.inOut" }, O0), tSip + 0.2);
    anna.eyesClosed(tl, tSip + 0.35, true).mouth(tl, tSip + 0.35, "puff");
    ANIM.sfx(tSip + 0.5, "pop", -16);
    anna.pose(tl, tSip + 1.0, { armR: [-34, -70], head: 2 }, 0.45, "power2.inOut");
    tl.to(k.gl, Object.assign({ rotation: 104, duration: 0.45, ease: "power2.inOut" }, O0), tSip + 1.0);
    anna.eyesClosed(tl, tSip + 1.05, false).mouth(tl, tSip + 1.05, "grin").look(tl, tSip + 1.1, 6, 0);

    // Mücken drücken sich draußen am Gewebe die Nasen platt
    const press = [{ x: 1180, y: 400 }, { x: 1300, y: 520 }, { x: 1220, y: 650 }];
    R.mOut.forEach((m, i) => {
      tl.set(m.root, { x: press[i].x + 40, y: press[i].y - 20, scale: 0.95, opacity: 1 }, tPre);
      tl.set(m.bob, { scaleX: 1, scaleY: 1, x: 0, y: 0, rotation: 0, transformOrigin: "50% 50%" }, tPre);
      m.face_(tl, tPre, -1);
      m.expr(tl, tPre, "frown", "sad");
      m.buzz(tl, tPre, tDar + 0.3);
      m.hover(tl, tPre, tDar, 90 + i, 5);
    });
    tl.to(R.mOut[1].root, { x: press[1].x - 30, duration: 0.18, ease: "power3.in" }, tBar - 0.1);
    tl.to(R.mOut[1].root, { x: press[1].x + 30, duration: 0.5, ease: "elastic.out(1,0.4)" }, tBar + 0.08);
    R.mOut[1].expr(tl, tBar + 0.08, "grimace", "surprised");
    ANIM.sfx(tBar + 0.08, "boing", -10);
    R.mOut[1].expr(tl, tBar + 0.6, "wavy", "annoyed");

    // Vorteils-Trio
    tl.fromTo(k.panel, { opacity: 0, x: -50 }, { opacity: 1, x: 0, duration: 0.45, ease: "power3.out" }, tInt - 0.25);
    const rows = k.panel.querySelectorAll(".s11-row");
    [tInt, tBar, tSch].forEach((t, i) => {
      tl.fromTo(rows[i], { opacity: 0, x: -30 }, { opacity: 1, x: 0, duration: 0.38, ease: "back.out(1.8)" }, t - 0.08);
      tl.fromTo(rows[i].querySelector(".s11-mark"), { scaleY: 0 }, { scaleY: 1, duration: 0.3, ease: "power2.out" }, t - 0.05);
      tl.fromTo(rows[i].querySelector("img"), { scale: 0.4, rotation: -20 }, { scale: 1, rotation: 0, duration: 0.45, ease: "back.out(2.2)" }, t);
      ANIM.sfx(t - 0.05, "pop", -7);
    });
    cam.to(tl, t0 + 0.3, { x: 905, y: 548, z: 1.05 }, tDar - t0 - 0.3, "sine.inOut");

    // Endkarte: Wisch mit Marken-Balken
    const tE = tDar - 0.3;
    tl.fromTo(k.end, { clipPath: "inset(0% 0% 0% 100%)" }, { clipPath: "inset(0% 0% 0% 0%)", duration: 0.6, ease: "power3.inOut" }, tE);
    ANIM.sfx(tE, "whoosh", -4);
    tl.to("#vignette", { opacity: 0, duration: 0.5, ease: "sine.inOut" }, tE + 0.1);
    tl.fromTo(k.end.querySelector(".s11-ly"), { clipPath: "inset(0 100% 100% 0)" }, { clipPath: "inset(0 0% 0% 0)", duration: 0.7, ease: "power3.out" }, tE + 0.35);
    tl.fromTo(k.end.querySelector(".s11-lr"), { clipPath: "inset(100% 0 0 100%)" }, { clipPath: "inset(0% 0 0 0%)", duration: 0.7, ease: "power3.out" }, tE + 0.5);
    tl.fromTo(k.end.querySelector(".s11-pre"), { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.4, ease: "power2.out" }, tDar);
    tl.fromTo(k.end.querySelector(".s11-title"), { opacity: 0, scale: 0.72, transformOrigin: "0% 85%" }, { opacity: 1, scale: 1, duration: 0.55, ease: "back.out(2)" }, tIns - 0.06);
    ANIM.sfx(tIns - 0.06, "sparkle", -4);
    tl.fromTo(k.claimWords, { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 0.34, ease: "power3.out", stagger: 0.11 }, tBes - 0.32);
    tl.fromTo(k.end.querySelector(".s11-ql"), { opacity: 0, x: -24 }, { opacity: 1, x: 0, duration: 0.45, ease: "power2.out" }, tHeb + 0.5);
    tl.fromTo(k.end.querySelector(".s11-logo"), { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 0.5, ease: "back.out(1.6)" }, tHeb + 0.65);
    ANIM.sfx(tHeb + 0.65, "ding", -6);

    // Schlussgag: Mücke will zum Titel — Mini-Plissee fährt dazwischen
    const tG = tHeb + 1.1;
    tl.set(k.mq.root, { x: 2050, y: 260, scale: 1.25, opacity: 1 }, tE);
    k.mq.face_(tl, tE, -1);
    k.mq.init(tl);
    k.mq.buzz(tl, tE, T1);
    tl.fromTo(k.miniPl, Object.assign({ scaleY: 0 }, O0), Object.assign({ scaleY: 1, duration: 0.35, ease: "power3.out" }, O0), tG + 0.15);
    tl.fromTo(k.mini, { opacity: 0 }, { opacity: 1, duration: 0.15, ease: "power1.out" }, tG + 0.1);
    ANIM.sfx(tG + 0.15, "zip", -8);
    tl.to(k.mq.root, { motionPath: { path: [{ x: 1700, y: 300 }, { x: 1560, y: 330 }, { x: 1420, y: 350 }], curviness: 1.3 }, duration: 0.75, ease: "power2.in" }, tG - 0.1);
    k.mq.expr(tl, tG - 0.1, "smirk", "sly");
    tl.to(k.mq.bob, { scaleX: 0.6, scaleY: 1.25, duration: 0.06, ease: "power4.out", transformOrigin: "50% 50%" }, tG + 0.65);
    tl.to(k.mq.bob, { scaleX: 1, scaleY: 1, duration: 0.45, ease: "elastic.out(1,0.4)", transformOrigin: "50% 50%" }, tG + 0.72);
    k.mq.expr(tl, tG + 0.65, "grimace", "surprised");
    ANIM.sfx(tG + 0.65, "bonk", -6);
    ANIM.sfx(tG + 0.68, "boing", -9);
    k.mq.expr(tl, tG + 1.1, "frown", "sad");
    k.mq.face_(tl, tG + 1.3, 1);
    tl.to(k.mq.root, { motionPath: { path: [{ x: 1520, y: 380 }, { x: 1780, y: 300 }, { x: 2080, y: 240 }], curviness: 1.2 }, duration: 1.1, ease: "power1.in" }, tG + 1.35);
    ANIM.sfx(tG + 1.35, "buzzShort", -12);

    // Ende: sanft ausblenden (nur hier erlaubt)
    tl.fromTo(k.fade, { opacity: 0 }, { opacity: 1, duration: 0.55, ease: "power1.in" }, T1 - 0.6);
  },
};
