import { useState, useEffect } from 'react';
import '../CSS/InfiniteScrolling.css';

export default function InfiniteScrolling({ items = [], itemsPerView = 3, autoScroll = true, autoScrollDelay = 5000 }) {
  const [scrollIndex, setScrollIndex] = useState(0);
  const [isAutoScroll, setIsAutoScroll] = useState(autoScroll);

  // Extend items array to create infinite loop effect
  const extendedItems = items.length > 0 ? [...items, ...items, ...items] : [];

  useEffect(() => {
    if (!isAutoScroll || items.length === 0) return;

    const interval = setInterval(() => {
      setScrollIndex(prev => prev + 1);
    }, autoScrollDelay);

    return () => clearInterval(interval);
  }, [isAutoScroll, autoScrollDelay, items.length]);

  // Reset to beginning when reaching end
  useEffect(() => {
    if (scrollIndex >= items.length * 2) {
      setScrollIndex(0);
    }
  }, [scrollIndex, items.length]);

  const handlePrev = () => {
    setIsAutoScroll(false);
    setScrollIndex(prev => (prev - 1 + items.length) % (items.length * 3));
    setTimeout(() => setIsAutoScroll(autoScroll), 3000);
  };

  const handleNext = () => {
    setIsAutoScroll(false);
    setScrollIndex(prev => prev + 1);
    setTimeout(() => setIsAutoScroll(autoScroll), 3000);
  };

  const handleDotClick = (index) => {
    setIsAutoScroll(false);
    setScrollIndex(index);
    setTimeout(() => setIsAutoScroll(autoScroll), 3000);
  };

  const visibleItems = extendedItems.slice(scrollIndex, scrollIndex + itemsPerView);

  return (
    <div className="infinite-scrolling-container">
      <div className="infinite-scrolling-wrapper">
        <button className="scroll-button prev" onClick={handlePrev}>
          ← Prev
        </button>

        <div className="infinite-scrolling-content">
          <div className="infinite-scrolling-track">
            {visibleItems.map((item, index) => (
              <div key={`${scrollIndex}-${index}`} className="infinite-scrolling-item">
                <div className="liquid-glass-card">
                  {item.content || item}
                </div>
              </div>
            ))}
          </div>
        </div>

        <button className="scroll-button next" onClick={handleNext}>
          Next →
        </button>
      </div>

      {/* Dot indicators */}
      <div className="infinite-scrolling-dots">
        {items.map((_, index) => (
          <button
            key={index}
            className={`dot ${scrollIndex % items.length === index ? 'active' : ''}`}
            onClick={() => handleDotClick(index)}
            aria-label={`Go to item ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
