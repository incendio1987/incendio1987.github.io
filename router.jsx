/* ============================================================
   INCENDIO · Router + Pages — REDESIGN
   Hash-based SPA router. Swiss minimal aesthetic.
   No @import (font loaded in index.html).
   ============================================================ */

window.__INCENDIO_DATA = null;

async function loadSiteData() {
  if (window.__INCENDIO_DATA) return window.__INCENDIO_DATA;
  try {
    const resp = await fetch("data.json");
    window.__INCENDIO_DATA = await resp.json();
  } catch (e) {
    console.warn("Could not load data.json");
    window.__INCENDIO_DATA = {};
  }
  return window.__INCENDIO_DATA;
}

const PALETTES_SHARED = {
  electric: { bg: "#1d1bff", paper: "#fffaee", ink: "#0a0a0a", accent1: "#ffd000", accent2: "#ff8de0", accent3: "#5ae3a4" },
  sunset:   { bg: "#ff5e9e", paper: "#fff7d6", ink: "#0a0a0a", accent1: "#ffd000", accent2: "#1d1bff", accent3: "#ff7a59" },
  acid:     { bg: "#16a34a", paper: "#fffaee", ink: "#0a0a0a", accent1: "#ffd000", accent2: "#ff5e9e", accent3: "#1d4ed8" },
  noir:     { bg: "#0a0a0a", paper: "#f4f1ea", ink: "#fffaee", accent1: "#ff1d58", accent2: "#ffd000", accent3: "#5ae3a4" },
  cream:    { bg: "#f6efde", paper: "#fffaee", ink: "#0c2340", accent1: "#c0392b", accent2: "#1e3a8a", accent3: "#d4a017" },
};

const STRINGS_SHARED = {
  work:        { es: "WORK",     en: "WORK" },
  works:       { es: "WORKS",    en: "WORKS" },
  about:       { es: "ABOUT",    en: "ABOUT" },
  contact:     { es: "CONTACT",  en: "CONTACT" },
  shop:        { es: "SHOP",     en: "SHOP" },
  volver:      { es: "← VOLVER", en: "← BACK" },
  home:        { es: "HOME",     en: "HOME" },
  todos:       { es: "TODOS",    en: "ALL" },
  proyectos:   { es: "PROYECTOS", en: "PROJECTS" },
  no_proyectos:{ es: "Aún no hay proyectos en esta categoría.", en: "No projects in this category yet." },
  skills:      { es: "HABILIDADES", en: "SKILLS" },
  herramientas:{ es: "HERRAMIENTAS", en: "TOOLS" },
  comprar:     { es: "COMPRAR →", en: "BUY →" },
  sin_items:   { es: "La tienda está vacía por ahora.", en: "Shop is empty for now." },
};
function _t(key, lang) {
  const e = STRINGS_SHARED[key];
  if (!e) return key;
  return e[lang] || e.es || key;
}

