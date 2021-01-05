import React from 'react';
import { Input, Form } from 'antd';
import { DrawerEdit } from 'react-structure-admin';

const UserEdit = (props) => {
  return (
    <DrawerEdit {...props} size="md">
      <Form>
        <Form.Item name="name" required>
          <Input />
        </Form.Item>
      </Form>
    </DrawerEdit>
  );
};
export default UserEdit;
