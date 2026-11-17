# Design- & Architektur-Retrospektive: Fliesen Theo Galuschka

## 1. Stilistische Herleitung (Synthese aus R01–R04)
- **Farbsystem:** Warmes Architektur-Leinen / Kalkstein (`#F6F4EF`), Weicher Travertin (`#EDE9E0`), Elevated Card (`#FDFCFA`), Tiefes Schiefer-Obsidian (`#161817`) mit organischen SVG-Wellentrennungen und gebürstetem Sandstein-Messing (`#C49E6C` / barrierefrei `#835F33`).
- **Typografie:** `Cormorant Garamond` (600, 700, Italic für zweifarbige architektonische Headlines) kombiniert mit `Plus Jakarta Sans` (400–700, `lining-nums tabular-nums` auf allen Preis-, Maß- und Bewertungszahlen).

## 2. Prozedurale 3D-Architektur (`js/scrolly3d.js`)
- **Szene:** 4-lagiges Walk-In-Dusch- und Waschtisch-Schnittmodell auf einem architektonischen Schiefersockel über ruhigem `MEISTERWERK`-Wasserzeichen.
- **PBR-Material-Pipeline:** `PMREMGenerator` erzeugt eine synthetische Studio-Softbox-Umgebungskarte für realistische Messing- und Glasreflexionen; `fbm`-Mehrskalen-Rauschen generiert geäderte Stein-Albedo-, Bump- und Roughness-Texturen mit vertieften 1,5 mm Fugenkanälen für *Travertin*, *Basalt*, *Calacatta* und *Cotto*.
- **Zero-Collision & Performance:** Dirty-Flag-Rendering im `gsap.ticker` plus ScrollTrigger Visibility Culling (0 % GPU-Last außerhalb des Viewports) sowie `pointer-events: none` unter 768 px.
