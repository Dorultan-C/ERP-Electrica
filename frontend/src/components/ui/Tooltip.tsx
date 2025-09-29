import { ReactNode, useState, useRef } from 'react';
import { useFloating, autoUpdate, offset, flip, shift, arrow } from '@floating-ui/react';

interface TooltipProps {
  content: string;
  children: ReactNode;
}

export default function Tooltip({ content, children }: TooltipProps) {
  const [isOpen, setIsOpen] = useState(false);
  const arrowRef = useRef(null);

  const { x, y, strategy, refs, context } = useFloating({
    open: isOpen,
    onOpenChange: setIsOpen,
    placement: 'top',
    whileElementsMounted: autoUpdate,
    middleware: [
      offset(10),
      flip(),
      shift({ padding: 5 }),
      arrow({
        element: arrowRef,
      }),
    ],
  });

  const { x: arrowX, y: arrowY } = context.middlewareData.arrow || {};

  const side = context.placement.split('-')[0] as 'top' | 'right' | 'bottom' | 'left';
  const staticSide = {
    top: 'bottom',
    right: 'left',
    bottom: 'top',
    left: 'right',
  }[side];

  const arrowStyle = {
    left: arrowX != null ? `${arrowX}px` : '',
    top: arrowY != null ? `${arrowY}px` : '',
    [staticSide]: '-4px',
  };

  return (
    <div
      ref={refs.setReference}
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
    >
      {children}
      {isOpen && (
        <div
          ref={refs.setFloating}
          style={{
            position: strategy,
            top: y ?? 0,
            left: x ?? 0,
            width: 'max-content',
          }}
          className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm rounded-md py-1 px-2 shadow-md z-50 border border-sky-200"
        >
          {content}
          <div
            ref={arrowRef}
            className="absolute bg-white dark:bg-gray-800 w-2 h-2 transform rotate-45"
            style={arrowStyle}
          />
        </div>
      )}
    </div>
  );
}