import React from 'react';
import { Input, Form } from 'antd';
import {
  DrawerEdit,
  RemoteSelect,
  normalizeToSelect,
  normalizeFromSelect
} from 'react-structure-admin';
import Address from '../../components/Address';

const UserEdit = ({ data, ...rest }) => {

  const submitHandle = (values) => {
    return { ...values, role: normalizeFromSelect(values.role) };
  };

  const beforeBindingHandle = (values) => {
    return { ...values, role: normalizeToSelect(values.role) };
  };
  const onChangeName = ({target}) => {
    console.log(target.value);
  }

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
        <Address />
      </Form>
    </DrawerEdit>
  );
};
export default UserEdit;
