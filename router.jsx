/* ============================================================
   INCENDIO · Router + Pages
   Hash-based SPA router. No build step needed.
   Routes:
     #/                     → HomeV2
     #/project/<id>         → ProjectDetail (inline)
     #/category/<slug>      → CategoryPage
     #/about                → AboutPage
     #/contact              → ContactPage
     #/shop                 → ShopPage
   ============================================================ */

/* ─── SITE DATA (loaded from data.json) ─── */
window.__INCENDIO_DATA = null;

async function loadSiteData() {
  if (window.__INCENDIO_DATA) return window.__INCENDIO_DATA;
  try {
    const resp = await fetch("data.json");
    window.__INCENDIO_DATA = await resp.json();
  } catch (e) {
    console.warn("Could not load data.json, using defaults");
    window.__INCENDIO_DATA = {};
  }
  return window.__INCENDIO_DATA;
}

/* ─── SHARED PALETTES & i18n ─── */
const PALETTES_SHARED = {
  electric: { bg: "#1d1bff", paper: "#fffaee", ink: "#0a0a0a", accent1: "#ffd000", accent2: "#ff8de0", accent3: "#5ae3a4" },
  sunset:   { bg: "#ff5e9e", paper: "#fff7d6", ink: "#0a0a0a", accent1: "#ffd000", accent2: "#1d1bff", accent3: "#ff7a59" },
  acid:     { bg: "#16a34a", paper: "#fffaee", ink: "#0a0a0a", accent1: "#ffd000", accent2: "#ff5e9e", accent3: "#1d4ed8" },
  noir:     { bg: "#0a0a0a", paper: "#f4f1ea", ink: "#fffaee", accent1: "#ff1d58", accent2: "#ffd000", accent3: "#5ae3a4" },
  cream:    { bg: "#f6efde", paper: "#fffaee", ink: "#0c2340", accent1: "#c0392b", accent2: "#1e3a8a", accent3: "#d4a017" },
};

const STRINGS_SHARED = {
  work:        { es: "WORK",     en: "WORK" },
  about:       { es: "ABOUT",    en: "ABOUT" },
  contact:     { es: "CONTACT",  en: "CONTACT" },
  shop:        { es: "SHOP",     en: "SHOP" },
  paleta:      { es: "PALETA",   en: "PALETTE" },
  madrid:      { es: "MADRID · '26", en: "MADRID · '26" },
  volver:      { es: "← VOLVER", en: "← BACK" },
  todos:       { es: "TODOS",    en: "ALL" },
  proyectos:   { es: "PROYECTOS", en: "PROJECTS" },
  ver_proyecto:{ es: "VER PROYECTO →", en: "VIEW PROJECT →" },
  no_proyectos:{ es: "Aún no hay proyectos en esta categoría.", en: "No projects in this category yet." },
  hablemos:    { es: "HABLEMOS", en: "LET'S TALK" },
  enviar:      { es: "ENVIAR →", en: "SEND →" },
  nombre:      { es: "NOMBRE",   en: "NAME" },
  mensaje:     { es: "MENSAJE",  en: "MESSAGE" },
  asunto:      { es: "ASUNTO",   en: "SUBJECT" },
  sobre_mi:    { es: "SOBRE MÍ", en: "ABOUT ME" },
  skills:      { es: "HABILIDADES", en: "SKILLS" },
  herramientas:{ es: "HERRAMIENTAS", en: "TOOLS" },
  tienda:      { es: "TIENDA",   en: "SHOP" },
  comprar:     { es: "COMPRAR →", en: "BUY →" },
  sin_items:   { es: "La tienda está vacía por ahora. ¡Pronto habrá cosas!", en: "Shop is empty for now. Stay tuned!" },
  ilustracion: { es: "ilustración", en: "illustration" },
  webdev:      { es: "web/dev",  en: "web/dev" },
  branding:    { es: "branding", en: "branding" },
  ia_scripts:  { es: "ia/scripts", en: "ai/scripts" },
  poster:      { es: "poster",   en: "poster" },
};
function _t(key, lang) {
  const e = STRINGS_SHARED[key];
  if (!e) return key;
  return e[lang] || e.es || key;
}

