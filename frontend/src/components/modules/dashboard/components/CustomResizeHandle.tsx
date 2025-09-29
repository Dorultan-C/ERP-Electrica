
import React from 'react';

export const CustomResizeHandle = React.forwardRef<HTMLDivElement, any>((props, ref) => {
  const { handleAxis, ...restProps } = props;
  return (
    <div
      ref={ref}
      {...restProps}
      className={`react-grid-layout-custom-resize-handle react-grid-layout-custom-resize-handle-${handleAxis}`}>
    </div>
  );
});

CustomResizeHandle.displayName = 'CustomResizeHandle';
