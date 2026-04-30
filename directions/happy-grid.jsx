/* Dirección 2 — HAPPY GRID
   Mosaico de cards a colores happy con gradients y monquits asomando.
   Más cercano a portfolio clásico pero con personalidad descarada. */

function HappyGrid() {
  const [accent, setAccent] = React.useState("#ec4899");
  const accents = ["#ec4899", "#1d4ed8", "#16a34a", "#ffd000", "#7c3aed", "#ea580c"];

  const css = `
    .hg-stage {
      width: 100%; height: 100%;
      background: #fffaee;
      color: #0a0a0a;
      font-family: "Helvetica Neue", "Helvetica", "Arial", sans-serif;
      font-weight: 900;
      letter-spacing: -0.01em;
      display: flex; flex-direction: column;
      padding: 32px 36px 36px;
      box-sizing: border-box;
      position: relative;
      overflow: hidden;
    }
    .hg-header {
      display: flex; align-items: flex-start; justify-content: space-between;
      margin-bottom: 28px;
    }
    .hg-logo {
      font-size: 13px; letter-spacing: 0.3em; font-weight: 900;
      display: flex; flex-direction: column; gap: 2px;
    }
    .hg-logo .blob {
      width: 28px; height: 28px; border-radius: 50%;
      background: linear-gradient(135deg, #ffd000, #ec4899 50%, #1d4ed8);
      margin-bottom: 8px;
      animation: hgWobble 6s ease-in-out infinite;
    }
    @keyframes hgWobble {
      0%,100% { border-radius: 50%; }
      33% { border-radius: 60% 40% 50% 50% / 50% 60% 40% 50%; }
      66% { border-radius: 45% 55% 60% 40% / 50% 45% 55% 50%; }
    }
    .hg-nav {
      display: flex; gap: 22px; align-items: center;
      font-size: 11px; letter-spacing: 0.3em; font-weight: 700;
    }
    .hg-nav a { cursor: pointer; padding-bottom: 2px; border-bottom: 2px solid transparent; transition: border 0.2s; }
    .hg-nav a:hover { border-bottom-color: #0a0a0a; }
    .hg-nav .cta {
      padding: 8px 14px; border: 2px solid #0a0a0a; background: #0a0a0a; color: #fffaee;
    }

    .hg-hero {
      display: grid;
      grid-template-columns: 1.2fr 1fr;
      gap: 22px;
      margin-bottom: 22px;
    }
    .hg-title {
      font-size: clamp(56px, 9vw, 132px);
      line-height: 0.86;
      letter-spacing: -0.04em;
      margin: 0;
    }
    .hg-title .accent { color: ${accent}; transition: color 0.4s ease; }
    .hg-sub {
      font-weight: 400; letter-spacing: 0.04em;
      font-size: 13px; line-height: 1.55;
      max-width: 360px;
      align-self: end;
    }
    .hg-sub b { font-weight: 900; }
    .hg-sub .pal { display: flex; gap: 6px; margin-top: 14px; }
    .hg-sub .pal i {
      width: 22px; height: 22px; cursor: pointer; display: block;
      border: 2px solid #0a0a0a;
      transition: transform 0.2s;
    }
    .hg-sub .pal i:hover { transform: translateY(-2px); }

    .hg-grid {
      flex: 1;
      display: grid;
      grid-template-columns: repeat(6, 1fr);
      grid-template-rows: repeat(2, 1fr);
      gap: 14px;
      min-height: 360px;
    }
    .hg-card {
      position: relative; overflow: hidden; cursor: pointer;
      border: 2px solid #0a0a0a;
      display: flex; flex-direction: column; justify-content: flex-end;
      transition: transform 0.4s cubic-bezier(0.34, 1.4, 0.64, 1);
    }
    .hg-card:hover { transform: translate(-3px,-3px); box-shadow: 7px 7px 0 #0a0a0a; }
    .hg-card .body {
      position: relative; z-index: 2; padding: 14px;
      color: #0a0a0a;
    }
    .hg-card .body h3 { margin: 0; font-size: 18px; letter-spacing: -0.02em; line-height: 1; }
    .hg-card .body p { margin: 4px 0 0; font-weight: 700; font-size: 9px; letter-spacing: 0.3em; opacity: 0.7; }
    .hg-card .ribbon {
      position: absolute; top: 10px; right: 10px;
      font-size: 8px; letter-spacing: 0.3em; padding: 4px 7px;
      background: #fffaee; border: 1.5px solid #0a0a0a; font-weight: 700;
      z-index: 3;
    }

    /* size variants */
    .hg-card.f1 { grid-column: span 3; grid-row: span 2; }
    .hg-card.f2 { grid-column: span 2; grid-row: span 1; }
    .hg-card.f3 { grid-column: span 1; grid-row: span 1; }
    .hg-card.f4 { grid-column: span 2; grid-row: span 1; }
    .hg-card.f5 { grid-column: span 1; grid-row: span 1; }

    /* card backgrounds */
    .hg-card.k1 { background: linear-gradient(155deg, #ffd000 0%, #ff7a59 35%, #ec4899 75%, #1d4ed8 100%); }
    .hg-card.k2 { background: linear-gradient(140deg, #1d4ed8, #ec4899); }
    .hg-card.k3 { background: #16a34a; }
    .hg-card.k4 { background: linear-gradient(180deg, #fffaee, #fff7d6); }
    .hg-card.k5 { background: #0a0a0a; color: #fffaee; }
    .hg-card.k5 .body { color: #fffaee; }
    .hg-card.k5 .body p { opacity: 0.8; }

    .hg-card .img {
      position: absolute; inset: 0; background-size: cover; background-position: center;
      mix-blend-mode: multiply; opacity: 0.85;
    }
    .hg-card .img.contain { background-size: contain; background-repeat: no-repeat; mix-blend-mode: normal; opacity: 1; }

    .hg-card.k1 .body h3, .hg-card.k2 .body h3 { color: #fffaee; }
    .hg-card.k1 .body p, .hg-card.k2 .body p { color: #fffaee; }

    .hg-veo {
      position: absolute; inset: 0; display: flex; flex-direction: column;
      align-items: center; justify-content: flex-start; padding-top: 12px;
      font-weight: 900; line-height: 0.85; letter-spacing: -0.04em;
      color: #0a0a0a;
    }
    .hg-veo b { display: block; }
    .hg-veo b:nth-child(1) { font-size: 10px; }
    .hg-veo b:nth-child(2) { font-size: 14px; }
    .hg-veo b:nth-child(3) { font-size: 20px; }
    .hg-veo b:nth-child(4) { font-size: 28px; }
    .hg-veo b:nth-child(5) { font-size: 38px; }
    .hg-veo b:nth-child(6) { font-size: 50px; filter: blur(2px); opacity: 0.95; }

    .hg-foot {
      display: flex; justify-content: space-between;
      margin-top: 18px;
      font-size: 10px; letter-spacing: 0.35em; font-weight: 700;
    }
    .hg-foot .palette { display: flex; gap: 6px; align-items: center; }
    .hg-foot .palette span { font-size: 9px; opacity: 0.6; margin-right: 4px; }
  `;

  const cards = [
    { cls: "f1 k1", title: "monquits", tag: "ILLUSTRATION '26", img: "assets/projects/monquits/monquit.png", contain: true },
    { cls: "f2 k4", title: "veoveo", tag: "TYPE STUDY '26", veo: true },
    { cls: "f3 k3", title: "palette finder", tag: "AI · TOOL" },
    { cls: "f4 k2", title: "gradient generator", tag: "AI · TOOL", img: "assets/projects/gradient-generator/gradient-1920x1080.png" },
    { cls: "f5 k5", title: "+ archive", tag: "VIEW ALL" },
  ];

  return (
    <div className="hg-stage">
      <style>{css}</style>

      <header className="hg-header">
        <div className="hg-logo"><span className="blob" />INCENDIO·1987</div>
        <nav className="hg-nav">
          <a>WORK</a><a>SHOP</a><a>ABOUT</a><a className="cta">CONTACT →</a>
        </nav>
      </header>

      <section className="hg-hero">
        <h1 className="hg-title">
          ILUSTRACIÓN<br/>
          GRADIENTS<br/>
          <span className="accent">VECTOR FACES</span>
        </h1>
        <div className="hg-sub">
          <b>HOLA, SOY INCENDIO.</b> Hago ilustración con caras felices, herramientas con IA y juego con tipografía hasta cansarme. <br/><br/>
          Este es el archivo. Si quieres curro, escríbeme.
          <div className="pal">
            {accents.map(c => (
              <i key={c} style={{ background: c }} onClick={() => setAccent(c)} />
            ))}
          </div>
        </div>
      </section>

      <div className="hg-grid">
        {cards.map((c, i) => (
          <article key={i} className={`hg-card ${c.cls}`}>
            {c.img && <div className={`img ${c.contain ? "contain" : ""}`} style={{ backgroundImage: `url(${c.img})` }} />}
            {c.veo && (
              <div className="hg-veo">
                <b>VEO</b><b>VEO</b><b>VEO</b><b>VEO</b><b>VEO</b><b>VEO</b>
              </div>
            )}
            <span className="ribbon">'26</span>
            <div className="body">
              <h3>{c.title}</h3>
              <p>{c.tag}</p>
            </div>
          </article>
        ))}
      </div>

      <footer className="hg-foot">
        <span>© INCENDIO · 1987 / MADRID</span>
        <span className="palette"><span>PALETA</span>
          {accents.map(c => <i key={c} style={{ background: c, width: 14, height: 14, display: "inline-block", border: "1.5px solid #0a0a0a" }} />)}
        </span>
        <span>INCENDIO1987@PROTONMAIL.COM</span>
      </footer>
    </div>
  );
}

window.HappyGrid = HappyGrid;
