# Brief para `.exe` (uploader / editor del portfolio INCENDIO)

## Qué es

Una herramienta de escritorio que el cliente (INCENDIO) usa para:

1. **Subir entradas nuevas** de proyecto al repo de GitHub.
2. **Editar parámetros y textos** de la web sin tocar código.
3. **Reescribir las pegatinas del hero** (texto, link, posición, color, baile).
4. **Cambiar paletas, idioma por defecto, datos del about/contact, etc.**

Conexión: **GitHub API con token personal**. Cada acción del .exe genera un commit en el repo del portfolio.

---

## Estructura del repo (lo que el .exe edita)

```
.
├── index.html
├── tweaks-panel.jsx
├── project-entry.jsx              ← motor de plantillas (no tocar desde .exe)
├── data.json                      ← ★ TODO lo editable vive aquí
├── directions/
│   └── home-v2.jsx                ← lee de data.json
├── projects/
│   ├── monquits.html              ← una HTML por entrada (generada por .exe)
│   ├── veoveo.html
│   └── ...
└── assets/
    └── projects/
        └── <project-id>/          ← el .exe sube imágenes aquí
            ├── cover.jpg
            └── ...
```

---

## `data.json` — el contrato

Archivo único que centraliza todo lo editable. El `.exe` solo necesita saber escribir este JSON y subir imágenes.

```json
{
  "site": {
    "name": "INCENDIO",
    "year": "1987",
    "email": "incendio1987@protonmail.com",
    "city": "Madrid",
    "defaultLang": "es",
    "defaultPalette": "electric"
  },

  "i18n": {
    "es": {
      "hola": "HOLA",
      "soy": "SOY",
      "hero_tag_a": "Diseño, ilustración, código y caos curado.",
      "hero_tag_b": "Si te gusta lo que ves, hablemos.",
      "ultimo": "PENÚLTIMO",
      "proyectos": "PROYECTOS",
      "shop_arrow": "SHOP →",
      "trabajos_recientes": "TRABAJOS RECIENTES",
      "cosas_bonitas": "cosas\nbonitas.",
      "cosas_sub": "selección personal de mis trabajos favoritos.",
      "todo_archivo": "todo el\narchivo.",
      "buscar": "Buscar proyecto…",
      "ilustracion": "ilustración",
      "webdev": "web/dev",
      "branding": "branding",
      "shop": "shop",
      "work": "WORK",
      "about": "ABOUT",
      "contact": "CONTACT",
      "paleta": "PALETA",
      "madrid": "MADRID · ES"
    },
    "en": { "hola": "HELLO", "soy": "I'M", "...": "..." }
  },

  "palettes": {
    "electric": { "bg": "#1d1bff", "paper": "#fffaee", "ink": "#0a0a0a", "accent1": "#ffd000", "accent2": "#ff8de0", "accent3": "#5ae3a4" },
    "sunset":   { "bg": "#ff5e9e", "paper": "#fff7d6", "ink": "#0a0a0a", "accent1": "#ffd000", "accent2": "#1d1bff", "accent3": "#ff7a59" },
    "acid":     { "bg": "#16a34a", "paper": "#fffaee", "ink": "#0a0a0a", "accent1": "#ffd000", "accent2": "#ff5e9e", "accent3": "#1d4ed8" },
    "noir":     { "bg": "#0a0a0a", "paper": "#f4f1ea", "ink": "#fffaee", "accent1": "#ff1d58", "accent2": "#ffd000", "accent3": "#5ae3a4" },
    "cream":    { "bg": "#f6efde", "paper": "#fffaee", "ink": "#0c2340", "accent1": "#c0392b", "accent2": "#1e3a8a", "accent3": "#d4a017" }
  },

  "heroStickers": [
    {
      "id": "concepts",
      "label": { "es": "VISUAL CONCEPTS", "en": "VISUAL CONCEPTS" },
      "href": null,
      "pos": { "top": "-16px", "right": "-38px" },
      "rot": 8,
      "bg": "a1",
      "size": "sm",
      "dance": "wiggle"
    },
    {
      "id": "total",
      "label": null,
      "_dynamic": "totalProjectsLabel",
      "href": null,
      "pos": { "top": "20px", "right": "-90px" },
      "rot": -9,
      "bg": "paper",
      "size": "sm",
      "dance": "bob"
    },
    {
      "id": "vibe",
      "label": { "es": "VIBE CODE ✦", "en": "VIBE CODE ✦" },
      "href": "category-web-dev.html",
      "pos": { "bottom": "120px", "left": "-72px" },
      "rot": -12,
      "bg": "a3",
      "size": "sm",
      "dance": "spin"
    },
    {
      "id": "shop",
      "label": { "es": "SHOP →", "en": "SHOP →" },
      "href": "shop.html",
      "pos": { "bottom": "16%", "right": "-86px" },
      "rot": -9,
      "bg": "a2",
      "size": "lg",
      "dance": "swing"
    },
    {
      "id": "latest",
      "label": { "es": "TRABAJOS RECIENTES", "en": "LATEST WORK" },
      "href": "#latest",
      "pos": { "top": "30%", "right": "-50px" },
      "rot": 4,
      "bg": "a1",
      "size": "md",
      "dance": "wiggle",
      "cascade": true
    }
  ],

  "projects": [
    {
      "id": "monquits",
      "title": "monquits",
      "category": "ILLUSTRATION",
      "year": "2026",
      "cover": "assets/projects/monquits/monquit.png",
      "contain": true,
      "featured": true,
      "template": "object-text",
      "data": {
        "image": "assets/projects/monquits/monquit.png",
        "headline": "criaturas que _aparecen sin avisar_.",
        "paragraphs": ["..."],
        "specs": { "formato": "digital", "edición": "abierta" }
      },
      "tags": ["personaje", "criatura", "rosa"]
    }
  ],

  "about": {
    "headline": "soy INCENDIO. hago muchas cosas.",
    "blocks": [
      { "kind": "intro", "text": "..." },
      { "kind": "skills-cloud", "items": ["ilustración", "ia generativa", "scripts", "vídeo", "carteles"] },
      { "kind": "tools", "items": ["Photoshop", "Illustrator", "DaVinci Resolve", "modelos IA"] }
    ]
  },

  "contact": {
    "email": "incendio1987@protonmail.com",
    "social": [
      { "label": "Instagram", "href": "https://instagram.com/..." },
      { "label": "GitHub",    "href": "https://github.com/..." }
    ]
  },

  "shop": {
    "items": [
      { "id": "monquit-print-a3", "title": "monquit · print A3",
        "price": "25€", "image": "assets/shop/monquit-print.jpg",
        "buyHref": "https://paypal.me/...", "sourceProject": "monquits" }
    ]
  }
}
```

