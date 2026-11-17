# Design System & 3D Blueprint: Fliesen Theo Galuschka

## 1. Farb-Tokens (Limestone, Travertine & Obsidian Slate)
| Token | Hex | Rolle | WCAG-Kontrast |
|---|---|---|---|
| `--bg-canvas` | `#F6F4EF` | Primärer warmer Kalkstein-Hintergrund | Basis |
| `--bg-surface` | `#EDE9E0` | Sekundäre Travertin-Fläche | Basis |
| `--bg-card` | `#FDFCFA` | Elevated Karten & Panels | Basis |
| `--bg-obsidian` | `#161817` | Dunkle Kontrast-Wellen & Footer (kein `#000000`) | Basis |
| `--bg-pine` | `#1F2D27` | Tiefes Architektur-Schiefergrün für Akzent-CTAs | Basis |
| `--ink-primary` | `#1C1E1C` | Fließtext & Haupt-Überschriften auf Hell | > 14:1 auf `#F6F4EF` |
| `--ink-muted` | `#57534B` | Sekundärtext auf Hell | > 6.5:1 auf `#F6F4EF` |
| `--accent-brass` | `#B69162` | Messing / Travertin-Gold Akzent (Icons, Linien, Dark-UI-Text) | > 5.4:1 auf `#161817` |
| `--accent-brass-text` | `#835F33` | Barrierefreier Gold-Sandstein-Akzent für Text auf Hell | > 5.1:1 auf `#F6F4EF` |

## 2. Typografie (100% lokal WOFF2)
- `--font-display`: `'Cormorant Garamond', Georgia, serif` (600, 700, 600 Italic)
- `--font-body`: `'Plus Jakarta Sans', system-ui, sans-serif` (400, 500, 600, 700)
- Headline Tracking: `-0.025em` bis `-0.03em`, Line-Height `1.02` bis `1.12`.
- Fließtext-Breite: `48ch` bis `65ch`, Line-Height `1.62`.

## 3. 3D Scrollytelling Blueprint (`js/scrolly3d.js`)
- **Szene:** Freischwebendes architektonisches Walk-In-Bad- & Fliesenwand-Cutaway-Modell über zentrierter Hintergrund-Typografie (`MEISTERWERK`), inspiriert von R01.
- **4 prozedurale Ebenen (Layer-Explosion):**
  1. `layerBase`: GKBI Trockenbau-Ständerwerk & gefällegerechter Zementestrich
  2. `layerMembrane`: DIN 18534 Verbundabdichtung (schiefer-türkis) + Dichtbandmanschetten
  3. `layerAdhesive`: Zahntraufel-Dünnbettmörtel & 1,5mm Nivellierclips
  4. `layerTile`: XXL-Feinsteinzeug (120×260 cm) mit prozeduraler PBR-Maserung + gebürsteter Messing-Duschrinne + rahmenloser Echtglas-Trennwand
- **Scroll-Mapping:** `0% -> 25%` Aufbau sichtbar -> `25% -> 65%` maximale Explosionsansicht & Kamera-Orbit -> `65% -> 100%` präzises Schließen in das makellose Finish.
- **Mobile-Schutz (`<= 768px`):** Canvas erhält `pointer-events: none; touch-action: pan-y;`, DPR limitiert auf `Math.min(dpr, 1.5)`, und `ScrollTrigger.onToggle` pausiert Rendering außerhalb des Viewports (0% GPU-Last beim Scrollen anderer Bereiche).
