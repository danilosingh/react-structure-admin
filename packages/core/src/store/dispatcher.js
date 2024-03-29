import React from 'react';
import { message } from 'antd';
import HttpErrorResponseModel from '../api/HttpErrorResponseModel';
import {
  RESOURCE_UPDATE_FINISHED,
  RESOURCE_CREATE_FINISHED,
  RESOURCE_DELETE_FINISHED
} from './actions/resourceActionTypes';

const handleError = (result) => { 
  if (result) {
    if (result.errors && result.errors.length > 0) {
      message.error({
        content: (
          <div>
            {result.errors.map((c) => (
              <p>{c.message}</p>
            ))}
          </div>
        ),
        className: 'gx-ant-error-message'
      });
    } else if (result.message) {
      message.error(result.message);
    }
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
  onAfterEffect,
  onSuccess,
  onFail
}) => {
  dispatch(createAction(actionType, resource, payload));

  const model = await effect();
  const isError = model instanceof HttpErrorResponseModel;

  if (onAfterEffect) {
    onAfterEffect(model, isError);
  }

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
