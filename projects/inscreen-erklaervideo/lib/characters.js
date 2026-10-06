// Figuren-Rigs: Anna, Mücken, Ben, Kind auf Bobbycar, Opa mit Rollator, Saugroboter.
// Jede Figur liefert Gruppen mit Drehpunkt im lokalen Ursprung + eine kleine Animations-API,
// die Tweens immer in eine übergebene GSAP-Timeline an eine feste Zeit schreibt (seekbar).
(function () {
  const { S, G, rng, C } = window.SVGK;
  const O0 = { svgOrigin: "0 0" };
  // Zustände bei t<=0 sofort setzen (eine Timeline rendert Sets bei exakt 0 nicht zuverlässig)
  function put(tl, t, el, vars) {
    if (t <= 0.0001) gsap.set(el, vars);
    else tl.set(el, vars, t);
  }

  // ---------- gemeinsame Bausteine ----------

  function limb(parent, o) {
    // Oberarm/-schenkel (u) dreht um Schulter/Hüfte, Unterarm (f) um Ellbogen/Knie.
    const u = G(parent, { x: o.x, y: o.y });
    S("line", { x1: 0, y1: 0, x2: 0, y2: o.l1, stroke: o.c, "stroke-width": o.w, "stroke-linecap": "round" }, u);
    const f = G(u, { x: 0, y: o.l1 });
    S("line", { x1: 0, y1: 0, x2: 0, y2: o.l2, stroke: o.c2 || o.c, "stroke-width": o.w2 || o.w * 0.94, "stroke-linecap": "round" }, f);
    const h = G(f, { x: 0, y: o.l2 });
    return { u, f, h };
  }

  function hand(parent, skin, r, side) {
    S("circle", { cx: 0, cy: 4, r: r, fill: skin }, parent);
    S("ellipse", { cx: side * r * 0.8, cy: -2, rx: r * 0.42, ry: r * 0.62, fill: skin, transform: `rotate(${side * -30} ${side * r * 0.8} -2)` }, parent);
  }

  // Gesicht: Augen (blinzeln), Pupillen (Blick), Brauen, Münder (Ersatz-Animation).
  function face(parent, o) {
    const f = { eyes: [], pupils: [], brows: [], closed: [], mouths: {}, browBase: [] };
    const face = G(parent, {});
    f.group = face;
    [-1, 1].forEach((side, i) => {
      const ex = side * o.eyeDX;
      const eye = G(face, { x: ex, y: o.eyeY });
      S("ellipse", { cx: 0, cy: 0, rx: o.eyeRX, ry: o.eyeRY, fill: "#fff" }, eye);
      const pup = G(eye, {});
      S("circle", { cx: 0, cy: 1, r: o.pupil, fill: C.ink }, pup);
      S("circle", { cx: -o.pupil * 0.36, cy: -o.pupil * 0.42, r: o.pupil * 0.36, fill: "#fff" }, pup);
      if (o.lashes) {
        S("path", { d: `M${side * o.eyeRX * 0.75},${-o.eyeRY * 0.7} l${side * 7},-7`, stroke: C.ink, "stroke-width": 3.4, "stroke-linecap": "round", fill: "none" }, eye);
      }
      // dünner Lidschwung nur außen oben
      S("path", { d: `M${side * o.eyeRX * 0.15},${-o.eyeRY * 1.02} Q${side * o.eyeRX * 0.85},${-o.eyeRY * 0.92} ${side * (o.eyeRX + 1.5)},${-o.eyeRY * 0.35}`, stroke: C.ink, "stroke-width": o.lid || 2.6, fill: "none", "stroke-linecap": "round", opacity: 0.9 }, eye);
      f.eyes.push(eye);
      f.pupils.push(pup);
      const cl = S("path", { d: `M${ex - o.eyeRX},${o.eyeY + 2} Q${ex},${o.eyeY - o.eyeRY * 0.9} ${ex + o.eyeRX},${o.eyeY + 2}`, stroke: C.ink, "stroke-width": 4.5, fill: "none", "stroke-linecap": "round", opacity: 0 }, face);
      f.closed.push(cl);
      const brow = G(face, { x: ex, y: o.browY });
      S("path", { d: `M${-o.browW},3 Q0,-5 ${o.browW},1`, stroke: o.browC, "stroke-width": o.browSW || 6, fill: "none", "stroke-linecap": "round" }, brow);
      f.brows.push({ el: brow, side });
    });
    // Nase + Wangen
    if (o.nose) S("path", { d: o.nose, stroke: o.noseC, "stroke-width": 4, fill: "none", "stroke-linecap": "round" }, face);
    if (o.cheeks) {
      [-1, 1].forEach((side) => S("ellipse", { cx: side * o.cheekDX, cy: o.cheekY, rx: 12, ry: 7.5, fill: C.cheek, opacity: 0.5 }, face));
    }
    // Münder
    const m = G(face, { x: 0, y: o.mouthY, s: o.mouthS || 1 });
    const st = { stroke: C.ink, "stroke-width": 5, fill: "none", "stroke-linecap": "round", "stroke-linejoin": "round" };
    const add = (name, build) => {
      const g = S("g", { opacity: 0 }, m);
      build(g);
      f.mouths[name] = g;
    };
    add("smile", (g) => S("path", Object.assign({ d: "M-18,-3 Q0,13 18,-3" }, st), g));
    add("smallSmile", (g) => S("path", Object.assign({ d: "M-11,-1 Q0,7 11,-1" }, st), g));
    add("grin", (g) => {
      S("path", { d: "M-22,-5 Q0,-7 22,-5 Q19,21 0,23 Q-19,21 -22,-5 Z", fill: C.mouth }, g);
      S("path", { d: "M-18,-4 Q0,-6 18,-4 L16,3 Q0,5 -16,3 Z", fill: "#fff" }, g);
      S("ellipse", { cx: 0, cy: 15, rx: 10, ry: 5, fill: C.tongue }, g);
    });
    add("open", (g) => {
      S("path", { d: "M-15,-4 Q0,-5 15,-4 Q12,15 0,16 Q-12,15 -15,-4 Z", fill: C.mouth }, g);
      S("ellipse", { cx: 0, cy: 10, rx: 7, ry: 3.6, fill: C.tongue }, g);
    });
    add("O", (g) => S("ellipse", { cx: 0, cy: 3, rx: 9, ry: 12, fill: C.mouth }, g));
    add("o", (g) => S("ellipse", { cx: 0, cy: 2, rx: 5.5, ry: 7, fill: C.mouth }, g));
    add("flat", (g) => S("path", Object.assign({ d: "M-12,2 L12,2" }, st), g));
    add("frown", (g) => S("path", Object.assign({ d: "M-15,8 Q0,-4 15,8" }, st), g));
    add("wavy", (g) => S("path", Object.assign({ d: "M-16,3 q4,-6 8,0 t8,0 t8,0 t8,0" }, st), g));
    add("grimace", (g) => {
      S("rect", { x: -20, y: -8, width: 40, height: 17, rx: 7, fill: "#fff", stroke: C.ink, "stroke-width": 3 }, g);
      S("path", { d: "M-20,0.5 H20 M-8,-8 V9 M5,-8 V9", stroke: C.ink, "stroke-width": 2, fill: "none" }, g);
    });
    add("smirk", (g) => S("path", Object.assign({ d: "M-14,3 Q4,10 17,-6" }, st), g));
    add("puff", (g) => S("ellipse", { cx: 0, cy: 2, rx: 4, ry: 4, fill: C.mouth }, g));
    f.mouthGroup = m;
    return f;
  }

  const BROWS = {
    neutral: [0, 0], happy: [-7, -4], surprised: [-5, -12], angry: [20, 5],
    worried: [-17, -3], annoyed: [12, 3], sly: [8, 2], sad: [-12, 2],
  };

  // Gemeinsame API für alle Figuren mit face()
  function api(ch) {
    const f = ch.face;
    ch.mouth = function (tl, t, name) {
      for (const k in f.mouths) put(tl, t, f.mouths[k], { opacity: k === name ? 1 : 0 });
      return ch;
    };
    ch.brows = function (tl, t, mood, dur) {
      const [rot, y] = BROWS[mood] || BROWS.neutral;
      f.brows.forEach((b) => {
        const v = Object.assign({ rotation: rot * (b.side < 0 ? 1 : -1), y: y }, O0);
        if (dur === 0 || t <= 0.0001) put(tl, t, b.el, v);
        else tl.to(b.el, Object.assign(v, { duration: dur || 0.18, ease: "power2.out" }), t);
      });
      return ch;
    };
    ch.look = function (tl, t, dx, dy, dur) {
      if (dur === 0 || t <= 0.0001) put(tl, t, f.pupils, { x: dx, y: dy });
      else tl.to(f.pupils, { x: dx, y: dy, duration: dur || 0.16, ease: "power3.out" }, t);
      return ch;
    };
    ch.blink = function (tl, t) {
      tl.to(f.eyes, Object.assign({ scaleY: 0.08, duration: 0.06, ease: "power1.in" }, O0), t);
      tl.to(f.eyes, Object.assign({ scaleY: 1, duration: 0.09, ease: "power1.out" }, O0), t + 0.07);
      return ch;
    };
    ch.blinks = function (tl, t0, t1, seed) {
      const r = rng(seed || 7);
      let t = t0 + 0.4 + r() * 1.2;
      while (t < t1 - 0.3) {
        ch.blink(tl, t);
        if (r() < 0.18 && t + 0.3 < t1) ch.blink(tl, t + 0.24);
        t += 2.1 + r() * 2.2;
      }
      return ch;
    };
    ch.eyesClosed = function (tl, t, closed) {
      put(tl, t, f.eyes, { opacity: closed ? 0 : 1 });
      put(tl, t, f.closed, { opacity: closed ? 1 : 0 });
      return ch;
    };
    ch.expr = function (tl, t, mouth, mood, look) {
      if (mouth) ch.mouth(tl, t, mouth);
      if (mood) ch.brows(tl, t, mood);
      if (look) ch.look(tl, t, look[0], look[1]);
      return ch;
    };
    ch.init = function (tl) {
      // Startzustand deterministisch bei t=0
      ch.mouth(tl, 0, ch.defaultMouth || "smile");
      put(tl, 0, f.closed, { opacity: 0 });
      return ch;
    };
    return ch;
  }

  function poseApi(ch) {
    // pose: { armL:[u,f], armR:[u,f], legL:[u,f], legR:[u,f], head, lean, handL, handR }
    ch.pose = function (tl, t, p, dur, ease) {
      const d = dur === undefined ? 0.35 : dur;
      const e = ease || "power2.inOut";
      const tw = (el, rot) => {
        if (el && rot !== undefined) {
          if (d === 0 || t <= 0.0001) put(tl, t, el, Object.assign({ rotation: rot }, O0));
          else tl.to(el, Object.assign({ rotation: rot, duration: d, ease: e }, O0), t);
        }
      };
      ["armL", "armR", "legL", "legR"].forEach((k) => {
        if (p[k] && ch[k]) {
          tw(ch[k].u, p[k][0]);
          tw(ch[k].f, p[k][1]);
          if (p[k][2] !== undefined) tw(ch[k].h, p[k][2]);
        }
      });
      if (p.head !== undefined) tw(ch.head, p.head);
      if (p.lean !== undefined) tw(ch.lean, p.lean);
      return ch;
    };
    ch.breathe = function (tl, t0, t1, amp, period) {
      const per = period || 1.7;
      const n = Math.max(1, Math.floor((t1 - t0) / per));
      tl.fromTo(ch.breath, Object.assign({ scaleY: 1 }, O0), Object.assign({ scaleY: 1 + (amp || 0.012), duration: per / 2, ease: "sine.inOut", yoyo: true, repeat: n * 2 - 1 }, O0), t0);
      return ch;
    };
    return ch;
  }

  // ---------- Anna ----------
  function makeAnna(parent, o) {
    o = o || {};
    const ch = { name: "anna" };
    const root = G(parent, { x: o.x || 0, y: o.y || 0 });
    ch.root = root;
    const base = S("g", { transform: `scale(${o.s || 1})` }, root);
    ch.base = base;
    ch.shadow = S("ellipse", { cx: 0, cy: 0, rx: 78, ry: 13, fill: C.blue, opacity: 0.16 }, base);
    ch.lean = G(base, {});
    ch.breath = G(ch.lean, {});
    const body = ch.breath;
    ch.body = body;

    // Beine (Haut) + Schuhe
    const leg = (side) => {
      const l = limb(body, { x: side * 22, y: -196, l1: 96, l2: 86, w: 23, c: C.skin1, c2: C.skin1 });
      S("path", { d: `M${-8 + side * 6},-6 q-16,0 -16,12 v4 h40 v-4 q0,-12 -16,-12 z`, fill: C.b1 }, l.h);
      return l;
    };
    ch.legL = leg(-1);
    ch.legR = leg(1);

    // Arm hinten (rechts) wird vor dem Kleid gezeichnet? -> beide Arme vorne, aber Kleid zuerst
    const dress = S("g", null, body);
    S("path", { d: "M-50,-390 C-58,-340 -66,-292 -90,-176 Q0,-150 90,-176 C66,-292 58,-340 50,-390 Q0,-408 -50,-390 Z", fill: C.yellow }, dress);
    S("path", { d: "M22,-396 C36,-340 44,-284 62,-170 Q80,-172 90,-176 C66,-292 58,-340 50,-390 Q36,-398 22,-396 Z", fill: C.yDark, opacity: 0.55 }, dress);
    S("path", { d: "M-46,-306 Q0,-296 46,-306 L48,-292 Q0,-282 -48,-292 Z", fill: "#fff", opacity: 0.92 }, dress);
    // Pünktchen-Muster
    const r = rng(11);
    for (let i = 0; i < 16; i++) {
      const yy = -270 + r() * 85, xx = (r() - 0.5) * (110 + (yy + 270) * 0.9);
      S("circle", { cx: xx, cy: yy, r: 3.6, fill: "#fff", opacity: 0.55 }, dress);
    }
    // Hals
    S("path", { d: "M-13,-420 h26 v34 q-13,8 -26,0 z", fill: C.skin2 }, body);
    S("path", { d: "M-22,-394 Q0,-374 22,-394", stroke: "#fff", "stroke-width": 7, fill: "none", "stroke-linecap": "round" }, body);

    const arm = (side) => {
      const a = limb(body, { x: side * 47, y: -380, l1: 78, l2: 72, w: 20, c: C.skin1 });
      S("path", { d: `M-15,-8 Q0,-20 15,-8 L16,22 Q0,30 -16,22 Z`, fill: C.yellow }, a.u);
      hand(a.h, C.skin1, 14, side);
      return a;
    };
    ch.armL = arm(-1);
    ch.armR = arm(1);

    // Kopf
    ch.head = G(body, { x: 0, y: -412 });
    const h = ch.head;
    S("circle", { cx: 34, cy: -186, r: 36, fill: C.hair1 }, h); // Dutt
    S("ellipse", { cx: 0, cy: -88, rx: 84, ry: 84, fill: C.hair1 }, h);
    S("path", { d: "M-80,-70 Q-92,-10 -64,6 Q-70,-40 -66,-70 Z", fill: C.hair1 }, h);
    [-1, 1].forEach((sd) => S("ellipse", { cx: sd * 73, cy: -82, rx: 12, ry: 16, fill: C.skin2 }, h));
    S("ellipse", { cx: 0, cy: -88, rx: 74, ry: 79, fill: C.skin1 }, h);
    ch.face = face(h, {
      eyeDX: 29, eyeY: -90, eyeRX: 15.5, eyeRY: 18.5, pupil: 10, lashes: true,
      browY: -128, browW: 14, browC: C.hair1, browSW: 6,
      nose: "M3,-74 q7,9 -3,13", noseC: C.skin3, cheeks: true, cheekDX: 47, cheekY: -60,
      mouthY: -42,
    });
    // Pony über der Stirn
    S("path", { d: "M-76,-96 C-80,-168 -14,-196 38,-174 C72,-160 84,-122 78,-94 C62,-128 30,-150 -6,-144 C-38,-140 -60,-122 -76,-96 Z", fill: C.hair1 }, h);
    S("path", { d: "M-6,-144 C-20,-128 -26,-110 -24,-96", stroke: C.hair1, "stroke-width": 10, fill: "none", "stroke-linecap": "round" }, h);
    S("path", { d: "M-40,-166 C-10,-180 30,-178 56,-158", stroke: "#7a4330", "stroke-width": 5, fill: "none", "stroke-linecap": "round", opacity: 0.7 }, h);
    // Haarspange in Rot (kleiner Marken-Akzent)
    S("rect", { x: 40, y: -158, width: 26, height: 9, rx: 4.5, fill: C.red, transform: "rotate(28 53 -153)" }, h);

    api(ch);
    poseApi(ch);
    ch.defaultMouth = "smile";
    return ch;
  }

  // ---------- Ben (Monteur, wie in der Broschüre: graues Langarmshirt, dunkelblaue Steppweste) ----------
  function makeBen(parent, o) {
    o = o || {};
    const ch = { name: "ben" };
    const root = G(parent, { x: o.x || 0, y: o.y || 0 });
    ch.root = root;
    const base = S("g", { transform: `scale(${o.s || 1})` }, root);
    ch.base = base;
    ch.shadow = S("ellipse", { cx: 0, cy: 0, rx: 92, ry: 14, fill: C.blue, opacity: 0.16 }, base);
    ch.lean = G(base, {});
    ch.breath = G(ch.lean, {});
    const body = ch.breath;
    ch.body = body;
    const leg = (side) => {
      const l = limb(body, { x: side * 30, y: -230, l1: 112, l2: 104, w: 34, c: C.b2, c2: C.b2 });
      S("path", { d: `M${-12 + side * 8},-8 q-18,0 -18,14 v6 h50 v-6 q0,-14 -18,-14 z`, fill: C.an1 }, l.h);
      return l;
    };
    ch.legL = leg(-1);
    ch.legR = leg(1);
    // Oberkörper: Shirt + Weste
    S("path", { d: "M-66,-452 Q0,-470 66,-452 C78,-380 76,-300 70,-222 Q0,-206 -70,-222 C-76,-300 -78,-380 -66,-452 Z", fill: "#9aa6ad" }, body);
    S("path", { d: "M-68,-446 Q-30,-462 -14,-458 L-12,-212 Q-44,-210 -70,-222 C-76,-300 -78,-380 -68,-446 Z", fill: C.blue }, body);
    S("path", { d: "M68,-446 Q30,-462 14,-458 L12,-212 Q44,-210 70,-222 C76,-300 78,-380 68,-446 Z", fill: C.blue }, body);
    for (let i = 0; i < 6; i++) {
      const y = -420 + i * 36;
      S("path", { d: `M-66,${y} Q-40,${y + 6} -14,${y}`, stroke: C.b1, "stroke-width": 3, fill: "none" }, body);
      S("path", { d: `M66,${y} Q40,${y + 6} 14,${y}`, stroke: C.b1, "stroke-width": 3, fill: "none" }, body);
    }
    S("rect", { x: -70, y: -236, width: 140, height: 20, rx: 6, fill: C.an2 }, body); // Gürtel
    S("rect", { x: 26, y: -246, width: 34, height: 42, rx: 5, fill: C.oak1 }, body); // Werkzeugtasche
    S("rect", { x: 32, y: -258, width: 6, height: 18, rx: 2, fill: C.an3 }, body);
    S("path", { d: "M-18,-468 h36 v26 q-18,10 -36,0 z", fill: C.skin2 }, body);
    const arm = (side) => {
      const a = limb(body, { x: side * 62, y: -440, l1: 92, l2: 86, w: 28, c: "#9aa6ad" });
      hand(a.h, C.skin2, 17, side);
      return a;
    };
    ch.armL = arm(-1);
    ch.armR = arm(1);
    ch.head = G(body, { x: 0, y: -462 });
    const h = ch.head;
    [-1, 1].forEach((sd) => S("ellipse", { cx: sd * 68, cy: -80, rx: 13, ry: 17, fill: C.skin3 }, h));
    S("path", { d: "M-70,-90 Q-72,-168 0,-172 Q72,-168 70,-90 L68,-40 Q60,16 0,18 Q-60,16 -68,-40 Z", fill: C.skin2 }, h);
    // Bart (kurz, grau-meliert)
    S("path", { d: "M-66,-56 Q-60,14 0,20 Q60,14 66,-56 Q50,-22 30,-26 Q0,-36 -30,-26 Q-50,-22 -66,-56 Z", fill: "#8b8580" }, h);
    ch.face = face(h, {
      eyeDX: 27, eyeY: -86, eyeRX: 13, eyeRY: 15, pupil: 8.5, lid: 2.8,
      browY: -114, browW: 15, browC: "#5f5a55", browSW: 8,
      nose: "M4,-72 q10,12 -4,16", noseC: C.skin3,
      mouthY: -30, mouthS: 0.9,
    });
    // Haare kurz + Cap in SCHMIDT-Blau mit rotem Streifen
    S("path", { d: "M-72,-104 Q-74,-176 0,-182 Q74,-176 72,-104 Q40,-130 0,-128 Q-40,-130 -72,-104 Z", fill: C.b1 }, h);
    S("path", { d: "M-72,-108 Q0,-126 98,-108 Q100,-96 86,-94 Q10,-112 -72,-98 Z", fill: C.blue }, h);
    S("path", { d: "M-60,-150 Q0,-160 60,-150", stroke: C.red, "stroke-width": 7, fill: "none" }, h);
    api(ch);
    poseApi(ch);
    ch.defaultMouth = "smile";
    return ch;
  }

  // ---------- Mücke ----------
  function makeMosquito(parent, o) {
    o = o || {};
    const ch = { name: "mosquito" };
    const root = G(parent, { x: o.x || 0, y: o.y || 0 });
    ch.root = root;
    const base = S("g", { transform: `scale(${o.s || 1})` }, root);
    ch.base = base; // Flugbahn
    ch.flip = G(base, {}); // scaleX -1 = schaut nach links
    ch.bob = G(ch.flip, {}); // Schwebe-Wackeln
    const b = ch.bob;
    const tone = o.tone || C.b3;
    // Beine
    const legs = S("g", { stroke: C.ink, "stroke-width": 2.6, fill: "none", "stroke-linecap": "round" }, b);
    [[-8, 10, -18, 34, -26, 50], [2, 12, -2, 38, -8, 56], [10, 10, 18, 34, 22, 52]].forEach((p, i) => {
      S("path", { d: `M${p[0]},${p[1]} Q${p[2]},${p[3]} ${p[4]},${p[5]}` }, legs);
      S("path", { d: `M${p[0] + 4},${p[1]} Q${p[2] + 10},${p[3] - 6} ${p[4] + 14},${p[5] - 6}`, opacity: 0.6 }, legs);
    });
    // Hinterleib (gestreift)
    const abd = S("g", { transform: "rotate(-28 -10 0)" }, b);
    S("ellipse", { cx: -42, cy: 0, rx: 34, ry: 14, fill: tone }, abd);
    [-60, -48, -36, -24].forEach((x) => S("path", { d: `M${x},-12 q4,12 0,24`, stroke: C.b1, "stroke-width": 4, fill: "none", opacity: 0.6 }, abd));
    // Brust
    S("ellipse", { cx: 0, cy: 0, rx: 20, ry: 16, fill: tone }, b);
    // Flügel
    ch.wings = [];
    [[-6, -14, -24], [6, -14, 18]].forEach((w, i) => {
      const wg = G(b, { x: w[0], y: w[1] });
      S("ellipse", { cx: i ? 8 : -8, cy: -22, rx: 13, ry: 28, fill: C.b6, opacity: 0.78, stroke: C.b5, "stroke-width": 2, transform: `rotate(${w[2]})` }, wg);
      ch.wings.push(wg);
    });
    // Kopf
    const head = G(b, { x: 22, y: -8 });
    ch.head = head;
    S("circle", { cx: 0, cy: 0, r: 17, fill: tone }, head);
    S("path", { d: "M14,6 Q34,14 50,30", stroke: C.ink, "stroke-width": 3.2, fill: "none", "stroke-linecap": "round" }, head); // Rüssel
    ch.face = face(head, {
      eyeDX: 9, eyeY: -4, eyeRX: 9, eyeRY: 11, pupil: 5, lid: 2.2,
      browY: -18, browW: 7, browC: C.ink, browSW: 3.4,
      mouthY: 9, mouthS: 0.42,
    });
    ch.face.group._wrap.setAttribute("transform", "translate(3,0)");
    if (o.antenna !== false) {
      S("path", { d: "M-4,-15 q-6,-14 -16,-18 M6,-15 q4,-14 12,-20", stroke: C.ink, "stroke-width": 2.4, fill: "none", "stroke-linecap": "round" }, head);
    }
    api(ch);
    ch.defaultMouth = o.mouth || "smirk";
    // Flügelschlag über ein Zeitfenster (schnell, deterministisch)
    ch.buzz = function (tl, t0, t1) {
      const per = 0.066;
      const n = Math.max(1, Math.round((t1 - t0) / per));
      tl.fromTo(ch.wings, Object.assign({ scaleY: 1 }, O0), Object.assign({ scaleY: 0.25, duration: per / 2, ease: "sine.inOut", yoyo: true, repeat: n * 2 - 1 }, O0), t0);
      return ch;
    };
    ch.hover = function (tl, t0, t1, seed, amp) {
      const r = rng(seed || 3);
      let t = t0;
      const a = amp || 7;
      while (t < t1 - 0.2) {
        const d = 0.35 + r() * 0.3;
        tl.to(ch.bob, { x: (r() - 0.5) * a, y: (r() - 0.5) * a * 1.4, rotation: (r() - 0.5) * 10, transformOrigin: "50% 50%", duration: d, ease: "sine.inOut" }, t);
        t += d;
      }
      return ch;
    };
    ch.face_ = function (tl, t, dir) {
      if (t <= 0.0001) gsap.set(ch.flip, Object.assign({ scaleX: dir }, O0));
      else tl.to(ch.flip, Object.assign({ scaleX: dir, duration: 0.12, ease: "power2.inOut" }, O0), t);
      return ch;
    };
    return ch;
  }

  // ---------- Kind auf rotem Bobbycar (Seitenansicht, fährt nach rechts) ----------
  function makeKid(parent, o) {
    o = o || {};
    const ch = { name: "kid" };
    const root = G(parent, { x: o.x || 0, y: o.y || 0 });
    ch.root = root;
    const base = S("g", { transform: `scale(${o.s || 1})` }, root);
    ch.base = base;
    S("ellipse", { cx: 0, cy: 0, rx: 110, ry: 12, fill: C.blue, opacity: 0.16 }, base);
    ch.bounce = G(base, {});
    const b = ch.bounce;
    ch.wheels = [];
    // Bobbycar
    S("path", { d: "M-100,-46 Q-104,-92 -60,-96 L40,-96 Q70,-96 86,-70 L104,-50 Q108,-34 92,-30 L-90,-30 Q-102,-30 -100,-46 Z", fill: C.red }, b);
    S("path", { d: "M-60,-96 L40,-96 Q58,-96 70,-84 L-70,-84 Q-70,-96 -60,-96 Z", fill: "#fff", opacity: 0.25 }, b);
    S("path", { d: "M52,-92 L66,-138", stroke: C.an1, "stroke-width": 8, "stroke-linecap": "round" }, b);
    S("ellipse", { cx: 66, cy: -140, rx: 22, ry: 7, fill: C.an1, transform: "rotate(-20 66 -140)" }, b);
    [-62, 64].forEach((x) => {
      const w = G(b, { x, y: -26 });
      S("circle", { cx: 0, cy: 0, r: 25, fill: C.an1 }, w);
      S("circle", { cx: 0, cy: 0, r: 10, fill: C.b5 }, w);
      S("rect", { x: -2.5, y: -22, width: 5, height: 12, fill: C.b5 }, w);
      ch.wheels.push(w);
    });
    // Kind
    S("path", { d: "M-30,-96 Q-32,-150 -6,-170 Q22,-170 28,-150 L30,-100 Z", fill: C.b2 }, b); // Shirt
    S("path", { d: "M-28,-100 Q10,-104 34,-96 L60,-60", stroke: C.b1, "stroke-width": 22, fill: "none", "stroke-linecap": "round" }, b); // Bein
    S("path", { d: "M60,-60 l14,0", stroke: C.yellow, "stroke-width": 16, "stroke-linecap": "round" }, b); // Schuh
    S("path", { d: "M0,-156 Q30,-150 58,-140", stroke: C.skin1, "stroke-width": 15, fill: "none", "stroke-linecap": "round" }, b); // Arm
    ch.head = G(b, { x: 0, y: -172 });
    const h = ch.head;
    S("circle", { cx: 0, cy: -50, r: 52, fill: C.skin1 }, h);
    ch.hair = S("path", { d: "M-50,-56 Q-52,-110 2,-108 Q44,-106 50,-70 Q30,-86 6,-84 Q-24,-84 -36,-60 Q-40,-50 -50,-56 Z", fill: C.hair2 }, h);
    S("ellipse", { cx: -50, cy: -48, rx: 10, ry: 13, fill: C.skin2 }, h);
    ch.face = face(h, {
      eyeDX: 14, eyeY: -52, eyeRX: 9, eyeRY: 11, pupil: 6, lid: 2.4,
      browY: -72, browW: 8, browC: C.hair2, browSW: 4.5,
      cheeks: true, cheekDX: 26, cheekY: -32, mouthY: -24, mouthS: 0.8,
    });
    ch.face.group._wrap.setAttribute("transform", "translate(18,0)");
    api(ch);
    ch.defaultMouth = "grin";
    ch.roll = function (tl, t0, dur, dist) {
      tl.to(ch.wheels, Object.assign({ rotation: (dist / (2 * Math.PI * 25)) * 360, duration: dur, ease: "power1.inOut" }, O0), t0);
      return ch;
    };
    return ch;
  }

  // ---------- Opa mit Rollator (Seitenansicht, geht nach rechts) ----------
  function makeOpa(parent, o) {
    o = o || {};
    const ch = { name: "opa" };
    const root = G(parent, { x: o.x || 0, y: o.y || 0 });
    ch.root = root;
    const base = S("g", { transform: `scale(${o.s || 1})` }, root);
    ch.base = base;
    S("ellipse", { cx: 30, cy: 0, rx: 130, ry: 13, fill: C.blue, opacity: 0.16 }, base);
    ch.lean = G(base, {});
    ch.breath = G(ch.lean, {});
    const b = ch.breath;
    // Rollator
    const rol = S("g", null, b);
    ch.rwheels = [];
    S("path", { d: "M70,-6 L96,-250 M150,-6 L124,-250 M90,-150 L132,-150 M96,-250 L128,-250", stroke: C.an3, "stroke-width": 8, "stroke-linecap": "round", fill: "none" }, rol);
    S("rect", { x: 86, y: -168, width: 52, height: 30, rx: 6, fill: C.b2 }, rol);
    S("path", { d: "M92,-252 l-18,-6", stroke: C.an1, "stroke-width": 12, "stroke-linecap": "round" }, rol);
    [70, 150].forEach((x) => {
      const w = G(rol, { x, y: -16 });
      S("circle", { cx: 0, cy: 0, r: 16, fill: C.an1 }, w);
      S("rect", { x: -2, y: -13, width: 4, height: 8, fill: C.b5 }, w);
      ch.rwheels.push(w);
    });
    const leg = (side, col) => {
      const l = limb(b, { x: side * 6, y: -232, l1: 112, l2: 104, w: 30, c: col });
      S("path", { d: "M-14,-8 q-4,-2 -4,6 v6 h44 v-4 q0,-10 -14,-10 z", fill: C.an1 }, l.h);
      return l;
    };
    ch.legL = leg(-1, C.an2);
    ch.legR = leg(1, C.an3);
    // Strickjacke
    S("path", { d: "M-40,-452 Q0,-470 34,-452 C54,-380 52,-300 46,-222 Q0,-206 -44,-222 C-50,-300 -52,-380 -40,-452 Z", fill: C.b3, transform: "rotate(8 0 -230)" }, b);
    S("path", { d: "M10,-452 L18,-226", stroke: C.b1, "stroke-width": 4, transform: "rotate(8 0 -230)" }, b);
    ch.armR = limb(b, { x: 14, y: -430, l1: 96, l2: 84, w: 26, c: C.b3 });
    hand(ch.armR.h, C.skin1, 15, 1);
    ch.head = G(b, { x: 22, y: -462 });
    const h = ch.head;
    S("circle", { cx: 0, cy: -66, r: 64, fill: C.skin1 }, h);
    S("ellipse", { cx: -38, cy: -60, rx: 13, ry: 17, fill: C.skin2 }, h);
    S("path", { d: "M-62,-74 Q-70,-118 -40,-130 Q-48,-100 -44,-80 Z", fill: C.hair3 }, h);
    S("path", { d: "M-30,-128 Q10,-140 40,-118", stroke: C.hair3, "stroke-width": 9, fill: "none", "stroke-linecap": "round" }, h);
    ch.face = face(h, {
      eyeDX: 16, eyeY: -70, eyeRX: 10, eyeRY: 11, pupil: 6, lid: 2.6,
      browY: -92, browW: 11, browC: C.hair3, browSW: 7,
      nose: "M30,-62 q12,10 -2,16", noseC: C.skin3, cheeks: true, cheekDX: 30, cheekY: -44,
      mouthY: -30, mouthS: 0.8,
    });
    ch.face.group._wrap.setAttribute("transform", "translate(16,0)");
    // Brille
    S("path", { d: "M8,-70 a14,13 0 1,0 0.1,0 M40,-70 a14,13 0 1,0 0.1,0 M22,-72 h4", stroke: C.an1, "stroke-width": 3, fill: "none", transform: "translate(-2,0)" }, h);
    // Schnurrbart
    S("path", { d: "M16,-40 Q32,-50 48,-40 Q32,-34 16,-40 Z", fill: C.hair3 }, h);
    api(ch);
    poseApi(ch);
    ch.defaultMouth = "smile";
    return ch;
  }

  // ---------- Saugroboter (Seitenansicht mit Display-Gesicht) ----------
  function makeRobot(parent, o) {
    o = o || {};
    const ch = { name: "robot" };
    const root = G(parent, { x: o.x || 0, y: o.y || 0 });
    ch.root = root;
    const base = S("g", { transform: `scale(${o.s || 1})` }, root);
    ch.base = base;
    S("ellipse", { cx: 0, cy: 0, rx: 96, ry: 10, fill: C.blue, opacity: 0.18 }, base);
    ch.bounce = G(base, {});
    const b = ch.bounce;
    S("rect", { x: -90, y: -50, width: 180, height: 44, rx: 22, fill: C.b6 }, b);
    S("rect", { x: -90, y: -22, width: 180, height: 16, rx: 8, fill: C.b4 }, b);
    S("rect", { x: -40, y: -66, width: 80, height: 20, rx: 10, fill: C.an2 }, b);
    // Display-Gesicht
    ch.eyes = [];
    [-14, 14].forEach((x) => ch.eyes.push(S("rect", { x: x - 4, y: -62, width: 8, height: 11, rx: 4, fill: "#7fe0ff" }, b)));
    ch.smile = S("path", { d: "M-8,-52 Q0,-47 8,-52", stroke: "#7fe0ff", "stroke-width": 2.6, fill: "none", "stroke-linecap": "round" }, b);
    ch.led = S("circle", { cx: 70, cy: -36, r: 5, fill: "#7fe0ff" }, b);
    // Bürste vorne
    ch.brush = G(b, { x: 84, y: -6 });
    for (let i = 0; i < 6; i++) S("line", { x1: 0, y1: 0, x2: 16, y2: 0, stroke: C.an3, "stroke-width": 3, transform: `rotate(${i * 60})`, "stroke-linecap": "round" }, ch.brush);
    ch.spin = function (tl, t0, dur) {
      tl.to(ch.brush, Object.assign({ rotation: 360 * Math.round(dur * 3), duration: dur, ease: "none" }, O0), t0);
      return ch;
    };
    return ch;
  }

  window.CHAR = { makeAnna, makeBen, makeMosquito, makeKid, makeOpa, makeRobot, face, limb, hand, BROWS, O0 };
})();
