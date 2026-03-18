// ============================================
//  AURA SMILE STUDIO — script.js
// ============================================

document.addEventListener('DOMContentLoaded', () => {

  // ── 1. AÑO ACTUAL ──────────────────────────────────────
  document.querySelectorAll('#currentYear, .currentYear').forEach(el => {
    el.textContent = new Date().getFullYear();
  });

  // ── 2. FECHA MÍNIMA ────────────────────────────────────
  const fechaInput = document.getElementById('fecha');
  if (fechaInput) {
    fechaInput.setAttribute('min', new Date().toISOString().split('T')[0]);
  }

  // ── 3. HEADER SCROLL ───────────────────────────────────
  const header = document.querySelector('.site-header');
  if (header) {
    const handleScroll = () => header.classList.toggle('scrolled', window.scrollY > 30);
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
  }

  // ── 4. MENÚ HAMBURGER ──────────────────────────────────
  const navToggle = document.getElementById('navToggle');
  const mainNav   = document.querySelector('.main-nav');

  if (navToggle && mainNav) {
    navToggle.addEventListener('click', () => {
      const open = mainNav.classList.toggle('open');
      navToggle.classList.toggle('open', open);
      navToggle.setAttribute('aria-expanded', open);
      document.body.style.overflow = open ? 'hidden' : '';
    });

    // Cerrar al click fuera
    document.addEventListener('click', e => {
      if (!mainNav.contains(e.target) && !navToggle.contains(e.target)) {
        mainNav.classList.remove('open');
        navToggle.classList.remove('open');
        navToggle.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      }
    });

    // Cerrar al elegir un link
    mainNav.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => {
        mainNav.classList.remove('open');
        navToggle.classList.remove('open');
        navToggle.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      });
    });
  }

  // ── 5. ANIMACIONES ON SCROLL ───────────────────────────
  const animEls = document.querySelectorAll('.animate-up, .animate-fade');
  if (animEls.length) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

    animEls.forEach(el => observer.observe(el));
  }

  // ── 6. SMOOTH SCROLL ───────────────────────────────────
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', e => {
      const id = anchor.getAttribute('href');
      if (id === '#') return;
      const target = document.querySelector(id);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  // ── 7. CONTADOR TEXTAREA ───────────────────────────────
  const textarea = document.getElementById('mensaje');
  const hint     = document.getElementById('mensaje-hint');
  if (textarea && hint) {
    textarea.addEventListener('input', () => {
      const n = textarea.value.length;
      hint.textContent = `${n} / 500 caracteres`;
      hint.style.color = n > 450 ? 'var(--c-danger)' : '';
    });
  }

  // ── 8. VALIDACIÓN FORMULARIO ───────────────────────────
  const form = document.getElementById('contactForm');
  if (form) {

    const setError = (id, errId, msg) => {
      const f = document.getElementById(id);
      const e = document.getElementById(errId);
      f?.classList.add('has-error');
      f?.classList.remove('is-valid');
      if (e) e.textContent = msg;
    };
    const setValid = (id, errId) => {
      const f = document.getElementById(id);
      const e = document.getElementById(errId);
      f?.classList.remove('has-error');
      f?.classList.add('is-valid');
      if (e) e.textContent = '';
    };

    const isEmail = v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim());
    const isPhone = v => /[\d\s\-\+\(\)]{8,}/.test(v.trim());

    const validate = () => {
      let ok = true;

      const nombre = document.getElementById('nombre');
      if (!nombre?.value.trim() || nombre.value.trim().length < 2) {
        setError('nombre', 'nombre-error', 'Ingresá tu nombre completo.');
        ok = false;
      } else setValid('nombre', 'nombre-error');

      const email = document.getElementById('email');
      if (!email?.value || !isEmail(email.value)) {
        setError('email', 'email-error', 'Ingresá un email válido.');
        ok = false;
      } else setValid('email', 'email-error');

      const tel = document.getElementById('telefono');
      if (!tel?.value || !isPhone(tel.value)) {
        setError('telefono', 'telefono-error', 'Ingresá un teléfono válido.');
        ok = false;
      } else setValid('telefono', 'telefono-error');

      const priv = document.getElementById('privacidad');
      const privErr = document.getElementById('privacidad-error');
      if (!priv?.checked) {
        if (privErr) privErr.textContent = 'Debés aceptar la política de privacidad.';
        ok = false;
      } else {
        if (privErr) privErr.textContent = '';
      }

      return ok;
    };

    // Validación blur
    ['nombre', 'email', 'telefono'].forEach(id => {
      document.getElementById(id)?.addEventListener('blur', validate);
    });

    form.addEventListener('submit', async e => {
      e.preventDefault();
      if (!validate()) return;

      const btn     = form.querySelector('[type="submit"]');
      const btnText = form.querySelector('.btn-text');
      const spinner = form.querySelector('.spinner');

      if (btn) btn.classList.add('btn-loading');
      if (btnText) btnText.textContent = 'Enviando...';
      if (spinner) spinner.style.display = 'inline-block';

      await new Promise(r => setTimeout(r, 1500));

      form.style.display = 'none';
      const success = document.getElementById('formSuccess');
      if (success) {
        success.style.display = 'block';
        success.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    });
  }

  // ── 9. FILTRO GALERÍA ──────────────────────────────────
  const filterBtns = document.querySelectorAll('.filter-btn');
  const galleryItems = document.querySelectorAll('.gallery-item');

  if (filterBtns.length && galleryItems.length) {
    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('filter-btn--active'));
        btn.classList.add('filter-btn--active');

        const filter = btn.dataset.filter;
        galleryItems.forEach(item => {
          const show = filter === 'all' || item.dataset.category === filter;
          item.classList.toggle('hidden', !show);
          if (show) {
            // Re-trigger animation
            item.classList.remove('visible');
            requestAnimationFrame(() => {
              requestAnimationFrame(() => item.classList.add('visible'));
            });
          }
        });
      });
    });
  }

});
