import type { RefObject } from 'react';
import { gsap, ScrollTrigger, SplitText, useGSAP, EASE_OUT, MOTION_OK } from '../lib/gsap';

/**
 * Scroll-driven entrances for everything inside `scope`, each played once:
 * - `[data-split]`  headings rise word by word from behind a mask
 * - `[data-reveal]` blocks lift and fade in, batched with a short stagger
 * - `[data-media]`  images wipe open from the bottom while settling from a zoom
 * - `[data-stagger]` direct children (tags, chips) cascade in after their block
 * Reduced-motion visitors get the content immediately.
 */
export function useReveal(scope: RefObject<HTMLElement | null>) {
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        const q = gsap.utils.selector(scope);

        q('[data-split]').forEach((el) => {
          SplitText.create(el, {
            type: 'words',
            mask: 'words',
            autoSplit: true,
            onSplit: (self) =>
              gsap.from(self.words, {
                yPercent: 110,
                duration: 0.9,
                stagger: 0.045,
                ease: EASE_OUT,
                scrollTrigger: { trigger: el, start: 'top 88%', once: true },
              }),
          });
        });

        const blocks = q('[data-reveal]');
        if (blocks.length) {
          gsap.set(blocks, { autoAlpha: 0, y: 36 });
          ScrollTrigger.batch(blocks, {
            start: 'top 90%',
            once: true,
            onEnter: (batch) =>
              gsap.to(batch, { autoAlpha: 1, y: 0, duration: 0.8, stagger: 0.08, ease: EASE_OUT, overwrite: true }),
          });
        }

        q('[data-media]').forEach((el) => {
          const img = el.querySelector('img');
          const tl = gsap.timeline({ scrollTrigger: { trigger: el, start: 'top 88%', once: true } });
          tl.from(el, { clipPath: 'inset(0% 0% 100% 0%)', duration: 1, ease: EASE_OUT, clearProps: 'clipPath' });
          if (img) tl.from(img, { scale: 1.18, duration: 1.3, ease: EASE_OUT, clearProps: 'scale' }, 0);
        });

        q('[data-stagger]').forEach((el) => {
          gsap.from(el.children, {
            autoAlpha: 0,
            y: 10,
            duration: 0.5,
            stagger: 0.035,
            ease: EASE_OUT,
            delay: 0.15,
            scrollTrigger: { trigger: el, start: 'top 92%', once: true },
          });
        });
      });
    },
    { scope },
  );
}
