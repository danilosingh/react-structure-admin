import React, { Suspense } from 'react';
import { Switch } from 'react-router-dom';
import { logDebug } from '../util/logger';
import { buildPath } from './util/buildPath';
import RestrictedRoute from './RestrictedRoute';
import RouteRedirect from './RouteRedirect';
import SimpleRoute from './SimpleRoute';

const WrappedRoute = (props) => {
  const { route, isContainer, onBeforeRouteRender } = props;
  const { roles = [] } = route;
  let { basePath } = props;

  basePath = buildPath(basePath, route.path);

  logDebug(`ROUTE: ${basePath}.`);

  const renderRoute = (routeProps) => {
    if (onBeforeRouteRender) {
      const result = onBeforeRouteRender({ basePath, route, routeProps });
      if (result) {
        return result;
      }
    }
    return <route.component {...route} basePath={basePath} {...routeProps} />;
  };
  
  const isContainerAux = route.isContainer ?? isContainer;
  console.log(isContainerAux);
  console.log(route);

  return route.redirectTo ? (
    <SimpleRoute
      basePath={basePath}
      route={route}
      render={() => <RouteRedirect to={route.redirectTo} />}
    />
  ) : (
    <>
      {roles && roles.length > 0 ? (
        <RestrictedRoute
          roles={roles}
          key={basePath}
          exact={route.exact || false}
          path={`${basePath}`}
          render={renderRoute}
        />
      ) : (
        <SimpleRoute basePath={basePath} route={route} render={renderRoute} />
      )}
      {isContainerAux && route.routes && (
        <Routes
          key={`container_${basePath}`}
          routes={route.routes}
          roles={route.roles || roles}
          basePath={basePath}
          isContainer={isContainerAux}
          onBeforeRouteRender={onBeforeRouteRender}
        />
      )}
    </>
  );
};

const Routes = (props) => {
  const {
    routes = [],
    roles = [],
    basePath = '',
    isContainer,
    onBeforeRouteRender
  } = props;

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
            onBeforeRouteRender={onBeforeRouteRender}
          />
        ))}
      </Suspense>
    </Switch>
  );
};

export default Routes;
