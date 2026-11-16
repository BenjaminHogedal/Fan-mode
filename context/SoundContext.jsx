'use client';
import { createContext, useContext, useEffect, useState } from 'react';
import { createSoundController } from '@/lib/sounds';

const SoundContext = createContext(null);
export function SoundProvider({ children }) {
  const [sound] = useState(() => createSoundController());
  useEffect(() => {
    void sound.prepare();
    const unlock = () => sound.unlock();
    const hide = () => { if (document.hidden) sound.stop(); };
    document.addEventListener('pointerdown', unlock, true);
    document.addEventListener('pointerup', unlock, true);
    document.addEventListener('keydown', unlock, true);
    document.addEventListener('visibilitychange', hide);
    return () => {
      document.removeEventListener('pointerdown', unlock, true);
      document.removeEventListener('pointerup', unlock, true);
      document.removeEventListener('keydown', unlock, true);
      document.removeEventListener('visibilitychange', hide);
      sound.stop();
    };
  }, [sound]);
  return <SoundContext.Provider value={sound}>{children}</SoundContext.Provider>;
}
export const useSound = () => useContext(SoundContext);
