import React from 'react';
import AuthContext from './AuthContext';
import useAuth from './useAuth';

const AuthContextProvider = (props) => {
  const { children, getKey } = props;
  const { key, ...rest } = useAuth((data) => {
    return getKey ? getKey(data) : data.user.id;
  });

  return (
    <AuthContext.Provider key={key} value={{ ...rest }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContextProvider;
