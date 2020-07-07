import moment from 'moment';

const formartDateTimeUTC = (date, format = 'DD/MM/YYYY HH:mm') => {
  return moment(date).format(format);
};

export default formartDateTimeUTC;
