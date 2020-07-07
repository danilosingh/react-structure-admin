const isGuid = (value) => {
  if (!value) {
    return false;
  }

  const pattern = new RegExp(
    '^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$',
    'i'
  );

  return pattern.test(value);
};

export default isGuid;
