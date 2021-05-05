import React from 'react';
import { Input, Form } from 'antd';
import {
  DrawerEdit,
  RemoteSelect,
  normalizeToSelect,
  normalizeFromSelect,
  ResourceEdit
} from 'react-structure-admin';
import { currentUserCancel } from '../../stores/users/userActions';

const CustomUserEdit = ({ data, ...rest }) => {
  console.log(rest);
  const submitHandle = (values) => {
    if (values?.role) {
    }
    return { ...values, role: normalizeFromSelect(values.role) };
  };

  const beforeBindingHandle = (values) => {
    return { ...values, role: normalizeToSelect(values.role) };
  };
  const onChangeName = ({ target }) => {
    console.log(target.value);
  };

  return (
    <DrawerEdit
      {...rest}
      data={data}
      size="md"
      onBeforeBinding={beforeBindingHandle}
      onSubmit={submitHandle}
    >
      <Form>
        <Form.Item label="Nome" name="name" required>
          <Input onChange={onChangeName} />
        </Form.Item>
        <Form.Item label="Papel" name="role" required>
          <RemoteSelect resource="roles" fethOnMount={false} />
        </Form.Item>
      </Form>
    </DrawerEdit>
  );
};

export default ResourceEdit.create(CustomUserEdit, {
  resource: 'users',
  currentAttr: 'currentUser',
  cancelEdit: currentUserCancel
});
