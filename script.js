/**
 * Noble Homoeopathy Clinic — Modern JavaScript
 * ES2024+ | Vanilla JS | No jQuery Dependencies
 */

// ── DOM Ready ──
document.addEventListener('DOMContentLoaded', () => {
  initSplashScreen();
  initNavbar();
  initMobileMenu();
  initScrollAnimations();
  initActiveNav();
  initLightbox();
  initParticles();
});

// ══════════════════════════════════════
// ── Splash Screen
// ══════════════════════════════════════
function initSplashScreen() {
  const splash = document.getElementById('splash-screen');
  if (!splash) return;

  window.addEventListener('load', () => {
    setTimeout(() => {
      splash.classList.add('hide');
      // Remove from DOM after transition
      setTimeout(() => splash.remove(), 1000);
    }, 2800);
  });
}

// ══════════════════════════════════════
// ── Navbar Scroll Effects
// ══════════════════════════════════════
function initNavbar() {
  const navbar = document.querySelector('.navbar');
  if (!navbar) return;

  const onScroll = () => {
    navbar.classList.toggle('scrolled', window.scrollY > 50);
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll(); // Initial check
}

// ══════════════════════════════════════
// ── Mobile Menu Toggle
// ══════════════════════════════════════
function initMobileMenu() {
  const hamburger = document.querySelector('.hamburger');
  const navMenu = document.querySelector('.nav-menu');
  if (!hamburger || !navMenu) return;

  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('open');
    navMenu.classList.toggle('open');
    document.body.style.overflow = navMenu.classList.contains('open') ? 'hidden' : '';
  });

  // Close menu on link click
  navMenu.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('open');
      navMenu.classList.remove('open');
      document.body.style.overflow = '';
    });
  });

  // Close on outside click
  document.addEventListener('click', (e) => {
    if (!navMenu.contains(e.target) && !hamburger.contains(e.target) && navMenu.classList.contains('open')) {
      hamburger.classList.remove('open');
      navMenu.classList.remove('open');
      document.body.style.overflow = '';
    }
  });
}

// ══════════════════════════════════════
// ── Scroll-triggered Animations
// ══════════════════════════════════════
function initScrollAnimations() {
  const elements = document.querySelectorAll('.animate-on-scroll');
  if (!elements.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
  );

  elements.forEach(el => observer.observe(el));
}

// ══════════════════════════════════════
// ── Active Navigation Highlight
// ══════════════════════════════════════
function initActiveNav() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-links a');
  if (!sections.length || !navLinks.length) return;

  const navHeight = 80;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const id = entry.target.id;
          navLinks.forEach(link => {
            link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
          });
        }
      });
    },
    {
      threshold: 0.3,
      rootMargin: `-${navHeight}px 0px -30% 0px`
    }
  );

  sections.forEach(section => observer.observe(section));
}

// ══════════════════════════════════════
// ── Custom Lightbox (using native dialog pattern)
// ══════════════════════════════════════
function initLightbox() {
  const galleryItems = document.querySelectorAll('.gallery-item');
  const lightbox = document.getElementById('lightbox');
  if (!galleryItems.length || !lightbox) return;

  const lightboxImg = lightbox.querySelector('.lightbox-img');
  const lightboxCaption = lightbox.querySelector('.lightbox-caption');
  const closeBtn = lightbox.querySelector('.lightbox-close');
  const prevBtn = lightbox.querySelector('.lightbox-prev');
  const nextBtn = lightbox.querySelector('.lightbox-next');

  let currentIndex = 0;
  const images = Array.from(galleryItems).map(item => ({
    src: item.querySelector('img').src,
    caption: item.dataset.caption || ''
  }));

  function showImage(index) {
    currentIndex = ((index % images.length) + images.length) % images.length;
    lightboxImg.src = images[currentIndex].src;
    lightboxCaption.textContent = images[currentIndex].caption;
  }

  function openLightbox(index) {
    showImage(index);
    lightbox.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    lightbox.classList.remove('open');
    document.body.style.overflow = '';
  }

  galleryItems.forEach((item, i) => {
    item.addEventListener('click', () => openLightbox(i));
  });

  closeBtn?.addEventListener('click', closeLightbox);
  prevBtn?.addEventListener('click', () => showImage(currentIndex - 1));
  nextBtn?.addEventListener('click', () => showImage(currentIndex + 1));

  // Keyboard navigation
  document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('open')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') showImage(currentIndex - 1);
    if (e.key === 'ArrowRight') showImage(currentIndex + 1);
  });

  // Close on backdrop click
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) closeLightbox();
  });
}

