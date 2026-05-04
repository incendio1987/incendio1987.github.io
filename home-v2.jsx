/* ============================================================
   HOME v2 — Swiss Minimal Grid
   Interactive tile grid that reveals project thumbnails on hover/touch.
   INCENDIO 1987 portfolio.
   ============================================================ */

const PALETTES_HOME = {
  electric: { bg: "#1d1bff", paper: "#fffaee", ink: "#0a0a0a", accent1: "#ffd000", accent2: "#ff8de0", accent3: "#5ae3a4" },
  sunset:   { bg: "#ff5e9e", paper: "#fff7d6", ink: "#0a0a0a", accent1: "#ffd000", accent2: "#1d1bff", accent3: "#ff7a59" },
  acid:     { bg: "#16a34a", paper: "#fffaee", ink: "#0a0a0a", accent1: "#ffd000", accent2: "#ff5e9e", accent3: "#1d4ed8" },
  noir:     { bg: "#0a0a0a", paper: "#f4f1ea", ink: "#fffaee", accent1: "#ff1d58", accent2: "#ffd000", accent3: "#5ae3a4" },
  cream:    { bg: "#f6efde", paper: "#fffaee", ink: "#0c2340", accent1: "#c0392b", accent2: "#1e3a8a", accent3: "#d4a017" },
};

/* ─── i18n ─── */
const STRINGS = {
  works:    { es: "WORKS",    en: "WORKS" },
  shop:     { es: "SHOP",     en: "SHOP" },
  contact:  { es: "CONTACT",  en: "CONTACT" },
  about:    { es: "ABOUT",    en: "ABOUT" },
  hero_sub: { es: "Diseño, ilustración, código y caos curado.",
              en: "Design, illustration, code & curated chaos." },
  paleta:   { es: "PALETA",   en: "PALETTE" },
  page:     { es: "PÁG",      en: "PAGE" },
};
function makeT(lang) {
  return (key) => {
    const e = STRINGS[key]; if (!e) return key;
    return e[lang] || e.es || key;
  };
}

