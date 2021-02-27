import { APP_ADMIN } from '../constants/application';
import { merge } from 'lodash';
export default class configManager {
  static config = {
    layout: {
      form: {
        labelCol: {
          xs: { span: 24 },
          sm: { span: 6 }
        },
        wrapperCol: {
          xs: { span: 24 },
          sm: { span: 18 }
        },
        layout: 'horizontal',
        validateMessages: {
          required: "${label} é obrigatório"         
        }
      },
      useSingularTitleOnEdit: true
    },
    pageSize: 10,
    multiTenant: { enabled: false, host: 'a' },
    apiUrl: null,
    currentApp: APP_ADMIN,
    roles: [],
    loggerLevel: "warn"
  };

  static setConfig(cfg) {
    merge(this.config, cfg);
  }

  static getConfig() {
    return this.config;
  }
}
