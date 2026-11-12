'use client';
import { useState } from 'react';
import { Download, Share2 } from 'lucide-react';
import Modal from '@/components/ui/Modal';
import { Button, Asset } from '@/components/ui/Primitives';
import { useFanModus } from '@/context/FanModusContext';
import DigitalTime from '@/components/ui/DigitalTime';
import { formatTime } from '@/lib/fanmodus';
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
  return <Modal title="FULL TIME" onClose={onClose} className="share-sheet"><div className="share-card"><div className="share-ticket-band">FANMODUS</div><h2>MATCH<br/>EXPERIENCE</h2><div className="share-score"><Asset name="bvb"/><strong>2 - 1</strong><Asset name="opponent"/></div><div className="share-stats"><div><DigitalTime value={formatTime(seconds)}/><span>Phone-free time</span></div><div><strong>{entries}</strong><span>Entries earned</span></div></div><div className="ticket-barcode" aria-hidden="true"/></div><h2 className="share-heading">SHARE YOUR<br/>MATCH EXPERIENCE</h2><Button disabled={busy} onClick={() => exportImage(true)}><Share2 size={18}/> SHARE ON INSTAGRAM</Button><Button disabled={busy} secondary onClick={() => exportImage(false)}><Download size={18}/> SAVE IMAGE</Button><p className="fine-print">Uses your device’s share menu where supported. Otherwise, save the image and upload it to Instagram.</p><p className="share-status" role="status">{message}</p></Modal>;
}
