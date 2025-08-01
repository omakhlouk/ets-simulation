import React, { useState, useRef, useEffect } from 'react';
import { Info } from 'lucide-react';

interface TooltipProps {
  content: React.ReactNode;
  children?: React.ReactElement;
  position?: 'top' | 'bottom' | 'left' | 'right';
  delay?: number;
  className?: string;
  trigger?: 'hover' | 'click';
}

export const Tooltip: React.FC<TooltipProps> = ({
  content,
  children,
  position = 'top',
  delay = 300,
  className = '',
  trigger = 'hover'
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [coords, setCoords] = useState({ x: 0, y: 0 });
  const tooltipRef = useRef<HTMLDivElement>(null);
  const targetRef = useRef<HTMLElement | null>(null);
  let timeout: NodeJS.Timeout;

  const calculatePosition = () => {
    if (targetRef.current && tooltipRef.current) {
      const targetRect = targetRef.current.getBoundingClientRect();
      const tooltipRect = tooltipRef.current.getBoundingClientRect();
      
      let x = 0;
      let y = 0;
      
      switch (position) {
        case 'top':
          x = targetRect.left + (targetRect.width / 2) - (tooltipRect.width / 2);
          y = targetRect.top - tooltipRect.height - 8;
          break;
        case 'bottom':
          x = targetRect.left + (targetRect.width / 2) - (tooltipRect.width / 2);
          y = targetRect.bottom + 8;
          break;
        case 'left':
          x = targetRect.left - tooltipRect.width - 8;
          y = targetRect.top + (targetRect.height / 2) - (tooltipRect.height / 2);
          break;
        case 'right':
          x = targetRect.right + 8;
          y = targetRect.top + (targetRect.height / 2) - (tooltipRect.height / 2);
          break;
      }
      
      // Adjust if tooltip would go off screen
      const padding = 10;
      if (x < padding) x = padding;
      if (y < padding) y = padding;
      if (x + tooltipRect.width > window.innerWidth - padding) {
        x = window.innerWidth - tooltipRect.width - padding;
      }
      if (y + tooltipRect.height > window.innerHeight - padding) {
        y = window.innerHeight - tooltipRect.height - padding;
      }
      
      setCoords({ x, y });
    }
  };

  const showTooltip = (e: React.MouseEvent<HTMLElement> | React.FocusEvent<HTMLElement>) => {
    targetRef.current = e.currentTarget;
    
    if (trigger === 'click') {
      setIsVisible(!isVisible);
    } else {
      timeout = setTimeout(() => {
        setIsVisible(true);
      }, delay);
    }
  };

  const hideTooltip = () => {
    if (trigger === 'hover') {
      clearTimeout(timeout);
      setIsVisible(false);
    }
  };

  useEffect(() => {
    if (isVisible) {
      // Small delay to ensure DOM is updated
      setTimeout(calculatePosition, 10);
    }
  }, [isVisible]);

  useEffect(() => {
    return () => {
      clearTimeout(timeout);
    };
  }, []);

  // If no children provided, render as info icon
  const triggerElement = children ? React.cloneElement(children, {
    onMouseEnter: trigger === 'hover' ? (e: React.MouseEvent<HTMLElement>) => {
      showTooltip(e);
      if (children.props.onMouseEnter) children.props.onMouseEnter(e);
    } : children.props.onMouseEnter,
    onMouseLeave: trigger === 'hover' ? (e: React.MouseEvent<HTMLElement>) => {
      hideTooltip();
      if (children.props.onMouseLeave) children.props.onMouseLeave(e);
    } : children.props.onMouseLeave,
    onClick: trigger === 'click' ? (e: React.MouseEvent<HTMLElement>) => {
      showTooltip(e);
      if (children.props.onClick) children.props.onClick(e);
    } : children.props.onClick,
    onFocus: (e: React.FocusEvent<HTMLElement>) => {
      showTooltip(e);
      if (children.props.onFocus) children.props.onFocus(e);
    },
    onBlur: (e: React.FocusEvent<HTMLElement>) => {
      hideTooltip();
      if (children.props.onBlur) children.props.onBlur(e);
    },
  }) : (
    <button
      onMouseEnter={trigger === 'hover' ? showTooltip : undefined}
      onMouseLeave={trigger === 'hover' ? hideTooltip : undefined}
      onClick={trigger === 'click' ? showTooltip : undefined}
      onFocus={showTooltip}
      onBlur={hideTooltip}
      className="inline-flex items-center justify-center w-4 h-4 text-gray-400 hover:text-gray-600 transition-colors"
    >
      <Info className="w-3 h-3" />
    </button>
  );

  return (
    <>
      {triggerElement}
      {isVisible && (
        <div
          ref={tooltipRef}
          className={`fixed z-50 px-3 py-2 text-sm text-white bg-gray-900 rounded-lg shadow-xl opacity-100 pointer-events-none transition-opacity duration-200 backdrop-blur-sm border border-gray-700 max-w-xs ${className}`}
          style={{
            left: `${coords.x}px`,
            top: `${coords.y}px`,
          }}
        >
          {content}
          {/* Arrow */}
          <div 
            className={`absolute w-2 h-2 bg-gray-900 border-gray-700 transform rotate-45 ${
              position === 'top' ? 'bottom-[-4px] left-1/2 -translate-x-1/2 border-r border-b' :
              position === 'bottom' ? 'top-[-4px] left-1/2 -translate-x-1/2 border-l border-t' :
              position === 'left' ? 'right-[-4px] top-1/2 -translate-y-1/2 border-t border-r' :
              'left-[-4px] top-1/2 -translate-y-1/2 border-b border-l'
            }`}
          />
        </div>
      )}
    </>
  );
};

// Convenience component for parameter tooltips with consistent styling
export const ParameterTooltip: React.FC<{ content: React.ReactNode }> = ({ content }) => {
  return (
    <Tooltip content={content} position="top" className="max-w-xs">
      <Info className="w-4 h-4 text-gray-400 hover:text-gray-600 cursor-help" />
    </Tooltip>
  );
};