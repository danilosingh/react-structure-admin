import React, { useEffect } from 'react';
import AuthContext from './AuthContext';
import useAuth from './useAuth';

let refreshTokenTimer = null;

const AuthContextProvider = (props) => {
  const { children, onBeforeRefreshToken } = props;

  const {
    key,
    refresh,
    refreshToken,
    isAuthenticated,
    expirationDate,
    ...rest
  } = useAuth((data) => {
    if (data.user && data.judicialUnit) {
      return data.user.id + data.judicialUnit.id;
    }
    return undefined;
  });

  useEffect(() => {
    if (refreshTokenTimer) {
      clearTimeout(refreshTokenTimer);
    }

    if (refreshToken && isAuthenticated) {
      const timeout =
        expirationDate.getTime() - new Date().getTime() - 60 * 1000;
      if (timeout < 0) {
        return;
      }
      refreshTokenTimer = setTimeout(() => {
        let refreshParams = null;
        const currentRefreshToken = localStorage.getItem('auth_refreshtoken');
        if (refreshToken !== currentRefreshToken) {
          return;
        }
        if (onBeforeRefreshToken) {
          refreshParams = onBeforeRefreshToken({
            refreshToken: currentRefreshToken,
            ...rest
          });
        }
        if (!refreshParams) {
          refreshParams = { refreshToken: currentRefreshToken };
        }
        refresh(refreshParams);
      }, timeout);
    }
  }, [refreshToken, isAuthenticated, expirationDate]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <AuthContext.Provider
      key={key}
      value={{
        ...rest,
        refresh,
        refreshToken,
        isAuthenticated,
        expirationDate
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContextProvider;
