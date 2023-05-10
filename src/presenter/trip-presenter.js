import {render} from '../render.js';
import TripView from '../view/trip-view';
import EditPointView from '../view/edit-point-view';
import PointView from '../view/point-view.js';

export default class TripPresenter {
  tripComponent = new TripView();

  constructor({tripContainer, pointsModel, offersModel, destinationsModel}) {
    this.tripContainer = tripContainer;
    this.pointsModel = pointsModel;
    this.offersModel = offersModel;
    this.destinationsModel = destinationsModel;
  }

  init() {
    this.points = [...this.pointsModel.get()];

    render(this.tripComponent, this.tripContainer);

    render(
      new EditPointView(
        this.points[0],
        this._getOffersByType(this.points[0]),
        this.destinationsModel.get(),
        this._getDestinationById(this.points[0].destination),
      ),
      this.tripComponent.getElement()
    );

    this.points.forEach((point) => {
      render(
        new PointView(
          point,
          this._getOffersByIdsAndType(point),
          this._getDestinationById(point.destination)
        ),
        this.tripComponent.getElement()
      );
    });
  }

  _getOffersByType({type}) {
    return this.offersModel.getByType(type);
  }

  _getOffersByIdsAndType({offers: ids, type}) {
    return this.offersModel.getByIdsAndType(ids, type);
  }

  _getDestinationById(id) {
    return this.destinationsModel.getById(id);
  }
}
