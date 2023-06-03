import {getRandomArrayElement} from './utils.js';
import {getRandomDestination} from './destinations.js';
import {getRandomOffers} from './offers.js';

const mockPoints = [
  {
    'id': 1,
    'basePrice': 20,
    'dateFrom': '2023-05-09T10:30:00.000Z',
    'dateTo': '2023-05-09T11:00:00.000Z',
    'destination': getRandomDestination(),
    'isFavorite': false,
    'offers': getRandomOffers('taxi'),
    'type': 'taxi'
  },
  {
    'id': 2,
    'basePrice': 30,
    'dateFrom': '2023-05-21T22:00:00.000Z',
    'dateTo': '2023-05-23T02:20:00.000Z',
    'destination': getRandomDestination(),
    'isFavorite': true,
    'offers': getRandomOffers('taxi'),
    'type': 'taxi'
  },
  {
    'id': 3,
    'basePrice': 160,
    'dateFrom': '2023-05-10T22:00:00.000Z',
    'dateTo': '2023-05-10T22:20:00.000Z',
    'destination': getRandomDestination(),
    'isFavorite': false,
    'offers': getRandomOffers('check-in'),
    'type': 'check-in'
  },
  {
    'id': 4,
    'basePrice': 180,
    'dateFrom': '2023-05-14T12:00:00.000Z',
    'dateTo': '2023-05-15T14:40:00.000Z',
    'destination': getRandomDestination(),
    'isFavorite': true,
    'offers': getRandomOffers('flight'),
    'type': 'flight'
  }
];

function getRandomPoint() {
  return getRandomArrayElement(mockPoints);
}

export {mockPoints, getRandomPoint};
