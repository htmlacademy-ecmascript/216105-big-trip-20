import PointPresenter from './point-presenter.js';
import NewPointPresenter from './new-point-presenter.js';

import SortView from '../view/sort-view.js';
import TripView from '../view/trip-view';
import NewPointButtonView from '../view/new-point-button-view.js';
import NoPointsView from '../view/no-points-view.js';
import LoadingView from '../view/loading-view.js';

import UiBlocker from '../framework/ui-blocker/ui-blocker.js';
import {render, replace, remove, RenderPosition} from '../framework/render.js';
import {sortPoints} from '../utils/sort.js';
import {filter} from '../utils/filter.js';
import {
  SortTypes, DEFAULT_SORT_TYPE,
  UpdateType, UserAction, FilterType
} from '../consts.js';

const TimeLimit = {
  LOWER_LIMIT: 350,
  UPPER_LIMIT: 1000,
};

export default class TripPresenter {
  #mainContainer = null;
  #tripContainer = null;

  #sortComponent = null;
  #tripComponent = new TripView();
  #newPointButtonComponent = null;
  #noPointsComponent = null;
  #loadingComponent = new LoadingView();

  #pointsModel = null;
  #offersModel = null;
  #destinationsModel = null;
  #filterModel = null;

  #pointPresenters = new Map();
  #newPointPresenter = null;

  #filterType = null;
  #isCreating = false;
  #isLoading = true;
  #uiBlocker = new UiBlocker({
    lowerLimit: TimeLimit.LOWER_LIMIT,
    upperLimit: TimeLimit.UPPER_LIMIT
  });

  #currentSortType = SortTypes[DEFAULT_SORT_TYPE];

  constructor({
    mainContainer, tripContainer,
    pointsModel, offersModel, destinationsModel, filterModel
  }) {
    this.#mainContainer = mainContainer;
    this.#tripContainer = tripContainer;

    this.#pointsModel = pointsModel;
    this.#offersModel = offersModel;
    this.#destinationsModel = destinationsModel;
    this.#filterModel = filterModel;

    this.#pointsModel.addObserver(this.#handleModelEvent);
    this.#filterModel.addObserver(this.#handleModelEvent);

    this.#newPointButtonComponent = new NewPointButtonView({
      onClick: this.#handleNewPointButtonClick
    });
    this.#newPointButtonComponent.setDisabled(true);

    this.#newPointPresenter = new NewPointPresenter({
      tripContainer: this.#tripComponent.element,
      offersModel: this.#offersModel,
      destinationsModel: this.#destinationsModel,
      onDataChange: this.#handleViewAction,
      onNewPointDestroy: this.#handleNewPointDestroy
    });
  }

  get points() {
    this.#filterType = this.#filterModel.filter;
    const filteredPoints = filter[this.#filterType]([...this.#pointsModel.points]);
    return sortPoints[this.#currentSortType](filteredPoints);
  }

  init() {
    this.#renderNewPointButton();
    this.#renderTrip();
  }

  #renderNewPointButton() {
    render(this.#newPointButtonComponent, this.#mainContainer);
  }

  #handleNewPointButtonClick = () => {
    this.#isCreating = true;
    this.#currentSortType = SortTypes[DEFAULT_SORT_TYPE];
    this.#filterModel.setFilter(UpdateType.MAJOR, FilterType.EVERYTHING);
    this.#newPointButtonComponent.setDisabled(true);
    this.#newPointPresenter.init();
  };

  #handleNewPointDestroy = () => {
    this.#isCreating = false;
    this.#newPointButtonComponent.setDisabled(false);
    if (this.points.length === 0) {
      remove(this.#sortComponent);
      this.#sortComponent = null;
      this.#renderNoPoints();
    }
  };

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
      render(this.#sortComponent, this.#tripContainer, RenderPosition.AFTERBEGIN);
    }
  }

  #renderTripContainer() {
    render(this.#tripComponent, this.#tripContainer);
  }

  #renderTrip() {
    this.#renderTripContainer();

    if (this.#isLoading) {
      this.#renderLoading();
      return;
    }

    if (this.points.length === 0 && !this.#isCreating) {
      this.#renderNoPoints();
      return;
    }

    this.#renderSort();
    this.points.forEach((point) => {
      this.#renderPoint(point);
    });
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

  #renderLoading() {
    render(this.#loadingComponent, this.#tripComponent.element, RenderPosition.AFTERBEGIN);
  }

  #renderNoPoints() {
    this.#noPointsComponent = new NoPointsView(this.#filterType);
    render(this.#noPointsComponent, this.#tripComponent.element);
  }

  #clearTrip({resetSortType = false} = {}) {
    this.#newPointPresenter.destroyNewPoint();
    this.#pointPresenters.forEach((presenter) => presenter.destroyPoint());
    this.#pointPresenters.clear();

    remove(this.#loadingComponent);

    if (this.#noPointsComponent) {
      remove(this.#noPointsComponent);
    }

    if (resetSortType) {
      this.#currentSortType = SortTypes[DEFAULT_SORT_TYPE];
    }
  }

  #handleViewAction = async (actionType, updateType, update) => {
    this.#uiBlocker.block();

    switch (actionType) {
      case UserAction.UPDATE_POINT:
        this.#pointPresenters.get(update.id).setSaving();
        try {
          await this.#pointsModel.updatePoint(updateType, update);
        } catch(err) {
          this.#pointPresenters.get(update.id).setAborting();
        }
        break;
      case UserAction.ADD_POINT:
        this.#newPointPresenter.setSaving();
        try {
          await this.#pointsModel.addPoint(updateType, update);
        } catch(err) {
          this.#newPointPresenter.setAborting();
        }
        break;
      case UserAction.DELETE_POINT:
        this.#pointPresenters.get(update.id).setDeleting();
        try {
          await this.#pointsModel.deletePoint(updateType, update);
        } catch(err) {
          this.#pointPresenters.get(update.id).setAborting();
        }
        break;
    }

    this.#uiBlocker.unblock();
  };

  #handleModelEvent = async (updateType, data) => {
    switch (updateType) {
      case UpdateType.PATCH:
        this.#pointPresenters.get(data.id)?.init(data);
        break;
      case UpdateType.MINOR:
        this.#clearTrip();
        this.#renderTrip();
        break;
      case UpdateType.MAJOR:
        this.#clearTrip({resetSortType: true});
        this.#renderTrip();
        break;
      case UpdateType.INIT:
        this.#isLoading = false;
        this.#clearTrip();
        this.#renderTrip();
        this.#newPointButtonComponent.setDisabled(false);
        break;
    }
  };

  #handlePointDisplayModeChange = () => {
    this.#newPointPresenter.destroyNewPoint();
    this.#pointPresenters.forEach((presenter) => presenter.resetView());
  };

  #handleSortTypeChange = (sortType) => {
    if (this.#currentSortType === sortType) {
      return;
    }
    this.#currentSortType = sortType;
    this.#clearTrip();
    this.#renderTrip();
  };
}
