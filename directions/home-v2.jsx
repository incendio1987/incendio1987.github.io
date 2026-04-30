/* ============================================================
   HOME v2 — Character Stage scrollable
   Sistema i18n simple: t("clave") con fallback ES si no hay EN.
   ============================================================ */

/* ─── i18n ─── */
const STRINGS = {
  hola:           { es: "HOLA",                          en: "HELLO" },
  soy:            { es: "SOY",                           en: "I'M" },
  hero_tag:       { es: "Hago caritas, gradients y sigo aprendiendo a darle la vuelta a la tortilla.",
                    en: "I make faces, gradients, and keep learning to flip the script." },
  hero_tag_b:     { es: "Si te gusta lo que ves, hablemos.",
                    en: "If you like what you see, let's chat." },
  ultimo:         { es: "ÚLTIMO",                        en: "LATEST" },
  fresh:          { es: "FRESH '26",                     en: "FRESH '26" },
  proyectos:      { es: "PROYECTOS",                     en: "PROJECTS" },
  vibe_code:      { es: "VIBE CODE ✦",                   en: "VIBE CODE ✦" },
  shop_arrow:     { es: "SHOP →",                        en: "SHOP →" },
  latest_work:    { es: "TRABAJOS RECIENTES",            en: "LATEST WORK" },
  cosas_bonitas:  { es: "cosas\nbonitas.",               en: "good\nstuff." },
  cosas_sub:      { es: "selección personal de mis trabajos favoritos. mezcla de ilustración, scripts, carteles, type.",
                    en: "personal selection of favorite work. illustration, scripts, posters, type." },
  pausar:         { es: "❚❚ PAUSAR",                     en: "❚❚ PAUSE" },
  autoplay:       { es: "▶ AUTOPLAY",                    en: "▶ AUTOPLAY" },
  ver_favoritos:  { es: "VER TODOS LOS FAVORITOS →",     en: "SEE ALL FAVORITES →" },
  todo_archivo:   { es: "todo el\narchivo.",             en: "the whole\narchive." },
  buscar:         { es: "BUSCAR PROYECTOS, TAGS, AÑOS…", en: "SEARCH PROJECTS, TAGS, YEARS…" },
  ilustracion:    { es: "ilustración",                   en: "illustration" },
  webdev:         { es: "web/dev",                       en: "web/dev" },
  branding:       { es: "branding",                      en: "branding" },
  shop:           { es: "shop",                          en: "shop" },
  work:           { es: "WORK",                          en: "WORK" },
  about:          { es: "ABOUT",                         en: "ABOUT" },
  contact:        { es: "CONTACT",                       en: "CONTACT" },
  paleta:         { es: "PALETA",                        en: "PALETTE" },
  madrid:         { es: "MADRID · '26",                  en: "MADRID · '26" },
};
function makeT(lang) {
  return (key) => {
    const e = STRINGS[key]; if (!e) return key;
    return e[lang] || e.es || key;
  };
}

const HOME_PROJECTS = [
  { id: "monquits", title: "monquits", cat: "ILLUSTRATION", year: "2026", cover: "assets/projects/monquits/monquit.png", contain: true, featured: true },
  { id: "veoveo", title: "veoveo", cat: "TYPE STUDY", year: "2026", cover: "assets/projects/veoveo/veo_20260429_103026.png", contain: true, featured: true },
  { id: "gradient-generator", title: "gradient generator", cat: "WEB / DEV", year: "2026", cover: "assets/projects/gradient-generator/gradient-1920x1080.png", featured: true },
  { id: "palette-finder", title: "palette finder", cat: "WEB / DEV", year: "2026", cover: "assets/projects/palette-finder/palette-1777475649612.png", featured: true },
  { id: "monquits-2", title: "monquit #03", cat: "ILLUSTRATION", year: "2026", cover: "assets/projects/monquits/monquit3.png", contain: true, featured: true },
  { id: "veo-100", title: "veo loop", cat: "TYPE STUDY", year: "2026", cover: "assets/projects/veoveo/veo_20260429_100017.png", contain: true, featured: true },
];

