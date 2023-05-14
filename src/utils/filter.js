import {FilterType} from '../consts.js';
import {isPointPast, isPointPresent, isPointFuture} from './point.js';

const filter = {
  [FilterType.EVERYTHING]: (points) => [...points],
  [FilterType.PAST]: (points) => points.filter((point) => isPointPast(point)),
  [FilterType.PRESENT]: (points) => points.filter((point) => isPointPresent(point)),
  [FilterType.FUTURE]: (points) => points.filter((point) => isPointFuture(point))
};

export {filter};
