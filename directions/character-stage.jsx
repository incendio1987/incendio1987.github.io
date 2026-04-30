/* Dirección 3 — CHARACTER STAGE
   Un monquit gigante saluda. Los proyectos son stickers/tags
   alrededor. Más juguetón y memorable. */

function CharacterStage() {
  const [active, setActive] = React.useState(0);

  const css = `
    .cs-stage {
      width: 100%; height: 100%;
      background: #1d1bff;
      color: #fffaee;
      font-family: "Helvetica Neue", "Helvetica", "Arial", sans-serif;
      font-weight: 900;
      letter-spacing: -0.01em;
      position: relative;
      overflow: hidden;
      display: flex; flex-direction: column;
      padding: 24px 32px;
      box-sizing: border-box;
    }
    .cs-stage::before {
      content: ""; position: absolute; inset: 0; pointer-events: none;
      background: radial-gradient(ellipse at 50% 30%, rgba(255,255,255,0.12), transparent 60%);
    }

    .cs-top {
      display: flex; justify-content: space-between; align-items: center;
      font-size: 11px; letter-spacing: 0.3em; font-weight: 700;
      z-index: 4; position: relative;
    }
    .cs-top .logo { display: flex; align-items: center; gap: 10px; }
    .cs-top .logo .o {
      width: 22px; height: 22px; border-radius: 50%;
      background: linear-gradient(135deg, #ffd000, #ec4899);
      animation: csWobble 5s ease-in-out infinite;
    }
    @keyframes csWobble {
      0%,100% { border-radius: 50%; }
      50% { border-radius: 60% 40% 50% 50% / 55% 45% 55% 45%; }
    }
    .cs-top .nav { display: flex; gap: 22px; }
    .cs-top .nav a { cursor: pointer; }
    .cs-top .nav a.active { color: #ffd000; }

    .cs-arena {
      flex: 1;
      display: grid;
      grid-template-columns: 280px 1fr 280px;
      gap: 20px;
      align-items: stretch;
      position: relative;
      z-index: 3;
      padding-top: 20px;
    }

    .cs-side {
      display: flex; flex-direction: column; gap: 12px;
      font-size: 11px; letter-spacing: 0.04em;
    }
    .cs-side .lab {
      font-size: 9px; letter-spacing: 0.4em; font-weight: 700;
      opacity: 0.7; margin-bottom: 4px;
    }
    .cs-side h1 {
      font-size: clamp(42px, 5vw, 76px);
      line-height: 0.85; letter-spacing: -0.04em;
      margin: 0;
    }
    .cs-side h1 b { display: block; }
    .cs-side .yellow { color: #ffd000; }
    .cs-side .pink { color: #ff8de0; }

    .cs-tagline {
      font-weight: 400; letter-spacing: 0.04em;
      font-size: 12px; line-height: 1.5;
      max-width: 240px; margin-top: 16px;
    }
    .cs-tagline b { font-weight: 900; }

    /* right side — project list */
    .cs-list { align-items: flex-end; text-align: right; }
    .cs-list .lab { width: 100%; }
    .cs-list .item {
      display: flex; flex-direction: column; align-items: flex-end;
      cursor: pointer; padding: 6px 0; border-bottom: 1px solid rgba(255,250,238,0.2);
      transition: padding 0.2s ease;
      width: 100%;
    }
    .cs-list .item:hover { padding-right: 4px; }
    .cs-list .item.active { padding-right: 4px; color: #ffd000; }
    .cs-list .item .num { font-size: 9px; letter-spacing: 0.4em; opacity: 0.6; font-weight: 700; }
    .cs-list .item .ttl { font-size: 22px; letter-spacing: -0.02em; line-height: 1; margin-top: 2px; }
    .cs-list .item .yr { font-size: 9px; letter-spacing: 0.3em; opacity: 0.5; font-weight: 700; margin-top: 4px; }

    /* center stage */
    .cs-center {
      position: relative;
      display: flex; align-items: center; justify-content: center;
    }
    .cs-monq {
      width: 100%; max-width: 360px;
      filter: drop-shadow(0 14px 0 rgba(0,0,0,0.4));
      animation: csFloat 4s ease-in-out infinite;
    }
    @keyframes csFloat {
      0%,100% { transform: translateY(0) rotate(-2deg); }
      50% { transform: translateY(-10px) rotate(2deg); }
    }

    .cs-sticker {
      position: absolute;
      padding: 6px 12px;
      font-size: 10px; letter-spacing: 0.25em; font-weight: 900;
      border: 2px solid #0a0a0a;
      background: #fffaee; color: #0a0a0a;
      transform: rotate(-7deg);
      box-shadow: 3px 3px 0 rgba(0,0,0,0.4);
    }
    .cs-sticker.pink { background: #ff8de0; }
    .cs-sticker.yellow { background: #ffd000; }
    .cs-sticker.green { background: #5ae3a4; transform: rotate(6deg); }

    .cs-sticker.s1 { top: 4%; left: -4%; }
    .cs-sticker.s2 { top: 22%; right: -2%; transform: rotate(8deg); }
    .cs-sticker.s3 { bottom: 18%; left: -8%; transform: rotate(-12deg); }
    .cs-sticker.s4 { bottom: 4%; right: 4%; }

    .cs-bottom {
      display: flex; justify-content: space-between; align-items: center;
      margin-top: 14px; padding-top: 14px;
      border-top: 1px solid rgba(255,250,238,0.2);
      font-size: 10px; letter-spacing: 0.3em; font-weight: 700;
      z-index: 4; position: relative;
    }
    .cs-bottom .shopcta {
      padding: 10px 18px; background: #ffd000; color: #0a0a0a;
      border: 2px solid #0a0a0a; cursor: pointer;
      box-shadow: 4px 4px 0 #0a0a0a;
      transition: transform 0.15s ease;
    }
    .cs-bottom .shopcta:hover { transform: translate(-2px,-2px); box-shadow: 6px 6px 0 #0a0a0a; }
    .cs-bottom .palette {
      display: flex; gap: 5px;
    }
    .cs-bottom .palette i { width: 14px; height: 14px; display: block; border: 1.5px solid #0a0a0a; }
  `;

  const items = [
    { num: "01", title: "monquits", tag: "ILLUSTRATION", year: "2026" },
    { num: "02", title: "veoveo", tag: "TYPE STUDY", year: "2026" },
    { num: "03", title: "gradient generator", tag: "AI / TOOL", year: "2026" },
    { num: "04", title: "palette finder", tag: "AI / TOOL", year: "2026" },
  ];

  return (
    <div className="cs-stage">
      <style>{css}</style>

      <header className="cs-top">
        <div className="logo"><span className="o" /> INCENDIO·1987</div>
        <nav className="nav">
          <a className="active">WORK</a><a>SHOP</a><a>ABOUT</a><a>CONTACT</a>
        </nav>
        <div>MADRID · '26</div>
      </header>

      <div className="cs-arena">
        <aside className="cs-side">
          <div className="lab">— PORTFOLIO / 2026</div>
          <h1>
            <b>HOLA</b>
            <b className="yellow">SOY</b>
            <b className="pink">INCENDIO</b>
          </h1>
          <p className="cs-tagline">
            <b>Hago figuritas felices, gradients que muerden y herramientas que me hubiera molado tener.</b> Si te gusta lo que ves, hablemos.
          </p>
        </aside>

        <div className="cs-center">
          <span className="cs-sticker s1">FRESH '26</span>
          <span className="cs-sticker s2 pink">+12 PROYECTOS</span>
          <span className="cs-sticker s3 yellow">VIBE CODE ✦</span>
          <span className="cs-sticker s4 green">AVAILABLE</span>
          <img className="cs-monq" src="assets/projects/monquits/monquit.png" alt="monquit" />
        </div>

        <aside className="cs-side cs-list">
          <div className="lab">— LATEST WORK ↓</div>
          {items.map((it, i) => (
            <a key={it.num} className={`item ${active === i ? "active" : ""}`}
               onMouseEnter={() => setActive(i)}>
              <span className="num">{it.num} · {it.tag}</span>
              <span className="ttl">{it.title}</span>
              <span className="yr">{it.year}</span>
            </a>
          ))}
        </aside>
      </div>

      <footer className="cs-bottom">
        <span>© INCENDIO 1987 — INCENDIO1987@PROTONMAIL.COM</span>
        <div className="palette">
          <i style={{ background: "#ffd000" }} />
          <i style={{ background: "#ff8de0" }} />
          <i style={{ background: "#5ae3a4" }} />
          <i style={{ background: "#1d1bff" }} />
          <i style={{ background: "#0a0a0a" }} />
        </div>
        <span className="shopcta">VISITAR SHOP →</span>
      </footer>
    </div>
  );
}

window.CharacterStage = CharacterStage;
