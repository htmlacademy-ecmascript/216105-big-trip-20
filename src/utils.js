import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
dayjs.extend(duration);

const DATE_FORMAT = 'MMM D';
const TIME_FORMAT = 'hh:mm';
const DATE_TIME_FORMAT = 'DD/MM/YY HH:mm';

function humanizePointDay(pointDate) {
  return dayjs(pointDate).format(DATE_FORMAT);
}

function humanizePointTime(pointDate) {
  return dayjs(pointDate).format(TIME_FORMAT);
}

function humanizeEditPointTime(pointDate) {
  return dayjs(pointDate).format(DATE_TIME_FORMAT);
}

function getPointDuration(dateFrom, dateTo) {
  const timeDiff = dayjs(dateTo).diff(dayjs(dateFrom));
  const pointDuration = dayjs.duration(timeDiff);

  if (timeDiff >= 1000 * 60 * 60 * 24) {
    return pointDuration.format('DD[D] HH[H] mm[M]');
  }

  if (timeDiff >= 1000 * 60 * 60) {
    return pointDuration.format('HH[H] mm[M]');
  }

  return pointDuration.format('mm[M]');
}

function capitalizeFirstLetter(str) {
  return str.substring(0, 1).toUpperCase() + str.substring(1);
}

export {humanizePointDay, humanizePointTime, humanizeEditPointTime, getPointDuration, capitalizeFirstLetter};
