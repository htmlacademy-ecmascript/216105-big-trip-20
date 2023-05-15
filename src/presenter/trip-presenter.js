import {render} from '../framework/render.js';
import PointPresenter from './point-presenter.js';
import TripView from '../view/trip-view';
import NoPointsView from '../view/no-points-view.js';

export default class TripPresenter {
  #points = [];
  #tripComponent = new TripView();
  #tripContainer = null;
  #pointsModel = null;
  #offersModel = null;
  #destinationsModel = null;

  constructor({tripContainer, pointsModel, offersModel, destinationsModel}) {
    this.#tripContainer = tripContainer;
    this.#pointsModel = pointsModel;
    this.#offersModel = offersModel;
    this.#destinationsModel = destinationsModel;
  }

  init() {
    this.#points = [...this.#pointsModel.points];
    this.#renderTrip();
  }

  #renderTrip() {
    render(this.#tripComponent, this.#tripContainer);

    if (this.#points.length) {
      this.#points.forEach((point) => {
        this.#renderPoint(point);
      });
    } else {
      this.#renderNoPoints();
    }
  }

  #renderPoint(point) {
    const pointPresenter = new PointPresenter({
      tripContainer: this.#tripComponent.element,
      offersModel: this.#offersModel,
      destinationsModel: this.#destinationsModel
    });
    pointPresenter.init(point);
  }

  #renderNoPoints() {
    render(new NoPointsView('EVERYTHING'), this.#tripComponent.element);
  }
}
