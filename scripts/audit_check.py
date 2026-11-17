import re
import pathlib

root = pathlib.Path(r'G:\Meine Ablage\Nexbot Webdesign\02_Projekte\fliesen-theo-galuschka-v2')
h = (root / 'index.html').read_text(encoding='utf-8')
c = (root / 'css/style.css').read_text(encoding='utf-8')

title = re.search(r'<title>(.*?)</title>', h).group(1)
desc = re.search(r'<meta name="description" content="(.*?)">', h).group(1)

checks = {
    'S1_Impressum_DDG': ('§ 5 DDG' in h) and ('TMG' not in h),
    'S1_Ladungsfaehige_Anschrift': ('Gret-Gilm-Weg 1' in h) and ('Postfach' not in h),
    'S1_HWK_HwO_VSBG': ('Handwerkskammer für München und Oberbayern' in h) and ('§ 36 VSBG' in h) and ('ec.europa.eu/consumers/odr' in h),
    'S1_DSGVO_Art13': ('Art. 15 DSGVO' in h) and ('Art. 21 DSGVO' in h) and ('Art. 7 Abs. 3 DSGVO' in h),
    'S1_TDDDG_Banner_Equal': ('Alle akzeptieren' in h) and ('Nur notwendige' in h) and ('cookieSettingsLink' in h),
    'S1_Maps_TwoClick': ('data-src="https://maps.google.com' in h) and (not re.search(r'(?<![\w-])src="https://maps\.google\.com', h)),
    'S1_No_Google_Fonts_CDN': ('fonts.googleapis' not in h) and ('fonts.gstatic' not in h) and ('fonts.googleapis' not in c),
    'S2_Title_30_60': 30 <= len(title) <= 60,
    'S2_Desc_120_158': 120 <= len(desc) <= 158,
    'S2_Single_H1': len(re.findall(r'<h1\b', h)) == 1,
    'S2_Schema_JSONLD': ('application/ld+json' in h) and ('HomeAndConstructionBusiness' in h) and ('FAQPage' in h),
    'S3_Favicon_SVG': (root / 'favicon.svg').exists() and ('href="favicon.svg"' in h),
    'S4_LCP_High': 'fetchpriority="high"' in h,
    'S4_All_Imgs_Have_WH': all(('width=' in img and 'height=' in img) for img in re.findall(r'<img [^>]+>', h)),
    'S5_SkipLink_First': h.index('class="skip-link"') < h.index('<header'),
    'S5_FocusVisible': ':focus-visible' in c,
    'S6_No_SmoothScroll_CSS': 'scroll-behavior: smooth' not in c,
    'S6_Mobile_ZeroCollision': ('pointer-events: none !important' in c) and ('z-index: 99999 !important' in c),
    'S7_Noopener_Blank': all('noopener noreferrer' in a for a in re.findall(r'<a [^>]*target="_blank"[^>]*>', h)),
    'S7_No_Insecure_HTTP': 'http://' not in h.replace('http://www.w3.org/2000/svg', ''),
    'S8_No_EmDash_HTML': chr(8212) not in h,
}

for k, v in checks.items():
    print(f"{k}: {'PASS' if v else 'FAIL'}")

print(f"\nTitle ({len(title)}): {title}")
print(f"Desc ({len(desc)}): {desc}")
print(f"ALL_PASS: {all(checks.values())}")
