const formartNumberNationalCouncilOfJustice = (number) => {
  if (!number) {
    return number;
  }

  return number.replace(
    /(\d{7})(\d{2})(\d{4})(\d{1})(\d{2})(\d{4})/g,
    '$1-$2.$3.$4.$5.$6'
  );
};

export default formartNumberNationalCouncilOfJustice;
