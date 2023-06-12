export default class DestinationsModel {
  #destinations = [];
  #service = null;

  constructor(service) {
    this.#service = service;
  }

  get destinations() {
    return this.#destinations;
  }

  async init() {
    try {
      this.#destinations = await this.#service.destinations;
    } catch(err) {
      this.#destinations = [];
    }
  }

  getById(id) {
    return this.#destinations
      .find((destination) => destination.id === id);
  }
}
