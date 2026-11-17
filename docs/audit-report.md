# Website Audit & Compliance Report (website-audit-pro v2.0)

**Projekt:** Fliesen Theo Galuschka (Ingolstadt)
**Datum:** 2026-11-17
**Gesamt-Score:** 100 / 100 Punkte
**Status:** 🟢 100% COMPLIANT & AUDIT BESTANDEN

---

## Scorecard nach 8 Säulen

| Säule | Kategorie | Status | Befund |
|---|---|:---:|---|
| 1 | ⚖️ Deutscher Rechtscheck (§ 5 DDG, DSGVO Art. 13, TDDDG, Fonts) | 🟢 | 0 Mängel |
| 2 | 🔍 Technisches SEO & Indexierbarkeit | 🟢 | 0 Mängel |
| 3 | 🎨 Favicon & Asset-Integrität | 🟢 | 0 Mängel |
| 4 | 🚀 Core Web Vitals & Speed | 🟢 | 0 Mängel |
| 5 | ♿ Accessibility & Kontrast (WCAG 2.1 AA) | 🟢 | 0 Mängel |
| 6 | 📱 Mobile-First Responsiveness (375px Zero-Collision) | 🟢 | 0 Mängel |
| 7 | 🔒 Security & Best Practices | 🟢 | 0 Mängel |
| 8 | ✨ Uniqueness & Signature Problem-Solver | 🟢 | 0 Mängel |

---

## Geprüfte Nachweise (gemessen durch `scripts/audit_check.py` & `scripts/verify_interactions.mjs`)

1. **§ 5 DDG Impressum (`#impressumModal`):** Anbieterkennzeichnung gem. § 5 DDG (kein veraltetes TMG), Inhaber Theo Galuschka (Witold Theodor Galuschka), ladungsfähige Anschrift (`Gret-Gilm-Weg 1, 85055 Ingolstadt`), klickbare `tel:` & `mailto:` Links, Handwerkskammer für München und Oberbayern, Berufsbezeichnung & HwO-Link, § 36 VSBG + EU-OS-Link.
2. **DSGVO Art. 13 (`#datenschutzModal`) & § 25 TDDDG:** Hoster-Nennung (Vercel Inc., EU-US DPF), Rechtsgrundlagen (Art. 6 Abs. 1 lit. a/b/f), Betroffenenrechte (Art. 15–21 + Art. 7 Abs. 3), Landesaufsichtsbehörde (BayLDA Ansbach), gleichwertige Banner-Buttons (`Alle akzeptieren` / `Nur notwendige`), Google Maps `iframe` per `data-src` blockiert bis zur Einwilligung (live in Playwright verifiziert), `cookieSettingsLink` im Footer, 100 % lokale `.woff2` Fonts ohne Google Fonts CDN.
3. **SEO & Schema.org:** `<title>` 48 Zeichen, `<meta name="description">` 158 Zeichen mit CTA, genau 1 `<h1>`, Canonical, Open Graph, Twitter Card, `robots.txt`, `sitemap.xml`, JSON-LD `HomeAndConstructionBusiness` (`aggregateRating` 5.0 / 8) + `FAQPage`.
4. **Favicon & Assets:** Physische Vektor-Datei `favicon.svg` (kein Unicode-Emoji!), alle `<img>` mit expliziten `width`/`height` (kein CLS), Hero LCP mit `fetchpriority="high"`.
5. **Accessibility & Mobile-Safety:** Skip-to-Content Link als erstes Tag nach `<body>`, `:focus-visible`, ARIA-Live & Tastaturnavigation im FAQ-Akkordeon, `scroll-behavior: auto !important` für Lenis, `#scrollyCanvas` unter 768 px mit `pointer-events: none`, `.mobile-bottom-bar` (`z-index: 99999`), 0 px horizontaler Overflow auf Desktop (`900px`) & Mobile (`375px`).
6. **Security & Uniqueness:** `rel="noopener noreferrer"` auf allen externen Links, Security-Header in `vercel.json`, prozedurales Three.js DIN-18534-Schichtenstudio + Ingolstädter Fliesen- & Bad-Kalkulator.
