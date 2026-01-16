import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';

interface TooltipProps {
  content: React.ReactNode;
  children: React.ReactNode;
  position?: 'top' | 'bottom';
  className?: string;
}

export const Tooltip: React.FC<TooltipProps> = ({ content, children, position = 'top', className }) => {
  const [visible, setVisible] = useState(false);
  const [coords, setCoords] = useState({ top: 0, left: 0 });
  const triggerRef = useRef<HTMLDivElement>(null);

  const updatePosition = () => {
    if (triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      const scrollY = window.scrollY;
      
      // Calculate center horizontal position
      const left = rect.left + rect.width / 2;
      
      // Calculate vertical position based on preference
      let top = 0;
      if (position === 'top') {
        top = rect.top + scrollY - 10; // 10px spacing above
      } else {
        top = rect.bottom + scrollY + 10; // 10px spacing below
      }

      setCoords({ top, left });
    }
  };

  const handleMouseEnter = () => {
    updatePosition();
    setVisible(true);
  };

  const handleMouseLeave = () => {
    setVisible(false);
  };

  // Update position on scroll or resize while visible
  useEffect(() => {
    if (visible) {
      window.addEventListener('scroll', updatePosition, true);
      window.addEventListener('resize', updatePosition);
      return () => {
        window.removeEventListener('scroll', updatePosition, true);
        window.removeEventListener('resize', updatePosition);
      };
    }
  }, [visible]);

  return (
    <>
      <div 
        ref={triggerRef} 
        onMouseEnter={handleMouseEnter} 
        onMouseLeave={handleMouseLeave}
        className={`inline-flex items-center ${className || ''}`}
      >
        {children}
      </div>
      {visible && createPortal(
        <div 
          className="fixed z-[9999] bg-white border border-gray-200 shadow-xl rounded-lg p-3 text-xs text-left animate-in fade-in zoom-in-95 duration-200 pointer-events-none"
          style={{
            top: coords.top,
            left: coords.left,
            transform: position === 'top' ? 'translate(-50%, -100%)' : 'translate(-50%, 0)',
            width: 'max-content',
            maxWidth: '18rem'
          }}
        >
          {/* Arrow */}
          <div 
            className={`absolute left-1/2 w-3 h-3 bg-white border-gray-200 transform -translate-x-1/2 rotate-45 ${
              position === 'top' 
                ? '-bottom-1.5 border-b border-r' 
                : '-top-1.5 border-t border-l'
            }`}
          ></div>
          <div className="relative z-10">
            {content}
          </div>
        </div>,
        document.body
      )}
    </>
  );
};
