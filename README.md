# cactus™ Wealth Management — landing v3

Landing institucional de alta calidad para Cactus Wealth Management (advisory
financiero, gestión del retiro y seguro de vida en Argentina).

## Brand & data

Toda la información proviene de fuentes reales del proyecto:

- **Nombre oficial**: Cactus Wealth Management (del brief Feb 2026).
- **Datos live** (11 feb 2026): Dow 50,188.42 · S&P 500 6,118.71 · Nasdaq 23,205.10 ·
  Oro US$ 5,058.20 · USD oficial $1,405 · Blue $1,418 · MEP $1,428 ·
  Inflación AR 2.9% MoM / 32.4% YoY · Reservas BCRA US$ 45,323M.
- **Asset allocation modelo**: Liquidez 20% · Fixed 40% · Equity 25% · AR 15%
  (perfil moderado). Producto Balanz Ahorro + Renta Fija USD + Performance CER +
  CEDEARs (SPY, KO, MSFT) + ONs (YPF, Pampa, Vista).
- **Servicios**: Wealth management, Gestión del retiro (Zurich Invest Future,
  2.8% retorno real, prima US$ 200+) y Seguro de vida (Zurich Options,
  US$ 5K base + US$ 65K adicional + US$ 40K enfermedad grave, prima deducible).
- **Equipo**: Mateo Vicente — Head of Advisory · ABAX SA ·
  Balanz Productores `giolivo`.
- **AUM**: ~$5.1M USD · **Clientes**: 349 · **Fee**: 2% AUM + 15% perf.
- **Paleta Cactus** (8 colores del manual de identidad):
  `#00675b · #f7cf47 · #ec7356 · #d395c1 · #ff163b · #5ab1f3 · #61c39d · #464646`.
- **Brand pattern**: estrellas de 8 puntas blancas con puntos dorados en diagonal.

## Stack

- Vanilla **HTML5 + CSS3 + JS** (ES2020). Sin build, sin deps, sin frameworks.
- Tipografías: **Playfair Display** (serif Didone) + **Space Grotesk** (sans geométrica)
  + **JetBrains Mono** (mono) — vía Google Fonts como fallback de las
  originales del manual (Museo / Bogart / Frutiger).
- Servidor: `python3 -m http.server 8770 --bind 127.0.0.1`.

## Estructura

```
cactus-landing/
├── index.html               # 10 secciones semánticas
├── assets/
│   ├── css/styles.css       # 1450+ líneas · brand system · 4 breakpoints
│   └── js/main.js           # 240+ líneas · reveal · counter · allocation
│                              ticker · carousel · parallax · tilt
├── output/                  # PDFs / artifacts opcionales
└── README.md
```

## Secciones (en orden)

1. **Nav sticky** con scroll state y drawer mobile.
2. **Hero animado** — `linear-gradient` shift en "actives" (yellow highlight),
   `box-shadow` underline en "criollo" (coral), `transform: scaleY(0)→1`
   bar coral a la izquierda, dot pulsante, parallax sutil con el mouse.
3. **Stats live ticker** — barra negra estilo Bloomberg, scroll infinito
   con jitter suave de valores cada 1.8s.
4. **Manifiesto** — "ADN de supervivencia económica" + 6 frases en cards
   con borde de color (coral / amarillo / menta / celeste / lila / rojo).
5. **Servicios** — 3 pilares:
   - **01 Wealth Management** (bar verde)
   - **02 Gestión del Retiro** (bar amarillo)
   - **03 Protección - Seguro de Vida** (bar menta)
   Hover: translateY(-6px) + shadow 2 + bar crece a 8px.
6. **Asset Allocation widget** — chips (Conservador/Moderado/Agresivo) +
   barra horizontal con 4 segmentos animados (width 0→%) + legend 2x2.
7. **Feed IG** — 8 posts en grid 4x2, hover con `rotateX/Y` tilt (3D sutil)
   en desktop.
