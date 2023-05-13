export default class OffersModel {
  #offers = null;
  #service = null;

  constructor(service) {
    this.#service = service;
    this.#offers = this.#service.offers;
  }

  getByType(type) {
    return this.#offers
      .find((offer) => offer.type === type).offers;
  }

  getByIdsAndType(ids, type) {
    return this.getByType(type)
      .filter((offer) => ids.includes(offer.id));
  }
}
