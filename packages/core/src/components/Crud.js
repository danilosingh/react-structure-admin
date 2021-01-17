import React from 'react';
import { useCrud } from '../hooks';
import CrudContainer from './CrudContainer';

const Crud = ({
  path,
  resource,
  fetch,
  get,
  match,
  fixedQueryParams,
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
    <CrudContainer
      basePath={basePath}
      resource={resource}
      {...rest}
      {...useCrud({ resource, fetch, get, fixedQueryParams })}
    />
  );
};

export default Crud;
