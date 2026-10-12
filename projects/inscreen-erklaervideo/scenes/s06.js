// s06 — „Zurückgeschoben verschwindet das Plissee fast unsichtbar im Profil. Griffleiste und Rahmen der Plisseekassette sind farblich passend foliert oder pulverbeschichtet.“
// Anna schiebt die Griffleiste zurück, Lupe aufs Integrationsprofil, Griffleiste + Kassettenrahmen leuchten
// auf, dann Farbwechsel der ganzen Tür (Palette: foliert oder pulverbeschichtet).
(window.SCENES = window.SCENES || {}).s06 = {
  set: "lr",
  setup(R, ctx) {
    const h = R.huds[ctx.id];
    const css = document.createElement("style");
    css.textContent = `
      .s06-tag { position:absolute; display:flex; flex-direction:column; gap:6px; padding:18px 26px 20px 24px; background:#fff; box-shadow:0 14px 40px rgba(18,52,66,.2); border-left:8px solid var(--sch-red); }
      .s06-tag b { font-weight:800; font-size:40px; color:var(--sch-blue); white-space:nowrap; }
      .s06-tag span { font-weight:500; font-size:30px; color:var(--sch-blue); white-space:nowrap; }
      .s06-pal { position:absolute; right:70px; top:250px; width:380px; padding:30px 30px 18px; background:#fff; box-shadow:0 18px 50px rgba(18,52,66,.22); }
      .s06-pal h3 { font-weight:800; font-size:38px; color:var(--sch-blue); margin-bottom:14px; white-space:nowrap; }
      .s06-pal p { font-weight:600; font-size:26px; line-height:1.2; color:var(--sch-blue); margin:-4px 0 14px; opacity:0; }
      .s06-note { font-weight:500; font-size:24px; line-height:1.2; color:var(--sch-blue); opacity:0; margin-top:8px; padding-top:12px; border-top:2px solid #e3ebee; }
      .s06-sw { display:flex; align-items:center; gap:20px; padding:12px 0; }
      .s06-dot { width:64px; height:64px; border-radius:50%; box-shadow: inset 0 0 0 3px rgba(18,52,66,.15); }
      .s06-sw span { font-weight:700; font-size:34px; color:var(--sch-blue); white-space:nowrap; }
      .s06-ring { position:absolute; left:-8px; top:-8px; width:80px; height:80px; border-radius:50%; border:5px solid var(--sch-yellow); opacity:0; }
      .s06-dotwrap { position:relative; }
    `;
    document.head.appendChild(css);
    const tag = ANIM.el("div", "s06-tag", h, "<b>Integrationsprofil</b><span>im Festflügel</span>");
    tag.style.left = "1180px"; tag.style.top = "250px";
    const tag2 = ANIM.el("div", "s06-tag", h, "<b>fast unsichtbar</b>");
    tag2.style.left = "1180px"; tag2.style.top = "430px";
    const pal = ANIM.el("div", "s06-pal", h);
    const V = DOOR.VARIANTS;
    pal.innerHTML = `<h3>Farblich passend</h3><p>Griffleiste &amp; Kassettenrahmen<br>foliert oder pulverbeschichtet</p>` + ["weiss", "oak", "anthrazit"].map((k) =>
      `<div class="s06-sw" data-k="${k}"><div class="s06-dotwrap"><div class="s06-dot" style="background:${V[k].frame}"></div><div class="s06-ring"></div></div><span>${V[k].label}</span></div>`).join("") +
      `<div class="s06-note">Farbbeispiele – weitere Farben erhältlich</div>`;
    const tag3 = ANIM.el("div", "s06-tag", h, "<b>Griffleiste</b>");
    tag3.style.left = "1180px"; tag3.style.top = "250px";
    const tag4 = ANIM.el("div", "s06-tag", h, "<b>Griffleiste &amp; Rahmen</b><span>der Plisseekassette</span>");
    tag4.style.left = "100px"; tag4.style.top = "250px";
    gsap.set([tag3, tag4], { opacity: 0 });
    R._s06 = { tag, tag2, tag3, tag4, pal };
  },
  build(ctx, tl, R) {
    const { S, C, G } = SVGK;
    const lr = R.sets.lr, door = lr.door, anna = R.anna, cam = lr.cam;
    const O0 = CHAR.O0;
    const { tag, tag2, tag3, tag4, pal } = R._s06;
    const t0 = ctx.t0, tPre = t0 - 0.32;
    const tZur = ctx.w("zurückgeschoben");
    const tVer = ctx.w("verschwindet");
    const tFast = ctx.w("fast");
    const tFarb = ctx.w("farblich");
    const tPas = ctx.w("passend");
    const tGr = ctx.w("griffleiste"), tRa = ctx.w("rahmen"), tFol = ctx.w("foliert");
    const FY = 952, s = 0.92;

    // Startzustand (passend zum Röntgenbild: Tür zentriert, Plissee zu)
    cam.to(tl, tPre, { x: 1010, y: 525, z: 1.0 }, 0);
    door.screen(tl, tPre, 1, 0);
    R.mOut.forEach((m) => tl.set(m.root, { opacity: 0 }, tPre));
    R.mIn.forEach((m) => tl.set(m.root, { opacity: 0 }, tPre));
    const X0 = 1306;
    tl.set(anna.root, { x: X0, y: FY }, tPre);
    tl.set(anna.lean, Object.assign({ scaleX: 1, scaleY: 1, y: 0, rotation: 0 }, O0), tPre);
    anna.pose(tl, tPre, { armL: [10, -6], legL: [0, 0], legR: [0, 0], head: 0 }, 0);
    ANIM.reach(tl, tPre, anna, "armR", door.gripWorld(1), { x: X0, y: FY }, s, -1, 0);
    anna.expr(tl, tPre, "smile", "neutral", [4, 0]);
    anna.blinks(tl, t0 + 0.3, ctx.t1, 17);

    // Zurückschieben: Griffleiste + Anna gemeinsam nach links
    const dur = 1.05;
    const X1 = X0 - (door.gripWorld(1).x - door.gripWorld(0.015).x);
    door.screen(tl, tZur, 0.015, dur, "power2.inOut");
    tl.to(anna.root, { x: X1, duration: dur, ease: "power2.inOut" }, tZur);
    ANIM.walk(tl, anna, tZur + 0.04, dur - 0.08, { step: 0.26, swing: 14 });
    anna.pose(tl, tZur - 0.12, { lean: -4, head: 5 }, 0.2);
    ANIM.sfx(tZur, "slide", -8, { dur });
    ANIM.sfx(tZur + dur - 0.04, "click", -6);

    // loslassen, zur Seite treten, Kamera auf das Profil
    const tRel = tZur + dur + 0.05;
    anna.pose(tl, tRel, { armR: [-14, 8], lean: 0, head: -4 }, 0.28, "power2.out");
    tl.to(anna.root, { x: 690, duration: 0.7, ease: "power2.inOut" }, tRel + 0.05);
    ANIM.walk(tl, anna, tRel + 0.05, 0.62, { step: 0.21, swing: 12 });
    anna.look(tl, tRel + 0.1, 6, -2).mouth(tl, tRel + 0.1, "smallSmile");
    const prof = { x: lr.doorBox.x + door.geo.sx0 + 8, y: 650 };
    cam.to(tl, Math.max(tRel - 0.1, tVer - 0.25), { x: prof.x + 150, y: prof.y - 40, z: 2.15 }, 0.8, "power3.inOut");
    ANIM.sfx(tVer - 0.2, "whooshSoft", -8);

    // Lupe + Labels
    const lupe = S("g", { opacity: 0 }, lr.fgLayer);
    const ring = S("circle", { cx: prof.x, cy: prof.y + 40, r: 78, fill: "none", stroke: C.yellow, "stroke-width": 6 }, lupe);
    S("circle", { cx: prof.x, cy: prof.y + 40, r: 88, fill: "none", stroke: "#fff", "stroke-width": 3, opacity: 0.8 }, lupe);
    const lead = S("path", { d: `M${prof.x + 66},${prof.y} L${prof.x + 250},${prof.y - 152}`, stroke: C.yellow, "stroke-width": 4, fill: "none" }, lupe);
    tl.set(lupe, { opacity: 1 }, tVer + 0.35);
    tl.fromTo(ring, { drawSVG: "0%" }, { drawSVG: "100%", duration: 0.5, ease: "power2.inOut" }, tVer + 0.35);
    tl.fromTo(lead, { drawSVG: "0%" }, { drawSVG: "100%", duration: 0.3, ease: "power1.out" }, tVer + 0.65);
    ANIM.sfx(tVer + 0.35, "ding", -8);
    tl.fromTo(tag, { opacity: 0, x: -30 }, { opacity: 1, x: 0, duration: 0.4, ease: "back.out(1.7)" }, tVer + 0.62);
    // „fast unsichtbar“: das Faltpaket blitzt kurz auf und verschwindet im Profil
    const pack = S("rect", { x: lr.doorBox.x + door.geo.sx0, y: lr.doorBox.y + door.geo.ft + 10, width: 30, height: lr.doorBox.h - door.geo.th - door.geo.ft - 14, fill: C.yellow, opacity: 0 }, lr.fgLayer);
    tl.to(pack, { opacity: 0.55, duration: 0.18, ease: "power1.out" }, tFast);
    tl.to(pack, { opacity: 0, duration: 0.7, ease: "sine.inOut" }, tFast + 0.25);
    tl.fromTo(tag2, { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.35, ease: "power3.out" }, tFast + 0.1);
    ANIM.sfx(tFast + 0.05, "sparkle", -8);

    // „Griffleiste“: noch nah am Profil — die zurückgeschobene Griffleiste leuchtet gelb auf
    const g = door.geo, bx = lr.doorBox.x, by = lr.doorBox.y, hh = lr.doorBox.h - g.th - g.ft;
    const gx = bx + g.sx0 + 14 + g.plW * 0.015;
    const gripHL = S("rect", { x: gx - 5, y: by + g.ft + 4, width: g.gripW + 10, height: hh - 2, rx: 6, fill: C.yellow, opacity: 0 }, lr.fgLayer);
    tl.to([tag, tag2], { opacity: 0, duration: 0.22, ease: "power1.in" }, tGr - 0.2);
    tl.fromTo(tag3, { opacity: 0, x: -30 }, { opacity: 1, x: 0, duration: 0.4, ease: "back.out(1.7)" }, tGr + 0.02);
    tl.to(gripHL, { opacity: 0.8, duration: 0.18, ease: "power2.out" }, tGr);
    tl.to(gripHL, { opacity: 0.45, duration: 0.5, ease: "sine.inOut" }, tGr + 0.25);
    ANIM.sfx(tGr, "pop", -8);

    // „Rahmen der Plisseekassette“: Kamera zurück auf die ganze Tür, Kassettenrahmen zeichnet sich gelb nach
    const tBack = tRa - 0.3;
    cam.to(tl, tBack, { x: 1010, y: 525, z: 1.0 }, 0.7, "power3.inOut");
    tl.to([lupe, tag3], { opacity: 0, duration: 0.25, ease: "power1.in" }, tBack);
    tl.set(lupe, { visibility: "hidden" }, tBack + 0.3);
    ANIM.sfx(tBack, "whooshSoft", -10);
    const frameHL = S("rect", { x: bx + g.sx0 + 3, y: by + g.ft + 3, width: g.sx1 - g.sx0 - 6, height: hh - 3, rx: 5, fill: "none", stroke: C.yellow, "stroke-width": 9, "stroke-linejoin": "round", opacity: 0.95 }, lr.fgLayer);
    tl.fromTo(frameHL, { drawSVG: "0%" }, { drawSVG: "100%", duration: 0.7, ease: "power2.inOut" }, tRa + 0.1);
    tl.fromTo(tag4, { opacity: 0, x: -30 }, { opacity: 1, x: 0, duration: 0.4, ease: "back.out(1.7)" }, tRa + 0.05);
    ANIM.sfx(tRa + 0.1, "sparkle", -10);
    // vor den Farbwechseln: Markierungen ausblenden, damit die Farben klar zu sehen sind
    tl.to([frameHL, gripHL, tag4], { opacity: 0, duration: 0.3, ease: "power1.in" }, tFarb + 0.05);

    tl.fromTo(pal, { opacity: 0, x: 60 }, { opacity: 1, x: 0, duration: 0.45, ease: "back.out(1.6)" }, tFarb - 0.05);
    const sws = pal.querySelectorAll(".s06-sw");
    tl.fromTo(pal.querySelector("p"), { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.35, ease: "power2.out" }, Math.max(tFarb + 0.2, tFol - 0.1));
    tl.fromTo(pal.querySelector(".s06-note"), { opacity: 0, y: 8 }, { opacity: 0.85, y: 0, duration: 0.35, ease: "power2.out" }, tFarb + 0.55);
    tl.fromTo(sws, { opacity: 0, x: 24 }, { opacity: 1, x: 0, duration: 0.3, ease: "power2.out", stagger: 0.08 }, tFarb + 0.1);
    ANIM.sfx(tFarb, "pop", -8);
    anna.look(tl, tFarb, 6, 0).mouth(tl, tFarb + 0.2, "grin").brows(tl, tFarb + 0.2, "happy");
    anna.pose(tl, tFarb + 0.1, { armL: [60, -113], armR: [-60, 113] }, 0.4, "power2.inOut");

    // Glanz-Streifen über die Tür bei jedem Farbwechsel
    const defs = R.svg.querySelector("defs");
    const cp = S("clipPath", { id: "s06-doorclip" }, defs);
    S("rect", { x: lr.doorBox.x, y: lr.doorBox.y, width: lr.doorBox.w, height: lr.doorBox.h }, cp);
    const shineG = S("g", { "clip-path": "url(#s06-doorclip)" }, lr.fgLayer);
    // Drei Farbvarianten gleichmäßig über das (verlängerte) Fenster verteilt — jede gut sichtbar
    // (letzte Farbe ~1 s vor dem Übergang, der ~0,3 s vor Fensterende beginnt).
    const tW = tFarb + 0.3, tLast = Math.max(tW + 1.2, ctx.t1 - 1.3);
    const steps = [
      ["weiss", tW],
      ["oak", (tW + tLast) / 2],
      ["anthrazit", tLast],
    ];
    steps.forEach(([k, t], i) => {
      door.color(tl, t, k, 0.45, 0.0035);
      const shine = S("path", { d: `M0,${lr.doorBox.y - 40} L120,${lr.doorBox.y - 40} L-60,${lr.doorBox.y + lr.doorBox.h + 40} L-180,${lr.doorBox.y + lr.doorBox.h + 40} Z`, fill: "#fff", opacity: 0 }, shineG);
      tl.fromTo(shine, { x: lr.doorBox.x - 60, opacity: 0.55 }, { x: lr.doorBox.x + lr.doorBox.w + 240, opacity: 0.25, duration: 0.55, ease: "power2.inOut" }, t - 0.05);
      tl.set(shine, { opacity: 0 }, t + 0.52);
      const sw = sws[i];
      const ringEl = sw.querySelector(".s06-ring");
      tl.fromTo(sw.querySelector(".s06-dot"), { scale: 1 }, { scale: 1.18, duration: 0.16, ease: "power2.out", yoyo: true, repeat: 1 }, t - 0.05);
      tl.to(ringEl, { opacity: 1, duration: 0.15, ease: "power1.out" }, t - 0.05);
      if (i < steps.length - 1) tl.to(ringEl, { opacity: 0, duration: 0.15, ease: "power1.in" }, steps[i + 1][1] - 0.1);
      ANIM.sfx(t - 0.05, i === 2 ? "sparkle" : "pop", -6);
    });
    anna.blink(tl, steps[1][1] + 0.1);
  },
};
