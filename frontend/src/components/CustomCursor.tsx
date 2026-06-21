'use client';
import { useEffect, useRef } from 'react';
import { useMediaQuery } from '@/hooks/useMediaQuery';

export default function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  // only on non-touch (pointer: fine) devices
  const finePointer = useMediaQuery('(pointer: fine)');

  useEffect(() => {
    if (!finePointer) return;

    document.body.style.cursor = 'none';

    let mouseX = 0, mouseY = 0;
    let ringX = 0, ringY = 0;
    let rafId: number;
    let isHover = false;

    const onMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      if (dotRef.current) {
        dotRef.current.style.transform = `translate(${mouseX - 5}px, ${mouseY - 5}px)`;
      }
    };

    const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

    const animate = () => {
      ringX = lerp(ringX, mouseX, 0.1);
      ringY = lerp(ringY, mouseY, 0.1);
      if (ringRef.current) {
        ringRef.current.style.transform = `translate(${ringX - (isHover ? 24 : 20)}px, ${ringY - (isHover ? 24 : 20)}px)`;
      }
      rafId = requestAnimationFrame(animate);
    };

    rafId = requestAnimationFrame(animate);
    document.addEventListener('mousemove', onMove);

    const onEnter = () => {
      isHover = true;
      if (ringRef.current) {
        ringRef.current.style.width = '48px';
        ringRef.current.style.height = '48px';
        ringRef.current.style.opacity = '1';
        ringRef.current.style.background = 'rgba(249,115,22,0.08)';
      }
      if (dotRef.current) dotRef.current.style.transform += ' scale(0)';
    };

    const onLeave = () => {
      isHover = false;
      if (ringRef.current) {
        ringRef.current.style.width = '40px';
        ringRef.current.style.height = '40px';
        ringRef.current.style.opacity = '0.55';
        ringRef.current.style.background = 'transparent';
      }
      if (dotRef.current) dotRef.current.style.opacity = '1';
    };

    // click ripple
    const onClick = (e: MouseEvent) => {
      const ripple = document.createElement('div');
      Object.assign(ripple.style, {
        position: 'fixed',
        left: `${e.clientX - 20}px`,
        top: `${e.clientY - 20}px`,
        width: '40px',
        height: '40px',
        borderRadius: '50%',
        border: '2px solid #f97316',
        pointerEvents: 'none',
        zIndex: '9997',
        animation: 'cursorRipple 0.5s ease-out forwards',
      });
      document.body.appendChild(ripple);
      setTimeout(() => ripple.remove(), 500);
    };

    document.addEventListener('click', onClick);

    const addListeners = () => {
      document.querySelectorAll('a, button, [role="button"], input, textarea, select, label').forEach(el => {
        el.addEventListener('mouseenter', onEnter);
        el.addEventListener('mouseleave', onLeave);
      });
    };
    addListeners();

    const observer = new MutationObserver(addListeners);
    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('click', onClick);
      cancelAnimationFrame(rafId);
      document.body.style.cursor = '';
      observer.disconnect();
    };
  }, [finePointer]);

  if (!finePointer) return null;

  return (
    <>
      <style>{`
        @keyframes cursorRipple {
          from { transform: scale(1); opacity: 1; }
          to   { transform: scale(2.5); opacity: 0; }
        }
      `}</style>

      {/* Dot */}
      <div ref={dotRef} style={{
        position: 'fixed', top: 0, left: 0,
        width: '10px', height: '10px',
        background: '#f97316',
        borderRadius: '50%',
        pointerEvents: 'none',
        zIndex: 9999,
        willChange: 'transform',
        boxShadow: '0 0 8px #f97316, 0 0 20px rgba(249,115,22,0.4)',
        transition: 'opacity 0.15s',
      }} />

      {/* Ring */}
      <div ref={ringRef} style={{
        position: 'fixed', top: 0, left: 0,
        width: '40px', height: '40px',
        border: '1.5px solid #f97316',
        borderRadius: '50%',
        pointerEvents: 'none',
        zIndex: 9998,
        willChange: 'transform',
        opacity: 0.55,
        transition: 'width 0.2s ease, height 0.2s ease, opacity 0.2s ease, background 0.2s ease',
      }} />
    </>
  );
}
