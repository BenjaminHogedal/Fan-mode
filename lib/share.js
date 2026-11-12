import { formatTime } from './fanmodus';
// Lokal PNG med samme billetudtryk og sessionsdata som delingsvisningen.
export async function createMatchImage(seconds, entries) {
  await document.fonts.ready;
  const canvas = document.createElement('canvas');
  canvas.width = 1080; canvas.height = 1350;
  const c = canvas.getContext('2d');
  const text = (value, x, y, size, color = '#000000', body = false) => {
    c.fillStyle = color;
    const family = getComputedStyle(document.documentElement).getPropertyValue(body ? '--font-body' : '--font-display').trim();
    c.font = `${size}px ${family || 'sans-serif'}`;
    c.textAlign = 'center'; c.fillText(value, x, y);
  };
  c.fillStyle = '#000000'; c.fillRect(0, 0, 1080, 1350);
  text('FULL TIME', 540, 110, 70, '#F2EFE5');
  c.fillStyle = '#D9D9D9'; c.beginPath(); c.roundRect(180, 170, 720, 990, 48); c.fill();
  c.save(); c.beginPath(); c.roundRect(180, 170, 720, 990, 48); c.clip();
  c.fillStyle = '#FDE100'; c.fillRect(180, 170, 720, 140); c.restore();
  text('FANMODUS', 540, 265, 65);
  text('MATCH', 540, 420, 110); text('EXPERIENCE', 540, 520, 110);
  text('BVB     2 - 1     RBL', 540, 665, 80);
  c.fillStyle = '#000000';
  for (const x of [180, 900]) { c.beginPath(); c.arc(x, 730, 28, 0, Math.PI * 2); c.fill(); }
  c.strokeStyle = '#00000066'; c.setLineDash([3, 7]);
  for (const y of [780, 970]) { c.beginPath(); c.moveTo(230, y); c.lineTo(850, y); c.stroke(); }
  c.beginPath(); c.moveTo(540, 795); c.lineTo(540, 955); c.stroke(); c.setLineDash([]);
  text(formatTime(seconds), 380, 875, 85); text(String(entries), 700, 875, 85);
  text('Phone-free time', 380, 929, 25, '#000000', true); text('Entries earned', 700, 929, 25, '#000000', true);
  for (let x = 300; x < 780; x += 13) { c.fillStyle = '#000000'; c.fillRect(x, 1030, x % 3 === 0 ? 7 : 3, 75); }
  text('SHARE YOUR MATCH EXPERIENCE', 540, 1260, 57, '#F2EFE5');
  return new Promise((resolve, reject) => canvas.toBlob(blob => blob ? resolve(blob) : reject(new Error('Could not create image')), 'image/png'));
}
export function downloadImage(blob) {
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a'); anchor.href = url; anchor.download = 'FanModus-matchday.png'; anchor.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
