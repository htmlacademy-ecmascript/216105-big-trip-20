import AbstractView from '../framework/view/abstract-view.js';

function createTripTemplate() {
  return (
    '<ul class="trip-events__list"></ul>'
  );
}

export default class TripView extends AbstractView {
  get template() {
    return createTripTemplate();
  }
}
