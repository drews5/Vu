import { useEffect, useRef } from 'react';
import { useWebHaptics } from 'web-haptics/react';

const INTERACTIVE_SELECTOR = [
  'button',
  'a',
  '[role="button"]',
  '[data-slot="button"]',
  'input[type="button"]',
  'input[type="submit"]',
  'input[type="reset"]',
  'input[type="checkbox"]',
  'input[type="radio"]',
  'label',
  'summary',
].join(',');

export function GlobalHaptics() {
  const { trigger } = useWebHaptics();
  const lastScrollFeedbackAt = useRef(0);

  useEffect(() => {
    const triggerPattern = (pattern: 'selection' | 'light' | 'medium') => {
      void trigger(pattern);
    };

    const handleClick = (event: MouseEvent) => {
      if (!(event.target instanceof Element)) {
        triggerPattern('selection');
        return;
      }

      const isInteractive = Boolean(event.target.closest(INTERACTIVE_SELECTOR));
      triggerPattern(isInteractive ? 'medium' : 'selection');
    };

    const handleScrollGesture = () => {
      const now = Date.now();
      if (now - lastScrollFeedbackAt.current < 140) {
        return;
      }

      lastScrollFeedbackAt.current = now;
      triggerPattern('light');
    };

    document.addEventListener('click', handleClick, true);
    window.addEventListener('wheel', handleScrollGesture, { passive: true });
    window.addEventListener('touchmove', handleScrollGesture, { passive: true });

    return () => {
      document.removeEventListener('click', handleClick, true);
      window.removeEventListener('wheel', handleScrollGesture);
      window.removeEventListener('touchmove', handleScrollGesture);
    };
  }, [trigger]);

  return null;
}
