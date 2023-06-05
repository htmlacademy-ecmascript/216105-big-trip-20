import PointPresenter from './point-presenter.js';
import NewPointPresenter from './new-point-presenter.js';
import SortView from '../view/sort-view.js';
import TripView from '../view/trip-view';
import NoPointsView from '../view/no-points-view.js';

import {render, replace, remove} from '../framework/render.js';
import {sortPoints} from '../utils/sort.js';
import {filter} from '../utils/filter.js';
import {SortTypes, DEFAULT_SORT_TYPE, UpdateType, UserAction} from '../consts.js';

export default class TripPresenter {
  // #points = [];
  #sortComponent = null;
  #tripComponent = new TripView();
  #noPointsComponent = null;
  #tripContainer = null;
  #pointsModel = null;
  #offersModel = null;
  #destinationsModel = null;
  #filterModel = null;
  #filterType = null;
  #pointPresenters = new Map();
  #newPointPresenter = null;

  #currentSortType = SortTypes[DEFAULT_SORT_TYPE];

  constructor({
    tripContainer, pointsModel, offersModel, destinationsModel, filterModel, onNewPointDestroy
  }) {
    this.#tripContainer = tripContainer;
    this.#pointsModel = pointsModel;
    this.#offersModel = offersModel;
    this.#destinationsModel = destinationsModel;
    this.#filterModel = filterModel;

    this.#pointsModel.addObserver(this.#handleModelEvent);
    this.#filterModel.addObserver(this.#handleModelEvent);

    this.#newPointPresenter = new NewPointPresenter({
      tripContainer: this.#tripComponent.element,
      offersModel: this.#offersModel,
      destinationsModel: this.#destinationsModel,
      onDataChange: this.#handleViewAction,
      onDestroy: onNewPointDestroy
    });
  }

  get points() {
    this.#filterType = this.#filterModel.filter;
    const filteredPoints = filter[this.#filterType]([...this.#pointsModel.points]);
    return sortPoints[this.#currentSortType](filteredPoints);
  }

  init() {
    // this.#points = sortPoints[this.#currentSortType]([...this.#pointsModel.points]);
    this.#renderSort();
    this.#renderTrip();
  }

  createPoint() {
    // this.#currentSortType = SortType.DEFAULT;
    // this.#filterModel.setFilter(UpdateType.MAJOR, FilterType.ALL);
    this.#newPointPresenter.init();
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

    if (this.points.length) {
      this.points.forEach((point) => {
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
      onDataChange: this.#handleViewAction,
      onPointDisplayModeChange: this.#handlePointDisplayModeChange
    });

    pointPresenter.init(point);

    this.#pointPresenters.set(point.id, pointPresenter);
  }

  #renderNoPoints() {
    this.#noPointsComponent = new NoPointsView(this.#filterType);
    //переименовать в currentfilter или че-то подобное
    render(this.#noPointsComponent, this.#tripComponent.element);
  }

  // #clearPointsList() {
  //   this.#pointPresenters.forEach((presenter) => presenter.destroy());
  //   this.#pointPresenters.clear();
  // }

  #clearTrip({resetSortType = false} = {}) {
    this.#newPointPresenter.destroy();
    this.#pointPresenters.forEach((presenter) => presenter.destroy());
    this.#pointPresenters.clear();

    // remove(this.#sortComponent);
    if (this.#noPointsComponent) {
      remove(this.#noPointsComponent);
    }

    if (resetSortType) {
      this.#currentSortType = SortTypes[DEFAULT_SORT_TYPE];
    }
  }

  // #sortPoints(sortType) {
  //   this.#currentSortType = sortType;
  //   this.#points = sortPoints[this.#currentSortType](this.#points);
  // }

  // #handlePointChange = (updatedPoint) => {
  //   // this.#points = updateItems(this.#points, updatedPoint);
  //   // Здесь будем вызывать обновление модели
  //   this.#pointPresenters.get(updatedPoint.id).init(updatedPoint);
  // };

  #handleViewAction = (actionType, updateType, update) => {
    console.log(actionType, updateType, update);
    // Здесь будем вызывать обновление модели.
    // actionType - действие пользователя, нужно чтобы понять, какой метод модели вызвать
    // updateType - тип изменений, нужно чтобы понять, что после нужно обновить
    // update - обновленные данные
    switch (actionType) {
      case UserAction.UPDATE_POINT:
        this.#pointsModel.updatePoint(updateType, update);
        break;
      case UserAction.ADD_POINT:
        this.#pointsModel.addPoint(updateType, update);
        break;
      case UserAction.DELETE_POINT:
        this.#pointsModel.deletePoint(updateType, update);
        break;
    }
  };

  #handleModelEvent = (updateType, data) => {
    console.log(updateType, data);
    // В зависимости от типа изменений решаем, что делать:
    // - обновить часть списка (например, когда поменялось описание)
    // - обновить список (например, когда задача ушла в архив)
    // - обновить всю доску (например, при переключении фильтра)
    switch (updateType) {
      case UpdateType.PATCH:
        // - обновить часть списка (например, когда поменялось описание)
        this.#pointPresenters.get(data.id).init(data);
        break;
      case UpdateType.MINOR:
        // - обновить список (например, когда задача ушла в архив)
        this.#clearTrip();
        this.#renderTrip();
        break;
      case UpdateType.MAJOR:
        // - обновить всю доску (например, при переключении фильтра)
        // в демо-проекте:
        // this.#clearBoard({resetRenderedPointCount: true, resetSortType: true});
        // понять, как у меня
        this.#clearTrip({resetSortType: true});
        this.#renderTrip();
        break;
    }
  };

  #handlePointDisplayModeChange = () => {
    this.#newPointPresenter.destroy();
    this.#pointPresenters.forEach((presenter) => presenter.resetView());
  };

  #handleSortTypeChange = (sortType) => {
    if (this.#currentSortType === sortType) {
      return;
    }
    this.#currentSortType = sortType;
    // this.#sortPoints(sortType);
    this.#clearTrip();
    this.#renderTrip();
  };
}
