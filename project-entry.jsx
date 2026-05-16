/* INCENDIO · Project entry templates — REDESIGN
 * Clean minimal project pages. No @import (font loaded in index.html).
 * 6 templates: single-image, gallery, object-text, long-read, showcase, video
 */

const PALETTES_PE = {
  electric: { bg: "#1d1bff", paper: "#fffaee", ink: "#0a0a0a", a1: "#ffd000", a2: "#ff8de0", a3: "#5ae3a4" },
  sunset:   { bg: "#ff5e9e", paper: "#fff7d6", ink: "#0a0a0a", a1: "#ffd000", a2: "#1d1bff", a3: "#ff7a59" },
  acid:     { bg: "#16a34a", paper: "#fffaee", ink: "#0a0a0a", a1: "#ffd000", a2: "#ff5e9e", a3: "#1d4ed8" },
  noir:     { bg: "#0a0a0a", paper: "#f4f1ea", ink: "#fffaee", a1: "#ff1d58", a2: "#ffd000", a3: "#5ae3a4" },
  cream:    { bg: "#f6efde", paper: "#fffaee", ink: "#0c2340", a1: "#c0392b", a2: "#1e3a8a", a3: "#d4a017" },
};

function ProjectEntry({ data, palette = "electric" }) {
  const pal = PALETTES_PE[palette] || PALETTES_PE.electric;
  const T = TEMPLATES[data.template] || TEMPLATES["single-image"];

  const css = `
    .pe { --bg: ${pal.bg}; --paper: ${pal.paper}; --ink: ${pal.ink}; --a1: ${pal.a1}; --a2: ${pal.a2}; --a3: ${pal.a3}; }
    .pe {
      width: 100%; min-height: 100vh;
      font-family: "Space Mono", "Courier New", monospace;
      font-weight: 400;
      color: var(--paper); background: var(--bg);
    }
    .pe a { color: inherit; text-decoration: none; cursor: pointer; }
    .pe img { display: block; max-width: 100%; }

    .pe-top {
      position: sticky; top: 0; z-index: 50;
      display: flex; justify-content: space-between; align-items: center;
      padding: 16px 24px;
      font-size: 11px; letter-spacing: 0.15em; font-weight: 700;
      background: var(--bg);
      border-bottom: 1px solid rgba(255,255,255,0.08);
      text-transform: uppercase;
    }
    .pe-top .back { display: flex; align-items: center; gap: 8px; transition: color 0.2s; }
    .pe-top .back:hover { color: var(--a1); }
    .pe-top .meta-mini { display: flex; gap: 14px; opacity: 0.5; font-size: 10px; }

    .pe-head {
      padding: 80px 24px 60px;
      max-width: 1200px; margin: 0 auto;
    }
    .pe-head h1 {
      font-family: "Space Mono", monospace;
      font-size: clamp(48px, 8vw, 120px);
      line-height: 0.9; letter-spacing: -0.04em;
      margin: 0 0 40px; font-weight: 700; text-transform: uppercase;
    }
    .pe-head .info {
      display: flex; flex-wrap: wrap; gap: 24px;
      font-size: 10px; letter-spacing: 0.2em; font-weight: 400;
      opacity: 0.6; text-transform: uppercase;
      padding-top: 24px; border-top: 1px solid rgba(255,255,255,0.1);
    }
    .pe-head .info .pair { display: flex; gap: 8px; }
    .pe-head .info .pair dt { opacity: 0.5; }
    .pe-head .info .pair dd { margin: 0; }
    .pe-head .info dd a { border-bottom: 1px solid var(--a1); }
    .pe-head .info dd a:hover { color: var(--a1); }

    .pe-foot {
      padding: 40px 24px;
      border-top: 1px solid rgba(255,255,255,0.08);
      display: flex; justify-content: space-between; align-items: center;
      font-size: 10px; letter-spacing: 0.15em; font-weight: 400;
      text-transform: uppercase; max-width: 1200px; margin: 0 auto;
    }
    .pe-foot .nav { display: flex; gap: 16px; }
    .pe-foot .nav a {
      padding: 8px 16px; border: 1px solid rgba(255,255,255,0.15);
      transition: all 0.3s; font-size: 10px;
    }
    .pe-foot .nav a:hover { background: var(--a1); color: var(--ink); border-color: var(--a1); }

    .pe-single { padding: 40px 24px 80px; display: flex; flex-direction: column; align-items: center; max-width: 1200px; margin: 0 auto; }
    .pe-single .frame { width: 100%; overflow: hidden; }
    .pe-single .frame img { width: 100%; height: auto; }
    .pe-single .caption { margin-top: 24px; max-width: 600px; text-align: center; font-size: 14px; line-height: 1.6; opacity: 0.7; }

    .pe-gallery { padding: 40px 24px 80px; display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 8px; max-width: 1400px; margin: 0 auto; }
    .pe-gallery .item { overflow: hidden; transition: opacity 0.3s; }
    .pe-gallery .item:hover { opacity: 0.85; }
    .pe-gallery .item.tall { grid-row: span 2; }
    .pe-gallery .item.wide { grid-column: span 2; }
    .pe-gallery .item img { width: 100%; height: 100%; object-fit: cover; display: block; }

    .pe-object { padding: 40px 24px 80px; display: grid; grid-template-columns: 1fr 1fr; gap: 48px; align-items: center; max-width: 1200px; margin: 0 auto; }
    .pe-object .photo { overflow: hidden; }
    .pe-object .photo img { width: 100%; height: auto; }
    .pe-object .copy h2 { font-family: "Space Mono", monospace; font-size: clamp(24px, 3vw, 40px); line-height: 1.05; letter-spacing: -0.02em; margin: 0 0 20px; font-weight: 700; }
    .pe-object .copy h2 em { font-style: normal; color: var(--a1); }
    .pe-object .copy p { font-size: 14px; line-height: 1.6; max-width: 500px; margin: 0 0 14px; opacity: 0.8; }
    .pe-object .copy .specs { margin-top: 24px; font-size: 10px; letter-spacing: 0.2em; display: grid; grid-template-columns: auto 1fr; gap: 4px 16px; text-transform: uppercase; }
    .pe-object .copy .specs dt { opacity: 0.4; }
    .pe-object .copy .specs dd { margin: 0; }

    .pe-long { padding: 40px 24px 80px; display: flex; flex-direction: column; align-items: center; max-width: 1200px; margin: 0 auto; }
    .pe-long .block { max-width: 680px; width: 100%; margin-bottom: 48px; }
    .pe-long .block.full { max-width: 1100px; }
    .pe-long .block h2 { font-family: "Space Mono", monospace; font-size: clamp(20px, 2.5vw, 32px); letter-spacing: -0.02em; line-height: 1.1; margin: 0 0 16px; color: var(--a1); font-weight: 700; }
    .pe-long .block p { font-size: 14px; line-height: 1.7; margin: 0 0 12px; opacity: 0.8; }
    .pe-long .block .img { margin-top: 16px; }
    .pe-long .block .img img { width: 100%; height: auto; }
    .pe-long .pull { font-family: "Space Mono", monospace; font-size: clamp(22px, 3vw, 36px); line-height: 1.15; letter-spacing: -0.02em; max-width: 800px; text-align: center; margin: 32px auto; font-weight: 700; }
    .pe-long .pull em { font-style: normal; background: var(--a1); color: var(--ink); padding: 0 6px; }

    .pe-show { padding: 0; }
    .pe-show .row { display: grid; grid-template-columns: 1fr 1fr; gap: 0; border-bottom: 1px solid rgba(255,255,255,0.06); }
    .pe-show .row.swap { direction: rtl; }
    .pe-show .row.swap > * { direction: ltr; }
    .pe-show .row .visual { aspect-ratio: 4/3; background-size: cover; background-position: center; }
    .pe-show .row .visual.contain { background-size: contain; background-repeat: no-repeat; }
    .pe-show .row .text { padding: 40px 32px; display: flex; flex-direction: column; justify-content: center; }
    .pe-show .row .text h3 { font-family: "Space Mono", monospace; font-size: clamp(18px, 2vw, 28px); letter-spacing: -0.02em; line-height: 1.1; margin: 0 0 12px; color: var(--a1); font-weight: 700; }
    .pe-show .row .text p { font-size: 14px; line-height: 1.6; max-width: 420px; margin: 0; opacity: 0.8; }

    .pe-video { padding: 40px 24px 80px; display: flex; flex-direction: column; align-items: center; max-width: 1200px; margin: 0 auto; }
    .pe-video .frame { width: 100%; aspect-ratio: 16/9; overflow: hidden; background: var(--ink); }
    .pe-video .frame video, .pe-video .frame iframe { width: 100%; height: 100%; display: block; border: 0; }
    .pe-video .caption { margin-top: 24px; max-width: 600px; text-align: center; font-size: 14px; line-height: 1.6; opacity: 0.7; }

    .pe-tags { position: absolute; left: -9999px; opacity: 0; pointer-events: none; }

    /* ── LIGHTBOX ── */
    .pe-lightbox {
      position: fixed; inset: 0; z-index: 9999;
      background: rgba(0,0,0,0.88);
      display: flex; align-items: center; justify-content: center;
      animation: peLbIn 0.2s ease;
      cursor: zoom-out;
    }
    @keyframes peLbIn { from { opacity: 0; } to { opacity: 1; } }
    .pe-lightbox .lb-close {
      position: absolute; top: 18px; right: 24px;
      width: 38px; height: 38px;
      background: transparent; color: #fff;
      border: 2px solid rgba(255,255,255,0.4);
      font-size: 20px; font-weight: 700;
      display: flex; align-items: center; justify-content: center;
      cursor: pointer; z-index: 10;
      font-family: inherit; transition: border-color 0.2s;
    }
    .pe-lightbox .lb-close:hover { border-color: #fff; }
    .pe-lightbox .lb-inner {
      max-width: min(92vw, 1000px); max-height: 90vh;
      animation: peLbPop 0.25s cubic-bezier(0.34,1.3,0.64,1);
      cursor: default;
    }
    @keyframes peLbPop { from { transform: scale(0.94); opacity: 0; } to { transform: scale(1); opacity: 1; } }
    .pe-lightbox .lb-inner img {
      max-width: 100%; max-height: 90vh;
      object-fit: contain; display: block;
    }
    .pe-gallery .item { cursor: pointer; }

    /* ── SLIDESHOW ── */
    .pe-slideshow { padding: 40px 24px 80px; max-width: 1200px; margin: 0 auto; }
    .pe-slideshow .ss-main {
      position: relative; width: 100%;
      aspect-ratio: 16/10; background: rgba(0,0,0,0.3);
      overflow: hidden; display: flex; align-items: center; justify-content: center;
    }
    .pe-slideshow .ss-main img {
      max-width: 100%; max-height: 100%;
      object-fit: contain; display: block;
      transition: opacity 0.3s ease;
    }
    .pe-slideshow .ss-arr {
      position: absolute; top: 50%; transform: translateY(-50%);
      width: 44px; height: 44px;
      background: rgba(0,0,0,0.45); color: #fff;
      border: 1px solid rgba(255,255,255,0.2);
      font-size: 20px; font-weight: 700;
      display: flex; align-items: center; justify-content: center;
      cursor: pointer; z-index: 5;
      font-family: inherit; transition: background 0.2s;
    }
    .pe-slideshow .ss-arr:hover { background: rgba(0,0,0,0.7); }
    .pe-slideshow .ss-arr.prev { left: 12px; }
    .pe-slideshow .ss-arr.next { right: 12px; }
    .pe-slideshow .ss-counter {
      position: absolute; bottom: 12px; right: 16px;
      font-size: 10px; letter-spacing: 0.15em; opacity: 0.6;
      background: rgba(0,0,0,0.5); padding: 4px 10px;
    }
    .pe-slideshow .ss-strip {
      display: flex; gap: 4px; margin-top: 8px;
      overflow-x: auto; padding: 4px 0;
      scrollbar-width: thin;
    }
    .pe-slideshow .ss-strip::-webkit-scrollbar { height: 4px; }
    .pe-slideshow .ss-strip::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.2); }
    .pe-slideshow .ss-thumb {
      flex: 0 0 auto; width: 80px; height: 56px;
      overflow: hidden; cursor: pointer;
      opacity: 0.4; transition: opacity 0.2s;
      border: 2px solid transparent;
    }
    .pe-slideshow .ss-thumb.active { opacity: 1; border-color: var(--a1); }
    .pe-slideshow .ss-thumb:hover { opacity: 0.8; }
    .pe-slideshow .ss-thumb img {
      width: 100%; height: 100%; object-fit: cover; display: block;
    }

    @media (max-width: 768px) {
      .pe-head { padding: 48px 16px 32px; }
      .pe-head h1 { font-size: clamp(36px, 10vw, 64px); }
      .pe-object { grid-template-columns: 1fr; }
      .pe-show .row { grid-template-columns: 1fr; }
      .pe-show .row .visual { aspect-ratio: 16/9; }
    }
  `;

  return (
    <div className="pe">
      <style>{css}</style>
      <header className="pe-top">
        <a className="back" href="#/">← INCENDIO·1987</a>
        <div className="meta-mini">
          <span>{data.category}</span>
          <span>{data.year}</span>
        </div>
      </header>
      <section className="pe-head">
        <h1>{data.title}</h1>
        <div className="info">
          {data.year && <div className="pair"><dt>Year</dt><dd>{data.year}</dd></div>}
          {data.category && <div className="pair"><dt>Category</dt><dd>{data.category}</dd></div>}
          {data.client && <div className="pair"><dt>Client</dt><dd>{data.client}</dd></div>}
          {data.role && <div className="pair"><dt>Role</dt><dd>{data.role}</dd></div>}
          {data.tools && <div className="pair"><dt>Tools</dt><dd>{data.tools.join(", ")}</dd></div>}
          {data.link && <div className="pair"><dt>Link</dt><dd><a href={data.link} target="_blank" rel="noreferrer">{data.linkLabel || "View →"}</a></dd></div>}
        </div>
      </section>
      <T data={data} />
      {data.tags && data.tags.length > 0 && (
        <div className="pe-tags" aria-hidden="false">{data.tags.join(" ")}</div>
      )}
      <footer className="pe-foot">
        <span>© INCENDIO 1987</span>
        <div className="nav">
          {data.prev && <a href={`#/project/${data.prev}`}>← prev</a>}
          {data.next && <a href={`#/project/${data.next}`}>next →</a>}
        </div>
      </footer>
    </div>
  );
}

