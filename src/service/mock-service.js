import getRandomPoint from '../mock/points.js';
import {mockOffers} from '../mock/offers.js';
import {mockDestinations} from '../mock/destinations.js';

const POINTS_COUNT = 3;

export default class MockService {
  points = [];
  offers = [];
  destinations = [];

  constructor() {
    this.points = Array.from({length: POINTS_COUNT}, getRandomPoint);
    this.offers = mockOffers;
    this.destinations = mockDestinations;
  }

  getPoints() {
    return this.points;
  }

  getOffers() {
    return this.offers;
  }

  getDestinations() {
    return this.destinations;
  }
}
