/* @ds-bundle: {"format":4,"namespace":"SCHMIDTDesignSystem_b5cc27","components":[{"name":"BulletList","sourcePath":"components/content/BulletList.jsx"},{"name":"FeatureIcon","sourcePath":"components/content/FeatureIcon.jsx"},{"name":"ImageOverlay","sourcePath":"components/content/ImageOverlay.jsx"},{"name":"NewsCard","sourcePath":"components/content/NewsCard.jsx"},{"name":"PullQuote","sourcePath":"components/content/PullQuote.jsx"},{"name":"SectionHeading","sourcePath":"components/content/SectionHeading.jsx"},{"name":"StatBlock","sourcePath":"components/content/StatBlock.jsx"},{"name":"Button","sourcePath":"components/core/Button.jsx"},{"name":"FrameBox","sourcePath":"components/core/FrameBox.jsx"},{"name":"Icon","sourcePath":"components/core/Icon.jsx"},{"name":"Logo","sourcePath":"components/core/Logo.jsx"},{"name":"Rule","sourcePath":"components/core/Rule.jsx"},{"name":"ICON_NAMES","sourcePath":"components/core/assets.js"},{"name":"Checkbox","sourcePath":"components/forms/Checkbox.jsx"},{"name":"Input","sourcePath":"components/forms/Input.jsx"},{"name":"RadioGroup","sourcePath":"components/forms/RadioGroup.jsx"},{"name":"Select","sourcePath":"components/forms/Select.jsx"},{"name":"SideRail","sourcePath":"components/navigation/SideRail.jsx"},{"name":"SiteFooter","sourcePath":"components/navigation/SiteFooter.jsx"},{"name":"SiteHeader","sourcePath":"components/navigation/SiteHeader.jsx"}],"sourceHashes":{"components/content/BulletList.jsx":"75763488f1f7","components/content/FeatureIcon.jsx":"dc99b66948e2","components/content/ImageOverlay.jsx":"0202669e2833","components/content/NewsCard.jsx":"e0728e07955d","components/content/PullQuote.jsx":"ebff1f27b896","components/content/SectionHeading.jsx":"eb2b1297e391","components/content/StatBlock.jsx":"362884974418","components/core/Button.jsx":"bd39394bdce2","components/core/FrameBox.jsx":"b09c2b32a142","components/core/Icon.jsx":"34ae3f4bec70","components/core/Logo.jsx":"f2a64f179908","components/core/Rule.jsx":"376842908da2","components/core/assets.js":"f3a79e11457b","components/forms/Checkbox.jsx":"f2b773c49cef","components/forms/Input.jsx":"a01b799534ae","components/forms/RadioGroup.jsx":"b464930d1033","components/forms/Select.jsx":"aafdbfd31ad9","components/navigation/SideRail.jsx":"ce0f38b01653","components/navigation/SiteFooter.jsx":"602f5bf2a5de","components/navigation/SiteHeader.jsx":"f9603632c84f","ui_kits/website/App.jsx":"6f3c4646ec97","ui_kits/website/Home.jsx":"f03c4ddf706d","ui_kits/website/Kontakt.jsx":"5e2881f321d0","ui_kits/website/Produkte.jsx":"cd2bbd5b22e4","ui_kits/website/Referenzen.jsx":"876199e12708"},"inlinedExternals":[],"unexposedExports":[{"name":"assetBase","sourcePath":"components/core/assets.js"},{"name":"iconUrl","sourcePath":"components/core/assets.js"}]} */

(() => {

const __ds_ns = (window.SCHMIDTDesignSystem_b5cc27 = window.SCHMIDTDesignSystem_b5cc27 || {});

const __ds_scope = {};

(__ds_ns.__errors = __ds_ns.__errors || []);

// components/content/BulletList.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function BulletList({
  items = [],
  level = 1,
  tone = 'ink',
  columns = 1,
  style,
  ...rest
}) {
  const color = tone === 'on-blue' ? 'var(--text-on-blue)' : 'var(--text-primary)';
  const marker = tone === 'on-blue' ? 'var(--sch-white)' : 'var(--sch-black)';
  return /*#__PURE__*/React.createElement("ul", _extends({
    style: {
      listStyle: 'none',
      margin: 0,
      padding: 0,
      color,
      columns: columns > 1 ? columns : 'auto',
      columnGap: 'var(--space-7)',
      ...style
    }
  }, rest), items.map((item, i) => /*#__PURE__*/React.createElement("li", {
    key: i,
    style: {
      position: 'relative',
      paddingLeft: level === 1 ? 'var(--space-4)' : 'var(--space-5)',
      marginBottom: 'var(--space-3)',
      breakInside: 'avoid',
      fontSize: level === 1 ? 'var(--fs-body)' : 'var(--fs-side)'
    }
  }, /*#__PURE__*/React.createElement("span", {
    "aria-hidden": "true",
    style: level === 1 ? {
      position: 'absolute',
      left: 0,
      top: '0.28em',
      width: 'var(--rule-body)',
      height: '1.05em',
      background: marker
    } : {
      position: 'absolute',
      left: 'var(--space-2)',
      top: '0.5em',
      width: 'var(--bullet-square)',
      height: 'var(--bullet-square)',
      background: marker
    }
  }), item)));
}
Object.assign(__ds_scope, { BulletList });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/content/BulletList.jsx", error: String((e && e.message) || e) }); }

// components/content/ImageOverlay.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/** Prinzip 2: two images overlaid with "negativ multiplizieren" (screen), in analogy to panes of glass. */
function ImageOverlay({
  base,
  overlay,
  ratio = '16 / 9',
  offset = '18%',
  blend = 'screen',
  style,
  ...rest
}) {
  return /*#__PURE__*/React.createElement("div", _extends({
    style: {
      position: 'relative',
      aspectRatio: ratio,
      overflow: 'hidden',
      background: 'var(--sch-blue)',
      ...style
    }
  }, rest), /*#__PURE__*/React.createElement("img", {
    src: base,
    alt: "",
    style: {
      position: 'absolute',
      inset: 0,
      width: '100%',
      height: '100%',
      objectFit: 'cover'
    }
  }), /*#__PURE__*/React.createElement("img", {
    src: overlay,
    alt: "",
    style: {
      position: 'absolute',
      top: 0,
      bottom: 0,
      left: offset,
      width: '100%',
      height: '100%',
      objectFit: 'cover',
      mixBlendMode: blend,
      opacity: 0.95
    }
  }));
}
Object.assign(__ds_scope, { ImageOverlay });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/content/ImageOverlay.jsx", error: String((e && e.message) || e) }); }

// components/content/NewsCard.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function NewsCard({
  image,
  kicker,
  title,
  text,
  href,
  cta = 'Weiterlesen',
  style,
  ...rest
}) {
  const [hover, setHover] = React.useState(false);
  return /*#__PURE__*/React.createElement("a", _extends({
    href: href,
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => setHover(false),
    style: {
      display: 'block',
      background: 'var(--surface-page)',
      color: 'var(--text-primary)',
      textDecoration: 'none',
      borderRadius: 'var(--radius)',
      boxShadow: hover ? 'var(--shadow-raised)' : 'var(--shadow-card)',
      transition: 'box-shadow var(--dur) var(--ease)',
      ...style
    }
  }, rest), image ? /*#__PURE__*/React.createElement("div", {
    style: {
      overflow: 'hidden'
    }
  }, /*#__PURE__*/React.createElement("img", {
    src: image,
    alt: "",
    style: {
      width: '100%',
      aspectRatio: '16 / 10',
      objectFit: 'cover',
      transform: hover ? 'scale(1.03)' : 'none',
      transition: 'transform var(--dur-slow) var(--ease)'
    }
  })) : null, /*#__PURE__*/React.createElement("div", {
    style: {
      padding: 'var(--space-5)'
    }
  }, kicker ? /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 'var(--fs-eyebrow)',
      fontWeight: 'var(--fw-bold)',
      letterSpacing: 'var(--tracking-eyebrow)',
      textTransform: 'uppercase',
      color: 'var(--sch-red)',
      marginBottom: 'var(--space-2)'
    }
  }, kicker) : null, /*#__PURE__*/React.createElement("h3", {
    style: {
      fontSize: 'var(--fs-h4)',
      marginBottom: 'var(--space-3)'
    }
  }, title), text ? /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: 'var(--fs-side)',
      lineHeight: 'var(--lh-side)',
      margin: 0,
      color: 'var(--text-primary)'
    }
  }, text) : null, /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'inline-block',
      marginTop: 'var(--space-4)',
      fontWeight: 'var(--fw-bold)',
      fontSize: 'var(--fs-caption)',
      color: hover ? 'var(--sch-red-hover)' : 'var(--sch-red)'
    }
  }, cta)));
}
Object.assign(__ds_scope, { NewsCard });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/content/NewsCard.jsx", error: String((e && e.message) || e) }); }