// ══════════════════════════════════════
// ── Hero Particle Effect
// ══════════════════════════════════════
function initParticles() {
  const container = document.querySelector('.hero-particles');
  if (!container) return;

  const count = 25;

  for (let i = 0; i < count; i++) {
    const particle = document.createElement('div');
    particle.classList.add('particle');

    const size = Math.random() * 4 + 2;
    const left = Math.random() * 100;
    const duration = Math.random() * 15 + 10;
    const delay = Math.random() * 10;
    const opacity = Math.random() * 0.5 + 0.2;

    particle.style.cssText = `
      width: ${size}px;
      height: ${size}px;
      left: ${left}%;
      animation-duration: ${duration}s;
      animation-delay: ${delay}s;
      opacity: ${opacity};
    `;

    container.appendChild(particle);
  }
}

// ══════════════════════════════════════
// ── Google Translate Integration
// ══════════════════════════════════════
function googleTranslateInit() {
  new google.translate.TranslateElement({
    pageLanguage: 'en',
    includedLanguages: 'en,ta',
    layout: google.translate.TranslateElement.InlineLayout.SIMPLE,
    autoDisplay: false
  }, 'google_translate_element');
}

function translateTo(lang) {
  // Update button UI immediately
  const btnEn = document.getElementById('btn-en');
  const btnTa = document.getElementById('btn-ta');

  if (lang === 'ta') {
    btnTa?.classList.add('active');
    btnEn?.classList.remove('active');
  } else {
    btnEn?.classList.add('active');
    btnTa?.classList.remove('active');
  }

  // Try to use the Google Translate combo
  function tryTranslate(retries) {
    const combo = document.querySelector('.goog-te-combo');
    if (combo) {
      combo.value = lang;
      combo.dispatchEvent(new Event('change'));
      return;
    }
    if (retries > 0) {
      setTimeout(() => tryTranslate(retries - 1), 300);
    }
  }

  // Also set the cookie for Google Translate
  if (lang === 'en') {
    // Remove translation by setting to empty
    document.cookie = 'googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    document.cookie = 'googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=' + location.hostname;
  } else {
    document.cookie = 'googtrans=/en/' + lang + '; path=/;';
    document.cookie = 'googtrans=/en/' + lang + '; path=/; domain=' + location.hostname;
  }

  tryTranslate(10);
}

// Periodically hide Google Translate cosmetic UI (not the combo)
(function hideGoogleTranslateUI() {
  setInterval(() => {
    // Hide the banner frame
    const banner = document.querySelector('.goog-te-banner-frame');
    if (banner) banner.style.display = 'none';

    // Hide skip translate overlays
    document.querySelectorAll('body > .skiptranslate').forEach(el => {
      el.style.display = 'none';
    });

    // Remove top offset Google Translate adds to body
    document.body.style.top = '0px';
  }, 1000);
})();

// Sync button states with Google Translate's internal state
(function syncTranslateButtons() {
  const check = () => {
    const combo = document.querySelector('.goog-te-combo');
    if (combo) {
      // Sync initial state
      const currentVal = combo.value;
      if (currentVal === 'ta') {
        document.getElementById('btn-ta')?.classList.add('active');
        document.getElementById('btn-en')?.classList.remove('active');
      }

      // Watch for changes
      combo.addEventListener('change', () => {
        const lang = combo.value || 'en';
        const btnEn = document.getElementById('btn-en');
        const btnTa = document.getElementById('btn-ta');
        if (lang === 'ta') {
          btnTa?.classList.add('active');
          btnEn?.classList.remove('active');
        } else {
          btnEn?.classList.add('active');
          btnTa?.classList.remove('active');
        }
      });
    } else {
      setTimeout(check, 500);
    }
  };
  setTimeout(check, 2000);
})();