/* ─── SHARED NAV BAR ─── */
function NavBar({ pal, lang, setLang, palette, setPalette, active }) {
  const navCss = `
    .nav-bar {
      position: sticky; top: 0; z-index: 50;
      display: flex; justify-content: space-between; align-items: center;
      padding: 18px 36px;
      font-size: 11px; letter-spacing: 0.3em; font-weight: 700;
      background: ${pal.bg};
      color: ${pal.paper};
      border-bottom: 1.5px solid rgba(255,255,255,0.12);
      font-family: "Helvetica Neue", "Helvetica", "Arial", sans-serif;
    }
    .nav-bar a { color: ${pal.paper}; text-decoration: none; cursor: pointer; transition: color 0.2s; }
    .nav-bar .logo { display: flex; align-items: center; gap: 10px; }
    .nav-bar .logo .o {
      width: 22px; height: 22px; border-radius: 50%;
      background: linear-gradient(135deg, ${pal.accent1}, ${pal.accent2});
      animation: navWob 5s ease-in-out infinite;
    }
    @keyframes navWob {
      0%,100% { border-radius: 50%; }
      50% { border-radius: 60% 40% 50% 50% / 55% 45% 55% 45%; }
    }
    .nav-bar nav { display: flex; gap: 22px; }
    .nav-bar nav a { padding-bottom: 4px; border-bottom: 2px solid transparent; transition: border 0.2s, color 0.2s; }
    .nav-bar nav a:hover, .nav-bar nav a.active { border-bottom-color: ${pal.accent1}; color: ${pal.accent1}; }
    .nav-bar .nav-right { display: flex; align-items: center; gap: 18px; }
    .nav-bar .nav-lang { display: flex; gap: 4px; }
    .nav-bar .nav-lang button {
      background: transparent; border: none; cursor: pointer; padding: 4px 6px;
      font-size: 16px; line-height: 1; opacity: 0.4; transition: opacity 0.2s, transform 0.2s;
      filter: grayscale(0.6);
    }
    .nav-bar .nav-lang button:hover { opacity: 1; transform: translateY(-2px); filter: grayscale(0); }
    .nav-bar .nav-lang button.on { opacity: 1; filter: grayscale(0); }
    .nav-bar .ham { display: none; flex-direction: column; gap: 4px; cursor: pointer; }
    .nav-bar .ham span { width: 22px; height: 2px; background: ${pal.paper}; display: block; }
    .nav-bar .ham span:nth-child(2) { width: 16px; }
    .nav-bar .ham span:nth-child(3) { width: 10px; }
    @media (max-width: 768px) {
      .nav-bar nav { display: none; }
      .nav-bar .ham { display: flex; }
    }
  `;

  return (
    <React.Fragment>
      <style>{navCss}</style>
      <header className="nav-bar">
        <a className="logo" href="#/" onClick={() => window.scrollTo(0,0)}>
          <span className="o" /> INCENDIO·1987
        </a>
        <nav>
          <a className={active === "work" ? "active" : ""} href="#/">{_t("work", lang)}</a>
          <a className={active === "shop" ? "active" : ""} href="#/shop">{_t("shop", lang)}</a>
          <a className={active === "about" ? "active" : ""} href="#/about">{_t("about", lang)}</a>
          <a className={active === "contact" ? "active" : ""} href="#/contact">{_t("contact", lang)}</a>
        </nav>
        <div className="nav-right">
          <div className="nav-lang">
            <button className={lang === "es" ? "on" : ""} onClick={() => setLang("es")} title="Español">🇪🇸</button>
            <button className={lang === "en" ? "on" : ""} onClick={() => setLang("en")} title="English">🇬🇧</button>
          </div>
          <div className="ham" aria-label="menu"><span/><span/><span/></div>
        </div>
      </header>
    </React.Fragment>
  );
}

