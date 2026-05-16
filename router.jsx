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
    if (!resp.ok) throw new Error("HTTP " + resp.status);
    const text = await resp.text();
    // Guard against GitHub Pages returning an HTML 404 page
    if (!text.trim().startsWith("{")) throw new Error("Not JSON");
    window.__INCENDIO_DATA = JSON.parse(text);
  } catch (e) {
    console.warn("Could not load data.json:", e.message);
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
function pageStyles(pal, fontFamily) {
  var ff = fontFamily || "Space Mono";
  return `
    .page-wrap {
      width: 100%; min-height: 100vh;
      background: ${pal.bg}; color: ${pal.paper};
      font-family: "${ff}", "Courier New", monospace;
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
        <a className={active === "contact" ? "active" : ""} href="#/contact">CONTACT</a>
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

function PageWrap({ pal, lang, setLang, palette, setPalette, active, children, siteData }) {
  var fontFamily = (siteData && siteData.site && siteData.site.fontFamily) ? siteData.site.fontFamily : "Space Mono";
  return (
    <div className="page-wrap">
      <style>{pageStyles(pal, fontFamily)}</style>
      <NavBar pal={pal} lang={lang} setLang={setLang} active={active} />
      {children}
      <SiteFooter pal={pal} />
    </div>
  );
}

/* ── CONTACT (única página, lee todo de data.contact) ── */
function AboutPage({ pal, lang, setLang, palette, setPalette, siteData }) {
  // AboutPage kept as alias — renders ContactPage
  return <ContactPage pal={pal} lang={lang} setLang={setLang} palette={palette} setPalette={setPalette} siteData={siteData} />;
}

function ContactPage({ pal, lang, setLang, palette, setPalette, siteData }) {
  const c = siteData.contact || {};
  const social = c.social || [];
  const skills = c.skills || [];
  const tools = c.tools || [];

  const css = `
    .contact-page { max-width: 720px; margin: 0 auto; padding: 60px 24px 80px; }

    .contact-headline {
      font-size: clamp(28px, 4vw, 48px);
      font-weight: 700; line-height: 1.05;
      letter-spacing: -0.03em; margin: 0 0 12px;
    }
    .contact-headline em { font-style: normal; color: ${pal.accent1}; }

    .contact-intro {
      font-size: 15px; line-height: 1.75;
      opacity: 0.75; margin: 0 0 40px; max-width: 560px;
    }

    .contact-block {
      margin-bottom: 40px; padding-bottom: 40px;
      border-bottom: 1px solid rgba(255,255,255,0.08);
    }
    .contact-email {
      font-size: clamp(13px, 2vw, 18px); font-weight: 700;
      display: inline-block; padding-bottom: 3px;
      border-bottom: 2px solid ${pal.accent1};
      transition: color 0.2s; letter-spacing: -0.01em;
    }
    .contact-email:hover { color: ${pal.accent1}; }
    .contact-social { margin-top: 14px; display: flex; gap: 16px; flex-wrap: wrap; }
    .contact-social a {
      font-size: 10px; letter-spacing: 0.2em; opacity: 0.5;
      transition: opacity 0.2s; text-transform: uppercase;
      border-bottom: 1px solid transparent;
    }
    .contact-social a:hover { opacity: 1; color: ${pal.accent1}; border-bottom-color: ${pal.accent1}; }

    .contact-section { margin-bottom: 32px; }
    .contact-section-label {
      font-size: 9px; letter-spacing: 0.3em; text-transform: uppercase;
      opacity: 0.35; margin-bottom: 12px; font-weight: 700;
    }
    .tag-cloud { display: flex; flex-wrap: wrap; gap: 6px; }
    .tag {
      font-size: 11px; letter-spacing: 0.08em; padding: 5px 10px;
      border: 1px solid rgba(255,255,255,0.1); transition: all 0.2s;
    }
    .tag.link { cursor: pointer; }
    .tag.link:hover { background: ${pal.accent1}; color: ${pal.ink}; border-color: ${pal.accent1}; }

    @media (max-width: 600px) {
      .contact-page { padding: 40px 16px 60px; }
    }
  `;

  const headline = lang === "es" ? (c.headline_es || "") : (c.headline_en || "");
  const intro = lang === "es" ? (c.intro_es || "") : (c.intro_en || "");

  function safeHref(href) {
    if (!href) return "#";
    if (href.startsWith("http") || href.startsWith("mailto:")) return href;
    return "https://" + href;
  }

  return (
    <PageWrap siteData={siteData} pal={pal} lang={lang} setLang={setLang} palette={palette} setPalette={setPalette} active="contact">
      <style>{css}</style>
      <div className="contact-page">

        {headline && (
          <h1 className="contact-headline"
            dangerouslySetInnerHTML={{ __html: headline.replace(/\*(.*?)\*/g, `<em>$1</em>`) }} />
        )}

        {intro && <p className="contact-intro">{intro}</p>}

        <div className="contact-block">
          {c.email && <a className="contact-email" href={`mailto:${c.email}`}>{c.email}</a>}
          {social.length > 0 && (
            <div className="contact-social">
              {social.map((s, i) => (
                <a key={i} href={safeHref(s.href)} target="_blank" rel="noreferrer">{s.label}</a>
              ))}
            </div>
          )}
        </div>

        {skills.length > 0 && (
          <div className="contact-section">
            <div className="contact-section-label">{lang === "es" ? "HABILIDADES" : "SKILLS"}</div>
            <div className="tag-cloud">
              {skills.map((s, i) => (
                <a key={i} className="tag link"
                  href={`#/category/${s.toLowerCase().replace(/[^a-z0-9]/g, '-')}`}>{s}</a>
              ))}
            </div>
          </div>
        )}

        {tools.length > 0 && (
          <div className="contact-section">
            <div className="contact-section-label">{lang === "es" ? "HERRAMIENTAS" : "TOOLS"}</div>
            <div className="tag-cloud">
              {tools.map((s, i) => <span key={i} className="tag">{s}</span>)}
            </div>
          </div>
        )}

      </div>
    </PageWrap>
  );
}

