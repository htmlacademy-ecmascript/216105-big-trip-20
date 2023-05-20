import {SortTypes} from '../consts.js';
import dayjs from 'dayjs';

function getWeightForNullDate(dateA, dateB) {
  if (dateA === null && dateB === null) {
    return 0;
  }

  if (dateA === null) {
    return 1;
  }

  if (dateB === null) {
    return -1;
  }

  return null;
}

function sortByDay(pointA, pointB) {
  const weight = getWeightForNullDate(pointA.dateFrom, pointB.dateFrom);

  return weight ?? dayjs(pointA.dateFrom).diff(dayjs(pointB.dateFrom));
}

function sortByTime(pointA, pointB) {
  const durationA = dayjs(pointA.dateTo).diff(dayjs(pointA.dateFrom));
  const durationB = dayjs(pointB.dateTo).diff(dayjs(pointB.dateFrom));
  return durationA - durationB;
}

function sortByPrice(pointA, pointB) {
  return pointA.basePrice - pointB.basePrice;
}

const sortPoints = {
  [SortTypes.DAY]: (points) => points.sort(sortByDay),
  [SortTypes.TIME]: (points) => points.sort(sortByTime),
  [SortTypes.PRICE]: (points) => points.sort(sortByPrice),
  [SortTypes.EVENT]: () => {
    throw new Error('Sort by event is not implemented');
  },
  [SortTypes.OFFER]: () => {
    throw new Error('Sort by offer is not implemented');
  }
};

export {sortPoints};
