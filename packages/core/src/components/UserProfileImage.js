import React from 'react';
import { Avatar } from 'antd';
import { api } from '../api';

const UserProfileImage = ({ id, className, base64 }) => {
  return base64 ? (
    <span className={`ant-avatar ${className}`}>
      <img src={`data:image/png;base64, ${base64}`} alt="Avatar" />
    </span>
  ) : (
    <Avatar
      className={className}
      src={`${api.getBaseUrl()}/users/${id}/image`}
    />
  );
};

export default UserProfileImage;
