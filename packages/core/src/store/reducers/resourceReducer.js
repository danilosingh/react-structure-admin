import { isEmpty } from 'lodash';
import createResourceReducer from './createResourceReducer';

import {
  RESOURCE_FETCH,
  RESOURCE_FETCH_FINISHED,
  RESOURCE_CANCEL_EDIT,
  RESOURCE_GET_TO_EDIT_FINISHED,
  RESOURCE_CREATE_INITIALIZE,
  RESOURCE_UPDATE,
  RESOURCE_CREATE,
  RESOURCE_CREATE_FINISHED,
  RESOURCE_SET_CURRENT,
  RESOURCE_UNLOAD,
  RESOURCE_SET_PARAMS_FINISHED,
  RESOURCE_GET_TO_EDIT,
  RESOURCE_UPDATE_FINISHED,
  RESOURCE_CURRENT_UNLOAD,
  RESOURCE_ACTION_EDIT,
  RESOURCE_ACTION_CREATE
} from '../actions/resourceActionTypes';
import { normalizeResourceState } from './normalizeResourceState';
import updateResourceState, { RESOURCE } from './updateResourceState';

const resourceReducer = createResourceReducer('RESOURCE', [], {
  [RESOURCE_GET_TO_EDIT](state, action) {
    const newState = normalizeResourceState(state, action.resource);
    const { readOnly = false } = action.payload || {};

    return {
      ...newState,
      [action.resource]: {
        ...newState[action.resource],
        ...action.payload,
        readOnly
      }
    };
  },

  [RESOURCE_GET_TO_EDIT_FINISHED](state, action) {
    return {
      ...state,
      [action.resource]: {
        ...state[action.resource],
        editing: !state[action.resource].readOnly,
        action: RESOURCE_ACTION_EDIT /* todo */,
        saving: false,
        resourceToEdit: action.payload.data.result
      }
    };
  },

  [RESOURCE_UPDATE](state, action) {
    const newState = normalizeResourceState(state, action.resource);

    return {
      ...newState,
      [action.resource]: {
        ...newState[action.resource],
        editing: true,
        saving: true,
        resourceToEdit: action.payload
      }
    };
  },

  [RESOURCE_UPDATE_FINISHED](state, action) {
    return updateResourceState(state, action, RESOURCE, () => ({
      resourceToEdit: action.payload.data.result,
      saving: false,
      editing: false,
      action: null,
      loaded: false
    }));
  },

  [RESOURCE_CREATE](state, action) {
    const newState = normalizeResourceState(state, action.resource);

    return {
      ...newState,
      [action.resource]: {
        ...newState[action.resource],
        editing: true,
        saving: true,
        resourceToEdit: action.payload
      }
    };
  },

  [RESOURCE_CREATE_FINISHED](state, action) {
    return updateResourceState(state, action, RESOURCE, () => ({
      saving: false,
      editing: false,
      action: null
    }));
  },

  [RESOURCE_SET_PARAMS_FINISHED](state, action) {
    return updateResourceState(state, action, RESOURCE, (resource) => ({
      queryParams: action.payload,
      loaded:
        !isEmpty(resource.queryParams) &&
        JSON.stringify(resource.queryParams) ===
          JSON.stringify(action.payload || {})
    }));
  },

  [RESOURCE_SET_CURRENT](state, action) {
    const newState = normalizeResourceState(state, action.resource);

    return {
      ...newState,
      [action.resource]: {
        ...newState[action.resource],
        [action.payload.currentAttr]: action.payload.data
      }
    };
  },

  [RESOURCE_CREATE_INITIALIZE](state, action) {
    const newState = normalizeResourceState(state, action.resource);
    const { initialValues = {}, ...rest } = action.payload;
    return {
      ...newState,
      [action.resource]: {
        ...newState[action.resource],
        editing: true,
        saving: false,
        action: RESOURCE_ACTION_CREATE,
        resourceToEdit: initialValues,
        ...rest
      }
    };
  },

  [RESOURCE_FETCH](state, action) {
    const newState = normalizeResourceState(state, action.resource);

    return updateResourceState(newState, action, RESOURCE, () => ({
      loading: true
    }));
  },

  [RESOURCE_FETCH_FINISHED](state, action) {
    const newState = normalizeResourceState(state, action.resource);

    return {
      ...newState,
      [action.resource]: {
        ...newState[action.resource],
        pagination: {
          ...newState[action.resource].pagination,
          total: action.payload.data.result.totalCount,
          current: Number(action.payload.config.params.page) || 1
        },
        ...action.payload.data.result,
        queryParams: action.payload.config.params,
        editing: action.payload.config.params.act === 'editing',
        loaded: true,
        saving: false,
        loading: false
      }
    };
  },

  [RESOURCE_CANCEL_EDIT](state, action) {
    const newState = normalizeResourceState(state, action.resource);
    return {
      ...newState,
      [action.resource]: {
        ...newState[action.resource],
        editing: false,
        action: null,
        saving: false,
        readOnly: false,
        componentKey: null
      }
    };
  },

  [RESOURCE_UNLOAD](state, action) {
    delete state[action.resource];
    return {
      ...state
    };
  },

  [RESOURCE_CURRENT_UNLOAD](state, action) {
    const resourceState = state[action.resource];
    delete resourceState['componentKey'];
    delete resourceState[action.payload.currentAttr];
    return {
      ...state
    };
  }
});

export default resourceReducer;
