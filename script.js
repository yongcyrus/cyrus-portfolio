/* ===========================
   PORTFOLIO SCRIPT
=========================== */

// ---- NAV: Scroll state ----
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 40);
}, { passive: true });

// ---- THEME TOGGLE ----
const html = document.documentElement;
const themeToggle = document.getElementById('themeToggle');

// Respect system preference on first load
if (!localStorage.getItem('theme')) {
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  html.setAttribute('data-theme', prefersDark ? 'dark' : 'light');
} else {
  html.setAttribute('data-theme', localStorage.getItem('theme'));
}

themeToggle.addEventListener('click', () => {
  const current = html.getAttribute('data-theme');
  const next = current === 'dark' ? 'light' : 'dark';
  html.setAttribute('data-theme', next);
  localStorage.setItem('theme', next);
});

// ---- HAMBURGER MENU ----
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');
const mobileLinks = document.querySelectorAll('.mobile-link');

hamburger.addEventListener('click', () => {
  mobileMenu.classList.toggle('open');
  document.body.style.overflow = mobileMenu.classList.contains('open') ? 'hidden' : '';
});

mobileLinks.forEach(link => {
  link.addEventListener('click', () => {
    mobileMenu.classList.remove('open');
    document.body.style.overflow = '';
  });
});

// ---- SCROLL REVEAL ----
const fadeEls = document.querySelectorAll('.about-grid, .projects-grid > *, .skill-row, .chips span, .contact-actions, .contact-title, .contact-sub, .section-label, .section-title, .about-stats');

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('fade-in', 'visible');
      revealObserver.unobserve(entry.target);
    } else {
      entry.target.classList.add('fade-in');
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

fadeEls.forEach(el => {
  el.classList.add('fade-in');
  revealObserver.observe(el);
});

// ---- SKILLS: Animated progress bars ----
const skillFills = document.querySelectorAll('.skill-fill');

const skillObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const fill = entry.target;
      const targetWidth = fill.getAttribute('data-width') + '%';
      // Small delay so the animation is visible
      setTimeout(() => {
        fill.style.width = targetWidth;
      }, 200);
      skillObserver.unobserve(fill);
    }
  });
}, { threshold: 0.5 });

skillFills.forEach(fill => skillObserver.observe(fill));

// ---- PROJECT MODAL DATA ----
const projects = [
  {
    tag: 'Full-Stack',
    title: 'Horizon CRM',
    desc: 'A production-grade CRM platform built for a 200-person enterprise sales team. The system handles real-time deal tracking, contact management, and pipeline analytics with live updates across all connected clients.',
    highlights: [
      'Real-time collaborative dashboards using WebSockets',
      'Role-based access control with fine-grained permissions',
      'Automated PDF report generation and email scheduling',
      'Integrated with Salesforce, HubSpot, and Slack via webhooks',
    ],
    tech: ['React', 'Node.js', 'PostgreSQL', 'Redis', 'Socket.io', 'Stripe', 'Docker'],
    links: { live: '#', github: '#' },
  },
  {
    tag: 'API / Backend',
    title: 'FlowAPI',
    desc: 'A high-performance API gateway supporting both REST and GraphQL interfaces. Designed to be the single ingress point for a microservices architecture, handling authentication, rate-limiting, and request transformation at scale.',
    highlights: [
      'Sustains 10,000+ requests/second with <5ms p99 latency',
      'Intelligent caching layer reducing backend load by 60%',
      'Per-client rate limiting with adaptive throttling',
      'Developer portal with API key management and live logs',
    ],
    tech: ['Go', 'GraphQL', 'Docker', 'AWS ECS', 'Nginx', 'Prometheus', 'Grafana'],
    links: { live: '#', github: '#' },
  },
  {
    tag: 'Open Source',
    title: 'Patchwork UI',
    desc: 'A fully headless, accessible component library for React. Built after frustration with libraries that imposed too much style opinion while still leaving accessibility gaps. Every component is unstyled by default and ships with full ARIA compliance.',
    highlights: [
      '28 components with complete keyboard navigation support',
      'Zero runtime dependencies, tree-shakeable output',
      'Comprehensive Storybook docs with interaction tests',
      'Used in 40+ production projects, 1.2k GitHub stars',
    ],
    tech: ['TypeScript', 'React', 'Radix Primitives', 'Storybook', 'Vitest', 'Rollup'],
    links: { live: '#', github: '#' },
  },
  {
    tag: 'ML / Data',
    title: 'Pulse Analytics',
    desc: 'An ML-powered behavioural analytics platform for SaaS companies. Ingests product event streams and runs continuous anomaly detection and churn prediction models, surfacing actionable alerts to product and growth teams.',
    highlights: [
      'Ingests 50M+ events/day via Kafka streams',
      'Churn model achieves 83% accuracy at 14-day horizon',
      'Anomaly alerts reduce mean-time-to-detect issues by 4×',
      'Interactive segment explorer for cohort analysis',
    ],
    tech: ['Python', 'FastAPI', 'PyTorch', 'Kafka', 'ClickHouse', 'React', 'Airflow'],
    links: { live: '#', github: '#' },
  },
];

// ---- MODAL ----
const overlay = document.getElementById('modalOverlay');
const modalContent = document.getElementById('modalContent');
const modalClose = document.getElementById('modalClose');

function openModal(index) {
  const p = projects[index];
  modalContent.innerHTML = `
    <span class="modal-tag">${p.tag}</span>
    <h2 class="modal-title">${p.title}</h2>
    <p class="modal-desc">${p.desc}</p>
    <div class="modal-highlights">
      <h4>Key Highlights</h4>
      <ul>
        ${p.highlights.map(h => `<li>${h}</li>`).join('')}
      </ul>
    </div>
    <div class="modal-tech">
      ${p.tech.map(t => `<span>${t}</span>`).join('')}
    </div>
    <div class="modal-links">
      <a href="${p.links.live}" class="btn-primary">Live Demo ↗</a>
      <a href="${p.links.github}" class="btn-ghost">View Code</a>
    </div>
  `;
  overlay.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeModal() {
  overlay.classList.remove('open');
  document.body.style.overflow = '';
}

document.querySelectorAll('.project-card').forEach(card => {
  card.addEventListener('click', () => {
    const idx = parseInt(card.getAttribute('data-project'));
    openModal(idx);
  });
  // Keyboard accessibility
  card.setAttribute('tabindex', '0');
  card.setAttribute('role', 'button');
  card.setAttribute('aria-label', `View details for ${card.querySelector('.project-name').textContent}`);
  card.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      const idx = parseInt(card.getAttribute('data-project'));
      openModal(idx);
    }
  });
});

modalClose.addEventListener('click', closeModal);

overlay.addEventListener('click', (e) => {
  if (e.target === overlay) closeModal();
});

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeModal();
});

// ---- SMOOTH NAV ACTIVE STATES ----
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-links a');

const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const id = entry.target.getAttribute('id');
      navLinks.forEach(link => {
        link.style.color = link.getAttribute('href') === `#${id}`
          ? 'var(--text)'
          : '';
      });
    }
  });
}, { threshold: 0.5 });

sections.forEach(s => sectionObserver.observe(s));

// ---- STAGGERED REVEAL for project cards ----
const projectCards = document.querySelectorAll('.project-card');
const cardObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      // slight stagger per card
      const delay = Array.from(projectCards).indexOf(entry.target) * 80;
      setTimeout(() => {
        entry.target.classList.add('visible');
      }, delay);
      cardObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });

projectCards.forEach(card => {
  card.classList.add('fade-in');
  cardObserver.observe(card);
});
