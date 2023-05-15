import {render, replace, remove} from '../framework/render.js';
import EditPointView from '../view/edit-point-view';
import PointView from '../view/point-view.js';

export default class PointPresenter {
  #tripContainer = null;

  #pointComponent = null;
  #pointEditComponent = null;

  #point = null;
  #offersModel = null;
  #destinationsModel = null;

  constructor({tripContainer, offersModel, destinationsModel}) {
    this.#tripContainer = tripContainer;
    this.#offersModel = offersModel;
    this.#destinationsModel = destinationsModel;
  }

  init(point) {
    this.#point = point;

    const prevPointComponent = this.#pointComponent;
    const prevPointEditComponent = this.#pointEditComponent;

    this.#pointComponent = new PointView({
      point: this.#point,
      pointOffers: this.#offersModel.getByIdsAndType(this.#point),
      pointDestination: this.#destinationsModel.getById(this.#point.destination),
      onEditClick: this.#handlePointEditClick
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

    if (this.#tripContainer.contains(prevPointComponent.element)) {
      replace(this.#pointComponent, prevPointComponent);
    }

    if (this.#tripContainer.contains(prevPointEditComponent.element)) {
      replace(this.#pointEditComponent, prevPointEditComponent);
    }

    remove(prevPointComponent);
    remove(prevPointEditComponent);
  }

  destroy() {
    remove(this.#pointComponent);
    remove(this.#pointEditComponent);
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
  }

  #replaceFormToPoint() {
    replace(this.#pointComponent, this.#pointEditComponent);
  }

  #handlePointEditClick() {
    this.#replacePointToForm();
    document.addEventListener('keydown', this.#escKeyDownHandler);
  }

  #resetButtonClickHandler() {
    this.#replaceFormToPoint();
    document.removeEventListener('keydown', this.#escKeyDownHandler);
  }

  #handlePointSubmit() {
    this.#replaceFormToPoint();
    document.removeEventListener('keydown', this.#escKeyDownHandler);
  }
}
