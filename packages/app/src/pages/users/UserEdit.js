import React from 'react';
import { Input, Form, Button } from 'antd';
import {
  DrawerEdit,
  RemoteSelect,
  normalizeToSelect,
  normalizeFromSelect,
  FormItemWrap,
  RemoteSelectCrud
} from 'react-structure-admin';
import Address from './Address';
import { useDispatch } from 'react-redux';
import { chanceName, customFetch } from '../../stores/users/userActions';
import { SearchValue } from 'react-structure-admin';
import TopicEdit from '../topics/TopicEdit';

const Test = () => {
  return <h1>Teste</h1>;
};

const UserEdit = ({ data, ...rest }) => {
  const submitHandle = ({ address, ...values }) => {
    console.log('submitHandle');
    console.log(address.city);

    return {
      ...values,
      address: { ...address, city: normalizeFromSelect(address.city) },
      role: normalizeFromSelect(values.role)
    };
  };

  const beforeBindingHandle = ({ address = {}, ...values }) => {
    console.log('beforeBindingHandle');
    console.log(address.city);
    console.log(
      normalizeToSelect(address.city, {
        label: (c) => `${c.name} - ${c.state?.toUpperCase()}`
      })
    );
    return {
      ...values,
      address: {
        ...address,
        city: normalizeToSelect(address.city, {
          label: (c) => `${c.name} - ${c.state?.toUpperCase()}`
        })
      },
      name2: 'Dan',
      cnae: '123456',
      role: normalizeToSelect(values.role)
    };
  };
  const onChangeName = ({ target }) => {
    console.log(target.value);
  };
  const handleSubmit = (data, action) => {
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
      size="70%"
      fetch={customFetch}
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
        <FormItemWrap
          label="Celular"
          name="mobilephone"
          validateTrigger="onBlur"
          type="mobilePhone"
        >
          <Input placeholder="(__) _____-____" />
        </FormItemWrap>
        <FormItemWrap name={['topic']} label="Tópico">
          <RemoteSelectCrud
            resource="topics"
            textPropName="name"
            resourceTitle="Tópico"
            editComponent={TopicEdit}
          />
        </FormItemWrap>
        <FormItemWrap
          label="Item da Lista de Serviço (LC 116/03)"
          name="cnae"
          required
        >
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
