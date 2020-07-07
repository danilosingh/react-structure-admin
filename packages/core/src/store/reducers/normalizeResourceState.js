export const defaultResourcePagination = {
  total: 0,
  pageSize: 10,
  current: 1,
  showSizeChanger: false,
  showLessItems: true,
  showTotal: (total) => {
    if (total === 0) {
      return undefined;
    }
    return `${total} ${total === 1 ? 'registro' : 'registros'}`;
  }
};

export const defaultResourceState = {
  totalCount: 0,
  items: [],
  pagination: defaultResourcePagination,
  isEditing: false,
  loading: false,
  readOnly: false,
  loaded: false,
  resourceToEdit: {}
};

export const normalizeResourceState = (state, resource) => {
  if (!state[resource]) {
    state[resource] = { ...defaultResourceState };
  }

  return state;
};
