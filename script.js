const canvas = document.getElementById('eye');
const ctx = canvas.getContext('2d');

const W = canvas.width;
const H = canvas.height;
const chars = ['0', '1'];

let seed = 1208;
function random() {
  // Tiny deterministic PRNG: keeps the visual stable while still feeling alive.
  seed = (seed * 1664525 + 1013904223) >>> 0;
  return seed / 4294967296;
}

function pointInEye(x, y) {
  // Two smooth eyelids create a pointed almond shape.
  const nx = (x - W / 2) / (W * 0.43);
  const ny = (y - H / 2) / (H * 0.32);
  const almond = Math.pow(Math.abs(nx), 1.7) + Math.pow(Math.abs(ny), 1.7);
  return almond < 1;
}

function draw() {
  ctx.clearRect(0, 0, W, H);

  const fontSize = 17;
  ctx.font = `${fontSize}px "Arial Narrow", "Roboto Condensed", monospace`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  // Binary body.
  const stepX = 15;
  const stepY = 17;
  for (let y = 15; y < H - 10; y += stepY) {
    for (let x = 8; x < W - 8; x += stepX) {
      if (!pointInEye(x, y)) continue;

      // More density toward the center gives the eye an iris-like mass.
      const dx = (x - W / 2) / 125;
      const dy = (y - H / 2) / 62;
      const irisWeight = Math.max(0, 1 - Math.sqrt(dx * dx + dy * dy));
      const alpha = 0.48 + irisWeight * 0.48;

      ctx.fillStyle = `rgba(238,238,238,${alpha})`;
      ctx.fillText(chars[Math.floor(random() * 2)], x, y);
    }
  }

  // Dense binary iris + pupil.
  const cx = W / 2;
  const cy = H / 2;
  for (let y = cy - 52; y <= cy + 52; y += 13) {
    for (let x = cx - 58; x <= cx + 58; x += 13) {
      const d = Math.hypot((x - cx) / 58, (y - cy) / 52);
      if (d > 1) continue;

      ctx.fillStyle = d < .42 ? '#f2f2f2' : 'rgba(232,232,232,.82)';
      ctx.fillText(chars[Math.floor(random() * 2)], x, y);
    }
  }

  // A very small black pupil gives the binary eye an actual gaze.
  ctx.beginPath();
  ctx.arc(cx, cy, 18, 0, Math.PI * 2);
  ctx.fillStyle = '#000';
  ctx.fill();

  // Thin binary-ish eyelid accents.
  ctx.strokeStyle = 'rgba(235,235,235,.42)';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(82, cy);
  ctx.quadraticCurveTo(cx, 62, W - 82, cy);
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(82, cy);
  ctx.quadraticCurveTo(cx, H - 62, W - 82, cy);
  ctx.stroke();
}

draw();
setInterval(() => {
  seed += 1;
  draw();
}, 95);