/* ─── SHARED FOOTER ─── */
function SiteFooter({ pal, lang, palette, setPalette }) {
  const palEntries = Object.entries(PALETTES_SHARED);
  const footCss = `
    .site-foot {
      padding: 24px 36px;
      border-top: 1.5px solid rgba(255,255,255,0.18);
      display: flex; justify-content: space-between; align-items: center;
      font-size: 10px; letter-spacing: 0.35em; font-weight: 700;
      color: ${pal.paper}; background: ${pal.bg};
      font-family: "Helvetica Neue", "Helvetica", "Arial", sans-serif;
    }
    .site-foot a { color: ${pal.paper}; text-decoration: none; opacity: 0.85; }
    .site-foot a:hover { opacity: 1; color: ${pal.accent1}; }
    .site-foot .pal { display: flex; gap: 6px; align-items: center; }
    .site-foot .pal i {
      width: 16px; height: 16px; cursor: pointer;
      border: 1.5px solid ${pal.paper}; transition: transform 0.2s;
      display: inline-block;
    }
    .site-foot .pal i:hover { transform: translateY(-2px); }
    .site-foot .pal span { font-size: 9px; opacity: 0.5; margin-right: 6px; }
  `;

  return (
    <React.Fragment>
      <style>{footCss}</style>
      <footer className="site-foot">
        <span>© INCENDIO 1987</span>
        <a href="mailto:incendio1987@protonmail.com">INCENDIO1987@PROTONMAIL.COM</a>
        <div className="pal">
          <span>{_t("paleta", lang)}</span>
          {palEntries.map(([key, p]) => (
            <i key={key}
               style={{ background: p.bg, outline: palette === key ? `2px solid ${pal.accent1}` : "none", outlineOffset: 2 }}
               onClick={() => setPalette(key)} title={key} />
          ))}
        </div>
        <span>{_t("madrid", lang)}</span>
      </footer>
    </React.Fragment>
  );
}

/* ─── PAGE WRAPPER — consistent page chrome ─── */
function PageWrap({ pal, lang, setLang, palette, setPalette, active, children }) {
  return (
    <div style={{ width: "100%", background: pal.bg, minHeight: "100vh",
                  fontFamily: '"Helvetica Neue","Helvetica","Arial",sans-serif',
                  fontWeight: 900, letterSpacing: "-0.01em", color: pal.paper }}>
      <NavBar pal={pal} lang={lang} setLang={setLang} palette={palette} setPalette={setPalette} active={active} />
      {children}
      <SiteFooter pal={pal} lang={lang} palette={palette} setPalette={setPalette} />
    </div>
  );
}

/* ============================================================
   PAGE: ABOUT
   ============================================================ */
