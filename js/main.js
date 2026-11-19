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
