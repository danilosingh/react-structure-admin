import React from 'react';
import { Crud } from 'react-structure-admin';
import UserEdit from './UserEdit';

const UserList = (props) => (
  <Crud
    {...props}
    columns={[
      {
        title: 'Nome',
        dataIndex: 'name'
      }
    ]}
    editComponent={UserEdit}
  />
);

export default UserList;
