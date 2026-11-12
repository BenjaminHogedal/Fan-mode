'use client';
import { useEffect, useRef } from 'react';
import { DESKTOP_PREVIEW_QUERY } from '@/lib/viewport';

/** Fit taller existing screens/dialogs inside the reference frame without clipping. */
export default function PreviewFit({ children, className = '' }) {
  const viewport = useRef(null);
  const content = useRef(null);
  useEffect(() => {
    const media = window.matchMedia(DESKTOP_PREVIEW_QUERY);
    const update = () => {
      if (!media.matches) {
        content.current.style.removeProperty('transform');
        return;
      }
      const height = content.current.offsetHeight;
      const scale = height ? Math.min(1, viewport.current.clientHeight / height) : 1;
      content.current.style.transform = `scale(${scale})`;
    };
    const observer = new ResizeObserver(update);
    observer.observe(viewport.current);
    observer.observe(content.current);
    media.addEventListener('change', update);
    update();
    return () => { observer.disconnect(); media.removeEventListener('change', update); };
  }, []);
  return <div className={`preview-fit ${className}`} ref={viewport}><div className="preview-fit-content" ref={content}>{children}</div></div>;
}
