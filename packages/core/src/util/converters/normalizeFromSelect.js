const fieldsDefault = {
  outKey: 'id',
  outLabel: 'name'
};

const getNormalizedData = (object, fields) => {
  const { outKey, outLabel } = fields;
  return {
    [outKey]: object.key,
    [outLabel]: object.label
  };
};

const normalizeFromSelect = (objects, fields = fieldsDefault) => {
  if (!objects) {
    return undefined;
  }

  if (Array.isArray(objects)) {
    return objects.map((c) => getNormalizedData(c, fields));
  }

  return getNormalizedData(objects, fields);
};

export default normalizeFromSelect;
