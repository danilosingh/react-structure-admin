import React from 'react';
import { Button } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { Crud } from 'react-structure-admin';
import { currentUserGet } from '../../stores/users/userActions';
import UserEdit from './UserEdit';
import CustomUserEdit from './CustomUserEdit';

const UserList = (props) => {
  var dispatch = useDispatch();
  const { editingCurrentUser } = useSelector(
    (state) => state.resources.users || {}
  );
  const buttonClick = () => {
    dispatch(currentUserGet("8f9290ea-0d74-4ceb-8288-246b733b8240"));
  }
  return (
    <>
    <Button onClick={buttonClick}>Teste</Button>
    {editingCurrentUser ? <CustomUserEdit /> : null}
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
    </>
  );
};

export default UserList;