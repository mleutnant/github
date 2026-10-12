// Kleine SVG-Helfer + Palette. Alles synchron, deterministisch.
(function () {
  const NS = "http://www.w3.org/2000/svg";

  // S("rect", {x:0, ...}, parent) — legt ein SVG-Element an und hängt es an.
  function S(tag, attrs, parent) {
    const el = document.createElementNS(NS, tag);
    if (attrs) for (const k in attrs) if (attrs[k] !== undefined && attrs[k] !== null) el.setAttribute(k, attrs[k]);
    if (parent) parent.appendChild(el);
    return el;
  }

  // Statischer Wrapper (translate/rotate/scale als Attribut) + innerer, animierbarer Knoten.
  // GSAP animiert nur den inneren Knoten -> Drehpunkt ist immer dessen Ursprung (svgOrigin "0 0").
  function G(parent, o) {
    o = o || {};
    const tr = [];
    if (o.x || o.y) tr.push(`translate(${o.x || 0},${o.y || 0})`);
    if (o.rot) tr.push(`rotate(${o.rot})`);
    if (o.s !== undefined && o.s !== 1) tr.push(`scale(${o.s})`);
    const wrap = S("g", tr.length ? { transform: tr.join(" ") } : null, parent);
    if (o.cls) wrap.setAttribute("class", o.cls);
    if (o.id) wrap.setAttribute("id", o.id);
    const inner = S("g", null, wrap);
    inner._wrap = wrap;
    return inner;
  }

  // Seeded PRNG (mulberry32) — nie Math.random.
  function rng(seed) {
    let a = seed >>> 0;
    return function () {
      a |= 0; a = (a + 0x6d2b79f5) | 0;
      let t = Math.imul(a ^ (a >>> 15), 1 | a);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  const C = {
    blue: "#123442", red: "#e3002c", yellow: "#f6a206", white: "#ffffff", black: "#000000",
    b1: "#1d4557", b2: "#2c5a6e", b3: "#4b6f80", b4: "#7d9aa7", b5: "#b9cad1", b6: "#e3ebee",
    y1: "#f8b73a", y2: "#fbd27f", y3: "#fde6b5", y4: "#fff4dc", yDark: "#d98a05",
    cream: "#f7f1e6", cream2: "#efe5d3", cream3: "#e2d3bb",
    oak1: "#a9632c", oak2: "#c47e3f", oak3: "#dba468",
    an1: "#2f353a", an2: "#3a4147", an3: "#566069",
    g1: "#3f6b5c", g2: "#5a8a72", g3: "#86ae8f", g4: "#b5d0b0",
    skin1: "#f1c39d", skin2: "#dd9f74", skin3: "#a86c48", cheek: "#ef8f86",
    hair1: "#5a2e1e", hair2: "#2b2421", hair3: "#d9d4cc",
    ink: "#1d2a31", mouth: "#7a2a33", tongue: "#e2706f",
  };

  // Bildformat (Querformat Standard; vertical.html setzt window.FORMAT = {W:1080,H:1920})
  const F = window.FORMAT || { W: 1920, H: 1080 };
  F.portrait = F.H > F.W;
  window.FORMAT = F;

  window.SVGK = { S, G, rng, C, NS, F };
})();
