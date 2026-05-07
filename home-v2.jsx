/* ============================================================
   HOME v2 — Swiss Minimal Grid
   Interactive tile grid with spin+gradient reveal.
   INCENDIO 1987 portfolio.
   ============================================================ */

const PALETTES_HOME = {
  electric: { bg: "#1d1bff", paper: "#fffaee", ink: "#0a0a0a", accent1: "#ffd000", accent2: "#ff8de0", accent3: "#5ae3a4" },
  sunset:   { bg: "#ff5e9e", paper: "#fff7d6", ink: "#0a0a0a", accent1: "#ffd000", accent2: "#1d1bff", accent3: "#ff7a59" },
  acid:     { bg: "#16a34a", paper: "#fffaee", ink: "#0a0a0a", accent1: "#ffd000", accent2: "#ff5e9e", accent3: "#1d4ed8" },
  noir:     { bg: "#0a0a0a", paper: "#f4f1ea", ink: "#fffaee", accent1: "#ff1d58", accent2: "#ffd000", accent3: "#5ae3a4" },
  cream:    { bg: "#f6efde", paper: "#fffaee", ink: "#0c2340", accent1: "#c0392b", accent2: "#1e3a8a", accent3: "#d4a017" },
};

const STRINGS = {
  works:    { es: "WORKS",    en: "WORKS" },
  shop:     { es: "SHOP",     en: "SHOP" },
  contact:  { es: "CONTACT",  en: "CONTACT" },
  about:    { es: "ABOUT",    en: "ABOUT" },
  hero_sub: { es: "Diseño, ilustración, código y caos curado.",
              en: "Design, illustration, code & curated chaos." },
  page:     { es: "PÁG",      en: "PAGE" },
};
function makeT(lang) {
  return function(key) {
    var e = STRINGS[key]; if (!e) return key;
    return e[lang] || e.es || key;
  };
}

/* ─── Grid Cell ───
   1. Default: small dot
   2. Hover/touch: dot spins right + gradient color, shows project NAME
   3. Mouse leave: reverts to dot
   4. Click: reveals thumbnail (stays)
   5. Double-click or click on open thumbnail: navigate
*/
function GridCell(props) {
  var project = props.project;
  var index = props.index;
  var openSet = props.openSet;
  var onOpen = props.onOpen;
  var pal = props.pal;

  var _h = React.useState(false);
  var hovered = _h[0], setHovered = _h[1];
  var isOpen = openSet.has(index);
  var hasProject = !!project;

  var colors = [pal.accent1, pal.accent2, pal.accent3];
  var c1 = colors[index % colors.length];
  var c2 = colors[(index + 1) % colors.length];

  var handleClick = function() {
    if (!hasProject) return;
    window.location.hash = "#/project/" + project.id;
  };

  var handleDoubleClick = function() {
    if (!hasProject) return;
    window.location.hash = "#/project/" + project.id;
  };

  return React.createElement("div", {
    className: "grid-cell" + (isOpen ? " open" : "") + (hovered ? " hovered" : "") + (!hasProject ? " empty" : ""),
    style: { "--c1": c1, "--c2": c2, "--cell-bg": hasProject && project.cover ? 'url("' + project.cover + '")' : "none", "--pulse-delay": (index * 0.18) % 2.4 + "s" },
    onMouseEnter: function() { if (hasProject) setHovered(true); },
    onMouseLeave: function() { setHovered(false); },
    onTouchStart: function() { if (hasProject) setHovered(true); },
    onTouchEnd: function() { setTimeout(function() { setHovered(false); }, 800); },
    onClick: handleClick,
    onDoubleClick: handleDoubleClick,
  },
    React.createElement("div", { className: "cell-dot" }),
    hasProject && hovered && !isOpen ? React.createElement("div", { className: "cell-thumb" },
      React.createElement("div", { className: "cell-img" }),
      React.createElement("div", { className: "cell-name" }, project.title)
    ) : null,
    hasProject && isOpen ? React.createElement("div", { className: "cell-thumb" },
      React.createElement("div", { className: "cell-img" })
    ) : null
  );
}


