/* ============================================================
   CONFIG — edit these values to personalize the invitation.
   Everything guest-facing pulls from this single object.
   ============================================================ */
const CONFIG = {
  bride: "Rameesa",
  brideParents: "Daughter of Mr. & Mrs. [Bride's Parents]",
  groom: "Sabeel",
  groomParents: "Son of Mr. & Mrs. [Groom's Parents]",
  weddingDateISO: "2026-08-16T12:00:00",   // used by the countdown — keep this accurate
  hijriDate: "3 Rabi' al-Awwal 1448 AH",

  wedding: {
    label: "Wedding Ceremony",
    date: "16 August 2026",
    time: "12:00 PM",
    venue: "Creative Venue",
    location: "Kavanur"
  },

  mapEmbedSrc: "https://www.google.com/maps?q=Creative+Venue,11.1963772,76.0665957&output=embed",
  mapLink: "https://maps.app.goo.gl/2pbwLchF8HEzUQCT6",

  welcomeVerseArabic: "وَخَلَقْنَاكُمْ أَزْوَاجًا",
  welcomeVerseEnglish: "And We created you in pairs.",

  closingArabic: "بَارَكَ اللَّهُ لَكُمَا",
  closingEnglish: "May Allah bless you both.",

  musicSrc: "audio/bg_music.mp3"
};

/* ============================================================
   LENIS SMOOTH SCROLL
   ============================================================ */
let lenis;
function initLenis(){
  lenis = new Lenis({
    duration: 1.15,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smoothWheel: true,
  });
  function raf(time){ lenis.raf(time); requestAnimationFrame(raf); }
  requestAnimationFrame(raf);
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((time)=>{ lenis.raf(time * 1000); });
  gsap.ticker.lagSmoothing(0);
}
function lenisStop(){ lenis && lenis.stop(); }
function lenisStart(){ lenis && lenis.start(); }

/* ============================================================
   PRELOADER -> ENVELOPE
   ============================================================ */
window.addEventListener('DOMContentLoaded', () => {
  gsap.registerPlugin(ScrollTrigger);
  initLenis();
  populateConfig();
  initCursor();
  initPetals();
  initNav();
  initCountdown();
  initMoments();
  initRSVP();
  initWishes();
  initMusicToggle();
  initBackToTop();
  initHeroReveal();
  initDetailReveals();

  const preloader = document.getElementById('preloader');
  window.setTimeout(() => {
    gsap.to(preloader, {
      opacity: 0, duration: .8, ease: 'power2.out',
      onComplete: () => { preloader.style.display = 'none'; }
    });
  }, 2200);
});

/* ============================================================
   POPULATE TEXT FROM CONFIG
   ============================================================ */
function populateConfig(){
  document.querySelectorAll('[data-cfg]').forEach(el => {
    const path = el.getAttribute('data-cfg').split('.');
    let val = CONFIG;
    for (const p of path) val = val?.[p];
    if (val !== undefined) el.textContent = val;
  });
  const map = document.getElementById('venue-map');
  if (map) map.src = CONFIG.mapEmbedSrc;
  const mapBtn = document.getElementById('venue-map-btn');
  if (mapBtn) mapBtn.href = CONFIG.mapLink;
  const audio = document.getElementById('bg-audio');
  if (audio) audio.src = CONFIG.musicSrc;
  document.title = `${CONFIG.groom} & ${CONFIG.bride} — Wedding Invitation`;
}

/* ============================================================
   ENVELOPE INTERACTION
   ============================================================ */
const envelope = document.getElementById('envelope');
const envelopeScreen = document.getElementById('envelope-screen');
const welcomeScreen = document.getElementById('welcome-screen');
const guestNameInput = document.getElementById('guest-name-input');
const openInvitationBtn = document.getElementById('open-invitation-btn');
const guestLine = document.getElementById('guest-line');
let musicStarted = false;

envelope?.addEventListener('click', (e) => {
  if (envelope.classList.contains('open')) return;
  envelope.classList.add('open');
  startMusicOnce();
});