// components/content/PullQuote.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function PullQuote({
  quote,
  author,
  role,
  tone = 'ink',
  size = 'md',
  style,
  ...rest
}) {
  const onBlue = tone === 'on-blue';
  const fs = size === 'lg' ? 'var(--fs-h1)' : size === 'sm' ? 'var(--fs-h3)' : 'var(--fs-h2)';
  return /*#__PURE__*/React.createElement("figure", _extends({
    style: {
      margin: 0,
      ...style
    }
  }, rest), /*#__PURE__*/React.createElement("blockquote", {
    style: {
      margin: 0,
      fontSize: fs,
      fontWeight: 'var(--fw-bold)',
      lineHeight: 'var(--lh-title)',
      letterSpacing: 'var(--tracking-title)',
      color: onBlue ? 'var(--text-on-blue)' : 'var(--text-heading)',
      hyphens: 'auto'
    }
  }, '\u201E', quote, '\u201C'), author || role ? /*#__PURE__*/React.createElement("figcaption", {
    style: {
      marginTop: 'var(--space-4)',
      fontSize: 'var(--fs-side)',
      lineHeight: 'var(--lh-side)',
      color: onBlue ? 'rgba(255,255,255,.9)' : 'var(--text-muted)'
    }
  }, author ? /*#__PURE__*/React.createElement("span", {
    style: {
      fontWeight: 'var(--fw-medium)',
      color: onBlue ? 'var(--sch-white)' : 'var(--text-primary)'
    }
  }, author) : null, role ? /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'block'
    }
  }, role) : null) : null);
}
Object.assign(__ds_scope, { PullQuote });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/content/PullQuote.jsx", error: String((e && e.message) || e) }); }

// components/content/StatBlock.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function StatBlock({
  value,
  label,
  tone = 'ink',
  style,
  ...rest
}) {
  const onBlue = tone === 'on-blue';
  return /*#__PURE__*/React.createElement("div", _extends({
    style: {
      ...style
    }
  }, rest), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 'var(--fs-h1)',
      fontWeight: 'var(--fw-bold)',
      lineHeight: 'var(--lh-title)',
      letterSpacing: 'var(--tracking-title)',
      color: onBlue ? 'var(--sch-white)' : 'var(--text-heading)'
    }
  }, value), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 'var(--space-2)',
      fontSize: 'var(--fs-side)',
      fontWeight: 'var(--fw-regular)',
      lineHeight: 'var(--lh-side)',
      color: onBlue ? 'rgba(255,255,255,.9)' : 'var(--text-muted)',
      maxWidth: '18ch'
    }
  }, label));
}
Object.assign(__ds_scope, { StatBlock });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/content/StatBlock.jsx", error: String((e && e.message) || e) }); }

// components/core/Button.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const SIZES = {
  sm: {
    padding: '8px 16px',
    fontSize: 'var(--fs-caption)'
  },
  md: {
    padding: '12px 24px',
    fontSize: 'var(--fs-body)'
  },
  lg: {
    padding: '16px 32px',
    fontSize: 'var(--fs-body-lg)'
  }
};
const VARIANTS = {
  primary: {
    background: 'var(--surface-brand)',
    color: 'var(--text-on-red)',
    border: '2px solid var(--surface-brand)'
  },
  secondary: {
    background: 'var(--surface-inverse)',
    color: 'var(--text-on-blue)',
    border: '2px solid var(--surface-inverse)'
  },
  outline: {
    background: 'transparent',
    color: 'var(--sch-blue)',
    border: '2px solid var(--sch-blue)'
  },
  quiet: {
    background: 'transparent',
    color: 'var(--sch-red)',
    border: '2px solid transparent',
    padding: '4px 0'
  }
};
const HOVER = {
  primary: {
    background: 'var(--sch-red-hover)',
    borderColor: 'var(--sch-red-hover)'
  },
  secondary: {
    background: 'var(--sch-blue-90)',
    borderColor: 'var(--sch-blue-90)'
  },
  outline: {
    background: 'var(--sch-blue)',
    color: 'var(--text-on-blue)'
  },
  quiet: {
    color: 'var(--sch-red-hover)'
  }
};
function Button({
  children,
  variant = 'primary',
  size = 'md',
  disabled = false,
  onBlue = false,
  as = 'button',
  href,
  onClick,
  style,
  ...rest
}) {
  const [hover, setHover] = React.useState(false);
  const [down, setDown] = React.useState(false);
  const Tag = href ? 'a' : as;
  const base = VARIANTS[variant] || VARIANTS.primary;
  const onBlueFix = onBlue && variant === 'outline' ? {
    color: 'var(--text-on-blue)',
    borderColor: 'var(--sch-white)'
  } : null;
  return /*#__PURE__*/React.createElement(Tag, _extends({
    href: href,
    onClick: disabled ? undefined : onClick,
    disabled: Tag === 'button' ? disabled : undefined,
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => {
      setHover(false);
      setDown(false);
    },
    onMouseDown: () => setDown(true),
    onMouseUp: () => setDown(false),
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 'var(--space-2)',
      fontFamily: 'var(--font-core)',
      fontWeight: 'var(--fw-bold)',
      lineHeight: 1.15,
      borderRadius: 'var(--radius)',
      cursor: disabled ? 'not-allowed' : 'pointer',
      textDecoration: 'none',
      letterSpacing: '0',
      transition: 'background var(--dur-fast) var(--ease), color var(--dur-fast) var(--ease), border-color var(--dur-fast) var(--ease), transform var(--dur-fast) var(--ease)',
      ...SIZES[size],
      ...base,
      ...onBlueFix,
      ...(hover && !disabled ? onBlue && variant === 'outline' ? {
        background: 'var(--sch-white)',
        color: 'var(--sch-blue)'
      } : HOVER[variant] : null),
      transform: down && !disabled ? 'translateY(1px)' : 'none',
      opacity: disabled ? 0.4 : 1,
      ...style
    }
  }, rest), children);
}
Object.assign(__ds_scope, { Button });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Button.jsx", error: String((e && e.message) || e) }); }

// components/core/FrameBox.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const SURFACES = {
  blue: 'var(--surface-inverse)',
  white: 'var(--surface-page)',
  subtle: 'var(--surface-subtle)',
  none: 'transparent'
};
const FRAMES = {
  red: 'var(--frame-red)',
  yellow: 'var(--frame-yellow)',
  blue: 'var(--frame-blue)'
};

/** Prinzip 1: a surface overlaid by a frame; at the crossing point a gap appears. */
function FrameBox({
  children,
  surface = 'blue',
  frame = 'yellow',
  corner = 'bottom-right',
  inset = 28,
  weight,
  image,
  minHeight = 260,
  style,
  contentStyle,
  ...rest
}) {
  const w = weight || 'var(--frame-weight)';
  const vertical = corner.includes('right') ? {
    right: 0
  } : {
    left: 0
  };
  const horizontal = corner.includes('bottom') ? {
    bottom: 0
  } : {
    top: 0
  };
  const px = typeof inset === 'number' ? inset + 'px' : inset;
  return /*#__PURE__*/React.createElement("div", _extends({
    style: {
      position: 'relative',
      ...style
    }
  }, rest), /*#__PURE__*/React.createElement("div", {
    style: {
      background: image ? `center/cover no-repeat url("${image}")` : SURFACES[surface] || surface,
      color: surface === 'blue' ? 'var(--text-on-blue)' : 'var(--text-primary)',
      minHeight: typeof minHeight === 'number' ? minHeight + 'px' : minHeight,
      marginRight: corner.includes('right') ? px : 0,
      marginLeft: corner.includes('left') ? px : 0,
      marginBottom: corner.includes('bottom') ? px : 0,
      marginTop: corner.includes('top') ? px : 0,
      padding: 'var(--space-6)',
      ...contentStyle
    }
  }, children), /*#__PURE__*/React.createElement("span", {
    "aria-hidden": "true",
    style: {
      position: 'absolute',
      ...vertical,
      ...horizontal,
      width: `calc(50% + ${px})`,
      height: w,
      background: FRAMES[frame] || frame
    }
  }), /*#__PURE__*/React.createElement("span", {
    "aria-hidden": "true",
    style: {
      position: 'absolute',
      ...vertical,
      ...horizontal,
      width: w,
      height: `calc(55% + ${px})`,
      background: FRAMES[frame] || frame
    }
  }));
}
Object.assign(__ds_scope, { FrameBox });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/FrameBox.jsx", error: String((e && e.message) || e) }); }