function AboutPage({ pal, lang, setLang, palette, setPalette, siteData }) {
  const about = siteData.about || {};
  const headline = about.headline || "soy INCENDIO. hago muchas cosas.";
  const blocks = about.blocks || [];

  const css = `
    .about-hero {
      padding: 80px 56px 60px;
      border-bottom: 2px solid rgba(255,255,255,0.15);
    }
    .about-hero h1 {
      font-size: clamp(48px, 7vw, 110px);
      line-height: 0.86; letter-spacing: -0.05em;
      margin: 0;
    }
    .about-hero h1 em { font-style: normal; color: ${pal.accent1}; }
    .about-body { padding: 60px 56px 80px; max-width: 900px; }
    .about-block { margin-bottom: 50px; }
    .about-block h2 {
      font-size: clamp(24px, 3vw, 40px);
      letter-spacing: -0.03em; line-height: 1;
      margin: 0 0 18px; color: ${pal.accent2};
    }
    .about-block p {
      font-size: 17px; line-height: 1.55; font-weight: 400;
      margin: 0 0 12px; letter-spacing: 0.01em;
    }
    .about-cloud {
      display: flex; flex-wrap: wrap; gap: 10px;
      padding: 12px 0;
    }
    .about-cloud .chip {
      padding: 10px 18px;
      border: 2px solid ${pal.ink};
      background: ${pal.paper}; color: ${pal.ink};
      font-size: 12px; letter-spacing: 0.2em; font-weight: 900;
      transition: transform 0.2s, box-shadow 0.2s;
    }
    .about-cloud .chip:nth-child(odd) { transform: rotate(-1deg); }
    .about-cloud .chip:nth-child(even) { transform: rotate(1.5deg); }
    .about-cloud .chip:hover {
      transform: translate(-2px,-2px) rotate(0deg);
      box-shadow: 4px 4px 0 ${pal.ink};
    }
    .about-tools {
      display: flex; flex-wrap: wrap; gap: 8px;
      padding: 12px 0;
    }
    .about-tools .tool {
      padding: 8px 14px;
      background: ${pal.accent3}; color: ${pal.ink};
      font-size: 11px; letter-spacing: 0.25em; font-weight: 900;
      border: 2px solid ${pal.ink};
    }
  `;

  return (
    <PageWrap pal={pal} lang={lang} setLang={setLang} palette={palette} setPalette={setPalette} active="about">
      <style>{css}</style>
      <section className="about-hero">
        <h1 dangerouslySetInnerHTML={{
          __html: headline.replace(/\b(INCENDIO)\b/g, '<em>$1</em>')
        }} />
      </section>
      <section className="about-body">
        {blocks.map((b, i) => {
          if (b.kind === "intro") return (
            <div key={i} className="about-block">
              <p>{b.text}</p>
            </div>
          );
          if (b.kind === "skills-cloud") return (
            <div key={i} className="about-block">
              <h2>{_t("skills", lang)}</h2>
              <div className="about-cloud">
                {(b.items || []).map((s, j) => <span key={j} className="chip">{s.toUpperCase()}</span>)}
              </div>
            </div>
          );
          if (b.kind === "tools") return (
            <div key={i} className="about-block">
              <h2>{_t("herramientas", lang)}</h2>
              <div className="about-tools">
                {(b.items || []).map((t, j) => <span key={j} className="tool">{t}</span>)}
              </div>
            </div>
          );
          return null;
        })}
        {blocks.length === 0 && (
          <div className="about-block">
            <p style={{ fontSize: 17, fontWeight: 400 }}>{headline}</p>
          </div>
        )}
      </section>
    </PageWrap>
  );
}

/* ============================================================
   PAGE: CONTACT
   ============================================================ */
