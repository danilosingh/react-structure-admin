import React from 'react';
import { Input, Form } from 'antd';
import { DrawerEdit, FormItemWrap, ResourceEdit } from 'react-structure-admin';

const TopicEdit = ({ data, ...rest }) => {
  return (
    <DrawerEdit {...rest} data={data} size="70%">
      <Form requiredMark={true}>
        <FormItemWrap label="Nome" name="name" required>
          <Input />
        </FormItemWrap>
        <FormItemWrap label="Modelo NF" name="type" required>
          <Input />
        </FormItemWrap>
        <FormItemWrap label="Teste" name="teste" required>
          <Input />
        </FormItemWrap>
      </Form>
    </DrawerEdit>
  );
};

export default TopicEdit;
