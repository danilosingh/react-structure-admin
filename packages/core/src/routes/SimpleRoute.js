import React from 'react';
import { Route } from 'react-router-dom';

const SimpleRoute = ({ basePath, route, ...rest }) => {
  return (
    <Route
      key={basePath}
      path={`${basePath}`}
      exact={route?.exact || false}
      basePath={basePath}
      {...rest}
    />
  );
};

export default SimpleRoute;
