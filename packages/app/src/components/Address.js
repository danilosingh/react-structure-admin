import { Col, Form, Input, Row } from 'antd';
import React from 'react';
import { useCrudEditContext } from 'react-structure-admin';

const Address = () => {
  const { form } = useCrudEditContext();
  const postalCodeChangeHandle = ({ target }) => {
    form.setFieldsValue({
      address: {
        street: 'Teste'
      }
    });
  };
  return (
    <Row>
      <Col>
        <Form.Item name={['address', 'postalCode']}>
          <Input onChange={postalCodeChangeHandle} />
        </Form.Item>
      </Col>
      <Col>
        <Form.Item name={['address', 'street']}>
          <Input />
        </Form.Item>
      </Col>
    </Row>
  );
};

export default Address;
