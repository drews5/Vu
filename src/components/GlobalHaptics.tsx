import { useEffect } from 'react';
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
  const { trigger, isSupported } = useWebHaptics();

  useEffect(() => {
    if (
      !isSupported ||
      !window.matchMedia('(pointer: coarse)').matches ||
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    ) {
      return;
    }

    const triggerPattern = (pattern: 'selection' | 'light' | 'medium') => {
      void trigger(pattern);
    };

    const handleClick = (event: MouseEvent) => {
      if (event.target instanceof Element && event.target.closest(INTERACTIVE_SELECTOR)) {
        triggerPattern('medium');
      }
    };

    document.addEventListener('click', handleClick, true);

    return () => {
      document.removeEventListener('click', handleClick, true);
    };
  }, [isSupported, trigger]);

  return null;
}
