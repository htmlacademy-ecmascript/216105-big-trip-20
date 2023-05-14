import {render, replace} from '../framework/render.js';
import TripView from '../view/trip-view';
import EditPointView from '../view/edit-point-view';
import PointView from '../view/point-view.js';

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

    render(this.#tripComponent, this.#tripContainer);

    this.#points.forEach((point) => {
      this.#renderPoint(point);
    });
  }

  #renderPoint(point) {
    const escKeyDownHandler = (evt) => {
      if (evt.key === 'Escape') {
        evt.preventDefault();
        replaceFormToPoint();
        document.removeEventListener('keydown', escKeyDownHandler);
      }
    };

    const pointComponent = new PointView({
      point,
      pointOffers: this.#offersModel.getByIdsAndType(point),
      pointDestination: this.#destinationsModel.getById(point.destination),
      onEditClick: pointEditClickHandler
    });

    const pointEditComponent = new EditPointView({
      point,
      allOffers: this.#offersModel.getByType(point.type),
      allDestinations: this.#destinationsModel.destinations,
      chosenDestination: this.#destinationsModel.getById(point.destination),
      onResetClick: resetButtonClickHandler,
      onFormSubmit: pointSubmitHandler
    });

    function replacePointToForm() {
      replace(pointEditComponent, pointComponent);
    }

    function replaceFormToPoint() {
      replace(pointComponent, pointEditComponent);
    }

    function pointEditClickHandler() {
      replacePointToForm();
      document.addEventListener('keydown', escKeyDownHandler);
    }

    function resetButtonClickHandler() {
      replaceFormToPoint();
      document.removeEventListener('keydown', escKeyDownHandler);
    }

    function pointSubmitHandler() {
      replaceFormToPoint();
      document.removeEventListener('keydown', escKeyDownHandler);
    }

    render(pointComponent, this.#tripComponent.element);
  }
}
