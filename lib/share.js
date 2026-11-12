import { formatTime } from './fanmodus';
// Canvas giver en stabil, lokal PNG uden screenshots af DOM eller eksterne assets.
export async function createMatchImage(seconds, entries) {
  await document.fonts.ready;
  const canvas = document.createElement('canvas');
  canvas.width = 1080; canvas.height = 1350;
  const c = canvas.getContext('2d');
  c.fillStyle = '#000000'; c.fillRect(0, 0, 1080, 1350);
  c.fillStyle = '#FDE100'; c.fillRect(64, 64, 952, 8);
  const text = (value, x, y, size, color = '#F2EFE5', font = 'Bebas Neue') => {
    c.fillStyle = color;
    const computed = getComputedStyle(document.documentElement).getPropertyValue(font === 'Bebas Neue' ? '--font-display' : '--font-body').trim();
    c.font = `${size}px ${computed || font}`; c.fillText(value, x, y);
  };
  text('FANMODUS / MATCHDAY 12', 64, 125, 30, '#FDE100', 'Space Grotesk');
  text('I WAS HERE.', 64, 335, 176);
  text('ALL HEART.', 64, 500, 176, '#FDE100');
  text('BVB 09     2 : 1     RBL', 64, 650, 76);
  text('BORUSSIA DORTMUND × RB LEIPZIG', 64, 710, 26, '#F2EFE5', 'Space Grotesk');
  c.strokeStyle = '#D9D9D9'; c.beginPath(); c.moveTo(64, 770); c.lineTo(1016, 770); c.stroke();
  text(formatTime(seconds), 64, 960, 170, '#FDE100');
  text('PHONE-FREE TIME', 64, 1015, 30, '#F2EFE5', 'Space Grotesk');
  text(String(entries), 720, 960, 170, '#FDE100');
  text('ENTRIES', 720, 1015, 30, '#F2EFE5', 'Space Grotesk');
  text('BE HERE. BE BORUSSIA.', 64, 1180, 64);
  text('FANMODUS · EXAM PROTOTYPE · SIMULATED SESSION', 64, 1275, 20, '#D9D9D9', 'Space Grotesk');
  return new Promise((resolve, reject) => canvas.toBlob(blob => blob ? resolve(blob) : reject(new Error('Could not create image')), 'image/png'));
}
export function downloadImage(blob) {
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a'); anchor.href = url; anchor.download = 'FanModus-matchday.png'; anchor.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