/* ── SHOP ── */
const GOOGLE_FORM_URL = "https://docs.google.com/forms/d/e/1FAIpQLSc4HgVhBrjQMoW2p5-3JuF3RH3wicutIkQ_5euPVw8ZSO_J6A/formResponse";
const PAYPAL_EMAIL = "312rimini@gmail.com";

function generarOrderId() {
  return Math.floor(1000000 + Math.random() * 9000000).toString();
}

function ShopPage({ pal, lang, setLang, palette, setPalette, siteData }) {
  const shop = siteData.shop || {};
  const allItems = shop.items || [];
  const categories = React.useMemo(() => {
    const cats = ["all"];
    allItems.forEach(item => { if (item.category && !cats.includes(item.category)) cats.push(item.category); });
    return cats;
  }, [allItems]);

  const [activeCat, setActiveCat] = React.useState("all");
  const [catOpen, setCatOpen] = React.useState(false);
  const [selected, setSelected] = React.useState(null); // item seleccionado para compra
  const [step, setStep] = React.useState("grid"); // "grid" | "form" | "sending"
  const [form, setForm] = React.useState({ nombre: "", direccion: "", email: "" });
  const [errors, setErrors] = React.useState({});

  const items = activeCat === "all" ? allItems : allItems.filter(i => i.category === activeCat);

  const catLabel = activeCat === "all"
    ? (lang === "es" ? "TODOS" : "ALL")
    : activeCat.toUpperCase();

  function openItem(item) {
    if (item.sold) return;
    setSelected(item);
    setForm({ nombre: "", direccion: "", email: "" });
    setErrors({});
    setStep("form");
  }

  function closeForm() {
    setSelected(null);
    setStep("grid");
  }

  function validate() {
    const e = {};
    if (!form.nombre.trim()) e.nombre = true;
    if (!form.direccion.trim()) e.direccion = true;
    if (!form.email.trim() || !form.email.includes("@")) e.email = true;
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function handleCompra() {
    if (!validate()) return;
    setStep("sending");
    const orderId = generarOrderId();

    const params = new URLSearchParams();
    params.append("entry.484459052", form.nombre);
    params.append("entry.559425642", form.direccion);
    params.append("entry.1615188299", form.email);
    params.append("entry.1298772582", selected.id);
    params.append("entry.1738015936", orderId);

    const sent = navigator.sendBeacon(GOOGLE_FORM_URL, params);
    if (!sent) {
      fetch(GOOGLE_FORM_URL, { method: "POST", mode: "no-cors", body: params });
    }

    setTimeout(() => {
      const paypalUrl = `https://www.paypal.com/cgi-bin/webscr?cmd=_xclick&business=${PAYPAL_EMAIL}&item_name=${encodeURIComponent(selected.id)}&amount=${selected.amount}&currency_code=EUR&custom=${orderId}`;
      window.location.href = paypalUrl;
    }, 300);
  }

  const css = `
    .shop-page { max-width: 1100px; margin: 0 auto; padding: 48px 24px 80px; }
    .shop-header { display: flex; align-items: baseline; justify-content: space-between; margin-bottom: 40px; flex-wrap: wrap; gap: 16px; }
    .shop-title { font-size: clamp(36px, 6vw, 72px); font-weight: 700; line-height: 0.9; letter-spacing: -0.04em; text-transform: uppercase; margin: 0; }

    .shop-cat-wrap { position: relative; }
    .shop-cat-btn {
      background: none; border: 1px solid rgba(255,255,255,0.15); color: ${pal.paper};
      font-family: inherit; font-size: 10px; font-weight: 700; letter-spacing: 0.2em;
      text-transform: uppercase; padding: 8px 14px; cursor: pointer;
      display: flex; align-items: center; gap: 8px;
      transition: border-color 0.2s;
    }
    .shop-cat-btn:hover { border-color: ${pal.accent1}; color: ${pal.accent1}; }
    .shop-cat-dropdown {
      position: absolute; top: calc(100% + 4px); right: 0;
      background: ${pal.paper}; color: ${pal.ink};
      min-width: 160px; z-index: 100;
      opacity: 0; transform: translateY(-4px); pointer-events: none;
      transition: opacity 0.15s, transform 0.15s;
    }
    .shop-cat-dropdown.open { opacity: 1; transform: translateY(0); pointer-events: auto; }
    .shop-cat-dropdown button {
      display: block; width: 100%; text-align: left;
      background: none; border: none; cursor: pointer;
      font-family: inherit; font-size: 11px; font-weight: 700;
      letter-spacing: 0.15em; text-transform: uppercase;
      padding: 10px 16px; color: ${pal.ink};
      transition: background 0.1s;
    }
    .shop-cat-dropdown button:hover, .shop-cat-dropdown button.active { background: ${pal.accent1}; }

    .shop-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
      gap: 32px;
    }
    .shop-card {
      position: relative; cursor: pointer; overflow: hidden;
      background: rgba(255,255,255,0.03);
      transition: transform 0.3s cubic-bezier(0.34,1.56,0.64,1);
    }
    .shop-card:hover { transform: scale(1.02); z-index: 2; }
    .shop-card.sold { cursor: default; opacity: 0.45; }
    .shop-card .card-img {
      aspect-ratio: 3/4;
      background-size: contain;
      background-position: center;
      background-repeat: no-repeat;
      background-color: rgba(255,255,255,0.04);
    }
    .shop-card .card-meta {
      padding: 10px 12px 14px;
      display: flex; justify-content: space-between; align-items: baseline;
    }
    .shop-card .card-title {
      font-size: 11px; font-weight: 700; letter-spacing: 0.06em;
      text-transform: uppercase; margin: 0;
    }
    .shop-card .card-price {
      font-size: 11px; font-weight: 700; color: ${pal.accent1};
      letter-spacing: 0.04em;
    }
    .shop-card .sold-badge {
      position: absolute; top: 10px; left: 10px;
      background: ${pal.ink}; color: ${pal.paper};
      font-size: 8px; font-weight: 700; letter-spacing: 0.25em;
      padding: 4px 8px; text-transform: uppercase;
    }
    .shop-card .buy-hint {
      position: absolute; inset: 0;
      background: rgba(0,0,0,0.0);
      display: flex; align-items: flex-end; justify-content: center;
      padding-bottom: 16px;
      opacity: 0; transition: opacity 0.2s;
    }
    .shop-card:not(.sold):hover .buy-hint { opacity: 1; }
    .shop-card .buy-hint span {
      background: ${pal.accent1}; color: ${pal.ink};
      font-size: 9px; font-weight: 700; letter-spacing: 0.2em;
      padding: 6px 16px; text-transform: uppercase;
    }
    .shop-empty { font-size: 14px; opacity: 0.4; margin-top: 40px; }

    /* MODAL */
    .shop-modal-overlay {
      position: fixed; inset: 0; z-index: 1000;
      background: rgba(0,0,0,0.7);
      display: flex; align-items: center; justify-content: center;
      padding: 16px;
      animation: fadeIn 0.2s ease;
    }
    @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
    .shop-modal {
      background: ${pal.bg}; color: ${pal.paper};
      width: 100%; max-width: 620px; max-height: 90vh;
      overflow-y: auto; position: relative;
      border: 1px solid rgba(255,255,255,0.1);
      animation: slideUp 0.25s cubic-bezier(0.34,1.56,0.64,1);
    }
    @keyframes slideUp { from { transform: translateY(20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
    .shop-modal-close {
      position: sticky; top: 8px; float: right;
      margin: 8px 8px 0 0;
      background: rgba(0,0,0,0.5); border: 1px solid rgba(255,255,255,0.2);
      color: ${pal.paper};
      font-size: 16px; cursor: pointer; opacity: 1;
      transition: opacity 0.2s; padding: 4px 10px; z-index: 10;
      border-radius: 2px;
    }
    .shop-modal-close:hover { background: rgba(255,255,255,0.1); }
    .shop-modal-top {
      display: grid; grid-template-columns: 1fr 1fr; gap: 0;
    }
    .shop-modal-img {
      aspect-ratio: 3/4;
      background-size: cover; background-position: center;
    }
    .shop-modal-info {
      padding: 28px 24px; display: flex; flex-direction: column; gap: 8px;
    }
    .shop-modal-info .m-cat {
      font-size: 9px; letter-spacing: 0.3em; text-transform: uppercase; opacity: 0.4;
    }
    .shop-modal-info .m-title {
      font-size: clamp(18px, 3vw, 28px); font-weight: 700;
      letter-spacing: -0.02em; line-height: 1; margin: 0;
    }
    .shop-modal-info .m-price {
      font-size: 20px; font-weight: 700; color: ${pal.accent1};
      margin-top: 4px;
    }
    .shop-modal-info .m-desc {
      font-size: 12px; line-height: 1.6; opacity: 0.65; margin-top: 8px;
    }

    .shop-form { padding: 24px; border-top: 1px solid rgba(255,255,255,0.08); }
    .shop-form .form-title {
      font-size: 9px; letter-spacing: 0.3em; text-transform: uppercase;
      opacity: 0.4; margin-bottom: 16px;
    }
    .shop-form .campo { margin-bottom: 14px; }
    .shop-form label {
      display: block; font-size: 9px; letter-spacing: 0.2em;
      text-transform: uppercase; opacity: 0.5; margin-bottom: 5px; font-weight: 700;
    }
    .shop-form input, .shop-form textarea {
      width: 100%; background: rgba(255,255,255,0.06);
      border: 1px solid rgba(255,255,255,0.1);
      color: ${pal.paper}; font-family: inherit; font-size: 13px;
      padding: 10px 12px; outline: none;
      transition: border-color 0.2s;
    }
    .shop-form input:focus, .shop-form textarea:focus {
      border-color: ${pal.accent1};
    }
    .shop-form input.err, .shop-form textarea.err { border-color: #ff4444; }
    .shop-form textarea { resize: vertical; min-height: 72px; }
    .shop-form .form-actions {
      display: flex; gap: 10px; margin-top: 20px; align-items: center;
    }
    .shop-form .btn-comprar {
      background: ${pal.accent1}; color: ${pal.ink};
      border: none; font-family: inherit; font-size: 11px; font-weight: 700;
      letter-spacing: 0.15em; text-transform: uppercase;
      padding: 12px 24px; cursor: pointer;
      transition: transform 0.15s, box-shadow 0.15s;
      flex: 1;
    }
    .shop-form .btn-comprar:hover { transform: translateY(-1px); box-shadow: 0 4px 12px rgba(0,0,0,0.3); }
    .shop-form .btn-comprar:disabled { opacity: 0.5; cursor: default; transform: none; }
    .shop-form .btn-cancel {
      background: none; border: 1px solid rgba(255,255,255,0.15);
      color: ${pal.paper}; font-family: inherit; font-size: 10px; font-weight: 700;
      letter-spacing: 0.1em; text-transform: uppercase;
      padding: 12px 16px; cursor: pointer;
      transition: border-color 0.2s;
    }
    .shop-form .btn-cancel:hover { border-color: rgba(255,255,255,0.4); }
    .shop-form .paypal-note {
      font-size: 9px; opacity: 0.35; letter-spacing: 0.1em;
      text-align: center; margin-top: 12px;
    }
    .shop-sending {
      padding: 60px 24px; text-align: center;
      font-size: 11px; letter-spacing: 0.3em; text-transform: uppercase; opacity: 0.6;
    }

    @media (max-width: 600px) {
      .shop-modal-top { grid-template-columns: 1fr; }
      .shop-modal-img { aspect-ratio: 4/3; }
      .shop-grid { grid-template-columns: repeat(2, 1fr); }
      .shop-page { padding: 32px 14px 60px; }
    }
  `;

  return (
    <PageWrap siteData={siteData} pal={pal} lang={lang} setLang={setLang} palette={palette} setPalette={setPalette} active="shop">
      <style>{css}</style>
      <div className="shop-page">
        <div className="shop-header">
          <h1 className="shop-title">{_t("shop", lang)}</h1>
          {categories.length > 1 && (
            <div className="shop-cat-wrap">
              <button className="shop-cat-btn" onClick={() => setCatOpen(o => !o)}>
                {catLabel} {catOpen ? "▴" : "▾"}
              </button>
              <div className={`shop-cat-dropdown ${catOpen ? "open" : ""}`}>
                {categories.map(cat => (
                  <button key={cat}
                    className={activeCat === cat ? "active" : ""}
                    onClick={() => { setActiveCat(cat); setCatOpen(false); }}>
                    {cat === "all" ? (lang === "es" ? "TODOS" : "ALL") : cat.toUpperCase()}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {items.length === 0 ? (
          <p className="shop-empty">{_t("sin_items", lang)}</p>
        ) : (
          <div className="shop-grid">
            {items.map((item, i) => (
              <div key={i}
                className={`shop-card ${item.sold ? "sold" : ""}`}
                onClick={() => openItem(item)}>
                <div className="card-img" style={{ backgroundImage: `url(${item.image})` }} />
                {item.sold && <div className="sold-badge">SOLD</div>}
                {!item.sold && (
                  <div className="buy-hint">
                    <span>{lang === "es" ? "COMPRAR" : "BUY"}</span>
                  </div>
                )}
                <div className="card-meta">
                  <p className="card-title">{item.title}</p>
                  <p className="card-price">{item.sold ? "—" : item.price + "€"}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* MODAL */}
      {selected && (
        <div className="shop-modal-overlay" onClick={e => { if (e.target === e.currentTarget) closeForm(); }}>
          <div className="shop-modal">
            <button className="shop-modal-close" onClick={closeForm}>✕</button>

            <div className="shop-modal-top">
              <div className="shop-modal-img" style={{ backgroundImage: `url(${selected.image})` }} />
              <div className="shop-modal-info">
                {selected.category && <div className="m-cat">{selected.category}</div>}
                <h2 className="m-title">{selected.title}</h2>
                <div className="m-price">{selected.price}€</div>
                {selected.description && <p className="m-desc">{selected.description}</p>}
              </div>
            </div>

            {step === "sending" ? (
              <div className="shop-sending">
                {lang === "es" ? "REDIRIGIENDO A PAYPAL…" : "REDIRECTING TO PAYPAL…"}
              </div>
            ) : (
              <div className="shop-form">
                <div className="form-title">{lang === "es" ? "DATOS DE ENVÍO" : "SHIPPING INFO"}</div>
                <div className="campo">
                  <label>{lang === "es" ? "NOMBRE COMPLETO" : "FULL NAME"}</label>
                  <input type="text" className={errors.nombre ? "err" : ""}
                    value={form.nombre}
                    onChange={e => setForm(f => ({...f, nombre: e.target.value}))}
                    placeholder={lang === "es" ? "Tu nombre" : "Your name"} />
                </div>
                <div className="campo">
                  <label>{lang === "es" ? "DIRECCIÓN DE ENVÍO" : "SHIPPING ADDRESS"}</label>
                  <textarea className={errors.direccion ? "err" : ""}
                    value={form.direccion}
                    onChange={e => setForm(f => ({...f, direccion: e.target.value}))}
                    placeholder={lang === "es" ? "Calle, ciudad, CP, país" : "Street, city, ZIP, country"} />
                </div>
                <div className="campo">
                  <label>EMAIL</label>
                  <input type="email" className={errors.email ? "err" : ""}
                    value={form.email}
                    onChange={e => setForm(f => ({...f, email: e.target.value}))}
                    placeholder={lang === "es" ? "tu@email.com" : "your@email.com"} />
                </div>
                <div className="form-actions">
                  <button className="btn-cancel" onClick={closeForm}>
                    {lang === "es" ? "CANCELAR" : "CANCEL"}
                  </button>
                  <button className="btn-comprar" onClick={handleCompra}>
                    {lang === "es" ? "PAGAR CON PAYPAL →" : "PAY WITH PAYPAL →"}
                  </button>
                </div>
                <p className="paypal-note">
                  {lang === "es"
                    ? "Serás redirigido a PayPal para completar el pago de forma segura."
                    : "You will be redirected to PayPal to complete the payment securely."}
                </p>
              </div>
            )}
          </div>
        </div>
      )}
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
    <PageWrap siteData={siteData} pal={pal} lang={lang} setLang={setLang} palette={palette} setPalette={setPalette} active="work">
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
      <PageWrap siteData={siteData} pal={pal} lang={lang} setLang={setLang} palette={palette} setPalette={setPalette} active="work">
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
    case "slideshow":
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
    // Add a hard timeout — never stay on loading more than 3 seconds
    const timeout = setTimeout(() => {
      if (!window.__INCENDIO_DATA) window.__INCENDIO_DATA = {};
      setSiteData(window.__INCENDIO_DATA || {});
    }, 3000);

    loadSiteData().then(data => {
      clearTimeout(timeout);
      setSiteData(data);
      if (data.site && data.site.defaultLang) setLang(data.site.defaultLang);
      if (data.site && data.site.defaultPalette) setPalette(data.site.defaultPalette);
      var font = (data.site && data.site.fontFamily) ? data.site.fontFamily : "Space Mono";
      if (font && font !== "Space Mono") {
        var link = document.createElement("link");
        link.rel = "stylesheet";
        link.href = "https://fonts.googleapis.com/css2?family=" + encodeURIComponent(font).replace(/%20/g, "+") + ":wght@400;700&display=swap";
        document.head.appendChild(link);
      }
    });

    return () => clearTimeout(timeout);
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
