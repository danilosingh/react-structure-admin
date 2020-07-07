import React from 'react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Tooltip } from 'antd';

const LinkButton = ({
  onClick,
  iconName,
  iconColor = '#545454',
  disabled = false,
  children,
  size = 'sm',
  description,
  className = '',
  placement = 'top',
  visible = true,
  ...rest
}) => {
  return visible ? (
    <button
      type="button"
      className={`gx-link-btn ${className}`}
      disabled={disabled}
      onClick={onClick}
      {...rest}
    >
      <Tooltip title={description} placement={placement}>
        {iconName && (
          <FontAwesomeIcon
            className="icon gx-filter-popover-option"
            icon={iconName}
            size={size}
            color={iconColor}
          />
        )}
        {children}
      </Tooltip>
    </button>
  ) : null;
};

export default LinkButton;
