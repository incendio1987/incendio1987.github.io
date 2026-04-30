# INCENDIO · portfolio

Portfolio web de INCENDIO (1987). Single-page React + Babel, sin build.

## Estructura

```
.
├── Home v2.html              ← entry point
├── Index Refresh.html        ← versión anterior (iteración previa)
├── tweaks-panel.jsx          ← panel de ajustes en vivo
├── design-canvas.jsx         ← canvas multi-artboard (no usado en home)
├── directions/
│   └── home-v2.jsx           ← componente principal HomeV2
└── assets/
    └── projects/             ← imágenes de cada proyecto
```

## Cómo se sirve

Es 100 % estático. Cualquier server vale:

```bash
npx serve .
# o
python3 -m http.server 8000
```

Abrir `Home v2.html`.

## Pegatinas del hero — editables desde tu .exe

Las pegatinas que rodean la imagen central se definen en un único array al
principio de `directions/home-v2.jsx`:

```js
const HERO_STICKERS = [
  {
    id: "concepts",
    label: { es: "VISUAL CONCEPTS", en: "VISUAL CONCEPTS" },
    href: null,                                  // null = decorativa
    pos: { top: "-16px", right: "-38px" },       // posición sobre el hero
    rot: 8,                                      // rotación base en grados
    bg: "a1",                                    // a1 | a2 | a3 | paper | ink
    size: "sm",                                  // sm | md | lg
    dance: "wiggle",                             // wiggle | spin | bob | swing | none
  },
  // …
];
```

Tu generador (.exe) solo tiene que reescribir ese bloque para cambiar texto,
destino del link, color, posición o estilo de animación de cada sticker.

### Bailes disponibles

| dance    | qué hace                                         |
|----------|--------------------------------------------------|
| `wiggle` | oscilación suave izquierda-derecha               |
| `spin`   | rotación irregular                               |
| `bob`    | sube y baja                                      |
| `swing`  | bamboleo desde arriba                            |
| `none`   | quieto                                           |

Al pasar el ratón cada baile se intensifica con un "kick" interactivo.

## Tweaks en vivo

Activa el panel **Tweaks** (botón en la toolbar del editor) para cambiar:

- **Paleta** — electric / sunset / acid / noir / cream
- **Idioma** — ES / EN
- **Mostrar pegatinas** — on/off
- **Autoplay carrusel** — on/off

## Proyectos destacados

`HOME_PROJECTS` en `directions/home-v2.jsx`. Cada proyecto:

```js
{
  id: "monquits",
  title: "monquits",
  cat: "ILLUSTRATION",
  year: "2026",
  cover: "assets/projects/monquits/monquit.png",
  contain: true,        // true = object-fit: contain ; false = cover
  featured: true,       // aparece en el carrusel "cosas bonitas"
}
```

## Paletas

Editables en `PALETTES_HOME` (mismo archivo). Cada paleta define:
`bg`, `paper`, `ink`, `accent1`, `accent2`, `accent3`.

## Contacto

incendio1987@protonmail.com — Madrid

© INCENDIO 1987
