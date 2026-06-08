import { useState, useEffect, useRef } from 'react';

const CHARS = '!<>-_\\/[]{}—=+*^?#@$%&abcdefghijklmnopqrstuvwxyz0123456789';

export function useScramble(text: string, trigger = true, duration = 600) {
  const [display, setDisplay] = useState(text);
  const frameRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const startRef = useRef<number>(0);

  useEffect(() => {
    if (!trigger) { setDisplay(text); return; }

    if (frameRef.current) clearInterval(frameRef.current);
    startRef.current = Date.now();

    frameRef.current = setInterval(() => {
      const elapsed = Date.now() - startRef.current;
      const progress = Math.min(elapsed / duration, 1);

      setDisplay(
        text
          .split('')
          .map((char, i) => {
            if (char === ' ') return ' ';
            const revealed = i / text.length < progress;
            return revealed
              ? char
              : CHARS[Math.floor(Math.random() * CHARS.length)];
          })
          .join(''),
      );

      if (progress >= 1) {
        setDisplay(text);
        if (frameRef.current) clearInterval(frameRef.current);
      }
    }, 30);

    return () => { if (frameRef.current) clearInterval(frameRef.current); };
  }, [text, trigger, duration]);

  return display;
}
