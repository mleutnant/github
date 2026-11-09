// Sprachumschaltung (nur wenn lang/<xx>.js geladen ist und nicht Deutsch):
// Bildtexte werden beim Setzen übersetzt (innerHTML/textContent → exakter Treffer im Wörterbuch),
// damit Szenen, die Texte messen, schon die übersetzte Länge sehen. Wort-Anker übersetzt main.js (ctx.w).
(function () {
  const I = window.I18N;
  if (!I || I.lang === "de") return;
  const map = I.text || {};
  const tr = (s) => {
    const t = s.trim();
    if (!t || !Object.prototype.hasOwnProperty.call(map, t)) return s;
    const i = s.indexOf(t);
    return s.slice(0, i) + map[t] + s.slice(i + t.length);
  };
  const skip = (n) => n.nodeName === "STYLE" || n.nodeName === "SCRIPT" || n.nodeName === "style";
  function walk(node) {
    if (node.nodeType === 3) {
      const v = tr(node.nodeValue);
      if (v !== node.nodeValue) node.nodeValue = v;
      return;
    }
    if (skip(node)) return;
    for (const c of node.childNodes) walk(c);
  }
  const ih = Object.getOwnPropertyDescriptor(Element.prototype, "innerHTML");
  Object.defineProperty(Element.prototype, "innerHTML", {
    configurable: true, get: ih.get,
    set(v) { ih.set.call(this, v); if (!skip(this)) walk(this); },
  });
  const tc = Object.getOwnPropertyDescriptor(Node.prototype, "textContent");
  Object.defineProperty(Node.prototype, "textContent", {
    configurable: true, get: tc.get,
    set(v) { tc.set.call(this, v); if (!skip(this)) walk(this); },
  });
  I.tr = tr;
  I.phrase = (s) => (I.phrases && I.phrases[s]) || s;
})();
