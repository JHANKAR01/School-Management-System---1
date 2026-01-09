import { useState, useEffect } from 'react';

/**
 * Sovereign Low Data Hook
 * Reduces API polling, disables high-res images, and batches uploads.
 */
export const useLowDataMode = () => {
  const [isLowData, setIsLowData] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('sovereign_low_data');
    if (saved === 'true') {
      setIsLowData(true);
    }
  }, []);

  const toggleLowData = () => {
    setIsLowData(prev => {
      const newState = !prev;
      localStorage.setItem('sovereign_low_data', String(newState));
      return newState;
    });
  };

  return { isLowData, toggleLowData };
};
