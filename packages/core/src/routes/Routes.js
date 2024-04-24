import React, { Suspense } from 'react';
import { Switch } from 'react-router-dom';
import { logDebug } from '../util/logger';
import { buildPath } from './util/buildPath';
import RestrictedRoute from './RestrictedRoute';
import RouteRedirect from './RouteRedirect';
import SimpleRoute from './SimpleRoute';
import { useAuthContext } from '../auth';

const WrappedRoute = (props) => {
  const { route, isContainer, onBeforeRouteRender } = props;
  const { roles = [], features = [] } = route;
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

  if (route.redirectTo) {
    return (
      <SimpleRoute
        basePath={basePath}
        route={route}
        render={() => <RouteRedirect to={route.redirectTo} />}
      />
    );
  }

  return (
    <>
      {(roles && roles.length > 0) || (features && features.length > 0) ? (
        <RestrictedRoute
          features={features}
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
  const { features: userFeatures = [] } = useAuthContext();
  const {
    routes = [],
    roles = [],
    basePath = '',
    isContainer,
    onBeforeRouteRender
  } = props;

  const filter = ({ features = [] }) => {
    const userHasFeature = () => {
      return (
        features.length === 0 ||
        features.findIndex((c) => userFeatures.includes(c)) >= 0
      );
    };

    return userHasFeature();
  };

  const newRoutes = [
    ...routes.filter((c) => !c.redirectTo),
    routes.find((c) => c.redirectTo && filter(c))
  ];

  return (
    <Switch>
      <Suspense fallback={<div>Carregando...</div>}>
        {newRoutes.map((route) => (
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
