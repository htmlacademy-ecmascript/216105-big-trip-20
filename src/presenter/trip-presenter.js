import {render} from '../render.js';
import TripView from '../view/trip-view';
import EditPointView from '../view/edit-point-view';
import NewPointView from '../view/new-point-view.js';
import PointView from '../view/point-view.js';

export default class TripPresenter {
  tripComponent = new TripView();

  constructor({tripContainer}) {
    this.tripContainer = tripContainer;
  }

  init() {
    render(this.tripComponent, this.tripContainer);
    render(new EditPointView(), this.tripComponent.getElement());

    for (let i = 0; i < 3; i++) {
      render(new PointView(), this.tripComponent.getElement());
    }

    render(new NewPointView(), this.tripComponent.getElement());
  }
}