/* ─── PEGATINAS DEL HERO ───
   Editables desde el .exe. Cada una:
     id:    identificador único
     label: texto (usa { es, en } para bilingüe; o un string suelto si da igual)
     href:  null (decorativa) o string (link)
     pos:   { top/right/bottom/left } en px o %  →  posición sobre el hero
     rot:   rotación base en grados
     bg:    color de fondo: "a1" | "a2" | "a3" | "paper" | "ink" | hex
     fg:    color de texto (opcional, default "ink" — sobre paper/a1/a2/a3 — o "paper" si bg="ink")
     size:  "sm" | "md" | "lg"   →  tamaño tipográfico/padding
     dance: estilo de baile  →  "wiggle" | "spin" | "bob" | "swing" | "none"
*/
const HERO_STICKERS = [
  {
    id: "concepts", label: { es: "VISUAL CONCEPTS", en: "VISUAL CONCEPTS" },
    href: null,
    pos: { top: "-16px", right: "-38px" }, rot: 8, bg: "a1", size: "sm", dance: "wiggle",
  },
  {
    id: "total", label: null /* dinámico: "{N} PROYECTOS" */,
    href: null,
    pos: { top: "20px", right: "-90px" }, rot: -9, bg: "paper", size: "sm", dance: "bob",
  },
  {
    id: "vibe", label: { es: "VIBE CODE ✦", en: "VIBE CODE ✦" },
    href: "#category/web-dev",
    pos: { bottom: "120px", left: "-72px" }, rot: -12, bg: "a3", size: "sm", dance: "spin",
  },
  {
    id: "shop", label: { es: "SHOP →", en: "SHOP →" },
    href: "#shop",
    pos: { bottom: "16%", right: "-86px" }, rot: -9, bg: "a2", size: "lg", dance: "swing",
  },
  {
    id: "latest", label: { es: "TRABAJOS RECIENTES", en: "LATEST WORK" },
    href: "#latest",
    pos: { top: "30%", right: "-50px" }, rot: 4, bg: "a1", size: "md", dance: "wiggle",
    cascade: true, /* despliega los 3 últimos como pegatinas */
  },
];

const PALETTES_HOME = {
  electric: { bg: "#1d1bff", paper: "#fffaee", ink: "#0a0a0a", accent1: "#ffd000", accent2: "#ff8de0", accent3: "#5ae3a4" },
  sunset:   { bg: "#ff5e9e", paper: "#fff7d6", ink: "#0a0a0a", accent1: "#ffd000", accent2: "#1d1bff", accent3: "#ff7a59" },
  acid:     { bg: "#16a34a", paper: "#fffaee", ink: "#0a0a0a", accent1: "#ffd000", accent2: "#ff5e9e", accent3: "#1d4ed8" },
  noir:     { bg: "#0a0a0a", paper: "#f4f1ea", ink: "#fffaee", accent1: "#ff1d58", accent2: "#ffd000", accent3: "#5ae3a4" },
  cream:    { bg: "#f6efde", paper: "#fffaee", ink: "#0c2340", accent1: "#c0392b", accent2: "#1e3a8a", accent3: "#d4a017" },
};

