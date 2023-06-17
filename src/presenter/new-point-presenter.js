import PointEditView from '../view/point-edit-view.js';
import {UserAction, UpdateType} from '../const.js';
import {remove, render, RenderPosition} from '../framework/render.js';

export default class NewPointPresenter {
  #tripContainer = null;
  #pointEditComponent = null;
  #offersModel = null;
  #destinationsModel = null;
  #handleDataChange = null;
  #handleNewPointDestroy = null;

  constructor({tripContainer, offersModel, destinationsModel,
    handleDataChange, handleNewPointDestroy}) {
    this.#tripContainer = tripContainer;
    this.#offersModel = offersModel;
    this.#destinationsModel = destinationsModel;
    this.#handleDataChange = handleDataChange;
    this.#handleNewPointDestroy = handleNewPointDestroy;
  }

  init() {
    if (this.#pointEditComponent !== null) {
      return;
    }

    this.#pointEditComponent = new PointEditView({
      isNewPoint: true,
      allOffers: this.#offersModel.offers,
      allDestinations: this.#destinationsModel.destinations,
      handleFormSubmit: this.#formSubmitHandler,
      handleDeleteClick: this.#deleteClickHandler
    });

    render(
      this.#pointEditComponent, this.#tripContainer,
      RenderPosition.AFTERBEGIN
    );

    document.addEventListener('keydown', this.#escKeyDownHandler);
  }

  destroyNewPoint() {
    if (this.#pointEditComponent === null) {
      return;
    }

    this.#handleNewPointDestroy();

    remove(this.#pointEditComponent);
    this.#pointEditComponent = null;

    document.removeEventListener('keydown', this.#escKeyDownHandler);
  }

  setSaving() {
    this.#pointEditComponent.updateElement({
      isDisabled: true,
      isSaving: true,
    });
  }

  setAborting() {
    const resetFormState = () => {
      this.#pointEditComponent.updateElement({
        isDisabled: false,
        isSaving: false,
        isDeleting: false,
      });
    };

    this.#pointEditComponent.shake(resetFormState);
  }

  #formSubmitHandler = (point) => {
    this.#handleDataChange(
      UserAction.ADD_POINT,
      UpdateType.MINOR,
      point,
    );
  };

  #deleteClickHandler = () => {
    this.destroy();
  };

  #escKeyDownHandler = (evt) => {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      this.destroy();
    }
  };
}