openInvitationBtn?.addEventListener('click', (e) => {
  e.stopPropagation();
  const name = (guestNameInput.value || '').trim();
  if (name) {
    try { localStorage.setItem('guestName', name); } catch(err){}
    if (guestLine) guestLine.textContent = `You're viewing this invitation as ${name}`;
  }
  startMusicOnce();
  gsap.to(envelopeScreen, {
    opacity: 0, duration: .7, ease:'power2.out',
    onComplete: () => {
      envelopeScreen.style.display = 'none';
      showWelcomeScreen();
    }
  });
});

function showWelcomeScreen(){
  welcomeScreen.style.display = 'flex';
  gsap.fromTo(welcomeScreen, {opacity:0}, {opacity:1, duration:.8, ease:'power2.out'});
  const tl = gsap.timeline({delay: .3});
  tl.from('#welcome-screen .verse-ar', {y:20, opacity:0, duration:1, ease:'power3.out'})
    .from('#welcome-screen .verse-en', {y:14, opacity:0, duration:.9, ease:'power3.out'}, '-=.5')
    .from('#welcome-screen .guest-line', {opacity:0, duration:.8}, '-=.4');

  window.setTimeout(() => {
    gsap.to(welcomeScreen, {
      opacity:0, duration:.8, ease:'power2.inOut',
      onComplete: () => { welcomeScreen.style.display = 'none'; }
    });
  }, 3600);
}

function startMusicOnce(){
  if (musicStarted) return;
  musicStarted = true;
  const audio = document.getElementById('bg-audio');
  if (!audio) return;
  audio.volume = 0.5;
  audio.play().then(() => {
    document.getElementById('music-toggle')?.classList.add('playing');
    updateMusicIcon(true);
  }).catch(() => { /* file may be missing — fails silently */ });
}

/* ============================================================
   CUSTOM CURSOR
   ============================================================ */
function initCursor(){
  if (window.matchMedia('(hover: none)').matches) return;
  const dot = document.createElement('div'); dot.className = 'cursor-dot';
  const ring = document.createElement('div'); ring.className = 'cursor-ring';
  document.body.append(dot, ring);
  let mx=0,my=0, rx=0, ry=0;
  window.addEventListener('mousemove', (e)=>{ mx=e.clientX; my=e.clientY; dot.style.left=mx+'px'; dot.style.top=my+'px'; });
  gsap.ticker.add(()=>{
    rx += (mx-rx) * .16; ry += (my-ry) * .16;
    ring.style.left = rx+'px'; ring.style.top = ry+'px';
  });
  document.querySelectorAll('a, button, .moment-photo, input, textarea, select').forEach(el=>{
    el.addEventListener('mouseenter', ()=> ring.classList.add('hovered'));
    el.addEventListener('mouseleave', ()=> ring.classList.remove('hovered'));
  });
}

/* ============================================================
   FLOATING PETALS
   ============================================================ */
function initPetals(){
  const layer = document.getElementById('petal-layer');
  if (!layer) return;
  const count = window.innerWidth < 700 ? 10 : 18;
  for (let i=0;i<count;i++){
    const p = document.createElement('div');
    p.className = 'petal';
    const size = 8 + Math.random()*10;
    p.style.width = size+'px'; p.style.height = size+'px';
    p.style.left = Math.random()*100 + 'vw';
    p.style.background = Math.random() > .5 ? 'var(--gold-soft)' : 'var(--sage)';
    layer.appendChild(p);
    animatePetal(p);
  }
}
function animatePetal(p){
  const duration = 10 + Math.random()*12;
  const delay = Math.random()*8;
  gsap.fromTo(p,
    { y: -20, x: 0, rotate: 0, opacity: 0 },
    {
      y: window.innerHeight + 40,
      x: (Math.random()-.5) * 160,
      rotate: 360 * (Math.random() > .5 ? 1 : -1),
      opacity: .55,
      duration, delay, ease: 'none',
      onComplete: () => { gsap.set(p, {y:-20}); animatePetal(p); }
    }
  );
}

/* ============================================================
   NAV — reveal after hero, active-section highlight
   ============================================================ */
