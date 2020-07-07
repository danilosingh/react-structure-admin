const fieldsDefault = {
  inputKey: 'id',
  inputLabel: 'name'
};

const isFunction = (functionToCheck) => {
  return (
    functionToCheck && {}.toString.call(functionToCheck) === '[object Function]'
  );
};

const getNormalizedData = (object, fields) => {
  const { inputKey, inputLabel } = fields;
  return {
    key: isFunction(inputKey) ? inputLabel(object) : object[inputKey],
    label: isFunction(inputLabel) ? inputLabel(object) : object[inputLabel],
    item: object
  };
};

const normalizeToSelect = (objects, fields = fieldsDefault) => {
  if (!objects) {
    return undefined;
  }

  if (Array.isArray(objects)) {
    return objects.map((c) => getNormalizedData(c, fields));
  }

  return getNormalizedData(objects, fields);
};

export default normalizeToSelect;
