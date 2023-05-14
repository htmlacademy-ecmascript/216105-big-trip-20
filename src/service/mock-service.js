import getRandomPoint from '../mock/points.js';
import {mockOffers} from '../mock/offers.js';
import {mockDestinations} from '../mock/destinations.js';

const POINTS_COUNT = 3;

export default class MockService {
  #points = [];
  #offers = [];
  #destinations = [];

  constructor() {
    this.#points = Array.from({length: POINTS_COUNT}, getRandomPoint);
    this.#offers = mockOffers;
    this.#destinations = mockDestinations;
  }

  get points() {
    return this.#points;
  }

  get offers() {
    return this.#offers;
  }

  get destinations() {
    return this.#destinations;
  }
}
