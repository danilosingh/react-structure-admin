import React from 'react';
import { Input, Form, Row, Select, Col } from 'antd';
import { DrawerEdit } from 'react-structure-admin';

const UserEdit = (props) => {
  return (
    <DrawerEdit {...props} size="md">
      <Form>
        <Form.Item wrapperCol={18} label="Descrição" name="description" required>
          <Input />
        </Form.Item>
        <Form.Item wrapperCol={6} label="Finalidade" name="reason" required>
          <Select>
            <Select.Option value="normal">Normal</Select.Option>
            <Select.Option value="devolution">Devolução</Select.Option>
            <Select.Option value="bonus">Bonificação</Select.Option>
            <Select.Option value="shipping">Remessa</Select.Option>
          </Select>
        </Form.Item>      
        <Row>
          <Row>
            <Col>
              <Form.Item
                label="Observações para nota fiscal"
                name="additionalInformation"
                required
              >
                <Input />
              </Form.Item>
            </Col>
          </Row>
        </Row>
        <Form.Item label="Nome" name="name" required>
          <Input />
        </Form.Item>
      </Form>
    </DrawerEdit>
  );
};
export default UserEdit;