// components/core/Rule.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const COLORS = {
  red: 'var(--frame-red)',
  yellow: 'var(--frame-yellow)',
  blue: 'var(--frame-blue)',
  white: 'var(--sch-white)',
  ink: 'var(--sch-black)'
};
function Rule({
  color = 'red',
  weight = 'title',
  width = '100%',
  orientation = 'horizontal',
  length,
  style,
  ...rest
}) {
  const w = weight === 'title' ? 'var(--rule-title)' : weight === 'body' ? 'var(--rule-body)' : typeof weight === 'number' ? weight + 'px' : weight;
  const horizontal = orientation === 'horizontal';
  return /*#__PURE__*/React.createElement("span", _extends({
    "aria-hidden": "true",
    style: {
      display: 'block',
      background: COLORS[color] || color,
      width: horizontal ? width : w,
      height: horizontal ? w : length || '100%',
      ...style
    }
  }, rest));
}
Object.assign(__ds_scope, { Rule });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Rule.jsx", error: String((e && e.message) || e) }); }

// components/content/SectionHeading.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function SectionHeading({
  eyebrow,
  title,
  intro,
  level = 2,
  rule = 'red',
  ruleWidth = '96px',
  tone = 'ink',
  align = 'left',
  style,
  ...rest
}) {
  const H = 'h' + level;
  const onBlue = tone === 'on-blue';
  return /*#__PURE__*/React.createElement("header", _extends({
    style: {
      textAlign: align,
      ...style
    }
  }, rest), eyebrow ? /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 'var(--fs-eyebrow)',
      fontWeight: 'var(--fw-bold)',
      letterSpacing: 'var(--tracking-eyebrow)',
      textTransform: 'uppercase',
      color: onBlue ? 'var(--sch-yellow)' : 'var(--sch-red)',
      marginBottom: 'var(--space-3)'
    }
  }, eyebrow) : null, React.createElement(H, {
    style: {
      color: onBlue ? 'var(--text-on-blue)' : 'var(--text-heading)',
      margin: 0,
      maxWidth: '22ch'
    }
  }, title), rule ? /*#__PURE__*/React.createElement(__ds_scope.Rule, {
    color: onBlue && rule === 'red' ? 'yellow' : rule,
    width: ruleWidth,
    style: {
      marginTop: 'var(--space-4)',
      marginLeft: align === 'center' ? 'auto' : 0,
      marginRight: align === 'center' ? 'auto' : 0
    }
  }) : null, intro ? /*#__PURE__*/React.createElement("p", {
    style: {
      marginTop: 'var(--space-5)',
      marginBottom: 0,
      maxWidth: '62ch',
      color: onBlue ? 'rgba(255,255,255,.92)' : 'var(--text-primary)',
      fontSize: 'var(--fs-body-lg)'
    }
  }, intro) : null);
}
Object.assign(__ds_scope, { SectionHeading });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/content/SectionHeading.jsx", error: String((e && e.message) || e) }); }

// components/core/assets.js
try { (() => {
// Resolve brand asset URLs. Consumers may set window.SCHMIDT_ASSET_BASE (default "assets").
const assetBase = () => typeof window !== 'undefined' && window.SCHMIDT_ASSET_BASE || 'assets';
const iconUrl = name => `${assetBase()}/icons/${name}.png`;
const ICON_NAMES = ['barrierefrei', 'beratung', 'breite', 'kosteneffizienz', 'leichtlaeufig', 'montage', 'nullschwelle', 'profilsystem', 'regen', 'schalldaemmung', 'sicherheit', 'tablet-handy', 'thermostat', 'witterungsschutz', 'wohnkomfort', 'zusatzausstattung'];
Object.assign(__ds_scope, { assetBase, iconUrl, ICON_NAMES });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/assets.js", error: String((e && e.message) || e) }); }

// components/core/Icon.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const TONE = {
  ink: 'var(--icon-ink)',
  white: 'var(--icon-on-blue)',
  red: 'var(--icon-web-accent)',
  blue: 'var(--sch-blue)'
};
function Icon({
  name,
  size = 48,
  tone = 'ink',
  title,
  style,
  ...rest
}) {
  const url = __ds_scope.iconUrl(name);
  const px = typeof size === 'number' ? size + 'px' : size;
  return /*#__PURE__*/React.createElement("span", _extends({
    role: "img",
    "aria-label": title || name,
    title: title,
    style: {
      display: 'inline-block',
      width: px,
      height: px,
      backgroundColor: TONE[tone] || tone,
      WebkitMaskImage: `url("${url}")`,
      maskImage: `url("${url}")`,
      WebkitMaskRepeat: 'no-repeat',
      maskRepeat: 'no-repeat',
      WebkitMaskPosition: 'center',
      maskPosition: 'center',
      WebkitMaskSize: 'contain',
      maskSize: 'contain',
      flex: '0 0 auto',
      ...style
    }
  }, rest));
}
Object.assign(__ds_scope, { Icon });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Icon.jsx", error: String((e && e.message) || e) }); }

// components/content/FeatureIcon.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function FeatureIcon({
  name,
  label,
  size = 56,
  tone = 'ink',
  align = 'left',
  style,
  ...rest
}) {
  return /*#__PURE__*/React.createElement("div", _extends({
    style: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: align === 'center' ? 'center' : 'flex-start',
      gap: 'var(--space-3)',
      textAlign: align,
      ...style
    }
  }, rest), /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: name,
    size: size,
    tone: tone === 'on-blue' ? 'white' : tone
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 'var(--fs-caption)',
      fontWeight: 'var(--fw-medium)',
      lineHeight: 'var(--lh-caption)',
      color: tone === 'on-blue' ? 'var(--text-on-blue)' : 'var(--text-primary)',
      maxWidth: '16ch'
    }
  }, label));
}
Object.assign(__ds_scope, { FeatureIcon });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/content/FeatureIcon.jsx", error: String((e && e.message) || e) }); }

// components/core/Logo.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const FILTER = {
  positive: 'none',
  negative: 'brightness(0) invert(1)',
  mono: 'brightness(0)'
};
function Logo({
  variant = 'wordmark',
  theme = 'positive',
  height = 32,
  alt = 'SCHMIDT — Die Hebeschiebetür',
  clearspace = false,
  style,
  ...rest
}) {
  const file = variant === 'mark' ? 'bildmarke.png' : 'logo-schmidt.png';
  return /*#__PURE__*/React.createElement("img", _extends({
    src: `${__ds_scope.assetBase()}/${file}`,
    alt: alt,
    style: {
      height: typeof height === 'number' ? height + 'px' : height,
      width: 'auto',
      filter: FILTER[theme] || 'none',
      padding: clearspace ? `calc(${typeof height === 'number' ? height + 'px' : height} * 0.34)` : 0,
      ...style
    }
  }, rest));
}
Object.assign(__ds_scope, { Logo });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Logo.jsx", error: String((e && e.message) || e) }); }

// components/forms/Checkbox.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function Checkbox({
  label,
  checked = false,
  onChange,
  disabled,
  id,
  style,
  ...rest
}) {
  const fid = id || 'cb-' + String(label).toLowerCase().replace(/[^a-z0-9]+/g, '-');
  return /*#__PURE__*/React.createElement("label", {
    htmlFor: fid,
    style: {
      display: 'flex',
      gap: 'var(--space-3)',
      alignItems: 'flex-start',
      cursor: disabled ? 'not-allowed' : 'pointer',
      opacity: disabled ? .5 : 1,
      ...style
    }
  }, /*#__PURE__*/React.createElement("input", _extends({
    id: fid,
    type: "checkbox",
    checked: checked,
    onChange: onChange,
    disabled: disabled,
    style: {
      position: 'absolute',
      opacity: 0,
      width: 0,
      height: 0
    }
  }, rest)), /*#__PURE__*/React.createElement("span", {
    "aria-hidden": "true",
    style: {
      flex: '0 0 auto',
      width: 20,
      height: 20,
      marginTop: 2,
      border: '2px solid var(--sch-blue)',
      background: checked ? 'var(--sch-blue)' : 'transparent',
      display: 'grid',
      placeItems: 'center'
    }
  }, checked ? /*#__PURE__*/React.createElement("span", {
    style: {
      width: 8,
      height: 8,
      background: 'var(--sch-white)'
    }
  }) : null), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 'var(--fs-body)'
    }
  }, label));
}
Object.assign(__ds_scope, { Checkbox });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Checkbox.jsx", error: String((e && e.message) || e) }); }

