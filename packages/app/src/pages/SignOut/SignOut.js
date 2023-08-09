import React, { useEffect } from 'react';

import { useHistory } from 'react-router-dom';
import { useAuthContext } from 'react-structure-admin';

const SignOut = () => {
  const { logout } = useAuthContext();
  const history = useHistory();
  useEffect(() => {
    logout();
    // setTimeout(() => {
    //   history.push('/');
    // }, 500);
  }, []);
  return <div>Saindo...</div>;
};

export default SignOut;
