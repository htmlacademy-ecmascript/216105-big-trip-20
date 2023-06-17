import AbstractStatefulView from '../framework/view/abstract-stateful-view.js';
import {POINT_TYPES, BLANK_POINT} from '../const.js';
import {capitalizeFirstLetter} from '../utils/point.js';
import he from 'he';
import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';

function createEventSelectionTemplate(chosenType, isDisabled) {
  return (
    `<div class="event__type-wrapper">
      <label class="event__type  event__type-btn" for="event-type-toggle-1">
        <span class="visually-hidden">Choose event type</span>
        <img class="event__type-icon" width="17" height="17" src="img/icons/${chosenType}.png" alt="Event type icon">
      </label>
      <input class="event__type-toggle visually-hidden" id="event-type-toggle-1" type="checkbox" ${isDisabled ? 'disabled' : ''}>

      <div class="event__type-list">
        <fieldset class="event__type-group">
          <legend class="visually-hidden">Event type</legend>
          ${POINT_TYPES.map((type) => `<div class="event__type-item">
            <input id="event-type-${type}-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="${type}" ${type === chosenType ? 'checked' : ''}>
            <label class="event__type-label  event__type-label--${type}" for="event-type-${type}-1">${capitalizeFirstLetter(type)}</label>
          </div>`).join('')}
        </fieldset>
      </div>
    </div>`
  );
}

function createDestinationSelectionTemplate({
  allDestinations, chosenDestination, isDisabled
}) {
  const destinationName = chosenDestination?.name || '';

  return (
    `<input class="event__input  event__input--destination" id="event-destination-1" type="text" name="event-destination" value="${he.encode(destinationName)}" list="destination-list-1" ${isDisabled ? 'disabled' : ''}>
    <datalist id="destination-list-1">
      ${allDestinations.map((destinationItem) => `<option value="${destinationItem.name}"></option>`).join('')}
    </datalist>`
  );
}

function createOffersListTemplate({
  allTypeOffers, chosenOffersIds, isDisabled
}) {
  return (
    `<section class="event__section  event__section--offers">
      <h3 class="event__section-title  event__section-title--offers">Offers</h3>

      <div class="event__available-offers">
        ${allTypeOffers.map((offer) => `<div class="event__offer-selector">
          <input class="event__offer-checkbox  visually-hidden" id="event-offer-${offer.id}-1" type="checkbox" name="event-offer-${offer.id}" data-offer-id="${offer.id}" ${chosenOffersIds.includes(offer.id) ? 'checked' : ''} ${isDisabled ? 'disabled' : ''}>
          <label class="event__offer-label" for="event-offer-${offer.id}-1">
            <span class="event__offer-title">${offer.title}</span>
            &plus;&euro;&nbsp;
            <span class="event__offer-price">${offer.price}</span>
          </label>
        </div>`).join('')}
      </div>
    </section>`
  );
}

function createDestinationTemplate(chosenDestination) {
  return (
    `<section class="event__section  event__section--destination">
      <h3 class="event__section-title  event__section-title--destination">Destination</h3>
      <p class="event__destination-description">${chosenDestination.description}</p>
      ${chosenDestination.pictures?.length ? `<div class="event__photos-container"><div class="event__photos-tape">
        ${chosenDestination.pictures.map((picture) => `<img class="event__photo" src="${picture.src}" alt="${picture.description}">`).join('')}
      </div></div>` : ''}
    </section>`
  );
}

function createNewPointControlsTemplate(isDisabled, isSaving) {
  return (
    `<button class="event__save-btn  btn  btn--blue" type="submit" ${isDisabled ? 'disabled' : ''}>
      ${isSaving ? 'Saving...' : 'Save'}
    </button>
    <button class="event__reset-btn" type="reset" data-action="delete" ${isDisabled ? 'disabled' : ''}>Cancel</button>`
  );
}

