const dateTypes = ['0001-01-01T00:00:00', '0001-01-01T00'];

const isNullOrEmpty = (value, type) => {
  if (!value || value == null) {
    return true;
  }

  switch (type) {
    case 'date':
      return dateTypes.includes(value);
    case 'guid':
      return value === '00000000-0000-0000-0000-000000000000';
    default:
      return value === '';
  }
};

export default isNullOrEmpty;
