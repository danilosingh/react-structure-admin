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
  globalEvents,
  AuthContextProvider,
  RouteRedirect,
  Routes
} from 'react-structure-admin';

import config from './config';
import './App.less';

// import App from './App';

const initialState = {
  resources: [],
  auth: authInitialState
};

configManager.setConfig({
  apiUrl: 'https://localhost:44381/api/v1',
  multiTenant: { enabled: true, host: 'a' },
  pageSize: 20,
  layout: {
    form: {
      labelCol: null,
      wrapperCol: null,
      layout: 'vertical'
    },
    list: {
      table: { size: 'middle' }
    }
  }
});
const history = createBrowserHistory();
const store = rootStore(initialState, history);
const onBeforeRouteRender = ({ route }) => {  
  return null;
};

globalEvents.registerEvent('drawerVisibleChanged', (args) => {
  
});

ReactDOM.render(
  <Provider store={store}>
    <ConnectedRouter history={history}>
      <AuthContextProvider>
        <Switch>
          <Routes
            routes={config.routes}
            isContainer={false}
            onBeforeRouteRender={onBeforeRouteRender}
          />
        </Switch>
      </AuthContextProvider>
    </ConnectedRouter>
  </Provider>,
  document.getElementById('root')
);