// components/forms/Input.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const fieldBase = {
  fontFamily: 'var(--font-core)',
  fontSize: 'var(--fs-body)',
  fontWeight: 'var(--fw-medium)',
  color: 'var(--text-primary)',
  background: 'var(--surface-page)',
  border: '1px solid var(--sch-blue)',
  borderRadius: 'var(--radius)',
  padding: '12px 14px',
  width: '100%',
  lineHeight: 1.3,
  transition: 'border-color var(--dur-fast) var(--ease), box-shadow var(--dur-fast) var(--ease)'
};
function Input({
  label,
  id,
  type = 'text',
  hint,
  error,
  required = false,
  value,
  onChange,
  placeholder,
  disabled,
  style,
  ...rest
}) {
  const fid = id || 'in-' + (label || type).toString().toLowerCase().replace(/[^a-z0-9]+/g, '-');
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 'var(--space-2)',
      ...style
    }
  }, label ? /*#__PURE__*/React.createElement("label", {
    htmlFor: fid,
    style: {
      fontSize: 'var(--fs-caption)',
      fontWeight: 'var(--fw-bold)',
      color: 'var(--text-heading)'
    }
  }, label, required ? ' *' : '') : null, /*#__PURE__*/React.createElement("input", _extends({
    id: fid,
    type: type,
    value: value,
    onChange: onChange,
    placeholder: placeholder,
    disabled: disabled,
    required: required,
    style: {
      ...fieldBase,
      borderColor: error ? 'var(--sch-red)' : 'var(--sch-blue)',
      opacity: disabled ? .5 : 1
    }
  }, rest)), error ? /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 'var(--fs-caption)',
      color: 'var(--sch-red)'
    }
  }, error) : hint ? /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 'var(--fs-caption)',
      color: 'var(--text-muted)'
    }
  }, hint) : null);
}
Object.assign(__ds_scope, { Input });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Input.jsx", error: String((e && e.message) || e) }); }

// components/forms/RadioGroup.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function RadioGroup({
  legend,
  name,
  options = [],
  value,
  onChange,
  inline = false,
  style,
  ...rest
}) {
  return /*#__PURE__*/React.createElement("fieldset", _extends({
    style: {
      border: 0,
      margin: 0,
      padding: 0,
      ...style
    }
  }, rest), legend ? /*#__PURE__*/React.createElement("legend", {
    style: {
      padding: 0,
      marginBottom: 'var(--space-3)',
      fontSize: 'var(--fs-caption)',
      fontWeight: 'var(--fw-bold)',
      color: 'var(--text-heading)'
    }
  }, legend) : null, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: inline ? 'row' : 'column',
      gap: inline ? 'var(--space-6)' : 'var(--space-3)'
    }
  }, options.map(o => {
    const val = typeof o === 'string' ? o : o.value;
    const lab = typeof o === 'string' ? o : o.label;
    const on = value === val;
    return /*#__PURE__*/React.createElement("label", {
      key: val,
      style: {
        display: 'flex',
        gap: 'var(--space-3)',
        alignItems: 'center',
        cursor: 'pointer'
      }
    }, /*#__PURE__*/React.createElement("input", {
      type: "radio",
      name: name,
      value: val,
      checked: on,
      onChange: onChange,
      style: {
        position: 'absolute',
        opacity: 0,
        width: 0,
        height: 0
      }
    }), /*#__PURE__*/React.createElement("span", {
      "aria-hidden": "true",
      style: {
        flex: '0 0 auto',
        width: 20,
        height: 20,
        border: '2px solid var(--sch-blue)',
        borderRadius: '50%',
        display: 'grid',
        placeItems: 'center'
      }
    }, on ? /*#__PURE__*/React.createElement("span", {
      style: {
        width: 10,
        height: 10,
        borderRadius: '50%',
        background: 'var(--sch-red)'
      }
    }) : null), /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 'var(--fs-body)'
      }
    }, lab));
  })));
}
Object.assign(__ds_scope, { RadioGroup });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/RadioGroup.jsx", error: String((e && e.message) || e) }); }

// components/forms/Select.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const fieldBase = {
  fontFamily: 'var(--font-core)',
  fontSize: 'var(--fs-body)',
  fontWeight: 'var(--fw-medium)',
  color: 'var(--text-primary)',
  background: 'var(--surface-page)',
  border: '1px solid var(--sch-blue)',
  borderRadius: 'var(--radius)',
  padding: '12px 14px',
  width: '100%',
  lineHeight: 1.3,
  transition: 'border-color var(--dur-fast) var(--ease), box-shadow var(--dur-fast) var(--ease)'
};
function Select({
  label,
  id,
  options = [],
  value,
  onChange,
  hint,
  required = false,
  disabled,
  style,
  ...rest
}) {
  const fid = id || 'sel-' + (label || 'field').toString().toLowerCase().replace(/[^a-z0-9]+/g, '-');
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 'var(--space-2)',
      ...style
    }
  }, label ? /*#__PURE__*/React.createElement("label", {
    htmlFor: fid,
    style: {
      fontSize: 'var(--fs-caption)',
      fontWeight: 'var(--fw-bold)',
      color: 'var(--text-heading)'
    }
  }, label, required ? ' *' : '') : null, /*#__PURE__*/React.createElement("select", _extends({
    id: fid,
    value: value,
    onChange: onChange,
    disabled: disabled,
    required: required,
    style: {
      ...fieldBase,
      appearance: 'none',
      paddingRight: '40px',
      opacity: disabled ? .5 : 1,
      backgroundImage: 'linear-gradient(45deg, transparent 50%, var(--sch-blue) 50%), linear-gradient(135deg, var(--sch-blue) 50%, transparent 50%)',
      backgroundPosition: 'calc(100% - 20px) calc(50% + 2px), calc(100% - 14px) calc(50% + 2px)',
      backgroundSize: '6px 6px, 6px 6px',
      backgroundRepeat: 'no-repeat'
    }
  }, rest), options.map(o => typeof o === 'string' ? /*#__PURE__*/React.createElement("option", {
    key: o,
    value: o
  }, o) : /*#__PURE__*/React.createElement("option", {
    key: o.value,
    value: o.value
  }, o.label))), hint ? /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 'var(--fs-caption)',
      color: 'var(--text-muted)'
    }
  }, hint) : null);
}
Object.assign(__ds_scope, { Select });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Select.jsx", error: String((e && e.message) || e) }); }

// components/navigation/SideRail.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function SideRail({
  onContact,
  onTop,
  contactLabel = 'Kontakt',
  topLabel = 'Zum Seitenanfang',
  style,
  ...rest
}) {
  const btn = {
    width: 52,
    height: 52,
    display: 'grid',
    placeItems: 'center',
    border: 0,
    cursor: 'pointer',
    background: 'var(--sch-yellow)',
    borderRadius: 'var(--radius)',
    transition: 'background var(--dur-fast) var(--ease)'
  };
  return /*#__PURE__*/React.createElement("div", _extends({
    style: {
      position: 'absolute',
      right: 0,
      top: '30%',
      display: 'flex',
      flexDirection: 'column',
      gap: 2,
      zIndex: 15,
      ...style
    }
  }, rest), /*#__PURE__*/React.createElement("button", {
    "aria-label": contactLabel,
    title: contactLabel,
    onClick: onContact,
    onMouseEnter: e => e.currentTarget.style.background = 'var(--sch-yellow-hover)',
    onMouseLeave: e => e.currentTarget.style.background = 'var(--sch-yellow)',
    style: btn
  }, /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: "beratung",
    size: 26,
    tone: "ink"
  })), /*#__PURE__*/React.createElement("button", {
    "aria-label": topLabel,
    title: topLabel,
    onClick: onTop,
    onMouseEnter: e => e.currentTarget.style.background = 'var(--sch-yellow-hover)',
    onMouseLeave: e => e.currentTarget.style.background = 'var(--sch-yellow)',
    style: btn
  }, /*#__PURE__*/React.createElement("span", {
    "aria-hidden": "true",
    style: {
      width: 16,
      height: 16,
      borderTop: '3px solid var(--sch-black)',
      borderRight: '3px solid var(--sch-black)',
      transform: 'rotate(-45deg)',
      marginBottom: 4
    }
  })));
}
Object.assign(__ds_scope, { SideRail });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/navigation/SideRail.jsx", error: String((e && e.message) || e) }); }

