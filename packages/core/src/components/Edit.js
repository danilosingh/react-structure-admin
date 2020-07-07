/* eslint-disable react/prefer-es6-class */
/* eslint-disable react/prefer-stateless-function */

import React, { useEffect } from 'react';
import createReactClass from 'create-react-class';
import qs from 'query-string';
import { useLocation } from 'react-router-dom';
import { useCrud } from '../hooks';
import { FormContextProvider } from './forms/formContext';

const InternalEdit = (props) => {
  const {
    children,
    resource,
    match = {},
    visible,
    title,
    onAfterCreate,
    currentAttr,
    initialData,
    params: customParams,
    get: customGet,
    id,
    unloadOnUnmount = true
  } = props;
  const { params = {} } = match;
  const {
    data,
    get,
    post,
    cancelEdit,
    update,
    unloadCurrent,
    setCurrent
  } = useCrud({
    resource,
    currentAttr,
    get: customGet
  });
  const { search } = useLocation();

  useEffect(() => {
    const queryParams = qs.parse(search);

    if (id || params.id) {
      get(id || params.id, queryParams);
    }
  }, [id, params, get, search]);

  useEffect(() => {
    return () => {
      if (unloadOnUnmount) {
        unloadCurrent();
      }
    };
  }, [resource, unloadOnUnmount, currentAttr]);

  const handleOk = (record, onSucess) => {
    if (record.id) {
      update(record.id, record, onSucess);
    } else {
      post(record, onSucess);
    }
  };

  return (
    <>
      {React.cloneElement(children, {
        data: currentAttr
          ? { ...initialData, ...data[currentAttr] }
          : { ...initialData, ...data.resourceToEdit },
        resource,
        saving: data.saving,
        loading: data.loading,
        editing: data.editing,
        readOnly: data.readOnly,
        setCurrent,
        visible: visible || data.visible,
        onAfterCreate,
        cancelEdit,
        handleOk,
        params: customParams,
        title
      })}
    </>
  );
};

class Edit {
  static create(
    WrappedComponent,
    { resource, get, currentAttr, unloadOnUnmount }
  ) {
    return createReactClass({
      render() {
        return (
          <FormContextProvider>
            <InternalEdit
              {...this.props}
              resource={resource}
              get={get}
              currentAttr={currentAttr}
              unloadOnUnmount={unloadOnUnmount}
            >
              <WrappedComponent />
            </InternalEdit>
          </FormContextProvider>
        );
      }
    });
  }
}

export default Edit;
