import React from 'react';
import { message } from 'antd';

import {
  RESOURCE_UPDATE_FINISHED,
  RESOURCE_CREATE_FINISHED,
  RESOURCE_DELETE_FINISHED
} from '../store/actions/resourceActions';

const getPage = (actionType, state) => {
  if (actionType === RESOURCE_CREATE_FINISHED) {
    return 1;
  }

  if (
    actionType === RESOURCE_DELETE_FINISHED &&
    state.items.length === 1 &&
    state.pagination.current > 1
  ) {
    return state.pagination.current - 1;
  }

  return state.pagination.current;
};

const messageMiddleware = () => next => action => {
  // if (action.error) {
  //   if (action.type.startsWith('AUTH_')) {
  //     setTimeout(() => message.error(action.payload.message), 200);
  //   } else if (action.payload.status == 500 || action.payload.status == 0) {
  //     setTimeout(
  //       () =>
  //         message.error(
  //           <>
  //             Ocorreu um erro inesperado ao processar a solicitação. <br />
  //             <small>
  //               Tente novamente, se o erro persistir entre em contato conosco.
  //             </small>
  //           </>
  //         ),
  //       300
  //     );
  //   }
  //   return next(action);
  // }

  // if (
  //   action.type === RESOURCE_CREATE_FINISHED ||
  //   action.type === RESOURCE_UPDATE_FINISHED ||
  //   action.type === RESOURCE_DELETE_FINISHED
  // ) {
  //   const text =
  //     action.type === RESOURCE_DELETE_FINISHED ? 'removido' : 'salvo';

  //   setTimeout(() => message.success(`Registro ${text} com sucesso.`), 300);
  // }

  return next(action);
};

export default messageMiddleware;
