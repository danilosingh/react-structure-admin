import axios from 'axios';
import qs from 'query-string';
import HttpErrorResponseModel from './HttpErrorResponseModel';

axios.defaults.paramsSerializer = (params) => {
  return qs.stringify(params, { arrayFormat: 'repeat' });
};

const RequestMethod = {
  GET: 'GET',
  POST: 'POST',
  PUT: 'PUT',
  DELETE: 'DELETE',
  OPTIONS: 'OPTIONS',
  HEAD: 'HEAD',
  Patch: 'PATCH'
};

function delay(duration = 250) {
  return new Promise((resolve) => setTimeout(resolve, duration));
}

function fillInErrorWithDefaults(error, request) {
  const model = new HttpErrorResponseModel();
  model.status = error.status || 0;
  model.message =
    error.message || 'Ocorreu um erro inesperado ao processar sua solicitação';
  model.errors =
    error.errors.length > 0
      ? error.errors
      : [
          { message: 'Ocorreu um erro inesperado ao processar sua solicitação' }
        ];
  model.url = error.url || request.url;
  model.raw = error.raw;

  // Remove anything with undefined or empty strings.
  model.errors = model.errors.filter(Boolean);

  return model;
}

function getAuthorizationHeader() {
  const token = localStorage.getItem('auth_accesstoken');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export async function performRequest(restRequest, config) {
  if (!restRequest.url) {
    // eslint-disable-next-line no-console
    console.error(
      `Received ${restRequest.url} which is invalid for a endpoint url`
    );
  }

  try {
    const headers = {
      'Content-Type': 'application/json',
      ...getAuthorizationHeader(),
      ...config?.headers
    };

    const axiosRequestConfig = {
      ...config,
      method: restRequest.method,
      url: restRequest.url,
      headers
    };
    const [axiosResponse] = await Promise.all([
      axios(axiosRequestConfig),
      delay()
    ]);

    const { status, data, request } = axiosResponse;

    if (data.success === false) {
      return fillInErrorWithDefaults(
        {
          status,
          message: data.errors.join(' - '),
          errors: data.errors,
          url: request ? request.responseURL : restRequest.url,
          raw: axiosResponse
        },
        restRequest
      );
    }

    return {
      ...axiosResponse
    };
  } catch (error) {
    if (error.response) {
      const { status, statusText, data } = error.response;
      // eslint-disable-next-line no-prototype-builtins
      const errors = data.hasOwnProperty('errors')
        ? [...data.errors]
        : statusText && statusText !== ''
        ? [{ message: statusText }]
        : [];

      return fillInErrorWithDefaults(
        {
          status,
          message: errors
            .filter(Boolean)
            .map((item) => item.message)
            .join(' - '),
          errors,
          url: error.request.responseURL,
          raw: error.response
        },
        restRequest
      );
    }
    if (error.request) {
      const { status, statusText, responseURL } = error.request;
      
      return fillInErrorWithDefaults(
        {
          status,
          message: statusText,
          errors: statusText !== '' ? [{ message: statusText }] : [],
          url: responseURL,
          raw: error.request
        },
        restRequest
      );
    }

    // Something happened in setting up the request that triggered an Error
    return fillInErrorWithDefaults(
      {
        status: 0,
        message: error.message,
        errors: [{ message: error.message }],
        url: restRequest.url,
        raw: error
      },
      restRequest
    );
  }
}

export async function get(endpoint, params, requestConfig) {
  const paramsConfig = params ? { params } : undefined;

  return performRequest(
    {
      url: endpoint,
      method: RequestMethod.GET
    },
    {
      ...paramsConfig,
      ...requestConfig
    }
  );
}

export async function post(endpoint, data, requestConfig) {
  return performRequest(
    {
      url: endpoint,
      method: RequestMethod.POST
    },
    {
      ...requestConfig,
      ...(data ? { data } : undefined)
    }
  );
}

export async function put(endpoint, data, requestConfig) {
  return performRequest(
    {
      url: endpoint,
      method: RequestMethod.PUT
    },
    {
      ...requestConfig,
      ...(data ? { data } : undefined)
    }
  );
}

export async function del(endpoint, requestConfig) {
  return performRequest(
    {
      url: endpoint,
      method: RequestMethod.DELETE
    },
    requestConfig
  );
}