function ContactPage({ pal, lang, setLang, palette, setPalette, siteData }) {
  const contact = siteData.contact || {};
  const email = contact.email || "incendio1987@protonmail.com";
  const social = contact.social || [];

  const css = `
    .contact-wrap {
      padding: 80px 56px 100px;
      display: grid; grid-template-columns: 1fr 1fr; gap: 80px;
      min-height: 70vh; align-items: start;
    }
    .contact-left h1 {
      font-size: clamp(48px, 7vw, 100px);
      line-height: 0.86; letter-spacing: -0.05em;
      margin: 0 0 30px;
    }
    .contact-left h1 em { font-style: normal; color: ${pal.accent1}; }
    .contact-email {
      display: inline-block; padding: 14px 24px;
      background: ${pal.accent1}; color: ${pal.ink};
      font-size: 14px; letter-spacing: 0.15em; font-weight: 900;
      border: 2px solid ${pal.ink};
      box-shadow: 4px 4px 0 ${pal.ink};
      text-decoration: none;
      transition: transform 0.2s, box-shadow 0.2s;
    }
    .contact-email:hover {
      transform: translate(-2px,-2px);
      box-shadow: 6px 6px 0 ${pal.ink};
    }
    .contact-social { margin-top: 40px; display: flex; flex-direction: column; gap: 8px; }
    .contact-social a {
      font-size: 18px; letter-spacing: 0.1em;
      padding: 8px 0;
      border-bottom: 1px solid rgba(255,255,255,0.15);
      color: ${pal.paper}; text-decoration: none;
      transition: color 0.2s, padding-left 0.2s;
    }
    .contact-social a:hover { color: ${pal.accent2}; padding-left: 8px; }
    .contact-right {
      padding-top: 20px;
    }
    .contact-form { display: flex; flex-direction: column; gap: 20px; }
    .contact-field label {
      display: block; font-size: 10px; letter-spacing: 0.3em;
      margin-bottom: 6px; opacity: 0.6;
    }
    .contact-field input, .contact-field textarea {
      width: 100%; background: transparent;
      border: none; border-bottom: 2px solid ${pal.paper};
      color: ${pal.paper}; font-family: inherit; font-weight: 700;
      font-size: 16px; padding: 8px 0;
      outline: none; transition: border-color 0.2s;
    }
    .contact-field input:focus, .contact-field textarea:focus {
      border-bottom-color: ${pal.accent1};
    }
    .contact-field textarea { resize: vertical; min-height: 100px; }
    .contact-send {
      display: inline-block; padding: 14px 28px;
      background: ${pal.paper}; color: ${pal.ink};
      font-size: 12px; letter-spacing: 0.25em; font-weight: 900;
      border: 2px solid ${pal.ink};
      cursor: pointer;
      transition: transform 0.2s, box-shadow 0.2s;
      align-self: flex-start;
    }
    .contact-send:hover {
      transform: translate(-2px,-2px);
      box-shadow: 4px 4px 0 ${pal.ink};
    }
    @media (max-width: 768px) {
      .contact-wrap { grid-template-columns: 1fr; gap: 50px; padding: 50px 24px 60px; }
    }
  `;

  const handleSubmit = (e) => {
    e.preventDefault();
    const form = e.target;
    const name = form.elements.name.value;
    const subject = form.elements.subject.value;
    const message = form.elements.message.value;
    const mailto = `mailto:${email}?subject=${encodeURIComponent(subject || "Hola INCENDIO")}&body=${encodeURIComponent(`De: ${name}\n\n${message}`)}`;
    window.open(mailto);
  };

  return (
    <PageWrap pal={pal} lang={lang} setLang={setLang} palette={palette} setPalette={setPalette} active="contact">
      <style>{css}</style>
      <section className="contact-wrap">
        <div className="contact-left">
          <h1><em>{_t("hablemos", lang)}</em></h1>
          <a className="contact-email" href={`mailto:${email}`}>{email.toUpperCase()}</a>
          {social.length > 0 && (
            <div className="contact-social">
              {social.map((s, i) => (
                <a key={i} href={s.href} target="_blank" rel="noreferrer">{s.label} →</a>
              ))}
            </div>
          )}
        </div>
        <div className="contact-right">
          <form className="contact-form" onSubmit={handleSubmit}>
            <div className="contact-field">
              <label>{_t("nombre", lang)}</label>
              <input name="name" type="text" autoComplete="name" />
            </div>
            <div className="contact-field">
              <label>{_t("asunto", lang)}</label>
              <input name="subject" type="text" />
            </div>
            <div className="contact-field">
              <label>{_t("mensaje", lang)}</label>
              <textarea name="message" rows="4" />
            </div>
            <button type="submit" className="contact-send">{_t("enviar", lang)}</button>
          </form>
        </div>
      </section>
    </PageWrap>
  );
}

/* ============================================================
   PAGE: SHOP
   ============================================================ */