/* ─── Grid Cell — reveals project on hover/touch with color trail ─── */
function GridCell({ project, index, revealedSet, onReveal, pal, totalInPage }) {
  const cellRef = React.useRef(null);
  const [hovered, setHovered] = React.useState(false);
  const isRevealed = revealedSet.has(index);
  const hasProject = !!project;

  /* Color cycle for the trail effect */
  const colors = [pal.accent1, pal.accent2, pal.accent3];
  const trailColor = colors[index % colors.length];

  const handleInteraction = () => {
    if (hasProject) {
      onReveal(index);
    }
  };

  const handleClick = () => {
    if (hasProject && isRevealed) {
      window.location.hash = `#/project/${project.id}`;
    } else {
      handleInteraction();
    }
  };

  return (
    <div
      ref={cellRef}
      className={`grid-cell ${isRevealed ? 'revealed' : ''} ${hovered ? 'hovered' : ''} ${!hasProject ? 'empty' : ''}`}
      style={{
        '--trail-color': trailColor,
        '--cell-bg': hasProject && project.cover ? `url("${project.cover}")` : 'none',
      }}
      onMouseEnter={() => { setHovered(true); handleInteraction(); }}
      onMouseLeave={() => setHovered(false)}
      onTouchStart={handleInteraction}
      onClick={handleClick}
    >
      <div className="cell-inner">
        {/* Default state: small square */}
        <div className="cell-dot" />
        {/* Revealed state: project thumbnail */}
        {hasProject && (
          <div className="cell-reveal">
            <div className="cell-img" />
            <div className="cell-meta">
              <span className="cell-title">{project.title}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}


/* ─── MAIN HOME ─── */
function HomeV2() {
  const [tweaks, setTweak] = window.useTweaks(/*EDITMODE-BEGIN*/{
    "palette": "electric",
    "lang": "es"
  }/*EDITMODE-END*/);

  const t = makeT(tweaks.lang || "es");
  const pal = PALETTES_HOME[tweaks.palette] || PALETTES_HOME.electric;

  /* Load projects */
  const [projects, setProjects] = React.useState([]);
  const [siteData, setSiteData] = React.useState(null);
  React.useEffect(() => {
    (async () => {
      let data = window.__INCENDIO_DATA;
      if (!data) {
        try {
          const resp = await fetch("data.json");
          data = await resp.json();
          window.__INCENDIO_DATA = data;
        } catch(e) { data = {}; }
      }
      setSiteData(data);
      const projs = (data.projects || []).map(p => ({
        id: p.id,
        title: p.title || p.id,
        cat: p.category || "",
        year: p.year || "",
        cover: p.cover || "",
        contain: !!p.contain,
        featured: !!p.featured,
      }));
      setProjects(projs);
    })();
  }, []);

  /* i18n from data.json */
  const i18n = siteData?.i18n?.[tweaks.lang] || siteData?.i18n?.es || {};

  /* Pagination */
  const [isMobile, setIsMobile] = React.useState(window.innerWidth < 768);
  React.useEffect(() => {
    const handler = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handler);
    return () => window.removeEventListener('resize', handler);
  }, []);

  const COLS = isMobile ? 3 : 6;
  const ROWS = isMobile ? 7 : 4;
  const PER_PAGE = COLS * ROWS;
  const [page, setPage] = React.useState(0);
  const totalPages = Math.max(1, Math.ceil(projects.length / PER_PAGE));

  const pageProjects = React.useMemo(() => {
    const start = page * PER_PAGE;
    const slice = projects.slice(start, start + PER_PAGE);
    /* Pad to fill the grid */
    while (slice.length < PER_PAGE) slice.push(null);
    return slice;
  }, [projects, page, PER_PAGE]);

  /* Revealed cells tracking */
  const [revealedSet, setRevealedSet] = React.useState(new Set());
  React.useEffect(() => {
    setRevealedSet(new Set());
  }, [page]);

  const handleReveal = (index) => {
    setRevealedSet(prev => {
      const next = new Set(prev);
      next.add(index);
      return next;
    });
  };

  /* Palette entries for footer */
  const palEntries = Object.entries(PALETTES_HOME);

  /* Works dropdown */
  const [worksOpen, setWorksOpen] = React.useState(false);
  const worksRef = React.useRef(null);
  React.useEffect(() => {
    const handler = (e) => {
      if (worksRef.current && !worksRef.current.contains(e.target)) {
        setWorksOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    document.addEventListener('touchstart', handler);
    return () => {
      document.removeEventListener('mousedown', handler);
      document.removeEventListener('touchstart', handler);
    };
  }, []);

  /* Get unique categories */
  const categories = React.useMemo(() => {
    const cats = new Set();
    projects.forEach(p => { if (p.cat) cats.add(p.cat); });
    return Array.from(cats);
  }, [projects]);

  const css = `
    @import url('https://fonts.googleapis.com/css2?family=Space+Mono:wght@400;700&display=swap');

    .incendio-home {
      --bg: ${pal.bg}; --paper: ${pal.paper}; --ink: ${pal.ink};
      --a1: ${pal.accent1}; --a2: ${pal.accent2}; --a3: ${pal.accent3};
      width: 100%; min-height: 100vh;
      background: var(--bg); color: var(--paper);
      font-family: "Space Mono", "Courier New", monospace;
      display: flex; flex-direction: column;
      overflow-x: hidden;
    }
    .incendio-home a { color: inherit; text-decoration: none; }

    /* ═══ HEADER ═══ */
    .ih-header {
      padding: 24px;
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
    }

    .ih-brand {
      flex: 1;
    }

    .ih-title {
      font-size: clamp(48px, 10vw, 120px);
      font-weight: 700;
      line-height: 0.85;
      letter-spacing: -0.04em;
      margin: 0;
      text-transform: uppercase;
      cursor: default;
      position: relative;
    }

    /* Rainbow trail on title letters */
    .ih-title-letter {
      display: inline-block;
      position: relative;
      transition: color 0.3s ease;
      cursor: crosshair;
    }
    .ih-title-letter.touched {
      animation: letterGlow 0.8s ease-out forwards;
    }
    @keyframes letterGlow {
      0% { filter: brightness(1); }
      30% { filter: brightness(1.5); }
      100% { filter: brightness(1); }
    }

    .ih-subtitle {
      font-size: clamp(10px, 1.4vw, 14px);
      font-weight: 400;
      letter-spacing: 0.05em;
      margin-top: 16px;
      opacity: 0.5;
      max-width: 400px;
      line-height: 1.5;
    }

    .ih-nav {
      display: flex;
      flex-direction: column;
      align-items: flex-end;
      gap: 6px;
      padding-top: 8px;
    }

    .ih-nav-link {
      font-size: 11px;
      font-weight: 700;
      letter-spacing: 0.2em;
      text-transform: uppercase;
      opacity: 0.6;
      transition: opacity 0.2s, color 0.2s;
      cursor: pointer;
      position: relative;
      background: none;
      border: none;
      color: var(--paper);
      font-family: inherit;
      padding: 4px 0;
    }
    .ih-nav-link:hover { opacity: 1; color: var(--a1); }

    /* Works dropdown */
    .ih-works-wrap { position: relative; }
    .ih-works-dropdown {
      position: absolute;
      top: 100%;
      right: 0;
      background: var(--paper);
      color: var(--ink);
      padding: 8px 0;
      min-width: 160px;
      z-index: 100;
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
      padding: 6px 16px;
      font-size: 10px;
      letter-spacing: 0.15em;
      text-transform: uppercase;
      color: var(--ink);
      transition: background 0.15s;
    }
    .ih-works-dropdown a:hover {
      background: var(--a1);
    }

    /* ═══ GRID ═══ */
    .ih-grid-wrap {
      flex: 1;
      padding: 16px 24px;
      display: flex;
      flex-direction: column;
    }

    .ih-grid {
      display: grid;
      grid-template-columns: repeat(${COLS}, 1fr);
      grid-template-rows: repeat(${ROWS}, 1fr);
      gap: 6px;
      flex: 1;
      min-height: 0;
      aspect-ratio: ${COLS}/${ROWS};
      max-height: calc(100vh - 320px);
      width: 100%;
      max-width: 900px;
      margin: 0 auto;
    }

    /* ── Grid Cell ── */
    .grid-cell {
      position: relative;
      overflow: hidden;
      cursor: pointer;
      border: 1px solid rgba(255,255,255,0.08);
      transition: border-color 0.3s;
      aspect-ratio: 1;
    }
    .grid-cell:hover { border-color: rgba(255,255,255,0.2); }
    .grid-cell.empty { cursor: default; opacity: 0.3; }

    .cell-inner {
      width: 100%; height: 100%;
      position: relative;
    }

    .cell-dot {
      position: absolute;
      top: 50%; left: 50%;
      width: 6px; height: 6px;
      transform: translate(-50%, -50%);
      background: var(--paper);
      opacity: 0.25;
      transition: opacity 0.3s, transform 0.5s, background 0.3s;
    }
    .grid-cell:hover .cell-dot {
      opacity: 0.6;
      background: var(--trail-color);
      transform: translate(-50%, -50%) scale(1.5);
    }
    .grid-cell.revealed .cell-dot {
      opacity: 0;
      transform: translate(-50%, -50%) scale(0);
    }

    .cell-reveal {
      position: absolute;
      inset: 0;
      opacity: 0;
      transform: scale(0.85);
      transition: opacity 0.4s ease, transform 0.4s ease;
    }
    .grid-cell.revealed .cell-reveal {
      opacity: 1;
      transform: scale(1);
    }

    .cell-img {
      position: absolute;
      inset: 0;
      background-image: var(--cell-bg);
      background-size: cover;
      background-position: center;
      transition: transform 0.4s ease;
    }
    .grid-cell.revealed:hover .cell-img {
      transform: scale(1.05);
    }

    .cell-meta {
      position: absolute;
      bottom: 0; left: 0; right: 0;
      padding: 6px 8px;
      background: linear-gradient(transparent, rgba(0,0,0,0.7));
      opacity: 0;
      transform: translateY(4px);
      transition: opacity 0.3s, transform 0.3s;
    }
    .grid-cell.revealed:hover .cell-meta {
      opacity: 1;
      transform: translateY(0);
    }
    .cell-title {
      font-size: 9px;
      font-weight: 700;
      letter-spacing: 0.1em;
      text-transform: uppercase;
      color: #fff;
    }

    /* ═══ PAGINATION ═══ */
    .ih-pagination {
      display: flex;
      justify-content: center;
      align-items: center;
      gap: 24px;
      padding: 16px 24px;
      font-size: 10px;
      letter-spacing: 0.2em;
      font-weight: 700;
      text-transform: uppercase;
    }
    .ih-page-btn {
      background: none;
      border: 1px solid rgba(255,255,255,0.15);
      color: var(--paper);
      font-family: inherit;
      font-size: 11px;
      padding: 6px 12px;
      cursor: pointer;
      transition: all 0.2s;
      letter-spacing: 0.1em;
    }
    .ih-page-btn:hover:not(:disabled) {
      background: var(--a1);
      color: var(--ink);
      border-color: var(--a1);
    }
    .ih-page-btn:disabled {
      opacity: 0.2;
      cursor: default;
    }
    .ih-page-num {
      font-variant-numeric: tabular-nums;
      opacity: 0.5;
    }

    /* ═══ FOOTER ═══ */
    .ih-footer {
      padding: 16px 24px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 9px;
      letter-spacing: 0.2em;
      font-weight: 400;
      text-transform: uppercase;
      opacity: 0.4;
      border-top: 1px solid rgba(255,255,255,0.06);
    }

    .ih-palette {
      display: flex; gap: 6px; align-items: center;
    }
    .ih-palette-dot {
      width: 12px; height: 12px;
      cursor: pointer;
      border: 1px solid rgba(255,255,255,0.3);
      transition: transform 0.2s;
      display: inline-block;
    }
    .ih-palette-dot:hover { transform: scale(1.3); }
    .ih-palette-dot.active { outline: 2px solid var(--a1); outline-offset: 2px; }

    .ih-lang {
      display: flex; gap: 4px;
    }
    .ih-lang button {
      background: none; border: none; cursor: pointer;
      font-family: inherit; font-size: 10px; letter-spacing: 0.15em;
      color: var(--paper); opacity: 0.4; transition: opacity 0.2s;
      padding: 2px 4px; font-weight: 700;
    }
    .ih-lang button:hover, .ih-lang button.on { opacity: 1; }

    /* ═══ RESPONSIVE ═══ */
    @media (max-width: 768px) {
      .ih-header { padding: 16px; flex-direction: column; }
      .ih-nav { flex-direction: row; gap: 12px; align-items: center; margin-top: 12px; }
      .ih-grid-wrap { padding: 8px 16px; }
      .ih-grid { max-height: calc(100vh - 280px); }
      .ih-footer { padding: 12px 16px; flex-direction: column; gap: 8px; }
      .ih-subtitle { margin-top: 10px; }
    }
  `;

  /* Title letter animation on hover */
  const titleText = "INCENDIO1987";
  const [touchedLetters, setTouchedLetters] = React.useState(new Set());
  const letterColors = [pal.accent1, pal.accent2, pal.accent3];

  const handleLetterHover = (idx) => {
    setTouchedLetters(prev => {
      const next = new Set(prev);
      next.add(idx);
      return next;
    });
    /* Reset after animation */
    setTimeout(() => {
      setTouchedLetters(prev => {
        const next = new Set(prev);
        next.delete(idx);
        return next;
      });
    }, 800);
  };

  return (
    <div className="incendio-home">
      <style>{css}</style>

      {/* ═══ HEADER ═══ */}
      <header className="ih-header">
        <div className="ih-brand">
          <h1 className="ih-title">
            {titleText.split("").map((ch, i) => (
              <span
                key={i}
                className={`ih-title-letter ${touchedLetters.has(i) ? 'touched' : ''}`}
                style={{
                  color: touchedLetters.has(i) ? letterColors[i % letterColors.length] : 'inherit',
                }}
                onMouseEnter={() => handleLetterHover(i)}
                onTouchStart={() => handleLetterHover(i)}
              >
                {ch}
              </span>
            ))}
          </h1>
          <p className="ih-subtitle">{i18n.hero_tag_a || t("hero_sub")}</p>
        </div>

        <nav className="ih-nav">
          <div className="ih-works-wrap" ref={worksRef}>
            <button
              className="ih-nav-link"
              onClick={() => setWorksOpen(o => !o)}
            >
              {t("works")} {worksOpen ? '▴' : '▾'}
            </button>
            <div className={`ih-works-dropdown ${worksOpen ? 'open' : ''}`}>
              <a href="#/category/all" onClick={() => setWorksOpen(false)}>
                {tweaks.lang === 'es' ? 'TODOS' : 'ALL'}
              </a>
              {categories.map(cat => (
                <a key={cat}
                   href={`#/category/${cat.toLowerCase().replace(/[^a-z0-9]/g, '-')}`}
                   onClick={() => setWorksOpen(false)}>
                  {cat}
                </a>
              ))}
            </div>
          </div>
          <a className="ih-nav-link" href="#/shop">{t("shop")}</a>
          <a className="ih-nav-link" href="#/about">{t("about")}</a>
          <a className="ih-nav-link" href="#/contact">{t("contact")}</a>
        </nav>
      </header>

      {/* ═══ GRID ═══ */}
      <div className="ih-grid-wrap">
        <div className="ih-grid">
          {pageProjects.map((proj, i) => (
            <GridCell
              key={`${page}-${i}`}
              project={proj}
              index={i}
              revealedSet={revealedSet}
              onReveal={handleReveal}
              pal={pal}
              totalInPage={PER_PAGE}
            />
          ))}
        </div>
      </div>

      {/* ═══ PAGINATION ═══ */}
      {totalPages > 1 && (
        <div className="ih-pagination">
          <button
            className="ih-page-btn"
            onClick={() => setPage(p => Math.max(0, p - 1))}
            disabled={page === 0}
          >
            ←
          </button>
          <span className="ih-page-num">
            {t("page")} {page + 1} / {totalPages}
          </span>
          <button
            className="ih-page-btn"
            onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))}
            disabled={page === totalPages - 1}
          >
            →
          </button>
        </div>
      )}

      {/* ═══ FOOTER ═══ */}
      <footer className="ih-footer">
        <span>© INCENDIO 1987</span>

        <div className="ih-palette">
          {palEntries.map(([key, p]) => (
            <span
              key={key}
              className={`ih-palette-dot ${tweaks.palette === key ? 'active' : ''}`}
              style={{ background: p.bg, borderColor: p.paper }}
              onClick={() => setTweak('palette', key)}
              title={key}
            />
          ))}
        </div>

        <div className="ih-lang">
          <button className={tweaks.lang === "es" ? "on" : ""} onClick={() => setTweak('lang', 'es')}>ES</button>
          <button className={tweaks.lang === "en" ? "on" : ""} onClick={() => setTweak('lang', 'en')}>EN</button>
        </div>
      </footer>

      <window.TweaksPanel title="Tweaks">
        <window.TweakSection label="Look">
          <window.TweakSelect label="Paleta" value={tweaks.palette}
            onChange={v => setTweak('palette', v)}
            options={palEntries.map(([k]) => ({ value: k, label: k.toUpperCase() }))} />
          <window.TweakRadio label="Idioma" value={tweaks.lang}
            onChange={v => setTweak('lang', v)}
            options={[{ value: "es", label: "ES" }, { value: "en", label: "EN" }]} />
        </window.TweakSection>
      </window.TweaksPanel>
    </div>
  );
}

window.HomeV2 = HomeV2;
