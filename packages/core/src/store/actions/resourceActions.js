import { dispatchResouceAction, createAction } from '../dispatcher';
import { api } from '../../api';

import {
  RESOURCE_CURRENT_UNLOAD,
  RESOURCE_FETCH,
  RESOURCE_GET_TO_EDIT,
  RESOURCE_CREATE,
  RESOURCE_UPDATE,
  RESOURCE_DELETE,
  RESOURCE_SET_PARAMS,
  RESOURCE_CANCEL_EDIT,
  RESOURCE_CREATE_INITIALIZE,
  RESOURCE_SET_CURRENT,
  RESOURCE_UNLOAD
} from './resourceActionTypes';

const onSaveError = (data) => {
  if (data.status === 400) {
    return true;
  }

  return false;
};

export const fetch =
  (resource, params, onSuccess, tenant, endpoint) => async (dispatch) => {
    await dispatchResouceAction({
      dispatch,
      resource,
      actionType: RESOURCE_FETCH,
      effect: async () => {
        return api.fetch(endpoint ?? resource, params, null, tenant);
      },
      onSuccess
    });
  };

export const get =
  (resource, id, queryParams, onSuccess, tenant, endpoint) => async (dispatch) => {
    await dispatchResouceAction({
      dispatch,
      resource,
      payload: queryParams,
      actionType: RESOURCE_GET_TO_EDIT,
      effect: async () => api.get(endpoint ?? resource, id, null, tenant),
      onSuccess
    });
  };

export const create =
  (resource, data, onSuccess, tenant, endpoint) => async (dispatch) => {
    await dispatchResouceAction({
      dispatch,
      resource,
      payload: data,
      actionType: RESOURCE_CREATE,
      effect: async () => api.post(endpoint ?? resource, data, tenant),
      onSuccess,
      onFail: onSaveError
    });
  };

export const update =
  (resource, id, data, onSuccess, tenant, endpoint) => async (dispatch) => {
    data.resourceId = id;
    await dispatchResouceAction({
      dispatch,
      resource,
      payload: data,
      actionType: RESOURCE_UPDATE,
      effect: async () => api.put(`${(endpoint ?? resource)}/:resourceId`, data, tenant),
      onSuccess,
      onFail: onSaveError
    });
  };

export const remove = (resource, id, onSuccess, tenant, endpoint) => async (dispatch) => {
  await dispatchResouceAction({
    dispatch,
    resource,
    actionType: RESOURCE_DELETE,
    effect: async () => api.del(endpoint ?? resource, id, tenant),
    onSuccess
  });
};

export const cancelFetch = (resource) => (dispatch) => {
  dispatch(createAction(RESOURCE_CANCEL_FETCH, resource));
};

export const setQueryParams =
  (resource, payload, effect) => async (dispatch) => {
    await dispatchResouceAction({
      dispatch,
      resource,
      payload,
      actionType: RESOURCE_SET_PARAMS,
      effect
    });
  };

export const cancelEdit = (resource) => (dispatch) => {
  dispatch(createAction(RESOURCE_CANCEL_EDIT, resource));
};

export const initializeCreate =
  (resource, initialValues, params) => (dispatch) => {
    dispatch(
      createAction(RESOURCE_CREATE_INITIALIZE, resource, {
        initialValues,
        ...params
      })
    );
  };

export const setCurrent =
  (resource, data, currentAttr = 'resourceToEdit') =>
  (dispatch) => {
    dispatch(
      createAction(RESOURCE_SET_CURRENT, resource, {
        currentAttr,
        data
      })
    );
  };

export const unload = (resource) => (dispatch) => {
  dispatch(createAction(RESOURCE_UNLOAD, resource));
};

export const unloadCurrent =
  (resource, currentAttr = 'resourceToEdit') =>
  (dispatch) => {
    dispatch(
      createAction(RESOURCE_CURRENT_UNLOAD, resource, {
        currentAttr
      })
    );
  };
