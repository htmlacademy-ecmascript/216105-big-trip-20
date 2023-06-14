import TripInfoView from '../view/trip-info-view.js';
import {render, replace, remove, RenderPosition} from '../framework/render.js';
import {sortPoints} from '../utils/sort.js';
import {SortTypes} from '../consts.js';

export default class TripInfoPresenter {
  #container = null;
  #tripInfoComponent = null;
  #pointsModel = null;
  #offersModel = null;
  #destinationsModel = null;
  #points = null;

  constructor({container, pointsModel, offersModel, destinationsModel}) {
    this.#container = container;
    this.#pointsModel = pointsModel;
    this.#offersModel = offersModel;
    this.#destinationsModel = destinationsModel;

    this.#pointsModel.addObserver(this.#handleModelEvent);
  }

  init() {
    const prevTripInfoComponent = this.#tripInfoComponent;

    this.#points = sortPoints[SortTypes.DAY]([...this.#pointsModel.points]);

    this.#tripInfoComponent = new TripInfoView({
      destinationsNames: this.#getDestinationsNames(),
      startDate: this.#points.at(0)?.dateFrom,
      endDate: this.#points.at(-1)?.dateTo,
      total: this.#getTotalSum()
    });

    if (prevTripInfoComponent === null) {
      render(
        this.#tripInfoComponent,
        this.#container,
        RenderPosition.AFTERBEGIN
      );
      return;
    }

    replace(this.#tripInfoComponent, prevTripInfoComponent);
    remove(prevTripInfoComponent);
  }

  #getDestinationsNames() {
    const destinations = this.#destinationsModel.destinations;

    return this.#points.map((point) => {
      const pointDestination = destinations
        .find((destination) => destination.id === point.destination);
      return pointDestination?.name;
    });
  }

  #getTotalSum() {
    return this.#points.reduce((totalSum, point) => {
      const pointOffers = this.#offersModel.getByIdsAndType({
        offers: point.offers,
        type: point.type
      });

      const pointOffersSum = pointOffers
        .reduce((offersSum, offer) => Number(offer.price) + offersSum, 0);

      return Number(point.basePrice) + pointOffersSum + totalSum;
    }, 0);

  }

  #handleModelEvent = () => {
    this.init();
  };
}
