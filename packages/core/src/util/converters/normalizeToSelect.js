const defaultProps = {
  key: 'id',
  label: 'name'
};

const isFunction = (functionToCheck) => {
  return (
    functionToCheck && {}.toString.call(functionToCheck) === '[object Function]'
  );
};

const getNormalizedData = (value, props) => {
  const { key, label } = props;
  return {
    key: isFunction(key) ? label(value) : value[key],
    label: isFunction(label) ? label(value) : value[label],
    item: value
  };
};

const normalizeToSelect = (value, props = defaultProps) => {
  if (!value) {
    return undefined;
  }

  if (Array.isArray(value)) {
    return value.map((c) => getNormalizedData(c, props));
  }

  return getNormalizedData(value, props);
};

export default normalizeToSelect;
