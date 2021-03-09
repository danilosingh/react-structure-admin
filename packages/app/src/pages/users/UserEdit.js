import React from 'react';
import { Input, Form, Button } from 'antd';
import {
  DrawerEdit,
  RemoteSelect,
  normalizeToSelect,
  normalizeFromSelect,
  FormItemWrap,
  
} from 'react-structure-admin';
import Address from './Address';
import { useDispatch } from 'react-redux';
import { chanceName, customFetch } from '../../stores/users/userActions';

const UserEdit = ({ data, ...rest }) => {
  
  const submitHandle = (values) => {
    if (values?.role) {
    }
    if (values.address) {
      values.address.city = normalizeFromSelect(values.address.city);
    }
    return { ...values, role: normalizeFromSelect(values.role) };
  };

  const beforeBindingHandle = ({ address = {}, ...values }) => {
    return {
      ...values,
      address: {
        ...address,
        city: normalizeToSelect(address.city, {
          label: (c) => `${c.name} - ${c.state?.toUpperCase()}`
        })
      },
      role: normalizeToSelect(values.role)
    };
  };
  const onChangeName = ({ target }) => {
    console.log(target.value);
  };
  const handleSubmit = (data, action) => {
    alert(data.name);
    console.log(data);
  };

  var dispatch = useDispatch();
  const click = () => {
    dispatch(chanceName());
  };
  console.log(data);
  return (
    <DrawerEdit
      {...rest}
      data={data}
      size="500px"
      fetch={customFetch}
      updateFormOnDataChanged={false}
      // submit={handleSubmit}
      onBeforeBinding={beforeBindingHandle}
      onSubmit={submitHandle}
    >
      <Form requiredMark={true}>
        <Button onClick={click}>Teste</Button>
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
