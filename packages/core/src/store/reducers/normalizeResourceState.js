import configManager from "../../config/configManager";

export const defaultResourcePagination = {
  total: 0,
  pageSize: 10,
  current: 1,
  showSizeChanger: false,
  showLessItems: true,
  showTotal: (total, range) => {
    if (total === 0) {
      return undefined;
    }
    return `Exibindo ${range[0]}-${range[1]} de ${total}`;
  }
};

export const defaultResourceState = {
  totalCount: 0,
  items: [],
  pagination: defaultResourcePagination,
  editing: false,
  loading: false,
  readOnly: false,
  loaded: false,
  loadingEdition: false,
  resourceToEdit: {}
};

export const normalizeResourceState = (state, resource) => {
  if (!state[resource]) {
    state[resource] = {
      ...defaultResourceState,
      pagination: {
        ...defaultResourcePagination,
        pageSize: configManager.getConfig().pageSize
      }
    };
  }

  return state;
};
