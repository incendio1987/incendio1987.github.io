/* INCENDIO · Project entry templates
 *
 * Sistema de plantillas reutilizables para entradas individuales de proyecto.
 * Cada proyecto elige una plantilla y le pasa su data.
 *
 * Uso:
 *   <window.ProjectEntry data={projectData} />
 *
 * projectData = {
 *   id, title, year, category, tags (invisibles para search),
 *   template: "single-image" | "gallery" | "object-text" | "long-read" | "showcase" | "video",
 *   ... campos según plantilla
 * }
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
      font-family: "Helvetica Neue", "Helvetica", Arial, sans-serif;
      font-weight: 900; letter-spacing: -0.01em;
      color: var(--paper); background: var(--bg);
    }
    .pe a { color: inherit; text-decoration: none; cursor: pointer; }
    .pe img { display: block; max-width: 100%; }

    /* TOP bar — coherente con home */
    .pe-top {
      position: sticky; top: 0; z-index: 50;
      display: flex; justify-content: space-between; align-items: center;
      padding: 18px 36px;
      font-size: 11px; letter-spacing: 0.3em; font-weight: 700;
      background: var(--bg);
      border-bottom: 1.5px solid rgba(255,255,255,0.12);
    }
    .pe-top .back { display: flex; align-items: center; gap: 10px; transition: transform 0.2s; }
    .pe-top .back:hover { transform: translateX(-3px); color: var(--a1); }
    .pe-top .meta-mini { display: flex; gap: 14px; opacity: 0.7; }

    /* HERO header común a todas las plantillas */
    .pe-head {
      padding: 70px 56px 50px;
      display: grid; grid-template-columns: 1.4fr 1fr; gap: 40px;
      align-items: end;
      border-bottom: 2px solid rgba(255,255,255,0.15);
    }
    .pe-head h1 {
      font-size: clamp(56px, 7.4vw, 132px);
      line-height: 0.84; letter-spacing: -0.05em;
      margin: 0;
    }
    .pe-head h1 .y { color: var(--a1); }
    .pe-head .info {
      display: grid; grid-template-columns: auto 1fr; gap: 6px 16px;
      font-size: 11px; letter-spacing: 0.25em; font-weight: 700;
      align-self: end;
      padding-bottom: 18px;
    }
    .pe-head .info dt { opacity: 0.55; }
    .pe-head .info dd { margin: 0; }
    .pe-head .info dd a { border-bottom: 1px solid var(--a1); padding-bottom: 1px; }
    .pe-head .info dd a:hover { color: var(--a1); }

    /* FOOTER común */
    .pe-foot {
      padding: 60px 56px 40px;
      border-top: 2px solid rgba(255,255,255,0.15);
      display: flex; justify-content: space-between; align-items: center;
      font-size: 11px; letter-spacing: 0.3em; font-weight: 700;
    }
    .pe-foot .nav { display: flex; gap: 20px; }
    .pe-foot .nav a { padding: 8px 14px; border: 1.5px solid var(--paper); transition: all 0.2s; }
    .pe-foot .nav a:hover { background: var(--a1); color: var(--ink); border-color: var(--a1); }

    /* ────── PLANTILLA: single-image ────── */
    .pe-single {
      padding: 60px 56px 80px;
      display: flex; flex-direction: column; align-items: center;
    }
    .pe-single .frame {
      max-width: 1100px; width: 100%;
      border: 3px solid var(--ink); background: var(--paper);
      filter: drop-shadow(0 18px 0 rgba(0,0,0,0.3));
    }
    .pe-single .frame img { width: 100%; height: auto; }
    .pe-single .caption {
      margin-top: 32px;
      max-width: 600px; text-align: center;
      font-size: 16px; line-height: 1.5; font-weight: 400;
      letter-spacing: 0.01em;
    }

    /* ────── PLANTILLA: gallery ────── */
    .pe-gallery {
      padding: 50px 56px 80px;
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: 16px;
    }
    .pe-gallery .item {
      border: 3px solid var(--ink); background: var(--paper);
      overflow: hidden;
      filter: drop-shadow(0 8px 0 rgba(0,0,0,0.3));
      transition: transform 0.25s ease;
    }
    .pe-gallery .item:hover { transform: translateY(-4px); }
    .pe-gallery .item.tall { grid-row: span 2; }
    .pe-gallery .item.wide { grid-column: span 2; }
    .pe-gallery .item img { width: 100%; height: 100%; object-fit: cover; display: block; }

    /* ────── PLANTILLA: object-text ────── */
    .pe-object {
      padding: 60px 56px 80px;
      display: grid; grid-template-columns: 1fr 1fr; gap: 60px;
      align-items: center; min-height: 70vh;
    }
    .pe-object .photo {
      border: 3px solid var(--ink); background: var(--paper);
      aspect-ratio: 4/5;
      filter: drop-shadow(0 18px 0 rgba(0,0,0,0.3));
      overflow: hidden;
    }
    .pe-object .photo img { width: 100%; height: 100%; object-fit: cover; }
    .pe-object .copy h2 {
      font-size: clamp(32px, 4vw, 56px);
      line-height: 0.95; letter-spacing: -0.04em;
      margin: 0 0 24px;
    }
    .pe-object .copy h2 em { font-style: normal; color: var(--a1); }
    .pe-object .copy p {
      font-size: 17px; line-height: 1.55; font-weight: 400;
      max-width: 500px;
      margin: 0 0 18px;
    }
    .pe-object .copy .specs {
      margin-top: 30px;
      font-size: 11px; letter-spacing: 0.25em; font-weight: 700;
      display: grid; grid-template-columns: auto 1fr; gap: 6px 16px;
    }
    .pe-object .copy .specs dt { opacity: 0.6; }
    .pe-object .copy .specs dd { margin: 0; }

    /* ────── PLANTILLA: long-read ────── */
    .pe-long {
      padding: 60px 56px 80px;
      display: flex; flex-direction: column; align-items: center;
    }
    .pe-long .block {
      max-width: 760px; width: 100%;
      margin-bottom: 60px;
    }
    .pe-long .block.full { max-width: 1200px; }
    .pe-long .block h2 {
      font-size: clamp(28px, 3.4vw, 44px);
      letter-spacing: -0.03em; line-height: 1;
      margin: 0 0 18px;
      color: var(--a1);
    }
    .pe-long .block p {
      font-size: 17px; line-height: 1.6; font-weight: 400;
      margin: 0 0 14px;
    }
    .pe-long .block .img {
      border: 3px solid var(--ink); background: var(--paper);
      filter: drop-shadow(0 12px 0 rgba(0,0,0,0.3));
      margin-top: 18px;
    }
    .pe-long .block .img img { width: 100%; height: auto; }
    .pe-long .pull {
      font-size: clamp(28px, 3.6vw, 48px);
      line-height: 1.05; letter-spacing: -0.03em;
      max-width: 860px; text-align: center;
      margin: 40px auto;
      color: var(--paper);
    }
    .pe-long .pull em { font-style: normal; background: var(--a1); color: var(--ink); padding: 0 10px; }

    /* ────── PLANTILLA: showcase ────── */
    .pe-show {
      padding: 0;
    }
    .pe-show .row {
      display: grid; grid-template-columns: 1fr 1fr; gap: 0;
      border-bottom: 2px solid rgba(255,255,255,0.12);
    }
    .pe-show .row.swap { direction: rtl; }
    .pe-show .row.swap > * { direction: ltr; }
    .pe-show .row .visual {
      aspect-ratio: 4/3;
      background-color: var(--paper);
      background-size: cover; background-position: center;
      border-right: 2px solid rgba(255,255,255,0.12);
    }
    .pe-show .row .visual.contain {
      background-size: contain; background-repeat: no-repeat;
    }
    .pe-show .row .text {
      padding: 50px 56px;
      display: flex; flex-direction: column; justify-content: center;
    }
    .pe-show .row .text h3 {
      font-size: clamp(24px, 2.8vw, 36px);
      letter-spacing: -0.03em; line-height: 1;
      margin: 0 0 14px;
      color: var(--a1);
    }
    .pe-show .row .text p {
      font-size: 15px; line-height: 1.55; font-weight: 400;
      max-width: 460px;
      margin: 0;
    }

    /* ────── PLANTILLA: video ────── */
    .pe-video {
      padding: 60px 56px 80px;
      display: flex; flex-direction: column; align-items: center;
    }
    .pe-video .frame {
      max-width: 1100px; width: 100%;
      border: 3px solid var(--ink); background: var(--ink);
      filter: drop-shadow(0 18px 0 rgba(0,0,0,0.3));
      aspect-ratio: 16/9;
      overflow: hidden;
      position: relative;
    }
    .pe-video .frame video,
    .pe-video .frame iframe {
      width: 100%; height: 100%; display: block; border: 0;
    }
    .pe-video .caption {
      margin-top: 32px;
      max-width: 720px; text-align: center;
      font-size: 16px; line-height: 1.55; font-weight: 400;
    }

    /* tags invisibles para search (renderizados pero ocultos visualmente) */
    .pe-tags { position: absolute; left: -9999px; opacity: 0; pointer-events: none; }
  `;

  return (
    <div className="pe">
      <style>{css}</style>

      <header className="pe-top">
        <a className="back" href="index.html">← INCENDIO·1987</a>
        <div className="meta-mini">
          <span>{data.category}</span>
          <span>{data.year}</span>
        </div>
      </header>

      <section className="pe-head">
        <h1>
          {data.title.split(" ").map((w, i, arr) => (
            <React.Fragment key={i}>
              {i === arr.length - 1 ? <span className="y">{w}</span> : w}
              {i < arr.length - 1 && " "}
            </React.Fragment>
          ))}
        </h1>
        <dl className="info">
          {data.year && <><dt>AÑO</dt><dd>{data.year}</dd></>}
          {data.category && <><dt>CATEGORÍA</dt><dd>{data.category}</dd></>}
          {data.client && <><dt>CLIENTE</dt><dd>{data.client}</dd></>}
          {data.role && <><dt>ROL</dt><dd>{data.role}</dd></>}
          {data.tools && <><dt>HERRAMIENTAS</dt><dd>{data.tools.join(", ")}</dd></>}
          {data.link && <><dt>LINK</dt><dd><a href={data.link} target="_blank" rel="noreferrer">{data.linkLabel || "Ver →"}</a></dd></>}
        </dl>
      </section>

      <T data={data} />

      {/* tags invisibles para indexar — ayudan a la búsqueda sin ensuciar la UI */}
      {data.tags && data.tags.length > 0 && (
        <div className="pe-tags" aria-hidden="false">
          {data.tags.join(" ")}
        </div>
      )}

      <footer className="pe-foot">
        <span>© INCENDIO 1987</span>
        <div className="nav">
          {data.prev && <a href={`${data.prev}.html`}>← anterior</a>}
          {data.next && <a href={`${data.next}.html`}>siguiente →</a>}
        </div>
      </footer>
    </div>
  );
}

/* ────────── PLANTILLAS ────────── */

const TEMPLATES = {
  /* Una imagen grande + caption corto */
  "single-image": ({ data }) => (
    <section className="pe-single">
      <div className="frame">
        <img src={data.image} alt={data.title} />
      </div>
      {data.caption && <p className="caption">{data.caption}</p>}
    </section>
  ),

  /* Galería de imágenes — soporta variants tall/wide para masonry */
  "gallery": ({ data }) => (
    <section className="pe-gallery">
      {(data.images || []).map((img, i) => {
        const src = typeof img === "string" ? img : img.src;
        const variant = typeof img === "object" ? img.variant : "";
        return (
          <div key={i} className={`item ${variant || ""}`}>
            <img src={src} alt={`${data.title} ${i + 1}`} />
          </div>
        );
      })}
    </section>
  ),

  /* Foto de objeto + texto al lado */
  "object-text": ({ data }) => (
    <section className="pe-object">
      <div className="photo">
        <img src={data.image} alt={data.title} />
      </div>
      <div className="copy">
        {data.headline && (
          <h2 dangerouslySetInnerHTML={{
            __html: data.headline.replace(/_(.+?)_/g, "<em>$1</em>")
          }} />
        )}
        {(data.paragraphs || []).map((p, i) => <p key={i}>{p}</p>)}
        {data.specs && (
          <dl className="specs">
            {Object.entries(data.specs).map(([k, v]) => (
              <React.Fragment key={k}><dt>{k.toUpperCase()}</dt><dd>{v}</dd></React.Fragment>
            ))}
          </dl>
        )}
      </div>
    </section>
  ),

  /* Caso de estudio largo: bloques de texto + imágenes intercaladas */
  "long-read": ({ data }) => (
    <section className="pe-long">
      {(data.blocks || []).map((b, i) => {
        if (b.type === "pull") return <p key={i} className="pull" dangerouslySetInnerHTML={{
          __html: b.text.replace(/_(.+?)_/g, "<em>$1</em>")
        }} />;
        return (
          <div key={i} className={`block ${b.full ? "full" : ""}`}>
            {b.heading && <h2>{b.heading}</h2>}
            {(b.paragraphs || []).map((p, j) => <p key={j}>{p}</p>)}
            {b.image && <div className="img"><img src={b.image} alt="" /></div>}
          </div>
        );
      })}
    </section>
  ),

  /* Filas alternadas imagen+texto (para mostrar varias piezas con explicación) */
  "showcase": ({ data }) => (
    <section className="pe-show">
      {(data.rows || []).map((r, i) => (
        <div key={i} className={`row ${i % 2 === 1 ? "swap" : ""}`}>
          <div className={`visual ${r.contain ? "contain" : ""}`}
               style={{ backgroundImage: `url(${r.image})`, backgroundColor: r.bg || "var(--paper)" }} />
          <div className="text">
            <h3>{r.heading}</h3>
            <p>{r.text}</p>
          </div>
        </div>
      ))}
    </section>
  ),

  /* Video destacado (puede ser <video src> o iframe de youtube/vimeo) */
  "video": ({ data }) => (
    <section className="pe-video">
      <div className="frame">
        {data.embed
          ? <iframe src={data.embed} allow="autoplay; fullscreen" allowFullScreen />
          : <video src={data.video} controls poster={data.poster} />}
      </div>
      {data.caption && <p className="caption">{data.caption}</p>}
    </section>
  ),
};

window.ProjectEntry = ProjectEntry;
window.PROJECT_TEMPLATES = Object.keys(TEMPLATES);