8. **Números** — 4 métricas con contadores animados desde 0 (1.6s easeOutCubic).
9. **Testimonial carousel** — 3 slides con fade + auto-advance cada 5.5s + dots.
10. **Contacto** — fondo verde con brand-stars--twinkle (drift 24s), 4 perks,
    card blanca con avatar de Mateo.
11. **Footer** — 4 columnas (Brand / Servicios / Productos / Contacto) +
    disclaimer fiscal y "Datos al 11 feb 2026".

## Animaciones

| Tipo | Donde | Trigger |
|---|---|---|
| `fadeUp` stagger | Todos los `[data-reveal]` | IntersectionObserver threshold 0.12 |
| `barGrowUp` 4 barras | Brief card del hero | delay 0.6s, 0.8s, 1.0s, 1.2s |
| `hlShimmer` 3.5s infinite | Highlight "actives" | CSS animation, gradiente |
| `underlineGrow` 1.2s | Underline "criollo" | CSS, delay 1s |
| `scrollBounce` 2.4s infinite | Scroll cue | CSS, ease-in-out |
| `orbFloat` 20s infinite | Hero orbs (amarillo + menta) | CSS, easing |
| `patternDrift` 30s infinite | Hero dot pattern | CSS |
| `twinkleDrift` 24s infinite | Brand stars del contacto | CSS |
| `tickerScroll` 60s infinite | Ticker live (Bloomberg) | CSS, linear |
| `dotBlink` 1.6s | Macos dots en card head | CSS, delay 0/0.3/0.6s |
| Counter `easeOutCubic` 1.6s | Métricas (5.1M / 349 / 2% / 15%) | IntersectionObserver 0.5 |
| Allocation `width` 1.2s | Barra de cartera (4 segments) | IntersectionObserver 0.3 |
| Parallax 3D | Hero orbs + brief card | mouse move desktop |
| Tilt 3D ±3° | Posts de IG | mouse move desktop |
| Drawer slide | Nav mobile | click |
| Carousel fade | Testimonios (3 slides) | auto 5.5s + click dots |

## Performance

- **Fonts**: preconnect a Google Fonts para evitar waterfall.
- **CSS animations GPU-friendly**: solo `transform`, `opacity`, `width`.
- **`prefers-reduced-motion: reduce`**: desactiva todas las animaciones
  y revela todo inmediatamente.
- **`will-change: transform`** solo en posts (únicos elementos que rotan).
- **IntersectionObserver** unregisters después del primer reveal (no re-observer).

## Verificación técnica (mediciones reales)

```
[desktop 1400×900]  fonts=loaded  iw=1400  sw=1400  overflow=False  scrollH=6398
[mobile  390×800]  fonts=loaded  iw=390  sw=390  overflow=False   scrollH=10889
```

- Cero overflow horizontal en ambos breakpoints.
- Fonts Google cargadas antes del primer paint.
- Drawer cerrado por defecto.
- 4 breakpoints responsive: 380 / 540 / 720 / 980 / 1100.

## Comandos

```bash
python3 -m http.server 8770 --bind 127.0.0.1
# abrir http://127.0.0.1:8770/
```

## Deploy

- **Producción**: https://cactuswealth.maat.work (Vercel + CNAME en Cloudflare).
- **Auto-deploy**: cada push a `main` de este repo dispara un deploy en Vercel.
- Sin build step — sitio estático servido desde la raíz.

## Calidad (Lighthouse mobile)

`Accessibility 100 · Best Practices 100 · SEO 100`. Cero overflow horizontal,
cero errores de consola, responsive de 320px a 1440px+.

## Próximos pasos (no implementados)

- [ ] Reemplazar Google Fonts por `@font-face` local con archivos .woff2
      de Museo y Bogart.
- [ ] Conectar formulario de contacto (Formspree / Resend).
- [ ] Reemplazar mockups SVG de IG con capturas reales del feed @cactus.wealth.

## Hecho

- [x] Imagen OG 1200×630 (`assets/img/og.png`) + meta tags sociales.
- [x] JSON-LD `FinancialService`, `robots.txt`, `sitemap.xml`.
- [x] Deploy a Vercel conectado a `main`.
