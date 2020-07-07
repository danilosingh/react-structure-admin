const createResourceReducer = (
  actionTypePrefix,
  initialState,
  methods,
  errorHandler
) => (state = initialState, action) => {
  if (
    !actionTypePrefix ||
    !action.type.toUpperCase().startsWith(`${actionTypePrefix.toUpperCase()}_`)
  ) {
    return { handled: false, state };
  }

  if (action.error) {
    if (errorHandler) {
      return { handled: true, state: errorHandler(state, action) };
    }

    const errors =
      action.payload && action.payload.errors
        ? action.payload.errors || []
        : [];

    return {
      handled: true,
      state: {
        ...state,
        [action.resource]: {
          ...state[action.resource],
          errors,
          saving: false
        }
      }
    };
  }

  if (
    !action.type.endsWith('_FINISHED') &&
    action.resource &&
    state[action.resource] &&
    state[action.resource].errors &&
    state[action.resource].errors.length > 0
  ) {
    state = {
      ...state,
      [action.resource]: { ...state[action.resource], errors: [] }
    };
  }

  const method = methods[action.type];

  return method
    ? { handled: true, state: method(state, action) }
    : { handled: false, state };
};

export default createResourceReducer;
