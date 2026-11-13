import { formatTime } from './fanmodus';

// Export the same local ticket assets and session values shown in the sheet.
export async function createMatchImage(seconds, entries) {
  await document.fonts.ready;
  const sources = {
    ticket: '/images/share/ticket.svg', bvb: '/images/post-match/bvb.png', opponent: '/images/post-match/freiburg.png',
    underline: '/images/share/underline.svg', notch: '/images/share/notch.svg', side: '/images/share/side-notch.svg',
    barcode: '/images/share/barcode.svg', phone: '/images/share/phone.svg', phone2: '/images/share/phone2.svg', entry: '/images/share/entry.svg',
  };
  const assets = Object.fromEntries(await Promise.all(Object.entries(sources).map(async ([name, src]) => {
    const image = new Image();
    image.src = src;
    await image.decode();
    return [name, image];
  })));
  const canvas = document.createElement('canvas');
  canvas.width = 1170; canvas.height = 1950;
  const c = canvas.getContext('2d');
  if (!c) throw new Error('Image export unavailable');
  c.scale(3, 3);
  const rootStyle = getComputedStyle(document.documentElement);
  const display = rootStyle.getPropertyValue('--font-display').trim() || 'sans-serif';
  const body = rootStyle.getPropertyValue('--font-body').trim() || 'sans-serif';
  const digitalNode = document.querySelector('[data-node-id="180:215"] [class*="time"]');
  const digital = digitalNode ? getComputedStyle(digitalNode).fontFamily : display;
  const text = (value, x, y, size, family = display, color = '#000') => {
    c.fillStyle = color; c.font = `400 ${size}px ${family}`;
    c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillText(value, x, y);
  };
  const image = (name, x, y, width, height) => c.drawImage(assets[name], x, y, width, height);
  c.fillStyle = '#000'; c.fillRect(0, 0, 390, 650);
  text('FULL TIME', 195, 69.25, 40, display, '#f2efe5');
  c.save(); c.translate(30.5, 97.5);
  image('ticket', 21, 16.2, 299, 495.607);
  image('underline', 136.42, 191.98345, 117.075, 17.4813);
  image('bvb', 66, 214.87, 64.417, 64.433);
  text('2 - 1', 170.5, 247.62, 42);
  image('opponent', 199.58, 217.39, 64.425, 64.425);
  for (const x of [15, 314]) {
    c.save(); c.translate(x, 248.345); c.rotate(Math.PI / 2);
    image('side', -21.5951, -15, 43.1902, 30); c.restore();
  }
  const gradient = c.createLinearGradient(21, 0, 320, 0);
  gradient.addColorStop(0, '#fde100'); gradient.addColorStop(.60577, '#fde100'); gradient.addColorStop(1, '#978600');
  c.fillStyle = gradient; c.beginPath(); c.roundRect(21, 16, 299, 70, [24, 24, 0, 0]); c.fill();
  image('notch', 151, 495.61, 40, 32.3926);
  c.save(); c.translate(171.12, 148.3225); c.rotate(-5.3 * Math.PI / 180); c.transform(1, 0, Math.tan(-.75 * Math.PI / 180), 1, 0, 0);
  text('MATCH', 0, -27.65, 46.08); text('EXPERIENCE', 0, 27.65, 46.08); c.restore();
  image('notch', 151, 0, 40, 32.3926);
  text('FAN MODE', 170.5, 58.25, 28);
  image('barcode', 73, 441, 196, 45);
  image('phone', 91.5, 330, 24, 24); image('phone2', 243.5, 330, 24, 24);
  c.save(); c.translate(255.5, 342.5); c.rotate(-44.62 * Math.PI / 180); image('entry', -14, -7.5, 28, 15); c.restore();
  if ('letterSpacing' in c) c.letterSpacing = '-3.84px';
  text(formatTime(seconds), 103.5, 379.5, 24, digital);
  if ('letterSpacing' in c) c.letterSpacing = '0px';
  text(String(entries), 255.5, 379.5, 38);
  text('Phone-free time', 103.5, 398.5, 11, body);
  text('Entries earned', 255.5, 398.5, 11, body);
  c.restore();
  return new Promise((resolve, reject) => canvas.toBlob(blob => blob ? resolve(blob) : reject(new Error('Could not create image')), 'image/png'));
}
export function downloadImage(blob) {
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a'); anchor.href = url; anchor.download = 'FanModus-matchday.png'; anchor.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