/* ─── Page CSS ─── */
function pageStyles(pal) {
  return `
    .page-wrap {
      width: 100%; min-height: 100vh;
      background: ${pal.bg}; color: ${pal.paper};
      font-family: "Space Mono", "Courier New", monospace;
      font-weight: 400;
    }
    .page-wrap a { color: inherit; text-decoration: none; }
    .page-nav {
      position: sticky; top: 0; z-index: 50;
      display: flex; justify-content: space-between; align-items: center;
      padding: 16px 24px;
      font-size: 10px; letter-spacing: 0.2em; font-weight: 700;
      background: ${pal.bg};
      border-bottom: 1px solid rgba(255,255,255,0.06);
      text-transform: uppercase;
    }
    .page-nav .logo { transition: color 0.2s; }
    .page-nav .logo:hover { color: ${pal.accent1}; }
    .page-nav nav { display: flex; gap: 16px; }
    .page-nav nav a { opacity: 0.5; transition: opacity 0.2s, color 0.2s; }
    .page-nav nav a:hover, .page-nav nav a.active { opacity: 1; color: ${pal.accent1}; }
    .page-nav .nav-right { display: flex; gap: 8px; align-items: center; }
    .page-nav .nav-right button {
      background: none; border: none; color: ${pal.paper};
      font-family: inherit; font-size: 10px; letter-spacing: 0.15em;
      cursor: pointer; opacity: 0.4; transition: opacity 0.2s; font-weight: 700; padding: 2px 4px;
    }
    .page-nav .nav-right button:hover, .page-nav .nav-right button.on { opacity: 1; }
    @media (max-width: 768px) { .page-nav nav { display: none; } }
    .page-foot {
      padding: 24px;
      border-top: 1px solid rgba(255,255,255,0.06);
      display: flex; justify-content: space-between; align-items: center;
      font-size: 9px; letter-spacing: 0.2em; text-transform: uppercase; opacity: 0.3;
    }
    .page-content {
      max-width: 900px; margin: 0 auto; padding: 60px 24px 80px;
    }
    .page-content h1 {
      font-size: clamp(36px, 6vw, 72px); font-weight: 700;
      line-height: 0.9; letter-spacing: -0.04em; margin: 0 0 40px; text-transform: uppercase;
    }
  `;
}

function NavBar({ pal, lang, setLang, active }) {
  return (
    <header className="page-nav">
      <a className="logo" href="#/">INCENDIO·1987</a>
      <nav>
        <a className={active === "work" ? "active" : ""} href="#/">{_t("work", lang)}</a>
        <a className={active === "shop" ? "active" : ""} href="#/shop">{_t("shop", lang)}</a>
        <a className={active === "about" ? "active" : ""} href="#/about">{_t("about", lang)}</a>
        <a className={active === "contact" ? "active" : ""} href="#/contact">{_t("contact", lang)}</a>
      </nav>
      <div className="nav-right">
        <button className={lang === "es" ? "on" : ""} onClick={() => setLang("es")}>ES</button>
        <button className={lang === "en" ? "on" : ""} onClick={() => setLang("en")}>EN</button>
      </div>
    </header>
  );
}

function SiteFooter({ pal }) {
  return (
    <footer className="page-foot">
      <span>© INCENDIO 1987</span>
    </footer>
  );
}

function PageWrap({ pal, lang, setLang, palette, setPalette, active, children }) {
  return (
    <div className="page-wrap">
      <style>{pageStyles(pal)}</style>
      <NavBar pal={pal} lang={lang} setLang={setLang} active={active} />
      {children}
      <SiteFooter pal={pal} />
    </div>
  );
}

/* ── ABOUT ── */
function AboutPage({ pal, lang, setLang, palette, setPalette, siteData }) {
  const about = siteData.about || {};
  const blocks = about.blocks || [];
  const css = `
    .about-page .headline { font-size: clamp(24px, 3vw, 36px); font-weight: 700; line-height: 1.15; margin-bottom: 48px; letter-spacing: -0.02em; }
    .about-page .block { margin-bottom: 36px; }
    .about-page .block-label { font-size: 9px; letter-spacing: 0.25em; text-transform: uppercase; opacity: 0.4; margin-bottom: 12px; font-weight: 700; }
    .about-page .block-text { font-size: 14px; line-height: 1.7; opacity: 0.8; }
    .about-page .tag-cloud { display: flex; flex-wrap: wrap; gap: 8px; }
    .about-page .tag { font-size: 11px; letter-spacing: 0.1em; padding: 6px 12px; border: 1px solid rgba(255,255,255,0.12); transition: all 0.2s; }
    .about-page .tag:hover { background: ${pal.accent1}; color: ${pal.ink}; border-color: ${pal.accent1}; }
  `;
  return (
    <PageWrap pal={pal} lang={lang} setLang={setLang} palette={palette} setPalette={setPalette} active="about">
      <style>{css}</style>
      <div className="page-content about-page">
        <h1>{_t("about", lang)}</h1>
        {about.headline && <p className="headline">{about.headline}</p>}
        {blocks.map((b, i) => (
          <div key={i} className="block">
            {b.kind === "intro" && (<><div className="block-label">Intro</div><div className="block-text">{b.text}</div></>)}
            {b.kind === "skills-cloud" && (<><div className="block-label">{_t("skills", lang)}</div><div className="tag-cloud">{(b.items || []).map((s, j) => <span key={j} className="tag">{s}</span>)}</div></>)}
            {b.kind === "tools" && (<><div className="block-label">{_t("herramientas", lang)}</div><div className="tag-cloud">{(b.items || []).map((s, j) => <span key={j} className="tag">{s}</span>)}</div></>)}
          </div>
        ))}
      </div>
    </PageWrap>
  );
}