const TEMPLATES = {
  "single-image": ({ data }) => (
    <section className="pe-single">
      <div className="frame"><img src={data.image} alt={data.title} /></div>
      {data.caption && <p className="caption">{data.caption}</p>}
    </section>
  ),
  "gallery": function GalleryTpl({ data }) {
    const [lbSrc, setLbSrc] = React.useState(null);
    React.useEffect(() => {
      const h = (e) => { if (e.key === "Escape") setLbSrc(null); };
      document.addEventListener("keydown", h);
      return () => document.removeEventListener("keydown", h);
    }, []);
    return (
      <>
        <section className="pe-gallery">
          {(data.images || []).map((img, i) => {
            const src = typeof img === "string" ? img : img.src;
            const variant = typeof img === "object" ? img.variant : "";
            return (<div key={i} className={`item ${variant || ""}`} onClick={() => setLbSrc(src)}><img src={src} alt={`${data.title} ${i + 1}`} /></div>);
          })}
        </section>
        {lbSrc && (
          <div className="pe-lightbox" onClick={() => setLbSrc(null)}>
            <button className="lb-close" onClick={() => setLbSrc(null)}>✕</button>
            <div className="lb-inner" onClick={e => e.stopPropagation()}>
              <img src={lbSrc} alt={data.title} />
            </div>
          </div>
        )}
      </>
    );
  },
  "object-text": ({ data }) => (
    <section className="pe-object">
      <div className="photo"><img src={data.image} alt={data.title} /></div>
      <div className="copy">
        {data.headline && (<h2 dangerouslySetInnerHTML={{ __html: data.headline.replace(/_(.+?)_/g, "<em>$1</em>") }} />)}
        {(data.paragraphs || []).map((p, i) => <p key={i}>{p}</p>)}
        {data.specs && (<dl className="specs">{Object.entries(data.specs).map(([k, v]) => (<React.Fragment key={k}><dt>{k.toUpperCase()}</dt><dd>{v}</dd></React.Fragment>))}</dl>)}
      </div>
    </section>
  ),
  "long-read": ({ data }) => (
    <section className="pe-long">
      {(data.blocks || []).map((b, i) => {
        if (b.type === "pull") return <p key={i} className="pull" dangerouslySetInnerHTML={{ __html: b.text.replace(/_(.+?)_/g, "<em>$1</em>") }} />;
        return (<div key={i} className={`block ${b.full ? "full" : ""}`}>
          {b.heading && <h2>{b.heading}</h2>}
          {(b.paragraphs || []).map((p, j) => <p key={j}>{p}</p>)}
          {b.image && <div className="img"><img src={b.image} alt="" /></div>}
        </div>);
      })}
    </section>
  ),
  "showcase": ({ data }) => (
    <section className="pe-show">
      {(data.rows || []).map((r, i) => (
        <div key={i} className={`row ${i % 2 === 1 ? "swap" : ""}`}>
          <div className={`visual ${r.contain ? "contain" : ""}`} style={{ backgroundImage: `url(${r.image})`, backgroundColor: r.bg || "var(--paper)" }} />
          <div className="text"><h3>{r.heading}</h3><p>{r.text}</p></div>
        </div>
      ))}
    </section>
  ),
  "video": ({ data }) => (
    <section className="pe-video">
      <div className="frame">
        {data.embed ? <iframe src={data.embed} allow="autoplay; fullscreen" allowFullScreen /> : <video src={data.video} controls poster={data.poster} />}
      </div>
      {data.caption && <p className="caption">{data.caption}</p>}
    </section>
  ),
  "slideshow": function SlideshowTpl({ data }) {
    const imgs = (data.images || []).map(img => typeof img === "string" ? img : img.src);
    const [idx, setIdx] = React.useState(0);
    const stripRef = React.useRef(null);
    const len = imgs.length;
    const go = (dir) => setIdx((prev) => (prev + dir + len) % len);
    React.useEffect(() => {
      const h = (e) => { if (e.key === "ArrowLeft") go(-1); else if (e.key === "ArrowRight") go(1); };
      document.addEventListener("keydown", h);
      return () => document.removeEventListener("keydown", h);
    }, [len]);
    React.useEffect(() => {
      if (stripRef.current) {
        const thumb = stripRef.current.children[idx];
        if (thumb) thumb.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
      }
    }, [idx]);
    if (len === 0) return null;
    return (
      <section className="pe-slideshow">
        <div className="ss-main">
          <img src={imgs[idx]} alt={`${data.title} ${idx + 1}`} key={idx} />
          {len > 1 && <button className="ss-arr prev" onClick={() => go(-1)}>‹</button>}
          {len > 1 && <button className="ss-arr next" onClick={() => go(1)}>›</button>}
          <span className="ss-counter">{idx + 1} / {len}</span>
        </div>
        {len > 1 && (
          <div className="ss-strip" ref={stripRef}>
            {imgs.map((src, i) => (
              <div key={i} className={`ss-thumb ${i === idx ? "active" : ""}`} onClick={() => setIdx(i)}>
                <img src={src} alt={`thumb ${i + 1}`} />
              </div>
            ))}
          </div>
        )}
      </section>
    );
  },
};

window.ProjectEntry = ProjectEntry;
window.PROJECT_TEMPLATES = Object.keys(TEMPLATES);
