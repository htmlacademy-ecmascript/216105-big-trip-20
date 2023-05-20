import PointPresenter from './point-presenter.js';
import SortView from '../view/sort-view.js';
import TripView from '../view/trip-view';
import NoPointsView from '../view/no-points-view.js';

import {render, replace, remove} from '../framework/render.js';
import {updateItems} from '../utils/common.js';
import {sortPoints} from '../utils/sort.js';
import {SortTypes, DEFAULT_SORT_TYPE} from '../consts.js';

export default class TripPresenter {
  #points = [];
  #sortComponent = null;
  #tripComponent = new TripView();
  #tripContainer = null;
  #pointsModel = null;
  #offersModel = null;
  #destinationsModel = null;
  #pointPresenters = new Map();

  #currentSortType = SortTypes[DEFAULT_SORT_TYPE];

  constructor({tripContainer, pointsModel, offersModel, destinationsModel}) {
    this.#tripContainer = tripContainer;
    this.#pointsModel = pointsModel;
    this.#offersModel = offersModel;
    this.#destinationsModel = destinationsModel;
  }

  init() {
    this.#points = sortPoints[this.#currentSortType]([...this.#pointsModel.points]);
    this.#renderSort();
    this.#renderTrip();
  }

  #renderSort() {
    const prevSortComponent = this.#sortComponent;

    this.#sortComponent = new SortView({
      currentSortType: this.#currentSortType,
      onSortTypeChange: this.#handleSortTypeChange
    });

    if (prevSortComponent) {
      replace(this.#sortComponent, prevSortComponent);
      remove(prevSortComponent);
    } else {
      render(this.#sortComponent, this.#tripContainer);
    }
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
      destinationsModel: this.#destinationsModel,
      onDataChange: this.#handlePointChange,
      onPointDisplayModeChange: this.#handlePointDisplayModeChange
    });

    pointPresenter.init(point);

    this.#pointPresenters.set(point.id, pointPresenter);
  }

  #renderNoPoints() {
    render(new NoPointsView('EVERYTHING'), this.#tripComponent.element);
  }

  #clearPointsList() {
    this.#pointPresenters.forEach((presenter) => presenter.destroy());
    this.#pointPresenters.clear();
  }

  #sortPoints(sortType) {
    this.#currentSortType = sortType;
    this.#points = sortPoints[this.#currentSortType](this.#points);
  }

  #handlePointChange = (updatedPoint) => {
    this.#points = updateItems(this.#points, updatedPoint);
    this.#pointPresenters.get(updatedPoint.id).init(updatedPoint);
  };

  #handlePointDisplayModeChange = () => {
    this.#pointPresenters.forEach((presenter) => presenter.resetView());
  };

  #handleSortTypeChange = (sortType) => {
    if (this.#currentSortType === sortType) {
      return;
    }
    this.#sortPoints(sortType);
    this.#clearPointsList();
    this.#renderTrip();
  };
}