// components/navigation/SiteFooter.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function SiteFooter({
  address = ['SCHMIDT GmbH', 'Töllen Linde 3', '33129 Delbrück-Boke, Deutschland'],
  phone = '+49 5250 9845-0',
  email = 'kontakt@schmidt-boke.de',
  legal = ['Impressum', 'Datenschutz', 'AGB', 'Hinweisgebersystem'],
  social = [],
  style,
  ...rest
}) {
  return /*#__PURE__*/React.createElement("footer", _extends({
    style: {
      background: 'var(--surface-inverse)',
      color: 'var(--text-on-blue)',
      ...style
    }
  }, rest), /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 'var(--container)',
      margin: '0 auto',
      padding: 'var(--space-8) var(--gutter)',
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
      gap: 'var(--space-7)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 'var(--fs-side)',
      lineHeight: 'var(--lh-body)'
    }
  }, address.map((l, i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    style: {
      fontWeight: i === 0 ? 'var(--fw-bold)' : 'var(--fw-regular)'
    }
  }, l)), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 'var(--space-3)'
    }
  }, "Telefon ", /*#__PURE__*/React.createElement("a", {
    href: 'tel:' + phone.replace(/\s/g, ''),
    style: {
      color: 'var(--sch-white)',
      textDecoration: 'underline',
      textUnderlineOffset: 3
    }
  }, phone)), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("a", {
    href: 'mailto:' + email,
    style: {
      color: 'var(--sch-white)',
      textDecoration: 'underline',
      textUnderlineOffset: 3
    }
  }, email))), /*#__PURE__*/React.createElement("nav", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 'var(--space-2)',
      fontSize: 'var(--fs-side)'
    }
  }, legal.map(l => /*#__PURE__*/React.createElement("a", {
    key: l,
    href: "#",
    style: {
      color: 'var(--sch-white)',
      textDecoration: 'none'
    }
  }, l))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 'var(--space-5)',
      alignItems: 'flex-start'
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.Logo, {
    theme: "negative",
    height: 28
  }), social.length ? /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 'var(--space-4)',
      fontSize: 'var(--fs-caption)',
      fontWeight: 'var(--fw-bold)'
    }
  }, social.map(s => /*#__PURE__*/React.createElement("a", {
    key: s,
    href: "#",
    style: {
      color: 'var(--sch-white)',
      textDecoration: 'none',
      borderBottom: '2px solid var(--sch-yellow)'
    }
  }, s))) : null)), /*#__PURE__*/React.createElement("div", {
    "aria-hidden": "true",
    style: {
      height: 'var(--frame-weight)',
      background: 'var(--sch-yellow)'
    }
  }));
}
Object.assign(__ds_scope, { SiteFooter });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/navigation/SiteFooter.jsx", error: String((e && e.message) || e) }); }

// components/navigation/SiteHeader.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function SiteHeader({
  items = [],
  active,
  onNavigate,
  login = 'Kunden-Login',
  languages = ['DE', 'EN', 'FR'],
  language = 'DE',
  onLanguage,
  sticky = true,
  style,
  ...rest
}) {
  const [hover, setHover] = React.useState(null);
  return /*#__PURE__*/React.createElement("header", _extends({
    style: {
      position: sticky ? 'sticky' : 'static',
      top: 0,
      zIndex: 20,
      background: 'var(--surface-page)',
      borderBottom: '1px solid var(--sch-grey-10)',
      ...style
    }
  }, rest), /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 'var(--container)',
      margin: '0 auto',
      padding: '0 var(--gutter)',
      height: 84,
      display: 'flex',
      alignItems: 'center',
      gap: 'var(--space-7)'
    }
  }, /*#__PURE__*/React.createElement("a", {
    href: "#",
    onClick: e => {
      e.preventDefault();
      onNavigate && onNavigate(items[0] && items[0].id);
    },
    style: {
      display: 'flex',
      alignItems: 'center'
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.Logo, {
    height: 30
  })), /*#__PURE__*/React.createElement("nav", {
    style: {
      marginLeft: 'auto',
      display: 'flex',
      alignItems: 'center',
      gap: 'var(--space-6)'
    }
  }, items.map(item => {
    const on = active === item.id;
    const hot = hover === item.id;
    return /*#__PURE__*/React.createElement("a", {
      key: item.id,
      href: item.href || '#',
      onClick: e => {
        if (onNavigate) {
          e.preventDefault();
          onNavigate(item.id);
        }
      },
      onMouseEnter: () => setHover(item.id),
      onMouseLeave: () => setHover(null),
      style: {
        position: 'relative',
        fontSize: 'var(--fs-caption)',
        fontWeight: 'var(--fw-bold)',
        color: on || hot ? 'var(--sch-red)' : 'var(--sch-blue)',
        textDecoration: 'none',
        paddingBottom: 4
      }
    }, item.label, /*#__PURE__*/React.createElement("span", {
      "aria-hidden": "true",
      style: {
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: -2,
        height: 'var(--rule-body)',
        background: on ? 'var(--sch-red)' : 'transparent'
      }
    }));
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 'var(--space-3)',
      paddingLeft: 'var(--space-5)',
      borderLeft: '1px solid var(--sch-grey-10)'
    }
  }, languages.map(l => /*#__PURE__*/React.createElement("button", {
    key: l,
    onClick: () => onLanguage && onLanguage(l),
    style: {
      border: 0,
      background: 'transparent',
      cursor: 'pointer',
      fontFamily: 'var(--font-core)',
      fontSize: 'var(--fs-eyebrow)',
      fontWeight: 'var(--fw-bold)',
      letterSpacing: 'var(--tracking-eyebrow)',
      color: l === language ? 'var(--sch-blue)' : 'var(--sch-grey-60)'
    }
  }, l))), /*#__PURE__*/React.createElement("a", {
    href: "#",
    style: {
      fontSize: 'var(--fs-caption)',
      fontWeight: 'var(--fw-bold)',
      color: 'var(--sch-white)',
      background: 'var(--sch-blue)',
      padding: '10px 18px',
      textDecoration: 'none'
    }
  }, login))));
}
Object.assign(__ds_scope, { SiteHeader });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/navigation/SiteHeader.jsx", error: String((e && e.message) || e) }); }

