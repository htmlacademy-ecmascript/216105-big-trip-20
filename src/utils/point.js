import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import isBetween from 'dayjs/plugin/isBetween';
dayjs.extend(duration);
dayjs.extend(isBetween);

function capitalizeFirstLetter(str) {
  return str.substring(0, 1).toUpperCase() + str.substring(1);
}

function humanizePointDay(pointDate) {
  return dayjs(pointDate).format('MMM D');
}

function humanizePointTime(pointDate) {
  return dayjs(pointDate).format('HH:mm');
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

function isPointPast({dateTo}) {
  return dayjs().isAfter(dateTo);
}

function isPointPresent({dateFrom, dateTo}) {
  return dayjs().isBetween(dateFrom, dateTo, 'milliseconds', '[]');
}

function isPointFuture({dateFrom}) {
  return dayjs().isBefore(dateFrom);
}

export {
  capitalizeFirstLetter, humanizePointDay, humanizePointTime,
  getPointDuration, isPointPast, isPointPresent, isPointFuture
};
