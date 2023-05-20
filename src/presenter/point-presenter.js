import {render, replace, remove} from '../framework/render.js';
import EditPointView from '../view/edit-point-view';
import PointView from '../view/point-view.js';

const PointDisplayMode = {
  DEFAULT: 'DEFAULT',
  EDITING: 'EDITING'
};

export default class PointPresenter {
  #tripContainer = null;
  #handleDataChange = null;
  #handlePointDisplayModeChange = null;

  #pointComponent = null;
  #pointEditComponent = null;

  #point = null;
  #offersModel = null;
  #destinationsModel = null;
  #pointDisplayMode = PointDisplayMode.DEFAULT;

  constructor({
    tripContainer, offersModel, destinationsModel,
    onDataChange, onPointDisplayModeChange
  }) {
    this.#tripContainer = tripContainer;
    this.#offersModel = offersModel;
    this.#destinationsModel = destinationsModel;
    this.#handleDataChange = onDataChange;
    this.#handlePointDisplayModeChange = onPointDisplayModeChange;
  }

  init(point) {
    this.#point = point;

    const prevPointComponent = this.#pointComponent;
    const prevPointEditComponent = this.#pointEditComponent;

    this.#pointComponent = new PointView({
      point: this.#point,
      pointOffers: this.#offersModel.getByIdsAndType(this.#point),
      pointDestination: this.#destinationsModel.getById(this.#point.destination),
      onEditClick: this.#handlePointEditClick,
      onFavoriteClick: this.#handleFavoriteClick
    });

    this.#pointEditComponent = new EditPointView({
      point: this.#point,
      allOffers: this.#offersModel.getByType(this.#point.type),
      allDestinations: this.#destinationsModel.destinations,
      chosenDestination: this.#destinationsModel.getById(this.#point.destination),
      onResetClick: this.#resetButtonClickHandler,
      onFormSubmit: this.#handlePointSubmit
    });

    if (prevPointComponent === null || prevPointEditComponent === null) {
      render(this.#pointComponent, this.#tripContainer);
      return;
    }

    if (this.#pointDisplayMode === PointDisplayMode.DEFAULT) {
      replace(this.#pointComponent, prevPointComponent);
    }

    if (this.#pointDisplayMode === PointDisplayMode.EDITING) {
      replace(this.#pointEditComponent, prevPointEditComponent);
    }

    remove(prevPointComponent);
    remove(prevPointEditComponent);
  }

  destroy() {
    remove(this.#pointComponent);
    remove(this.#pointEditComponent);
  }

  resetView() {
    if (this.#pointDisplayMode !== PointDisplayMode.DEFAULT) {
      this.#replaceFormToPoint();
    }
  }

  #escKeyDownHandler = (evt) => {
    if (evt.key === 'Escape') {
      evt.preventDefault();
      this.#replaceFormToPoint();
      document.removeEventListener('keydown', this.#escKeyDownHandler);
    }
  };

  #replacePointToForm() {
    replace(this.#pointEditComponent, this.#pointComponent);
    this.#handlePointDisplayModeChange();
    this.#pointDisplayMode = PointDisplayMode.EDITING;
  }

  #replaceFormToPoint() {
    replace(this.#pointComponent, this.#pointEditComponent);
    this.#pointDisplayMode = PointDisplayMode.DEFAULT;
  }

  #handlePointEditClick = () => {
    this.#replacePointToForm();
    document.addEventListener('keydown', this.#escKeyDownHandler);
  };

  #resetButtonClickHandler = () => {
    this.#replaceFormToPoint();
    document.removeEventListener('keydown', this.#escKeyDownHandler);
  };

  #handleFavoriteClick = () => {
    this.#handleDataChange({
      ...this.#point,
      isFavorite: !this.#point.isFavorite
    });
  };

  #handlePointSubmit = (point) => {
    this.#handleDataChange(point);
    this.#replaceFormToPoint();
    document.removeEventListener('keydown', this.#escKeyDownHandler);
  };
}