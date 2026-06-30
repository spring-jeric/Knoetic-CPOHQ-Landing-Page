/* ============================================================
   CPOHQ — interactions
   Lenis (smooth scroll) · GSAP + ScrollTrigger · Three.js
   ============================================================ */
(function () {
  'use strict';

  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isTouch = window.matchMedia('(hover: none)').matches;
  const hasGSAP = typeof gsap !== 'undefined';
  if (hasGSAP && typeof ScrollTrigger !== 'undefined') gsap.registerPlugin(ScrollTrigger);

  /* ---------------- Smooth scroll (Lenis) ---------------- */
  let lenis = null;
  if (!reduced && typeof Lenis !== 'undefined') {
    lenis = new Lenis({ duration: 1.15, smoothWheel: true, lerp: 0.1 });
    lenis.on('scroll', () => { if (hasGSAP) ScrollTrigger.update(); });
    if (hasGSAP) {
      gsap.ticker.add((t) => lenis.raf(t * 1000));
      gsap.ticker.lagSmoothing(0);
    } else {
      const raf = (t) => { lenis.raf(t); requestAnimationFrame(raf); };
      requestAnimationFrame(raf);
    }
  }
  // anchor links → lenis
  document.querySelectorAll('a[href^="#"]').forEach((a) => {
    a.addEventListener('click', (e) => {
      const id = a.getAttribute('href');
      if (id.length < 2) return;
      const target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      if (lenis) lenis.scrollTo(target, { offset: -70, duration: 1.3 });
      else target.scrollIntoView({ behavior: 'smooth' });
    });
  });

  /* ---------------- Split headline into words ---------------- */
  function splitWords(el) {
    const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
    const nodes = []; let n;
    while ((n = walker.nextNode())) nodes.push(n);
    nodes.forEach((node) => {
      const parts = node.textContent.split(/(\s+)/);
      const frag = document.createDocumentFragment();
      parts.forEach((p) => {
        if (p.trim() === '') { frag.appendChild(document.createTextNode(p)); return; }
        const w = document.createElement('span'); w.className = 'word';
        const i = document.createElement('span'); i.className = 'word-i'; i.textContent = p;
        w.appendChild(i); frag.appendChild(w);
      });
      node.parentNode.replaceChild(frag, node);
    });
    // keep italic <em> styling: wrap any <em> children words too
    return el.querySelectorAll('.word-i');
  }

  /* ---------------- Shared member roster (Unsplash, CORS-friendly) ---------------- */
  const uns = (id, w, h) => `https://images.unsplash.com/${id}?w=${w}&h=${h}&fit=crop&crop=faces&q=80`;
  const PEOPLE = [
    ['Kelli Dragovich', 'Supio', 'photo-1573496359142-b8d87734a5a2'],
    ['Heather Dunn', 'Brex', 'photo-1580489944761-15a19d654956'],
    ['Daniel Cho', 'Ramp', 'photo-1560250097-0b93528c311a'],
    ['Lynee Luque', 'NerdWallet', 'photo-1494790108377-be9c29b29330'],
    ['Sofia Marin', 'Notion', 'photo-1438761681033-6461ffad8d80'],
    ['James Okafor', 'Linear', 'photo-1507003211169-0a1dd7228f2d'],
    ['Priya Nair', 'Figma', 'photo-1544005313-94ddf0286df2'],
    ['Tomas Lind', 'Stripe', 'photo-1500648767791-00dcc994a43e'],
    ['Renee Park', 'Plaid', 'photo-1517841905240-472988babdf9'],
    ['Marcus Bell', 'Airtable', 'photo-1506794778202-cad84cf45f1d'],
    ['Hana Sato', 'Webflow', 'photo-1534528741775-53994a69daeb'],
    ['Owen Reed', 'Retool', 'photo-1519085360753-af0119f7cbe7'],
    ['Carla Diaz', 'Mercury', 'photo-1487412720507-e7ab37603c6f'],
    ['Leo Martens', 'Rippling', 'photo-1568602471122-7832951cc4c5'],
    ['Grace Liu', 'Gusto', 'photo-1573497019940-1c28c88b4f3e'],
    ['Amy Lavin', 'Vercel', 'photo-1556157382-97eda2d62296'],
  ];

  // verified CORS-enabled portrait pool for the hero visual (roster + extras)
  const GLOBE_IDS = PEOPLE.map((p) => p[2]).concat([
    'photo-1502685104226-ee32379fefbe', 'photo-1521119989659-a83eee488004', 'photo-1492562080023-ab3db95bfbce',
    'photo-1463453091185-61582044d556', 'photo-1488426862026-3ee34a7d66df', 'photo-1547425260-76bcadfb4f2c',
    'photo-1557862921-37829c790f19', 'photo-1558203728-00f45181dd84', 'photo-1564564321837-a57b7070ac4f',
    'photo-1573140247632-f8fd74997d5c', 'photo-1599566150163-29194dcaad36', 'photo-1607746882042-944635dfe10e',
    'photo-1545167622-3a6ac756afa4', 'photo-1546961329-78bef0414d7c', 'photo-1531123897727-8f129e1688ce',
    'photo-1519345182560-3f2917c472ef', 'photo-1500917293891-ef795e70e1f6', 'photo-1542909168-82c3e7fdca5c',
    'photo-1504257432389-52343af06ae3', 'photo-1487412947147-5cebf100ffc2', 'photo-1489980557514-251d61e3eeb6',
    'photo-1521146764736-56c929d59c83', 'photo-1524504388940-b1c1722653e1', 'photo-1531427186611-ecfd6d936c79',
    'photo-1535713875002-d1d0cf377fde', 'photo-1539571696357-5a69c17a67c6', 'photo-1548142813-c348350df52b',
    'photo-1552058544-f2b08422138a', 'photo-1551836022-d5d88e9218df', 'photo-1542596594-649edbc13630',
    'photo-1551024601-bec78aea704b', 'photo-1506919258185-6078bba55d2a', 'photo-1508214751196-bcfd4ca60f91',
    'photo-1499952127939-9bbf5af6c51c', 'photo-1534751516642-a1af1ef26a56',
  ]);

  // names/companies for hover tooltips (roster first, then plausible fillers)
  const HERO_FN = ['Alex', 'Jordan', 'Sam', 'Taylor', 'Morgan', 'Casey', 'Riley', 'Jamie', 'Avery', 'Quinn', 'Devon', 'Harper', 'Rowan', 'Skyler', 'Cameron', 'Drew', 'Emerson', 'Finley', 'Hayden', 'Kai', 'Logan', 'Noa', 'Parker', 'Reese', 'Sage', 'Tatum', 'Wren', 'Blake', 'Elliot', 'Gray', 'Isa', 'Jules', 'Nadia', 'Omar', 'Priya'];
  const HERO_LN = ['Carter', 'Bennett', 'Hughes', 'Foster', 'Reyes', 'Nguyen', 'Patel', 'Okafor', 'Sato', 'Marin', 'Bell', 'Diaz', 'Park', 'Lind', 'Cho', 'Dunn', 'Vance', 'Brooks', 'Cole', 'Frost', 'Greer', 'Hale', 'Iqbal', 'Jansen', 'Kerr', 'Lowe', 'Mejia', 'Novak', 'Ortiz', 'Pruitt', 'Rao', 'Stone', 'Tran', 'Wu', 'Underwood'];
  const HERO_CO = ['Datadog', 'Snowflake', 'Asana', 'Calendly', 'Loom', 'Front', 'Miro', 'Amplitude', 'Segment', 'Zapier', 'Twilio', 'Okta', 'Coda', 'HashiCorp', 'Instacart', 'Robinhood', 'Affirm', 'Chime', 'Carta', 'Gong', 'Outreach', 'Pendo', 'Rippling', 'Scale', 'Verkada', 'Zip', 'Anduril', 'Vanta', 'Ramp', 'Brex', 'Notion', 'Figma', 'Linear', 'Plaid', 'Gusto'];
  const PERSONS = GLOBE_IDS.map((id, i) => (i < PEOPLE.length)
    ? { name: PEOPLE[i][0], company: PEOPLE[i][1] }
    : { name: HERO_FN[i % HERO_FN.length] + ' ' + HERO_LN[(i * 5 + 3) % HERO_LN.length], company: HERO_CO[i % HERO_CO.length] });

  /* ---------------- Members wall (build cards) ---------------- */
  (function buildMembers() {
    const track = document.getElementById('members-track');
    if (!track) return;
    const quoteAfter = 4;
    PEOPLE.forEach(([name, company, id], i) => {
      if (i === quoteAfter) {
        const q = document.createElement('div');
        q.className = 'm-card m-quote';
        q.innerHTML = `<span class="m-quote-mark">&ldquo;</span>
          <p class="m-quote-text">The best room of people leaders I've ever been in.</p>
          <span class="m-quote-by">— past ELEVATE attendee</span>`;
        track.appendChild(q);
      }
      const card = document.createElement('div');
      card.className = 'm-card';
      card.innerHTML = `<img src="${uns(id, 400, 520)}" alt="${name}" loading="lazy"/>
        <span class="m-cap"><span class="m-name">${name}</span><span class="m-role">CPO @ ${company}</span></span>`;
      track.appendChild(card);
    });
  })();

  /* ---------------- Preloader ---------------- */
  let started = false;
  function startSite() {
    if (started) return; started = true;
    if (lenis) lenis.start();
    document.body.style.overflow = '';
    buildAnimations();
  }
  // Non-RAF failsafe: if the intro stalls (e.g. RAF throttled in a background
  // tab), force-reveal so the page is never permanently hidden.
  function forceReveal() {
    const pre = document.getElementById('preloader');
    if (pre) pre.style.display = 'none';
    startSite();
    if (hasGSAP) {
      gsap.set(['.hero-kicker', '.hero-sub', '.hero-cta', '.hero-meta', '.hero-backed'], { opacity: 1, y: 0 });
    }
    document.querySelectorAll('[data-reveal],[data-fade]').forEach((el) => { el.style.opacity = 1; });
    document.querySelectorAll('.reveal-text .word-i').forEach((el) => { el.style.transform = 'none'; });
  }

  if (hasGSAP && !reduced) {
    if (lenis) lenis.stop();
    document.body.style.overflow = 'hidden';
    const tl = gsap.timeline();
    tl.to('.pre-word', { y: 0, duration: 0.9, ease: 'expo.out' })
      .to('.pre-sub', { opacity: 1, duration: 0.6 }, '-=0.4')
      .to('.pre-bar span', { width: '100%', duration: 0.9, ease: 'power2.inOut' }, '-=0.5')
      .to('.preloader', { yPercent: -100, duration: 0.9, ease: 'expo.inOut' }, '+=0.15')
      .add(startSite, '-=0.5')
      .set('.preloader', { display: 'none' });
    setTimeout(forceReveal, 4500); // safety net only
  } else {
    forceReveal();
  }

  /* ---------------- Main GSAP build ---------------- */
  function buildAnimations() {
    if (!hasGSAP || reduced) { runConstellations(); return; }

    // hero headline reveal
    document.querySelectorAll('.reveal-text').forEach((el) => {
      const words = splitWords(el);
      gsap.to(words, {
        y: 0, duration: 1, ease: 'expo.out', stagger: 0.05,
        scrollTrigger: { trigger: el, start: 'top 85%' },
      });
    });

    // hero supporting elements
    gsap.set(['.hero-sub', '.hero-cta', '.hero-meta', '.hero-backed', '.hero-kicker'], { opacity: 0, y: 24 });
    gsap.to('.hero-kicker', { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out', delay: 0.2 });
    gsap.to(['.hero-sub', '.hero-cta', '.hero-meta', '.hero-backed'], { opacity: 1, y: 0, duration: 0.9, ease: 'power3.out', stagger: 0.1, delay: 0.55 });

    // generic reveals
    gsap.utils.toArray('[data-reveal]').forEach((el) => {
      gsap.fromTo(el, { opacity: 0, y: 40 }, {
        opacity: 1, y: 0, duration: 0.9, ease: 'power3.out',
        scrollTrigger: { trigger: el, start: 'top 88%' },
      });
    });
    gsap.utils.toArray('[data-fade]').forEach((el) => {
      gsap.fromTo(el, { opacity: 0, y: 20 }, {
        opacity: 1, y: 0, duration: 0.8, ease: 'power2.out',
        scrollTrigger: { trigger: el, start: 'top 90%' },
      });
    });

    // staggered grids
    gsap.utils.toArray('.feature-cards, .security-grid, .testimonials, .ways, .compare').forEach((grid) => {
      const items = grid.children;
      gsap.fromTo(items, { opacity: 0, y: 50 }, {
        opacity: 1, y: 0, duration: 0.9, ease: 'power3.out', stagger: 0.1,
        scrollTrigger: { trigger: grid, start: 'top 82%' },
      });
    });

    // hero parallax on scroll
    gsap.to('.hero-inner', { yPercent: 18, opacity: 0.55, ease: 'none',
      scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true } });

    // manifesto word-by-word color reveal (scrub)
    const man = document.getElementById('manifesto');
    if (man) {
      const text = man.textContent.trim();
      man.innerHTML = text.split(' ').map((w) => `<span class="mw">${w}</span>`).join(' ');
      gsap.fromTo(man.querySelectorAll('.mw'),
        { color: 'var(--muted)' },
        { color: 'var(--ink)', stagger: 1, ease: 'none',
          scrollTrigger: { trigger: man, start: 'top 75%', end: 'bottom 55%', scrub: true } });
    }

    // counters
    gsap.utils.toArray('[data-counter]').forEach((el) => {
      const end = parseFloat(el.dataset.counter);
      const obj = { v: 0 };
      ScrollTrigger.create({
        trigger: el, start: 'top 90%', once: true,
        onEnter: () => gsap.to(obj, { v: end, duration: 1.6, ease: 'power2.out',
          onUpdate: () => { el.textContent = Math.round(obj.v).toLocaleString(); } }),
      });
    });

    // benchmark bars
    gsap.utils.toArray('[data-bar]').forEach((el) => {
      gsap.fromTo(el, { width: '0%' }, { width: el.dataset.bar + '%', duration: 1.2, ease: 'power2.out',
        scrollTrigger: { trigger: el, start: 'top 92%' } });
    });

    // source list rows
    gsap.utils.toArray('[data-source]').forEach((el, i) => {
      gsap.fromTo(el, { opacity: 0, x: 24 }, { opacity: 1, x: 0, duration: 0.6, ease: 'power3.out', delay: i * 0.08,
        scrollTrigger: { trigger: '.record-card', start: 'top 80%' } });
    });

    // marquee infinite
    const mt = document.querySelector('.marquee-track');
    if (mt) {
      gsap.to(mt, { xPercent: -50, duration: 30, ease: 'none', repeat: -1 });
    }

    // members horizontal pin scroll
    const viewport = document.getElementById('members-viewport');
    const track = document.getElementById('members-track');
    if (viewport && track && window.innerWidth > 720) {
      const getScroll = () => track.scrollWidth - window.innerWidth + 64;
      gsap.to(track, {
        x: () => -getScroll(), ease: 'none',
        scrollTrigger: {
          trigger: '.members', start: 'top top', end: () => '+=' + getScroll(),
          pin: true, scrub: 1, invalidateOnRefresh: true,
        },
      });
    }

    // section-tint subtle parallax for atmosphere blobs
    gsap.to('.b1', { yPercent: 30, ease: 'none', scrollTrigger: { trigger: document.body, start: 'top top', end: 'bottom bottom', scrub: true } });
    gsap.to('.b2', { yPercent: -20, ease: 'none', scrollTrigger: { trigger: document.body, start: 'top top', end: 'bottom bottom', scrub: true } });

    runConstellations();
    ScrollTrigger.refresh();
  }

  /* ---------------- Header scrolled state + progress ---------------- */
  const header = document.getElementById('header');
  const progress = document.querySelector('.scroll-progress span');
  function onScroll() {
    const y = window.scrollY || document.documentElement.scrollTop;
    if (header) header.classList.toggle('scrolled', y > 30);
    if (progress) {
      const h = document.documentElement.scrollHeight - window.innerHeight;
      progress.style.width = (h > 0 ? (y / h) * 100 : 0) + '%';
    }
  }
  if (lenis) lenis.on('scroll', onScroll);
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------------- Custom cursor ---------------- */
  if (!isTouch && !reduced) {
    const cursor = document.querySelector('.cursor');
    const dot = document.querySelector('.cursor-dot');
    const ring = document.querySelector('.cursor-ring');
    let mx = innerWidth / 2, my = innerHeight / 2, rx = mx, ry = my;
    window.addEventListener('mousemove', (e) => {
      mx = e.clientX; my = e.clientY;
      dot.style.left = mx + 'px'; dot.style.top = my + 'px';
      const el = document.elementFromPoint(mx, my);
      cursor.classList.toggle('on-dark', !!(el && el.closest('.theme-dark')));
    });
    (function loop() {
      rx += (mx - rx) * 0.18; ry += (my - ry) * 0.18;
      ring.style.left = rx + 'px'; ring.style.top = ry + 'px';
      requestAnimationFrame(loop);
    })();
    document.querySelectorAll('a, button, [data-magnetic], summary, .agent-btn, .m-card').forEach((el) => {
      el.addEventListener('mouseenter', () => cursor.classList.add('is-hover'));
      el.addEventListener('mouseleave', () => cursor.classList.remove('is-hover'));
    });
  }

  /* ---------------- Magnetic buttons ---------------- */
  if (!isTouch && !reduced && hasGSAP) {
    document.querySelectorAll('[data-magnetic]').forEach((el) => {
      const strength = 0.4;
      el.addEventListener('mousemove', (e) => {
        const r = el.getBoundingClientRect();
        const x = (e.clientX - r.left - r.width / 2) * strength;
        const y = (e.clientY - r.top - r.height / 2) * strength;
        gsap.to(el, { x, y, duration: 0.4, ease: 'power3.out' });
      });
      el.addEventListener('mouseleave', () => gsap.to(el, { x: 0, y: 0, duration: 0.6, ease: 'elastic.out(1,0.4)' }));
    });
  }

  /* ---------------- Agents interaction ---------------- */
  (function agents() {
    const data = {
      cos: {
        author: 'AI Chief of Staff',
        q: 'What changed in the org this week?',
        a: 'Marketing has 2× the manager changes of any team this quarter. One top performer has had no comp change in 14 months.',
        s: [['Manager changes', 7, 'Marketing leads', 'danger'], ['Flagged comp gaps', 3, 'across teams', 'muted']],
      },
      talent: {
        author: 'Head of Talent Management',
        q: 'Who is at risk in Engineering?',
        a: 'Three engineers show elevated flight risk. HRBP sub-agents drafted retention plans for each, pending your review.',
        s: [['Flight risks', 3, 'in Engineering', 'danger'], ['Plans drafted', 3, 'ready to review', 'muted']],
      },
      analytics: {
        author: 'Head of People Analytics',
        q: 'How healthy is attrition this quarter?',
        a: 'Attrition is up 1.1 pts QoQ, concentrated in two teams. Analyst sub-agents traced 60% of it to comp compression.',
        s: [['Attrition QoQ', 11, 'up 1.1 pts', 'danger'], ['Comp-driven', 60, '% of exits', 'muted']],
      },
    };
    const btns = document.querySelectorAll('.agent-btn');
    const author = document.getElementById('chat-author');
    const q = document.getElementById('chat-q');
    const ans = document.getElementById('chat-answer');
    const stats = document.getElementById('chat-stats');
    btns.forEach((btn) => {
      btn.addEventListener('click', () => {
        const d = data[btn.dataset.agent];
        if (!d) return;
        btns.forEach((b) => b.classList.remove('is-active'));
        btn.classList.add('is-active');
        const anim = (el) => { if (hasGSAP && !reduced) gsap.fromTo(el, { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' }); };
        author.textContent = d.author; q.textContent = d.q; ans.textContent = d.a;
        stats.innerHTML = d.s.map(([label, val, sub, cls]) =>
          `<div class="chat-stat"><span class="stat-label">${label}</span><span class="stat-value">${val}</span><span class="stat-sub ${cls}">${sub}</span></div>`).join('');
        anim(q); anim(ans); anim(stats);
      });
    });
  })();

  /* ---------------- FAQ smooth accordion ---------------- */
  document.querySelectorAll('.faq').forEach((faq) => {
    const body = faq.querySelector('.faq-body');
    const summary = faq.querySelector('summary');
    summary.addEventListener('click', (e) => {
      if (reduced || !hasGSAP) return;
      e.preventDefault();
      if (faq.open) {
        gsap.to(body, { height: 0, duration: 0.35, ease: 'power2.inOut', onComplete: () => { faq.open = false; gsap.set(body, { height: 'auto' }); } });
      } else {
        // close siblings
        document.querySelectorAll('.faq[open]').forEach((o) => { if (o !== faq) { const b = o.querySelector('.faq-body'); gsap.to(b, { height: 0, duration: 0.3, onComplete: () => { o.open = false; gsap.set(b, { height: 'auto' }); } }); } });
        faq.open = true;
        gsap.from(body, { height: 0, duration: 0.4, ease: 'power2.out' });
      }
      if (lenis) setTimeout(() => ScrollTrigger && ScrollTrigger.refresh(), 450);
    });
  });

  /* ============================================================
     Three.js constellation
     ============================================================ */
  function makeConstellation(canvas, opts) {
    if (typeof THREE === 'undefined' || !canvas) return null;
    const o = Object.assign({ count: 600, radius: 30, linkDist: 6, color: 0x2f6bff, fog: 0xf4f7fe, rotate: 0.018,
      pointOpacity: 0.85, lineOpacity: 0.08, maxLinks: 900, size: 0.8 }, opts);

    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(o.fog, 0.022);
    const camera = new THREE.PerspectiveCamera(60, canvas.clientWidth / canvas.clientHeight, 0.1, 200);
    camera.position.z = 46;

    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // points distributed in a sphere shell
    const positions = new Float32Array(o.count * 3);
    const pts = [];
    for (let i = 0; i < o.count; i++) {
      const r = o.radius * (0.55 + Math.random() * 0.45);
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const x = r * Math.sin(phi) * Math.cos(theta);
      const y = r * Math.sin(phi) * Math.sin(theta) * 0.7;
      const z = r * Math.cos(phi);
      positions[i * 3] = x; positions[i * 3 + 1] = y; positions[i * 3 + 2] = z;
      pts.push(new THREE.Vector3(x, y, z));
    }
    const pGeo = new THREE.BufferGeometry();
    pGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    // soft round sprite so points read as glowing dots, not squares
    const sprite = (() => {
      const c = document.createElement('canvas'); c.width = c.height = 64;
      const x = c.getContext('2d');
      const g = x.createRadialGradient(32, 32, 0, 32, 32, 32);
      g.addColorStop(0, 'rgba(255,255,255,1)');
      g.addColorStop(0.35, 'rgba(255,255,255,0.85)');
      g.addColorStop(1, 'rgba(255,255,255,0)');
      x.fillStyle = g; x.beginPath(); x.arc(32, 32, 32, 0, Math.PI * 2); x.fill();
      return new THREE.CanvasTexture(c);
    })();
    const pMat = new THREE.PointsMaterial({ color: o.color, map: sprite, size: o.size, transparent: true, opacity: o.pointOpacity, depthWrite: false, sizeAttenuation: true });
    const points = new THREE.Points(pGeo, pMat);

    // links between nearby points (cap for perf)
    const linePos = []; let links = 0; const maxLinks = o.maxLinks;
    for (let i = 0; i < pts.length && links < maxLinks; i++) {
      for (let j = i + 1; j < pts.length && links < maxLinks; j++) {
        if (pts[i].distanceTo(pts[j]) < o.linkDist) {
          linePos.push(pts[i].x, pts[i].y, pts[i].z, pts[j].x, pts[j].y, pts[j].z);
          links++;
        }
      }
    }
    const lGeo = new THREE.BufferGeometry();
    lGeo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(linePos), 3));
    const lMat = new THREE.LineBasicMaterial({ color: o.color, transparent: true, opacity: o.lineOpacity });
    const lines = new THREE.LineSegments(lGeo, lMat);

    const group = new THREE.Group();
    group.add(points); group.add(lines);
    scene.add(group);

    let tx = 0, ty = 0, vis = true;
    function resize() {
      const w = canvas.clientWidth, h = canvas.clientHeight;
      if (canvas.width !== w || canvas.height !== h) {
        renderer.setSize(w, h, false);
        camera.aspect = w / h; camera.updateProjectionMatrix();
      }
    }
    const io = new IntersectionObserver((e) => { vis = e[0].isIntersecting; }, { threshold: 0 });
    io.observe(canvas);

    let raf;
    function animate() {
      raf = requestAnimationFrame(animate);
      if (!vis) return;
      resize();
      group.rotation.y += o.rotate * 0.01 + 0.0006;
      group.rotation.x += 0.0002;
      group.rotation.x += (ty * 0.25 - group.rotation.x) * 0.02;
      group.rotation.y += (tx * 0.25 - 0) * 0.0;
      camera.position.x += (tx * 6 - camera.position.x) * 0.04;
      camera.position.y += (-ty * 6 - camera.position.y) * 0.04;
      camera.lookAt(scene.position);
      renderer.render(scene, camera);
    }
    animate();

    return { setTarget(x, y) { tx = x; ty = y; }, destroy() { cancelAnimationFrame(raf); io.disconnect(); renderer.dispose(); } };
  }

  /* ============================================================
     Hero: swirling halo of member portraits (Three.js)
     ============================================================ */
  function roundRectPath(c, x, y, w, h, r) {
    c.beginPath();
    c.moveTo(x + r, y);
    c.arcTo(x + w, y, x + w, y + h, r);
    c.arcTo(x + w, y + h, x, y + h, r);
    c.arcTo(x, y + h, x, y, r);
    c.arcTo(x, y, x + w, y, r);
    c.closePath();
  }
  function coverDraw(c, img, w, h) {
    const ir = img.width / img.height, dr = w / h; let sw, sh, sx, sy;
    if (ir > dr) { sh = img.height; sw = sh * dr; sx = (img.width - sw) / 2; sy = 0; }
    else { sw = img.width; sh = sw / dr; sx = 0; sy = (img.height - sh) * 0.28; }
    c.drawImage(img, sx, sy, sw, sh, 0, 0, w, h);
  }
  const HUES = [212, 222, 234, 246, 258, 200];
  function paintTile(img, i, round) {
    const S = 168, r = 26;
    const cv = document.createElement('canvas'); cv.width = S; cv.height = S;
    const c = cv.getContext('2d');
    c.save();
    if (round) { c.beginPath(); c.arc(S / 2, S / 2, S / 2 - 2, 0, Math.PI * 2); c.clip(); }
    else { roundRectPath(c, 0, 0, S, S, r); c.clip(); }
    if (img) {
      coverDraw(c, img, S, S);
    } else {
      const h = HUES[i % HUES.length];
      const g = c.createLinearGradient(0, 0, S, S);
      g.addColorStop(0, `hsl(${h} 58% 66%)`); g.addColorStop(1, `hsl(${h + 16} 54% 48%)`);
      c.fillStyle = g; c.fillRect(0, 0, S, S);
    }
    if (!round) { // subtle bottom gradient for square sphere tiles
      const grad = c.createLinearGradient(0, S * 0.5, 0, S);
      grad.addColorStop(0, 'rgba(7,14,30,0)'); grad.addColorStop(1, 'rgba(7,14,30,.22)');
      c.fillStyle = grad; c.fillRect(0, 0, S, S);
    }
    c.restore();
    if (round) {
      c.beginPath(); c.arc(S / 2, S / 2, S / 2 - 1.5, 0, Math.PI * 2); c.lineWidth = 3; c.strokeStyle = 'rgba(255,255,255,.92)'; c.stroke();
      c.beginPath(); c.arc(S / 2, S / 2, S / 2 - 0.5, 0, Math.PI * 2); c.lineWidth = 1; c.strokeStyle = 'rgba(16,28,54,.16)'; c.stroke();
    } else {
      roundRectPath(c, 1, 1, S - 2, S - 2, r); c.lineWidth = 2; c.strokeStyle = 'rgba(255,255,255,.6)'; c.stroke();
      roundRectPath(c, 0.5, 0.5, S - 1, S - 1, r); c.lineWidth = 1; c.strokeStyle = 'rgba(16,28,54,.14)'; c.stroke();
    }
    const tex = new THREE.CanvasTexture(cv);
    if (THREE.sRGBEncoding) tex.encoding = THREE.sRGBEncoding;
    tex.anisotropy = 4;
    return tex;
  }

  function makeHeroVisual(canvas) {
    if (typeof THREE === 'undefined' || !canvas) return null;
    const ids = GLOBE_IDS;

    // orbit ring layout — concentric ellipses, increasing density outward
    // sparse rings so the dotted paths stay visible between avatars (orbit mode)
    const rings = [
      { r: 1.1, count: 3, speed: 0.20, dir: 1, z: 0.4 },
      { r: 1.95, count: 6, speed: 0.15, dir: -1, z: 0.2 },
      { r: 2.8, count: 8, speed: 0.115, dir: 1, z: 0.0 },
      { r: 3.5, count: 9, speed: 0.085, dir: -1, z: -0.2 },
      { r: 4.1, count: 10, speed: 0.065, dir: 1, z: -0.4 },
    ];
    const ringSlots = [];
    rings.forEach((rg, ri) => { for (let k = 0; k < rg.count; k++) ringSlots.push({ rg, ri, k }); });
    const N = 96;                        // dense sphere; only ringSlots.length show in orbit
    const SPHERE_R = 2.85;
    const SPHERE_CX = -0.7;               // nudge the sphere left (more right-edge margin, still clear of the copy)
    const ORBIT_YS = 1.0;                 // true circular orbits
    const ORBIT_RSCALE = 1.2;             // bigger rings so only part of the orbit is in frame
    const ORBIT_CX = 0.8, ORBIT_CY = -1.1; // relative to the right-shifted visual center (partial orbit)

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 100);
    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    if (THREE.sRGBEncoding) renderer.outputEncoding = THREE.sRGBEncoding;

    const viz = new THREE.Group(); scene.add(viz);   // offset into the right half on desktop
    let vizOffX = 0;

    const geo = new THREE.PlaneGeometry(0.56, 0.56);
    const golden = Math.PI * (3 - Math.sqrt(5));
    const tiles = [];

    for (let i = 0; i < N; i++) {
      // sphere base (unit)
      const yy = 1 - (i / (N - 1)) * 2;
      const rad = Math.sqrt(Math.max(0, 1 - yy * yy));
      const th = golden * i;
      const sBase = new THREE.Vector3(Math.cos(th) * rad, yy, Math.sin(th) * rad);
      // orbit slot (only the first ringSlots.length tiles appear in orbit)
      const slot = ringSlots[i] || null;
      const oAngle = slot ? (slot.k / slot.rg.count) * Math.PI * 2 + slot.ri * 0.6 : 0;
      // size + scatter target
      const sv = 0.74 + Math.random() * 0.6;
      // bias the dispersal up & to the right so tiles exit away from the copy
      const scatter = sBase.clone().multiplyScalar(7 + Math.random() * 7)
        .add(new THREE.Vector3(3.5 + Math.random() * 7, 1.5 + (Math.random() - 0.5) * 7, (Math.random() - 0.5) * 6));

      // two textures: square (sphere) + circle (orbit), crossfaded by morph
      const sqMat = new THREE.MeshBasicMaterial({ map: paintTile(null, i, false), transparent: true, depthWrite: false });
      const ciMat = new THREE.MeshBasicMaterial({ map: paintTile(null, i, true), transparent: true, depthWrite: false });
      [sqMat, ciMat].forEach((mm) => { if (mm.map && THREE.sRGBEncoding) mm.map.encoding = THREE.sRGBEncoding; });
      const mSq = new THREE.Mesh(geo, sqMat); const mCi = new THREE.Mesh(geo, ciMat);
      mSq.renderOrder = 2; mCi.renderOrder = 2;   // faces render above the dotted rings
      mCi.visible = false;
      viz.add(mSq); viz.add(mCi);
      const tile = { mSq, mCi, sqMat, ciMat, sBase, rg: slot ? slot.rg : null, oAngle, inOrbit: !!slot, sv, scatter, person: PERSONS[i % GLOBE_IDS.length] };
      mSq.__tile = tile; mCi.__tile = tile;
      tiles.push(tile);

      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => {
        const o1 = sqMat.map, o2 = ciMat.map;
        sqMat.map = paintTile(img, i, false); ciMat.map = paintTile(img, i, true);
        if (THREE.sRGBEncoding) { sqMat.map.encoding = THREE.sRGBEncoding; ciMat.map.encoding = THREE.sRGBEncoding; }
        sqMat.needsUpdate = true; ciMat.needsUpdate = true;
        if (o1) o1.dispose(); if (o2) o2.dispose();
      };
      img.src = `https://images.unsplash.com/${ids[i % ids.length]}?w=168&h=168&fit=crop&crop=faces&q=72`;
    }

    // round dot sprite (for orbit guide + accent dots)
    const dotSprite = (() => {
      const cc = document.createElement('canvas'); cc.width = cc.height = 64; const x = cc.getContext('2d');
      x.fillStyle = '#fff'; x.beginPath(); x.arc(32, 32, 29, 0, Math.PI * 2); x.fill();   // solid, crisp edge
      const t = new THREE.CanvasTexture(cc);
      t.minFilter = THREE.LinearFilter; t.magFilter = THREE.LinearFilter; t.generateMipmaps = false;
      return t;
    })();

    // dotted concentric rings (gray)
    const ringDotMats = [];
    rings.forEach((rg) => {
      const R = rg.r * ORBIT_RSCALE;
      const cnt = Math.max(70, Math.round((2 * Math.PI * R) / 0.17));
      const pos = [];
      for (let s = 0; s < cnt; s++) { const a = (s / cnt) * Math.PI * 2; pos.push(Math.cos(a) * R + ORBIT_CX, Math.sin(a) * R * ORBIT_YS + ORBIT_CY, rg.z); }
      const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
      const m = new THREE.PointsMaterial({ color: 0x66738c, map: dotSprite, size: 0.12, transparent: true, opacity: 0, depthWrite: false, sizeAttenuation: true });
      const p = new THREE.Points(g, m); p.renderOrder = 0; viz.add(p); ringDotMats.push(m);
    });

    // accent dots on the rings (blue + near-black)
    function accentDots(color, size, n) {
      const pos = [];
      for (let k = 0; k < n; k++) {
        const rg = rings[1 + Math.floor(Math.random() * (rings.length - 1))];
        const a = Math.random() * Math.PI * 2;
        const R = rg.r * ORBIT_RSCALE;
        pos.push(Math.cos(a) * R + ORBIT_CX, Math.sin(a) * R * ORBIT_YS + ORBIT_CY, rg.z + 0.03);
      }
      const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
      const m = new THREE.PointsMaterial({ color, map: dotSprite, size, transparent: true, opacity: 0, depthWrite: false, sizeAttenuation: true });
      const p = new THREE.Points(g, m); p.renderOrder = 1; viz.add(p); return m;
    }
    const accentBlue = accentDots(0x2f6bff, 0.34, 7);
    const accentDark = accentDots(0x0b1a33, 0.28, 5);

    // ---- hover: glow halo + tooltip + reactive rings ----
    const glowTex = (() => {
      const cc = document.createElement('canvas'); cc.width = cc.height = 128; const x = cc.getContext('2d');
      const g = x.createRadialGradient(64, 64, 0, 64, 64, 64);
      g.addColorStop(0, 'rgba(47,107,255,0.5)'); g.addColorStop(0.5, 'rgba(47,107,255,0.18)'); g.addColorStop(1, 'rgba(47,107,255,0)');
      x.fillStyle = g; x.fillRect(0, 0, 128, 128);
      return new THREE.CanvasTexture(cc);
    })();
    const glowMesh = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), new THREE.MeshBasicMaterial({ map: glowTex, transparent: true, opacity: 0, depthWrite: false }));
    glowMesh.renderOrder = 1; glowMesh.visible = false; viz.add(glowMesh);

    const tip = document.createElement('div'); tip.className = 'hero-tip';
    tip.innerHTML = '<span class="tip-name"></span><span class="tip-role"></span>';
    (canvas.parentNode || document.body).appendChild(tip);
    const tipName = tip.querySelector('.tip-name'), tipRole = tip.querySelector('.tip-role');

    const raycaster = new THREE.Raycaster();
    const ndc = new THREE.Vector2(); let ndcActive = false;
    let hovered = null, hoverAmt = 0, hoveredRing = -1;
    const tmpV = new THREE.Vector3();
    if (!isTouch && !reduced) {
      window.addEventListener('mousemove', (e) => {
        const r = canvas.getBoundingClientRect();
        const mx = e.clientX - r.left, my = e.clientY - r.top;
        if (mx < 0 || my < 0 || mx > r.width || my > r.height) { ndcActive = false; return; }
        ndc.x = (mx / r.width) * 2 - 1; ndc.y = -(my / r.height) * 2 + 1; ndcActive = true;
      });
    }

    let morph = 0, scatter = 0, tx = 0, ty = 0, vis = true, t = 0, last = performance.now();
    const smooth = (x) => x * x * (3 - 2 * x);

    function fitCamera() {
      const w = canvas.clientWidth, h = canvas.clientHeight;
      camera.aspect = w / h;
      const need = 4.7;                  // half-extent that must always fit (no cutoff)
      const tan = Math.tan(THREE.MathUtils.degToRad(camera.fov) / 2);
      camera.position.z = Math.max(need / tan, need / (tan * camera.aspect));
      camera.updateProjectionMatrix();
      // shift the visual into the right half on wide (desktop) canvases
      const halfH = camera.position.z * tan;
      const halfW = halfH * camera.aspect;
      vizOffX = camera.aspect > 1.25 ? Math.max(0, halfW - 3.1) : 0;
      viz.position.x = vizOffX;
    }
    function resize() {
      const w = canvas.clientWidth, h = canvas.clientHeight;
      if (canvas.width !== w || canvas.height !== h) { renderer.setSize(w, h, false); fitCamera(); }
    }

    function frame() {
      const now = performance.now(); const dt = Math.min(0.05, (now - last) / 1000); last = now; t += dt;
      resize();
      const spin = t * 0.045;
      const cs = Math.cos(spin), sn = Math.sin(spin);
      const sEff = scatter * (1 - morph);   // scatter only applies to the sphere, never the orbit
      const es = smooth(sEff);
      const fadeStart = 0.3;
      const camQ = camera.quaternion;
      const baseFade = sEff <= fadeStart ? 1 : Math.max(0, 1 - (sEff - fadeStart) / (1 - fadeStart));
      viz.position.y = es * 2.2;            // sphere lifts away as it scatters
      for (let i = 0; i < tiles.length; i++) {
        const tl = tiles[i];
        // sphere (rotated around Y)
        const bx = tl.sBase.x * SPHERE_R, by = tl.sBase.y * SPHERE_R, bz = tl.sBase.z * SPHERE_R;
        const sx = bx * cs + bz * sn + SPHERE_CX, sz = -bx * sn + bz * cs, sy = by;
        // orbit (circular, per-ring spin) — non-orbit tiles collapse toward center & fade
        let ox, oy, oz;
        if (tl.rg) { const oa = tl.oAngle + tl.rg.dir * t * tl.rg.speed; const R = tl.rg.r * ORBIT_RSCALE; ox = Math.cos(oa) * R + ORBIT_CX; oy = Math.sin(oa) * R * ORBIT_YS + ORBIT_CY; oz = tl.rg.z; }
        else { ox = ORBIT_CX + tl.sBase.x * 0.25; oy = ORBIT_CY + tl.sBase.y * 0.25; oz = tl.sBase.z * 0.12; }
        // blend sphere↔orbit, then scatter outward (sphere only)
        let px = sx + (ox - sx) * morph, py = sy + (oy - sy) * morph, pz = sz + (oz - sz) * morph;
        px += (tl.scatter.x - px) * es; py += (tl.scatter.y - py) * es; pz += (tl.scatter.z - pz) * es;
        const sc = tl.sv * (1 - morph * 0.16) * (1 + es * 0.5);
        tl.mSq.position.set(px, py, pz); tl.mSq.quaternion.copy(camQ); tl.mSq.scale.setScalar(sc);
        tl.mCi.position.set(px, py, pz); tl.mCi.quaternion.copy(camQ); tl.mCi.scale.setScalar(sc);
        tl.sqMat.opacity = baseFade * (1 - morph);
        tl.ciMat.opacity = tl.inOrbit ? baseFade * morph : 0;
        tl.mSq.visible = baseFade > 0.01 && morph < 0.985;
        tl.mCi.visible = tl.inOrbit && baseFade > 0.01 && morph > 0.015;
      }
      const dec = morph * (1 - es);
      accentBlue.opacity = dec * 1.0;
      accentDark.opacity = dec * 0.95;

      // ---- hover detection + effects ----
      if (ndcActive && es < 0.3) {
        raycaster.setFromCamera(ndc, camera);
        const meshes = [];
        for (let i = 0; i < tiles.length; i++) {
          const tl = tiles[i];
          const am = morph < 0.5 ? tl.mSq : tl.mCi;
          const op = morph < 0.5 ? tl.sqMat.opacity : tl.ciMat.opacity;
          if (am.visible && op > 0.5) meshes.push(am);
        }
        const hits = raycaster.intersectObjects(meshes, false);
        hovered = hits.length ? hits[0].object.__tile : null;
      } else { hovered = null; }
      hoveredRing = (hovered && hovered.rg) ? rings.indexOf(hovered.rg) : -1;
      hoverAmt += ((hovered ? 1 : 0) - hoverAmt) * 0.2;

      // per-ring dotted lines (highlight the hovered avatar's ring)
      for (let i = 0; i < ringDotMats.length; i++) {
        const isHi = i === hoveredRing;
        const base = hoveredRing >= 0 ? (isHi ? 1.0 : 0.45) : 0.9;
        ringDotMats[i].opacity = dec * base;
        ringDotMats[i].size = isHi ? 0.16 : 0.12;
      }

      if (hovered) {
        const am = morph < 0.5 ? hovered.mSq : hovered.mCi;
        glowMesh.visible = true;
        glowMesh.position.set(am.position.x, am.position.y, am.position.z - 0.02);
        glowMesh.quaternion.copy(camQ);
        glowMesh.scale.setScalar(am.scale.x * (2.5 + hoverAmt * 0.3));
        glowMesh.material.opacity = hoverAmt * 0.9;
        am.scale.multiplyScalar(1 + hoverAmt * 0.18);   // gentle pop
        am.getWorldPosition(tmpV).project(camera);
        tip.style.left = ((tmpV.x + 1) / 2) * canvas.clientWidth + 'px';
        tip.style.top = ((1 - tmpV.y) / 2) * canvas.clientHeight - am.scale.x * 14 + 'px';
        tipName.textContent = hovered.person.name;
        tipRole.textContent = 'CPO · ' + hovered.person.company;
        tip.classList.add('show');
      } else {
        glowMesh.material.opacity = hoverAmt * 0.9;
        if (hoverAmt < 0.02) { glowMesh.visible = false; tip.classList.remove('show'); }
      }

      camera.position.x += (tx * 0.9 - camera.position.x) * 0.04;
      camera.position.y += (-ty * 0.7 - camera.position.y) * 0.04;
      camera.lookAt(0, 0, 0);
      renderer.render(scene, camera);
    }

    const io = new IntersectionObserver((e) => { vis = e[0].isIntersecting; }, { threshold: 0 });
    io.observe(canvas);
    let raf;
    fitCamera();
    (function loop() { raf = requestAnimationFrame(loop); if (vis) frame(); })();
    canvas.__forceRender = () => { last = performance.now(); frame(); };
    canvas.__dbg = { morph: (v) => { morph = v; }, scatter: (v) => { scatter = v; } };

    return {
      setScatter(v) { scatter = Math.max(0, Math.min(1, v)); },
      setMode(mode) {
        const target = mode === 'orbit' ? 1 : 0;
        if (typeof gsap !== 'undefined' && !reduced) {
          gsap.to({ v: morph }, { v: target, duration: 1.25, ease: 'power3.inOut', onUpdate() { morph = this.targets()[0].v; } });
        } else { morph = target; }
      },
      setTarget(x, y) { tx = x; ty = y; },
      destroy() { cancelAnimationFrame(raf); io.disconnect(); renderer.dispose(); },
    };
  }

  function runConstellations() {
    let hero = null;
    const buildHero = () => {
      hero = makeHeroVisual(document.getElementById('hero-stage'));
      if (!hero) return;
      // floating version switcher
      const sw = document.querySelector('.hero-switch');
      if (sw) {
        sw.querySelectorAll('.switch-opt').forEach((btn) => {
          btn.addEventListener('click', () => {
            const mode = btn.dataset.mode;
            sw.querySelectorAll('.switch-opt').forEach((b) => b.classList.toggle('is-active', b === btn));
            sw.classList.toggle('is-orbit', mode === 'orbit');
            hero.setMode(mode);
          });
        });
      }
      // scroll scatter (sphere dissolves into space as you leave the hero)
      if (hasGSAP && !reduced) {
        ScrollTrigger.create({ trigger: '.hero', start: 'top top', end: 'bottom top', scrub: 0.5, onUpdate: (s) => hero.setScatter(s.progress) });
      }
    };
    if (document.fonts && document.fonts.ready) {
      let done = false;
      document.fonts.ready.then(() => { if (!done) { done = true; buildHero(); } });
      setTimeout(() => { if (!done) { done = true; buildHero(); } }, 2500); // fallback
    } else { buildHero(); }

    const cta = makeConstellation(document.getElementById('cta-constellation'), {
      count: 300, radius: 26, linkDist: 5.5, color: 0x9DBEFF,
      pointOpacity: 0.9, lineOpacity: 0.16, maxLinks: 600, size: 0.8, fog: 0x0a1730,
    });
    if (!isTouch) {
      window.addEventListener('mousemove', (e) => {
        const x = (e.clientX / window.innerWidth - 0.5);
        const y = (e.clientY / window.innerHeight - 0.5);
        if (hero) hero.setTarget(x, y);
        if (cta) cta.setTarget(x, y);
      });
    }
  }

  // keep ScrollTrigger correct after full load (images/fonts)
  window.addEventListener('load', () => { if (hasGSAP && !reduced) ScrollTrigger.refresh(); });
})();