---

## Plantillas de proyecto disponibles

El `.exe` ofrece estas opciones al crear una entrada nueva (`template`):

| template       | para qué                                                | campos requeridos                               |
|----------------|---------------------------------------------------------|-------------------------------------------------|
| `single-image` | una imagen sola, gran formato                           | `image`, `caption?`                             |
| `gallery`      | conjunto de imágenes (con variants `tall` / `wide`)     | `images: (string | { src, variant })[]`         |
| `object-text`  | foto de objeto + headline + párrafos + specs            | `image`, `headline`, `paragraphs`, `specs?`     |
| `long-read`    | caso de estudio largo con bloques + pull-quotes         | `blocks: [{ heading?, paragraphs?, image?, type: "pull"?, full?, text? }]` |
| `showcase`     | filas alternadas imagen/texto                           | `rows: [{ heading, text, image, contain?, bg? }]` |
| `video`        | video destacado (file o embed YouTube/Vimeo)            | `video` o `embed`, `caption?`, `poster?`        |

Campos comunes de la cabecera (todos opcionales): `client`, `role`, `tools[]`, `link`, `linkLabel`, `prev`, `next`.

`tags` no se muestra en la UI pero sirve para búsqueda.

`headline` y `pull.text` admiten `_énfasis_` para resaltar fragmentos en color de acento.

---

## Cómo el .exe crea una entrada nueva

1. Pedir al usuario:
   - `id` (slug, sin espacios)
   - `title`, `category`, `year`
   - `template` (de la tabla anterior)
   - Campos específicos de esa plantilla
   - `tags[]` (lista de palabras para indexar)
   - `featured` (sí/no — si aparece en el carrusel del home)
   - Imágenes (drag & drop)

2. Subir las imágenes a `assets/projects/<id>/` (commit a la rama `main`).

3. Generar `projects/<id>.html` a partir del **template HTML genérico** (mismo boilerplate, solo cambia el objeto `PROJECT`).