/* ── CONTACT ── */
function ContactPage({ pal, lang, setLang, palette, setPalette, siteData }) {
  const contact = siteData.contact || {};
  const social = contact.social || [];
  const css = `
    .contact-page .email-link { font-size: clamp(16px, 2.5vw, 28px); font-weight: 700; display: inline-block; padding-bottom: 4px; border-bottom: 2px solid ${pal.accent1}; transition: color 0.2s; letter-spacing: -0.01em; }
    .contact-page .email-link:hover { color: ${pal.accent1}; }
    .contact-page .social-list { margin-top: 32px; display: flex; flex-direction: column; gap: 8px; }
    .contact-page .social-link { font-size: 12px; letter-spacing: 0.1em; opacity: 0.6; transition: opacity 0.2s, color 0.2s; }
    .contact-page .social-link:hover { opacity: 1; color: ${pal.accent1}; }
  `;
  return (
    <PageWrap pal={pal} lang={lang} setLang={setLang} palette={palette} setPalette={setPalette} active="contact">
      <style>{css}</style>
      <div className="page-content contact-page">
        <h1>{_t("contact", lang)}</h1>
        {contact.email && <a className="email-link" href={`mailto:${contact.email}`}>{contact.email}</a>}
        {social.length > 0 && (<div className="social-list">{social.map((s, i) => (<a key={i} className="social-link" href={s.href} target="_blank" rel="noreferrer">{s.label}</a>))}</div>)}
      </div>
    </PageWrap>
  );
}

/* ── SHOP ── */
function ShopPage({ pal, lang, setLang, palette, setPalette, siteData }) {
  const shop = siteData.shop || {};
  const items = shop.items || [];
  const css = `
    .shop-page .shop-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); gap: 16px; }
    .shop-page .shop-card { border: 1px solid rgba(255,255,255,0.08); transition: border-color 0.2s; overflow: hidden; }
    .shop-page .shop-card:hover { border-color: rgba(255,255,255,0.2); }
    .shop-page .shop-card .img { aspect-ratio: 1; background-size: cover; background-position: center; }
    .shop-page .shop-card .info { padding: 12px; }
    .shop-page .shop-card .info .title { font-size: 12px; font-weight: 700; letter-spacing: 0.05em; }
    .shop-page .shop-card .info .price { font-size: 11px; opacity: 0.5; margin-top: 4px; }
    .shop-page .shop-card .info .buy { display: inline-block; margin-top: 8px; font-size: 9px; letter-spacing: 0.2em; text-transform: uppercase; padding: 4px 10px; border: 1px solid ${pal.accent1}; color: ${pal.accent1}; transition: all 0.2s; }
    .shop-page .shop-card .info .buy:hover { background: ${pal.accent1}; color: ${pal.ink}; }
    .shop-page .empty { font-size: 14px; opacity: 0.5; }
  `;
  return (
    <PageWrap pal={pal} lang={lang} setLang={setLang} palette={palette} setPalette={setPalette} active="shop">
      <style>{css}</style>
      <div className="page-content shop-page">
        <h1>{_t("shop", lang)}</h1>
        {items.length > 0 ? (
          <div className="shop-grid">{items.map(item => (
            <div key={item.id} className="shop-card">
              {item.image && <div className="img" style={{ backgroundImage: `url(${item.image})` }} />}
              <div className="info">
                <div className="title">{item.title}</div>
                {item.price && <div className="price">{item.price}</div>}
                {item.buyHref && <a className="buy" href={item.buyHref} target="_blank" rel="noreferrer">{_t("comprar", lang)}</a>}
              </div>
            </div>
          ))}</div>
        ) : (<p className="empty">{_t("sin_items", lang)}</p>)}
      </div>
    </PageWrap>
  );
}

