import { Col, Form, Input, Row } from 'antd';
import React from 'react';

const Address = () => {
  return (
    <Row>
      <Col>
          <Form.Item name="address.postalCode">
              <Input  />
          </Form.Item>
      </Col>
    </Row>
  );
};