function ShopPage({ pal, lang, setLang, palette, setPalette, siteData }) {
  const shop = siteData.shop || {};
  const items = shop.items || [];

  const css = `
    .shop-head {
      padding: 80px 56px 50px;
      border-bottom: 2px solid rgba(255,255,255,0.15);
    }
    .shop-head h1 {
      font-size: clamp(48px, 7vw, 110px);
      line-height: 0.86; letter-spacing: -0.05em; margin: 0;
    }
    .shop-head h1 em { font-style: normal; color: ${pal.accent2}; }
    .shop-grid {
      padding: 50px 56px 80px;
      display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
      gap: 20px;
    }
    .shop-item {
      border: 3px solid ${pal.ink};
      background: ${pal.paper}; color: ${pal.ink};
      overflow: hidden;
      transition: transform 0.3s cubic-bezier(0.34,1.4,0.64,1);
    }
    .shop-item:hover { transform: translate(-3px,-3px); box-shadow: 8px 8px 0 ${pal.ink}; }
    .shop-item .img {
      aspect-ratio: 1; background-size: cover; background-position: center;
      border-bottom: 2px solid ${pal.ink};
    }
    .shop-item .info { padding: 16px; }
    .shop-item .info .title { font-size: 18px; letter-spacing: -0.02em; display: block; margin-bottom: 6px; }
    .shop-item .info .price { font-size: 14px; color: ${pal.accent1}; letter-spacing: 0.1em; }
    .shop-item .info .buy {
      display: inline-block; margin-top: 12px; padding: 8px 16px;
      background: ${pal.ink}; color: ${pal.paper};
      font-size: 10px; letter-spacing: 0.3em; font-weight: 900;
      text-decoration: none; border: none; cursor: pointer;
      transition: background 0.2s;
    }
    .shop-item .info .buy:hover { background: ${pal.accent1}; color: ${pal.ink}; }
    .shop-empty {
      padding: 100px 56px; text-align: center;
      font-size: 18px; font-weight: 400; opacity: 0.6;
    }
  `;

  return (
    <PageWrap pal={pal} lang={lang} setLang={setLang} palette={palette} setPalette={setPalette} active="shop">
      <style>{css}</style>
      <section className="shop-head">
        <h1><em>{_t("tienda", lang)}</em></h1>
      </section>
      {items.length > 0 ? (
        <section className="shop-grid">
          {items.map((item, i) => (
            <div key={item.id || i} className="shop-item">
              {item.image && <div className="img" style={{ backgroundImage: `url(${item.image})` }} />}
              <div className="info">
                <span className="title">{item.title}</span>
                {item.price && <span className="price">{item.price}</span>}
                {item.buyHref && <a className="buy" href={item.buyHref} target="_blank" rel="noreferrer">{_t("comprar", lang)}</a>}
              </div>
            </div>
          ))}
        </section>
      ) : (
        <div className="shop-empty">{_t("sin_items", lang)}</div>
      )}
    </PageWrap>
  );
}

/* ============================================================
   PAGE: CATEGORY
   ============================================================ */
