import TripInfoView from '../view/trip-info-view.js';
import {getDestinationsNames, getTotalSum} from '../utils/trip-info.js';
import {sortPoints} from '../utils/sort.js';
import {SortTypes} from '../const.js';
import {render, replace, remove, RenderPosition} from '../framework/render.js';

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
      destinationsNames: getDestinationsNames({
        points: this.#points,
        destinations: this.#destinationsModel.destinations
      }),
      startDate: this.#points.at(0)?.dateFrom,
      endDate: this.#points.at(-1)?.dateTo,
      total: getTotalSum({
        points: this.#points,
        offersModel: this.#offersModel
      })
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

  #handleModelEvent = () => {
    this.init();
  };
}
