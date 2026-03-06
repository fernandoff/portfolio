/* ================================================
   main.js — Portfolio Fernando Fernandes
   ================================================ */

// ---------- NAVBAR SCROLL ----------
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 20);
});

// ---------- MOBILE MENU ----------
const navToggle = document.getElementById('navToggle');
const navLinks  = document.getElementById('navLinks');

navToggle.addEventListener('click', () => {
  navLinks.classList.toggle('open');
});

navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => navLinks.classList.remove('open'));
});

// ---------- TYPED EFFECT ----------
const roles = [
  'Full Stack Senior Developer',
  'PHP & Laravel Specialist',
  'Vue.js & React Developer',
  'API Integration Expert',
  'C# & Node.js Developer',
];

let roleIndex  = 0;
let charIndex  = 0;
let deleting   = false;
const typedEl  = document.getElementById('typed');
const DELAY_TYPE   = 65;
const DELAY_DELETE = 35;
const DELAY_PAUSE  = 1800;
const DELAY_NEXT   = 400;

function type() {
  const current = roles[roleIndex];

  if (deleting) {
    typedEl.textContent = current.substring(0, charIndex - 1);
    charIndex--;
    if (charIndex === 0) {
      deleting = false;
      roleIndex = (roleIndex + 1) % roles.length;
      setTimeout(type, DELAY_NEXT);
      return;
    }
    setTimeout(type, DELAY_DELETE);
  } else {
    typedEl.textContent = current.substring(0, charIndex + 1);
    charIndex++;
    if (charIndex === current.length) {
      deleting = true;
      setTimeout(type, DELAY_PAUSE);
      return;
    }
    setTimeout(type, DELAY_TYPE);
  }
}

type();

// ---------- SCROLL ANIMATIONS (IntersectionObserver) ----------
const animatedEls = document.querySelectorAll('[data-animate]');

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        // Stagger within the same parent
        const siblings = [...entry.target.parentElement.querySelectorAll('[data-animate]')];
        const idx = siblings.indexOf(entry.target);
        setTimeout(() => {
          entry.target.classList.add('visible');
        }, idx * 80);
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
);

animatedEls.forEach(el => observer.observe(el));

// ---------- ACTIVE NAV LINK ON SCROLL ----------
const sections = document.querySelectorAll('section[id]');
const navAnchors = document.querySelectorAll('.nav-links a[href^="#"]');

const sectionObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        navAnchors.forEach(a => a.classList.remove('active'));
        const active = document.querySelector(`.nav-links a[href="#${entry.target.id}"]`);
        if (active) active.classList.add('active');
      }
    });
  },
  { threshold: 0.4 }
);

sections.forEach(s => sectionObserver.observe(s));

// Add active style via JS-controlled class
const styleSheet = document.createElement('style');
styleSheet.textContent = `
  .nav-links a.active:not(.nav-cta) {
    color: var(--accent) !important;
    background: rgba(88,166,255,.08) !important;
  }
`;
document.head.appendChild(styleSheet);

// ---------- CONTACT FORM (mailto fallback) ----------
const contactForm = document.getElementById('contactForm');
const formMsg     = document.getElementById('formMsg');

contactForm.addEventListener('submit', (e) => {
  e.preventDefault();

  const name    = contactForm.name.value.trim();
  const email   = contactForm.email.value.trim();
  const message = contactForm.message.value.trim();

  if (!name || !email || !message) {
    formMsg.style.color = 'var(--accent3)';
    formMsg.textContent = 'Por favor, preencha todos os campos.';
    return;
  }

  // Compose mailto
  const subject = encodeURIComponent(`Contato pelo portfolio — ${name}`);
  const body    = encodeURIComponent(`Nome: ${name}\nE-mail: ${email}\n\n${message}`);
  window.location.href = `mailto:fernando.cua@gmail.com?subject=${subject}&body=${body}`;

  formMsg.style.color = 'var(--accent2)';
  formMsg.textContent = 'Abrindo seu cliente de e-mail...';
  contactForm.reset();
  setTimeout(() => { formMsg.textContent = ''; }, 5000);
});

// ---------- SMOOTH SCROLL (fallback for older browsers) ----------
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', (e) => {
    const target = document.querySelector(anchor.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
});

// ---------- GALLERY MODAL — Cotações Agrícolas ----------
(function () {
  const IMAGES = [
    'imagens/print7.png',
    'imagens/print8.png',
    'imagens/print9.png',
    'imagens/print10.png',
    'imagens/print11.png',
    'imagens/print12.png',
  ];
  const TOTAL = IMAGES.length;

  const overlay    = document.getElementById('modal-agro');
  const modalImg   = document.getElementById('modalImg');
  const counter    = document.getElementById('modalCounter');
  const dotsWrap   = document.getElementById('modalDots');
  const btnClose   = document.getElementById('modalClose');
  const btnPrev    = document.getElementById('modalPrev');
  const btnNext    = document.getElementById('modalNext');

  let current = 0;

  // Build dots
  const dots = IMAGES.map((_, i) => {
    const btn = document.createElement('button');
    btn.className = 'modal-dot' + (i === 0 ? ' active' : '');
    btn.setAttribute('aria-label', `Ir para imagem ${i + 1}`);
    btn.addEventListener('click', () => goTo(i));
    dotsWrap.appendChild(btn);
    return btn;
  });

  function updateUI() {
    counter.textContent = `${current + 1} / ${TOTAL}`;
    btnPrev.disabled = current === 0;
    btnNext.disabled = current === TOTAL - 1;
    dots.forEach((d, i) => d.classList.toggle('active', i === current));
  }

  function goTo(index) {
    if (index < 0 || index >= TOTAL) return;
    modalImg.classList.add('img-fade');
    setTimeout(() => {
      current = index;
      modalImg.src = IMAGES[current];
      modalImg.alt = `Screenshot ${current + 1} do Sistema de Cotações Agrícolas`;
      modalImg.classList.remove('img-fade');
      updateUI();
    }, 150);
  }

  function openModal() {
    current = 0;
    modalImg.src = IMAGES[0];
    modalImg.alt = 'Screenshot 1 do Sistema de Cotações Agrícolas';
    updateUI();
    overlay.removeAttribute('hidden');
    // Trigger CSS transition on next frame
    requestAnimationFrame(() => {
      requestAnimationFrame(() => overlay.classList.add('modal-visible'));
    });
    document.body.style.overflow = 'hidden';
    btnClose.focus();
  }

  function closeModal() {
    overlay.classList.remove('modal-visible');
    // Wait for transition before hiding
    overlay.addEventListener('transitionend', function handler() {
      overlay.setAttribute('hidden', '');
      overlay.removeEventListener('transitionend', handler);
    });
    document.body.style.overflow = '';
  }

  // Open via gallery cards
  document.querySelectorAll('[data-gallery="agro"]').forEach(card => {
    card.addEventListener('click', openModal);
    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openModal(); }
    });
  });

  // Close buttons / overlay click
  btnClose.addEventListener('click', closeModal);
  overlay.addEventListener('click', (e) => { if (e.target === overlay) closeModal(); });

  // Navigation buttons
  btnPrev.addEventListener('click', () => goTo(current - 1));
  btnNext.addEventListener('click', () => goTo(current + 1));

  // Keyboard
  document.addEventListener('keydown', (e) => {
    if (overlay.hasAttribute('hidden')) return;
    if (e.key === 'Escape')      closeModal();
    if (e.key === 'ArrowLeft')   goTo(current - 1);
    if (e.key === 'ArrowRight')  goTo(current + 1);
  });
})();
