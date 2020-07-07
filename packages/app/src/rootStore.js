import { applyMiddleware, createStore } from 'redux';
import thunk from 'redux-thunk';
import { routerMiddleware } from 'connected-react-router';
import rootReducer from './rootReducer';

export default (initialState, history) => {
  const middlewares = [thunk, routerMiddleware(history)].filter(Boolean);

  const store = createStore(
    rootReducer(history),
    initialState,
    applyMiddleware(...middlewares)
  );
  return store;
};
