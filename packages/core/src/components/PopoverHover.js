import React, { useState, useEffect } from 'react';
import { Popover } from 'antd';

const PopoverHover = ({
  dataSource,
  title,
  placement = 'rightTop',
  customizedContent,
  visibleContent,
  onHovered,
  activatorComponent
}) => {
  const [hovered, setHovered] = useState(false);

  useEffect(() => {
    if (hovered && onHovered) {
      onHovered();
    }
  }, [hovered]);

  const handleHovered = (event) => {
    if (visibleContent && !visibleContent(dataSource)) {
      return;
    }
    setHovered(event);
  };

  return (
    <Popover
      placement={placement}
      title={title}
      trigger="hover"
      content={customizedContent(dataSource)}
      visible={hovered}
      onVisibleChange={handleHovered}
    >
      {activatorComponent ? activatorComponent(dataSource) : null}
    </Popover>
  );
};

export default PopoverHover;