function CategoryPage({ pal, lang, setLang, palette, setPalette, siteData, categorySlug }) {
  const projects = (siteData.projects || []);

  /* Map slugs to category names for filtering */
  const SLUG_TO_CAT = {
    "illustration": ["ILLUSTRATION"],
    "web-dev": ["WEB/DEV", "WEB / DEV"],
    "branding": ["BRANDING"],
    "ia-scripts": ["IA/SCRIPTS", "IA / SCRIPTS"],
    "poster": ["POSTER"],
    "shop": ["SHOP"],
  };

  const catNames = SLUG_TO_CAT[categorySlug] || [categorySlug.toUpperCase()];
  const filtered = categorySlug === "all"
    ? projects
    : projects.filter(p => catNames.some(c => (p.category || "").toUpperCase() === c.toUpperCase()));

  const catTitle = categorySlug === "all" ? _t("todos", lang) : categorySlug.replace(/-/g, " ");

  const css = `
    .cat-head {
      padding: 80px 56px 50px;
      border-bottom: 2px solid rgba(255,255,255,0.15);
    }
    .cat-head h1 {
      font-size: clamp(48px, 7vw, 100px);
      line-height: 0.86; letter-spacing: -0.05em; margin: 0;
    }
    .cat-head h1 em { font-style: normal; color: ${pal.accent1}; }
    .cat-head .count {
      font-size: 12px; letter-spacing: 0.3em; font-weight: 700;
      margin-top: 16px; opacity: 0.6;
    }
    .cat-back {
      display: inline-block; padding: 16px 56px 0;
      font-size: 11px; letter-spacing: 0.3em; font-weight: 700;
      color: ${pal.paper}; text-decoration: none;
      opacity: 0.7; transition: opacity 0.2s, color 0.2s;
    }
    .cat-back:hover { opacity: 1; color: ${pal.accent1}; }
    .cat-grid {
      padding: 40px 56px 80px;
      display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: 20px;
    }
    .cat-card {
      border: 3px solid ${pal.ink};
      background: ${pal.paper}; color: ${pal.ink};
      overflow: hidden; cursor: pointer;
      transition: transform 0.35s cubic-bezier(0.34,1.4,0.64,1);
      text-decoration: none;
    }
    .cat-card:hover { transform: translate(-3px,-3px); box-shadow: 8px 8px 0 ${pal.ink}; }
    .cat-card .img {
      aspect-ratio: 4/5; background-size: cover; background-position: center;
      border-bottom: 2px solid ${pal.ink};
    }
    .cat-card .img.contain {
      background-size: contain; background-repeat: no-repeat;
      background-color: ${pal.accent1};
    }
    .cat-card .meta {
      padding: 14px 16px;
      display: flex; justify-content: space-between; align-items: baseline;
    }
    .cat-card .meta .t { font-size: 18px; letter-spacing: -0.02em; }
    .cat-card .meta .y { font-size: 9px; letter-spacing: 0.3em; opacity: 0.6; font-weight: 700; }
    .cat-empty { padding: 80px 56px; font-size: 16px; font-weight: 400; opacity: 0.5; }
  `;

  return (
    <PageWrap pal={pal} lang={lang} setLang={setLang} palette={palette} setPalette={setPalette} active="work">
      <style>{css}</style>
      <a className="cat-back" href="#/">{_t("volver", lang)}</a>
      <section className="cat-head">
        <h1><em>{catTitle}</em></h1>
        <div className="count">{filtered.length} {_t("proyectos", lang)}</div>
      </section>
      {filtered.length > 0 ? (
        <section className="cat-grid">
          {filtered.map(p => (
            <a key={p.id} className="cat-card" href={`#/project/${p.id}`}>
              <div className={`img ${p.contain ? "contain" : ""}`}
                   style={{ backgroundImage: `url(${p.cover})` }} />
              <div className="meta">
                <span className="t">{p.title}</span>
                <span className="y">{p.category} · '{(p.year||"").slice(-2)}</span>
              </div>
            </a>
          ))}
        </section>
      ) : (
        <div className="cat-empty">{_t("no_proyectos", lang)}</div>
      )}
    </PageWrap>
  );
}

/* ============================================================
   PAGE: PROJECT DETAIL (inline — uses the same project-entry templates)
   ============================================================ */
