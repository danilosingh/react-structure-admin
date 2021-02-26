import { combineReducers } from 'redux';
import { connectRouter } from 'connected-react-router';
import { resourceReducer, authReducer } from 'react-structure-admin';
import { concatReducers } from 'react-structure-admin';
import userReducer from './stores/users/userReducer';

const resourceRedurcers = concatReducers([resourceReducer, userReducer], []);

export default (history) => {
  const reducerMap = {
    router: connectRouter(history),
    resources: resourceRedurcers,
    auth: authReducer
  };

  return combineReducers(reducerMap);
};
