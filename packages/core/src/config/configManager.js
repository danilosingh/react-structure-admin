import { APP_ADMIN } from '../constants/application';

export default class configManager {
  static config = {
    pageSize: 10,
    multiTenant: { enabled: false, host: 'a' },
    apiUrl: null,
    currentApp: APP_ADMIN,
    roles: []
  };

  static setConfig(cfg) {
    this.config = { ...this.config, ...cfg };
  }

  static getConfig() {
    return this.config;
  }
}
