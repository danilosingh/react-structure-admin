const defaultProps = {
  key: 'id',
  label: 'name'
};

const getNormalizedData = (value, props) => {
  const { key, label } = props;
  return {
    [key ?? defaultProps.key]: value.key,
    [label ?? defaultProps.label]: value.label
  };
};

const normalizeFromSelect = (value, props = defaultProps) => {
  if (!value) {
    return undefined;
  }

  if (Array.isArray(value)) {
    return value.map((c) => getNormalizedData(c, props));
  }

  return getNormalizedData(value, props);
};

export default normalizeFromSelect;
