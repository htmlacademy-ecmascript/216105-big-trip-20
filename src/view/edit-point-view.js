import AbstractStatefulView from '../framework/view/abstract-stateful-view.js';
import {POINT_TYPES, BLANK_POINT} from '../consts.js';
import {humanizeEditPointTime} from '../utils/point.js';
import {capitalizeFirstLetter} from '../utils/common.js';

function createEventSelectionTemplate(chosenType) {
  return (/*html*/
    `<div class="event__type-wrapper">
      <label class="event__type  event__type-btn" for="event-type-toggle-1">
        <span class="visually-hidden">Choose event type</span>
        <img class="event__type-icon" width="17" height="17" src="img/icons/${chosenType}.png" alt="Event type icon">
      </label>
      <input class="event__type-toggle visually-hidden" id="event-type-toggle-1" type="checkbox">

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

function createDestinationSelectionTemplate(allDestinations, chosenDestination) {
  return (
    `<input class="event__input  event__input--destination" id="event-destination-1" type="text" name="event-destination" value="${chosenDestination.name}" list="destination-list-1">
    <datalist id="destination-list-1">
      ${allDestinations.map((destinationItem) => `<option value="${destinationItem.name}"></option>`).join('')}
    </datalist>`
  );
}

function createOffersListTemplate(allTypeOffers, chosenOffersIds) {
  return (/*html*/
    `<section class="event__section  event__section--offers">
      <h3 class="event__section-title  event__section-title--offers">Offers</h3>

      <div class="event__available-offers">
        ${allTypeOffers.map((offer) => `<div class="event__offer-selector">
          <input class="event__offer-checkbox  visually-hidden" id="event-offer-${offer.id}-1" type="checkbox" name="event-offer-${offer.id}" data-offer-id="${offer.id}" ${chosenOffersIds.includes(offer.id) ? 'checked' : ''}>
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
  return (/*html*/
    `<section class="event__section  event__section--destination">
      <h3 class="event__section-title  event__section-title--destination">Destination</h3>
      <p class="event__destination-description">${chosenDestination.description}</p>
      ${chosenDestination.pictures?.length ? `<div class="event__photos-tape">
        ${chosenDestination.pictures.map((picture) => `<img class="event__photo" src="${picture.src}" alt="${picture.description}">`).join('')}
      </div>` : ''}
    </section>`
  );
}

function createEditPointTemplate({point, allOffers, allDestinations}) {
  const {
    dateFrom, dateTo, type,
    destination: destinationId, destinationName,
    basePrice, offers: chosenOffersIds
  } = point;

  const allTypeOffers = allOffers.find((offer) => offer.type === type).offers;
  const chosenDestination = allDestinations.find((destination) => {
    if (destinationName) {
      return destination.name === destinationName;
    }
    return destination.id === destinationId;
  });

  return (/*html*/
    `<li class="trip-events__item">
      <form class="event event--edit" action="#" method="post">
        <header class="event__header">

          ${createEventSelectionTemplate(type)}

          <div class="event__field-group  event__field-group--destination">
            <label class="event__label  event__type-output" for="event-destination-1">
              ${type}
            </label>
            ${createDestinationSelectionTemplate(allDestinations, chosenDestination)}
          </div>

          <div class="event__field-group  event__field-group--time">
            <label class="visually-hidden" for="event-start-time-1">From</label>
            <input class="event__input  event__input--time" id="event-start-time-1" type="text" name="event-start-time" value="${humanizeEditPointTime(dateFrom)}">
            &mdash;
            <label class="visually-hidden" for="event-end-time-1">To</label>
            <input class="event__input  event__input--time" id="event-end-time-1" type="text" name="event-end-time" value="${humanizeEditPointTime(dateTo)}">
          </div>

          <div class="event__field-group  event__field-group--price">
            <label class="event__label" for="event-price-1">
              <span class="visually-hidden">Price</span>
              &euro;
            </label>
            <input class="event__input  event__input--price" id="event-price-1" type="text" name="event-price" value="${basePrice}">
          </div>

          <button class="event__save-btn  btn  btn--blue" type="submit">Save</button>
          <button class="event__reset-btn" type="reset" data-action="delete">Delete</button>
          <button class="event__rollup-btn" type="button">
            <span class="visually-hidden">Open event</span>
          </button>
        </header>
        <section class="event__details">

          ${(allTypeOffers && allTypeOffers.length) ? createOffersListTemplate(allTypeOffers, chosenOffersIds) : ''}

          ${chosenDestination ? createDestinationTemplate(chosenDestination) : ''}

        </section>
      </form>
    </li>`
  );
}

export default class EditPointView extends AbstractStatefulView {
  #allOffers = null;
  #allDestinations = null;
  #handleResetClick = null;
  #handleDeleteClick = null;
  #handleFormSubmit = null;

  constructor({
    point = BLANK_POINT, allOffers, allDestinations,
    onResetClick, onDeleteClick, onFormSubmit
  }) {
    super();
    this.#allOffers = allOffers;
    this.#allDestinations = allDestinations;
    this._setState(EditPointView.parsePointToState(point));

    this.#handleResetClick = onResetClick;
    this.#handleDeleteClick = onDeleteClick;
    this.#handleFormSubmit = onFormSubmit;

    this._restoreHandlers();
  }

  get template() {
    return createEditPointTemplate({
      point: this._state,
      allOffers: this.#allOffers,
      allDestinations: this.#allDestinations
    });
  }

  reset(point) {
    this.updateElement(
      EditPointView.parsePointToState(point),
    );
  }

  _restoreHandlers() {
    this.element
      .querySelector('.event__rollup-btn')
      .addEventListener('click', this.#resetClickHandler);

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

    this.element.querySelector('[data-action="delete"]')
      .addEventListener('click', this.#pointDeleteClickHandler);

    this.element
      .querySelector('form')
      .addEventListener('submit', this.#formSubmitHandler);
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

    const chosenOffers = Array
      .from(this.element.querySelectorAll('.event__offer-checkbox:checked'))
      .map((element) => element.dataset.offerId);

    this._setState({
      offers: chosenOffers
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

    const chosenDestinationId = chosenDestination?.id || null;

    this.updateElement({
      destination: chosenDestinationId
    });
  };

  #pointDeleteClickHandler = (evt) => {
    evt.preventDefault();

    this.#handleDeleteClick(EditPointView.parseStateToPoint(this._state));
  };

  #formSubmitHandler = (evt) => {
    evt.preventDefault();

    this.#handleFormSubmit(EditPointView.parseStateToPoint(this._state));
  };

  static parsePointToState = (point) => ({...point});

  static parseStateToPoint = (state) => ({...state});
}