function createPointEditControlsTemplate(isDisabled, isDeleting, isSaving) {
  return (
    `<button class="event__save-btn  btn  btn--blue" type="submit" ${isDisabled ? 'disabled' : ''}>
      ${isSaving ? 'Saving...' : 'Save'}
    </button>
    <button class="event__reset-btn" type="reset" data-action="delete" ${isDisabled ? 'disabled' : ''}>
      ${isDeleting ? 'Deleting...' : 'Delete'}
    </button>

    <button class="event__rollup-btn" type="button" ${isDisabled ? 'disabled' : ''}>
      <span class="visually-hidden">Open event</span>
    </button>`
  );
}

function createPointEditTemplate({
  point, allOffers, allDestinations, isNewPoint
}) {
  const {
    type, destination: destinationId,
    basePrice, offers: chosenOffersIds,
    isDisabled, isSaving, isDeleting
  } = point;

  const allTypeOffers = allOffers.find((offer) => offer.type === type)?.offers;

  const chosenDestination = allDestinations.find((destination) => destination.id === destinationId);

  return (
    `<li class="trip-events__item">
      <form class="event event--edit" action="#" method="post">
        <header class="event__header">

          ${createEventSelectionTemplate(type, isDisabled)}

          <div class="event__field-group  event__field-group--destination">
            <label class="event__label  event__type-output" for="event-destination-1">
              ${type}
            </label>
            ${createDestinationSelectionTemplate({allDestinations, chosenDestination, isDisabled})}
          </div>

          <div class="event__field-group  event__field-group--time">
            <label class="visually-hidden" for="event-start-time-1">From</label>
            <input class="event__input  event__input--time" id="event-start-time-1" type="text" name="event-start-time" ${isDisabled ? 'disabled' : ''}>
            &mdash;
            <label class="visually-hidden" for="event-end-time-1">To</label>
            <input class="event__input  event__input--time" id="event-end-time-1" type="text" name="event-end-time" ${isDisabled ? 'disabled' : ''}>
          </div>

          <div class="event__field-group  event__field-group--price">
            <label class="event__label" for="event-price-1">
              <span class="visually-hidden">Price</span>
              &euro;
            </label>
            <input class="event__input  event__input--price" id="event-price-1" type="number" name="event-price" value="${basePrice}" ${isDisabled ? 'disabled' : ''}>
          </div>

          ${isNewPoint ? createNewPointControlsTemplate(isDisabled, isSaving) : createPointEditControlsTemplate(isDisabled, isDeleting, isSaving)}

        </header>
        <section class="event__details">

          ${(allTypeOffers && allTypeOffers.length) ? createOffersListTemplate({allTypeOffers, chosenOffersIds, isDisabled}) : ''}

          ${chosenDestination ? createDestinationTemplate(chosenDestination) : ''}

        </section>
      </form>
    </li>`
  );
}

