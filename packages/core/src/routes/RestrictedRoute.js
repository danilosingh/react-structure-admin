import React from 'react';
import { Redirect, Route } from 'react-router-dom';
import configManager from '../config/configManager';
import { useAuthContext } from '../auth';
import { logDebug } from '../util/logger';

const RestrictedRoute = ({ roles, ...rest }) => {
  const { isAuthenticated, user } = useAuthContext();
  const config = configManager.getConfig();

  if (!isAuthenticated) {
    localStorage.removeItem('tenantId'); //todo
    return <Route {...rest} render={() => <Redirect to="/signin" />} />;
  }

  if (roles && !roles.find((c) => c === user.role || c === '*')) {
    const role =
      config.roles.find((c) => c.name === user.role) ||
      config.roles.find((c) => c.name === `*`);

    if (role && role.defaultPath) {
      return (
        <Route {...rest} render={() => <Redirect to={role.defaultPath} />} />
      );
    } else {
      return <Route {...rest} render={() => <Redirect to="/" />} />;
    }
  }

  return <Route {...rest} />;
};

export default RestrictedRoute;
