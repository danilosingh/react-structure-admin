const concatReducers = (reducers, defaultState) => {
  return (state = defaultState, action) => {
    for (let index = 0; index < reducers.length; index++) {
      const reducer = reducers[index];
      const result = reducer(state, action);
      if (result.handled) {
        return result.state;
      }
    }
    return state;
  };
};

export default concatReducers;
