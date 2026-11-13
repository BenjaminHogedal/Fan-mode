'use client';
import { useEffect, useRef } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { X } from 'lucide-react';
import PreviewFit from './PreviewFit';
export default function Modal({ title, onClose, children, className = '', slideFromBottom = false }) {
  const ref = useRef(null);
  const reduced = useReducedMotion();
  useEffect(() => {
    const previous = document.activeElement;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const dialog = ref.current;
    const focusable = () => Array.from(dialog.querySelectorAll('button, [href], input, select, textarea, [tabindex="0"]')).filter(el => !el.disabled && el.getClientRects().length > 0);
    focusable()[0]?.focus();
    function keydown(event) {
      if (event.key === 'Escape') { event.preventDefault(); onClose(); }
      if (event.key !== 'Tab') return;
      const elements = focusable();
      if (!elements.length) { event.preventDefault(); return; }
      if (event.shiftKey && document.activeElement === elements[0]) { event.preventDefault(); elements.at(-1).focus(); }
      else if (!event.shiftKey && document.activeElement === elements.at(-1)) { event.preventDefault(); elements[0].focus(); }
    }
    dialog.addEventListener('keydown', keydown);
    return () => { document.body.style.overflow = previousOverflow; dialog.removeEventListener('keydown', keydown); if (previous?.isConnected) previous.focus(); };
  }, [onClose]);
  return <motion.div className="modal-backdrop" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose}><PreviewFit className="modal-fit"><motion.section ref={ref} role="dialog" aria-modal="true" aria-label={title} className={`modal ${className}`} initial={{ y: reduced ? 0 : slideFromBottom ? '100%' : 24 }} animate={{ y: 0 }} exit={{ y: reduced ? 0 : slideFromBottom ? '100%' : 24 }} transition={slideFromBottom ? { duration: reduced ? 0 : 0.75, ease: 'easeOut' } : undefined} onClick={e => e.stopPropagation()}><div className="modal-top"><span className="eyebrow">{title}</span><button className="icon-button" onClick={onClose} aria-label={`Close ${title}`}><X size={22} /></button></div>{children}</motion.section></PreviewFit></motion.div>;
}
