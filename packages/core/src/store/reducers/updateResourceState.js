export const RESOURCE = 'resource';
export const RECORD_FIELD = 'resourceToEdit';

const updateResourceState = (state, action, name, changeState) => {
  let value;
  if (name === RESOURCE) {
    value = state[action.resource];
    return {
      ...state,
      [action.resource]: {
        ...value,
        ...changeState(value)
      }
    };
  }

  value = state[action.resource][name];
  return {
    ...state,
    [action.resource]: {
      ...state[action.resource],
      [name]: {
        ...value,
        ...changeState(value)
      }
    }
  };
};

export default updateResourceState;
