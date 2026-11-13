'use client';
import { useState } from 'react';
import Modal from '@/components/ui/Modal';
import FigmaScreen, { FigmaSvg } from '@/components/ui/FigmaScreen';
import MatchTicket from '@/components/ui/MatchTicket';
import styles from './ShareSheet.module.css';
import { useFanModus } from '@/context/FanModusContext';
import { createMatchImage, downloadImage } from '@/lib/share';
export default function ShareSheet({ onClose }) {
  const { seconds, entries } = useFanModus();
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState('');
  async function exportImage(share) {
    if (busy) return;
    setBusy(true); setMessage('Preparing your matchday image…');
    try {
      const blob = await createMatchImage(seconds, entries);
      const file = new File([blob], 'FanModus-matchday.png', { type: 'image/png' });
      if (share && navigator.canShare?.({ files: [file] })) {
        await navigator.share({ files: [file], title: 'My FanModus matchday', text: 'Be here. Be Borussia.' });
        setMessage('Your matchday image is ready to share.');
      } else { downloadImage(blob); setMessage(share ? 'Image saved. Open Instagram to share it. Direct posting is not supported by this browser.' : 'Your PNG image has been saved.'); }
    } catch (error) { setMessage(error.name === 'AbortError' ? 'Sharing cancelled. Your matchday is still here.' : 'Couldn’t export the image. Please try again.'); }
    finally { setBusy(false); }
  }
  return <Modal title="Your match ticket" onClose={onClose} className="match-share-modal" slideFromBottom>
    <FigmaScreen nodeId="44:10141" label="Share your match experience">
      <div className={styles.dividerTop}><FigmaSvg src="/images/share/divider.svg"/></div>
      <div className={styles.dividerBottom}><FigmaSvg src="/images/share/divider.svg"/></div>
      <div className={styles.dividerVertical}><FigmaSvg src="/images/share/vertical.svg"/></div>
      <h1 className={styles.title}>full time</h1>
      <button className={styles.close} onClick={onClose} aria-label="Close match ticket"><FigmaSvg src="/images/share/close.svg"/></button>
      <div className={styles.ticket}><MatchTicket seconds={seconds} entries={entries}/></div>
      <h2 className={styles.heading}>share your<br/>match experience</h2>
      <button className={styles.share} disabled={busy} onClick={() => exportImage(true)}><FigmaSvg src="/images/share/instagram.svg"/><span>Share on instagram</span></button>
      <button className={styles.save} disabled={busy} onClick={() => exportImage(false)}><FigmaSvg src="/images/share/save.svg"/><span>Save image</span></button>
      <p className={styles.status} role="status">{message}</p>
    </FigmaScreen>
  </Modal>;
}
