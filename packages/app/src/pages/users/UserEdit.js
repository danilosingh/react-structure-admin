import React from 'react';
import { Input, Form } from 'antd';
import {
  DrawerEdit,
  RemoteSelect,
  normalizeToSelect,
  normalizeFromSelect,
  FormItemWrap
} from 'react-structure-admin';
import Address from './Address';

const UserEdit = ({ data, ...rest }) => {
  const submitHandle = (values) => {
    if (values?.role) {
    }
    if (values.address) {
      values.address.city = normalizeFromSelect(values.address.city);
    }
    return { ...values, role: normalizeFromSelect(values.role) };
  };

  const beforeBindingHandle = (values) => {
    if (values.address) {
      values.address.city = normalizeToSelect(values.address.city, {
        label: (c) => `${c.name} - ${c.state?.toUpperCase()}`
      });
    }
    return { ...values, role: normalizeToSelect(values.role) };
  };
  const onChangeName = ({ target }) => {
    console.log(target.value);
  };
  const handleSubmit = (data, action) => {
    alert(action);
    console.log(data);
  };

  return (
    <DrawerEdit
      {...rest}
      data={data}
      size="500px"
      // submit={handleSubmit}
      onBeforeBinding={beforeBindingHandle}
      onSubmit={submitHandle}
    >
      <Form requiredMark={true}>
        <FormItemWrap label="Nome" name="name" required>
          <Input />
        </FormItemWrap>
        <FormItemWrap label="Papel" name="role">
          <RemoteSelect resource="roles" fethOnMount={false} />
        </FormItemWrap>
        <Address />
      </Form>
    </DrawerEdit>
  );
};
export default UserEdit;
