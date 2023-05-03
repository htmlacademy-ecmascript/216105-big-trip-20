import {mockDestinations} from '../mock/destinations.js';


export default class DestinationsModel {
  getDestinationsList() {
    return mockDestinations;
  }

  getDestinationById(id) {
    return mockDestinations.find((destination) => destination.id === id);
  }
}
