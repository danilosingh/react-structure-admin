import React, { Suspense } from 'react';
import { Switch, Route, useHistory } from 'react-router-dom';
import RestrictedRoute from './RestrictedRoute';
import { buildPath } from './util/buildPath';

const CustomRedirect = ({ to }) => {
  useHistory().push(to);
  return null;
};

const WrappedRoute = (props) => {
  const { route, match, isContainer } = props;
  const { roles = [] } = route;
  let { basePath } = props;

  basePath = buildPath(basePath, route.path);

  return route.redirectTo ? (
    <Route
      key={basePath}
      path={`${basePath}`}
      exact={route.exact || false}
      basePath={basePath}
      render={() => <CustomRedirect to={route.redirectTo} />}
    />
  ) : (
    <>
      {roles && roles.length > 0 ? (
        <RestrictedRoute
          roles={roles}
          key={basePath}
          exact={route.exact || false}
          path={`${basePath}`}
          render={(componentProps) => (
            <route.component
              {...route}
              basePath={basePath}
              {...componentProps}
            />
          )}
        />
      ) : (
        <Route
          key={basePath}
          path={`${basePath}`}
          exact={route.exact || false}
          basePath={basePath}
          render={(componentProps) => (
            <route.component
              {...route}
              basePath={basePath}
              {...componentProps}
            />
          )}
        />
      )}
      {isContainer && route.routes && (
        <Routes
          key={`container_${basePath}`}
          match={match}
          routes={route.routes}
          roles={route.roles || roles}
          basePath={basePath}
          isContainer={isContainer}
        />
      )}
    </>
  );
};

const Routes = (props) => {
  const { routes = [], roles = [], basePath = '', isContainer, match } = props;

  return (
    <Switch>
      <Suspense fallback={<div>Carregando...</div>}>
        {routes.map((route) => (
          <WrappedRoute
            key={`wrapped_route_${basePath}_${route.path}`}
            route={route}
            roles={roles}
            basePath={basePath}
            isContainer={isContainer}
            match={match}
          />
        ))}
      </Suspense>
    </Switch>
  );
};

export default Routes;
