/* ==========================================================================
   FLIESEN THEO GALUSCHKA — MAIN APPLICATION ENGINE
   Lenis + GSAP ScrollTrigger | Before/After Inspector | Kalkulator | Funnel | TDDDG
   ========================================================================== */
'use strict';

document.addEventListener('DOMContentLoaded', () => {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // ── 1. Lenis + GSAP ScrollTrigger Synchronisation ────────────────────────
  let lenis = null;
  if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
    gsap.ticker.lagSmoothing(0);

    if (typeof Lenis !== 'undefined' && !prefersReducedMotion) {
      lenis = new Lenis({
        duration: 0.9,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        orientation: 'vertical',
        gestureOrientation: 'vertical',
        smoothWheel: true,
        wheelMultiplier: 1.0,
        touchMultiplier: 1.5,
        syncTouch: false
      });

      lenis.on('scroll', ScrollTrigger.update);
      gsap.ticker.add((time) => lenis.raf(time * 1000));
    }

    // Subtle scroll motion without hiding below-fold cards at opacity: 0
    if (!prefersReducedMotion) {
      gsap.utils.toArray('[data-reveal]').forEach((el) => {
        gsap.from(el, {
          y: 16,
          duration: 0.55,
          ease: 'power2.out',
          clearProps: 'transform',
          scrollTrigger: {
            trigger: el,
            start: 'top 95%',
            toggleActions: 'play none none none'
          }
        });
      });
    }
  }

  // Smooth anchor scrolling via Lenis (or native fallback)
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', (e) => {
      const id = anchor.getAttribute('href');
      if (!id || id === '#') return;
      if (id === '#impressum') {
        e.preventDefault();
        openLegalModal('impressumModal');
        return;
      }
      if (id === '#datenschutz') {
        e.preventDefault();
        openLegalModal('datenschutzModal');
        return;
      }
      const target = document.querySelector(id);
      if (target) {
        e.preventDefault();
        closeMobileDrawer();
        if (lenis) {
          lenis.scrollTo(target, { offset: -76, duration: 0.95 });
        } else {
          target.scrollIntoView({ block: 'start' });
        }
      }
    });
  });

  // ── 2. Header Scroll State & Mobile Drawer ───────────────────────────────
  const header = document.getElementById('siteHeader');
  window.addEventListener('scroll', () => {
    if (header) header.classList.toggle('scrolled', window.scrollY > 36);
  }, { passive: true });

  const mobileDrawer = document.getElementById('mobileDrawer');
  const hamburgerBtn = document.getElementById('hamburgerBtn');
  const mobileCloseBtn = document.getElementById('mobileCloseBtn');

  function closeMobileDrawer() {
    if (!mobileDrawer) return;
    mobileDrawer.classList.remove('open');
    hamburgerBtn?.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }

  hamburgerBtn?.addEventListener('click', () => {
    if (!mobileDrawer) return;
    mobileDrawer.classList.add('open');
    hamburgerBtn.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  });

  mobileCloseBtn?.addEventListener('click', closeMobileDrawer);

  // ── 3. Hero & 3D Material Switcher Sync ──────────────────────────────────
  const DOCK_DATA = {
    travertin: {
      title: 'Travertin Sandstein',
      desc: 'Fugenarmes Feinsteinzeug im XXL-Format bis 120×260 cm.',
      thumb: 'assets/img/after-bath.webp'
    },
    basalt: {
      title: 'Nero Basalt Dunkel',
      desc: 'Architektonischer Schiefer-Kontrast mit matter R10B-Haptik und warmem Messing.',
      thumb: 'assets/img/komplettbad-dark.webp'
    },
    cotto: {
      title: 'Cotto & Außenbelag',
      desc: 'Frostsichere 2 cm Terrassenplatten im Drainagemörtel oder auf Stelzlager.',
      thumb: 'assets/img/terrace-xxl.webp'
    }
  };

  function selectMaterial(matKey) {
    if (window.__setTileMaterial) window.__setTileMaterial(matKey);
    const data = DOCK_DATA[matKey];
    if (data) {
      const tEl = document.getElementById('dockMatTitle');
      const dEl = document.getElementById('dockMatDesc');
      const imgEl = document.getElementById('dockMatThumb');
      if (tEl) tEl.textContent = data.title;
      if (dEl) dEl.textContent = data.desc;
      if (imgEl) imgEl.src = data.thumb;
    }
    document.querySelectorAll('.dock-pill-btn').forEach((b) => {
      b.classList.toggle('active', b.dataset.dockMat === matKey);
    });
  }

  document.querySelectorAll('.dock-pill-btn').forEach((btn) => {
    btn.addEventListener('click', () => selectMaterial(btn.dataset.dockMat));
  });

  document.querySelectorAll('[data-mat]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const k = btn.dataset.mat;
      if (window.__setTileMaterial) window.__setTileMaterial(k);
      if (DOCK_DATA[k]) selectMaterial(k);
    });
  });

  // ── 4. Ingolstädter Fliesen- & Bad-Kalkulator (Archetyp 4) ────────────────
  const calcSlider = document.getElementById('calcAreaSlider');
  const calcAreaVal = document.getElementById('calcAreaReadout');
  const calcMinEl = document.getElementById('calcPriceMin');
  const calcMaxEl = document.getElementById('calcPriceMax');
  const calcDurationEl = document.getElementById('calcDuration');
  const calcTransferBtn = document.getElementById('calcTransferBtn');
  const calcWaBtn = document.getElementById('calcWaBtn');

  const RATES = {
    komplettbad: { label: 'Komplettbad Walk-In', min: 265, max: 390, daysPer10: 4.5 },
    xxl: { label: 'XXL-Großformat (bis 120×260)', min: 135, max: 195, daysPer10: 2.2 },
    terrasse: { label: 'Terrasse & Balkon (frostsicher)', min: 145, max: 215, daysPer10: 2.5 },
    wohnbereich: { label: 'Wohnbereich & Flur', min: 95, max: 145, daysPer10: 1.6 }
  };

  function updateCalculator() {
    const sqm = Number(calcSlider?.value || 28);
    const scope = document.querySelector('input[name="calcScope"]:checked')?.value || 'komplettbad';
    const prep = document.querySelector('input[name="calcPrep"]:checked')?.value || 'din';
    const rate = RATES[scope] || RATES.komplettbad;
    const prepBonus = prep === 'din' ? 42 : 0;

    const minTotal = Math.round(sqm * (rate.min + prepBonus) / 50) * 50;
    const maxTotal = Math.round(sqm * (rate.max + prepBonus) / 50) * 50;
    const estDays = Math.max(2, Math.round((sqm / 10) * rate.daysPer10));

    if (calcAreaVal) calcAreaVal.textContent = `${sqm} m²`;
    if (calcMinEl) calcMinEl.textContent = minTotal.toLocaleString('de-DE');
    if (calcMaxEl) calcMaxEl.textContent = maxTotal.toLocaleString('de-DE');
    if (calcDurationEl) calcDurationEl.textContent = `Richtdauer: ca. ${estDays} bis ${estDays + 2} Arbeitstage · Exaktes Angebot nach Aufmaß.`;

    const summary = `${rate.label}, ca. ${sqm} m², Untergrund: ${prep === 'din' ? 'inkl. DIN 18534 Abdichtung & Vorbereitung' : 'belegreifer Untergrund'}, Orientierungsrahmen ${minTotal.toLocaleString('de-DE')}–${maxTotal.toLocaleString('de-DE')} €`;
    if (calcWaBtn) {
      const msg = encodeURIComponent(`Hallo Herr Galuschka, ich interessiere mich für eine Projekt-Einschätzung: ${summary}.`);
      calcWaBtn.href = `https://wa.me/4915901772970?text=${msg}`;
    }
    return summary;
  }

  calcSlider?.addEventListener('input', updateCalculator, { passive: true });
  document.querySelectorAll('input[name="calcScope"], input[name="calcPrep"]').forEach((el) => {
    el.addEventListener('change', updateCalculator);
  });

  calcTransferBtn?.addEventListener('click', () => {
    const summary = updateCalculator();
    const notesField = document.getElementById('nachricht');
    if (notesField) notesField.value = `Kalkulation aus dem Rechner:\n${summary}`;
    const kontaktEl = document.getElementById('kontakt');
    if (kontaktEl) {
      if (lenis) lenis.scrollTo(kontaktEl, { offset: -76, duration: 0.9 });
      else kontaktEl.scrollIntoView({ block: 'start' });
    }
  });
  updateCalculator();

  // ── 6. Multi-Step Contact Funnel ─────────────────────────────────────────
  let currentStep = 1;
  const totalSteps = 3;
  const stepPanels = [1, 2, 3].map((n) => document.getElementById(`funnelStep${n}`));
  const progressBar = document.getElementById('funnelProgressBar');
  const stepLabel = document.getElementById('funnelStepLabel');

  function showFunnelStep(next) {
    currentStep = next;
    stepPanels.forEach((p, idx) => p?.classList.toggle('active', idx + 1 === next));
    if (progressBar) progressBar.style.width = `${(next / totalSteps) * 100}%`;
    if (stepLabel) stepLabel.textContent = `Schritt ${next} von ${totalSteps}`;
  }

  document.querySelectorAll('[data-funnel-next]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const stepNum = Number(btn.dataset.funnelNext);
      const panel = document.getElementById(`funnelStep${stepNum}`);
      if (!panel) return;
      const required = panel.querySelectorAll('[required]');
      let ok = true;
      required.forEach((field) => {
        if (field.type === 'radio') {
          const group = panel.querySelectorAll(`[name="${field.name}"]`);
          if (![...group].some((r) => r.checked)) ok = false;
        } else if (!field.value.trim()) {
          field.classList.add('error');
          ok = false;
        } else {
          field.classList.remove('error');
        }
      });
      if (ok && stepNum < totalSteps) showFunnelStep(stepNum + 1);
    });
  });

  document.querySelectorAll('[data-funnel-back]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const stepNum = Number(btn.dataset.funnelBack);
      if (stepNum > 1) showFunnelStep(stepNum - 1);
    });
  });

  const form = document.getElementById('multistepForm');
  const formStatus = document.getElementById('formStatus');
  const funnelSuccess = document.getElementById('funnelSuccess');

  form?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const step3 = document.getElementById('funnelStep3');
    let ok = true;
    step3?.querySelectorAll('[required]').forEach((field) => {
      if (field.type === 'checkbox') {
        if (!field.checked) ok = false;
      } else if (!field.value.trim()) {
        field.classList.add('error');
        ok = false;
      } else {
        field.classList.remove('error');
      }
    });
    if (!ok) {
      if (formStatus) formStatus.textContent = 'Bitte füllen Sie alle Pflichtfelder inklusive Datenschutz-Einwilligung aus.';
      return;
    }

    // Demo fallback if Formspree placeholder ID has not been replaced yet
    if (form.action.includes('YOUR_FORM_ID')) {
      stepPanels.forEach((p) => p?.classList.remove('active'));
      funnelSuccess?.classList.remove('hidden');
      if (formStatus) formStatus.textContent = 'Anfrage im Demo-Modus vorbereitet. Für den Produktivbetrieb Formspree-ID hinterlegen oder direkt anrufen.';
      return;
    }

    try {
      const res = await fetch(form.action, {
        method: 'POST',
        body: new FormData(form),
        headers: { Accept: 'application/json' }
      });
      if (res.ok) {
        stepPanels.forEach((p) => p?.classList.remove('active'));
        funnelSuccess?.classList.remove('hidden');
        if (formStatus) formStatus.textContent = 'Vielen Dank! Ihre Anfrage wurde erfolgreich gesendet.';
      } else if (formStatus) {
        formStatus.textContent = 'Senden nicht möglich. Bitte rufen Sie direkt unter +49 841 57321 an.';
      }
    } catch {
      if (formStatus) formStatus.textContent = 'Netzwerkfehler. Bitte nutzen Sie Telefon oder WhatsApp.';
    }
  });

  // ── 7. FAQ Accordion (ARIA + Keyboard) ───────────────────────────────────
  document.querySelectorAll('.faq-trigger').forEach((btn, i, all) => {
    btn.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowDown') { e.preventDefault(); all[Math.min(i + 1, all.length - 1)].focus(); }
      if (e.key === 'ArrowUp') { e.preventDefault(); all[Math.max(i - 1, 0)].focus(); }
      if (e.key === 'Home') { e.preventDefault(); all[0].focus(); }
      if (e.key === 'End') { e.preventDefault(); all[all.length - 1].focus(); }
    });
    btn.addEventListener('click', () => {
      const expanded = btn.getAttribute('aria-expanded') === 'true';
      document.querySelectorAll('.faq-trigger').forEach((b) => b.setAttribute('aria-expanded', 'false'));
      document.querySelectorAll('.faq-answer').forEach((a) => a.classList.remove('open'));
      if (!expanded) {
        btn.setAttribute('aria-expanded', 'true');
        document.getElementById(btn.getAttribute('aria-controls'))?.classList.add('open');
      }
    });
  });

  // ── 8. TDDDG Consent Banner & Two-Click Google Maps ──────────────────────
  const CONSENT_KEY = 'consent_v1';
  const banner = document.getElementById('consentBanner');
  const mapsPlaceholder = document.getElementById('mapsPlaceholder');

  function applyConsent(accepted) {
    if (accepted) {
      document.querySelectorAll('iframe[data-src]').forEach((iframe) => {
        iframe.src = iframe.dataset.src;
        iframe.removeAttribute('data-src');
      });
      mapsPlaceholder?.classList.add('hidden');
    }
    banner?.classList.add('hidden');
  }

  const storedConsent = localStorage.getItem(CONSENT_KEY);
  if (storedConsent === 'accepted') applyConsent(true);
  else if (storedConsent === 'rejected') applyConsent(false);
  else banner?.classList.remove('hidden');

  document.getElementById('consentAccept')?.addEventListener('click', () => {
    localStorage.setItem(CONSENT_KEY, 'accepted');
    applyConsent(true);
  });
  document.getElementById('consentReject')?.addEventListener('click', () => {
    localStorage.setItem(CONSENT_KEY, 'rejected');
    applyConsent(false);
  });
  document.getElementById('activateMapBtn')?.addEventListener('click', () => {
    localStorage.setItem(CONSENT_KEY, 'accepted');
    applyConsent(true);
  });
  document.getElementById('cookieSettingsLink')?.addEventListener('click', (e) => {
    e.preventDefault();
    localStorage.removeItem(CONSENT_KEY);
    banner?.classList.remove('hidden');
  });

  // ── 9. Legal Modals (§ 5 DDG Impressum & DSGVO Art. 13 Datenschutz) ───────
  window.openLegalModal = function (id) {
    const modal = document.getElementById(id);
    if (!modal) return;
    modal.classList.add('open');
    document.body.style.overflow = 'hidden';
    modal.querySelector('.legal-close-btn')?.focus();
  };

  function closeAllModals() {
    document.querySelectorAll('.legal-modal.open').forEach((m) => m.classList.remove('open'));
    document.body.style.overflow = '';
  }

  document.querySelectorAll('[data-open-modal]').forEach((trigger) => {
    trigger.addEventListener('click', (e) => {
      e.preventDefault();
      openLegalModal(trigger.dataset.openModal);
    });
  });

  document.querySelectorAll('.legal-close-btn').forEach((btn) => {
    btn.addEventListener('click', closeAllModals);
  });

  document.querySelectorAll('.legal-modal').forEach((modal) => {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeAllModals();
    });
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeAllModals();
      closeMobileDrawer();
    }
  });
});
