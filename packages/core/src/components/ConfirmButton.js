import React from 'react';
import { Popconfirm } from 'antd';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const ConfirmButton = ({ message, iconName, onConfirm, onCancel }) => {
  return (
    <Popconfirm title={message} onConfirm={onConfirm} onCancel={onCancel}>
      <button
        className="gx-pointer"
        type="button"
        style={{
          border: '0px',
          backgroundColor: 'transparent'
        }}
      >
        <FontAwesomeIcon className="icon" icon={iconName} />
      </button>
    </Popconfirm>
  );
};

export default ConfirmButton;
