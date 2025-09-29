import { ReactNode, useRef, useLayoutEffect, useCallback } from 'react';

interface BaseWidgetProps {
  children: ReactNode;
  className?: string;
  onHeightChange: (height: number) => void;
}

export default function BaseWidget({ children, className, onHeightChange }: BaseWidgetProps) {
  const contentRef = useRef<HTMLDivElement>(null);

  const measureAndReportHeight = useCallback(() => {
    if (contentRef.current) {
      const pixelHeight = contentRef.current.scrollHeight;
      onHeightChange(pixelHeight);
    }
  }, [onHeightChange]);

  useLayoutEffect(() => {
    measureAndReportHeight();

    const resizeObserver = new ResizeObserver(() => {
      measureAndReportHeight();
    });

    if (contentRef.current) {
      resizeObserver.observe(contentRef.current);
    }

    return () => {
      resizeObserver.disconnect();
    };
  }, [measureAndReportHeight]);

  return (
    <div className={`bg-white dark:bg-gray-800 shadow-sm rounded-lg ${className}`}>
      <div ref={contentRef}>{children}</div>
    </div>
  );
}