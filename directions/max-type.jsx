/* Dirección 1 — MAX TYPE
   Tipografía gigante a lo veoveo. INCENDIO llena la pantalla.
   Los proyectos son tags pequeñas en los huecos. Cero adornos. */

const PROJECTS_MAX = [
  { title: "monquits", year: "26", tag: "ILLUSTRATION", img: "assets/projects/monquits/monquit3.png" },
  { title: "veoveo", year: "26", tag: "TYPE", img: "assets/projects/veoveo/veo_20260429_103026.png" },
  { title: "gradient generator", year: "26", tag: "AI / TOOL", img: "assets/projects/gradient-generator/gradient-1920x1080.png" },
  { title: "palette finder", year: "26", tag: "AI / TOOL", img: "assets/projects/palette-finder/palette-1777475649612.png" },
];

function MaxType() {
  const [hover, setHover] = React.useState(null);

  const css = `
    .mt-stage {
      width: 100%;
      height: 100%;
      background: #f4f1ea;
      color: #0a0a0a;
      font-family: "Helvetica Neue", "Helvetica", "Arial", sans-serif;
      font-weight: 900;
      letter-spacing: -0.02em;
      position: relative;
      overflow: hidden;
      display: flex;
      flex-direction: column;
      padding: 28px 36px 36px;
      box-sizing: border-box;
    }
    .mt-top { display: flex; justify-content: space-between; align-items: flex-start; font-size: 11px; letter-spacing: 0.3em; font-weight: 700; }
    .mt-top .menu { display: flex; flex-direction: column; gap: 4px; }
    .mt-top .menu span { width: 22px; height: 2px; background: #0a0a0a; display: block; }
    .mt-top .menu span:nth-child(2) { width: 16px; }
    .mt-top .menu span:nth-child(3) { width: 10px; }
    .mt-top .meta { text-align: right; line-height: 1.6; opacity: 0.7; }

    .mt-name {
      font-size: clamp(80px, 17vw, 240px);
      line-height: 0.82;
      margin: 8px 0 0 -8px;
      letter-spacing: -0.04em;
      position: relative;
      z-index: 2;
    }
    .mt-name .row {
      display: block;
      white-space: nowrap;
    }
    .mt-name .dot { display: inline-block; transform: translateY(-0.18em); margin: 0 0.04em; font-weight: 400; }
    .mt-name .yr { font-size: 0.32em; letter-spacing: 0.04em; vertical-align: top; margin-left: 0.15em; opacity: 0.6; font-weight: 700; }

    .mt-bar { display: flex; gap: 6px; margin: 14px 0 18px; }
    .mt-bar .pill {
      font-size: 10px; letter-spacing: 0.3em; padding: 7px 12px; border: 1.5px solid #0a0a0a; font-weight: 700;
    }
    .mt-bar .pill.solid { background: #0a0a0a; color: #f4f1ea; }

    .mt-grid {
      flex: 1;
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 14px;
      align-content: end;
    }
    .mt-card {
      position: relative;
      aspect-ratio: 3 / 4;
      border: 2px solid #0a0a0a;
      overflow: hidden;
      background: #fff;
      cursor: pointer;
      transition: transform 0.35s cubic-bezier(0.34, 1.4, 0.64, 1);
      display: flex;
      flex-direction: column;
    }
    .mt-card:hover { transform: translate(-3px, -3px); box-shadow: 6px 6px 0 #0a0a0a; }
    .mt-card .img {
      flex: 1;
      background-size: cover;
      background-position: center;
      position: relative;
    }
    .mt-card .img.g1 { background: linear-gradient(160deg, #ffd000, #ff5e9e 60%, #1d4ed8); }
    .mt-card .img.g2 { background: linear-gradient(180deg, #fffaee 0%, #fffaee 100%); display: flex; align-items: center; justify-content: center; font-size: 38px; letter-spacing: -0.04em; color: #0a0a0a; line-height: 0.85; padding-top: 16px; }
    .mt-card .img.g2 .stack { display: flex; flex-direction: column; align-items: center; gap: 2px; }
    .mt-card .img.g2 .stack b { display: block; font-weight: 900; }
    .mt-card .img.g2 .stack b:nth-child(1) { font-size: 10px; }
    .mt-card .img.g2 .stack b:nth-child(2) { font-size: 14px; }
    .mt-card .img.g2 .stack b:nth-child(3) { font-size: 22px; }
    .mt-card .img.g2 .stack b:nth-child(4) { font-size: 32px; filter: blur(2px); opacity: 0.9; }
    .mt-card .img.g3 { background: linear-gradient(135deg, #1d4ed8 0%, #ec4899 50%, #fbbf24 100%); }
    .mt-card .img.g4 { background: linear-gradient(45deg, #16a34a, #ffd000 50%, #ec4899); }

    .mt-card .label {
      padding: 10px 12px;
      display: flex;
      justify-content: space-between;
      align-items: baseline;
      border-top: 2px solid #0a0a0a;
      background: #fffaee;
      font-size: 11px;
      letter-spacing: 0.04em;
    }
    .mt-card .label .t { font-weight: 900; text-transform: uppercase; letter-spacing: -0.01em; font-size: 13px; }
    .mt-card .label .y { font-size: 9px; letter-spacing: 0.3em; opacity: 0.5; font-weight: 700; }
    .mt-card .tag {
      position: absolute; top: 8px; left: 8px;
      font-size: 8px; letter-spacing: 0.3em; padding: 4px 7px;
      background: #fffaee; border: 1.5px solid #0a0a0a;
      font-weight: 700;
    }

    .mt-foot {
      display: flex; justify-content: space-between; align-items: center;
      margin-top: 16px;
      font-size: 10px; letter-spacing: 0.35em; font-weight: 700;
    }
    .mt-foot .shop {
      padding: 12px 22px; background: #ec4899; color: #fffaee;
      border: 2px solid #0a0a0a; cursor: pointer;
      transition: transform 0.2s ease, background 0.2s ease;
    }
    .mt-foot .shop:hover { transform: translate(-2px,-2px); box-shadow: 4px 4px 0 #0a0a0a; background: #ffd000; color: #0a0a0a; }
  `;

  return (
    <div className="mt-stage">
      <style>{css}</style>
      <div className="mt-top">
        <div className="menu" aria-label="menu"><span /><span /><span /></div>
        <div className="meta">
          PORTFOLIO · ARCHIVE<br/>
          MADRID / REMOTE · AVAILABLE Q3
        </div>
      </div>

      <h1 className="mt-name">
        <span className="row">INCENDIO</span>
        <span className="row">·1987<span className="yr">©</span></span>
      </h1>

      <div className="mt-bar">
        <span className="pill solid">— LATEST WORK</span>
        <span className="pill">ALL ({PROJECTS_MAX.length})</span>
        <span className="pill">ILLUSTRATION</span>
        <span className="pill">AI / TOOLS</span>
      </div>

      <div className="mt-grid">
        {PROJECTS_MAX.map((p, i) => (
          <a className="mt-card" key={p.title}
             onMouseEnter={() => setHover(i)} onMouseLeave={() => setHover(null)}>
            <div className={`img g${i+1}`}
                 style={i === 0 || i >= 2 ? { backgroundImage: `url(${p.img})` } : null}>
              {i === 1 && (
                <div className="stack">
                  <b>VEO</b><b>VEO</b><b>VEO</b><b>VEO</b>
                </div>
              )}
              <span className="tag">{p.tag}</span>
            </div>
            <div className="label">
              <span className="t">{p.title}</span>
              <span className="y">'{p.year}</span>
            </div>
          </a>
        ))}
      </div>

      <div className="mt-foot">
        <span>© INCENDIO 1987 — ALL RIGHTS RESERVED</span>
        <span>SCROLL ↓ FOR ARCHIVE</span>
        <span className="shop">SHOP →</span>
      </div>
    </div>
  );
}

window.MaxType = MaxType;
