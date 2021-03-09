import { useDispatch, useSelector } from 'react-redux';
import { useCallback } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import qs from 'query-string';
import { isEmpty } from '../util';
import * as resourceActions from '../store/actions/resourceActions';
import { defaultResourceState } from '../store/reducers/normalizeResourceState';

const useCrud = ({
  resource,
  tenant,
  fetch: customFetch,
  get: customGet,
  cancelEdit: customCancelEdit,
  currentAttr = 'resourceToEdit',
  loading = false,
  useQueryStringParams = true,
  fixedQueryParams
}) => {
  const dispatch = useDispatch();
  const history = useHistory();
  const location = useLocation();

  const resourceState = useSelector((state) => {
    return state.resources[resource]
      ? state.resources[resource]
      : { ...defaultResourceState, loading };
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

  if (!isEmpty(fixedQueryParams)) {
    queryParams = { ...queryParams, ...fixedQueryParams };
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
          : resourceActions.fetch(resource, queryParams, onSuccess, tenant)
      ),
    [dispatch, resource, tenant, customFetch, JSON.stringify(queryParams)] // eslint-disable-line react-hooks/exhaustive-deps
  );

  const unload = useCallback(() => dispatch(resourceActions.unload(resource)), [
    dispatch,
    resource
  ]);

  const unloadCurrent = useCallback(
    () => dispatch(resourceActions.unloadCurrent(resource, currentAttr)),
    [dispatch, resource, currentAttr]
  );

  const create = useCallback(
    (params) => dispatch(resourceActions.initializeCreate(resource, params)),
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
          : resourceActions.get(resource, id, params, onSuccess, tenant)
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
          tenant
        )
      ),
    [dispatch, resource, tenant, setQueryParams]
  );

  const update = useCallback(
    (id, params, onSuccess) =>
      dispatch(resourceActions.update(resource, id, params, onSuccess, tenant)),
    [dispatch, resource, tenant]
  );

  const remove = useCallback(
    (id) =>
      dispatch(
        resourceActions.remove(
          resource,
          id,
          () => setQueryParams({ page: 1 }),
          tenant
        )
      ),
    [dispatch, resource, tenant, setQueryParams]
  );

  const cancelEdit = useCallback(
    () => {
      return dispatch(
        customCancelEdit
          ? customCancelEdit(resource)
          : resourceActions.cancelEdit(resource)
      )
    }   

      ,
    [dispatch, resource]
  );

  const paginationChanged = (current) => {
    let params;
    if (location.search && location.search !== '') {
      params = qs.parse(location.search);

      if (params.page) {
        delete params.page;
      }
    }

    if (current > 1) {
      params = { ...queryParams, ...params, page: current };
    }

    setQueryParams(params);
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
