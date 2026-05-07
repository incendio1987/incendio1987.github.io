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
  var touchStartRef = React.useRef({ x: 0, y: 0, time: 0 });

  var colors = [pal.accent1, pal.accent2, pal.accent3];
  var c1 = colors[index % colors.length];
  var c2 = colors[(index + 1) % colors.length];

  var handleClick = function() {
    if (!hasProject) return;
    // On desktop: always navigate. On mobile: only if thumb already showing
    if (!('ontouchstart' in window)) {
      window.location.hash = "#/project/" + project.id;
    } else {
      if (hovered) {
        window.location.hash = "#/project/" + project.id;
      }
    }
  };

  var handleTouchStart = function(e) {
    if (!hasProject) return;
    touchStartRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY, time: Date.now() };
    // Don't prevent default here — let scroll work
  };

  var handleTouchEnd = function(e) {
    if (!hasProject) return;
    var dx = Math.abs(e.changedTouches[0].clientX - touchStartRef.current.x);
    var dy = Math.abs(e.changedTouches[0].clientY - touchStartRef.current.y);
    var dt = Date.now() - touchStartRef.current.time;
    // If it was a swipe (moved >10px) ignore completely
    if (dx > 10 || dy > 10) return;
    // Short tap
    if (dt < 300) {
      e.preventDefault();
      if (!hovered) {
        // First tap: show thumbnail
        setHovered(true);
        // Auto-hide after 2.5s if no second tap
        setTimeout(function() { setHovered(false); }, 2500);
      } else {
        // Second tap on visible thumbnail: navigate
        window.location.hash = "#/project/" + project.id;
      }
    }
  };

  return React.createElement("div", {
    className: "grid-cell" + (isOpen ? " open" : "") + (hovered ? " hovered" : "") + (!hasProject ? " empty" : ""),
    style: { "--c1": c1, "--c2": c2, "--cell-bg": hasProject && project.cover ? 'url("' + project.cover + '")' : "none", "--pulse-delay": ((index * 0.31) % 2) + "s" },
    onMouseEnter: function() { if (hasProject) setHovered(true); },
    onMouseLeave: function() { setHovered(false); },
    onTouchStart: handleTouchStart,
    onTouchEnd: handleTouchEnd,
    onClick: handleClick,
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
    var excluded = ["shop", "SHOP", "Shop"];
    projects.forEach(function(p) {
      if (p.cat && !seen[p.cat] && excluded.indexOf(p.cat) === -1) {
        seen[p.cat] = true;
        cats.push(p.cat);
      }
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

  var css = "\n\
    .incendio-home {\n\
      --bg: " + pal.bg + "; --paper: " + pal.paper + "; --ink: " + pal.ink + ";\n\
      --a1: " + pal.accent1 + "; --a2: " + pal.accent2 + "; --a3: " + pal.accent3 + ";\n\
      width: 100%; height: 100vh;\n\
      background: var(--bg); color: var(--paper);\n\
      font-family: '" + fontFamily + "', 'Courier New', monospace;\n\
      display: flex; flex-direction: column;\n\
      overflow: hidden;\n\
    }\n\
    .incendio-home a { color: inherit; text-decoration: none; touch-action: manipulation; }\n\
    .incendio-home button { touch-action: manipulation; }\n\
\n\
    .ih-header {\n\
      padding: 16px 20px 8px;\n\
      display: flex;\n\
      justify-content: space-between;\n\
      align-items: flex-start;\n\
      gap: 16px;\n\
      flex-shrink: 0;\n\
    }\n\
    .ih-brand { flex-shrink: 0; }\n\
\n\
    .ih-title {\n\
      font-size: clamp(52px, 11vw, 130px);\n\
      font-weight: 700;\n\
      line-height: 0.82;\n\
      letter-spacing: -0.05em;\n\
      margin: 0;\n\
      text-transform: uppercase;\n\
      cursor: default;\n\
    }\n\
    .ih-title-row { display: block; }\n\
\n\
    /* Second row: 1987 + subtitle inline */\n\
    .ih-title-row-sub {\n\
      display: flex;\n\
      align-items: baseline;\n\
      gap: 12px;\n\
    }\n\
    .ih-title-row-sub .ih-year-letters {\n\
      display: inline;\n\
    }\n\
\n\
    .ih-title-letter {\n\
      display: inline-block;\n\
      transition: color 0.3s ease;\n\
      cursor: crosshair;\n\
    }\n\
    .ih-title-letter.touched {\n\
      animation: letterPop 0.8s ease-out forwards;\n\
    }\n\
    @keyframes letterPop {\n\
      0% { transform: scale(1); }\n\
      20% { transform: scale(1.1); }\n\
      100% { transform: scale(1); }\n\
    }\n\
\n\
    .ih-subtitle {\n\
      font-size: clamp(8px, 1vw, 11px);\n\
      font-weight: 400;\n\
      letter-spacing: 0.04em;\n\
      opacity: 0.35;\n\
      line-height: 1.3;\n\
      white-space: nowrap;\n\
      flex-shrink: 1;\n\
      min-width: 0;\n\
      overflow: hidden;\n\
      text-overflow: ellipsis;\n\
    }\n\
\n\
    .ih-nav {\n\
      display: flex;\n\
      flex-direction: column;\n\
      align-items: flex-end;\n\
      gap: 0;\n\
      padding-top: 4px;\n\
      justify-content: flex-end;\n\
    }\n\
    .ih-nav-link {\n\
      font-size: clamp(16px, 3vw, 24px);\n\
      font-weight: 700;\n\
      letter-spacing: 0.08em;\n\
      text-transform: uppercase;\n\
      opacity: 0.65;\n\
      transition: opacity 0.2s, color 0.2s;\n\
      cursor: pointer;\n\
      background: none;\n\
      border: none;\n\
      color: var(--paper);\n\
      font-family: inherit;\n\
      padding: 1px 0;\n\
      text-align: right;\n\
      line-height: 1.2;\n\
    }\n\
    .ih-nav-link:hover { opacity: 1; color: var(--a1); }\n\
\n\
    .ih-nav-shop {\n\
      position: relative;\n\
      opacity: 1 !important;\n\
      padding: 3px 10px;\n\
      color: var(--paper) !important;\n\
    }\n\
    .ih-nav-shop::before {\n\
      content: '';\n\
      position: absolute;\n\
      inset: 0;\n\
      border-radius: 2px;\n\
      padding: 1.5px;\n\
      background: linear-gradient(90deg, var(--a1), var(--a2), var(--a3), var(--a1));\n\
      background-size: 300% 100%;\n\
      -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);\n\
      -webkit-mask-composite: xor;\n\
      mask-composite: exclude;\n\
      animation: shopBorderRoll 2.5s linear infinite;\n\
      pointer-events: none;\n\
    }\n\
    @keyframes shopBorderRoll {\n\
      0% { background-position: 0% 50%; }\n\
      100% { background-position: 300% 50%; }\n\
    }\n\
    .ih-nav-shop:hover { color: var(--a1) !important; }\n\
\n\
    .ih-works-wrap { position: relative; }\n\
    .ih-works-dropdown {\n\
      position: absolute;\n\
      top: calc(100% + 2px);\n\
      right: 0;\n\
      background: var(--paper);\n\
      color: var(--ink);\n\
      padding: 4px 0;\n\
      min-width: 180px;\n\
      z-index: 200;\n\
      opacity: 0;\n\
      transform: translateY(-4px);\n\
      pointer-events: none;\n\
      transition: opacity 0.2s, transform 0.2s;\n\
    }\n\
    .ih-works-dropdown.open {\n\
      opacity: 1;\n\
      transform: translateY(0);\n\
      pointer-events: auto;\n\
    }\n\
    .ih-works-dropdown a {\n\
      display: block;\n\
      padding: 8px 16px;\n\
      font-size: 12px;\n\
      letter-spacing: 0.1em;\n\
      text-transform: uppercase;\n\
      color: var(--ink);\n\
      font-weight: 700;\n\
      transition: background 0.15s;\n\
    }\n\
    .ih-works-dropdown a:hover { background: var(--a1); }\n\
\n\
    .ih-grid-wrap {\n\
      flex: 1;\n\
      padding: 4px 20px;\n\
      display: flex;\n\
      flex-direction: column;\n\
      justify-content: center;\n\
      min-height: 0;\n\
    }\n\
    .ih-grid {\n\
      display: grid;\n\
      grid-template-columns: repeat(" + COLS + ", 1fr);\n\
      grid-template-rows: repeat(" + ROWS + ", 1fr);\n\
      gap: 3px;\n\
      width: 100%;\n\
      max-width: 760px;\n\
      margin: 0 auto;\n\
    }\n\
\n\
    .grid-cell {\n\
      position: relative;\n\
      overflow: hidden;\n\
      cursor: pointer;\n\
      border: 1px solid rgba(255,255,255,0.05);\n\
      aspect-ratio: 1;\n\
      display: flex;\n\
      align-items: center;\n\
      justify-content: center;\n\
      transition: border-color 0.3s;\n\
    }\n\
    .grid-cell.hovered { border-color: rgba(255,255,255,0.15); }\n\
    .grid-cell.empty { cursor: default; opacity: 0.12; }\n\
\n\
    .cell-dot {\n\
      width: " + gridDotSize + "px; height: " + gridDotSize + "px;\n\
      background: " + (gridDotColor || "var(--a1)") + ";\n\
      opacity: 0.75;\n\
      border-radius: 1px;\n\
      animation: dotPulse 2s ease-in-out var(--pulse-delay, 0s) infinite;\n\
      transition: opacity 0.3s;\n\
    }\n\
    @keyframes dotPulse {\n\
      0%, 100% { opacity: 0.75; transform: scale(1); }\n\
      50% { opacity: 1; transform: scale(1.8); }\n\
    }\n\
    .grid-cell.hovered .cell-dot {\n\
      opacity: 0;\n\
      transform: scale(0);\n\
      animation: none;\n\
    }\n\
    .grid-cell:not(.hovered):not(.open) .cell-dot {\n\
      transform: scale(1);\n\
    }\n\
    .grid-cell.open .cell-dot {\n\
      opacity: 0;\n\
      transform: scale(0);\n\
      animation: none;\n\
    }\n\
\n\
    .cell-name {\n\
      position: absolute;\n\
      bottom: 0; left: 0; right: 0;\n\
      font-size: 6px;\n\
      font-weight: 700;\n\
      letter-spacing: 0.06em;\n\
      text-transform: uppercase;\n\
      text-align: center;\n\
      color: var(--paper);\n\
      background: linear-gradient(transparent, rgba(0,0,0,0.6));\n\
      padding: 8px 3px 3px;\n\
      pointer-events: none;\n\
      animation: nameIn 0.15s ease-out;\n\
      line-height: 1.2;\n\
      overflow: hidden;\n\
      text-overflow: ellipsis;\n\
      white-space: nowrap;\n\
      z-index: 2;\n\
    }\n\
    @keyframes nameIn {\n\
      from { opacity: 0; transform: translateY(2px); }\n\
      to { opacity: 0.75; transform: translateY(0); }\n\
    }\n\
\n\
    .cell-thumb {\n\
      position: absolute;\n\
      inset: 0;\n\
      animation: thumbIn 0.3s ease-out forwards;\n\
    }\n\
    @keyframes thumbIn {\n\
      from { opacity: 0; transform: scale(0.7) rotate(3deg); }\n\
      to { opacity: 1; transform: scale(1) rotate(0deg); }\n\
    }\n\
    .cell-img {\n\
      position: absolute;\n\
      inset: 0;\n\
      background-image: var(--cell-bg);\n\
      background-size: cover;\n\
      background-position: center;\n\
      transition: transform 0.3s ease;\n\
    }\n\
    .grid-cell.open:hover .cell-img {\n\
      transform: scale(1.06);\n\
    }\n\
\n\
    .ih-pagination {\n\
      display: flex;\n\
      justify-content: center;\n\
      align-items: center;\n\
      gap: 18px;\n\
      padding: 8px 20px;\n\
      font-size: 9px;\n\
      letter-spacing: 0.15em;\n\
      font-weight: 700;\n\
      flex-shrink: 0;\n\
    }\n\
    .ih-page-btn {\n\
      background: none;\n\
      border: 1px solid rgba(255,255,255,0.1);\n\
      color: var(--paper);\n\
      font-family: inherit;\n\
      font-size: 11px;\n\
      padding: 4px 10px;\n\
      cursor: pointer;\n\
      transition: all 0.2s;\n\
    }\n\
    .ih-page-btn:hover:not(:disabled) {\n\
      background: var(--a1); color: var(--ink); border-color: var(--a1);\n\
    }\n\
    .ih-page-btn:disabled { opacity: 0.12; cursor: default; }\n\
    .ih-page-num { font-variant-numeric: tabular-nums; opacity: 0.3; }\n\
\n\
    .ih-footer {\n\
      padding: 10px 20px;\n\
      display: flex;\n\
      justify-content: space-between;\n\
      align-items: center;\n\
      font-size: 7px;\n\
      letter-spacing: 0.2em;\n\
      font-weight: 400;\n\
      text-transform: uppercase;\n\
      opacity: 0.2;\n\
      flex-shrink: 0;\n\
    }\n\
    .ih-lang {\n\
      display: flex; gap: 4px;\n\
    }\n\
    .ih-lang button {\n\
      background: none; border: none; cursor: pointer;\n\
      font-family: inherit; font-size: 8px; letter-spacing: 0.15em;\n\
      color: var(--paper); opacity: 0.5; transition: opacity 0.2s;\n\
      padding: 2px 4px; font-weight: 700;\n\
    }\n\
    .ih-lang button:hover, .ih-lang button.on { opacity: 1; }\n\
\n\
    @media (max-width: 768px) {\n\
      .incendio-home {\n\
        height: auto;\n\
        min-height: 100vh;\n\
        overflow: visible;\n\
      }\n\
      .ih-grid-wrap {\n\
        flex: none;\n\
        min-height: 50vw;\n\
        padding: 4px 10px 16px;\n\
      }\n\
      .ih-header {\n\
        padding: 10px 14px 6px;\n\
        flex-direction: column;\n\
        align-items: flex-start;\n\
        gap: 4px;\n\
      }\n\
      .ih-title { font-size: clamp(36px, 12vw, 60px); }\n\
      .ih-title-row-sub { gap: 8px; }\n\
      .ih-subtitle { font-size: 7px; white-space: normal; }\n\
      .ih-nav {\n\
        flex-direction: row;\n\
        align-items: center;\n\
        gap: 4px;\n\
        flex-wrap: wrap;\n\
        width: 100%;\n\
      }\n\
      .ih-nav-link {\n\
        font-size: 13px;\n\
        padding: 8px 8px;\n\
        min-height: 44px;\n\
        display: inline-flex;\n\
        align-items: center;\n\
      }\n\
      .ih-nav-shop { padding: 8px 10px; min-height: 44px; }\n\
      .ih-works-dropdown {\n\
        position: fixed;\n\
        top: auto;\n\
        bottom: 0;\n\
        left: 0;\n\
        right: 0;\n\
        min-width: 100%;\n\
        padding: 12px 0;\n\
        padding-bottom: calc(12px + env(safe-area-inset-bottom));\n\
        border-top: 2px solid var(--a1);\n\
        z-index: 9999;\n\
      }\n\
      .ih-works-dropdown a {\n\
        padding: 16px 20px;\n\
        font-size: 15px;\n\
        min-height: 44px;\n\
        display: flex;\n\
        align-items: center;\n\
        touch-action: manipulation;\n\
      }\n\
      .ih-grid { gap: 2px; }\n\
      .cell-name { font-size: 5px; }\n\
      .ih-footer { padding: 8px 14px; }\n\
    }\n\
  ";

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

      /* NAV */
      React.createElement("nav", { className: "ih-nav" },
        React.createElement("a", {
          className: "ih-nav-link ih-nav-shop",
          href: "#/shop",
          onClick: function(e) { e.preventDefault(); window.location.hash = "#/shop"; },
          onTouchEnd: function(e) { e.preventDefault(); window.location.hash = "#/shop"; }
        }, t("shop")),
        React.createElement("div", { className: "ih-works-wrap", ref: worksRef },
          React.createElement("button", {
            className: "ih-nav-link",
            onClick: function() { setWorksOpen(function(o) { return !o; }); },
            onTouchEnd: function(e) { e.stopPropagation(); }
          }, t("works") + " " + (worksOpen ? "\u25B4" : "\u25BE")),
          React.createElement("div", { className: "ih-works-dropdown" + (worksOpen ? " open" : "") },
            React.createElement("a", {
              href: "#/category/all",
              onClick: function(e) { e.preventDefault(); window.location.hash = "#/category/all"; setWorksOpen(false); },
              onTouchEnd: function(e) { e.preventDefault(); window.location.hash = "#/category/all"; setWorksOpen(false); }
            }, tweaks.lang === "es" ? "TODOS" : "ALL"),
            categories.map(function(cat) {
              var slug = "#/category/" + cat.toLowerCase().replace(/[^a-z0-9]/g, "-");
              return React.createElement("a", {
                key: cat,
                href: slug,
                onClick: function(e) { e.preventDefault(); window.location.hash = slug; setWorksOpen(false); },
                onTouchEnd: function(e) { e.preventDefault(); window.location.hash = slug; setWorksOpen(false); }
              }, cat);
            })
          )
        ),
        React.createElement("a", {
          className: "ih-nav-link",
          href: "#/contact",
          onClick: function(e) { e.preventDefault(); window.location.hash = "#/contact"; },
          onTouchEnd: function(e) { e.preventDefault(); window.location.hash = "#/contact"; }
        }, "CONTACT")
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
