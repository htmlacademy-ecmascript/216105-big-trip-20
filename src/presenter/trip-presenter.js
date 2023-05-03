import {render} from '../render.js';
import PointsModel from '../model/points-model.js';
import OffersModel from '../model/offers-model.js';
import DestinationsModel from '../model/destinations-model.js';
import TripView from '../view/trip-view';
import EditPointView from '../view/edit-point-view';
import PointView from '../view/point-view.js';

export default class TripPresenter {
  tripComponent = new TripView();
  points = new PointsModel().getPoints();

  constructor({tripContainer}) {
    this.tripContainer = tripContainer;
  }

  init() {
    render(this.tripComponent, this.tripContainer);
    render(new EditPointView(
      this.points[0],
      new OffersModel().getOffersList(),
      new DestinationsModel().getDestinationsList()
    ), this.tripComponent.getElement());

    for (let i = 0; i < 3; i++) {
      render(new PointView(
        this.points[i],
        this._getOffers(this.points[i]),
        this._getDestination(this.points[i].destination)
      ), this.tripComponent.getElement());
    }
  }

  _getOffers({offers, type}) {
    return new OffersModel().getChosenOffersByIds(offers, type);
  }

  _getDestination(id) {
    return new DestinationsModel().getDestinationById(id);
  }
}
