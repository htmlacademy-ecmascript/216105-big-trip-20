import AbstractView from '../framework/view/abstract-view.js';
import {getTripTitle, getTripDuration} from '../utils/trip-info.js';

function createTripInfoTemplate({destinationsNames, startDate, endDate, total}) {
  if (destinationsNames.length === 0) {
    return '<div></div>';
  }

  return (
    `<section class="trip-main__trip-info  trip-info">
      <div class="trip-info__main">
        <h1 class="trip-info__title">
          ${getTripTitle(destinationsNames)}
        </h1>

        <p class="trip-info__dates">${getTripDuration({startDate, endDate})}</p>
      </div>

      <p class="trip-info__cost">
        Total: &euro;&nbsp;<span class="trip-info__cost-value">${total}</span>
      </p>
    </section>`
  );
}

export default class TripInfoView extends AbstractView {
  #destinationsNames = null;
  #startDate = null;
  #endDate = null;
  #total = null;

  constructor({destinationsNames, startDate, endDate, total}) {
    super();
    this.#destinationsNames = destinationsNames;
    this.#startDate = startDate;
    this.#endDate = endDate;
    this.#total = total;
  }

  get template() {
    return createTripInfoTemplate({
      destinationsNames: this.#destinationsNames,
      startDate: this.#startDate,
      endDate: this.#endDate,
      total: this.#total
    });
  }
}
