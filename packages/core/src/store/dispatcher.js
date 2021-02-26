import { message } from 'antd';
import HttpErrorResponseModel from '../api/HttpErrorResponseModel';
import {
  RESOURCE_UPDATE_FINISHED,
  RESOURCE_CREATE_FINISHED,
  RESOURCE_DELETE_FINISHED
} from './actions/resourceActionTypes';

const handleError = (result) => {
  if (result && result.message) {
    message.error(result.message);
  }
};

const showDefaultMessageSucces = (action) => {
  if (
    action.type === RESOURCE_CREATE_FINISHED ||
    action.type === RESOURCE_UPDATE_FINISHED ||
    action.type === RESOURCE_DELETE_FINISHED
  ) {
    const text =
      action.type === RESOURCE_DELETE_FINISHED ? 'removido' : 'salvo';

    setTimeout(() => message.success(`Registro ${text} com sucesso.`), 300);
  }
};

export const createAction = (
  type,
  resource,
  payload,
  error = false,
  meta = null
) => {
  alert(type);
  return {
    type,
    resource,
    payload,
    error,
    meta
  };
};

export const dispatchResouceAction = async ({
  dispatch,
  resource,
  payload,
  actionType,
  effect,
  onSuccess,
  onFail
}) => {
  dispatch(createAction(actionType, resource, payload));

  const model = await effect();
  const isError = model instanceof HttpErrorResponseModel;

  const fineshedAction = createAction(
    `${actionType}_FINISHED`,
    resource,
    model,
    isError
  );

  dispatch(fineshedAction);

  if (isError) {
    const errorHandled = onFail ? onFail(model, fineshedAction) : false;

    if (!errorHandled) {
      handleError(model);
    }
  } else {
    if (onSuccess) {
      onSuccess(model, fineshedAction);
    }

    showDefaultMessageSucces(fineshedAction);
  }

  return model;
};
