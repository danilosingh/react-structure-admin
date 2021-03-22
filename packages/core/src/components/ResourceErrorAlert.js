import React, { useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { Alert } from 'antd';

const ResourceErrorAlert = ({ resource }) => {
  const errors = useSelector((state) =>
    state.resources[resource] ? state.resources[resource].errors : []
  );
  const errorText =
    errors && errors.length > 0
      ? errors.map((item) => item.message).join(' ')
      : null;

  const ref = useRef(null);
  useEffect(() => {
    if (errorText && ref.current) {
      ref.current.scrollIntoView();
    }
  }, [errorText, ref.current]);

  return (
    errorText && (
      <div ref={ref}>
        <Alert
          className="gx-alert-error-crud"
          description={errorText}
          type="error"
          closable
        />
      </div>
    )
  );
};

export default ResourceErrorAlert;
