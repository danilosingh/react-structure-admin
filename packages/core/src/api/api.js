import { APP_ADMIN } from '../constants/application';
import configManager from '../config/configManager';
import * as http from './http';

const getResource = (resource) => {
  return resource.startsWith('/') ? resource : `/${resource}`;
};

const getResourceParams = (resource, params) => {
  if (resource) {
    const keys = resource.match(/:[^\s/]+/g);

    if (keys) {
      keys.forEach((key) => {
        const item = key.substring(1);
        const value = params[item];
        if (value !== undefined) {
          resource = resource.replace(key, value);
          delete params[item];
        }
      });
    }
  }

  return { resource, params };
};

function getTenant() {
  if (localStorage.getItem('currentApp') === APP_ADMIN) {
    return null;
  }
  return localStorage.getItem('tenantId');
}

export const getBaseUrl = () => {
  const config = configManager.getConfig();
  const baseUrl = `${config.apiUrl}/{tenant}`;

  if (!config.multiTenant.enabled) {
    return baseUrl.replace('/{tenant}', '');
  }

  return baseUrl.replace('{tenant}', getTenant() || config.multiTenant.host);
};

export const getUrlFromResource = (resource) => {
  return `${getBaseUrl()}${getResource(resource)}`;
};

export async function get(resource, id, requestConfig) {
  return http.get(`${getUrlFromResource(resource)}/${id}`, null, requestConfig);
}

export async function fetch(resource, params, requestConfig) {
  const base = getResourceParams(resource, params);
  return http.get(
    `${getUrlFromResource(base.resource)}`,
    base.params,
    requestConfig
  );
}

export async function safeFetch(resource, params, requestConfig) {
  const result = await fetch(resource, params, requestConfig);
  return result.status !== 200 ? [] : result.data.result.items;
}

export async function post(resource, data) {
  const base = getResourceParams(resource, data);
  return http.post(`${getUrlFromResource(base.resource)}`, base.params);
}

export async function put(resource, data) {
  const base = getResourceParams(resource, data);
  return http.put(`${getUrlFromResource(base.resource)}`, base.params);
}

export async function del(resource, id) {
  return http.del(`${getUrlFromResource(resource)}/${id}`);
}
