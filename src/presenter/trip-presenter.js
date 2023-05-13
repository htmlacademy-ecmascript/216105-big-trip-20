import {render} from '../framework/render.js';
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

    render(
      new EditPointView(
        this.#points[0],
        this.#getOffersByType(this.#points[0]),
        this.#destinationsModel.destinations,
        this.#getDestinationById(this.#points[0].destination),
      ),
      this.#tripComponent.element
    );

    this.#points.forEach((point) => {
      render(
        new PointView(
          point,
          this.#getOffersByIdsAndType(point),
          this.#getDestinationById(point.destination)
        ),
        this.#tripComponent.element
      );
    });
  }

  #getOffersByType({type}) {
    return this.#offersModel.getByType(type);
  }

  #getOffersByIdsAndType({offers: ids, type}) {
    return this.#offersModel.getByIdsAndType(ids, type);
  }

  #getDestinationById(id) {
    return this.#destinationsModel.getById(id);
  }
}
