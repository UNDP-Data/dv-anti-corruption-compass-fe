import { useEffect } from 'react';
import { useRouterState } from '@tanstack/react-router';

export function ScrollToTop() {
  const { location } = useRouterState();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [location.pathname]);

  return null;
}
