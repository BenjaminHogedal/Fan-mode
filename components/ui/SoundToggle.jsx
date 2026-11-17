'use client';
import { useEffect, useRef, useSyncExternalStore } from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import { useSound } from '@/context/SoundContext';
import styles from './SoundToggle.module.css';

const serverMuted = () => false;

export default function SoundToggle({ screen = 'connection', hidden = false }) {
  const sound = useSound();
  const muted = useSyncExternalStore(sound.subscribe, sound.getMuted, serverMuted);
  const button = useRef(null);

  useEffect(() => {
    const element = button.current;
    const shell = element.closest('.app-shell');
    // Keep the rendered target at least 44px, even when the desktop phone is scaled down.
    const update = () => {
      if (!shell?.clientWidth) return;
      const scale = shell.getBoundingClientRect().width / shell.clientWidth;
      element.style.setProperty('--sound-control-scale', String(scale > 0 ? Math.max(1, 1 / scale) : 1));
    };
    const observer = new ResizeObserver(update);
    if (shell) observer.observe(shell);
    const footprint = shell?.closest('.mobile-footprint');
    if (footprint) observer.observe(footprint);
    window.addEventListener('resize', update);
    update();
    return () => { observer.disconnect(); window.removeEventListener('resize', update); };
  }, []);

  return <button
    ref={button}
    type="button"
    className={styles.toggle}
    data-screen={screen}
    hidden={hidden}
    aria-label={muted ? 'Unmute sound' : 'Mute sound'}
    aria-pressed={muted}
    onClick={sound.toggleMute}
  >
    {muted ? <VolumeX size={18} strokeWidth={1.75} aria-hidden="true"/> : <Volume2 size={18} strokeWidth={1.75} aria-hidden="true"/>}
  </button>;
}
