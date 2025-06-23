import React from 'react';
import { FixedSizeList, FixedSizeListProps } from 'react-window';

const VirtualizedList = React.forwardRef<FixedSizeList, FixedSizeListProps>(
  (props, ref) => React.createElement(FixedSizeList as any, { ...props, ref })
);

export default VirtualizedList;
