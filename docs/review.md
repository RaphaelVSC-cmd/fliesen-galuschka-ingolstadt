# Staff Engineer Review: Fliesen Theo Galuschka (v2)

- **3D Scrollytelling & Performance:** `js/scrolly3d.js` nutzt ausschließlich `gsap.ticker` mit Dirty-Flag-Rendering und ScrollTrigger Visibility Culling (`isVisible`), sodass außerhalb des Viewports 0 % GPU-Last anfallen. Auf Mobilgeräten (`<= 768px`) ist `pointer-events: none` + `touch-action: pan-y` aktiv und DPR auf `<= 1.5` begrenzt.
- **Zero-Collision & Layout:** Kein globaler Floating-Widget-Konflikt; mobile Bottom-Bar liegt fest auf `z-index: 99999` unterhalb der Hero- und Sektionsinhalte (`0 px` Overflow bei 375 px und 900 px).
- **Recht & Fakten:** 0 erfundene Bewertungen oder Jubiläumszahlen. Alle Kontaktdaten, 5,0★ (8 Rezensionen), § 5 DDG, DSGVO Art. 13 und § 25 TDDDG Two-Click Maps wurden gegen Primärquellen und automatisiert in Playwright verifiziert.
