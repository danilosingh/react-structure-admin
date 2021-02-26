/* eslint-disable react/prefer-es6-class */
/* eslint-disable react/prefer-stateless-function */

import React, { useEffect } from 'react';
import createReactClass from 'create-react-class';
import qs from 'query-string';
import { useLocation } from 'react-router-dom';
import { useCrud } from '../hooks';
import { CrudEditContextProvider } from './CrudEditContext';
import { Form } from 'antd';

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
    cancelEdit: customCancelEdit,
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
    get: customGet,
    cancelEdit: customCancelEdit
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

  const createOrUpdate = (record, onSucess) => {
    if (record.id) {
      update(record.id, record, onSucess);
    } else {
      post(record, onSucess);
    }
  };

  const [form] = Form.useForm();

  return (
    <CrudEditContextProvider form={form}>
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
        post,
        update,
        createOrUpdate,
        params: customParams,
        title
      })}
    </CrudEditContextProvider>
  );
};

class ResourceEdit {
  static create(
    WrappedComponent,
    { resource, get, currentAttr, unloadOnUnmount, cancelEdit }
  ) {
    return createReactClass({
      render() {
        return (
          <InternalEdit
            {...this.props}
            resource={resource}
            get={get}
            currentAttr={currentAttr}
            unloadOnUnmount={unloadOnUnmount}
            cancelEdit={cancelEdit}
          >
            <WrappedComponent />
          </InternalEdit>
        );
      }
    });
  }
}

export default ResourceEdit;
