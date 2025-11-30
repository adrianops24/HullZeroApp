import { useEffect, RefObject } from 'react';
import type PagerView from 'react-native-pager-view';

interface PagerTimerProps {
  pagerRef: RefObject<PagerView | null>;
  total_pages: number;
  activeIndex: number;
  setActiveIndex: (index: number) => void;
  delay?: number;
}

export function usePagerTimer({ pagerRef, total_pages, activeIndex, setActiveIndex, delay = 6000 }: PagerTimerProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      const nextPage = (activeIndex + 1) % total_pages;

      pagerRef.current?.setPage(nextPage);

      setActiveIndex(nextPage);
    }, delay);

    return () => clearTimeout(timer);
  }, [activeIndex]);
}
