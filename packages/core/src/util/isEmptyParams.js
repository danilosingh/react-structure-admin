const isEmptyParams = (params) => {
  var keys = Object.keys(params);
  return keys.length == 0 || (keys.length == 1 && keys.indexOf('page') >= 0);
};

export default isEmptyParams;