4. Añadir el proyecto al array `projects` de `data.json`.

5. Commit & push.

### Plantilla HTML por entrada

```html
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>INCENDIO · {TITLE}</title>
  <style>
    * { box-sizing: border-box; }
    html, body { margin: 0; padding: 0; background: #1d1bff; font-family: "Helvetica Neue", Helvetica, Arial, sans-serif; }
  </style>
</head>
<body>
  <script src="https://unpkg.com/react@18.3.1/umd/react.development.js" integrity="sha384-hD6/rw4ppMLGNu3tX5cjIb+uRZ7UkRJ6BPkLpg4hAu/6onKUg4lLsHAs9EBPT82L" crossorigin="anonymous"></script>
  <script src="https://unpkg.com/react-dom@18.3.1/umd/react-dom.development.js" integrity="sha384-u6aeetuaXnQ38mYT8rp6sbXaQe3NL9t+IBXmnYxwkUI2Hw4bsp2Wvmx4yRQF1uAm" crossorigin="anonymous"></script>
  <script src="https://unpkg.com/@babel/standalone@7.29.0/babel.min.js" integrity="sha384-m08KidiNqLdpJqLq95G/LEi8Qvjl/xUYll3QILypMoQ65QorJ9Lvtp2RXYGBFj1y" crossorigin="anonymous"></script>

  <script type="text/babel" src="../project-entry.jsx"></script>

  <div id="root"></div>

  <script type="text/babel" data-presets="react">
    const PROJECT = /*PROJECT-DATA-BEGIN*/{
      // ← el .exe escribe el objeto JSON aquí
    }/*PROJECT-DATA-END*/;

    ReactDOM.createRoot(document.getElementById("root")).render(
      <window.ProjectEntry data={PROJECT} palette="electric" />
    );
  </script>
</body>
</html>
```

Los marcadores `/*PROJECT-DATA-BEGIN*/ … /*PROJECT-DATA-END*/` permiten al .exe encontrar el bloque editable sin parsear JSX.

---

## Funciones que debe tener el .exe

### Tab 1 — Proyectos
- Listar proyectos (lee `data.json`)
- ✚ Nuevo proyecto (wizard con plantilla → campos → imágenes → preview)
- Editar proyecto (abre la misma form con datos cargados)
- Borrar proyecto (quita del JSON + borra carpeta de assets + borra HTML)
- Reordenar proyectos (drag & drop, el orden manda en el carrusel)
- Toggle `featured` por proyecto

### Tab 2 — Hero & pegatinas
- Editor visual: arrastrar pegatinas sobre un mockup del hero para ajustar `pos`
- Por pegatina: texto (es/en), link (dropdown con páginas internas + URL libre), color (bg), tamaño, baile
- ✚ Nueva pegatina · borrar pegatina · reordenar

### Tab 3 — Textos UI
- Tabla de strings i18n (es/en lado a lado)
- Filtro por sección

### Tab 4 — Paletas
- Editor de paletas (color pickers para los 6 valores)
- ✚ Nueva paleta
- Marcar paleta por defecto

### Tab 5 — Páginas
- Editar `about`, `contact`, `shop`
- Subir imágenes a `assets/...`

### Tab 6 — Deploy
- Estado del último commit
- Forzar push manual
- Link al sitio publicado

---

## Validaciones mínimas

- `id` de proyecto: `^[a-z0-9-]+$`, único.
- `template` debe ser una de la lista.
- Imágenes: comprimir a JPG/WebP < 500KB antes de subir.
- Comprobar que `prev`/`next` apunten a IDs existentes (o dejarlos vacíos).
- Una entrada `featured` debe tener `cover` definido.

---

## Lo que NO debe tocar el .exe

- `project-entry.jsx`, `tweaks-panel.jsx`, `directions/home-v2.jsx` → son el motor.
- Los `<script>` con `integrity=` → cambiarlos rompe carga.
- `index.html` salvo el bloque entre `EDITMODE-BEGIN/END`.

---

## Roadmap futuro (no para v1)

- Páginas individuales por categoría (auto-generadas a partir del filtro).
- `/work` (CV), `/about`, `/contact`, `/shop` con sus propias plantillas.
- Búsqueda full-text en cliente (usa el campo `tags`).
- Modo borrador (proyecto creado pero `published: false`).
