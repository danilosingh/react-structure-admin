import React from 'react';
import ReactDOM from 'react-dom';
import { createBrowserHistory } from 'history';
import { ConnectedRouter } from 'connected-react-router';
import { Provider } from 'react-redux';
import { Switch } from 'react-router-dom';
import { updateResourceState } from 'react-structure-admin';
import rootStore from './rootStore';
import {
  authInitialState,
  configManager,
  AuthContextProvider,
  Routes
} from 'react-structure-admin';

import config from './config';

// import App from './App';

const initialState = {
  resources: [],
  auth: authInitialState
};

configManager.setConfig({
  apiUrl: 'https://localhost:44330/api/v1',
  multiTenant: { enabled: true, host: 'a' }
});
console.log(updateResourceState);
const history = createBrowserHistory();
const store = rootStore(initialState, history);

ReactDOM.render(
  <Provider store={store}>
    <ConnectedRouter history={history}>
      <AuthContextProvider>
        <Switch>
          <Routes routes={config.routes} isContainer={false} />
        </Switch>
      </AuthContextProvider>
    </ConnectedRouter>
  </Provider>,
  document.getElementById('root')
);
