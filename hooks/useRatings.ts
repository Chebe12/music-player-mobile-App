import { useState, useEffect } from 'react';

export const useRatings = () => {
  const [ratings, setRatingsState] = useState<Record<string, number>>({});

  // Load ratings on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem('track_ratings');
      if (saved) {
        setRatingsState(JSON.parse(saved));
      }
    } catch (e) {
      console.error("Failed to load ratings", e);
    }
  }, []);

  const setRating = (trackId: string, rating: number) => {
    setRatingsState(prev => {
      const newRatings = { ...prev, [trackId]: rating };
      // Schedule side effect after render
      setTimeout(() => {
        try {
          localStorage.setItem('track_ratings', JSON.stringify(newRatings));
        } catch (e) {
          console.error("Failed to save rating", e);
        }
      }, 0);
      return newRatings;
    });
  };

  return { ratings, setRating };
};