function initNav(){
  const nav = document.getElementById('site-nav');
  const hero = document.getElementById('hero');
  if (!nav || !hero) return;
  ScrollTrigger.create({
    trigger: hero, start: 'bottom top+=80',
    onEnter: () => nav.classList.add('visible'),
    onLeaveBack: () => nav.classList.remove('visible'),
  });
  const links = nav.querySelectorAll('a');
  links.forEach(link => {
    const id = link.getAttribute('href').replace('#','');
    const target = document.getElementById(id);
    if (!target) return;
    ScrollTrigger.create({
      trigger: target, start: 'top center', end: 'bottom center',
      onToggle: (self) => { if (self.isActive) { links.forEach(l=>l.classList.remove('active')); link.classList.add('active'); } }
    });
    link.addEventListener('click', (e) => {
      e.preventDefault();
      lenis.scrollTo(target, { offset: -20 });
    });
  });
}

/* ============================================================
   HERO REVEAL
   ============================================================ */
function initHeroReveal(){
  gsap.from('#hero .names', { y: 40, opacity:0, duration: 1.4, ease:'power3.out', delay: .4 });
  gsap.from('#hero .date', { y: 20, opacity:0, duration: 1.2, ease:'power3.out', delay: .9 });
  gsap.from('#hero .scroll-cue', { opacity:0, duration: 1, delay: 1.4 });
}

/* ============================================================
   DETAIL CARD + generic fade-up reveals via ScrollTrigger
   ============================================================ */
function initDetailReveals(){
  gsap.utils.toArray('.detail-card').forEach((card, i) => {
    gsap.from(card, {
      y: 50, opacity: 0, duration: 1, ease: 'power3.out',
      scrollTrigger: { trigger: card, start: 'top 85%' },
      delay: i * 0.08
    });
  });
  gsap.utils.toArray('.reveal-up').forEach((el) => {
    gsap.from(el, {
      y: 40, opacity: 0, duration: 1, ease: 'power3.out',
      scrollTrigger: { trigger: el, start: 'top 88%' }
    });
  });
}

/* ============================================================
   COUNTDOWN
   ============================================================ */
function initCountdown(){
  const target = new Date(CONFIG.weddingDateISO).getTime();
  const els = {
    d: document.getElementById('cd-days'),
    h: document.getElementById('cd-hours'),
    m: document.getElementById('cd-mins'),
    s: document.getElementById('cd-secs'),
  };
  if (!els.d) return;
  function tick(){
    const now = Date.now();
    let diff = Math.max(0, target - now);
    const d = Math.floor(diff / 86400000);
    const h = Math.floor((diff % 86400000) / 3600000);
    const m = Math.floor((diff % 3600000) / 60000);
    const s = Math.floor((diff % 60000) / 1000);
    setNum(els.d, d); setNum(els.h, h); setNum(els.m, m); setNum(els.s, s);
  }
  function setNum(el, val){
    const str = String(val).padStart(2,'0');
    if (el.textContent !== str){ el.textContent = str; }
  }
  tick();
  setInterval(tick, 1000);
}

/* ============================================================
   MOMENTS — scroll-locked photo book (signature interaction)
   ============================================================ */
