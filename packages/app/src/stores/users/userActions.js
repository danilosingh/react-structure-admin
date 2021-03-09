import { dispatcher, api } from 'react-structure-admin';
import { RESOURCE_FETCH } from 'react-structure-admin';

export const USER = 'USER';
export const USER_UPDATE_PASSWORD = 'USER_UPDATE_PASSWORD';
export const USER_SAVE_PASSWORD = 'USER_SAVE_PASSWORD';
export const USER_SAVE_PASSWORD_FINISHED = 'USER_SAVE_PASSWORD_FINISHED';
export const USER_SAVE_PASSWORD_FAILED = 'USER_SAVE_PASSWORD_FAILED';
export const USER_CURRENT_GET = 'USER_CURRENT_GET';
export const USER_CURRENT_GET_FINISHED = 'USER_CURRENT_GET_FINISHED';
export const USER_CURRENT_CANCEL = 'USER_CURRENT_CANCEL';
export const USER_CURRENT_UPDATE = 'USER_CURRENT_UPDATE';
export const USER_CURRENT_UPDATE_FINISHED = 'USER_CURRENT_UPDATE_FINISHED';

export const USER_REPORT_INITIALIZE = 'USER_REPORT_INITIALIZE';
export const USER_REPORT_CANCEL = 'USER_REPORT_CANCEL';
export const USER_REPORT_SEND = 'USER_REPORT_SEND';
export const USER_REPORT_FAIL = 'USER_REPORT_FAIL';
export const USER_REPORT_SEND_FINISHED = 'USER_REPORT_SEND_FINISHED';
export const USER_CHANGE_NAME = 'USER_CHANGE_NAME';


export const chanceName = () => (dispatch) => {
  dispatch(
    dispatcher.createAction(USER_CHANGE_NAME, 'users', { name: 'José' })
  );
};

export const customFetch = (resource, params, onSuccess, tenant) => async (dispatch) => {
  await dispatcher.dispatchResouceAction({
    dispatch,
    resource,
    actionType: RESOURCE_FETCH,
    effect: async () => {
      return api.fetch(resource, params, tenant);
    },
    onSuccess
  });
};

export const currentUserUpdate = (data, onSuccess) => async (dispatch) => {
  await dispatcher.dispatchResouceAction({
    dispatch,
    resource: 'users',
    actionType: USER_CURRENT_UPDATE,
    payload: data,
    effect: async () => api.put(`users/${data.id}`, data),
    onSuccess
  });
};

export const currentUserGet = (id) => async (dispatch) => {
  await dispatcher.dispatchResouceAction({
    dispatch,
    resource: 'users',
    actionType: USER_CURRENT_GET,
    effect: async () => api.get('users', id)
  });
};

export const currentUserCancel = () => (dispatch) => {
  dispatch(dispatcher.createAction(USER_CURRENT_CANCEL, 'users'));
};
