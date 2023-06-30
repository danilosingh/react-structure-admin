import createResourceReducer from './createResourceReducer';

import {
  LOGIN_REQUEST_FINISHED,
  AUTH_LOGOUT,
  AUTH_REFRESH_USER,
  AUTH_REFRESH_TOKEN_FINISHED
} from '../actions/authActionTypes';
import authInitialState from '../../auth/authInitialState';

const authReducer = createResourceReducer(
  'AUTH',
  { ...authInitialState },
  {
    [LOGIN_REQUEST_FINISHED](state, { payload }) {
      const now = new Date();
      now.setSeconds(now.getSeconds() + payload.data.expireInSeconds);
      return {
        ...state,
        ...payload.data,
        expirationDate: now
      };
    },

    [AUTH_REFRESH_TOKEN_FINISHED](state, { payload }) {
      const now = new Date();
      now.setSeconds(now.getSeconds() + payload.data.expireInSeconds);
      return {
        ...state,
        ...payload.data,
        expirationDate: now
      };
    },

    [AUTH_LOGOUT](state) {
      return {
        ...state,
        user: null,
        expirationDate: null,
        accessToken: null,
        tenant: null,
        permissions: [],
        claims: []
      };
    },

    [AUTH_REFRESH_USER](state, { payload }) {
      const auth = {
        ...state,
        user: {
          ...state.user,
          ...payload
        }
      };

      localStorage.setItem('auth_data', btoa(JSON.stringify(auth)));
      return auth;
    }
  }
);

export default authReducer;
