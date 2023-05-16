import {render} from '../framework/render.js';
import {updateItem} from '../utils/common.js';
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
  #pointPresenters = new Map();

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

  #clearPointsList() {
    this.#pointPresenters.forEach((presenter) => presenter.destroy());
    this.#pointPresenters.clear();
  }

  #renderPoint(point) {
    const pointPresenter = new PointPresenter({
      tripContainer: this.#tripComponent.element,
      offersModel: this.#offersModel,
      destinationsModel: this.#destinationsModel,
      onDataChange: this.#handlePointChange
    });
    pointPresenter.init(point);
    this.#pointPresenters.set(point.id, pointPresenter);
  }

  #renderNoPoints() {
    render(new NoPointsView('EVERYTHING'), this.#tripComponent.element);
  }

  #handlePointChange = (updatedPoint) => {
    this.#points = updateItem(this.#points, updatedPoint);
    this.#pointPresenters.get(updatedPoint.id).init(updatedPoint);
  };
}
