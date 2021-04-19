/* eslint-disable react/prefer-es6-class */
/* eslint-disable react/prefer-stateless-function */

import React, { useEffect } from 'react';
import createReactClass from 'create-react-class';
import { useCrud } from '../hooks';

const pathToResource = (path) => {
  if (path.startsWith('/')) {
    path = path.substr(1, path.length - 1);
  }

  return path;
};
const WrapList = ({
  children,
  path,
  get,
  fetch: customFetch,
  useQueryStringParams,
  fixedQueryParams,
  defaultQueryParams,
  unloadOnUnmount = true,
  ...rest
}) => {
  let { resource } = rest;

  if (path && !resource) {
    resource = pathToResource(path);
  }

  const crud = useCrud({
    resource,
    get,
    fetch: customFetch,
    useQueryStringParams,
    fixedQueryParams,
    defaultQueryParams
  });
  const {
    data: { loaded, loading },
    fetch,
    unload
  } = crud;

  useEffect(() => {
    if (!loaded && !loading) {
      fetch();
    }
  }, [loaded, loading, fetch]);

  useEffect(() => {
    return () => {
      if (unloadOnUnmount) {
        unload();
      }
    };
  }, [resource, unload, unloadOnUnmount]);

  return (
    <>
      {React.cloneElement(children, {
        ...crud,
        ...rest
      })}
    </>
  );
};

class List {
  static create(
    WrappedComponent,
    {
      resource,
      get,
      currentAttr,
      useQueryStringParams,
      fixedQueryParams,
      defaultQueryParams,
      title
    } = {}
  ) {
    return createReactClass({
      render() {
        return (
          <WrapList
            resource={resource}
            currentAttr={currentAttr}
            get={get}
            useQueryStringParams={useQueryStringParams}
            fixedQueryParams={fixedQueryParams}
            defaultQueryParams={defaultQueryParams}
            title={title}
            {...this.props}
          >
            <WrappedComponent />
          </WrapList>
        );
      }
    });
  }
}

export default List;
