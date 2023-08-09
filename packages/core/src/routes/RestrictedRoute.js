import React from 'react';
import { Redirect, Route } from 'react-router-dom';
import configManager from '../config/configManager';
import { useAuthContext } from '../auth';

const RestrictedRoute = ({ roles = [], features = [], ...rest }) => {
  const {
    isAuthenticated,
    user = {},
    features: userFeatures = []
  } = useAuthContext();
  const userRoles = user.role ? [user.role] : user.roles || [];

  const userHasRole = () => {
    return (
      roles.length == 0 ||
      roles.findIndex((c) => userRoles.includes(c) || c === '*') >= 0
    );
  };
  
  const userHasFeature = () => {
    return (
      features.length == 0 || features.findIndex((c) => userFeatures.includes(c)) >= 0
    );
  };

  const redirectToDefaultUserRoute = () => {
    const config = configManager.getConfig();

    const role =
      config.roles.find((c) => userRoles.includes(c.name)) ||
      config.roles.find((c) => c.name === `*`);

    if (role && role.defaultPath) {
      return (
        <Route {...rest} render={() => <Redirect to={role.defaultPath} />} />
      );
    } else {
      return <Route {...rest} render={() => <Redirect to="/" />} />;
    }
  };

  if (!isAuthenticated) {
    localStorage.removeItem('tenantId'); //todo
    return <Route {...rest} render={() => <Redirect to="/signin" />} />;
  }

  if (!userHasRole() || !userHasFeature()) {
    return redirectToDefaultUserRoute();
  }

  return <Route {...rest} />;
};

export default RestrictedRoute;
