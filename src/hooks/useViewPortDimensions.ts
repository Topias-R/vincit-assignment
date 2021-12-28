import { useEffect, useState } from 'react';

export interface ViewPortDimensions {
  height: number | null;
  width: number | null;
}

export function useViewPortDimensions(): ViewPortDimensions {
  const [viewPortDimensions, setViewPortDimensions] =
    useState<ViewPortDimensions>({
      width: null,
      height: null
    });

  function handleResize() {
    setViewPortDimensions({
      width: document.documentElement?.clientWidth || window.innerWidth,
      height: document.documentElement?.clientHeight || window.innerHeight
    });
  }

  useEffect(() => {
    handleResize();

    window.addEventListener('resize', handleResize);

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return viewPortDimensions;
}
