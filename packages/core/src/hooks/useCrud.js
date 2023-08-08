import { useDispatch, useSelector } from 'react-redux';
import { useCallback } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import qs from 'query-string';
import { isEmpty } from '../util';
import * as resourceActions from '../store/actions/resourceActions';
import {
  defaultResourceState,
  defaultResourcePagination
} from '../store/reducers/normalizeResourceState';
import configManager from '../config/configManager';
import isEmptyParams from '../util/isEmptyParams';

const useCrud = ({
  resource,
  tenant,
  fetch: customFetch,
  get: customGet,
  cancelEdit: customCancelEdit,
  currentAttr = 'resourceToEdit',
  loading = false,
  useQueryStringParams = true,
  defaultQueryParams,
  fixedQueryParams,
  onBuildQueryParams,
  endpoint
}) => {
  const dispatch = useDispatch();
  const history = useHistory();
  const location = useLocation();

  const resourceState = useSelector((state) => {
    return state.resources[resource]
      ? state.resources[resource]
      : {
          ...defaultResourceState,
          pagination: {
            ...defaultResourcePagination,
            pageSize: configManager.getConfig().pageSize
          },
          loading
        };
  });

  let { pagination, queryParams = {} } = resourceState;

  if (useQueryStringParams) {
    const queryStringParams =
      location.search !== '' ? qs.parse(location.search) : {};

    if (queryStringParams.page) {
      pagination = {
        ...pagination,
        current: parseInt(queryStringParams.page, 10)
      };
    }

    const queryStringParamsJSON = JSON.stringify(queryStringParams);

    if (JSON.stringify(queryParams) !== queryStringParamsJSON) {
      queryParams = queryStringParams;
    }
  }

  if (
    !isEmpty(defaultQueryParams) &&
    (isEmpty(queryParams) || isEmptyParams(queryParams))
  ) {
    queryParams = { ...queryParams, ...defaultQueryParams };
  }

  if (!isEmpty(fixedQueryParams)) {
    queryParams = { ...queryParams, ...fixedQueryParams };
  }

  if (onBuildQueryParams) {
    queryParams = onBuildQueryParams(queryParams);
  }

  const setQueryParams = useCallback(
    (params = {}, removeEmptyValues = true) => {
      if (!isEmpty(fixedQueryParams)) {
        params = { ...params, ...fixedQueryParams };
      }

      if (removeEmptyValues) {
        Object.keys(params).forEach(
          (key) => isEmpty(params[key]) && delete params[key]
        );
      }

      dispatch(
        resourceActions.setQueryParams(resource, params, () => {
          if (useQueryStringParams) {
            history.push({
              pahtname: `/${resource}`,
              search: !isEmpty(params)
                ? qs.stringify(params, {
                    arrayFormat: 'repeat',
                    skipNull: true
                  })
                : ''
            });
          }

          return params;
        })
      );
    },
    [resource, dispatch, history]
  );

  const fetch = useCallback(
    (onSuccess) =>
      dispatch(
        customFetch
          ? customFetch(resource, queryParams, tenant)
          : resourceActions.fetch(
              resource,
              queryParams,
              onSuccess,
              tenant,
              endpoint
            )
      ),
    [dispatch, resource, tenant, customFetch, JSON.stringify(queryParams)] // eslint-disable-line react-hooks/exhaustive-deps
  );

  const unload = useCallback(
    () => dispatch(resourceActions.unload(resource)),
    [dispatch, resource]
  );

  const unloadCurrent = useCallback(
    () => dispatch(resourceActions.unloadCurrent(resource, currentAttr)),
    [dispatch, resource, currentAttr]
  );

  const create = useCallback(
    (initialValues, params) =>
      dispatch(
        resourceActions.initializeCreate(resource, initialValues, params)
      ),
    [dispatch, resource]
  );

  const setCurrent = useCallback(
    (params) =>
      dispatch(resourceActions.setCurrent(resource, params, currentAttr)),
    [dispatch, resource, currentAttr]
  );

  const get = useCallback(
    (id, params = {}, onSuccess) =>
      dispatch(
        customGet
          ? customGet(id, params)
          : resourceActions.get(
              resource,
              id,
              params,
              onSuccess,
              tenant,
              endpoint
            )
      ),
    [dispatch, customGet, resource]
  );

  const post = useCallback(
    (params, onSuccess) =>
      dispatch(
        resourceActions.create(
          resource,
          params,
          onSuccess || (() => setQueryParams({ page: 1 })),
          tenant,
          endpoint
        )
      ),
    [dispatch, resource, tenant, setQueryParams]
  );

  const update = useCallback(
    (id, params, onSuccess) =>
      dispatch(
        resourceActions.update(
          resource,
          id,
          params,
          onSuccess,
          tenant,
          endpoint
        )
      ),
    [dispatch, resource, tenant]
  );

  const remove = useCallback(
    (id) =>
      dispatch(
        resourceActions.remove(
          resource,
          id,
          () => setQueryParams({ page: 1 }),
          tenant,
          endpoint
        )
      ),
    [dispatch, resource, tenant, setQueryParams]
  );

  const cancelEdit = useCallback(() => {
    return dispatch(
      customCancelEdit
        ? customCancelEdit(resource)
        : resourceActions.cancelEdit(resource)
    );
  }, [dispatch, resource]);

  const paginationChanged = (current) => {
    let params = {};

    if (useQueryStringParams && location.search && location.search !== '') {
      params = qs.parse(location.search);
    }

    setQueryParams({
      ...queryParams,
      ...params,
      page: current,
      ...(fixedQueryParams ?? {})
    });
  };

  return {
    get,
    create,
    fetch,
    post,
    update,
    remove,
    unload,
    unloadCurrent,
    cancelEdit,
    data: resourceState,
    pagination,
    setCurrent,
    paginationChanged,
    queryParams,
    setQueryParams
  };
};

export default useCrud;