/* ── CATEGORY ── */
function CategoryPage({ pal, lang, setLang, palette, setPalette, siteData, categorySlug }) {
  const projects = siteData.projects || [];
  const filtered = categorySlug === "all" ? projects : projects.filter(function(p) {
    const cat = (p.category || "").toLowerCase().replace(/[^a-z0-9]/g, "-");
    return cat === categorySlug || cat.indexOf(categorySlug) !== -1;
  });
  const css = `
    .cat-page .cat-label { font-size: 10px; letter-spacing: 0.25em; text-transform: uppercase; opacity: 0.4; margin-bottom: 8px; }
    .cat-page .cat-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(260px, 1fr)); gap: 8px; margin-top: 32px; }
    .cat-page .cat-card { border: 1px solid rgba(255,255,255,0.08); overflow: hidden; transition: border-color 0.2s; display: block; }
    .cat-page .cat-card:hover { border-color: rgba(255,255,255,0.2); }
    .cat-page .cat-card .img { aspect-ratio: 4/3; background-size: cover; background-position: center; transition: transform 0.3s; }
    .cat-page .cat-card:hover .img { transform: scale(1.02); }
    .cat-page .cat-card .img.contain { background-size: contain; background-repeat: no-repeat; }
    .cat-page .cat-card .meta { padding: 10px 12px; display: flex; justify-content: space-between; align-items: center; }
    .cat-page .cat-card .meta .t { font-size: 11px; font-weight: 700; letter-spacing: 0.05em; text-transform: uppercase; }
    .cat-page .cat-card .meta .y { font-size: 9px; opacity: 0.4; letter-spacing: 0.15em; }
    .cat-page .cat-empty { font-size: 14px; opacity: 0.5; margin-top: 24px; }
  `;
  const displayName = categorySlug === "all" ? _t("todos", lang) : categorySlug.replace(/-/g, " ").toUpperCase();
  return (
    <PageWrap pal={pal} lang={lang} setLang={setLang} palette={palette} setPalette={setPalette} active="work">
      <style>{css}</style>
      <div className="page-content cat-page">
        <div className="cat-label">{_t("proyectos", lang)}</div>
        <h1>{displayName}</h1>
        {filtered.length > 0 ? (
          <section className="cat-grid">{filtered.map(p => (
            <a key={p.id} className="cat-card" href={`#/project/${p.id}`}>
              <div className={`img ${p.contain ? "contain" : ""}`} style={{ backgroundImage: `url(${p.cover})` }} />
              <div className="meta">
                <span className="t">{p.title}</span>
                <span className="y">{p.category} · '{(p.year||"").slice(-2)}</span>
              </div>
            </a>
          ))}</section>
        ) : (<div className="cat-empty">{_t("no_proyectos", lang)}</div>)}
      </div>
    </PageWrap>
  );
}