// ui_kits/website/App.jsx
try { (() => {
const {
  SiteHeader,
  SiteFooter,
  SideRail
} = window.SCHMIDTDesignSystem_b5cc27;
const NAV = [{
  id: 'home',
  label: 'Start'
}, {
  id: 'produkte',
  label: 'Produkte'
}, {
  id: 'referenzen',
  label: 'Referenzen'
}, {
  id: 'unternehmen',
  label: 'Unternehmen'
}, {
  id: 'kontakt',
  label: 'Kontakt'
}];
function App() {
  const [page, setPage] = React.useState('home');
  const Screen = {
    home: window.Home,
    produkte: window.Produkte,
    referenzen: window.Referenzen,
    kontakt: window.Kontakt,
    unternehmen: window.Referenzen
  }[page] || window.Home;
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(SiteHeader, {
    items: NAV,
    active: page,
    onNavigate: setPage
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative'
    }
  }, /*#__PURE__*/React.createElement(SideRail, {
    onContact: () => setPage('kontakt'),
    onTop: () => window.scrollTo({
      top: 0,
      behavior: 'smooth'
    })
  }), /*#__PURE__*/React.createElement(Screen, {
    go: setPage
  })), /*#__PURE__*/React.createElement(SiteFooter, {
    social: ['Facebook', 'Instagram', 'LinkedIn']
  }));
}
ReactDOM.createRoot(document.getElementById('root')).render(/*#__PURE__*/React.createElement(App, null));
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/website/App.jsx", error: String((e && e.message) || e) }); }

// ui_kits/website/Home.jsx
try { (() => {
const {
  SectionHeading,
  FeatureIcon,
  Button,
  NewsCard,
  FrameBox,
  Rule,
  StatBlock
} = window.SCHMIDTDesignSystem_b5cc27;
const ARGUMENTS = [['profilsystem', 'Von SCHMIDT entwickeltes, unabhängiges Profilsystem'], ['barrierefrei', 'Barrierefrei durch flache Schwellenlösungen'], ['zusatzausstattung', 'Individualisierbar in Design, Farbe und Ausstattung'], ['regen', 'Hohe Schlagregendichtheit bei erhöhter Windlast'], ['sicherheit', 'Geprüfte Sicherheit RC 1 N bis RC 3'], ['breite', 'Größe bis zu 7 m Breite'], ['thermostat', 'Passivhaustaugliche Wärmedämmung'], ['tablet-handy', 'Smarthomefähig – Öffnen auf Knopfdruck'], ['schalldaemmung', 'Lärmschutz bis 44 db']];
const NEWS = [['Beitrag zum InScreen in der bauelemente bau', 'In der aktuellen September-Ausgabe berichten wir auf einer Doppelseite über unseren InScreen-Insektenschutz für die QuinLine®-Hebeschiebetür.', '../../assets/img/innenraum-blick.png'], ['SCHMIDT in der Titelstory des „treffpunkt“ Magazins', 'Geschäftsführerin Teresa Schmidt-Bertsch berichtet über die Entwicklung unseres Familienbetriebs und die erfolgreiche Unternehmensnachfolge.', '../../assets/img/terrasse-hebeschiebetuer.png'], ['November-Seminare für Vertrieb und Montage', 'Im November 2026 startet unsere nächste Inhouse-Seminarreihe für Kaufleute und Monteure, abgerundet durch eine Betriebsführung.', '../../assets/img/hero-ausblick.png']];
function Home({
  go
}) {
  return /*#__PURE__*/React.createElement("main", null, /*#__PURE__*/React.createElement("section", {
    className: "wrap",
    style: {
      paddingTop: 'var(--space-8)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: '1.15fr 1fr',
      gap: 'var(--space-8)',
      alignItems: 'end'
    }
  }, /*#__PURE__*/React.createElement("h1", {
    style: {
      fontSize: 'var(--fs-display)',
      margin: 0,
      maxWidth: '16ch'
    }
  }, "Funktion & Design in Gr\xF6\xDFe vereint"), /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: 'var(--fs-body-lg)',
      margin: 0,
      paddingBottom: 6,
      maxWidth: '38ch'
    }
  }, "QuinLine\xAE Hebeschiebet\xFCr-Systeme sind die individuelle L\xF6sung f\xFCr ein lichtdurchflutetes Zuhause."))), /*#__PURE__*/React.createElement("section", {
    style: {
      position: 'relative',
      marginTop: 'var(--space-6)'
    }
  }, /*#__PURE__*/React.createElement("img", {
    src: "../../assets/img/hero-ausblick.png",
    alt: "Blick durch eine QuinLine\xAE Hebeschiebet\xFCr auf eine Waldlandschaft",
    style: {
      width: '100%',
      height: 620,
      objectFit: 'cover'
    }
  }), /*#__PURE__*/React.createElement("span", {
    "aria-hidden": "true",
    style: {
      position: 'absolute',
      right: '4%',
      top: -26,
      width: 'var(--frame-weight)',
      height: 200,
      background: 'var(--sch-yellow)'
    }
  }), /*#__PURE__*/React.createElement("span", {
    "aria-hidden": "true",
    style: {
      position: 'absolute',
      right: '4%',
      top: -26,
      width: 160,
      height: 'var(--frame-weight)',
      background: 'var(--sch-yellow)'
    }
  }), /*#__PURE__*/React.createElement("span", {
    "aria-hidden": "true",
    style: {
      position: 'absolute',
      right: 0,
      top: 120,
      width: 120,
      height: 'var(--frame-weight)',
      background: 'var(--sch-red)'
    }
  })), /*#__PURE__*/React.createElement("section", {
    className: "wrap",
    style: {
      padding: 'var(--section-y) var(--gutter)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: '1.35fr 1fr',
      gap: 'var(--space-9)',
      alignItems: 'start'
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(SectionHeading, {
    title: "Willkommen beim Marktf\xFChrer f\xFCr Kunststoff-Hebeschiebet\xFCren"
  }), /*#__PURE__*/React.createElement("p", {
    style: {
      marginTop: 'var(--space-5)'
    }
  }, "Die SCHMIDT GmbH fokussiert sich seit mehr als 50 Jahren auf die Entwicklung und Produktion von Hebeschiebet\xFCren. Zeitgem\xE4\xDFes Design, h\xF6chster Komfort, langlebige Funktionalit\xE4t und zertifizierte Qualit\xE4t \u2013 die QuinLine\xAE Hebeschiebet\xFCr bietet individuelle L\xF6sungen f\xFCr Neubauten wie auch die Haussanierung. Die Basis f\xFCr die ausgereifte Sicherheitstechnik, den hervorragenden Schall- und W\xE4rmeschutz bis hin zur Passivhaustauglichkeit, liefert das unternehmenseigene, unabh\xE4ngige SCHMIDT Profilsystem."), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(3, 1fr)',
      gap: 'var(--space-6) var(--space-5)',
      marginTop: 'var(--space-7)'
    }
  }, ARGUMENTS.map(([icon, label]) => /*#__PURE__*/React.createElement(FeatureIcon, {
    key: icon,
    name: icon,
    label: label,
    size: 52
  })))), /*#__PURE__*/React.createElement("img", {
    src: "../../assets/img/innenraum-blick.png",
    alt: "Qualit\xE4tskontrolle einer QuinLine\xAE 84",
    style: {
      width: '100%',
      height: 560,
      objectFit: 'cover'
    }
  }))), /*#__PURE__*/React.createElement("section", {
    style: {
      background: 'var(--surface-subtle)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "wrap",
    style: {
      padding: 'var(--section-y) var(--gutter)',
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: 'var(--space-8)',
      alignItems: 'center'
    }
  }, /*#__PURE__*/React.createElement("img", {
    src: "../../assets/img/terrasse-hebeschiebetuer.png",
    alt: "Besprechung bei der SCHMIDT GmbH",
    style: {
      width: '100%',
      height: 420,
      objectFit: 'cover'
    }
  }), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(SectionHeading, {
    title: "Am Puls des Marktes"
  }), /*#__PURE__*/React.createElement("p", {
    style: {
      marginTop: 'var(--space-5)'
    }
  }, "Zeiten \xE4ndern sich und so auch die Anforderungen in der Fensterbranche. Die SCHMIDT GmbH entwickelt seit 1950 L\xF6sungen, die auf den Bedarf des Fensterherstellers abgestimmt sind. Seit 1976 fokussiert sich das Unternehmen auf Kunststoff-Hebeschiebet\xFCren und setzt damit regelm\xE4\xDFig Meilensteine f\xFCr den Markt."), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 'var(--space-7)',
      margin: 'var(--space-6) 0'
    }
  }, /*#__PURE__*/React.createElement(StatBlock, {
    value: "1950",
    label: "Gr\xFCndung"
  }), /*#__PURE__*/React.createElement(StatBlock, {
    value: "30.000",
    label: "Hebeschiebet\xFCren pro Jahr"
  }), /*#__PURE__*/React.createElement(StatBlock, {
    value: "ca. 150",
    label: "Mitarbeiter"
  })), /*#__PURE__*/React.createElement(Button, {
    variant: "outline",
    onClick: () => go('unternehmen')
  }, "\xDCber uns")))), /*#__PURE__*/React.createElement("section", {
    className: "wrap",
    style: {
      padding: 'var(--section-y) var(--gutter)'
    }
  }, /*#__PURE__*/React.createElement(FrameBox, {
    surface: "blue",
    frame: "yellow",
    corner: "bottom-right",
    inset: 34,
    minHeight: 440,
    contentStyle: {
      padding: 'var(--space-8)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: '1.1fr 1fr',
      gap: 'var(--space-8)',
      alignItems: 'center'
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(SectionHeading, {
    tone: "on-blue",
    title: "Das System QuinLine\xAE",
    intro: "Das 5-Kammer-Profilsystem QuinLine\xAE ist ein eigenst\xE4ndiges System, das einzig f\xFCr die Konstruktion der QuinLine\xAE 74 und der QuinLine\xAE 84 eingesetzt wird. Die Sortimentsbreite und -tiefe ist einzigartig f\xFCr Kunststoff-Hebeschiebet\xFCren."
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 'var(--space-7)',
      marginTop: 'var(--space-7)'
    }
  }, /*#__PURE__*/React.createElement(FeatureIcon, {
    name: "barrierefrei",
    label: "Barrierefrei",
    tone: "on-blue",
    size: 46
  }), /*#__PURE__*/React.createElement(FeatureIcon, {
    name: "sicherheit",
    label: "Gepr\xFCfte Sicherheit",
    tone: "on-blue",
    size: 46
  }), /*#__PURE__*/React.createElement(FeatureIcon, {
    name: "zusatzausstattung",
    label: "Individualisierbar",
    tone: "on-blue",
    size: 46
  }), /*#__PURE__*/React.createElement(FeatureIcon, {
    name: "breite",
    label: "Bis zu 7 m Breite",
    tone: "on-blue",
    size: 46
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 'var(--space-7)'
    }
  }, /*#__PURE__*/React.createElement(Button, {
    variant: "outline",
    onBlue: true,
    onClick: () => go('produkte')
  }, "Produkte"))), /*#__PURE__*/React.createElement("img", {
    src: "../../assets/img/innenraum-blick.png",
    alt: "QuinLine\xAE Profilsystem",
    style: {
      width: '100%',
      height: 340,
      objectFit: 'cover'
    }
  })))), /*#__PURE__*/React.createElement("section", {
    className: "wrap",
    style: {
      padding: '0 var(--gutter) var(--section-y)'
    }
  }, /*#__PURE__*/React.createElement(SectionHeading, {
    title: "Neues von Schmidt"
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(3, 1fr)',
      gap: 'var(--space-5)',
      marginTop: 'var(--space-7)'
    }
  }, NEWS.map(([title, text, img]) => /*#__PURE__*/React.createElement(NewsCard, {
    key: title,
    image: img,
    title: title,
    text: text,
    href: "#",
    cta: "Weiterlesen"
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 'var(--space-6)'
    }
  }, /*#__PURE__*/React.createElement(Button, {
    variant: "quiet"
  }, "Alle News"))));
}
window.Home = Home;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/website/Home.jsx", error: String((e && e.message) || e) }); }