function ProjectDetailPage({ pal, lang, setLang, palette, setPalette, siteData, projectId }) {
  const projects = siteData.projects || [];
  const idx = projects.findIndex(p => p.id === projectId);
  const project = projects[idx];

  if (!project) {
    return (
      <PageWrap pal={pal} lang={lang} setLang={setLang} palette={palette} setPalette={setPalette} active="work">
        <div style={{ padding: "100px 56px", fontSize: 18, fontWeight: 400, opacity: 0.5 }}>
          Proyecto no encontrado. <a href="#/" style={{ color: pal.accent1 }}>{_t("volver", lang)}</a>
        </div>
      </PageWrap>
    );
  }

  /* Build the data shape that ProjectEntry expects */
  const entryData = {
    ...project,
    ...(project.data || {}),
    prev: idx > 0 ? projects[idx - 1].id : null,
    next: idx < projects.length - 1 ? projects[idx + 1].id : null,
  };

  /* If ProjectEntry is available (loaded), render it; otherwise redirect to standalone HTML */
  if (window.ProjectEntry) {
    /* Override ProjectEntry's nav links to use hash routing */
    const overrideCss = `
      .pe-top .back { cursor: pointer; }
      .pe-foot .nav a { cursor: pointer; }
    `;

    return (
      <React.Fragment>
        <style>{overrideCss}</style>
        <div onClick={(e) => {
          const a = e.target.closest("a");
          if (!a) return;
          const href = a.getAttribute("href");
          if (href === "index.html" || href === "#/") {
            e.preventDefault();
            window.location.hash = "#/";
            window.scrollTo(0, 0);
          } else if (href && href.endsWith(".html") && !href.startsWith("http")) {
            e.preventDefault();
            const pid = href.replace(/\.html$/, "").replace(/^\.\.\/projects\//, "");
            window.location.hash = `#/project/${pid}`;
            window.scrollTo(0, 0);
          }
        }}>
          <window.ProjectEntry data={entryData} palette={palette} />
        </div>
      </React.Fragment>
    );
  } else {
    /* Fallback: redirect to standalone page */
    window.location.href = `projects/${projectId}.html`;
    return null;
  }
}


/* ============================================================
   ROUTER — hash-based SPA
   ============================================================ */
function IncendioRouter() {
  const [route, setRoute] = React.useState(window.location.hash || "#/");
  const [lang, setLang] = React.useState("es");
  const [palette, setPalette] = React.useState("electric");
  const [siteData, setSiteData] = React.useState(null);

  /* Load data.json on mount */
  React.useEffect(() => {
    loadSiteData().then(data => {
      setSiteData(data);
      if (data.site && data.site.defaultLang) setLang(data.site.defaultLang);
      if (data.site && data.site.defaultPalette) setPalette(data.site.defaultPalette);
    });
  }, []);

  /* Listen for hash changes */
  React.useEffect(() => {
    const handler = () => {
      setRoute(window.location.hash || "#/");
      window.scrollTo(0, 0);
    };
    window.addEventListener("hashchange", handler);
    return () => window.removeEventListener("hashchange", handler);
  }, []);

  if (!siteData) {
    return <div style={{ background: "#1d1bff", color: "#fffaee", height: "100vh",
                         display: "flex", alignItems: "center", justifyContent: "center",
                         fontFamily: '"Helvetica Neue",sans-serif', fontSize: 14,
                         letterSpacing: "0.3em", fontWeight: 700 }}>
      CARGANDO…
    </div>;
  }

  const pal = PALETTES_SHARED[palette] || PALETTES_SHARED.electric;
  const shared = { pal, lang, setLang, palette, setPalette, siteData };

  /* Parse route */
  const hash = route.replace(/^#\/?/, "");
  const parts = hash.split("/");

  if (parts[0] === "about") {
    document.body.style.background = pal.bg;
    return <AboutPage {...shared} />;
  }
  if (parts[0] === "contact") {
    document.body.style.background = pal.bg;
    return <ContactPage {...shared} />;
  }
  if (parts[0] === "shop") {
    document.body.style.background = pal.bg;
    return <ShopPage {...shared} />;
  }
  if (parts[0] === "category" && parts[1]) {
    document.body.style.background = pal.bg;
    return <CategoryPage {...shared} categorySlug={parts[1]} />;
  }
  if (parts[0] === "project" && parts[1]) {
    document.body.style.background = pal.bg;
    return <ProjectDetailPage {...shared} projectId={parts[1]} />;
  }

  /* Default: HOME — render HomeV2 if available */
  document.body.style.background = pal.bg;
  if (window.HomeV2) {
    return <window.HomeV2 />;
  }
  return <div style={{ padding: 60, color: pal.paper }}>Loading home…</div>;
}

window.IncendioRouter = IncendioRouter;
window.NavBar = NavBar;
window.SiteFooter = SiteFooter;
window.PageWrap = PageWrap;
window._t = _t;
window.PALETTES_SHARED = PALETTES_SHARED;
