'use client';
import { useEffect, useRef } from 'react';
import { DESKTOP_PREVIEW_QUERY, MOBILE_FRAME, getFrameScale } from '@/lib/viewport';

/** Desktop reserves only the scaled footprint; touch devices retain normal flow. */
export default function DesktopViewport({ children }) {
  const viewport = useRef(null);
  const footprint = useRef(null);
  const frame = useRef(null);

  useEffect(() => {
    const media = window.matchMedia(DESKTOP_PREVIEW_QUERY);
    const update = () => {
      if (!media.matches) {
        footprint.current.removeAttribute('style');
        frame.current.removeAttribute('style');
        return;
      }
      const bounds = viewport.current;
      const styles = getComputedStyle(bounds);
      const width = bounds.clientWidth - parseFloat(styles.paddingLeft) - parseFloat(styles.paddingRight);
      const height = bounds.clientHeight - parseFloat(styles.paddingTop) - parseFloat(styles.paddingBottom);
      const scale = getFrameScale(width, height);
      footprint.current.style.width = `${MOBILE_FRAME.width * scale}px`;
      footprint.current.style.height = `${MOBILE_FRAME.height * scale}px`;
      frame.current.style.transform = `scale(${scale})`;
    };
    const observer = new ResizeObserver(update);
    observer.observe(viewport.current);
    media.addEventListener('change', update);
    window.visualViewport?.addEventListener('resize', update);
    update();
    return () => {
      observer.disconnect();
      media.removeEventListener('change', update);
      window.visualViewport?.removeEventListener('resize', update);
    };
  }, []);

  return <div className="desktop-viewport" ref={viewport}><div className="mobile-footprint" ref={footprint}><div className="mobile-frame" ref={frame}>{children}</div></div></div>;
}
