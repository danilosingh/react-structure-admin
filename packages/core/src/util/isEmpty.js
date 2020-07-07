export function isEmpty(value) {
  return (
    // null or undefined
    value == null ||
    // has length and it's zero
    // eslint-disable-next-line no-prototype-builtins
    (Array.isArray(value) && value.length === 0) ||
    // is an Object and has no keys
    (value.constructor === Object && Object.keys(value).length === 0)
  );
}
