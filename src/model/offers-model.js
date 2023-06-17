export default class OffersModel {
  #offers = [];
  #service = null;

  constructor(service) {
    this.#service = service;
  }

  get offers() {
    return this.#offers;
  }

  async init() {
    this.#offers = await this.#service.offers;
  }

  getByIdsAndType({offers: ids, type}) {
    return this.#getByType(type)
      ?.filter((offer) => ids.includes(offer.id));
  }

  #getByType(type) {
    return this.#offers
      .find((offer) => offer.type === type)?.offers;
  }
}
