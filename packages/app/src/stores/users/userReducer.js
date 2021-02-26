import {
  updateResourceState,
  normalizeResourceState,
  createResourceReducer,
  RESOURCE,
  RECORD_FIELD
} from 'react-structure-admin';
import {
  USER,
  USER_UPDATE_PASSWORD,
  USER_SAVE_PASSWORD,
  USER_SAVE_PASSWORD_FINISHED,
  USER_SAVE_PASSWORD_FAILED,
  USER_CURRENT_UPDATE_FINISHED,
  USER_CURRENT_UPDATE,
  USER_CURRENT_GET_FINISHED,
  USER_CURRENT_CANCEL,
  USER_REPORT_CANCEL,
  USER_REPORT_FAIL,
  USER_REPORT_SEND,
  USER_REPORT_SEND_FINISHED,
  USER_REPORT_INITIALIZE
} from './userActions';

const userReducer = createResourceReducer(USER, [], {
  [USER_UPDATE_PASSWORD](state, action) {
    const newState = normalizeResourceState(state, action.resource);
    return updateResourceState(newState, action, RECORD_FIELD, () => ({
      editingPassword: action.payload
    }));
  },

  [USER_SAVE_PASSWORD](state, action) {
    return updateResourceState(state, action, RESOURCE, () => ({
      loading: true
    }));
  },

  [USER_SAVE_PASSWORD_FINISHED](state, action) {
    return updateResourceState(state, action, RESOURCE, (resource) => ({
      [RECORD_FIELD]: {
        ...resource[RECORD_FIELD],
        editingPassword: null
      },
      loading: false
    }));
  },

  [USER_SAVE_PASSWORD_FAILED](state, action) {
    return updateResourceState(state, action, RESOURCE, () => ({
      loading: false
    }));
  },

  [USER_CURRENT_GET_FINISHED](state, action) {
    return updateResourceState(state, action, RESOURCE, () => ({
      currentUser: action.payload.data.result,
      editingCurrentUser: true,
      visible: true
    }));
  },

  [USER_CURRENT_UPDATE](state, action) {
    return updateResourceState(state, action, RESOURCE, () => ({
      currentUser: action.payload,
      loading: true
    }));
  },

  [USER_CURRENT_UPDATE_FINISHED](state, action) {
    return updateResourceState(state, action, RESOURCE, () => ({
      currentUser: null,
      editingCurrentUser: false,
      visible: false,
      loading: false
    }));
  },

  [USER_CURRENT_CANCEL](state, action) {
    return updateResourceState(state, action, RESOURCE, () => ({
      currentUser: null,
      editingCurrentUser: false
    }));
  },

  [USER_REPORT_INITIALIZE](state, action) {
    const newState = normalizeResourceState(state, action.resource);

    if (action.payload.type === 'suggestion') {
      action.payload.title = 'Sugestão';
    } else {
      action.payload.title = 'Reportar problema';
    }

    return updateResourceState(newState, action, RESOURCE, () => ({
      report: { ...action.payload }
    }));
  },
  [USER_REPORT_CANCEL](state, action) {
    return updateResourceState(state, action, RESOURCE, () => ({
      report: null
    }));
  },
  [USER_REPORT_FAIL](state, action) {
    return updateResourceState(state, action, RESOURCE, (resource) => ({
      report: { ...resource.report, loading: false }
    }));
  },
  [USER_REPORT_SEND](state, action) {
    return updateResourceState(state, action, RESOURCE, (resource) => ({
      report: { ...resource.report, loading: true }
    }));
  },

  [USER_REPORT_SEND_FINISHED](state, action) {
    return updateResourceState(state, action, RESOURCE, () => ({
      report: null
    }));
  }
});

export default userReducer;