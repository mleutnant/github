// Wortgenaue Untertitel (eingebrannt) für die Social-Fassung.
// Zeilen à max. ~20 Zeichen, Umbruch an Satzzeichen; das gesprochene Wort bekommt einen gelben Marker.
(function () {
  const tl = window.MASTER_TL;
  const T = window.TIMING;
  const F = window.FORMAT;
  const host = document.getElementById("captions");
  if (!tl || !T || !host) return;

  const css = document.createElement("style");
  css.textContent = `
    #captions { position:absolute; left:0; right:0; top:0; height:${F.H}px; pointer-events:none; }
    .cap { position:absolute; left:50%; bottom:${F.portrait ? 392 : 70}px; transform:translateX(-50%); width:max-content; max-width:${F.portrait ? 940 : 1500}px;
      display:flex; flex-wrap:wrap; justify-content:center; gap:4px 14px; padding:14px 26px 18px; background:rgba(18,52,66,.92);
      opacity:0; white-space:nowrap; }
    .cap .cw { font-weight:800; font-size:${F.portrait ? 60 : 48}px; line-height:1.12; color:#fff; padding:0 8px; border-radius:6px; }
  `;
  document.head.appendChild(css);

  const MAXC = F.portrait ? 20 : 34;
  const groups = [];
  T.segments.forEach((s) => {
    let cur = [];
    let len = 0;
    s.words.forEach((w, i) => {
      if (/^[–-]$/.test(w.w)) return; // Gedankenstrich wird nicht gesprochen
      const add = w.w.length + (cur.length ? 1 : 0);
      if (cur.length && len + add > MAXC) { groups.push(cur); cur = []; len = 0; }
      cur.push(w);
      len += add;
      const brk = /[.?!:]$/.test(w.w) || (/[,]$/.test(w.w) && len > MAXC * 0.55);
      if (brk) { groups.push(cur); cur = []; len = 0; }
    });
    if (cur.length) groups.push(cur);
  });

  groups.forEach((g, gi) => {
    const el = document.createElement("div");
    el.className = "cap";
    const spans = g.map((w) => {
      const sp = document.createElement("span");
      sp.className = "cw";
      sp.textContent = w.w;
      el.appendChild(sp);
      return sp;
    });
    host.appendChild(el);
    const t0 = g[0].s - 0.06;
    const next = groups[gi + 1];
    const tEnd = Math.min(g[g.length - 1].e + 0.45, next ? next[0].s - 0.08 : g[g.length - 1].e + 0.8);
    tl.fromTo(el, { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.16, ease: "power2.out" }, t0);
    tl.to(el, { opacity: 0, duration: 0.1, ease: "power1.in" }, tEnd);
    tl.set(el, { visibility: "hidden" }, tEnd + 0.12);
    g.forEach((w, i) => {
      const off = i + 1 < g.length ? g[i + 1].s : w.e + 0.05;
      tl.set(spans[i], { backgroundColor: "#f6a206", color: "#123442" }, w.s);
      tl.set(spans[i], { backgroundColor: "rgba(0,0,0,0)", color: "#ffffff" }, off);
    });
  });
  window.CAPTION_GROUPS = groups.length;
})();
