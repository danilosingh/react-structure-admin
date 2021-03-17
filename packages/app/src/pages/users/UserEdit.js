import React from 'react';
import { Input, Form, Button } from 'antd';
import {
  DrawerEdit,
  RemoteSelect,
  normalizeToSelect,
  normalizeFromSelect,
  FormItemWrap
} from 'react-structure-admin';
import Address from './Address';
import { useDispatch } from 'react-redux';
import { chanceName, customFetch } from '../../stores/users/userActions';
import { SearchValue } from 'react-structure-admin';

const UserEdit = ({ data, ...rest }) => {
  const submitHandle = (values) => {
    if (values?.role) {
    }
    if (values.address && values.address.city) {
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
      name2: "Dan",
      cnae: "123456",
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
        <FormItemWrap label="Nome" name="name2" required>
          <Input />
        </FormItemWrap>
        <FormItemWrap label="Papel" name="role">
          <RemoteSelect resource="roles" fethOnMount={false} />
        </FormItemWrap>
        <FormItemWrap label="Item da Lista de Serviço (LC 116/03)" name="cnae">
          <SearchValue
            drawerSize="40%"
            allowClear={true}
            title="Selecione o item da lista de serviço"
            resource="products/federal-services"
            columns={[
              {
                title: 'Código',
                dataIndex: ['code'],
                isKey: true
              },
              {
                title: 'Descrição',
                dataIndex: ['description']
              }
            ]}
          />
        </FormItemWrap>
        <Address />
      </Form>
    </DrawerEdit>
  );
};
export default UserEdit;
