import {render, replace, remove} from '../framework/render.js';
import PointEditView from '../view/point-edit-view.js';
import PointView from '../view/point-view.js';
import {UserAction, UpdateType} from '../const.js';

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

    this.#pointEditComponent = new PointEditView({
      point: this.#point,
      allOffers: this.#offersModel.offers,
      allDestinations: this.#destinationsModel.destinations,
      onResetClick: this.#resetButtonClickHandler,
      onDeleteClick: this.#handleDeleteClick,
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

  #escKeyDownHandler = (evt) => {
    if (evt.key === 'Escape') {
      evt.preventDefault();
      this.#pointEditComponent.reset(this.#point);
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
    this.#handleDataChange(
      UserAction.UPDATE_POINT,
      UpdateType.PATCH,
      {...this.#point, isFavorite: !this.#point.isFavorite}
    );
  };

  #handleDeleteClick = (point) => {
    this.#handleDataChange(
      UserAction.DELETE_POINT,
      UpdateType.MINOR,
      point,
    );
  };

  #handlePointSubmit = (update) => {
    this.#handleDataChange(
      UserAction.UPDATE_POINT,
      UpdateType.MINOR,
      update
    );

    document.removeEventListener('keydown', this.#escKeyDownHandler);
  };
}
