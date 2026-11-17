# Fliesen Theo Galuschka — Immersive 3D Studio Website

High-End B2B- & Privatkunden-Website für **Fliesen Theo Galuschka** (Ingolstadt), vollständig von Grund auf neu entwickelt im Rahmen einer 10-Runden-Cook-Iteration.

- **Live-Demo (Vercel):** https://fliesen-galuschka-ingolstadt.vercel.app
- **GitHub Repository:** https://github.com/RaphaelVSC-cmd/fliesen-galuschka-ingolstadt

## Highlights
- **Prozedurales Three.js 3D-Schichtenstudio (`js/scrolly3d.js`):** Echtzeit-WebGL-Schnittmodell eines begehbaren Walk-In-Bades (GKBI-Trockenbau & Gefälle-Estrich, DIN 18534 Verbundabdichtung, Kammbett mit 3D-Zahntraufel-Rippen & Nivelliersystem, physisch modellierte 2×2 XXL-Feinsteinzeugplatten mit 1,5 mm Fugenbild und gebürsteter Messing-Duschrinne) inkl. Live-PBR-Materialwechsel (*Travertin*, *Basalt*, *Calacatta*, *Cotto*) und Achsen-Explosion nach wahren Flächennormalen.
- **Baustellen-Inspektor & Leistungsbereiche (`#inspektor`, `#leistungen`):** Gegenüberstellung von Phase 1 Rohbau (Laser-Aufmaß & Abdichtung) und Phase 2 Finish, DIN 18202 / DIN 18534 Leistungsmatrix sowie 3-spaltiger Fachbereichs-Galerie.
- **Ingolstädter Fliesen- & Bad-Kalkulator + 3-Schritt-Anfrage (`#rechner`, `#kontakt`):** Geometrischer m²-Rechner (8–180 m²) mit Richtpreisspanne, Bauzeit-Orientierung und direkter Übernahme in das 3-Schritt-Formular oder WhatsApp.
- **100 % DACH-Rechtskonformität (`website-audit-pro` 21/21 PASS):** Lokale `.woff2`-Schriftarten (Zero Font-CDN), § 5 DDG Impressum, DSGVO Art. 13 Datenschutz, § 25 TDDDG Consent-Banner, Two-Click Google Maps (`data-src`), geometrisches `favicon.svg` sowie Schema.org JSON-LD.

## Qualitätssicherung & Messung
- **Cook-Iterationen:** 10 Runden bis auf **94,6 / 100** unabhängigen Goldfish-Kritiker-Median (`r10`: Critic S `93,1` / Critic T `96`).
- **Automatisierte Prüfungen (`r10`):** 21/21 `audit_check.py` PASS, 11/11 Playwright-Interaktionstests (`verify_interactions.mjs`) PASS, 0 Console-/Page-/Network-Errors, `overflowX: false` bei Desktop (900px / 1440px) und Mobile (375px).

## Lokal starten
```bash
python -m http.server 8080
```
Oder unter Windows per Doppelklick auf `start.bat`.
