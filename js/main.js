// Mobile menu
const toggle = document.getElementById('nav-toggle');
const links = document.getElementById('nav-links');
toggle.addEventListener('click', () => {
  const open = links.classList.toggle('is-open');
  toggle.setAttribute('aria-expanded', String(open));
});
links.addEventListener('click', (e) => {
  if (e.target.tagName === 'A') {
    links.classList.remove('is-open');
    toggle.setAttribute('aria-expanded', 'false');
  }
});

// Product mock: timecode chips move the playhead and change the shot
const playhead = document.getElementById('mock-playhead');
const tc = document.getElementById('mock-tc');
const shot = document.getElementById('mock-shot');
const timeline = document.getElementById('mock-timeline');
const TOTAL_SECONDS = 42 * 60 + 18;

function seek(pct, label) {
  playhead.style.left = pct + '%';
  const secs = Math.round((pct / 100) * TOTAL_SECONDS);
  const t = label || `${Math.floor(secs / 60)}:${String(secs % 60).padStart(2, '0')}`;
  const [m, s] = t.split(':');
  tc.textContent = `00:${m.padStart(2, '0')}:${s}`;
  shot.dataset.scene = pct < 25 ? '0' : pct < 47 ? '1' : '2';
}

document.querySelectorAll('.chip').forEach((chip) => {
  chip.addEventListener('click', () => {
    document.querySelectorAll('.chip').forEach((c) => c.setAttribute('aria-pressed', 'false'));
    chip.setAttribute('aria-pressed', 'true');
    seek(Number(chip.dataset.p), chip.dataset.t);
  });
});
timeline.addEventListener('click', (e) => {
  const r = timeline.getBoundingClientRect();
  seek(Math.max(0, Math.min(100, ((e.clientX - r.left) / r.width) * 100)));
});
seek(27.7, '11:42');

// CTA form (placeholder until a form service is connected)
document.getElementById('cta-form').addEventListener('submit', (e) => {
  e.preventDefault();
  document.getElementById('cta-msg').hidden = false;
  e.target.reset();
});

document.getElementById('year').textContent = new Date().getFullYear();

// ===== Look inside: tabs and simulated flow =====
const tabs = Array.from(document.querySelectorAll('.tour__tab'));
const urls = {
  'screen-access': 'yourlibrary.madeclear.ai/login',
  'screen-ask': 'yourlibrary.madeclear.ai/',
  'screen-answer': 'yourlibrary.madeclear.ai/answer',
  'screen-admin': 'yourlibrary.madeclear.ai/admin',
};
function showScreen(id) {
  tabs.forEach((t) => {
    const on = t.getAttribute('aria-controls') === id;
    t.setAttribute('aria-selected', String(on));
    t.tabIndex = on ? 0 : -1;
    document.getElementById(t.getAttribute('aria-controls')).hidden = !on;
  });
  document.getElementById('browser-url').textContent = urls[id];
  if (id !== 'screen-answer') stopPlayer();
}
tabs.forEach((t, i) => {
  t.addEventListener('click', () => showScreen(t.getAttribute('aria-controls')));
  t.addEventListener('keydown', (e) => {
    if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
    const next = tabs[(i + (e.key === 'ArrowRight' ? 1 : tabs.length - 1)) % tabs.length];
    next.focus();
    showScreen(next.getAttribute('aria-controls'));
  });
});

document.getElementById('access-form').addEventListener('submit', (e) => {
  e.preventDefault();
  showScreen('screen-ask');
});

const askInput = document.getElementById('ask-input');
function ask(q) {
  document.getElementById('answer-q').textContent = q || 'Tell me about the waveform';
  showScreen('screen-answer');
}
document.getElementById('ask-form').addEventListener('submit', (e) => { e.preventDefault(); ask(askInput.value.trim()); });
document.querySelectorAll('.q-chip').forEach((c) => c.addEventListener('click', () => { askInput.value = c.textContent; ask(c.textContent); }));

// Simulated player: two clips, 17s and 29s, run at 6x speed
const clips = [
  { label: 'Clip 1 of 2 · Class 2 · 33:32', cls: 'thumb thumb--studio', secs: 17 },
  { label: 'Clip 2 of 2 · Class 2 · 4:51', cls: 'thumb thumb--slide', secs: 29 },
];
const cards = Array.from(document.querySelectorAll('.quote-card'));
const fill = document.getElementById('player-fill');
const pBtn = document.getElementById('player-btn');
let timer = null, current = 0, progress = 0, playAll = false;

function loadClip(i) {
  current = i; progress = 0;
  document.getElementById('player-shot').className = clips[i].cls;
  document.getElementById('player-label').textContent = clips[i].label;
  cards.forEach((c, n) => c.classList.toggle('is-playing', n === i));
  fill.style.width = '0%';
}
function stopPlayer() { clearInterval(timer); timer = null; pBtn.textContent = '▶'; pBtn.setAttribute('aria-label', 'Play'); }
function startPlayer() {
  stopPlayer();
  pBtn.textContent = '❚❚'; pBtn.setAttribute('aria-label', 'Pause');
  timer = setInterval(() => {
    progress += 6 / 10;
    fill.style.width = Math.min(100, (progress / clips[current].secs) * 100) + '%';
    if (progress >= clips[current].secs) {
      if (playAll && current < clips.length - 1) { loadClip(current + 1); }
      else { stopPlayer(); playAll = false; }
    }
  }, 100);
}
pBtn.addEventListener('click', () => (timer ? stopPlayer() : startPlayer()));
document.getElementById('play-all').addEventListener('click', () => { playAll = true; loadClip(0); startPlayer(); });
cards.forEach((c) => c.addEventListener('click', () => { playAll = false; loadClip(Number(c.dataset.clip)); startPlayer(); }));
document.querySelectorAll('.cite').forEach((b) => b.addEventListener('click', () => { playAll = false; loadClip(Number(b.dataset.clip)); startPlayer(); }));
loadClip(0);
