import React from 'react';
import { useCrud } from '../hooks';
import InternalCrud from './InternalCrud';

const Resource = ({
  path,
  resource,
  fetch,
  match,
  fixedQueryParams,
  onBuildQueryParams,
  ...rest
}) => {
  const basePath = match ? match.path : '';

  if (path && !resource) {
    if (path.startsWith('/')) {
      path = path.substr(1, path.length - 1);
    }

    resource = path;
  }

  return (
    <InternalCrud
      basePath={basePath}
      resource={resource}
      {...rest}
      {...useCrud({ resource, fetch, fixedQueryParams, onBuildQueryParams })}
    />
  );
};

export default Resource;
