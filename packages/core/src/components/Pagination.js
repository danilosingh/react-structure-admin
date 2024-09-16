import React from 'react';
import { Button } from 'antd';

const Pagination = ({ onClickPrev, onClickNext, pagination }) => {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'right',
        marginTop: '4px'
      }}
    >
      <Button
        onClick={onClickPrev}
        disabled={pagination.current === 1}
        ghost={true}
        type="link"
      >
        <span style={{ fontSize: '22px' }}>{'<'}</span>
      </Button>
      <Button
        onClick={onClickNext}
        disabled={!pagination.hasNext}
        ghost={true}
        type="link"
      >
        <span style={{ fontSize: '22px' }}>{'>'}</span>
      </Button>
    </div>
  );
};

export default Pagination;
