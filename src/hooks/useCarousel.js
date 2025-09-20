import { useState, useEffect, useMemo } from 'react';

const useCarousel = (items) => {
  const [page, setPage] = useState(0);
  const [cols, setCols] = useState(1);
  const rows = 2;

  // responsive columns logic for carousel
  useEffect(() => {
    const computeCols = () => {
      const w = window.innerWidth;
      if (w >= 1200) return 4;
      if (w >= 1024) return 3;
      if (w >= 768) return 2;
      return 1;
    };
    const apply = () => {
      const newCols = computeCols();
      setCols((prev) => {
        if (prev !== newCols) {
          setPage(0);
        }
        return newCols;
      });
    };
    apply();
    window.addEventListener('resize', apply);
    return () => window.removeEventListener('resize', apply);
  }, []);

  const pageSize = useMemo(() => cols * rows, [cols]);

  const totalPages = useMemo(() => {
    const total = Math.ceil((items?.length || 0) / Math.max(1, pageSize)) || 1;
    return total;
  }, [items, pageSize]);

  const currentItems = useMemo(() => {
    const start = page * pageSize;
    return items.slice(start, start + pageSize);
  }, [items, page, pageSize]);

  const jumpTo = (idx) => setPage(idx);

  const goToPrevious = () => {
    setPage((p) => (p > 0 ? p - 1 : totalPages - 1));
  };

  const goToNext = () => {
    setPage((p) => (p < totalPages - 1 ? p + 1 : 0));
  };

  return {
    page,
    setPage,
    cols,
    pageSize,
    totalPages,
    currentItems,
    jumpTo,
    goToPrevious,
    goToNext,
  };
};

export default useCarousel;
