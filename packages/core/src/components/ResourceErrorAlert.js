import React from 'react';
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

  return (
    errorText && (
      <Alert
        className="gx-alert-error-crud"
        description={errorText}
        type="error"
        closable
      />
    )
  );
};

export default ResourceErrorAlert;