/* ── PROJECT DETAIL ── */
function ProjectDetailPage({ pal, lang, setLang, palette, setPalette, siteData, projectId }) {
  const projects = siteData.projects || [];
  const idx = projects.findIndex(p => p.id === projectId);
  const project = projects[idx];

  if (!project) {
    return (
      <PageWrap pal={pal} lang={lang} setLang={setLang} palette={palette} setPalette={setPalette} active="work">
        <div className="page-content">
          <p style={{ opacity: 0.5 }}>Proyecto no encontrado. <a href="#/" style={{ color: pal.accent1 }}>{_t("home", lang)}</a></p>
        </div>
      </PageWrap>
    );
  }

  const td = project.data || {};
  const cover = project.cover || "";
  const tmpl = project.template || "single-image";
  const defaults = {};

  switch (tmpl) {
    case "single-image":
      if (!td.image) defaults.image = cover; break;
    case "gallery":
      if (!td.images || td.images.length === 0) defaults.images = cover ? [cover] : []; break;
    case "object-text":
      if (!td.image) defaults.image = cover; break;
    case "long-read":
      if (!td.blocks || td.blocks.length === 0) defaults.blocks = cover ? [{ image: cover, full: true }] : []; break;
    case "showcase":
      if (!td.rows || td.rows.length === 0) defaults.rows = cover ? [{ image: cover, heading: project.title, text: "" }] : []; break;
    case "video":
      if (!td.poster && cover) defaults.poster = cover; break;
  }

  const entryData = { ...project, ...defaults, ...td,
    prev: idx > 0 ? projects[idx - 1].id : null,
    next: idx < projects.length - 1 ? projects[idx + 1].id : null,
  };

  if (window.ProjectEntry) {
    return (
      <div onClick={(e) => {
        const a = e.target.closest("a");
        if (!a) return;
        const href = a.getAttribute("href");
        if (href === "index.html" || href === "#/") {
          e.preventDefault(); window.location.hash = "#/"; window.scrollTo(0, 0);
        } else if (href && href.endsWith(".html") && !href.startsWith("http")) {
          e.preventDefault();
          const pid = href.replace(/\.html$/, "").replace(/^\.\.\/projects\//, "");
          window.location.hash = "#/project/" + pid; window.scrollTo(0, 0);
        }
      }}>
        <window.ProjectEntry data={entryData} palette={palette} />
      </div>
    );
  }
  window.location.href = "projects/" + projectId + ".html";
  return null;
}

/* ── ROUTER ── */
function IncendioRouter() {
  const [route, setRoute] = React.useState(window.location.hash || "#/");
  const [lang, setLang] = React.useState("es");
  const [palette, setPalette] = React.useState("electric");
  const [siteData, setSiteData] = React.useState(null);

  React.useEffect(() => {
    loadSiteData().then(data => {
      setSiteData(data);
      if (data.site && data.site.defaultLang) setLang(data.site.defaultLang);
      if (data.site && data.site.defaultPalette) setPalette(data.site.defaultPalette);
    });
  }, []);

  React.useEffect(() => {
    const handler = () => { setRoute(window.location.hash || "#/"); window.scrollTo(0, 0); };
    window.addEventListener("hashchange", handler);
    return () => window.removeEventListener("hashchange", handler);
  }, []);

  if (!siteData) {
    return <div style={{
      background: "#1d1bff", color: "#fffaee", height: "100vh",
      display: "flex", alignItems: "center", justifyContent: "center",
      fontFamily: '"Space Mono", monospace', fontSize: 12,
      letterSpacing: "0.3em", fontWeight: 700
    }}>LOADING…</div>;
  }

  const pal = PALETTES_SHARED[palette] || PALETTES_SHARED.electric;
  const shared = { pal, lang, setLang, palette, setPalette, siteData };
  const hash = route.replace(/^#\/?/, "");
  const parts = hash.split("/");

  document.body.style.background = pal.bg;

  if (parts[0] === "about") return <AboutPage {...shared} />;
  if (parts[0] === "contact") return <ContactPage {...shared} />;
  if (parts[0] === "shop") return <ShopPage {...shared} />;
  if (parts[0] === "category" && parts[1]) return <CategoryPage {...shared} categorySlug={parts[1]} />;
  if (parts[0] === "project" && parts[1]) return <ProjectDetailPage {...shared} projectId={parts[1]} />;

  document.body.style.background = pal.bg;
  if (window.HomeV2) return <window.HomeV2 />;
  return <div style={{ padding: 60, color: pal.paper }}>Loading…</div>;
}

window.IncendioRouter = IncendioRouter;
window.NavBar = NavBar;
window.SiteFooter = SiteFooter;
window.PageWrap = PageWrap;
window._t = _t;
window.PALETTES_SHARED = PALETTES_SHARED;
