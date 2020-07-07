import moment from 'moment';

const formatDateToNumber = (date, type) => {
  const postDate = moment(date);
  const currentDate = moment(new Date());
  const duration = moment.duration(currentDate.diff(postDate));

  switch (type) {
    case 'second':
      return Math.trunc(duration.asSeconds() || 0);
    case 'minute':
      return Math.trunc(duration.asMinutes() || 0);
    case 'hour':
      return Math.trunc(duration.asHours() || 0);
    case 'day':
      return Math.trunc(duration.asDays() || 0);
    case 'month':
      return Math.trunc(duration.asMonths() || 0);
    case 'year':
      return Math.trunc(duration.asYears() || 0);
    default:
      return undefined;
  }
};

export default formatDateToNumber;
