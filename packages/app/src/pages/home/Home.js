import { Col, Form, Input, Row, Select } from 'antd';
import React from 'react';
import { SearchValue } from 'react-structure-admin';

const layout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 }
};

export default function Home() {
  var [form] = Form.useForm();

  const onFinish = (values) => {
    console.log('Success:', values);
  };

  const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };
  return (
    <Form
      {...layout}
      name="basic"
      form={form}
      initialValues={{ remember: true }}
      onFinish={onFinish}
      onFinishFailed={onFinishFailed}
    >
      
      <Form.Item
        label="Username"
        name="username"
        rules={[{ required: true, message: 'Please input your username!' }]}
      >
        <SearchValue
          drawerSize="80%"
          title="Selecione o enquadramento de IPI"
          resource="product-invoices"
          columns={[
            {
              title: 'Cód',
              dataIndex: 'id'
            },
            {
              title: 'Nome',
              dataIndex: ['receiver', 'name'],
              isKey: true
            }
          ]}
        />
      </Form.Item>
    </Form>
  );
}
