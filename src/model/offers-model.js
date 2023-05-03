import {mockOffers} from '../mock/offers.js';

export default class OffersModel {
  getOffersList() {
    return mockOffers;
  }

  getChosenOffersByIds(ids, type) {
    return mockOffers
      .find((item) => item.type === type).offers
      .filter((offer) => ids.includes(offer.id));
  }
}
