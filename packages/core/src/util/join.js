const join = (arr = [], middleSeparator = ', ', lastSeparator = null) => {
  const count = arr.length;

  if (lastSeparator) {
    return `${arr.slice(0, -1).join(middleSeparator)}${lastSeparator}${
      arr[count - 1]
    }`;
  }
  return arr.join(middleSeparator);
};

export default join;