function initMoments(){
  const section = document.getElementById('moments');
  const stage = document.getElementById('moments-stage');
  const dotsWrap = document.getElementById('moments-progress');
  if (!section || !stage) return;

  const photos = Array.from(stage.querySelectorAll('.moment-photo'));
  const total = photos.length;
  let index = 0;          // how many photos have been "turned" past
  let locked = false;     // is the section currently capturing scroll
  let finished = false;   // has the sequence completed once
  let animating = false;

  // build progress dots
  photos.forEach((_, i) => {
    const dot = document.createElement('div');
    dot.className = 'dot' + (i === 0 ? ' active' : '');
    dotsWrap.appendChild(dot);
  });
  const dots = Array.from(dotsWrap.children);

  // initial stacked state
  photos.forEach((p, i) => {
    const offset = (total - 1 - i);
    gsap.set(p, {
      zIndex: total - i,
      x: (i % 2 === 0 ? -1 : 1) * offset * 5,
      y: offset * 6,
      rotate: (i % 2 === 0 ? -1 : 1) * (offset * 2.2),
      scale: 1 - offset * 0.015,
      filter: 'blur(0px)',
      opacity: 1
    });
  });

  function updateDots(){
    dots.forEach((d,i) => d.classList.toggle('active', i === Math.min(index, total-1)));
  }

  function turnNext(){
    if (animating || index >= total) return;
    animating = true;
    const current = photos[index];
    gsap.to(current, {
      y: '-=120', opacity: 0, scale: 1.06, rotate: 0, filter: 'blur(6px)',
      duration: .7, ease: 'power3.in',
      onComplete: () => {
        index += 1;
        updateDots();
        animating = false;
        if (index >= total) finishSequence();
      }
    });
    // bring next photo forward slightly for anticipation
    const next = photos[index+1];
    if (next){
      gsap.to(next, { scale: '+=0.02', duration:.5, ease:'power2.out' });
    }
  }

  function turnPrev(){
    if (animating || index <= 0) return;
    animating = true;
    index -= 1;
    const photo = photos[index];
    gsap.fromTo(photo,
      { y: '-=120', opacity: 0, scale: 1.06, filter: 'blur(6px)' },
      { y: 0, opacity: 1, scale: 1, rotate: 0, filter: 'blur(0px)', duration: .7, ease: 'power3.out',
        onComplete: () => { animating = false; updateDots(); } }
    );
  }

  function finishSequence(){
    finished = true;
    gsap.to(stage, {
      opacity: 0, scale: .96, duration: .9, ease: 'power2.inOut',
      delay: .3,
      onComplete: () => { unlockScroll(); }
    });
  }

  function unlockScroll(){
    locked = false;
    lenisStart();
  }
  function lockScroll(){
    locked = true;
    lenisStop();
  }

  let wheelAccum = 0;
  function onWheel(e){
    if (!locked) return;
    e.preventDefault();
    wheelAccum += e.deltaY;
    if (Math.abs(wheelAccum) < 40) return;
    if (wheelAccum > 0) turnNext(); else turnPrev();
    wheelAccum = 0;
  }
  let touchStartY = 0;
  function onTouchStart(e){ touchStartY = e.touches[0].clientY; }
  function onTouchMove(e){
    if (!locked) return;
    e.preventDefault();
  }
  function onTouchEnd(e){
    if (!locked) return;
    const dy = touchStartY - e.changedTouches[0].clientY;
    if (Math.abs(dy) < 30) return;
    if (dy > 0) turnNext(); else turnPrev();
  }
  function onKey(e){
    if (!locked) return;
    if (['ArrowDown','ArrowRight',' '].includes(e.key)) { e.preventDefault(); turnNext(); }
    if (['ArrowUp','ArrowLeft'].includes(e.key)) { e.preventDefault(); turnPrev(); }
  }

  window.addEventListener('wheel', onWheel, { passive:false });
  window.addEventListener('touchstart', onTouchStart, { passive:true });
  window.addEventListener('touchmove', onTouchMove, { passive:false });
  window.addEventListener('touchend', onTouchEnd, { passive:true });
  window.addEventListener('keydown', onKey);

  ScrollTrigger.create({
    trigger: section,
    start: 'top top',
    end: 'bottom top',
    onEnter: () => { if (!finished) lockScroll(); },
    onEnterBack: () => {
      if (finished){
        // allow re-entering to replay lightly is out of scope; keep unlocked
        return;
      }
      lockScroll();
    },
  });
}

/* ============================================================
   RSVP
   ============================================================ */
