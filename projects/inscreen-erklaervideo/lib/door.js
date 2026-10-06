// QuinLine®-Hebeschiebetür (Innenansicht, Schema A: links Festflügel, rechts Schiebeflügel)
// mit integriertem InScreen-Plissee (Integrationsprofil am Festflügel, Griffleiste fährt zur Zarge).
(function () {
  const { S, G, C } = window.SVGK;
  const O0 = { svgOrigin: "0 0" };

  const VARIANTS = {
    anthrazit: { frame: "#2f353a", shade: "#20262a", light: "#4a535a", grip: "#151a1d", label: "Anthrazitgrau" },
    weiss: { frame: "#f3f3f0", shade: "#d3d7d8", light: "#ffffff", grip: "#c9cdd0", label: "Weiß" },
    oak: { frame: "#b06a30", shade: "#8a4f22", light: "#d0904f", grip: "#5a3416", label: "Golden Oak" },
  };

  function makeDoor(parent, o) {
    const W = o.w || 900, H = o.h || 690;
    const ft = o.ft || 24, th = o.th || 20; // Blendrahmen, Schwelle
    const mid = W / 2;
    const v = VARIANTS[o.variant || "anthrazit"];
    const d = { W, H, variant: o.variant || "anthrazit", els: { frame: [], shade: [], light: [], grip: [] } };
    const tag = (el, role) => { d.els[role].push(el); return el; };
    const root = G(parent, { x: o.x || 0, y: o.y || 0, s: o.s || 1 });
    d.root = root;

    const glass = (g, x, y, w, h, seed) => {
      S("rect", { x, y, width: w, height: h, fill: "#d8e6ea", opacity: 0.22 }, g);
      S("path", { d: `M${x + w * 0.18},${y} L${x + w * 0.42},${y} L${x + w * 0.1},${y + h} L${x - w * 0.14 > x ? x : x},${y + h} Z`, fill: "#fff", opacity: 0.14 }, g);
      S("path", { d: `M${x + w * 0.52},${y} L${x + w * 0.6},${y} L${x + w * 0.3},${y + h} L${x + w * 0.22},${y + h} Z`, fill: "#fff", opacity: 0.1 }, g);
    };

    // Rahmen mit Loch (evenodd) — die Außenwelt liegt dahinter
    const frame = S("path", {
      d: `M0,0 H${W} V${H} H0 Z M${ft},${ft} V${H - th} H${W - ft} V${ft} Z`,
      "fill-rule": "evenodd", fill: v.frame,
    }, root);
    tag(frame, "frame");
    tag(S("rect", { x: 0, y: H - th, width: W, height: th, fill: v.shade }, root), "shade");
    tag(S("rect", { x: ft, y: H - th, width: W - 2 * ft, height: 5, fill: v.light, opacity: 0.6 }, root), "light");

    // Festflügel links (Außenebene)
    const fixed = S("g", null, root);
    const fx0 = ft, fx1 = mid + 8, pf = 30;
    glass(fixed, fx0 + pf, ft + pf, fx1 - fx0 - 2 * pf, H - th - ft - 2 * pf);
    tag(S("path", {
      d: `M${fx0},${ft} H${fx1} V${H - th} H${fx0} Z M${fx0 + pf},${ft + pf} V${H - th - pf} H${fx1 - pf} V${ft + pf} Z`,
      "fill-rule": "evenodd", fill: v.frame,
    }, fixed), "frame");
    tag(S("rect", { x: fx0 + pf - 4, y: ft + pf - 4, width: fx1 - fx0 - 2 * pf + 8, height: 4, fill: v.shade }, fixed), "shade");

    // InScreen: Führungsschiene oben, Integrationsprofil, Plissee, Griffleiste
    const scr = S("g", null, root);
    d.screenGroup = scr;
    const sx0 = fx1, sx1 = W - ft; // Plissee-Bereich
    const gripW = o.gripW || 18;
    tag(S("rect", { x: sx0, y: ft, width: sx1 - sx0, height: 12, fill: v.frame }, scr), "frame");
    tag(S("rect", { x: sx0, y: ft + 10, width: sx1 - sx0, height: 3, fill: v.shade }, scr), "shade");
    tag(S("rect", { x: sx0, y: H - th - 4, width: sx1 - sx0, height: 4, fill: v.shade, opacity: 0.8 }, scr), "shade");
    // Plissee: Gruppe skaliert in X ab dem Profil -> Falten spreizen sich wie echt
    const plW = sx1 - gripW - (sx0 + 14);
    const pl = G(scr, { x: sx0 + 14, y: ft + 12 });
    d.pleat = pl;
    const plH = H - th - ft - 16;
    S("rect", { x: 0, y: 0, width: plW, height: plH, fill: "#3a4147", opacity: 0.2 }, pl);
    const folds = o.folds || 44;
    for (let i = 0; i <= folds; i++) {
      const x = (plW / folds) * i;
      S("line", { x1: x, y1: 0, x2: x, y2: plH, stroke: i % 2 ? "#2f353a" : "#ffffff", "stroke-width": i % 2 ? 1.6 : 1.2, opacity: i % 2 ? 0.34 : 0.32, "vector-effect": "non-scaling-stroke" }, pl);
    }
    // feines Gewebe-Raster
    for (let y = 8; y < plH; y += 9) {
      S("line", { x1: 0, y1: y, x2: plW, y2: y, stroke: "#2f353a", "stroke-width": 0.6, opacity: 0.12, "vector-effect": "non-scaling-stroke" }, pl);
    }
    d.pleatW = plW;
    // Integrationsprofil am Festflügel
    d.profile = tag(S("rect", { x: sx0, y: ft + 8, width: 16, height: H - th - ft - 10, fill: v.frame }, scr), "frame");
    d.profileLight = tag(S("rect", { x: sx0 + 11, y: ft + 8, width: 3, height: H - th - ft - 10, fill: v.light, opacity: 0.5 }, scr), "light");
    // Griffleiste (fährt)
    const grip = G(scr, { x: sx0 + 14, y: 0 });
    d.grip = grip;
    tag(S("rect", { x: 0, y: ft + 8, width: gripW, height: H - th - ft - 10, rx: 3, fill: v.frame }, grip), "frame");
    tag(S("rect", { x: 3, y: ft + 8, width: 4, height: H - th - ft - 10, fill: v.light, opacity: 0.45 }, grip), "light");
    tag(S("rect", { x: 5, y: H * 0.46, width: gripW - 10, height: 70, rx: 4, fill: v.grip }, grip), "grip");
    d.gripTravel = plW;

    // Schiebeflügel (Innenebene, vorne)
    const sash = G(root, {});
    d.sash = sash;
    const ax0 = mid - 8, ax1 = W - ft, ps = 36;
    glass(sash, ax0 + ps, ft + ps, ax1 - ax0 - 2 * ps, H - th - ft - 2 * ps);
    tag(S("path", {
      d: `M${ax0},${ft} H${ax1} V${H - th} H${ax0} Z M${ax0 + ps},${ft + ps} V${H - th - ps} H${ax1 - ps} V${ft + ps} Z`,
      "fill-rule": "evenodd", fill: v.frame,
    }, sash), "frame");
    tag(S("rect", { x: ax0, y: ft, width: 6, height: H - th - ft, fill: v.light, opacity: 0.5 }, sash), "light");
    tag(S("rect", { x: ax0 + ps - 4, y: ft + ps - 4, width: ax1 - ax0 - 2 * ps + 8, height: 4, fill: v.shade }, sash), "shade");
    // HST-Griff
    d.handle = G(sash, { x: ax1 - ps / 2, y: H * 0.52 });
    S("rect", { x: -9, y: -16, width: 18, height: 32, rx: 6, fill: "#c9cdd0" }, d.handle);
    d.lever = G(d.handle, {});
    S("rect", { x: -7, y: -96, width: 14, height: 104, rx: 7, fill: "#dde0e2" }, d.lever);
    S("rect", { x: -3, y: -92, width: 4, height: 96, rx: 2, fill: "#fff", opacity: 0.6 }, d.lever);
    d.sashTravel = ax1 - ax0 - 8; // bleibt knapp vor dem InScreen-Profil stehen

    // ----- API -----
    d.slide = function (tl, t, frac, dur, ease) {
      tl.to(sash, { x: -d.sashTravel * frac, duration: dur, ease: ease || "power2.inOut" }, t);
      return d;
    };
    d.lift = function (tl, t, up) {
      // Hebeschiebe-Prinzip: Hebel 180° nach unten = Flügel hebt leicht an
      tl.to(d.lever, Object.assign({ rotation: up ? 180 : 0, duration: 0.4, ease: "back.out(1.6)" }, O0), t);
      tl.to(sash, { y: up ? -5 : 0, duration: 0.3, ease: "power2.out" }, t + 0.12);
      return d;
    };
    d.screen = function (tl, t, frac, dur, ease) {
      const f = Math.max(0.015, frac);
      if (dur === 0) {
        tl.set(pl, Object.assign({ scaleX: f }, O0), t);
        tl.set(grip, { x: plW * f }, t);
      } else {
        tl.to(pl, Object.assign({ scaleX: f, duration: dur, ease: ease || "power2.inOut" }, O0), t);
        tl.to(grip, { x: plW * f, duration: dur, ease: ease || "power2.inOut" }, t);
      }
      return d;
    };
    d.setScreenNow = function (frac) {
      gsap.set(pl, Object.assign({ scaleX: Math.max(0.015, frac) }, O0));
      gsap.set(grip, { x: plW * Math.max(0.015, frac) });
    };
    d.setColorNow = function (variant) {
      const nv = VARIANTS[variant];
      ["frame", "shade", "light", "grip"].forEach((r) => d.els[r].forEach((el) => gsap.set(el, { fill: nv[r] })));
      d.variant = variant;
    };
    d.color = function (tl, t, variant, dur, stagger) {
      const nv = VARIANTS[variant];
      ["frame", "shade", "light", "grip"].forEach((r) => {
        tl.to(d.els[r], { fill: nv[r], duration: dur || 0.4, ease: "sine.inOut", stagger: stagger || 0 }, t);
      });
      return d;
    };
    // Weltkoordinaten (für Hände der Figuren)
    d.gripWorld = (frac) => ({ x: (o.x || 0) + (sx0 + 14 + plW * frac + gripW / 2) * (o.s || 1), y: (o.y || 0) + H * 0.5 * (o.s || 1) });
    d.handleWorld = (open) => ({ x: (o.x || 0) + (ax1 - ps / 2 - d.sashTravel * open) * (o.s || 1), y: (o.y || 0) + H * 0.52 * (o.s || 1) });
    d.geo = { ft, th, mid, sx0, sx1, plW, gripW, ax0, ax1, fx0, fx1 };
    d.setScreenNow(o.screen !== undefined ? o.screen : 0);
    return d;
  }

  window.DOOR = { makeDoor, VARIANTS };
})();
