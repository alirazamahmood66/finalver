import { useEffect, useState, useRef } from 'react';

interface CursorPosition {
  x: number;
  y: number;
}

interface RippleParticle extends CursorPosition {
  id: number;
  createdAt: number;
}

export default function CustomCursor() {
  const [cursorPos, setCursorPos] = useState<CursorPosition>({ x: 0, y: 0 });
  const [ripples, setRipples] = useState<RippleParticle[]>([]);
  const [isDesktop, setIsDesktop] = useState(true);
  const cursorDotRef = useRef<HTMLDivElement>(null);
  const rippleCounterRef = useRef(0);

  useEffect(() => {
    // Check if device is desktop (not mobile/tablet)
    const checkIsDesktop = () => {
      const isMobile = window.matchMedia('(max-width: 768px)').matches;
      setIsDesktop(!isMobile);
    };

    checkIsDesktop();
    window.addEventListener('resize', checkIsDesktop);

    return () => window.removeEventListener('resize', checkIsDesktop);
  }, []);

  useEffect(() => {
    if (!isDesktop) return;

    const handleMouseMove = (e: MouseEvent) => {
      setCursorPos({ x: e.clientX, y: e.clientY });

      if (cursorDotRef.current) {
        cursorDotRef.current.style.transform = `translate(${e.clientX - 12}px, ${e.clientY - 12}px)`;
      }

      // Create ripple every 50ms on movement
      if (rippleCounterRef.current % 3 === 0) {
        const newRipple: RippleParticle = {
          x: e.clientX,
          y: e.clientY,
          id: rippleCounterRef.current,
          createdAt: Date.now(),
        };
        setRipples((prev) => [...prev, newRipple]);

        // Remove ripples after animation completes
        setTimeout(() => {
          setRipples((prev) => prev.filter((r) => r.id !== newRipple.id));
        }, 1200);
      }
      rippleCounterRef.current++;
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [isDesktop]);

  // Only render on desktop
  if (!isDesktop) return null;

  return (
    <>
      {/* Main cursor dot */}
      <div
        ref={cursorDotRef}
        className="fixed pointer-events-none z-[9999]"
        style={{
          left: 0,
          top: 0,
          width: '28px',
          height: '28px',
          border: '3px solid hsl(187 71% 65%)',
          borderRadius: '50%',
          boxShadow: '0 0 0 2px hsl(187 71% 65% / 0.2), inset 0 0 8px hsl(187 71% 65% / 0.15), 0 0 12px hsl(187 71% 65% / 0.3)',
          transition: 'none',
          backgroundColor: 'hsl(187 71% 65% / 0.05)',
        }}
      />

      {/* Ripple particles */}
      {ripples.map((ripple) => {
        const progress = (Date.now() - ripple.createdAt) / 1000;
        const scale = 1 + progress * 3;
        const opacity = Math.max(0, 1 - progress);

        return (
          <div
            key={ripple.id}
            className="fixed pointer-events-none z-[9998]"
            style={{
              left: ripple.x,
              top: ripple.y,
              width: '24px',
              height: '24px',
              marginLeft: '-12px',
              marginTop: '-12px',
              border: `2.5px solid hsl(187 71% 65% / ${0.5 * opacity})`,
              borderRadius: '50%',
              transform: `scale(${scale})`,
              opacity: opacity,
              transition: 'none',
              boxShadow: `0 0 12px hsl(187 71% 65% / ${0.3 * opacity})`,
            }}
          />
        );
      })}
    </>
  );
}