/* ─── MAIN HOME ─── */
function HomeV2() {
  var _tw = window.useTweaks(/*EDITMODE-BEGIN*/{
    "palette": "electric",
    "lang": "es"
  }/*EDITMODE-END*/);
  var tweaks = _tw[0], setTweak = _tw[1];

  var t = makeT(tweaks.lang || "es");
  var pal = PALETTES_HOME[tweaks.palette] || PALETTES_HOME.electric;

  var _p = React.useState([]);
  var projects = _p[0], setProjects = _p[1];
  var _sd = React.useState(null);
  var siteData = _sd[0], setSiteData = _sd[1];

  React.useEffect(function() {
    (function() {
      var data = window.__INCENDIO_DATA;
      if (!data) {
        fetch("data.json").then(function(r) { return r.json(); }).then(function(d) {
          window.__INCENDIO_DATA = d;
          setSiteData(d);
          processProjects(d);
        }).catch(function() { setSiteData({}); });
      } else {
        setSiteData(data);
        processProjects(data);
      }
    })();

    function processProjects(data) {
      var projs = (data.projects || []).map(function(p) {
        return {
          id: p.id,
          title: p.title || p.id,
          cat: p.category || "",
          year: p.year || "",
          cover: p.cover || "",
          contain: !!p.contain,
          featured: !!p.featured,
        };
      });
      setProjects(projs);
    }
  }, []);

  var i18n = {};
  if (siteData && siteData.i18n) {
    i18n = siteData.i18n[tweaks.lang] || siteData.i18n.es || {};
  }

  /* Read design config from site */
  var siteConfig = (siteData && siteData.site) ? siteData.site : {};
  var fontFamily = siteConfig.fontFamily || "Space Mono";
  var gridDotSize = siteConfig.gridDotSize || 4;
  var gridDotColor = siteConfig.gridDotColor || "";
  var gridTransition = siteConfig.gridTransition || "cubic-bezier(0.34, 1.56, 0.64, 1)";
  var titleLetterColorsConfig = siteConfig.titleLetterColors || [];

  /* Random palette on load */
  var _rp = React.useRef(false);
  React.useEffect(function() {
    if (_rp.current) return;
    _rp.current = true;
    if (siteConfig.randomPalette && siteData && siteData.palettes) {
      var palNames = Object.keys(siteData.palettes);
      if (palNames.length > 0) {
        var rIdx = Math.floor(Math.random() * palNames.length);
        setTweak("palette", palNames[rIdx]);
      }
    }
    if (siteConfig.randomFont) {
      var fonts = ["Space Mono","JetBrains Mono","IBM Plex Mono","Fira Code","Syne","Outfit","DM Mono"];
      fontFamily = fonts[Math.floor(Math.random() * fonts.length)];
    }
  }, [siteData]);

  /* Responsive */
  var _m = React.useState(window.innerWidth < 768);
  var isMobile = _m[0], setIsMobile = _m[1];
  React.useEffect(function() {
    var handler = function() { setIsMobile(window.innerWidth < 768); };
    window.addEventListener("resize", handler);
    return function() { window.removeEventListener("resize", handler); };
  }, []);

  var COLS = isMobile ? 3 : 6;
  var ROWS = isMobile ? 7 : 4;
  var PER_PAGE = COLS * ROWS;

  var _pg = React.useState(0);
  var page = _pg[0], setPage = _pg[1];
  var totalPages = Math.max(1, Math.ceil(projects.length / PER_PAGE));

  var pageProjects = React.useMemo(function() {
    var start = page * PER_PAGE;
    var slice = projects.slice(start, start + PER_PAGE);
    while (slice.length < PER_PAGE) slice.push(null);
    return slice;
  }, [projects, page, PER_PAGE]);

  var _os = React.useState(new Set());
  var openSet = _os[0], setOpenSet = _os[1];
  React.useEffect(function() { setOpenSet(new Set()); }, [page]);

  var handleOpen = function(index) {
    setOpenSet(function(prev) { var n = new Set(prev); n.add(index); return n; });
  };

  /* Works dropdown */
  var _wo = React.useState(false);
  var worksOpen = _wo[0], setWorksOpen = _wo[1];
  var worksRef = React.useRef(null);
  React.useEffect(function() {
    var handler = function(e) {
      if (worksRef.current && !worksRef.current.contains(e.target)) {
        setWorksOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    document.addEventListener("touchstart", handler);
    return function() {
      document.removeEventListener("mousedown", handler);
      document.removeEventListener("touchstart", handler);
    };
  }, []);

  var categories = React.useMemo(function() {
    var cats = [];
    var seen = {};
    projects.forEach(function(p) {
      if (p.cat && !seen[p.cat]) { seen[p.cat] = true; cats.push(p.cat); }
    });
    return cats;
  }, [projects]);

  var palEntries = Object.entries(PALETTES_HOME);

  /* Title letter hover */
  var _tl = React.useState({});
  var touchedLetters = _tl[0], setTouchedLetters = _tl[1];
  var letterColors = [pal.accent1, pal.accent2, pal.accent3];
  /* Use title letter colors from config if set */
  var useConfigColors = titleLetterColorsConfig.length > 0 && titleLetterColorsConfig.some(function(c) { return !!c; });
  var handleLetterHover = function(idx) {
    setTouchedLetters(function(prev) { var n = Object.assign({}, prev); n[idx] = true; return n; });
    setTimeout(function() {
      setTouchedLetters(function(prev) { var n = Object.assign({}, prev); delete n[idx]; return n; });
    }, 800);
  };

  var css = `
    .incendio-home {
      --bg: ${pal.bg}; --paper: ${pal.paper}; --ink: ${pal.ink};
      --a1: ${pal.accent1}; --a2: ${pal.accent2}; --a3: ${pal.accent3};
      width: 100%; height: 100vh;
      background: var(--bg); color: var(--paper);
      font-family: '${fontFamily}', 'Courier New', monospace;
      display: flex; flex-direction: column;
      overflow: hidden;
    }
    .incendio-home a { color: inherit; text-decoration: none; }

    .ih-header {
      padding: 16px 20px 8px;
      display: flex;
      flex-direction: row;
      align-items: flex-end;
      gap: 16px;
      flex-shrink: 0;
    }
    .ih-brand { flex-shrink: 0; }

    .ih-title {
      font-size: clamp(52px, 11vw, 130px);
      font-weight: 700;
      line-height: 0.82;
      letter-spacing: -0.05em;
      margin: 0;
      text-transform: uppercase;
      cursor: default;
    }
    .ih-title-row { display: block; }

    /* Second row: 1987 + subtitle inline */
    .ih-title-row-sub {
      display: flex;
      align-items: baseline;
      gap: 12px;
    }
    .ih-title-row-sub .ih-year-letters {
      display: inline;
    }

    .ih-title-letter {
      display: inline-block;
      transition: color 0.3s ease;
      cursor: crosshair;
    }
    .ih-title-letter.touched {
      animation: letterPop 0.8s ease-out forwards;
    }
    @keyframes letterPop {
      0% { transform: scale(1); }
      20% { transform: scale(1.1); }
      100% { transform: scale(1); }
    }

    .ih-subtitle {
      font-size: clamp(8px, 1vw, 11px);
      font-weight: 400;
      letter-spacing: 0.04em;
      opacity: 0.35;
      line-height: 1.3;
      white-space: nowrap;
      flex-shrink: 1;
      min-width: 0;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .ih-nav {
      display: flex;
      flex-direction: row;
      align-items: center;
      gap: 4px;
      padding-bottom: 3px;
      flex-wrap: wrap;
      flex-shrink: 0;
    }
    .ih-nav-link {
      font-size: clamp(12px, 2vw, 16px);
      font-weight: 700;
      letter-spacing: 0.08em;
      text-transform: uppercase;
      opacity: 0.65;
      transition: opacity 0.2s, color 0.2s;
      cursor: pointer;
      background: none;
      border: none;
      color: var(--paper);
      font-family: inherit;
      padding: 2px 8px;
      text-align: left;
      line-height: 1.2;
    }
    .ih-nav-link:hover { opacity: 1; color: var(--a1); }

    /* SHOP animated gradient border */
    .ih-nav-shop {
      position: relative;
      opacity: 1 !important;
      padding: 3px 10px;
      color: var(--paper) !important;
      z-index: 0;
    }
    .ih-nav-shop::before {
      content: '';
      position: absolute;
      inset: 0;
      border-radius: 2px;
      padding: 1.5px;
      background: linear-gradient(90deg, var(--a1), var(--a2), var(--a3), var(--a1));
      background-size: 300% 100%;
      -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
      -webkit-mask-composite: xor;
      mask-composite: exclude;
      animation: shopBorderRoll 2.5s linear infinite;
      pointer-events: none;
    }
    @keyframes shopBorderRoll {
      0% { background-position: 0% 50%; }
      100% { background-position: 300% 50%; }
    }
    .ih-nav-shop:hover { color: var(--a1) !important; }

    .ih-works-wrap { position: relative; }
    .ih-works-dropdown {
      position: absolute;
      top: calc(100% + 2px);
      right: 0;
      background: var(--paper);
      color: var(--ink);
      padding: 4px 0;
      min-width: 180px;
      z-index: 200;
      opacity: 0;
      transform: translateY(-4px);
      pointer-events: none;
      transition: opacity 0.2s, transform 0.2s;
    }
    .ih-works-dropdown.open {
      opacity: 1;
      transform: translateY(0);
      pointer-events: auto;
    }
    .ih-works-dropdown a {
      display: block;
      padding: 8px 16px;
      font-size: 12px;
      letter-spacing: 0.1em;
      text-transform: uppercase;
      color: var(--ink);
      font-weight: 700;
      transition: background 0.15s;
    }
    .ih-works-dropdown a:hover { background: var(--a1); }

    .ih-grid-wrap {
      flex: 1;
      padding: 4px 20px;
      display: flex;
      flex-direction: column;
      justify-content: center;
      min-height: 0;
    }
    .ih-grid {
      display: grid;
      grid-template-columns: repeat(${COLS}, 1fr);
      grid-template-rows: repeat(${ROWS}, 1fr);
      gap: 3px;
      width: 100%;
    }

    .grid-cell {
      position: relative;
      overflow: hidden;
      cursor: pointer;
      border: 1px solid rgba(255,255,255,0.05);
      aspect-ratio: 1;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: border-color 0.3s;
    }
    .grid-cell.hovered { border-color: rgba(255,255,255,0.15); }
    .grid-cell.empty { cursor: default; opacity: 0.12; }

    .cell-dot {
      width: ${gridDotSize}px; height: ${gridDotSize}px;
      background: ${gridDotColor || "var(--paper)"};
      opacity: 0.55;
      animation: dotPulse 2.4s ease-in-out var(--pulse-delay, 0s) infinite;
      transition: transform 0.5s ${gridTransition},
                  background 0.4s,
                  opacity 0.3s;
    }
    @keyframes dotPulse {
      0%, 100% { opacity: 0.55; transform: scale(1); }
      50% { opacity: 0.9; transform: scale(1.45); }
    }
    .grid-cell.hovered .cell-dot {
      opacity: 0;
      transform: rotate(90deg) scale(0);
      animation: none;
    }
    .grid-cell:not(.hovered):not(.open) .cell-dot {
      transform: rotate(0deg) scale(1);
    }
    .grid-cell.open .cell-dot {
      opacity: 0;
      transform: rotate(180deg) scale(0);
      animation: none;
    }

    .cell-name {
      position: absolute;
      bottom: 0; left: 0; right: 0;
      font-size: 6px;
      font-weight: 700;
      letter-spacing: 0.06em;
      text-transform: uppercase;
      text-align: center;
      color: var(--paper);
      background: linear-gradient(transparent, rgba(0,0,0,0.55));
      padding: 6px 3px 3px;
      pointer-events: none;
      animation: nameIn 0.15s ease-out;
      line-height: 1.2;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      z-index: 2;
    }
    @keyframes nameIn {
      from { opacity: 0; transform: translateY(2px); }
      to { opacity: 0.75; transform: translateY(0); }
    }

    .cell-thumb {
      position: absolute;
      inset: 0;
      animation: thumbIn 0.3s ease-out forwards;
    }
    @keyframes thumbIn {
      from { opacity: 0; transform: scale(0.7) rotate(3deg); }
      to { opacity: 1; transform: scale(1) rotate(0deg); }
    }
    .cell-img {
      position: absolute;
      inset: 0;
      background-image: var(--cell-bg);
      background-size: cover;
      background-position: center;
      transition: transform 0.3s ease;
    }
    .grid-cell.open:hover .cell-img {
      transform: scale(1.06);
    }

    .ih-pagination {
      display: flex;
      justify-content: center;
      align-items: center;
      gap: 18px;
      padding: 8px 20px;
      font-size: 9px;
      letter-spacing: 0.15em;
      font-weight: 700;
      flex-shrink: 0;
    }
    .ih-page-btn {
      background: none;
      border: 1px solid rgba(255,255,255,0.1);
      color: var(--paper);
      font-family: inherit;
      font-size: 11px;
      padding: 4px 10px;
      cursor: pointer;
      transition: all 0.2s;
    }
    .ih-page-btn:hover:not(:disabled) {
      background: var(--a1); color: var(--ink); border-color: var(--a1);
    }
    .ih-page-btn:disabled { opacity: 0.12; cursor: default; }
    .ih-page-num { font-variant-numeric: tabular-nums; opacity: 0.3; }

    .ih-footer {
      padding: 10px 20px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 7px;
      letter-spacing: 0.2em;
      font-weight: 400;
      text-transform: uppercase;
      opacity: 0.2;
      flex-shrink: 0;
    }
    .ih-lang {
      display: flex; gap: 4px;
    }
    .ih-lang button {
      background: none; border: none; cursor: pointer;
      font-family: inherit; font-size: 8px; letter-spacing: 0.15em;
      color: var(--paper); opacity: 0.5; transition: opacity 0.2s;
      padding: 2px 4px; font-weight: 700;
    }
    .ih-lang button:hover, .ih-lang button.on { opacity: 1; }

    @media (max-width: 768px) {
      .ih-header {
        padding: 12px 14px 6px;
      }
      .ih-title { font-size: clamp(40px, 14vw, 72px); }
      .ih-title-row-sub { gap: 8px; }
      .ih-subtitle { font-size: 7px; white-space: normal; }
      .ih-nav {
        flex-direction: row;
        align-items: center;
        gap: 4px;
        flex-wrap: wrap;
      }
      .ih-nav-link { font-size: 12px; }
      .ih-works-dropdown {
        position: fixed;
        top: auto;
        bottom: 0;
        left: 0;
        right: 0;
        min-width: 100%;
        padding: 12px 0;
        padding-bottom: calc(12px + env(safe-area-inset-bottom));
        border-top: 2px solid var(--a1);
        z-index: 9999;
      }
      .ih-works-dropdown a {
        padding: 14px 20px;
        font-size: 15px;
      }
      .ih-grid-wrap { padding: 2px 10px; }
      .ih-grid { gap: 2px; }
      .cell-name { font-size: 5px; }
      .ih-footer { padding: 8px 14px; }
    }
  `;

  /* Render title letters */
  function renderLetters(text, startIndex) {
    var els = [];
    for (var i = 0; i < text.length; i++) {
      var gi = startIndex + i;
      var isTouched = !!touchedLetters[gi];
      var hoverColor = useConfigColors && titleLetterColorsConfig[gi]
        ? titleLetterColorsConfig[gi]
        : letterColors[gi % letterColors.length];
      /* If config has a static color for this letter, always show it */
      var staticColor = useConfigColors && titleLetterColorsConfig[gi] ? titleLetterColorsConfig[gi] : null;
      els.push(
        React.createElement("span", {
          key: gi,
          className: "ih-title-letter" + (isTouched ? " touched" : ""),
          style: { color: isTouched ? hoverColor : (staticColor || "inherit") },
          onMouseEnter: (function(idx) { return function() { handleLetterHover(idx); }; })(gi),
          onTouchStart: (function(idx) { return function() { handleLetterHover(idx); }; })(gi),
        }, text[i])
      );
    }
    return els;
  }

  return React.createElement("div", { className: "incendio-home" },
    React.createElement("style", null, css),

    /* ═══ HEADER ═══ */
    React.createElement("header", { className: "ih-header" },

      React.createElement("div", { className: "ih-brand" },
        React.createElement("h1", { className: "ih-title" },
          /* Line 1: INCENDIO */
          React.createElement("span", { className: "ih-title-row" }, renderLetters("INCENDIO", 0)),
          /* Line 2: 1987 + subtitle */
          React.createElement("span", { className: "ih-title-row ih-title-row-sub" },
            React.createElement("span", { className: "ih-year-letters" }, renderLetters("1987", 8)),
            React.createElement("span", { className: "ih-subtitle" }, i18n.hero_tag_a || t("hero_sub"))
          )
        )
      ),

      /* NAV — order: SHOP (gradient border), WORKS (dropdown), ABOUT, CONTACT */
      React.createElement("nav", { className: "ih-nav" },
        React.createElement("a", { className: "ih-nav-link ih-nav-shop", href: "#/shop" }, t("shop")),
        React.createElement("div", { className: "ih-works-wrap", ref: worksRef },
          React.createElement("button", {
            className: "ih-nav-link",
            onClick: function() { setWorksOpen(function(o) { return !o; }); },
          }, t("works") + " " + (worksOpen ? "\u25B4" : "\u25BE")),
          React.createElement("div", { className: "ih-works-dropdown" + (worksOpen ? " open" : "") },
            React.createElement("a", {
              href: "#/category/all",
              onClick: function() { setWorksOpen(false); },
            }, tweaks.lang === "es" ? "TODOS" : "ALL"),
            categories.map(function(cat) {
              return React.createElement("a", {
                key: cat,
                href: "#/category/" + cat.toLowerCase().replace(/[^a-z0-9]/g, "-"),
                onClick: function() { setWorksOpen(false); },
              }, cat);
            })
          )
        ),
        React.createElement("a", { className: "ih-nav-link", href: "#/about" }, t("about")),
        React.createElement("a", { className: "ih-nav-link", href: "#/contact" }, t("contact"))
      )
    ),

    /* ═══ GRID ═══ */
    React.createElement("div", { className: "ih-grid-wrap" },
      React.createElement("div", { className: "ih-grid" },
        pageProjects.map(function(proj, i) {
          return React.createElement(GridCell, {
            key: page + "-" + i,
            project: proj,
            index: i,
            openSet: openSet,
            onOpen: handleOpen,
            pal: pal,
          });
        })
      )
    ),

    /* ═══ PAGINATION ═══ */
    totalPages > 1 ? React.createElement("div", { className: "ih-pagination" },
      React.createElement("button", {
        className: "ih-page-btn",
        onClick: function() { setPage(function(p) { return Math.max(0, p - 1); }); },
        disabled: page === 0,
      }, "\u2190"),
      React.createElement("span", { className: "ih-page-num" }, (page + 1) + " / " + totalPages),
      React.createElement("button", {
        className: "ih-page-btn",
        onClick: function() { setPage(function(p) { return Math.min(totalPages - 1, p + 1); }); },
        disabled: page === totalPages - 1,
      }, "\u2192")
    ) : null,

    /* ═══ FOOTER ═══ */
    React.createElement("footer", { className: "ih-footer" },
      React.createElement("span", null, "\u00A9 INCENDIO 1987"),
      React.createElement("div", { className: "ih-lang" },
        React.createElement("button", {
          className: tweaks.lang === "es" ? "on" : "",
          onClick: function() { setTweak("lang", "es"); },
        }, "ES"),
        React.createElement("button", {
          className: tweaks.lang === "en" ? "on" : "",
          onClick: function() { setTweak("lang", "en"); },
        }, "EN")
      )
    ),

    /* Tweaks panel — only visible from manager */
    React.createElement(window.TweaksPanel, { title: "Tweaks" },
      React.createElement(window.TweakSection, { label: "Look" },
        React.createElement(window.TweakSelect, {
          label: "Paleta", value: tweaks.palette,
          onChange: function(v) { setTweak("palette", v); },
          options: palEntries.map(function(e) { return { value: e[0], label: e[0].toUpperCase() }; }),
        }),
        React.createElement(window.TweakRadio, {
          label: "Idioma", value: tweaks.lang,
          onChange: function(v) { setTweak("lang", v); },
          options: [{ value: "es", label: "ES" }, { value: "en", label: "EN" }],
        })
      )
    )
  );
}

window.HomeV2 = HomeV2;
