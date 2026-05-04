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
  return (key) => {
    const e = STRINGS[key]; if (!e) return key;
    return e[lang] || e.es || key;
  };
}

/* ─── Grid Cell ───
   States:
   1. Default: small dot
   2. Hover/touch: dot spins right + gradient color, shows project NAME
   3. Leave: reverts to dot (no name)
   4. Click: reveals thumbnail (stays open)
   5. Double-click or click on open thumbnail: navigate to project
*/
function GridCell({ project, index, openSet, onOpen, pal }) {
  const [hovered, setHovered] = React.useState(false);
  const isOpen = openSet.has(index);
  const hasProject = !!project;

  const colors = [pal.accent1, pal.accent2, pal.accent3];
  const c1 = colors[index % colors.length];
  const c2 = colors[(index + 1) % colors.length];

  const handleClick = () => {
    if (!hasProject) return;
    if (isOpen) {
      window.location.hash = `#/project/${project.id}`;
    } else {
      onOpen(index);
    }
  };

  const handleDoubleClick = () => {
    if (!hasProject) return;
    window.location.hash = `#/project/${project.id}`;
  };

  return (
    <div
      className={`grid-cell ${isOpen ? 'open' : ''} ${hovered ? 'hovered' : ''} ${!hasProject ? 'empty' : ''}`}
      style={{
        '--c1': c1,
        '--c2': c2,
        '--cell-bg': hasProject && project.cover ? `url("${project.cover}")` : 'none',
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onTouchStart={() => setHovered(true)}
      onTouchEnd={() => setTimeout(() => setHovered(false), 600)}
      onClick={handleClick}
      onDoubleClick={handleDoubleClick}
    >
      <div className="cell-dot" />

      {hasProject && hovered && !isOpen && (
        <div className="cell-name">{project.title}</div>
      )}

      {hasProject && isOpen && (
        <div className="cell-thumb">
          <div className="cell-img" />
        </div>
      )}
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

  const i18n = siteData?.i18n?.[tweaks.lang] || siteData?.i18n?.es || {};

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
    while (slice.length < PER_PAGE) slice.push(null);
    return slice;
  }, [projects, page, PER_PAGE]);

  const [openSet, setOpenSet] = React.useState(new Set());
  React.useEffect(() => { setOpenSet(new Set()); }, [page]);

  const handleOpen = (index) => {
    setOpenSet(prev => { const n = new Set(prev); n.add(index); return n; });
  };

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

  const categories = React.useMemo(() => {
    const cats = new Set();
    projects.forEach(p => { if (p.cat) cats.add(p.cat); });
    return Array.from(cats);
  }, [projects]);

  const palEntries = Object.entries(PALETTES_HOME);

  const [touchedLetters, setTouchedLetters] = React.useState(new Set());
  const letterColors = [pal.accent1, pal.accent2, pal.accent3];
  const handleLetterHover = (idx) => {
    setTouchedLetters(prev => { const n = new Set(prev); n.add(idx); return n; });
    setTimeout(() => {
      setTouchedLetters(prev => { const n = new Set(prev); n.delete(idx); return n; });
    }, 800);
  };

  const css = `
    @import url('https://fonts.googleapis.com/css2?family=Space+Mono:wght@400;700&display=swap');

    .incendio-home {
      --bg: ${pal.bg}; --paper: ${pal.paper}; --ink: ${pal.ink};
      --a1: ${pal.accent1}; --a2: ${pal.accent2}; --a3: ${pal.accent3};
      width: 100%; height: 100vh;
      background: var(--bg); color: var(--paper);
      font-family: "Space Mono", "Courier New", monospace;
      display: flex; flex-direction: column;
      overflow: hidden;
    }
    .incendio-home a { color: inherit; text-decoration: none; }

    /* ═══ HEADER ═══ */
    .ih-header {
      padding: 16px 20px 8px;
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
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
      letter-spacing: 0.06em;
      margin-top: 8px;
      opacity: 0.35;
      max-width: 300px;
      line-height: 1.5;
    }

    /* ═══ NAV ═══ */
    .ih-nav {
      display: flex;
      flex-direction: column;
      align-items: flex-end;
      gap: 0;
      padding-top: 4px;
    }

    .ih-nav-link {
      font-size: clamp(16px, 3vw, 24px);
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
      padding: 1px 0;
      text-align: right;
      line-height: 1.2;
    }
    .ih-nav-link:hover { opacity: 1; color: var(--a1); }

    /* Works dropdown */
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

    /* ═══ GRID ═══ */
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
      max-width: 760px;
      margin: 0 auto;
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
      width: 4px; height: 4px;
      background: var(--paper);
      opacity: 0.18;
      transition: transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1),
                  background 0.4s,
                  opacity 0.3s;
    }

    .grid-cell.hovered .cell-dot {
      opacity: 0.95;
      transform: rotate(90deg) scale(2);
      background: linear-gradient(135deg, var(--c1), var(--c2));
    }
    .grid-cell:not(.hovered):not(.open) .cell-dot {
      transform: rotate(0deg) scale(1);
      opacity: 0.18;
      background: var(--paper);
    }

    .grid-cell.open .cell-dot {
      opacity: 0;
      transform: rotate(180deg) scale(0);
    }

    .cell-name {
      position: absolute;
      bottom: 3px; left: 3px; right: 3px;
      font-size: 6px;
      font-weight: 700;
      letter-spacing: 0.06em;
      text-transform: uppercase;
      text-align: center;
      color: var(--paper);
      opacity: 0.75;
      pointer-events: none;
      animation: nameIn 0.15s ease-out;
      line-height: 1.2;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
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

    /* ═══ PAGINATION ═══ */
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

    /* ═══ FOOTER ═══ */
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

    /* ═══ MOBILE ═══ */
    @media (max-width: 768px) {
      .ih-header {
        padding: 12px 14px 6px;
        flex-direction: column;
        gap: 6px;
      }
      .ih-title { font-size: clamp(44px, 14vw, 80px); }
      .ih-nav {
        flex-direction: row;
        align-items: center;
        gap: 8px;
        flex-wrap: wrap;
      }
      .ih-nav-link { font-size: 14px; }

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
      .ih-subtitle { margin-top: 4px; }
    }
  `;

  return (
    <div className="incendio-home">
      <style>{css}</style>

      <header className="ih-header">
        <div className="ih-brand">
          <h1 className="ih-title">
            <span className="ih-title-row">
              {"INCENDIO".split("").map((ch, i) => (
                <span
                  key={`a${i}`}
                  className={`ih-title-letter ${touchedLetters.has(i) ? 'touched' : ''}`}
                  style={{ color: touchedLetters.has(i) ? letterColors[i % letterColors.length] : 'inherit' }}
                  onMouseEnter={() => handleLetterHover(i)}
                  onTouchStart={() => handleLetterHover(i)}
                >{ch}</span>
              ))}
            </span>
            <span className="ih-title-row">
              {"1987".split("").map((ch, i) => {
                const gi = i + 8;
                return (
                  <span
                    key={`b${i}`}
                    className={`ih-title-letter ${touchedLetters.has(gi) ? 'touched' : ''}`}
                    style={{ color: touchedLetters.has(gi) ? letterColors[gi % letterColors.length] : 'inherit' }}
                    onMouseEnter={() => handleLetterHover(gi)}
                    onTouchStart={() => handleLetterHover(gi)}
                  >{ch}</span>
                );
              })}
            </span>
          </h1>
          <p className="ih-subtitle">{i18n.hero_tag_a || t("hero_sub")}</p>
        </div>

        <nav className="ih-nav">
          <div className="ih-works-wrap" ref={worksRef}>
            <button className="ih-nav-link" onClick={() => setWorksOpen(o => !o)}>
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

      <div className="ih-grid-wrap">
        <div className="ih-grid">
          {pageProjects.map((proj, i) => (
            <GridCell
              key={`${page}-${i}`}
              project={proj}
              index={i}
              openSet={openSet}
              onOpen={handleOpen}
              pal={pal}
            />
          ))}
        </div>
      </div>

      {totalPages > 1 && (
        <div className="ih-pagination">
          <button className="ih-page-btn"
            onClick={() => setPage(p => Math.max(0, p - 1))}
            disabled={page === 0}>←</button>
          <span className="ih-page-num">{page + 1} / {totalPages}</span>
          <button className="ih-page-btn"
            onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))}
            disabled={page === totalPages - 1}>→</button>
        </div>
      )}

      <footer className="ih-footer">
        <span>© INCENDIO 1987</span>
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
