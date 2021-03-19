const formartOnlyNumber = (number) => {
  if (!number) {
    return number;
  }
  
  const value = number.match(/\d+/g);

  if (value) {
    return value.join('');
  }

  return number;
};

export default formartOnlyNumber;
