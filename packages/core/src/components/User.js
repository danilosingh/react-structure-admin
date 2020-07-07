import React, { useEffect, useState } from 'react';
import { Tooltip, Spin } from 'antd';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import UserProfileImage from './UserProfileImage';
import { api } from '../api';
import { useAuthContext } from '../auth';

const User = ({
  id,
  name,
  displayName,
  role = {},
  icon,
  profileImage = {}
}) => {
  const { user } = useAuthContext();
  const [state, setState] = useState({
    id,
    name,
    displayName,
    role,
    icon,
    base64: profileImage.base64,
    loading: false
  });

  const getUser = (userId) => {
    setState({ ...state, loading: true });
    api.get('users', `${userId}/profile`).then((response) => {
      if (response && response.data) {
        const { result } = response.data;
        setState({
          ...state,
          name: result.name,
          displayName: result.displayName,
          role: result.role,
          loading: false
        });
      }
    });
  };

  const setCurrentUser = () => {
    setState({
      ...state,
      name: user.name,
      displayName: user.displayName,
      base64: user.profileImage ? user.profileImage.base64 : undefined
    });
  };

  const updateState = () => {
    setState({
      id,
      name,
      displayName,
      role,
      icon,
      base64: profileImage.base64,
      loading: false
    });
  };

  useEffect(() => {
    if (id && !name) {
      getUser(id);
    }
  }, [id, name]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (id === user.id && id !== state.id) {
      setCurrentUser();
    } else if (id !== state.id) {
      updateState();
    }
  }, [id, user, state]); // eslint-disable-line react-hooks/exhaustive-deps

  const userName = state.displayName || state.name;

  return state.loading ? (
    <div className="gx-user-content-loading">
      <Spin />
    </div>
  ) : (
    <div className="gx-user-content">
      <div className="gx-user-content-avatar">
        <UserProfileImage
          id={state.id}
          base64={state.base64}
          className="gx-size-40 gx-pointer"
        />
      </div>
      <div className="gx-user-content-info">
        <div className="gx-user-content-info-name">{userName}</div>
        <div className="gx-user-content-info-role">
          <small>{state.role.description}</small>
        </div>
      </div>
      {state.icon ? (
        <div className="gx-user-content-icon">
          <Tooltip title={state.icon.description}>
            <FontAwesomeIcon
              className="icon"
              icon={state.icon.name}
              size="lg"
              color="#96a0b1"
            />
          </Tooltip>
        </div>
      ) : null}
    </div>
  );
};

export default User;