function HomeV2() {
  const [tweaks, setTweak] = window.useTweaks(/*EDITMODE-BEGIN*/{
    "palette": "electric",
    "showStickers": true,
    "carouselAutoplay": true,
    "lang": "es"
  }/*EDITMODE-END*/);

  const t = makeT(tweaks.lang || "es");
  const pal = PALETTES_HOME[tweaks.palette] || PALETTES_HOME.electric;
  const featured = HOME_PROJECTS.filter(p => p.featured);
  const latest = HOME_PROJECTS.slice(0, 3);
  const heroImg = HOME_PROJECTS[0];
  const totalProjects = HOME_PROJECTS.length;

  const [latestOpen, setLatestOpen] = React.useState(false);
  const [heroAspect, setHeroAspect] = React.useState(4/5);
  React.useEffect(() => {
    if (!heroImg?.cover) return;
    const im = new Image();
    im.onload = () => {
      if (im.naturalWidth && im.naturalHeight) setHeroAspect(im.naturalWidth / im.naturalHeight);
    };
    im.src = heroImg.cover;
  }, [heroImg && heroImg.cover]);
  const carRef = React.useRef(null);
  const [paused, setPaused] = React.useState(false);
  React.useEffect(() => {
    if (!tweaks.carouselAutoplay || paused) return;
    const id = setInterval(() => {
      const el = carRef.current; if (!el) return;
      const next = el.scrollLeft + 320;
      if (next > el.scrollWidth - el.clientWidth - 4) el.scrollTo({ left: 0, behavior: "smooth" });
      else el.scrollTo({ left: next, behavior: "smooth" });
    }, 2800);
    return () => clearInterval(id);
  }, [tweaks.carouselAutoplay, paused]);

  const css = `
    .h2 { --bg: ${pal.bg}; --paper: ${pal.paper}; --ink: ${pal.ink}; --a1: ${pal.accent1}; --a2: ${pal.accent2}; --a3: ${pal.accent3}; }
    .h2 {
      width: 100%;
      font-family: "Helvetica Neue", "Helvetica", "Arial", sans-serif;
      font-weight: 900; letter-spacing: -0.01em;
      color: var(--paper); background: var(--bg);
    }
    .h2 a { color: inherit; text-decoration: none; cursor: pointer; }

    .h2-top {
      position: sticky; top: 0; z-index: 50;
      display: flex; justify-content: space-between; align-items: center;
      padding: 18px 36px;
      font-size: 11px; letter-spacing: 0.3em; font-weight: 700;
      background: var(--bg);
      border-bottom: 1.5px solid rgba(255,255,255,0.12);
    }
    .h2-top .logo { display: flex; align-items: center; gap: 10px; }
    .h2-top .logo .o {
      width: 22px; height: 22px; border-radius: 50%;
      background: linear-gradient(135deg, var(--a1), var(--a2));
      animation: h2Wob 5s ease-in-out infinite;
    }
    @keyframes h2Wob {
      0%,100% { border-radius: 50%; }
      50% { border-radius: 60% 40% 50% 50% / 55% 45% 55% 45%; }
    }
    .h2-top nav { display: flex; gap: 22px; }
    .h2-top nav a { padding-bottom: 4px; border-bottom: 2px solid transparent; transition: border 0.2s; }
    .h2-top nav a:hover, .h2-top nav a.active { border-bottom-color: var(--a1); color: var(--a1); }

    .h2-right { display: flex; align-items: center; gap: 18px; }
    .h2-lang { display: flex; gap: 4px; }
    .h2-lang button {
      background: transparent; border: none; cursor: pointer; padding: 4px 6px;
      font-size: 16px; line-height: 1; opacity: 0.4; transition: opacity 0.2s, transform 0.2s;
      filter: grayscale(0.6);
    }
    .h2-lang button:hover { opacity: 1; transform: translateY(-2px); filter: grayscale(0); }
    .h2-lang button.on { opacity: 1; filter: grayscale(0); }
    .h2-top .ham { display: flex; flex-direction: column; gap: 4px; cursor: pointer; }
    .h2-top .ham span { width: 22px; height: 2px; background: var(--paper); display: block; }
    .h2-top .ham span:nth-child(2) { width: 16px; }
    .h2-top .ham span:nth-child(3) { width: 10px; }

    /* ───── BLOQUE 1 — STAGE ───── */
    .h2-stage {
      min-height: 100vh;
      display: grid;
      grid-template-columns: minmax(380px, 1fr) minmax(0, 1.2fr) 240px;
      gap: 0;
      padding: 36px 80px 36px 48px;
      box-sizing: border-box;
      position: relative;
      align-items: start;
    }
    .h2-stage::before {
      content: ""; position: absolute; inset: 0; pointer-events: none;
      background: radial-gradient(ellipse at 50% 30%, rgba(255,255,255,0.10), transparent 60%);
    }

    .h2-side { display: flex; flex-direction: column; font-size: 11px; position: relative; z-index: 4; padding-top: 20px; }
    .h2-side h1 {
      font-size: clamp(64px, 7.4vw, 116px);
      line-height: 0.82; letter-spacing: -0.05em;
      margin: 0 0 26px;
      position: relative; z-index: 4;
      mix-blend-mode: normal;
    }
    /* el INCENDIO se desborda y pisa la imagen */
    .h2-side h1 .p {
      color: var(--a2);
      position: relative;
      white-space: nowrap;
    }
    .h2-side h1 b { display: block; }
    .h2-side h1 .y { color: var(--a1); }
    .h2-side h1 .p { color: var(--a2); }
    .h2-tag {
      font-weight: 400; letter-spacing: 0.02em;
      font-size: 17px; line-height: 1.45; max-width: 340px;
      margin: 0 0 22px;
    }
    .h2-tag b { font-weight: 900; }

    /* center — hero auto-aspect */
    .h2-center { position: relative; display: flex; align-items: center; justify-content: center; z-index: 2; padding: 70px 100px 40px 30px; margin-left: -80px; }
    .h2-hero {
      --aspect: ${heroAspect};
      width: min(640px, 50vw);
      max-height: 76vh;
      aspect-ratio: var(--aspect);
      border: 3px solid var(--ink); background: var(--paper);
      filter: drop-shadow(0 18px 0 rgba(0,0,0,0.35));
      animation: h2Float 4.5s ease-in-out infinite;
      position: relative; cursor: pointer;
    }
    .h2-hero .inner {
      position: absolute; inset: 0; overflow: hidden;
    }
    .h2-hero .img {
      position: absolute; inset: 0;
      background-size: ${heroImg.contain ? "contain" : "cover"};
      background-position: center; background-repeat: no-repeat;
      background-image: url(${heroImg.cover});
      background-color: ${heroImg.contain ? pal.accent1 : "transparent"};
    }
    .h2-hero .ribbon {
      position: absolute; top: 14px; left: 14px;
      padding: 5px 10px; background: var(--paper); color: var(--ink);
      font-size: 9px; letter-spacing: 0.3em; font-weight: 900;
      border: 2px solid var(--ink);
      z-index: 4;
    }
    .h2-hero .meta {
      position: absolute; bottom: 0; left: 0; right: 0;
      padding: 12px 14px;
      background: var(--paper); color: var(--ink);
      border-top: 2px solid var(--ink);
      display: flex; justify-content: space-between; align-items: baseline;
    }
    .h2-hero .meta .t { font-size: 18px; letter-spacing: -0.02em; line-height: 1; }
    .h2-hero .meta .y { font-size: 9px; letter-spacing: 0.3em; opacity: 0.6; font-weight: 700; }
    @keyframes h2Float {
      0%,100% { transform: translateY(0) rotate(-1.5deg); }
      50% { transform: translateY(-12px) rotate(1.5deg); }
    }

    /* stickers — sistema configurable, baile independiente */
    .h2-stk {
      position: absolute;
      padding: 7px 12px;
      font-size: 10px; letter-spacing: 0.25em; font-weight: 900;
      border: 2px solid var(--ink);
      box-shadow: 3px 3px 0 rgba(0,0,0,0.4);
      z-index: 5;
      user-select: none;
      white-space: nowrap;
    }
    .h2-stk.size-sm { padding: 7px 12px; font-size: 10px; letter-spacing: 0.25em; }
    .h2-stk.size-md { padding: 11px 16px; font-size: 12px; letter-spacing: 0.22em; }
    .h2-stk.size-lg { padding: 14px 20px; font-size: 15px; letter-spacing: 0.18em; box-shadow: 5px 5px 0 var(--ink); }

    /* colores */
    .h2-stk.bg-a1     { background: var(--a1); color: var(--ink); }
    .h2-stk.bg-a2     { background: var(--a2); color: var(--ink); }
    .h2-stk.bg-a3     { background: var(--a3); color: var(--ink); }
    .h2-stk.bg-paper  { background: var(--paper); color: var(--ink); }
    .h2-stk.bg-ink    { background: var(--ink); color: var(--paper); }

    a.h2-stk { cursor: pointer; transition: filter 0.2s ease; }
    a.h2-stk:hover { filter: brightness(1.06); animation-play-state: paused; }
    /* hover — cada pegatina tiene su propio "kick" interactivo */
    a.h2-stk.dance-wiggle:hover { animation: stkKickWiggle 0.5s ease-in-out infinite; }
    a.h2-stk.dance-spin:hover   { animation: stkKickSpin   0.6s ease-in-out infinite; }
    a.h2-stk.dance-bob:hover    { animation: stkKickBob    0.4s ease-in-out infinite; }
    a.h2-stk.dance-swing:hover  { animation: stkKickSwing  0.45s ease-in-out infinite; }
    @keyframes stkKickWiggle {
      0%, 100% { transform: rotate(calc(var(--rot, 0deg) - 6deg)) scale(1.06); }
      50%      { transform: rotate(calc(var(--rot, 0deg) + 6deg)) scale(1.10) translateY(-4px); }
    }
    @keyframes stkKickSpin {
      0%   { transform: rotate(calc(var(--rot, 0deg) - 12deg)) scale(1.08); }
      50%  { transform: rotate(calc(var(--rot, 0deg) + 12deg)) scale(1.12); }
      100% { transform: rotate(calc(var(--rot, 0deg) - 12deg)) scale(1.08); }
    }
    @keyframes stkKickBob {
      0%, 100% { transform: rotate(var(--rot, 0deg)) translateY(-2px) scale(1.06); }
      50%      { transform: rotate(var(--rot, 0deg)) translateY(-10px) scale(1.10); }
    }
    @keyframes stkKickSwing {
      0%, 100% { transform: rotate(calc(var(--rot, 0deg) + 10deg)) scale(1.06); }
      50%      { transform: rotate(calc(var(--rot, 0deg) - 10deg)) scale(1.06); }
    }

    /* bailes independientes — cada uno con su propio ritmo */
    .h2-stk.dance-wiggle { animation: stkWiggle 4.2s ease-in-out infinite; transform-origin: center; }
    .h2-stk.dance-spin   { animation: stkSpin   6.5s ease-in-out infinite; transform-origin: center; }
    .h2-stk.dance-bob    { animation: stkBob    3.8s ease-in-out infinite; transform-origin: center; }
    .h2-stk.dance-swing  { animation: stkSwing  5.5s ease-in-out infinite; transform-origin: top center; }
    .h2-stk.dance-none   { transform: rotate(var(--rot, 0deg)); }

    @keyframes stkWiggle {
      0%, 100% { transform: rotate(calc(var(--rot, 0deg) - 2deg)) translateY(0); }
      50%      { transform: rotate(calc(var(--rot, 0deg) + 2deg)) translateY(-3px); }
    }
    @keyframes stkSpin {
      0%   { transform: rotate(calc(var(--rot, 0deg) - 4deg)) translateY(0); }
      25%  { transform: rotate(calc(var(--rot, 0deg) + 6deg)) translateY(-4px); }
      50%  { transform: rotate(calc(var(--rot, 0deg) - 2deg)) translateY(0); }
      75%  { transform: rotate(calc(var(--rot, 0deg) + 4deg)) translateY(2px); }
      100% { transform: rotate(calc(var(--rot, 0deg) - 4deg)) translateY(0); }
    }
    @keyframes stkBob {
      0%, 100% { transform: rotate(var(--rot, 0deg)) translateY(0); }
      50%      { transform: rotate(var(--rot, 0deg)) translateY(-6px); }
    }
    @keyframes stkSwing {
      0%, 100% { transform: rotate(calc(var(--rot, 0deg) + 4deg)); }
      50%      { transform: rotate(calc(var(--rot, 0deg) - 4deg)); }
    }

    /* CASCADA — pegatinas hijo del LATEST WORK, gap visible */
    .h2-latest-cascade {
      position: absolute;
      top: calc(100% + 14px);
      right: 0;
      display: flex; flex-direction: column;
      gap: 14px;
      align-items: flex-end;
      max-height: 0;
      overflow: visible;
      pointer-events: none;
      z-index: 8;
    }
    .h2-latest-cascade.open { max-height: 600px; pointer-events: auto; }
    .h2-latest-cascade > a.h2-stk {
      position: relative;
      animation: none !important;
      transform: rotate(var(--r, 0deg)) translateY(-16px);
      opacity: 0;
      pointer-events: none;
      background: var(--paper); color: var(--ink);
      transition: transform 0.4s cubic-bezier(0.34, 1.5, 0.64, 1), opacity 0.3s ease;
      min-width: 200px;
      text-align: right;
    }
    .h2-latest-cascade.open > a.h2-stk {
      transform: rotate(var(--r, 0deg)) translateY(0);
      opacity: 1;
      pointer-events: auto;
    }
    .h2-latest-cascade.open > a.h2-stk:nth-child(1) { transition-delay: 0.05s; }
    .h2-latest-cascade.open > a.h2-stk:nth-child(2) { transition-delay: 0.12s; }
    .h2-latest-cascade.open > a.h2-stk:nth-child(3) { transition-delay: 0.19s; }
    .h2-latest-cascade > a .ttl { font-size: 14px; letter-spacing: -0.02em; display: block; }
    .h2-latest-cascade > a .yr { font-size: 8px; letter-spacing: 0.3em; opacity: 0.5; font-weight: 700; display: block; margin-top: 3px; }

    /* CATEGORÍAS lado derecho — separado del borde */
    .h2-cats-side {
      width: 100%;
      display: flex; flex-direction: column;
      text-align: right;
      gap: 4px;
      align-self: end;
      padding-top: 80px;
    }
    .h2-cats-side .item {
      cursor: pointer; padding: 8px 0;
      border-bottom: 1px solid rgba(255,255,255,0.18);
      transition: padding 0.2s ease, color 0.2s;
      font-size: 30px; letter-spacing: -0.02em; line-height: 1;
      color: var(--paper);
      font-weight: 900;
    }
    .h2-cats-side .item:hover { padding-right: 6px; color: var(--a1); }

    /* ───── BLOQUE 2 — COSAS BONITAS ───── */
    .h2-bonitas {
      background: var(--paper); color: var(--ink);
      padding: 60px 0 70px;
      border-top: 3px solid var(--ink);
      border-bottom: 3px solid var(--ink);
    }
    .h2-bonitas-head {
      display: flex; justify-content: space-between; align-items: flex-end;
      padding: 0 36px 28px;
    }
    .h2-bonitas-head .ttl {
      font-size: clamp(46px, 7vw, 96px); line-height: 0.85;
      letter-spacing: -0.045em; margin: 0;
      white-space: pre-line;
    }
    .h2-bonitas-head .sub {
      font-size: 11px; letter-spacing: 0.35em; font-weight: 700;
      max-width: 260px; text-align: right; line-height: 1.6;
    }
    .h2-bonitas-head .sub b { display: block; font-size: 9px; opacity: 0.6; margin-top: 8px; }

    .h2-carousel-wrap { position: relative; }
    .h2-carousel {
      display: flex; gap: 16px; padding: 0 36px;
      overflow-x: auto; scroll-snap-type: x mandatory; scrollbar-width: none;
    }
    .h2-carousel::-webkit-scrollbar { display: none; }
    .h2-cb {
      flex: 0 0 320px; aspect-ratio: 4 / 5;
      scroll-snap-align: start;
      border: 3px solid var(--ink);
      position: relative; overflow: hidden; cursor: pointer;
      transition: transform 0.4s cubic-bezier(0.34, 1.4, 0.64, 1);
      background: var(--bg);
    }
    .h2-cb:hover { transform: translate(-3px,-3px); box-shadow: 8px 8px 0 var(--ink); }
    .h2-cb .img { position: absolute; inset: 0; background-size: cover; background-position: center; }
    .h2-cb .img.contain { background-size: contain; background-repeat: no-repeat; background-color: var(--a1); }
    .h2-cb .num {
      position: absolute; top: 10px; left: 10px;
      font-size: 9px; letter-spacing: 0.3em; padding: 4px 8px;
      background: var(--paper); border: 1.5px solid var(--ink); font-weight: 900; color: var(--ink);
    }
    .h2-cb .meta {
      position: absolute; bottom: 0; left: 0; right: 0;
      padding: 12px 14px;
      background: var(--paper); color: var(--ink);
      border-top: 2px solid var(--ink);
      display: flex; justify-content: space-between; align-items: baseline;
    }
    .h2-cb .meta .t { font-size: 16px; letter-spacing: -0.02em; line-height: 1; }
    .h2-cb .meta .c { font-size: 9px; letter-spacing: 0.3em; opacity: 0.6; font-weight: 700; }

    .h2-carousel-controls {
      display: flex; justify-content: space-between; align-items: center;
      padding: 22px 36px 0;
    }
    .h2-carousel-controls .pause, .h2-carousel-controls .all {
      padding: 8px 14px;
      border: 2px solid var(--ink);
      font-size: 10px; letter-spacing: 0.3em; font-weight: 900;
      cursor: pointer;
    }
    .h2-carousel-controls .pause { background: var(--paper); color: var(--ink); }
    .h2-carousel-controls .pause:hover { background: var(--ink); color: var(--paper); }
    .h2-carousel-controls .all { background: var(--ink); color: var(--paper); }
    .h2-carousel-controls .all:hover { background: var(--a1); color: var(--ink); }

    /* ───── BLOQUE 3 — BROWSE ───── */
    .h2-browse { padding: 70px 36px 48px; }
    .h2-browse-head {
      display: flex; justify-content: space-between; align-items: flex-end;
      margin-bottom: 32px;
    }
    .h2-browse-head h2 {
      font-size: clamp(46px, 7vw, 96px); line-height: 0.85;
      letter-spacing: -0.045em; margin: 0;
      white-space: pre-line;
    }
    .h2-browse-head h2 em { font-style: normal; color: var(--a1); }
    .h2-browse-search {
      display: flex; gap: 8px; align-items: center;
      width: 320px;
      border-bottom: 2px solid var(--paper);
      padding: 8px 0;
    }
    .h2-browse-search input {
      background: transparent; border: none; outline: none;
      color: var(--paper); flex: 1;
      font-family: inherit; font-weight: 700;
      font-size: 13px; letter-spacing: 0.18em;
      text-transform: uppercase;
    }
    .h2-browse-search input::placeholder { color: var(--paper); opacity: 0.4; font-weight: 300; }
    .h2-browse-search .ic { font-size: 18px; opacity: 0.6; font-weight: 300; }

    .h2-cats { display: grid; grid-template-columns: repeat(4, 1fr); gap: 14px; }
    .h2-cat {
      aspect-ratio: 4 / 5;
      border: 3px solid var(--ink);
      position: relative; overflow: hidden;
      cursor: pointer;
      transition: transform 0.35s cubic-bezier(0.34, 1.4, 0.64, 1);
      display: flex; flex-direction: column; justify-content: flex-end;
      padding: 20px;
      box-sizing: border-box;
    }
    .h2-cat:hover { transform: translate(-3px,-3px); box-shadow: 8px 8px 0 var(--ink); }
    .h2-cat::before { content: ""; position: absolute; inset: 0; z-index: 0; background: var(--cat-bg); }
    .h2-cat::after {
      content: ""; position: absolute; inset: 0; z-index: 0;
      background-image: var(--cat-img);
      background-size: cover; background-position: center;
      opacity: 0.45; mix-blend-mode: multiply;
      transition: opacity 0.3s, transform 0.4s;
    }
    .h2-cat:hover::after { opacity: 0.75; transform: scale(1.04); }
    .h2-cat .ttl { position: relative; z-index: 1; color: var(--ink);
      font-size: clamp(28px, 2.4vw, 36px); letter-spacing: -0.03em; line-height: 0.9;
    }

    .h2-foot {
      padding: 24px 36px;
      border-top: 1.5px solid rgba(255,255,255,0.18);
      display: flex; justify-content: space-between; align-items: center;
      font-size: 10px; letter-spacing: 0.35em; font-weight: 700;
    }
    .h2-foot a { opacity: 0.85; }
    .h2-foot a:hover { opacity: 1; color: var(--a1); }
    .h2-foot .pal { display: flex; gap: 6px; align-items: center; }
    .h2-foot .pal i { width: 16px; height: 16px; cursor: pointer; border: 1.5px solid var(--paper); transition: transform 0.2s; }
    .h2-foot .pal i:hover { transform: translateY(-2px); }
    .h2-foot .pal span { font-size: 9px; opacity: 0.5; margin-right: 6px; }
  `;

  const palEntries = Object.entries(PALETTES_HOME);
  const cats = [
    { id: "illustration", title: t("ilustracion") },
    { id: "web",          title: t("webdev") },
    { id: "branding",     title: t("branding") },
    { id: "shop",         title: t("shop") },
  ];
  const browseCats = [
    { ...cats[0], bg: pal.accent2, img: HOME_PROJECTS[4].cover },
    { ...cats[1], bg: pal.accent3, img: HOME_PROJECTS[2].cover },
    { ...cats[2], bg: pal.accent1, img: HOME_PROJECTS[1].cover },
    { ...cats[3], bg: pal.paper,   img: HOME_PROJECTS[3].cover },
  ];
  const cascadeRotations = ["-3deg", "2deg", "-2deg"];

  return (
    <div className="h2">
      <style>{css}</style>

      <header className="h2-top">
        <div className="logo"><span className="o" /> INCENDIO·1987</div>
        <nav>
          <a className="active">{t("work")}</a>
          <a>{t("shop").toUpperCase()}</a>
          <a>{t("about")}</a>
          <a>{t("contact")}</a>
        </nav>
        <div className="h2-right">
          <div className="h2-lang">
            <button className={tweaks.lang === "es" ? "on" : ""} onClick={() => setTweak('lang', 'es')} title="Español">🇪🇸</button>
            <button className={tweaks.lang === "en" ? "on" : ""} onClick={() => setTweak('lang', 'en')} title="English">🇬🇧</button>
          </div>
          <div className="ham" aria-label="menu"><span/><span/><span/></div>
        </div>
      </header>

      {/* ────── BLOQUE 1 — STAGE ────── */}
      <section className="h2-stage">
        <aside className="h2-side">
          <h1><b>{t("hola")}</b><b className="y">{t("soy")}</b><b className="p">INCENDIO</b></h1>
          <p className="h2-tag">
            <b>{t("hero_tag")}</b><br/>
            {t("hero_tag_b")}
          </p>
        </aside>

        <div className="h2-center">
          <div className="h2-hero">
            <div className="inner">
              <div className="img" />
              <span className="ribbon">{t("ultimo")}</span>
              <div className="meta">
                <span className="t">{heroImg.title}</span>
                <span className="y">{heroImg.cat} · '{heroImg.year.slice(-2)}</span>
              </div>
            </div>
            {tweaks.showStickers && HERO_STICKERS.map(s => {
              const labelText = s.id === "total"
                ? `${totalProjects} ${t("proyectos")}`
                : (typeof s.label === "string" ? s.label : (s.label?.[tweaks.lang] || s.label?.es || ""));
              const Tag = s.href ? "a" : "span";
              const styleVars = {
                "--rot": `${s.rot || 0}deg`,
                ...s.pos,
              };
              const cls = `h2-stk size-${s.size || "sm"} bg-${s.bg || "paper"} dance-${s.dance || "none"}`;

              if (s.cascade) {
                return (
                  <React.Fragment key={s.id}>
                    <a className={`${cls} ${latestOpen ? "open" : ""}`}
                       style={styleVars}
                       href={s.href || "#"}
                       onClick={(e) => { e.preventDefault(); setLatestOpen(o => !o); }}>
                      {labelText} {latestOpen ? "▲" : "▼"}
                    </a>
                    <div className={`h2-latest-cascade ${latestOpen ? "open" : ""}`} style={s.pos}>
                      {latest.map((p, i) => (
                        <a key={p.id} className={`h2-stk size-sm bg-paper`}
                           style={{ "--r": cascadeRotations[i] }}
                           href={`#project/${p.id}`}>
                          <span className="ttl">{p.title}</span>
                          <span className="yr">{p.cat} · {p.year}</span>
                        </a>
                      ))}
                    </div>
                  </React.Fragment>
                );
              }
              return (
                <Tag key={s.id} className={cls} style={styleVars}
                     {...(s.href ? { href: s.href } : {})}>
                  {labelText}
                </Tag>
              );
            })}
          </div>
        </div>

        <aside className="h2-side">
          <div className="h2-cats-side">
            {cats.map(c => (
              <a key={c.id} className="item" href={`#category/${c.id}`}>{c.title}</a>
            ))}
          </div>
        </aside>
      </section>

      {/* ────── BLOQUE 2 — COSAS BONITAS ────── */}
      <section className="h2-bonitas">
        <div className="h2-bonitas-head">
          <h2 className="ttl">{t("cosas_bonitas")}</h2>
          <p className="sub">{t("cosas_sub")} <b>— TOP {featured.length} · '26</b></p>
        </div>
        <div className="h2-carousel-wrap"
             onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}>
          <div className="h2-carousel" ref={carRef}>
            {featured.map((p, i) => (
              <a className="h2-cb" key={p.id}>
                <div className={`img ${p.contain ? "contain" : ""}`} style={{ backgroundImage: `url(${p.cover})` }} />
                <span className="num">★ {String(i+1).padStart(2, "0")}</span>
                <div className="meta">
                  <span className="t">{p.title}</span>
                  <span className="c">{p.cat}</span>
                </div>
              </a>
            ))}
          </div>
        </div>
        <div className="h2-carousel-controls">
          <a className="pause" onClick={() => setTweak('carouselAutoplay', !tweaks.carouselAutoplay)}>
            {tweaks.carouselAutoplay ? t("pausar") : t("autoplay")}
          </a>
          <a className="all">{t("ver_favoritos")}</a>
        </div>
      </section>

      {/* ────── BLOQUE 3 — BROWSE ────── */}
      <section className="h2-browse">
        <div className="h2-browse-head">
          <h2>{t("todo_archivo")}</h2>
          <div className="h2-browse-search">
            <input placeholder={t("buscar")} />
            <span className="ic">⌕</span>
          </div>
        </div>
        <div className="h2-cats">
          {browseCats.map(c => (
            <a className="h2-cat" key={c.id}
               href={`#category/${c.id}`}
               style={{ "--cat-bg": c.bg, "--cat-img": `url(${c.img})` }}>
              <span className="ttl">{c.title}</span>
            </a>
          ))}
        </div>
      </section>

      <footer className="h2-foot">
        <span>© INCENDIO 1987</span>
        <a href="mailto:incendio1987@protonmail.com">INCENDIO1987@PROTONMAIL.COM</a>
        <div className="pal">
          <span>{t("paleta")}</span>
          {palEntries.map(([key, p]) => (
            <i key={key}
               style={{ background: p.bg, outline: tweaks.palette === key ? `2px solid ${pal.accent1}` : "none", outlineOffset: 2 }}
               onClick={() => setTweak('palette', key)} title={key} />
          ))}
        </div>
        <span>{t("madrid")}</span>
      </footer>

      <window.TweaksPanel title="Tweaks">
        <window.TweakSection title="Look">
          <window.TweakSelect label="Paleta" value={tweaks.palette}
            onChange={v => setTweak('palette', v)}
            options={palEntries.map(([k]) => ({ value: k, label: k.toUpperCase() }))} />
          <window.TweakRadio label="Idioma" value={tweaks.lang}
            onChange={v => setTweak('lang', v)}
            options={[{ value: "es", label: "ES" }, { value: "en", label: "EN" }]} />
          <window.TweakToggle label="Mostrar pegatinas" value={tweaks.showStickers} onChange={v => setTweak('showStickers', v)} />
          <window.TweakToggle label="Autoplay carrusel" value={tweaks.carouselAutoplay} onChange={v => setTweak('carouselAutoplay', v)} />
        </window.TweakSection>
      </window.TweaksPanel>
    </div>
  );
}

window.HomeV2 = HomeV2;
