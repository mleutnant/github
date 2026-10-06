// s10 — „Ab Werk kommt InScreen als Plug-and-Play-Set: einclipsen, fertig – ohne Bohren und Schrauben.
//        Nachrüsten? Auch unkompliziert.“
// Gleiches Set wie s09 (R.partner): Kamera zieht von Ben+Tablet auf die Tür, der Karton landet,
// Ben hebt die Plissee-Kassette heraus, clipst sie ins Profil (Klick), Plissee gleitet zu, Daumen hoch.
// Bohrmaschine + Schrauben werden durchgestrichen, Chips „Ab Werk“ | „Nachrüstung“, Ben zwinkert.
// 9:16: Karton flacher und weiter hinten (bleibt über den Untertiteln), Kamera-Einstellungen fürs
// Hochformat; Bohrmaschine (links, zeigt nach innen) + Schrauben (rechts) über der Tür, Chips oben groß.
(function () {
  const SC = (window.SCENES = window.SCENES || {});

  // Plissee-Kassette (senkrecht, Ursprung = Mitte der Griffleiste), Weltmaße
  function drawCassette(parent, H) {
    const { S } = SVGK;
    const g = S("g", null, parent);
    const h2 = H / 2;
    S("rect", { x: -20, y: -h2 + 4, width: 12, height: H - 8, fill: "#3a4147", opacity: 0.42 }, g);
    for (let x = -18; x < -8; x += 2.5) S("line", { x1: x, y1: -h2 + 4, x2: x, y2: h2 - 4, stroke: x % 5 ? "#ffffff" : "#2f353a", "stroke-width": 1, opacity: 0.55 }, g);
    S("rect", { x: -9, y: -h2, width: 18, height: H, rx: 3, fill: "#f3f3f0" }, g);
    S("rect", { x: -6, y: -h2, width: 4, height: H, fill: "#ffffff", opacity: 0.6 }, g);
    S("rect", { x: 6, y: -h2, width: 3, height: H, fill: "#d3d7d8" }, g);
    S("rect", { x: -4, y: -33, width: 8, height: 70, rx: 4, fill: "#c9cdd0" }, g);
    S("rect", { x: -11, y: -h2 - 4, width: 22, height: 8, rx: 3, fill: "#c9cdd0" }, g);
    S("rect", { x: -11, y: h2 - 4, width: 22, height: 8, rx: 3, fill: "#c9cdd0" }, g);
    return g;
  }

  function setup(R, ctx) {
    const { S, G, C } = SVGK;
    const P = R.partner;
    if (!P) return;
    const L = P.L, Cx = P.Cx;
    P.BOXDROP = 1180; // Fallhöhe: Start knapp über dem Bildrand der Weit-Einstellung (bis dahin unsichtbar)

    // ---- Karton (vor der Tür, landet bei „InScreen“) ----
    const BW = 690, BH = 150, bxc = Cx - 40, byb = 1000;
    P.box = { w: BW, h: BH, x: bxc, y: byb };
    P.boxShadow = S("ellipse", { cx: bxc, cy: byb + 2, rx: BW / 2 + 36, ry: 14, fill: C.blue, opacity: 0.16 }, L.front);
    const mv = S("g", null, L.front);
    P.boxMv = mv;
    const sq = G(mv, { x: bxc, y: byb });
    P.boxSq = sq;
    // Seitenlaschen (öffnen sich nach außen)
    P.ears = [-1, 1].map((sd) => {
      const e = G(sq, { x: sd * BW / 2, y: -BH });
      S("path", { d: `M0,0 L${sd * 14},-58 L${sd * 74},-46 L${sd * 64},0 Z`, fill: C.oak3 }, e);
      S("path", { d: `M${sd * 14},-58 L${sd * 74},-46`, stroke: C.oak1, "stroke-width": 3, opacity: 0.5 }, e);
      return e;
    });
    S("rect", { x: -BW / 2, y: -BH, width: BW, height: BH, fill: C.oak2 }, sq);
    S("rect", { x: -BW / 2, y: -14, width: BW, height: 14, fill: C.oak1, opacity: 0.55 }, sq);
    S("rect", { x: -BW / 2, y: -BH, width: 10, height: BH, fill: C.oak3, opacity: 0.35 }, sq);
    S("rect", { x: BW / 2 - 10, y: -BH, width: 10, height: BH, fill: C.oak1, opacity: 0.3 }, sq);
    // Klebeband
    S("rect", { x: -24, y: -BH, width: 48, height: 50, fill: "#efe5d3", opacity: 0.55 }, sq);
    // Marken-Rahmenlinien + Aufschrift
    S("path", { d: `M${-BW / 2 + 40},-56 V-100 H${-BW / 2 + 150}`, stroke: C.yellow, "stroke-width": 8, fill: "none" }, sq);
    S("path", { d: `M${BW / 2 - 150},-16 H${BW / 2 - 40} V-60`, stroke: C.red, "stroke-width": 8, fill: "none" }, sq);
    const tx = S("text", { x: 0, y: -38, "text-anchor": "middle", fill: C.blue, style: "font-family:'Filson Pro',sans-serif;font-weight:800;font-size:40px;" }, sq);
    tx.innerHTML = 'InScreen<tspan fill="#e3002c" dx="16" font-weight="700">|</tspan><tspan dx="16" font-weight="700">Plug-&amp;-Play-Set</tspan>';
    // Vorderlasche: geschlossen = Deckel (flach, nach oben), offen = hängt vorne herunter
    const flap = G(sq, { x: 0, y: -BH });
    P.flap = flap;
    S("rect", { x: -BW / 2, y: 0, width: BW, height: 52, fill: C.oak3 }, flap);
    S("rect", { x: -BW / 2, y: 45, width: BW, height: 7, fill: C.oak1, opacity: 0.45 }, flap);
    S("rect", { x: -24, y: 0, width: 48, height: 52, fill: "#efe5d3", opacity: 0.5 }, flap);
    gsap.set(flap, { scaleY: -0.26, svgOrigin: "0 0" });
    gsap.set(P.ears, { scale: 0, svgOrigin: "0 0" });
    gsap.set(mv, { y: -P.BOXDROP, opacity: 0 }); // in s09 sonst über dem Panel sichtbar
    gsap.set(P.boxShadow, { opacity: 0 });

    // ---- Kassette im Karton (Welt) + in Bens rechter Hand ----
    const cmv = S("g", null, L.mid);
    P.cassMv = cmv;
    gsap.set(cmv, { opacity: 0 });
    P.cassBox = { x: bxc, y: byb - BH + 26 };
    const cw = G(cmv, { x: P.cassBox.x, y: P.cassBox.y, rot: 90 });
    drawCassette(cw, P.cassH);
    P.cassHand = S("g", { opacity: 0 }, P.hold.armR.content);
    drawCassette(P.cassHand, P.cassH);
    // Daumen-hoch-Faust (rechte Hand)
    const fist = S("g", { opacity: 0 }, P.hold.armR.content);
    P.fist = fist;
    S("rect", { x: -17, y: -24, width: 13, height: 34, rx: 6.5, fill: C.skin2 }, fist);
    S("rect", { x: -16, y: -8, width: 36, height: 32, rx: 12, fill: C.skin2 }, fist);
    [0, 8, 16].forEach((y) => S("path", { d: `M-2,${y} h16`, stroke: C.skin3, "stroke-width": 2.6, "stroke-linecap": "round" }, fist));

    // ---- Bohrmaschine (mit beleidigtem Gesicht) + Schrauben ----
    // 9:16: steht links oben auf der Türlaibung (Welt-y 178), gespiegelt (Bohrer zeigt nach innen)
    const DS = 0.95, DXd = 1141, DYd = 178 - 152 * DS;
    const dmv = S("g", null, L.fx);
    P.drill = { mv: dmv };
    const pop = G(dmv, { x: DXd, y: DYd, s: DS });
    P.drill.pop = pop;
    const flip = S("g", { transform: "scale(-1,1)" }, pop);
    const dsq = G(flip, { x: 0, y: 150 });
    P.drill.sq = dsq;
    const dc = S("g", { transform: "translate(0,-150)" }, dsq);
    S("ellipse", { cx: 18, cy: 152, rx: 70, ry: 8, fill: C.blue, opacity: 0.12 }, dc);
    S("path", { d: "M12,22 H52 L44,132 Q43,140 34,140 H6 Q-3,140 -2,130 Z", fill: C.an2 }, dc);
    S("rect", { x: -36, y: 126, width: 108, height: 26, rx: 8, fill: C.an1 }, dc);
    S("rect", { x: -26, y: 134, width: 88, height: 6, rx: 3, fill: C.b4 }, dc);
    S("rect", { x: -16, y: 26, width: 18, height: 26, rx: 6, fill: C.b4 }, dc);
    const nose = G(dc, { x: -80, y: -10 });
    P.drill.nose = nose;
    S("rect", { x: -140, y: -7, width: 96, height: 14, rx: 3, fill: C.b5 }, nose);
    const clipId = "p10BitClip";
    const defs = R.svg.querySelector("defs");
    const cp = S("clipPath", { id: clipId }, defs);
    S("rect", { x: -140, y: -7, width: 96, height: 14, rx: 3 }, cp);
    const spWrap = S("g", { "clip-path": `url(#${clipId})` }, nose);
    const spiral = S("g", null, spWrap);
    P.drill.spiral = spiral;
    for (let x = -150; x < -40; x += 12) S("line", { x1: x, y1: -7, x2: x + 8, y2: 7, stroke: C.b3, "stroke-width": 3 }, spiral);
    S("rect", { x: -50, y: -18, width: 14, height: 36, rx: 4, fill: C.an2 }, nose);
    S("rect", { x: -40, y: -24, width: 42, height: 48, rx: 9, fill: C.an3 }, nose);
    S("rect", { x: -82, y: -52, width: 176, height: 84, rx: 36, fill: C.b2 }, dc);
    S("rect", { x: -60, y: -48, width: 132, height: 12, rx: 6, fill: C.b3, opacity: 0.85 }, dc);
    [56, 66, 76].forEach((x) => S("line", { x1: x, y1: -22, x2: x, y2: 6, stroke: C.b1, "stroke-width": 4, "stroke-linecap": "round" }, dc));
    const df = CHAR.face(dc, {
      eyeDX: 15, eyeY: -6, eyeRX: 11, eyeRY: 13, pupil: 6, lid: 2.2,
      browY: -28, browW: 10, browC: C.ink, browSW: 4.5, mouthY: 16, mouthS: 0.55,
    });
    df.group._wrap.setAttribute("transform", "translate(-6,0)");
    P.drill.face = df;
    Object.keys(df.mouths).forEach((k) => gsap.set(df.mouths[k], { opacity: k === "grin" ? 1 : 0 }));
    gsap.set(df.pupils, { x: -4 });
    P.drill.strikes = [
      "M-112,-78 Q30,40 205,168",
      "M190,-86 Q30,24 -106,163",
    ].map((d) => S("path", { d, stroke: C.red, "stroke-width": 12, fill: "none", "stroke-linecap": "round" }, pop));
    gsap.set(pop, { scale: 0, svgOrigin: "0 0" });
    gsap.set(P.drill.strikes, { drawSVG: "0% 0%" });

    const smv = S("g", null, L.fx);
    P.screws = { mv: smv, items: [] };
    const SS = 1.12, SCX = 1700, SCY = 178 - 84 * SS; // rechts, Spitzen auf der Türlaibung
    [[SCX - 80, SCY - 2, -12], [SCX + 80, SCY + 2, 12]].forEach(([x, y, r]) => {
      const sp = G(smv, { x, y, rot: r, s: SS });
      const fall = G(sp, {});
      S("path", { d: "M-24,-74 H24 L13,-56 H-13 Z", fill: C.b4 }, fall);
      S("rect", { x: -24, y: -80, width: 48, height: 8, rx: 3, fill: C.b4 }, fall);
      S("rect", { x: -9, y: -56, width: 18, height: 114, fill: C.b5 }, fall);
      for (let yy = -50; yy < 54; yy += 11) S("line", { x1: -12, y1: yy, x2: 12, y2: yy + 6, stroke: C.b3, "stroke-width": 4, "stroke-linecap": "round" }, fall);
      S("path", { d: "M-9,58 L0,84 L9,58 Z", fill: C.b5 }, fall);
      gsap.set(fall, { scale: 0, svgOrigin: "0 0" });
      P.screws.items.push(fall);
    });
    P.screws.strikes = [
      `M${SCX - 160},${SCY - 100} Q${SCX},${SCY - 4} ${SCX + 165},${SCY + 116}`,
      `M${SCX + 165},${SCY - 102} Q${SCX},${SCY + 6} ${SCX - 165},${SCY + 110}`,
    ].map((d) => S("path", { d, stroke: C.red, "stroke-width": 12, fill: "none", "stroke-linecap": "round" }, smv));
    gsap.set(P.screws.strikes, { drawSVG: "0% 0%" });

    // Einrast-Blitz entlang des Profils
    P.snapLine = S("line", { x1: P.gripX0 - 3, y1: P.cassTop + 6, x2: P.gripX0 - 3, y2: P.cassTop + P.cassH - 6, stroke: C.yellow, "stroke-width": 7, "stroke-linecap": "round", opacity: 0 }, L.fx);

    // ---- Funkeln beim Zwinkern + Staubwölkchen ----
    const sparkle = (x, y, r) => {
      const g = G(L.fx, { x, y });
      S("path", { d: `M0,${-r} C${r * 0.14},${-r * 0.2} ${r * 0.2},${-r * 0.14} ${r},0 C${r * 0.2},${r * 0.14} ${r * 0.14},${r * 0.2} 0,${r} C${-r * 0.14},${r * 0.2} ${-r * 0.2},${r * 0.14} ${-r},0 C${-r * 0.2},${-r * 0.14} ${-r * 0.14},${-r * 0.2} 0,${-r} Z`, fill: C.yellow }, g);
      S("circle", { cx: 0, cy: 0, r: r * 0.16, fill: "#fff" }, g);
      gsap.set(g, { scale: 0, svgOrigin: "0 0" });
      return g;
    };
    P.sparks = [sparkle(P.Bx + 122, 452, 28), sparkle(P.Bx + 158, 410, 14)];
    P.dust = [-1, 1].map((sd) => {
      const g = G(L.front, { x: bxc + sd * (BW / 2 - 10), y: byb - 6 });
      [[0, 0, 26], [sd * 34, -10, 18], [sd * 60, 2, 14]].forEach(([x, y, r]) => S("circle", { cx: x, cy: y, r, fill: "#efe5d3" }, g));
      gsap.set(g, { scale: 0, opacity: 0, svgOrigin: "0 0" });
      return g;
    });

    // ---- HUD: Chips ----
    const h = R.huds[ctx.id];
    const row = ANIM.el("div", "p10-chips", h);
    row.style.cssText = `position:absolute;left:0;top:226px;width:${SVGK.F.W}px;display:flex;justify-content:center;gap:26px;`;
    P.chips = ["Ab Werk", "Nachrüstung"].map((t) => {
      const c = ANIM.el("div", "chip", row, `<div class="bar"></div>${t}`);
      c.style.cssText = "position:relative;opacity:0;font-size:64px;gap:20px;padding:22px 36px 24px 28px;line-height:1.2;box-shadow:0 16px 40px rgba(18,52,66,.24);";
      c.querySelector(".bar").style.cssText = "width:9px;height:66px;";
      return c;
    });
  }

  function build(ctx, tl, R) {
    const P = R.partner;
    const { C } = SVGK;
    const O0 = CHAR.O0;
    const ben = P.ben, cam = P.cam, door = P.door, Bx = P.Bx, Cx = P.Cx;
    const t0 = ctx.t0, t1 = ctx.t1;
    const w = (k, e) => ctx.w(k, e);
    const tKommt = w("kommt"), tIn = w("inscreen"), tPlug = w("plug");
    const tClip = w("einclipsen"), tFertig = w("fertig"), tOhne = w("ohne"), tBohr = w("bohren");
    const tUnd = w("und"), tSchr = w("schrauben"), tNach = w("nachrüsten"), tUnk = w("unkompliziert");
    // 9:16-Einstellungen (Karton-Unterkante bleibt über der Untertitel-Zone y 1350)
    const WIDE = { x: Cx + 45, y: 694, z: 1.18 }; // Tür + Ben groß, Karton landet unten
    const PUSH = { x: Cx + 40, y: 732, z: 1.3 }; // Ben + Integrationsprofil beim Einclipsen
    const OPEN = { x: Cx, y: 620, z: 0.95 }; // Platz über der Tür für Bohrmaschine + Schrauben
    const FINAL = { x: Cx + 40, y: 707, z: 1.2 }; // Ben groß, Chips oben

    // ---- Übergang: Panel schrumpft ins Tablet, Kamera zieht auf die Tür ----
    tl.to(P.panel, { scale: 0.45, duration: 0.28, ease: "power2.in" }, t0 - 0.12);
    if (P.note) tl.to(P.note, { scale: 0.6, duration: 0.28, ease: "power2.in" }, t0 - 0.12);
    cam.to(tl, t0 + 0.02, WIDE, tIn + 0.06 - (t0 + 0.02), "power2.inOut");
    ANIM.sfx(t0 + 0.02, "whooshSoft", -10);
    // Maßband zurück in die Tasche, Tablet an die Seite
    const pouch = { x: Bx + P.s * 43, y: P.BY - P.s * 250 };
    P.armTo(tl, t0 + 0.04, "armR", pouch, 0.3, "power2.inOut", { angle: 0 });
    tl.set(P.tape, { opacity: 0 }, t0 + 0.34);
    ANIM.sfx(t0 + 0.32, "swish", -12);
    P.armTo(tl, t0 + 0.4, "armR", [-12, 10], 0.34, "back.out(1.6)");
    P.armTo(tl, t0 + 0.1, "armL", [9, -10], 0.42, "power2.inOut", { angle: 86 });
    ben.look(tl, t0 + 0.1, 0, 1, 0.2).mouth(tl, t0 + 0.12, "smile").brows(tl, t0 + 0.1, "neutral", 0.2);
    tl.to(ben.head, Object.assign({ rotation: 0, duration: 0.3, ease: "power2.out" }, O0), t0 + 0.08);

    // ---- „kommt InScreen“: Karton fällt herein ----
    const tFall = tKommt - 0.02, tLand = tIn;
    tl.set(P.boxMv, { opacity: 1 }, tFall);
    tl.fromTo(P.boxMv, { y: -P.BOXDROP }, { y: 0, duration: tLand - tFall, ease: "power2.in" }, tFall);
    tl.fromTo(P.boxShadow, { opacity: 0, scale: 0.4, transformOrigin: "50% 50%" }, { opacity: 0.16, scale: 1, duration: tLand - tFall, ease: "power2.in" }, tFall);
    ANIM.sfx(tFall, "whooshSoft", -8);
    tl.to(P.boxSq, Object.assign({ scaleY: 0.86, scaleX: 1.06, duration: 0.07, ease: "power2.out" }, O0), tLand);
    tl.to(P.boxSq, Object.assign({ scaleY: 1, scaleX: 1, duration: 0.5, ease: "elastic.out(1,0.38)" }, O0), tLand + 0.07);
    ANIM.sfx(tLand, "thud", -2);
    tl.set(P.cassMv, { opacity: 1 }, tLand);
    cam.shake(tl, tLand, 12, 0.24);
    P.dust.forEach((d, i) => {
      tl.to(d, Object.assign({ scale: 1.25, opacity: 0.9, duration: 0.22, ease: "power2.out" }, O0), tLand + 0.01);
      tl.to(d, Object.assign({ scale: 1.6, opacity: 0, duration: 0.3, ease: "power1.in" }, O0), tLand + 0.23);
    });
    ben.look(tl, tFall - 0.12, 1, -7, 0.14).brows(tl, tFall - 0.12, "surprised", 0.14).mouth(tl, tFall - 0.08, "O");
    tl.to(ben.lean, { y: 10, duration: 0.07, ease: "power2.out" }, tLand);
    tl.to(ben.lean, { y: 0, duration: 0.4, ease: "back.out(2.5)" }, tLand + 0.07);
    ben.blink(tl, tLand + 0.02);
    ben.look(tl, tLand + 0.18, 3, 6, 0.18).mouth(tl, tLand + 0.22, "grin").brows(tl, tLand + 0.2, "happy", 0.2);

    // ---- „Plug“: Karton klappt auf, Kassette lugt heraus ----
    tl.to(P.flap, Object.assign({ scaleY: 1, duration: 0.4, ease: "back.out(1.7)" }, O0), tPlug);
    P.ears.forEach((e, i) => tl.to(e, Object.assign({ scale: 1, duration: 0.34, ease: "back.out(2.6)" }, O0), tPlug + 0.06 + i * 0.05));
    ANIM.sfx(tPlug, "box", -2);
    tl.to(P.cassMv, { y: -40, duration: 0.32, ease: "back.out(2.6)" }, tPlug + 0.14);
    ANIM.sfx(tPlug + 0.16, "pop", -8);

    // ---- Kassette greifen (Ben taucht hinter den Karton) ----
    const tLift = Math.max(tPlug + 0.62, tClip - 0.7);
    const tPress = Math.max(tClip - 0.04, tLift + 0.4); // Andrücken -> Klick bei tClick
    const tClick = tPress + 0.1;
    const tGrab = tLift - 0.04;
    const tCr = Math.max(tPlug + 0.2, tGrab - 0.36);
    const crY = 168, th = 77;
    P.breathe(tl, t0, tCr - 0.05);
    tl.to(ben.lean, { y: crY, duration: tGrab - tCr, ease: "power2.inOut" }, tCr);
    ben.pose(tl, tCr, { legL: [th, -2 * th], legR: [-th, 2 * th] }, tGrab - tCr, "power2.inOut");
    P.state.lean = crY;
    const cassTarget = { x: P.cassBox.x, y: P.cassBox.y - 40 };
    P.armTo(tl, tCr + 0.02, "armR", cassTarget, tGrab - tCr - 0.02, "power2.inOut", { angle: 90 });
    ben.look(tl, tCr, 3, 8, 0.15).brows(tl, tCr, "neutral", 0.2).mouth(tl, tCr + 0.05, "o");
    cam.to(tl, tCr, PUSH, tClick - 0.12 - tCr, "sine.inOut");
    tl.set(P.cassMv, { opacity: 0 }, tGrab);
    tl.set(P.cassHand, { opacity: 1 }, tGrab);
    ANIM.sfx(tGrab, "tap", -12);

    // ---- herausheben + aufrichten ----
    P.state.lean = 0;
    tl.to(ben.lean, { y: 0, duration: tPress - tLift - 0.06, ease: "back.out(1.3)" }, tLift);
    ben.pose(tl, tLift, { legL: [0, 0], legR: [0, 0] }, tPress - tLift - 0.06, "back.out(1.3)");
    const pre = { x: P.gripCX + 34, y: P.cassCY };
    P.armTo(tl, tLift, "armR", pre, tPress - tLift - 0.06, "back.out(1.15)", { angle: 0, lean: 0 });
    ANIM.sfx(tLift + 0.05, "swish", -6);
    ben.look(tl, tLift + 0.05, 7, -5, 0.2).brows(tl, tLift + 0.05, "annoyed", 0.2).mouth(tl, tLift + 0.08, "flat");

    // ---- „einclipsen“: ans Profil drücken -> KLICK ----
    const at = { x: P.gripCX, y: P.cassCY };
    P.armTo(tl, tPress, "armR", at, 0.1, "power3.in");
    tl.set(P.cassHand, { opacity: 0 }, tClick);
    tl.set([door.pleat, door.grip], { opacity: 1 }, tClick);
    ANIM.sfx(tClick, "click", 0);
    tl.set(P.snapLine, { opacity: 1 }, tClick);
    tl.fromTo(P.snapLine, { drawSVG: "50% 50%" }, { drawSVG: "0% 100%", duration: 0.2, ease: "power3.out" }, tClick);
    tl.to(P.snapLine, { opacity: 0, duration: 0.3, ease: "power1.in" }, tClick + 0.22);
    ANIM.burst(tl, P.L.fx, P.gripX0 - 6, P.cassTop + 70, tClick, { color: C.yellow, n: 8, len: 26, r0: 16, w: 5, seed: 41 });
    ANIM.burst(tl, P.L.fx, P.gripX0 - 6, P.cassTop + 470, tClick + 0.04, { color: C.yellow, n: 7, len: 22, r0: 14, w: 5, seed: 43 });
    cam.shake(tl, tClick, 5, 0.15);
    ben.mouth(tl, tClick + 0.04, "grin").brows(tl, tClick + 0.04, "happy", 0.15);
    P.breathe(tl, tClick + 0.3, t1);

    // ---- Plissee gleitet zu (Ben gibt der Griffleiste einen Schubs) ----
    const tZip = tClick + 0.16, zDur = 0.8;
    door.screen(tl, tZip, 1, zDur, "power2.inOut");
    ANIM.sfx(tZip, "zip", -3, { dur: zDur });
    const pp = 0.17 / zDur, push = P.door.geo.plW * (pp < 0.5 ? 2 * pp * pp : 1 - 2 * (1 - pp) * (1 - pp));
    P.armTo(tl, tZip, "armR", { x: P.gripCX + push, y: P.cassCY }, 0.17, "power2.in");
    const dRel = Math.min(0.36, tFertig - 0.11 - (tZip + 0.19));
    if (dRel > 0.12) P.armTo(tl, tZip + 0.19, "armR", [-24, 22], dRel, "power2.out");
    ben.look(tl, tZip + 0.05, 8, 0, 0.25);

    // ---- „fertig“: Daumen hoch ----
    const tThumb = Math.max(tFertig - 0.1, tZip + 0.2);
    P.armTo(tl, tThumb, "armR", [-42, -96], 0.36, "back.out(2)", { angle: 0 });
    tl.set(P.handR, { opacity: 0 }, tThumb + 0.08);
    tl.set(P.fist, { opacity: 1 }, tThumb + 0.08);
    ben.look(tl, tThumb, 0, 0, 0.2).mouth(tl, tThumb + 0.04, "grin").brows(tl, tThumb, "happy", 0.18);
    tl.to(ben.head, Object.assign({ rotation: -6, duration: 0.3, ease: "back.out(2)" }, O0), tThumb + 0.04);
    ANIM.sfx(tThumb + 0.2, "pop", -9);
    cam.to(tl, tFertig - 0.05, OPEN, 0.8, "power2.inOut");
    // langsames Nachdriften in der offenen Einstellung (bis die Final-Kamera übernimmt)
    const tDrift = tFertig + 0.75, tDriftEnd = Math.min(tNach + 0.3, t1 - 1.2);
    if (tDriftEnd - tDrift > 0.3) cam.to(tl, tDrift, { x: OPEN.x + 6, y: OPEN.y + 8, z: OPEN.z + 0.02 }, tDriftEnd - tDrift, "sine.inOut");

    // ---- „ohne Bohren und Schrauben“ ----
    const D = P.drill;
    const tDr = tOhne - 0.12;
    tl.to(D.pop, Object.assign({ scale: 1.12, duration: 0.38, ease: "back.out(2.2)" }, O0), tDr);
    ANIM.sfx(tDr, "pop", -8);
    ANIM.sfx(tDr + 0.1, "drill", -9, { dur: 0.5 });
    const nSp = Math.max(2, Math.round((tBohr - tDr - 0.05) / 0.06));
    tl.fromTo(D.spiral, { x: 0 }, { x: -12, duration: 0.06, ease: "none", repeat: nSp - 1 }, tDr + 0.05);
    for (let i = 0; i < 6; i++) tl.to(D.sq, Object.assign({ rotation: i % 2 ? -1.6 : 1.6, duration: 0.05, ease: "sine.inOut" }, O0), tDr + 0.12 + i * 0.05);
    tl.to(D.sq, Object.assign({ rotation: 0, duration: 0.06, ease: "sine.out" }, O0), tDr + 0.42);
    // Ben: Daumen runter, Kopfschütteln + „nein-nein“-Wackeln
    const tNo = tOhne - 0.05;
    P.armTo(tl, tNo, "armR", [-34, -128], 0.24, "power2.out", { angle: 0 });
    tl.set(P.fist, { opacity: 0 }, tNo + 0.1);
    tl.set(P.handR, { opacity: 1 }, tNo + 0.1);
    ben.look(tl, tNo, 9, -3, 0.2).brows(tl, tNo, "sly", 0.2).mouth(tl, tNo + 0.06, "smirk");
    tl.to(ben.head, Object.assign({ rotation: 0, duration: 0.2, ease: "power2.out" }, O0), tNo);
    const nWag = Math.max(4, Math.round((tSchr + 0.35 - (tNo + 0.26)) / 0.14));
    for (let i = 0; i < nWag; i++) {
      ben.pose(tl, tNo + 0.26 + i * 0.14, { armR: [undefined, i % 2 ? -128 : -104] }, 0.14, "sine.inOut");
      tl.to(ben.head, Object.assign({ rotation: i % 2 ? 5 : -5, duration: 0.14, ease: "sine.inOut" }, O0), tNo + 0.26 + i * 0.14);
    }
    const tWagEnd = tNo + 0.26 + nWag * 0.14;
    tl.to(ben.head, Object.assign({ rotation: 0, duration: 0.2, ease: "power2.out" }, O0), tWagEnd);
    ben.pose(tl, tWagEnd, { armR: [undefined, -128] }, 0.1, "power2.out");
    P.state.armR = [-34, -128];
    // Durchstreichen
    D.strikes.forEach((p, i) => tl.to(p, { drawSVG: "0% 100%", duration: 0.2, ease: "power2.out" }, tBohr + i * 0.13));
    ANIM.sfx(tBohr, "scribble", -4);
    ["grin", "O"].forEach((k) => tl.set(D.face.mouths[k], { opacity: k === "O" ? 1 : 0 }, tBohr + 0.05));
    D.face.brows.forEach((b) => tl.to(b.el, Object.assign({ rotation: b.side < 0 ? -12 : 12, duration: 0.15, ease: "power2.out" }, O0), tBohr + 0.05));
    tl.to(D.face.eyes, Object.assign({ scale: 1.18, duration: 0.15, ease: "back.out(3)" }, O0), tBohr + 0.05);
    tl.to(D.face.pupils, { x: 3, y: -3, duration: 0.12, ease: "power2.out" }, tBohr + 0.05);
    // Schrauben
    P.screws.items.forEach((s, i) => {
      tl.to(s, Object.assign({ scale: 1, duration: 0.34, ease: "back.out(2.6)" }, O0), tUnd - 0.08 + i * 0.1);
      ANIM.sfx(tUnd - 0.08 + i * 0.1, "pop", -10);
    });
    P.screws.strikes.forEach((p, i) => tl.to(p, { drawSVG: "0% 100%", duration: 0.2, ease: "power2.out" }, tSchr + 0.02 + i * 0.13));
    ANIM.sfx(tSchr + 0.02, "scribble", -4);
    // Bohrmaschine sackt beleidigt zusammen und rutscht raus
    const tSulk = tSchr + 0.42;
    ["O", "frown"].forEach((k) => tl.set(D.face.mouths[k], { opacity: k === "frown" ? 1 : 0 }, tSulk));
    D.face.brows.forEach((b) => tl.to(b.el, Object.assign({ rotation: b.side < 0 ? 20 : -20, duration: 0.2, ease: "power2.out" }, O0), tSulk));
    tl.to(D.face.pupils, { x: 5, y: 4, duration: 0.2, ease: "power2.out" }, tSulk);
    tl.to(D.face.eyes, Object.assign({ scaleX: 1, scaleY: 0.62, duration: 0.2, ease: "power2.out" }, O0), tSulk);
    tl.to(D.sq, Object.assign({ scaleY: 0.8, scaleX: 1.08, rotation: -6, duration: 0.32, ease: "power2.out" }, O0), tSulk);
    tl.to(D.nose, Object.assign({ rotation: -26, duration: 0.42, ease: "back.out(1.6)" }, O0), tSulk);
    // 9:16: Schrauben kippen zuerst und rollen nach rechts raus (vor dem Chip „Nachrüstung“ —
    // durchgestrichene Schrauben dürfen nicht neben „Nachrüstung“ stehen), dann hüpft die Bohrmaschine
    // beleidigt nach links weg (unter dem Chip „Ab Werk“).
    const tScrOff = tSulk + 0.08;
    P.screws.items.forEach((s, i) => tl.to(s, Object.assign({ rotation: i ? 150 : 120, duration: 0.42, ease: "power2.in" }, O0), tScrOff + i * 0.05));
    tl.to(P.screws.mv, { x: 900, duration: 0.42, ease: "power2.in" }, tScrOff + 0.04);
    tl.to(P.screws.mv, { y: 60, duration: 0.42, ease: "power1.in" }, tScrOff + 0.04);
    ANIM.sfx(tScrOff + 0.06, "swish", -10);
    const tOff = tSulk + 0.3;
    tl.to(D.sq, Object.assign({ scaleY: 1.1, scaleX: 0.94, duration: 0.12, ease: "power2.out" }, O0), tOff);
    tl.to(D.mv, { x: -900, duration: 0.42, ease: "power2.in" }, tOff + 0.06);
    tl.to(D.mv, { y: -40, duration: 0.18, ease: "power2.out" }, tOff + 0.06);
    tl.to(D.mv, { y: 30, duration: 0.26, ease: "power2.in" }, tOff + 0.24);
    ANIM.sfx(tOff, "boing", -5);
    // Ben lacht
    ben.mouth(tl, tOff + 0.05, "grin").eyesClosed(tl, tOff + 0.05, true).eyesClosed(tl, tOff + 0.42, false);
    const dLaugh = Math.min(0.4, tNach - 0.05 - tOff);
    if (dLaugh > 0.15) P.armTo(tl, tOff, "armR", [-14, 10], dLaugh, "power2.inOut", { angle: 0 });
    tl.to(ben.lean, { y: -6, duration: 0.12, ease: "power2.out", yoyo: true, repeat: 3 }, tOff + 0.05);

    // ---- „Nachrüsten?“: Chips ----
    P.chips.forEach((c, i) => {
      tl.fromTo(c, { opacity: 0, scale: 0.6, y: 24 }, { opacity: 1, scale: 1, y: 0, duration: 0.42, ease: "back.out(1.9)" }, tNach + 0.02 + i * 0.2);
      ANIM.sfx(tNach + 0.02 + i * 0.2, "pop", -6);
    });
    const chin = { x: Bx + 22, y: P.BY - P.s * 438 };
    P.armTo(tl, tNach - 0.02, "armR", chin, 0.38, "power2.inOut", { bend: 1 });
    ben.look(tl, tNach + 0.05, 4, -8, 0.2).brows(tl, tNach + 0.05, "surprised", 0.2).mouth(tl, tNach + 0.1, "o");
    tl.to(ben.head, Object.assign({ rotation: -5, duration: 0.35, ease: "power2.inOut" }, O0), tNach + 0.05);

    // erst nach dem Abgang von Bohrmaschine + Schrauben nachziehen (sonst wandern sie in die Chip-Zeile)
    const tCamF = Math.min(tNach + 0.3, t1 - 1.2);
    cam.to(tl, tCamF, FINAL, t1 - tCamF, "sine.inOut");

    // ---- „unkompliziert“: Zwinkern + Funkeln ----
    const tWink = tUnk + 0.02;
    P.armTo(tl, tWink - 0.06, "armR", [-58, -62], 0.36, "back.out(1.8)");
    tl.set(ben.face.eyes[1], { opacity: 0 }, tWink);
    tl.set(ben.face.closed[1], { opacity: 1 }, tWink);
    tl.set(ben.face.eyes[1], { opacity: 1 }, tWink + 0.6);
    tl.set(ben.face.closed[1], { opacity: 0 }, tWink + 0.6);
    ben.mouth(tl, tWink, "smirk").brows(tl, tWink, "sly", 0.15).look(tl, tWink, 0, 0, 0.15);
    tl.to(ben.head, Object.assign({ rotation: 6, duration: 0.3, ease: "back.out(2)" }, O0), tWink - 0.04);
    P.sparks.forEach((g, i) => {
      const ts = tWink + 0.04 + i * 0.12;
      tl.to(g, Object.assign({ scale: 1.15, rotation: 45, duration: 0.24, ease: "back.out(2.5)" }, O0), ts);
      tl.to(g, Object.assign({ scale: 0, rotation: 110, duration: 0.3, ease: "power2.in" }, O0), ts + 0.34);
    });
    ANIM.sfx(tWink + 0.04, "sparkle", -4);
    tl.to(P.chips[1], { scale: 1.08, duration: 0.14, ease: "power2.out" }, tWink);
    tl.to(P.chips[1], { scale: 1, duration: 0.4, ease: "back.out(2)" }, tWink + 0.14);
    ben.mouth(tl, tWink + 0.75, "smile").brows(tl, tWink + 0.75, "happy", 0.25);

    // Blinzeln (nicht während Lachen/Zwinkern)
    ben.blinks(tl, t0 + 0.5, tCr, 31);
    ben.blinks(tl, tClick + 0.3, tOff, 33);
    ben.blinks(tl, tOff + 0.6, tWink - 0.2, 35);
    ben.blinks(tl, tWink + 0.8, t1, 37);
  }

  SC.s10 = { set: "partner", setup, build };
})();