// ui_kits/website/Kontakt.jsx
try { (() => {
const {
  SectionHeading,
  Input,
  Select,
  Checkbox,
  RadioGroup,
  Button,
  BulletList,
  Rule
} = window.SCHMIDTDesignSystem_b5cc27;
function Kontakt() {
  const [sent, setSent] = React.useState(false);
  const [format, setFormat] = React.useState('gedruckt');
  const [agree, setAgree] = React.useState(false);
  return /*#__PURE__*/React.createElement("main", {
    className: "wrap",
    style: {
      padding: 'var(--space-8) var(--gutter) var(--section-y)'
    }
  }, /*#__PURE__*/React.createElement(SectionHeading, {
    eyebrow: "Kontakt",
    title: "Sie haben Fragen zur QuinLine\xAE Hebeschiebet\xFCr?",
    intro: "Sprechen Sie uns gerne an \u2014 oder bestellen Sie weitere Exemplare unserer Produktbrosch\xFCre."
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: '1.2fr 1fr',
      gap: 'var(--space-9)',
      marginTop: 'var(--space-8)',
      alignItems: 'start'
    }
  }, sent ? /*#__PURE__*/React.createElement("div", {
    style: {
      background: 'var(--surface-inverse)',
      color: 'var(--text-on-blue)',
      padding: 'var(--space-7)'
    }
  }, /*#__PURE__*/React.createElement("h3", {
    style: {
      color: 'var(--text-on-blue)'
    }
  }, "Vielen Dank f\xFCr Ihre Anfrage."), /*#__PURE__*/React.createElement(Rule, {
    color: "yellow",
    width: "80px",
    style: {
      margin: 'var(--space-4) 0'
    }
  }), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0
    }
  }, "Unser Verkaufsinnendienst meldet sich innerhalb eines Werktags bei Ihnen."), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 'var(--space-6)'
    }
  }, /*#__PURE__*/React.createElement(Button, {
    variant: "outline",
    onBlue: true,
    onClick: () => setSent(false)
  }, "Neue Anfrage"))) : /*#__PURE__*/React.createElement("form", {
    onSubmit: e => {
      e.preventDefault();
      setSent(true);
    },
    style: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: 'var(--space-5)'
    }
  }, /*#__PURE__*/React.createElement(Input, {
    label: "Firma",
    required: true
  }), /*#__PURE__*/React.createElement(Input, {
    label: "Vor- und Nachname",
    required: true
  }), /*#__PURE__*/React.createElement(Input, {
    label: "Stra\xDFe"
  }), /*#__PURE__*/React.createElement(Input, {
    label: "PLZ / Ort"
  }), /*#__PURE__*/React.createElement(Input, {
    label: "E-Mail-Adresse",
    type: "email",
    required: true
  }), /*#__PURE__*/React.createElement(Input, {
    label: "Telefon",
    type: "tel"
  }), /*#__PURE__*/React.createElement(Select, {
    label: "Ich bin",
    options: ['Fensterhersteller / Monteur', 'Planer / Architekt', 'Privater Bauherr'],
    style: {
      gridColumn: 'span 2'
    }
  }), /*#__PURE__*/React.createElement(RadioGroup, {
    name: "format",
    legend: "Produktbrosch\xFCre \u201EHeben. Schieben. \xD6ffnen.\u201C",
    inline: true,
    value: format,
    onChange: e => setFormat(e.target.value),
    options: ['gedruckt', 'PDF-Datei'],
    style: {
      gridColumn: 'span 2'
    }
  }), /*#__PURE__*/React.createElement(Checkbox, {
    style: {
      gridColumn: 'span 2'
    },
    label: "Ich habe die Datenschutzerkl\xE4rung gelesen.",
    checked: agree,
    onChange: e => setAgree(e.target.checked)
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      gridColumn: 'span 2'
    }
  }, /*#__PURE__*/React.createElement(Button, {
    disabled: !agree
  }, "Anfrage senden"))), /*#__PURE__*/React.createElement("aside", {
    style: {
      borderLeft: '1px solid var(--sch-grey-10)',
      paddingLeft: 'var(--space-7)',
      fontSize: 'var(--fs-side)',
      lineHeight: 'var(--lh-body)'
    }
  }, /*#__PURE__*/React.createElement("h4", null, "SCHMIDT GmbH"), /*#__PURE__*/React.createElement("p", {
    style: {
      marginTop: 'var(--space-3)'
    }
  }, "T\xF6llen Linde 3", /*#__PURE__*/React.createElement("br", null), "33129 Delbr\xFCck-Boke", /*#__PURE__*/React.createElement("br", null), "Deutschland"), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0
    }
  }, "Telefon ", /*#__PURE__*/React.createElement("a", {
    href: "tel:+49525098450"
  }, "+49 5250 9845-0"), /*#__PURE__*/React.createElement("br", null), "Telefax +49 5250 9845-50", /*#__PURE__*/React.createElement("br", null), /*#__PURE__*/React.createElement("a", {
    href: "mailto:kontakt@schmidt-boke.de"
  }, "kontakt@schmidt-boke.de")), /*#__PURE__*/React.createElement(Rule, {
    color: "red",
    width: "60px",
    style: {
      margin: 'var(--space-6) 0'
    }
  }), /*#__PURE__*/React.createElement(BulletList, {
    level: 1,
    items: ['Verkaufsinnendienst Boke', 'Zuständiger Verkaufsleiter', 'Kunden-Login für Lagertüren']
  }))));
}
window.Kontakt = Kontakt;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/website/Kontakt.jsx", error: String((e && e.message) || e) }); }

// ui_kits/website/Produkte.jsx
try { (() => {
const {
  SectionHeading,
  BulletList,
  FeatureIcon,
  Button,
  Rule,
  FrameBox
} = window.SCHMIDTDesignSystem_b5cc27;
const SCHWELLEN = [['Standardschwelle', '174 mm', '198 mm', 'silber / schwarz eloxiert'], ['Niedrigschwelle', '174 mm', '198 mm', 'silber eloxiert'], ['Renovierungsschwelle', '140/174 mm', '—', 'nur QuinLine® 74'], ['Standardschwelle mit Außenanschlag', '174 mm', '198 mm', 'silber eloxiert'], ['Niedrigschwelle mit Außenanschlag', '174 mm', '198 mm', 'silber eloxiert']];
function Produkte({
  go
}) {
  const [system, setSystem] = React.useState('74');
  const data = {
    '74': {
      tiefe: '74 mm',
      zarge: '174 mm',
      uf: 'Uf = 1,5 W/(m²K)',
      glas: 'bis 46 mm Dicke',
      hoehe: 'bis zu 2,50 m'
    },
    '84': {
      tiefe: '84 mm',
      zarge: '198 mm',
      uf: 'Uf = 1,3 W/(m²K)',
      glas: 'bis 56 mm Dicke',
      hoehe: 'Weiß bis 2,80 m · Farbe bis 2,70 m'
    }
  }[system];
  return /*#__PURE__*/React.createElement("main", null, /*#__PURE__*/React.createElement("section", {
    className: "wrap",
    style: {
      padding: 'var(--space-8) var(--gutter) 0'
    }
  }, /*#__PURE__*/React.createElement(SectionHeading, {
    eyebrow: "Produkte",
    title: 'System QuinLine® ' + system,
    intro: "Zwei Bautiefen, eine Basis. Technisch bis ins kleinste Detail durchdacht, bietet das Profilsystem vielseitige M\xF6glichkeiten in der Bestandssanierung wie im Neubau."
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 'var(--space-3)',
      marginTop: 'var(--space-6)'
    }
  }, /*#__PURE__*/React.createElement(Button, {
    variant: system === '74' ? 'primary' : 'outline',
    onClick: () => setSystem('74')
  }, "QuinLine\xAE 74"), /*#__PURE__*/React.createElement(Button, {
    variant: system === '84' ? 'primary' : 'outline',
    onClick: () => setSystem('84')
  }, "QuinLine\xAE 84"))), /*#__PURE__*/React.createElement("section", {
    className: "wrap",
    style: {
      padding: 'var(--space-8) var(--gutter)',
      display: 'grid',
      gridTemplateColumns: '1fr 1.1fr',
      gap: 'var(--space-8)',
      alignItems: 'start'
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h3", null, "Funktion"), /*#__PURE__*/React.createElement(Rule, {
    color: "red",
    width: "72px",
    style: {
      margin: 'var(--space-3) 0 var(--space-5)'
    }
  }), /*#__PURE__*/React.createElement(BulletList, {
    items: ['Flügelbautiefe ' + data.tiefe, 'Zargenbautiefe ' + data.zarge, 'Rahmen Wärmedurchgangskoeffizient ' + data.uf, 'Aufnahmekapazität für Isoliergläser ' + data.glas, 'Höhe ' + data.hoehe, 'Breite bis 7 m']
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 'var(--space-6)',
      marginTop: 'var(--space-7)'
    }
  }, /*#__PURE__*/React.createElement(FeatureIcon, {
    name: "thermostat",
    label: "W\xE4rmed\xE4mmung",
    size: 46
  }), /*#__PURE__*/React.createElement(FeatureIcon, {
    name: "sicherheit",
    label: "RC 1 N bis RC 3",
    size: 46
  }), /*#__PURE__*/React.createElement(FeatureIcon, {
    name: "nullschwelle",
    label: "Niedrigschwelle 4,5 mm",
    size: 46
  }), /*#__PURE__*/React.createElement(FeatureIcon, {
    name: "leichtlaeufig",
    label: "Leichtl\xE4ufig",
    size: 46
  }))), /*#__PURE__*/React.createElement("img", {
    src: "../../assets/img/terrasse-hebeschiebetuer.png",
    alt: 'QuinLine® ' + system,
    style: {
      width: '100%',
      height: 420,
      objectFit: 'cover'
    }
  })), /*#__PURE__*/React.createElement("section", {
    style: {
      background: 'var(--surface-subtle)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "wrap",
    style: {
      padding: 'var(--section-y) var(--gutter)'
    }
  }, /*#__PURE__*/React.createElement(SectionHeading, {
    title: "Die Welt der Schwellen",
    intro: "Allein die Schwellenvarianten erstrecken sich \xFCber die Standardschwelle und die Renovierungsschwelle bis hin zur barrierefreien Niedrigschwelle."
  }), /*#__PURE__*/React.createElement("table", {
    style: {
      width: '100%',
      borderCollapse: 'collapse',
      marginTop: 'var(--space-7)',
      fontSize: 'var(--fs-side)'
    }
  }, /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", {
    style: {
      textAlign: 'left',
      color: 'var(--text-muted)',
      fontSize: 'var(--fs-caption)'
    }
  }, /*#__PURE__*/React.createElement("th", {
    style: {
      padding: '10px 12px'
    }
  }, "Schwelle"), /*#__PURE__*/React.createElement("th", {
    style: {
      padding: '10px 12px'
    }
  }, "Bautiefe QL 74"), /*#__PURE__*/React.createElement("th", {
    style: {
      padding: '10px 12px'
    }
  }, "Bautiefe QL 84"), /*#__PURE__*/React.createElement("th", {
    style: {
      padding: '10px 12px'
    }
  }, "Ausf\xFChrung"))), /*#__PURE__*/React.createElement("tbody", null, SCHWELLEN.map(r => /*#__PURE__*/React.createElement("tr", {
    key: r[0],
    style: {
      borderTop: '1px solid var(--sch-grey-30)'
    }
  }, r.map((c, i) => /*#__PURE__*/React.createElement("td", {
    key: i,
    style: {
      padding: '12px',
      fontWeight: i === 0 ? 'var(--fw-bold)' : 'var(--fw-regular)',
      color: i === 0 ? 'var(--text-heading)' : 'var(--text-primary)'
    }
  }, c)))))), /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: 'var(--fs-caption)',
      color: 'var(--text-muted)',
      marginTop: 'var(--space-4)'
    }
  }, "Das Schwellen-Abdeckprofil 0\xB0 ist bei allen Schwellen, bis auf die schwarze Schwelle, nachr\xFCstbar."))), /*#__PURE__*/React.createElement("section", {
    className: "wrap",
    style: {
      padding: 'var(--section-y) var(--gutter)'
    }
  }, /*#__PURE__*/React.createElement(FrameBox, {
    surface: "blue",
    frame: "red",
    corner: "bottom-left",
    inset: 30,
    minHeight: 260,
    contentStyle: {
      padding: 'var(--space-8)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: '1fr auto',
      gap: 'var(--space-7)',
      alignItems: 'center'
    }
  }, /*#__PURE__*/React.createElement(SectionHeading, {
    tone: "on-blue",
    level: 3,
    title: "Schritt f\xFCr Schritt zur perfekten Hebeschiebet\xFCr",
    intro: "Gr\xF6\xDFen, Typen, Schwellen, Optik und Design, W\xE4rmed\xE4mmung, Einbruchschutz, Sonderausstattung, elektrischer Antrieb eVOMATIC\xAE."
  }), /*#__PURE__*/React.createElement(Button, {
    variant: "outline",
    onBlue: true,
    onClick: () => go('kontakt')
  }, "Beratung anfragen")))));
}
window.Produkte = Produkte;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/website/Produkte.jsx", error: String((e && e.message) || e) }); }

