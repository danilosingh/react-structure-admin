import getAuthDataFromStorage from './getAuthDataFromStorage';

const auth = getAuthDataFromStorage();
const accessToken = localStorage.getItem('auth_accesstoken');
const refreshToken = localStorage.getItem('auth_refreshtoken');
const user = auth.user || {};

const authInitialState = {
  user,
  claims: user.claims || [],
  permissions: user.permissions || [],
  expirationDate: auth.expirationDate ? new Date(auth.expirationDate) : null,
  tenantId: auth.tenantId,
  tenantName: auth.tenantName,
  judicialUnit: auth.judicialUnit,
  judicialUnits: auth.judicialUnits || [],
  refreshToken,
  accessToken
};

console.log('authInitialState:');
console.log(authInitialState);

export default authInitialState;
