import localFont from 'next/font/local';
import './globals.css';
// Selvhostede Google Fonts: demo og build kræver ingen fontforbindelse.
const display = localFont({ src: '../public/fonts/bebas-neue.ttf', variable: '--font-display', display: 'swap', weight: '400' });
const body = localFont({ src: '../public/fonts/space-grotesk.ttf', variable: '--font-body', display: 'swap' });
const label = localFont({ src: [
  { path: '../public/fonts/barlow-condensed-500.ttf', weight: '500' },
  { path: '../public/fonts/barlow-condensed-600.ttf', weight: '600' },
  { path: '../public/fonts/barlow-condensed-700.ttf', weight: '700' },
], variable: '--font-label', display: 'swap' });
export const metadata = { title: 'FanModus — Be here. Be Borussia.', description: 'A phone-free matchday. An interactive BVB FanModus exam prototype.' };
export const viewport = { width: 'device-width', initialScale: 1, viewportFit: 'cover', themeColor: '#000000' };
export default function RootLayout({ children }) {
  return <html lang="en" className={`${display.variable} ${body.variable} ${label.variable}`}><body>{children}</body></html>;
}
