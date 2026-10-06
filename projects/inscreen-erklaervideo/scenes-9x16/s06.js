// s06 (9:16) — „Zurückgeschoben verschwindet das Plissee fast unsichtbar im Profil – farblich passend zur Tür.“
// Anna schiebt die Griffleiste zurück (Totale), die Kamera zoomt hochkant aufs Integrationsprofil
// (Profil als senkrechte Bildachse links, Lupe unten, Labels gestapelt oben), dann zurück in die
// Totale: Farbpalette als breite Karte oben, die Tür wechselt darunter die Farbe.
(window.SCENES = window.SCENES || {}).s06 = {
  set: "lr",
  setup(R, ctx) {
    const h = R.huds[ctx.id];
    const css = document.createElement("style");
    css.textContent = `
      .s06v-tag { position:absolute; display:flex; flex-direction:column; gap:6px; padding:18px 30px 22px 26px; background:#fff; box-shadow:0 14px 40px rgba(18,52,66,.22); border-left:8px solid var(--sch-red); }
      .s06v-tag b { font-weight:800; font-size:48px; line-height:1.05; color:var(--sch-blue); white-space:nowrap; }
      .s06v-tag span { font-weight:500; font-size:38px; line-height:1.1; color:var(--sch-blue); white-space:nowrap; }
      .s06v-pal { position:absolute; left:80px; right:80px; top:232px; padding:28px 34px 30px; background:#fff; box-shadow:0 18px 50px rgba(18,52,66,.24); border-left:8px solid var(--sch-red); }
      .s06v-pal h3 { font-weight:900; font-size:56px; line-height:1; color:var(--sch-blue); margin-bottom:26px; white-space:nowrap; }
      .s06v-row { display:flex; justify-content:space-between; }
      .s06v-sw { display:flex; flex-direction:column; align-items:center; gap:14px; width:33%; }
      .s06v-dot { width:96px; height:96px; border-radius:50%; box-shadow: inset 0 0 0 3px rgba(18,52,66,.15); }
      .s06v-sw span { font-weight:700; font-size:36px; line-height:1; color:var(--sch-blue); white-space:nowrap; }
      .s06v-ring { position:absolute; left:-11px; top:-11px; width:118px; height:118px; border-radius:50%; border:6px solid var(--sch-yellow); box-sizing:border-box; opacity:0; }
      .s06v-dotwrap { position:relative; }
    `;
    document.head.appendChild(css);
    const tag = ANIM.el("div", "s06v-tag", h, "<b>Integrationsprofil</b><span>im Festflügel</span>");
    tag.style.left = "420px"; tag.style.top = "236px";
    const tag2 = ANIM.el("div", "s06v-tag", h, "<b>fast unsichtbar</b>");
    tag2.style.left = "420px"; tag2.style.top = "418px";
    const pal = ANIM.el("div", "s06v-pal", h);
    const V = DOOR.VARIANTS;
    pal.innerHTML = `<h3>Farblich passend</h3><div class="s06v-row">` + ["weiss", "oak", "anthrazit"].map((k) =>
      `<div class="s06v-sw" data-k="${k}"><div class="s06v-dotwrap"><div class="s06v-dot" style="background:${V[k].frame}"></div><div class="s06v-ring"></div></div><span>${V[k].label}</span></div>`).join("") + `</div>`;
    gsap.set([tag, tag2, pal], { opacity: 0 });
    R._s06 = { tag, tag2, pal };
  },
  build(ctx, tl, R) {
    const { S, C } = SVGK;
    const lr = R.sets.lr, door = lr.door, anna = R.anna, cam = lr.cam;
    const O0 = CHAR.O0;
    const { tag, tag2, pal } = R._s06;
    const t0 = ctx.t0, tPre = t0 - 0.32;
    const tZur = ctx.w("zurückgeschoben");
    const tVer = ctx.w("verschwindet");
    const tFast = ctx.w("fast");
    const tFarb = ctx.w("farblich");
    const tPas = ctx.w("passend");
    const tTuer = ctx.w("tür");
    const FY = 952, s = 0.92;
    // Kameras (Hochformat: Weltpunkt x/y landet in Bildmitte 540/960)
    const CAM_TOT = { x: 1080, y: 720, z: 1.15 }; // nah an Anna + Griffleiste (Tür y ≈ 323–1128, Füße ≈ 1227)
    const CAM_PUSH = { x: 1000, y: 724, z: 1.15 }; // geht mit Anna mit, am Ende ganze Tür (x ≈ 82–1000)
    const prof = { x: lr.doorBox.x + door.geo.sx0 + 8, y: 650 }; // Integrationsprofil (Welt)
    const ZP = 2.05, PSX = 330, RSY = 930; // Zoom, Profil bei Bild-x 330, Lupe bei Bild-y 930
    const ring0 = { x: prof.x, y: prof.y + 40 }; // Lupen-Mitte (Welt)
    const CAM_PROF = { x: prof.x + (540 - PSX) / ZP, y: ring0.y + (960 - RSY) / ZP, z: ZP };
    const CAM_PAL = { x: 1010, y: 594, z: 0.92 }; // Tür y ≈ 570–1214 unter der Palette, Füße ≈ 1289
    const toWorld = (c, p) => ({ x: c.x + (p.x - 540) / c.z, y: c.y + (p.y - 960) / c.z });

    // Startzustand (Totale, Plissee zu, Anna an der Griffleiste)
    cam.to(tl, tPre, CAM_TOT, 0);
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

    // Zurückschieben: Griffleiste + Anna gemeinsam nach links, Kamera geht leicht mit
    const dur = 1.05;
    const X1 = X0 - (door.gripWorld(1).x - door.gripWorld(0.015).x);
    door.screen(tl, tZur, 0.015, dur, "power2.inOut");
    tl.to(anna.root, { x: X1, duration: dur, ease: "power2.inOut" }, tZur);
    ANIM.walk(tl, anna, tZur + 0.04, dur - 0.08, { step: 0.26, swing: 14 });
    anna.pose(tl, tZur - 0.12, { lean: -4, head: 5 }, 0.2);
    const tZoom = Math.max(tZur + dur - 0.1, tVer - 0.25);
    cam.to(tl, tZur - 0.05, CAM_PUSH, tZoom - tZur + 0.05, "power2.inOut");
    ANIM.sfx(tZur, "slide", -8, { dur });
    ANIM.sfx(tZur + dur - 0.04, "click", -6);

    // loslassen, zur Seite treten, Kamera hochkant aufs Profil
    const tRel = tZur + dur + 0.05;
    anna.pose(tl, tRel, { armR: [-14, 8], lean: 0, head: -4 }, 0.28, "power2.out");
    tl.to(anna.root, { x: 690, duration: 0.7, ease: "power2.inOut" }, tRel + 0.05);
    ANIM.walk(tl, anna, tRel + 0.05, 0.62, { step: 0.21, swing: 12 });
    anna.look(tl, tRel + 0.1, 6, -2).mouth(tl, tRel + 0.1, "smallSmile");
    cam.to(tl, tZoom, CAM_PROF, 0.8, "power3.inOut");
    ANIM.sfx(tVer - 0.2, "whooshSoft", -8);

    // Lupe am Profil + Hinweislinie zu den gestapelten Labels oben
    const lupe = S("g", { opacity: 0 }, lr.fgLayer);
    const RR = 80;
    const ring = S("circle", { cx: ring0.x, cy: ring0.y, r: RR, fill: "none", stroke: C.yellow, "stroke-width": 6 }, lupe);
    const ringW = S("circle", { cx: ring0.x, cy: ring0.y, r: RR + 10, fill: "none", stroke: "#fff", "stroke-width": 3, opacity: 0.8 }, lupe);
    const a = -Math.PI / 3.2; // Austritt oben rechts
    const lp0 = { x: ring0.x + (RR + 12) * Math.cos(a), y: ring0.y + (RR + 12) * Math.sin(a) };
    const lp1 = toWorld(CAM_PROF, { x: 500, y: 548 }); // knapp unter dem zweiten Label
    const lead = S("path", { d: `M${lp0.x},${lp0.y} L${lp1.x},${lp1.y}`, stroke: C.yellow, "stroke-width": 4, fill: "none", "stroke-linecap": "round" }, lupe);
    const dot = S("circle", { cx: lp1.x, cy: lp1.y, r: 5.5, fill: C.yellow, opacity: 0 }, lupe);
    const tRing = Math.max(tVer + 0.35, tZoom + 0.45); // erst wenn Anna aus dem Bild ist
    tl.set(lupe, { opacity: 1 }, tRing);
    tl.fromTo(ring, { drawSVG: "0%" }, { drawSVG: "100%", duration: 0.5, ease: "power2.inOut" }, tRing);
    tl.fromTo(ringW, { drawSVG: "50% 50%" }, { drawSVG: "0% 100%", duration: 0.45, ease: "power3.out" }, tRing + 0.08);
    tl.fromTo(lead, { drawSVG: "0%" }, { drawSVG: "100%", duration: 0.3, ease: "power1.out" }, tRing + 0.3);
    tl.to(dot, { opacity: 1, duration: 0.12, ease: "power1.out" }, tRing + 0.55);
    ANIM.sfx(tRing, "ding", -8);
    tl.fromTo(tag, { opacity: 0, y: 24, scale: 0.92 }, { opacity: 1, y: 0, scale: 1, duration: 0.42, ease: "back.out(1.7)" }, tRing + 0.27);
    // „fast unsichtbar“: das Faltpaket blitzt kurz auf und verschwindet im Profil
    const pack = S("rect", { x: lr.doorBox.x + door.geo.sx0, y: lr.doorBox.y + door.geo.ft + 10, width: 30, height: lr.doorBox.h - door.geo.th - door.geo.ft - 14, fill: C.yellow, opacity: 0 }, lr.fgLayer);
    tl.to(pack, { opacity: 0.55, duration: 0.18, ease: "power1.out" }, tFast);
    tl.to(pack, { opacity: 0, duration: 0.7, ease: "sine.inOut" }, tFast + 0.25);
    tl.fromTo(tag2, { opacity: 0, y: 18 }, { opacity: 1, y: 0, duration: 0.35, ease: "power3.out" }, tFast + 0.1);
    ANIM.sfx(tFast + 0.05, "sparkle", -8);

    // Farbe: Kamera zurück in die Totale (Tür unter der Palette), Palette oben, Tür wechselt Farbe
    const tBack = tFarb - 0.42;
    cam.to(tl, tBack, CAM_PAL, 0.7, "power3.inOut");
    tl.to(lupe, { opacity: 0, duration: 0.3, ease: "power1.in" }, tBack + 0.05);
    tl.to([tag, tag2], { opacity: 0, y: -16, duration: 0.3, ease: "power1.in" }, tBack + 0.05);
    tl.set(lupe, { visibility: "hidden" }, tBack + 0.4);
    ANIM.sfx(tBack, "whooshSoft", -10);
    tl.fromTo(pal, { opacity: 0, y: -40 }, { opacity: 1, y: 0, duration: 0.45, ease: "back.out(1.6)" }, tFarb - 0.05);
    const sws = pal.querySelectorAll(".s06v-sw");
    tl.fromTo(sws, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.3, ease: "power2.out", stagger: 0.08 }, tFarb + 0.1);
    ANIM.sfx(tFarb, "pop", -8);
    anna.look(tl, tFarb, 6, -3).mouth(tl, tFarb + 0.2, "grin").brows(tl, tFarb + 0.2, "happy");
    anna.pose(tl, tFarb + 0.1, { armL: [60, -113], armR: [-60, 113] }, 0.4, "power2.inOut");

    // Glanz-Streifen über die Tür bei jedem Farbwechsel
    const defs = R.svg.querySelector("defs");
    const cp = S("clipPath", { id: "s06v-doorclip" }, defs);
    S("rect", { x: lr.doorBox.x, y: lr.doorBox.y, width: lr.doorBox.w, height: lr.doorBox.h }, cp);
    const shineG = S("g", { "clip-path": "url(#s06v-doorclip)" }, lr.fgLayer);
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
      const ringEl = sw.querySelector(".s06v-ring");
      tl.fromTo(sw.querySelector(".s06v-dot"), { scale: 1 }, { scale: 1.16, duration: 0.16, ease: "power2.out", yoyo: true, repeat: 1 }, t - 0.05);
      tl.to(ringEl, { opacity: 1, duration: 0.15, ease: "power1.out" }, t - 0.05);
      if (i < steps.length - 1) tl.to(ringEl, { opacity: 0, duration: 0.15, ease: "power1.in" }, steps[i + 1][1] - 0.1);
      ANIM.sfx(t - 0.05, i === 2 ? "sparkle" : "pop", -6);
    });
    anna.blink(tl, steps[1][1] + 0.1);
  },
};
