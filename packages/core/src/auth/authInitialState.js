import getAuthDataFromStorage from './getAuthDataFromStorage';

const auth = getAuthDataFromStorage() ?? {};
const accessToken = localStorage.getItem('auth_accesstoken');
const refreshToken = localStorage.getItem('auth_refreshtoken');
const user = auth.user || {};

const authInitialState = {
  ...auth,
  user,
  claims: user.claims || [],
  permissions: user.permissions || [],
  expirationDate: auth.expirationDate ? new Date(auth.expirationDate) : null,  
  refreshToken,
  accessToken
};

export default authInitialState;
