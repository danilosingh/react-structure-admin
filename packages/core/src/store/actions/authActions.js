import axios from 'axios';
import { dispatchResouceAction, createAction } from '../dispatcher';
import { api } from '../../api';
import {
  AUTH_REFRESH_TOKEN,
  LOGIN_REQUEST,
  AUTH_REFRESH_USER,
  AUTH_LOGOUT
} from './authActionTypes';

const onAuthSuccess = (data) => {
  if (data && data.user) {
    axios.defaults.headers.common = {
      Authorization: `Bearer ${data.accessToken}`
    };

    const expirationDate = new Date();
    expirationDate.setSeconds(
      expirationDate.getSeconds() + data.expireInSeconds
    );

    if (data.tenantId) {
      localStorage.setItem('tenantId', data.tenantId);
    } else {
      localStorage.removeItem('tenantId');
    }
    localStorage.setItem(
      'auth_data',
      btoa(JSON.stringify({ ...data, expirationDate }))
    );
    localStorage.setItem('auth_accesstoken', data.accessToken);
    localStorage.setItem('auth_refreshtoken', data.refreshToken);
  }
};

export const refreshToken = (params) => async (dispatch) => {
  await dispatchResouceAction({
    dispatch,
    resource: 'auth',
    actionType: AUTH_REFRESH_TOKEN,
    effect: async () => api.post('/auth/refresh-token', params),
    onAfterEffect: ({ data }, isError) => {
      if (!isError) {
        onAuthSuccess(data);
      }
    }
  });
};

export const login = (params) => async (dispatch) => {
  await dispatchResouceAction({
    dispatch,
    resource: 'auth',
    actionType: LOGIN_REQUEST,
    effect: async () => api.post('/auth/authenticate', params),
    onAfterEffect: ({ data }, isError) => {
      if (!isError) {
        onAuthSuccess(data);
      }
    }
  });
};

export const changeLogin = (params) => async (dispatch) => {
  await dispatchResouceAction({
    dispatch,
    resource: 'auth',
    actionType: LOGIN_REQUEST,
    effect: async () => api.put('/auth', params),
    onAfterEffect: ({ data }, isError) => {
      if (!isError) {
        onAuthSuccess(data);
      }
    }
  });
};

export const logout = () => (dispatch) => {

  localStorage.removeItem('auth_data');
  localStorage.removeItem('auth_accesstoken');
  localStorage.removeItem('auth_refreshtoken');
  localStorage.removeItem('tenantId');


  dispatch(createAction(AUTH_LOGOUT, 'auth'));

  if (axios) {
    delete axios.defaults.headers.common['Authorization'];
  }  
};

export const refreshAuthenticatedUser = (data) => (dispatch) => {
  dispatch(createAction(AUTH_REFRESH_USER, 'auth', data));
};
