import { useSelector, useDispatch } from 'react-redux';
import { useCallback, useMemo } from 'react';
import * as authActions from '../store/actions';

const useAuth = (getKey = null) => {
  const data = useSelector((state) => state.auth);

  const dispatch = useDispatch();

  const hasPermission = useCallback(
    (permission) => data.permissions.includes(permission),
    [data]
  );

  const login = useCallback(
    (params) => dispatch(authActions.login(params)),
    [dispatch]
  );

  const refresh = useCallback(
    (params) => dispatch(authActions.refreshToken(params)),
    [dispatch]
  );

  const changeLogin = useCallback(
    (params) => dispatch(authActions.changeLogin(params)),
    [dispatch]
  );

  const logout = useCallback(() => dispatch(authActions.logout()), [dispatch]);

  const isAuthenticated = useMemo(
    () =>
      !!(
        data.expirationDate &&
        data.expirationDate > new Date() &&
        data.accessToken
      ),
    [data.expirationDate, data.accessToken]
  );

  const getClaim = useCallback(
    (type) => data.claims.find((c) => c.type === type),
    [data]
  );

  const getClaims = useCallback(
    (type) => data.claims.filter((c) => c.type === type),
    [data]
  );

  const hasClaim = useCallback(
    (type) => data.claims.findIndex((c) => c.type === type) >= 0,
    [data]
  );

  const hasRole = useCallback(
    (...roles) => {
      const userRoles = user.role ? [user.role] : user.roles || [];
      return roles.findIndex((c) => userRoles.includes(c)) >= 0;
    },
    [data]
  );

  const isAdmin = () => {
    return data.user && data.user.role === 'Admin';
  };

  let key = null;

  try {
    key = getKey ? getKey(data) : data.user.id;
  } catch (error) {
    key = 'auth.provider';
  }

  return {
    ...data,
    key,
    isAuthenticated,
    isAdmin,
    hasPermission,
    getClaim,
    getClaims,
    hasClaim,
    hasRole,
    changeLogin,
    refresh,
    login,
    logout
  };
};

export default useAuth;
