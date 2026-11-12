'use client';
import { LockKeyhole, ChevronUp } from 'lucide-react';
import Modal from '@/components/ui/Modal';
import { Asset, Eyebrow } from '@/components/ui/Primitives';
import { useFanModus } from '@/context/FanModusContext';
import { formatTime } from '@/lib/fanmodus';
export default function LockScreen({ onClose }) {
  const { now, seconds } = useFanModus();
  const date = new Date(now);
  return <Modal title="LOCK SCREEN SIMULATION" onClose={onClose} className="lock-sheet"><div className="mock-lock"><LockKeyhole size={22}/><p>{date.toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' })}</p><strong className="lock-clock">{date.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}</strong><Asset name="stadium"/><div className="lock-widget"><Eyebrow>FANMODUS <span>· LIVE DEMO</span></Eyebrow><strong>{formatTime(seconds)}</strong><span>PHONE-FREE TIME</span></div><p className="fine-print">A mockup inside the prototype.<br/>This does not change your actual lock screen.</p><button className="text-button" onClick={onClose}><ChevronUp size={19}/> BACK TO FANMODUS</button></div></Modal>;
}
