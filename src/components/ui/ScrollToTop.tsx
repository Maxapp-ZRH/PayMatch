'use client';

import { useState, useEffect } from 'react';
import { ChevronUp } from 'lucide-react';
import clsx from 'clsx';

export function ScrollToTop() {
  const [isVisible, setIsVisible] = useState(false);
  const [isScrolling, setIsScrolling] = useState(false);

  useEffect(() => {
    let scrollTimer: NodeJS.Timeout;

    const handleScroll = () => {
      // Show button when scrolled down more than 300px
      const scrolled = window.scrollY > 300;
      setIsVisible(scrolled);

      // Set scrolling state and clear timer
      setIsScrolling(true);
      clearTimeout(scrollTimer);

      // Clear scrolling state after 150ms of no scrolling
      scrollTimer = setTimeout(() => {
        setIsScrolling(false);
      }, 150);
    };

    // Initial check on mount
    handleScroll();

    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearTimeout(scrollTimer);
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <button
      onClick={scrollToTop}
      className={clsx(
        'fixed bottom-6 right-6 z-40 flex h-12 w-12 items-center justify-center rounded-full bg-red-500 text-white shadow-lg transition-all duration-500 ease-in-out hover:bg-red-600 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2',
        isVisible
          ? 'translate-y-0 scale-100'
          : 'translate-y-4 scale-95 pointer-events-none',
        isVisible && isScrolling
          ? 'opacity-50'
          : isVisible
            ? 'opacity-100'
            : 'opacity-0'
      )}
      aria-label="Scroll to top"
    >
      <ChevronUp className="h-6 w-6" />
    </button>
  );
}
