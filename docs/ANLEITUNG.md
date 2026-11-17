# Projekt-Anleitung: Fliesen Theo Galuschka

## 1. Lokale Vorschau
Öffnen Sie die Website über einen lokalen Webserver (für Three.js & ES/Static Assets empfohlen):
- Mit Node.js: `npx serve .`
- Mit Python: `python -m http.server 8080`

## 2. Kontaktformular (Formspree) aktivieren
Im Formular `#multistepForm` in `index.html` ist aktuell der Platzhalter `https://formspree.io/f/YOUR_FORM_ID` hinterlegt.
1. Kostenloses Formular auf [formspree.io](https://formspree.io) anlegen und Empfänger-Adresse `theo.fliesen@gmail.com` verknüpfen.
2. Die erhaltene Form-ID in `index.html` beim `<form id="multistepForm" action="...">` eintragen.

## 3. Pflichtangaben im Impressum prüfen
Vor dem finalen Produktivgang sollte der Inhaber prüfen, ob eine USt-IdNr. (§ 27a UStG) sowie die exakte Betriebsnummer bei der Handwerkskammer für München und Oberbayern im `#impressumModal` ergänzt werden sollen.

## 4. Verwendete lokale Assets & Bibliotheken
- **Three.js (v0.160.0)** in `vendor/three.min.js` (MIT License)
- **GSAP + ScrollTrigger (v3.12.5)** in `vendor/`
- **Lenis Smooth Scroll (v1.1.18)** in `vendor/lenis.min.js` (MIT License)
- **Schriften (lokal, DSGVO-konform):** Cormorant Garamond & Plus Jakarta Sans in `assets/fonts/` (SIL Open Font License)
- **Bilder:** Lokale WebP-Assets in `assets/img/`