export default class PointEditView extends AbstractStatefulView {
  #isNewPoint = null;
  #allOffers = null;
  #allDestinations = null;
  #handleResetClick = null;
  #handleDeleteClick = null;
  #handleFormSubmit = null;
  #datepickerFrom = null;
  #datepickerTo = null;
  #datepickerSettings = {
    enableTime: true,
    dateFormat: 'd/m/y H:i',
    'time_24hr': true,
    locale: {
      firstDayOfWeek: 1
    }
  };

  constructor({
    point = BLANK_POINT, isNewPoint = false, allOffers, allDestinations,
    handleResetClick, handleDeleteClick, handleFormSubmit
  }) {
    super();
    this.#isNewPoint = isNewPoint;
    this.#allOffers = allOffers;
    this.#allDestinations = allDestinations;
    this._setState(PointEditView.parsePointToState(point));

    this.#handleResetClick = handleResetClick;
    this.#handleDeleteClick = handleDeleteClick;
    this.#handleFormSubmit = handleFormSubmit;

    this._restoreHandlers();
  }

  get template() {
    return createPointEditTemplate({
      point: this._state,
      allOffers: this.#allOffers,
      allDestinations: this.#allDestinations,
      isNewPoint: this.#isNewPoint
    });
  }

  removeElement() {
    super.removeElement();

    if (this.#datepickerFrom) {
      this.#datepickerFrom.destroy();
      this.#datepickerFrom = null;
    }

    if (this.#datepickerTo) {
      this.#datepickerTo.destroy();
      this.#datepickerTo = null;
    }
  }

  reset(point) {
    this.updateElement(
      PointEditView.parsePointToState(point),
    );
  }

  _restoreHandlers() {
    this.element
      .querySelector('.event__rollup-btn')
      ?.addEventListener('click', this.#resetClickHandler);

    this.element
      .querySelector('.event__reset-btn')
      .addEventListener('click', this.#pointDeleteClickHandler);

    this.element
      .querySelector('.event__type-group')
      .addEventListener('change', this.#typeChangeHandler);

    this.element
      .querySelector('.event__available-offers')
      ?.addEventListener('change', this.#offersChooseHandler);

    this.element
      .querySelector('#event-price-1')
      .addEventListener('change', this.#priceChangeHandler);

    this.element
      .querySelector('#event-destination-1')
      .addEventListener('change', this.#destinationChangeHandler);

    this.element
      .querySelector('form')
      .addEventListener('submit', this.#formSubmitHandler);

    this.#setDatepickers();
  }

  #setDatepickers() {
    const [dateFromElement, dateToElement] = this.element
      .querySelectorAll('.event__input--time');

    this.#datepickerFrom = flatpickr(
      dateFromElement,
      {
        defaultDate: this._state.dateFrom,
        maxDate: this._state.dateTo,
        onClose: this.#dateFromChangeHandler,
        ...this.#datepickerSettings
      }
    );

    this.#datepickerTo = flatpickr(
      dateToElement,
      {
        defaultDate: this._state.dateTo,
        minDate: this._state.dateFrom,
        onClose: this.#dateToChangeHandler,
        ...this.#datepickerSettings
      }
    );
  }

  #resetClickHandler = (evt) => {
    evt.preventDefault();

    this.#handleResetClick();
  };

  #typeChangeHandler = (evt) => {
    if (evt.target.tagName !== 'INPUT') {
      return;
    }

    evt.preventDefault();

    this.updateElement({
      offers: [],
      type: evt.target.value
    });
  };

  #offersChooseHandler = (evt) => {
    if (evt.target.tagName !== 'INPUT') {
      return;
    }

    evt.preventDefault();

    const offerChecked = evt.target.checked;
    const offerId = evt.target.dataset.offerId;
    const chosenOffers = [...this._state.offers];

    if (offerChecked && !chosenOffers.includes(offerId)) {
      chosenOffers.push(offerId);
    } else if (!offerChecked && chosenOffers.includes(offerId)) {
      chosenOffers.splice(chosenOffers.indexOf(offerId), 1);
    } else {
      return;
    }

    this._setState({
      offers: chosenOffers
    });
  };

  #dateFromChangeHandler = ([userDate]) => {
    this.updateElement({
      dateFrom: userDate,
    });
  };

  #dateToChangeHandler = ([userDate]) => {
    this.updateElement({
      dateTo: userDate,
    });
  };

  #priceChangeHandler = (evt) => {
    evt.preventDefault();

    this._setState({
      basePrice: evt.target.value
    });
  };

  #destinationChangeHandler = (evt) => {
    evt.preventDefault();

    const chosenDestination = this.#allDestinations
      .find((destination) => destination.name === evt.target.value);

    if (chosenDestination) {
      this.updateElement({
        destination: chosenDestination.id
      });
    }
  };

  #pointDeleteClickHandler = (evt) => {
    evt.preventDefault();

    this.#handleDeleteClick(PointEditView.parseStateToPoint(this._state));
  };

  #formSubmitHandler = (evt) => {
    evt.preventDefault();

    this.#handleFormSubmit(PointEditView.parseStateToPoint(this._state));
  };

  static parsePointToState = (point) => ({
    ...point,
    isDisabled: false,
    isSaving: false,
    isDeleting: false
  });

  static parseStateToPoint = (state) => {
    const point = {...state};

    delete point.isDisabled;
    delete point.isSaving;
    delete point.isDeleting;

    return point;
  };
}