function initRSVP(){
  const form = document.getElementById('rsvp-form');
  if (!form) return;
  const toggle = document.getElementById('attend-toggle');
  const yesBtn = document.getElementById('attend-yes');
  const noBtn = document.getElementById('attend-no');
  let attending = null;

  yesBtn?.addEventListener('click', () => {
    attending = true;
    yesBtn.classList.add('selected'); noBtn.classList.remove('selected');
  });
  noBtn?.addEventListener('click', () => {
    attending = false;
    noBtn.classList.add('selected'); yesBtn.classList.remove('selected');
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    if (attending === null){ attending = true; yesBtn.classList.add('selected'); }
    const name = document.getElementById('rsvp-name').value.trim();
    const data = {
      name,
      phone: document.getElementById('rsvp-phone').value.trim(),
      guests: document.getElementById('rsvp-guests').value,
      attending
    };
    try {
      const list = JSON.parse(localStorage.getItem('rsvps') || '[]');
      list.push(data);
      localStorage.setItem('rsvps', JSON.stringify(list));
    } catch(err){}

    showRsvpSuccess(attending, name);
  });
}

function showRsvpSuccess(attending, name){
  const overlay = document.getElementById('rsvp-success');
  const msg = document.getElementById('rsvp-success-msg');
  msg.textContent = attending
    ? `Thank you${name ? ', ' + name : ''} — we can't wait to celebrate with you.`
    : `Thank you${name ? ', ' + name : ''} — you'll be dearly missed. We appreciate you letting us know.`;
  overlay.classList.add('visible');
  gsap.from('#rsvp-success .check', { scale:0, opacity:0, duration:.6, ease:'back.out(2)' });

  window.setTimeout(() => {
    window.location.href = attending ? 'yes.html' : 'no.html';
  }, 1800);
}

/* ============================================================
   WISHES — localStorage powered
   ============================================================ */
function initWishes(){
  const list = document.getElementById('wish-list');
  const form = document.getElementById('wish-form');
  if (!list || !form) return;

  function render(){
    let wishes = [];
    try { wishes = JSON.parse(localStorage.getItem('wishes') || '[]'); } catch(err){}
    list.innerHTML = '';
    if (!wishes.length){
      list.innerHTML = `<p class="wish-empty">Be the first to leave a wish for ${CONFIG.groom} &amp; ${CONFIG.bride}.</p>`;
      return;
    }
    wishes.slice().reverse().forEach(w => {
      const card = document.createElement('div');
      card.className = 'wish-card';
      card.innerHTML = `<p>${escapeHTML(w.message)}</p><div class="from">— ${escapeHTML(w.from || 'A guest')}</div>`;
      list.appendChild(card);
    });
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const fromEl = document.getElementById('wish-from');
    const msgEl = document.getElementById('wish-message');
    const message = msgEl.value.trim();
    if (!message) return;
    const entry = { from: fromEl.value.trim(), message };
    try {
      const wishes = JSON.parse(localStorage.getItem('wishes') || '[]');
      wishes.push(entry);
      localStorage.setItem('wishes', JSON.stringify(wishes));
    } catch(err){}
    fromEl.value = ''; msgEl.value = '';
    render();
  });

  render();
}
function escapeHTML(str){
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

/* ============================================================
   MUSIC TOGGLE
   ============================================================ */
function initMusicToggle(){
  const btn = document.getElementById('music-toggle');
  const audio = document.getElementById('bg-audio');
  if (!btn || !audio) return;
  btn.addEventListener('click', () => {
    if (audio.paused){
      audio.play().then(()=> updateMusicIcon(true)).catch(()=>{});
    } else {
      audio.pause();
      updateMusicIcon(false);
    }
  });
}
function updateMusicIcon(playing){
  const btn = document.getElementById('music-toggle');
  if (!btn) return;
  btn.classList.toggle('playing', playing);
  btn.setAttribute('aria-label', playing ? 'Pause music' : 'Play music');
}

/* ============================================================
   BACK TO TOP
   ============================================================ */
function initBackToTop(){
  const btn = document.getElementById('back-to-top');
  const hero = document.getElementById('hero');
  if (!btn || !hero) return;
  ScrollTrigger.create({
    trigger: hero, start: 'bottom top',
    onEnter: () => btn.classList.add('visible'),
    onLeaveBack: () => btn.classList.remove('visible'),
  });
  btn.addEventListener('click', () => lenis.scrollTo(0));
}