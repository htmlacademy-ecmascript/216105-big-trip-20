import PointEditView from '../view/point-edit-view.js';
import PointView from '../view/point-view.js';
import {UserAction, UpdateType} from '../const.js';
import {render, replace, remove} from '../framework/render.js';

const PointDisplayMode = {
  DEFAULT: 'DEFAULT',
  EDITING: 'EDITING'
};

export default class PointPresenter {
  #tripContainer = null;
  #pointComponent = null;
  #pointEditComponent = null;
  #offersModel = null;
  #destinationsModel = null;
  #handleDataChange = null;
  #handlePointDisplayModeChange = null;
  #point = null;
  #pointDisplayMode = PointDisplayMode.DEFAULT;

  constructor({
    tripContainer, offersModel, destinationsModel,
    handleDataChange, handlePointDisplayModeChange
  }) {
    this.#tripContainer = tripContainer;
    this.#offersModel = offersModel;
    this.#destinationsModel = destinationsModel;
    this.#handleDataChange = handleDataChange;
    this.#handlePointDisplayModeChange = handlePointDisplayModeChange;
  }

  init(point) {
    this.#point = point;

    const prevPointComponent = this.#pointComponent;
    const prevPointEditComponent = this.#pointEditComponent;

    this.#pointComponent = new PointView({
      point: this.#point,
      pointOffers: this.#offersModel.getByIdsAndType(this.#point),
      pointDestination: this.#destinationsModel.getById(this.#point.destination),
      handleEditClick: this.#pointEditClickHandler,
      handleFavoriteClick: this.#favoriteClickHandler
    });

    this.#pointEditComponent = new PointEditView({
      point: this.#point,
      allOffers: this.#offersModel.offers,
      allDestinations: this.#destinationsModel.destinations,
      handleResetClick: this.#resetButtonClickHandler,
      handleDeleteClick: this.#deleteClickHandler,
      handleFormSubmit: this.#pointSubmitHandler
    });

    if (prevPointComponent === null || prevPointEditComponent === null) {
      render(this.#pointComponent, this.#tripContainer);
      return;
    }

    if (this.#pointDisplayMode === PointDisplayMode.DEFAULT) {
      replace(this.#pointComponent, prevPointComponent);
    }

    if (this.#pointDisplayMode === PointDisplayMode.EDITING) {
      replace(this.#pointComponent, prevPointEditComponent);
      this.#pointDisplayMode = PointDisplayMode.DEFAULT;
    }

    remove(prevPointComponent);
    remove(prevPointEditComponent);
  }

  destroyPoint() {
    remove(this.#pointComponent);
    remove(this.#pointEditComponent);
  }

  resetView() {
    if (this.#pointDisplayMode !== PointDisplayMode.DEFAULT) {
      this.#pointEditComponent.reset(this.#point);
      this.#replaceFormToPoint();
    }
  }

  setSaving() {
    if (this.#pointDisplayMode === PointDisplayMode.EDITING) {
      this.#pointEditComponent.updateElement({
        isDisabled: true,
        isSaving: true,
      });
    }
  }

  setDeleting() {
    if (this.#pointDisplayMode === PointDisplayMode.EDITING) {
      this.#pointEditComponent.updateElement({
        isDisabled: true,
        isDeleting: true,
      });
    }
  }

  setAborting() {
    if (this.#pointDisplayMode === PointDisplayMode.DEFAULT) {
      this.#pointComponent.shake();
      return;
    }

    const resetFormState = () => {
      this.#pointEditComponent.updateElement({
        isDisabled: false,
        isSaving: false,
        isDeleting: false,
      });
    };

    this.#pointEditComponent.shake(resetFormState);
  }

  #replacePointToForm() {
    replace(this.#pointEditComponent, this.#pointComponent);
    this.#handlePointDisplayModeChange();
    this.#pointDisplayMode = PointDisplayMode.EDITING;
  }

  #replaceFormToPoint() {
    replace(this.#pointComponent, this.#pointEditComponent);
    this.#pointDisplayMode = PointDisplayMode.DEFAULT;
  }

  #escKeyDownHandler = (evt) => {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      this.#pointEditComponent.reset(this.#point);
      this.#replaceFormToPoint();
      document.removeEventListener('keydown', this.#escKeyDownHandler);
    }
  };

  #pointEditClickHandler = () => {
    this.#replacePointToForm();
    document.addEventListener('keydown', this.#escKeyDownHandler);
  };

  #resetButtonClickHandler = () => {
    this.#pointEditComponent.reset(this.#point);
    this.#replaceFormToPoint();
    document.removeEventListener('keydown', this.#escKeyDownHandler);
  };

  #favoriteClickHandler = () => {
    this.#handleDataChange(
      UserAction.UPDATE_POINT,
      UpdateType.PATCH,
      {...this.#point, isFavorite: !this.#point.isFavorite}
    );
  };

  #deleteClickHandler = (point) => {
    this.#handleDataChange(
      UserAction.DELETE_POINT,
      UpdateType.MINOR,
      point,
    );
  };

  #pointSubmitHandler = (update) => {
    this.#handleDataChange(
      UserAction.UPDATE_POINT,
      UpdateType.MINOR,
      update
    );

    document.removeEventListener('keydown', this.#escKeyDownHandler);
  };
}
