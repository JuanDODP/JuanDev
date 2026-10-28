import { useCallback, useEffect, useRef, useState } from 'react';
import { useReducedMotion } from 'motion/react';
import { gsap, useGSAP } from '../../lib/gsap';
import type { TermLine } from '../../data/cloud';

const CHAR_TIME = 0.018;
const PAUSE = { cmd: 0.3, out: 0.16, ok: 0.32 } as const;

export type Playback = {
  /** Lines fully printed so far. */
  count: number;
  /** Characters typed of the command at `count` (0 when not typing). */
  chars: number;
  finished: boolean;
  replay: () => void;
  skip: () => void;
};

/**
 * Drives the terminal with a single paused GSAP timeline: commands are typed
 * character by character, output lines print after short pauses. Starts when
 * `play` turns true; reduced-motion visitors get the final state immediately.
 */
export function useDeployPlayback(lines: TermLine[], play: boolean): Playback {
  const [state, setState] = useState({ count: 0, chars: 0 });
  const tl = useRef<gsap.core.Timeline | null>(null);
  const reduceMotion = useReducedMotion();

  useGSAP(
    () => {
      const timeline = gsap.timeline({ paused: true });
      lines.forEach((line, i) => {
        if (line.kind === 'cmd') {
          const typed = { n: 0 };
          timeline.to(
            typed,
            {
              n: line.text.length,
              duration: line.text.length * CHAR_TIME,
              ease: 'none',
              onUpdate: () => setState({ count: i, chars: Math.round(typed.n) }),
            },
            `+=${PAUSE.cmd}`,
          );
          timeline.call(() => setState({ count: i + 1, chars: 0 }), undefined, '+=0.12');
        } else {
          timeline.call(() => setState({ count: i + 1, chars: 0 }), undefined, `+=${PAUSE[line.kind]}`);
        }
      });
      tl.current = timeline;
    },
    { dependencies: [lines] },
  );

  useEffect(() => {
    if (play && !reduceMotion) tl.current?.play();
  }, [play, reduceMotion, lines]);

  const replay = useCallback(() => {
    setState({ count: 0, chars: 0 });
    tl.current?.restart();
  }, []);

  const skip = useCallback(() => {
    tl.current?.progress(1).pause();
    setState({ count: lines.length, chars: 0 });
  }, [lines]);

  // Reduced motion: show the finished transcript instead of animating it.
  const count = play && reduceMotion ? lines.length : state.count;
  const chars = play && reduceMotion ? 0 : state.chars;
  return { count, chars, finished: count >= lines.length, replay, skip };
}
