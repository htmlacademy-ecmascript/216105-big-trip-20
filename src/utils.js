import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
dayjs.extend(duration);

const DATE_FORMAT = 'MMM D';
const TIME_FORMAT = 'hh:mm';
const DATE_TIME_FORMAT = 'DD/MM/YY HH:mm';

function getRandomArrayElement(items) {
  return items[Math.floor(Math.random() * items.length)];
}

function humanizePointDay(pointDate) {
  return dayjs(pointDate).format(DATE_FORMAT);
}

function humanizePointTime(pointDate) {
  return dayjs(pointDate).format(TIME_FORMAT);
}

function humanizeEditPointTime(pointDate) {
  return dayjs(pointDate).format(DATE_TIME_FORMAT);
}

function getDuration(start, end) {
  const durationObj = dayjs.duration(new Date(end) - new Date(start)).$d;
  let durationStr = `${addLeadingZero(durationObj.minutes)}M`;

  if (durationObj.hours) {
    durationStr = `${addLeadingZero(durationObj.hours)}H ${durationStr}`;
  }

  if (durationObj.days) {
    durationStr = `${addLeadingZero(durationObj.days)}D ${durationStr}`;
  }

  return durationStr;
}

function capitalizeFirstLetter(str) {
  return str.substring(0, 1).toUpperCase() + str.substring(1);
}

function addLeadingZero(num) {
  if (typeof num === 'number') {
    num = num.toString();
  }

  if (num.length < 2) {
    return `0${num}`;
  }

  return num;
}

export {getRandomArrayElement, humanizePointDay, humanizePointTime, humanizeEditPointTime, getDuration, capitalizeFirstLetter};