// ui_kits/website/Referenzen.jsx
try { (() => {
const {
  SectionHeading,
  NewsCard,
  PullQuote,
  ImageOverlay,
  BulletList,
  Button
} = window.SCHMIDTDesignSystem_b5cc27;
const REFS = [['Sauerland Lodge', 'Sechs Design-Ferienhäuser in Niedersfeld, je mit einer QuinLine® 74 zum Südhang hin geöffnet.', '../../assets/img/hero-ausblick.png'], ['Weingut Bachmann', 'Stäfa am Zürichsee: drei QuinLine® 84 öffnen den Blick über die Weinberge auf den See.', '../../assets/img/terrasse-hebeschiebetuer.png'], ['Wohnglück zu Hermanns Füßen', 'Ein 1939 erbautes Haus in Detmold-Hiddesen, saniert mit zwei QuinLine® Hebeschiebetüren.', '../../assets/img/innenraum-blick.png']];
function Referenzen({
  go
}) {
  return /*#__PURE__*/React.createElement("main", null, /*#__PURE__*/React.createElement("section", {
    className: "wrap",
    style: {
      padding: 'var(--space-8) var(--gutter) 0'
    }
  }, /*#__PURE__*/React.createElement(SectionHeading, {
    eyebrow: "Referenzen",
    title: "Blicke hinaus und hinein",
    intro: "Im Gespr\xE4ch mit den jeweiligen Hausherren haben wir nach dem Warum f\xFCr eine Hebeschiebet\xFCr gefragt. Die Antworten waren klar formuliert."
  })), /*#__PURE__*/React.createElement("section", {
    className: "wrap",
    style: {
      padding: 'var(--space-8) var(--gutter)'
    }
  }, /*#__PURE__*/React.createElement(ImageOverlay, {
    base: "../../assets/img/hero-ausblick.png",
    overlay: "../../assets/img/innenraum-blick.png",
    ratio: "21 / 9"
  })), /*#__PURE__*/React.createElement("section", {
    className: "wrap",
    style: {
      padding: '0 var(--gutter) var(--section-y)',
      display: 'grid',
      gridTemplateColumns: 'repeat(3, 1fr)',
      gap: 'var(--space-5)'
    }
  }, REFS.map(([t, x, img]) => /*#__PURE__*/React.createElement(NewsCard, {
    key: t,
    image: img,
    kicker: "Referenzstory",
    title: t,
    text: x,
    href: "#",
    cta: "Projekt ansehen"
  }))), /*#__PURE__*/React.createElement("section", {
    style: {
      background: 'var(--surface-inverse)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "wrap",
    style: {
      padding: 'var(--section-y) var(--gutter)',
      display: 'grid',
      gridTemplateColumns: '1.3fr 1fr',
      gap: 'var(--space-8)',
      alignItems: 'center'
    }
  }, /*#__PURE__*/React.createElement(PullQuote, {
    tone: "on-blue",
    size: "lg",
    quote: "Der Blick wird durch die Hebeschiebet\xFCr eingerahmt. Man braucht sozusagen keinen Fernseher mehr.",
    author: "Fabian Alberti",
    role: "Architekt, Sauerland Lodge"
  }), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(BulletList, {
    tone: "on-blue",
    items: ['QuinLine® 74, Anzahl: 6', 'Öffnungsart: 2-teilig; Typ 1 und Typ 2', 'Größe: 4.975 × 2.495 mm (B × H)', 'Elementfarbe: Schwarz Ulti-Matt']
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 'var(--space-6)'
    }
  }, /*#__PURE__*/React.createElement(Button, {
    variant: "outline",
    onBlue: true,
    onClick: () => go('kontakt')
  }, "Kontakt aufnehmen"))))));
}
window.Referenzen = Referenzen;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/website/Referenzen.jsx", error: String((e && e.message) || e) }); }

__ds_ns.BulletList = __ds_scope.BulletList;

__ds_ns.FeatureIcon = __ds_scope.FeatureIcon;

__ds_ns.ImageOverlay = __ds_scope.ImageOverlay;

__ds_ns.NewsCard = __ds_scope.NewsCard;

__ds_ns.PullQuote = __ds_scope.PullQuote;

__ds_ns.SectionHeading = __ds_scope.SectionHeading;

__ds_ns.StatBlock = __ds_scope.StatBlock;

__ds_ns.Button = __ds_scope.Button;

__ds_ns.FrameBox = __ds_scope.FrameBox;

__ds_ns.Icon = __ds_scope.Icon;

__ds_ns.Logo = __ds_scope.Logo;

__ds_ns.Rule = __ds_scope.Rule;

__ds_ns.ICON_NAMES = __ds_scope.ICON_NAMES;

__ds_ns.Checkbox = __ds_scope.Checkbox;

__ds_ns.Input = __ds_scope.Input;

__ds_ns.RadioGroup = __ds_scope.RadioGroup;

__ds_ns.Select = __ds_scope.Select;

__ds_ns.SideRail = __ds_scope.SideRail;

__ds_ns.SiteFooter = __ds_scope.SiteFooter;

__ds_ns.SiteHeader = __ds_scope.SiteHeader;

})();
