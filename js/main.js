(() => {
  'use strict';

  // Page loader
  const loader = document.getElementById('pageLoader');
  window.addEventListener('load', () => {
    setTimeout(() => { loader.classList.add('hidden'); initStaggerHero(); }, 400);
  });
  setTimeout(() => { loader.classList.add('hidden'); initStaggerHero(); }, 2500);

  // Scroll progress bar
  const scrollProgress = document.getElementById('scrollProgress');
  window.addEventListener('scroll', () => {
    const h = document.documentElement.scrollHeight - window.innerHeight;
    scrollProgress.style.width = (h > 0 ? (window.scrollY / h) * 100 : 0) + '%';
  }, { passive: true });

  // Navbar scroll
  const navbar = document.getElementById('navbar');
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 40);
  }, { passive: true });

  // Mobile burger + overlay
  const burger = document.getElementById('burger');
  const mobileOverlay = document.getElementById('mobileNavOverlay');
  const mobileLinks = mobileOverlay ? mobileOverlay.querySelectorAll('a') : [];
  function toggleMobileNav() {
    burger.classList.toggle('active');
    mobileOverlay.classList.toggle('active');
    document.body.style.overflow = mobileOverlay.classList.contains('active') ? 'hidden' : '';
  }
  burger.addEventListener('click', toggleMobileNav);
  mobileLinks.forEach(link => {
    link.addEventListener('click', () => { if (mobileOverlay.classList.contains('active')) toggleMobileNav(); });
  });

  // Stagger hero entrance
  function initStaggerHero() {
    document.querySelectorAll('.stagger-item').forEach((el, i) => {
      setTimeout(() => el.classList.add('visible'), 150 + i * 120);
    });
  }
  if (loader.classList.contains('hidden')) initStaggerHero();

  // Scroll animations
  const scrollObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        setTimeout(() => entry.target.classList.add('visible'), +(entry.target.dataset.delay || 0));
        scrollObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
  document.querySelectorAll('.animate-on-scroll').forEach((el, i) => { el.dataset.delay = (i % 6) * 80; scrollObserver.observe(el); });

  // Counter animation
  const counterObs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.querySelectorAll('[data-count]').forEach(c => {
        const target = parseInt(c.dataset.count, 10), dur = 1800, t0 = performance.now();
        const tick = (now) => {
          const p = Math.min((now - t0) / dur, 1);
          c.textContent = Math.round((1 - Math.pow(1 - p, 3)) * target);
          if (p < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
      });
      counterObs.unobserve(entry.target);
    });
  }, { threshold: 0.5 });
  const statsEl = document.querySelector('.hero-stats');
  if (statsEl) counterObs.observe(statsEl);

  // Tech bars
  const techObs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.querySelectorAll('.tech-fill').forEach((f, i) => {
        setTimeout(() => { f.style.width = f.dataset.width + '%'; }, i * 80);
      });
      techObs.unobserve(entry.target);
    });
  }, { threshold: 0.25 });
  const techGrid = document.querySelector('.tech-grid');
  if (techGrid) techObs.observe(techGrid);

  // Portfolio filter with card shuffle
  const filterBtns = document.querySelectorAll('.filter-btn');
  const pCards = document.querySelectorAll('.portfolio-card');
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const f = btn.dataset.filter;
      pCards.forEach(c => {
        if (f === 'all' || c.dataset.category === f) {
          c.classList.remove('hidden');
          c.style.opacity = '0';
          c.style.transform = 'scale(0.9) rotate(-1deg)';
          requestAnimationFrame(() => {
            c.classList.add('card-shuffle');
            c.style.opacity = '1';
            c.style.transform = '';
          });
          setTimeout(() => c.classList.remove('card-shuffle'), 400);
        } else {
          c.classList.add('hidden');
        }
      });
    });
  });

  // Contact form
  const form = document.getElementById('contactForm');
  const toast = document.getElementById('toast');
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    console.log('Form:', Object.fromEntries(new FormData(form).entries()));
    form.reset();
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 4000);
  });

  // Smooth scroll
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', (e) => {
      e.preventDefault();
      const t = document.querySelector(a.getAttribute('href'));
      if (t) window.scrollTo({ top: t.getBoundingClientRect().top + window.pageYOffset - navbar.offsetHeight - 20, behavior: 'smooth' });
    });
  });

  // Active nav on scroll
  const sections = document.querySelectorAll('section[id]');
  const desktopLinks = document.querySelectorAll('.nav-links a');
  window.addEventListener('scroll', () => {
    const sy = window.scrollY + 120;
    sections.forEach(s => {
      if (sy >= s.offsetTop - 120 && sy < s.offsetTop - 120 + s.offsetHeight) {
        desktopLinks.forEach(l => { l.style.color = l.getAttribute('href') === '#' + s.id ? 'var(--text-primary)' : ''; });
      }
    });
  }, { passive: true });

  // Mobile CTA bar
  const ctaBar = document.getElementById('mobileCtaBar');
  if (ctaBar) {
    window.addEventListener('scroll', () => {
      ctaBar.classList.toggle('visible', window.scrollY > 400);
    }, { passive: true });
  }

  // Parallax orbs on scroll
  const orbs = document.querySelectorAll('.hero-orb');
  if (orbs.length && window.matchMedia('(min-width: 1024px)').matches) {
    window.addEventListener('scroll', () => {
      const sy = window.scrollY;
      orbs.forEach((orb, i) => { orb.style.transform = 'translateY(' + (sy * (0.15 + i * 0.08)) + 'px)'; });
    }, { passive: true });
  }

  // Tilt effect on cards (desktop)
  const isDesktop = window.matchMedia('(min-width: 1024px)').matches;
  if (isDesktop) {
    document.querySelectorAll('.tilt-card').forEach(card => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;
        card.style.transform = 'perspective(800px) rotateY(' + (x * 8) + 'deg) rotateX(' + (-y * 8) + 'deg) translateY(-4px)';
        const glow = card.querySelector('.card-glow');
        if (glow) { glow.style.left = (e.clientX - rect.left) + 'px'; glow.style.top = (e.clientY - rect.top) + 'px'; }
        // Parallax layers inside card
        card.querySelectorAll('.parallax-layer').forEach(layer => {
          const d = parseFloat(layer.dataset.depth) || 0.02;
          layer.style.transform = 'translate(' + (x * d * 100) + 'px, ' + (-y * d * 100) + 'px)';
        });
      });
      card.addEventListener('mouseleave', () => {
        card.style.transform = '';
        card.querySelectorAll('.parallax-layer').forEach(l => { l.style.transform = ''; });
      });
    });
  }

  // Magnetic buttons
  if (isDesktop) {
    document.querySelectorAll('.magnetic-btn').forEach(btn => {
      btn.addEventListener('mousemove', (e) => {
        const rect = btn.getBoundingClientRect();
        btn.style.transform = 'translate(' + ((e.clientX - rect.left - rect.width / 2) * 0.2) + 'px, ' + ((e.clientY - rect.top - rect.height / 2) * 0.2) + 'px)';
      });
      btn.addEventListener('mouseleave', () => { btn.style.transform = ''; });
    });
  }

  // Theme toggle with smooth transition
  const themeToggle = document.getElementById('themeToggle');
  const savedTheme = localStorage.getItem('theme') || 'dark';
  if (savedTheme === 'light') document.documentElement.setAttribute('data-theme', 'light');
  themeToggle.addEventListener('click', () => {
    const current = document.documentElement.getAttribute('data-theme');
    const next = current === 'light' ? '' : 'light';
    document.documentElement.style.transition = 'background-color 0.6s ease';
    document.body.style.transition = 'color 0.5s ease, background-color 0.5s ease';
    if (next) { document.documentElement.setAttribute('data-theme', next); }
    else { document.documentElement.removeAttribute('data-theme'); }
    localStorage.setItem('theme', next || 'dark');
    setTimeout(() => { document.documentElement.style.transition = ''; document.body.style.transition = ''; }, 600);
  });

  // Typewriter
  const typewriterEl = document.getElementById('typewriter');
  if (typewriterEl) {
    const words = ['цифровые продукты', 'сайты и лендинги', 'мобильные приложения', 'Telegram-боты', 'веб-приложения', 'AI-решения'];
    let wordIdx = 0, charIdx = 0, isDeleting = false, typeSpeed = 80;
    function typeLoop() {
      const current = words[wordIdx];
      typewriterEl.textContent = isDeleting ? current.substring(0, --charIdx) : current.substring(0, ++charIdx);
      typeSpeed = isDeleting ? 40 : 80;
      if (!isDeleting && charIdx === current.length) { typeSpeed = 2200; isDeleting = true; }
      else if (isDeleting && charIdx === 0) { isDeleting = false; wordIdx = (wordIdx + 1) % words.length; typeSpeed = 400; }
      setTimeout(typeLoop, typeSpeed);
    }
    setTimeout(typeLoop, 1200);
  }

  // Canvas particles
  const canvas = document.getElementById('particles');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let w, h, particles = [];
    function resizeCanvas() { const hero = canvas.parentElement; w = canvas.width = hero.offsetWidth; h = canvas.height = hero.offsetHeight; }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    class Particle {
      constructor() { this.reset(); }
      reset() { this.x = Math.random() * w; this.y = Math.random() * h; this.vx = (Math.random() - 0.5) * 0.3; this.vy = (Math.random() - 0.5) * 0.3; this.r = Math.random() * 1.8 + 0.5; this.alpha = Math.random() * 0.4 + 0.1; this.color = Math.random() > 0.5 ? '124,58,237' : '99,102,241'; }
      update() { this.x += this.vx; this.y += this.vy; if (this.x < 0 || this.x > w) this.vx *= -1; if (this.y < 0 || this.y > h) this.vy *= -1; }
      draw() { ctx.beginPath(); ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2); ctx.fillStyle = 'rgba(' + this.color + ',' + this.alpha + ')'; ctx.fill(); }
    }
    const count = Math.min(Math.floor((w * h) / 12000), 80);
    for (let i = 0; i < count; i++) particles.push(new Particle());
    function drawLines() {
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x, dy = particles[i].y - particles[j].y, dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 120) { ctx.beginPath(); ctx.moveTo(particles[i].x, particles[i].y); ctx.lineTo(particles[j].x, particles[j].y); ctx.strokeStyle = 'rgba(124,58,237,' + (0.06 * (1 - dist / 120)) + ')'; ctx.lineWidth = 0.5; ctx.stroke(); }
        }
      }
    }
    function animateParticles() { ctx.clearRect(0, 0, w, h); particles.forEach(p => { p.update(); p.draw(); }); drawLines(); requestAnimationFrame(animateParticles); }
    animateParticles();
  }

  // Starfield canvas
  const starCanvas = document.getElementById('starfield');
  if (starCanvas) {
    const sctx = starCanvas.getContext('2d');
    let sw, sh, stars = [];
    function resizeStarfield() { const hero = starCanvas.parentElement; sw = starCanvas.width = hero.offsetWidth; sh = starCanvas.height = hero.offsetHeight; }
    resizeStarfield();
    window.addEventListener('resize', resizeStarfield);
    class Star {
      constructor() { this.reset(); }
      reset() { this.x = Math.random() * sw; this.y = Math.random() * sh; this.size = Math.random() * 1.5 + 0.3; this.alpha = Math.random() * 0.6 + 0.1; this.twinkleSpeed = Math.random() * 0.02 + 0.005; this.twinklePhase = Math.random() * Math.PI * 2; }
      update() { this.twinklePhase += this.twinkleSpeed; this.currentAlpha = this.alpha * (0.5 + 0.5 * Math.sin(this.twinklePhase)); }
      draw() { sctx.beginPath(); sctx.arc(this.x, this.y, this.size, 0, Math.PI * 2); sctx.fillStyle = 'rgba(200,200,255,' + this.currentAlpha + ')'; sctx.fill(); }
    }
    const starCount = Math.min(Math.floor((sw * sh) / 4000), 150);
    for (let i = 0; i < starCount; i++) stars.push(new Star());
    function animateStars() { sctx.clearRect(0, 0, sw, sh); stars.forEach(s => { s.update(); s.draw(); }); requestAnimationFrame(animateStars); }
    animateStars();
  }

  // Custom cursor
  const cursorDot = document.getElementById('cursorDot');
  const cursorRing = document.getElementById('cursorRing');
  if (cursorDot && cursorRing && window.matchMedia('(pointer: fine)').matches) {
    let mx = 0, my = 0, ringX = 0, ringY = 0;
    document.addEventListener('mousemove', (e) => { mx = e.clientX; my = e.clientY; cursorDot.style.left = mx + 'px'; cursorDot.style.top = my + 'px'; });
    function animateRing() { ringX += (mx - ringX) * 0.12; ringY += (my - ringY) * 0.12; cursorRing.style.left = ringX + 'px'; cursorRing.style.top = ringY + 'px'; requestAnimationFrame(animateRing); }
    animateRing();
    document.querySelectorAll('.tilt-card, .review-card, .faq-item').forEach(el => {
      el.addEventListener('mouseenter', () => { cursorDot.classList.add('on-card'); cursorRing.classList.add('on-card'); });
      el.addEventListener('mouseleave', () => { cursorDot.classList.remove('on-card'); cursorRing.classList.remove('on-card'); });
    });
    document.querySelectorAll('.btn, .magnetic-btn, .filter-btn, .faq-question, .theme-toggle, .burger, .carousel-arrow').forEach(el => {
      el.addEventListener('mouseenter', () => { cursorDot.classList.add('on-btn'); cursorRing.classList.add('on-btn'); });
      el.addEventListener('mouseleave', () => { cursorDot.classList.remove('on-btn'); cursorRing.classList.remove('on-btn'); });
    });
  }

  // Click ripple
  document.querySelectorAll('.btn, .service-card, .portfolio-card, .review-card, .process-step, .faq-item').forEach(el => {
    el.style.position = el.style.position || 'relative';
    el.style.overflow = 'hidden';
    el.addEventListener('click', (e) => {
      const rect = el.getBoundingClientRect(), size = Math.max(rect.width, rect.height), ripple = document.createElement('span');
      ripple.className = 'ripple';
      ripple.style.width = ripple.style.height = size + 'px';
      ripple.style.left = (e.clientX - rect.left - size / 2) + 'px';
      ripple.style.top = (e.clientY - rect.top - size / 2) + 'px';
      el.appendChild(ripple);
      setTimeout(() => ripple.remove(), 600);
    });
  });

  // FAQ accordion
  document.querySelectorAll('.faq-question').forEach(btn => {
    btn.addEventListener('click', () => {
      const item = btn.closest('.faq-item'), isActive = item.classList.contains('active');
      document.querySelectorAll('.faq-item.active').forEach(i => i.classList.remove('active'));
      if (!isActive) item.classList.add('active');
    });
  });

  // Split text
  document.querySelectorAll('.split-text').forEach(el => {
    const fullText = el.textContent;
    el.innerHTML = '';
    let charCount = 0;
    fullText.split('').forEach(char => {
      const span = document.createElement('span');
      span.className = 'char';
      span.innerHTML = char === ' ' ? '&nbsp;' : char;
      if (char !== ' ') { span.classList.add('char-delay-' + Math.min(charCount % 16 + 1, 15)); charCount++; }
      el.appendChild(span);
    });
  });

  // Split text reveal
  const splitObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.querySelectorAll('.char').forEach((ch, i) => { setTimeout(() => ch.classList.add('visible'), i * 30); });
        splitObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });
  document.querySelectorAll('.split-text').forEach(el => splitObserver.observe(el));

  // Magnetic nav links
  if (isDesktop) {
    document.querySelectorAll('.nav-links a.magnetic').forEach(link => {
      link.addEventListener('mousemove', (e) => {
        const rect = link.getBoundingClientRect();
        link.style.transform = 'translate(' + ((e.clientX - rect.left - rect.width / 2) * 0.25) + 'px, ' + ((e.clientY - rect.top - rect.height / 2) * 0.25) + 'px)';
      });
      link.addEventListener('mouseleave', () => { link.style.transform = ''; });
    });
  }

  // Section reveals
  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
      }
    });
  }, { threshold: 0.05 });
  document.querySelectorAll('section').forEach(s => {
    if (s.id !== 'hero') {
      s.style.opacity = '0';
      s.style.transform = 'translateY(30px)';
      s.style.transition = 'opacity 0.8s cubic-bezier(0.16,1,0.3,1), transform 0.8s cubic-bezier(0.16,1,0.3,1)';
      sectionObserver.observe(s);
    }
  });

  // Text scramble on hover
  const scrambleChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%';
  document.querySelectorAll('[data-scramble]').forEach(el => {
    const original = el.textContent;
    el.addEventListener('mouseenter', () => {
      let iterations = 0;
      const interval = setInterval(() => {
        el.textContent = original.split('').map((char, i) => {
          if (i < iterations) return original[i];
          return scrambleChars[Math.floor(Math.random() * scrambleChars.length)];
        }).join('');
        iterations += 1 / 2;
        if (iterations >= original.length) { clearInterval(interval); el.textContent = original; }
      }, 30);
    });
  });

  // Scroll-linked animations
  const scrollLinkedEls = document.querySelectorAll('.scroll-linked');
  if (scrollLinkedEls.length) {
    window.addEventListener('scroll', () => {
      scrollLinkedEls.forEach(el => {
        const rect = el.getBoundingClientRect();
        const progress = Math.max(0, Math.min(1, 1 - (rect.top / window.innerHeight)));
        el.style.setProperty('--scroll-progress', progress);
      });
    }, { passive: true });
  }

  // Easter egg: triple click logo = confetti
  let logoClickCount = 0;
  let logoClickTimer = null;
  document.querySelectorAll('.logo').forEach(logo => {
    logo.addEventListener('click', (e) => {
      e.preventDefault();
      logoClickCount++;
      clearTimeout(logoClickTimer);
      logoClickTimer = setTimeout(() => { logoClickCount = 0; }, 600);
      if (logoClickCount >= 3) {
        logoClickCount = 0;
        launchConfetti();
      }
    });
  });

  function launchConfetti() {
    const colors = ['#7c3aed', '#6366f1', '#a855f7', '#22c55e', '#f59e0b', '#ef4444', '#ec4899'];
    for (let i = 0; i < 60; i++) {
      const piece = document.createElement('div');
      piece.className = 'confetti-piece';
      piece.style.background = colors[Math.floor(Math.random() * colors.length)];
      piece.style.left = Math.random() * 100 + 'vw';
      piece.style.top = '-10px';
      piece.style.width = (Math.random() * 6 + 4) + 'px';
      piece.style.height = (Math.random() * 8 + 6) + 'px';
      piece.style.animationDuration = (Math.random() * 1.5 + 1.5) + 's';
      piece.style.animationDelay = (Math.random() * 0.5) + 's';
      document.body.appendChild(piece);
      setTimeout(() => piece.remove(), 3000);
    }
  }

  // Keyboard navigation
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      if (mobileOverlay.classList.contains('active')) toggleMobileNav();
      document.querySelectorAll('.faq-item.active').forEach(i => i.classList.remove('active'));
    }
  });

  // Carousel
  const carouselTrack = document.getElementById('carouselTrack');
  if (carouselTrack) {
    const slides = carouselTrack.querySelectorAll('.carousel-slide');
    const dotsContainer = document.getElementById('carouselDots');
    let currentSlide = 0, autoPlayTimer;

    function getSlidesPerView() { return window.innerWidth >= 1024 ? 3 : 1; }

    function updateCarousel() {
      const perView = getSlidesPerView();
      const maxSlide = Math.max(0, slides.length - perView);
      currentSlide = Math.min(currentSlide, maxSlide);
      const offset = -(currentSlide * (100 / perView));
      carouselTrack.style.transform = 'translateX(' + offset + '%)';
      // Update dots
      if (dotsContainer) {
        dotsContainer.innerHTML = '';
        const dotCount = maxSlide + 1;
        for (let i = 0; i < dotCount; i++) {
          const dot = document.createElement('button');
          dot.className = 'carousel-dot' + (i === currentSlide ? ' active' : '');
          dot.addEventListener('click', () => { currentSlide = i; updateCarousel(); resetAutoPlay(); });
          dotsContainer.appendChild(dot);
        }
      }
    }

    function resetAutoPlay() {
      clearInterval(autoPlayTimer);
      autoPlayTimer = setInterval(() => {
        const perView = getSlidesPerView();
        const maxSlide = Math.max(0, slides.length - perView);
        currentSlide = currentSlide >= maxSlide ? 0 : currentSlide + 1;
        updateCarousel();
      }, 4000);
    }

    document.getElementById('carouselPrev').addEventListener('click', () => { currentSlide = Math.max(0, currentSlide - 1); updateCarousel(); resetAutoPlay(); });
    document.getElementById('carouselNext').addEventListener('click', () => {
      const perView = getSlidesPerView();
      const maxSlide = Math.max(0, slides.length - perView);
      currentSlide = currentSlide >= maxSlide ? 0 : currentSlide + 1;
      updateCarousel();
      resetAutoPlay();
    });

    updateCarousel();
    resetAutoPlay();
    window.addEventListener('resize', updateCarousel);

    // Touch swipe
    let touchStartX = 0;
    carouselTrack.addEventListener('touchstart', (e) => { touchStartX = e.touches[0].clientX; }, { passive: true });
    carouselTrack.addEventListener('touchend', (e) => {
      const diff = touchStartX - e.changedTouches[0].clientX;
      if (Math.abs(diff) > 50) {
        if (diff > 0) document.getElementById('carouselNext').click();
        else document.getElementById('carouselPrev').click();
      }
    }, { passive: true });
  }

  // Back to top
  const backToTop = document.getElementById('backToTop');
  const bttProgress = document.getElementById('bttProgress');
  if (backToTop) {
    const circumference = 2 * Math.PI * 22;
    window.addEventListener('scroll', () => {
      const h = document.documentElement.scrollHeight - window.innerHeight;
      const pct = h > 0 ? window.scrollY / h : 0;
      backToTop.classList.toggle('visible', window.scrollY > 500);
      if (bttProgress) bttProgress.style.strokeDashoffset = circumference * (1 - pct);
    }, { passive: true });
    backToTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

})();
