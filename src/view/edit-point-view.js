import AbstractView from '../framework/view/abstract-view.js';
import {POINT_TYPES, BLANK_POINT} from '../consts.js';
import {humanizeEditPointTime, capitalizeFirstLetter} from '../utils.js';

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

function createOffersListTemplate(allOffers, chosenOffersIds) {
  return (/*html*/
    `<section class="event__section  event__section--offers">
      <h3 class="event__section-title  event__section-title--offers">Offers</h3>

      <div class="event__available-offers">
        ${allOffers.map((offer) => `<div class="event__offer-selector">
          <input class="event__offer-checkbox  visually-hidden" id="event-offer-${offer.id}-1" type="checkbox" name="event-offer-${offer.id}" ${chosenOffersIds.includes(offer.id) ? 'checked' : ''}>
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

function createEditPointTemplate(point, allOffers, allDestinations, chosenDestination) {
  const {
    dateFrom, dateTo, type,
    basePrice, offers: chosenOffersIds
  } = point;

  return (/*html*/
    `<li class="trip-events__item">
      <form class="event event--edit" action="#" method="post">
        <header class="event__header">

          ${createEventSelectionTemplate(type)}

          <div class="event__field-group  event__field-group--destination">
            <label class="event__label  event__type-output" for="event-destination-1">
              ${type}
            </label>
            <input class="event__input  event__input--destination" id="event-destination-1" type="text" name="event-destination" value="${chosenDestination.name}" list="destination-list-1">
            <datalist id="destination-list-1">
              ${allDestinations.map((destinationItem) => `<option value="${destinationItem.name}"></option>`).join('')}
            </datalist>
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
          <button class="event__reset-btn" type="reset">Delete</button>
          <button class="event__rollup-btn" type="button">
            <span class="visually-hidden">Open event</span>
          </button>
        </header>
        <section class="event__details">

          ${allOffers ? createOffersListTemplate(allOffers, chosenOffersIds) : ''}

          ${chosenDestination ? createDestinationTemplate(chosenDestination) : ''}

        </section>
      </form>
    </li>`
  );
}

export default class EditPointView extends AbstractView {
  #point = null;
  #allOffers = null;
  #allDestinations = null;
  #chosenDestination = null;

  constructor(point = BLANK_POINT, allOffers, allDestinations, chosenDestination) {
    super();
    this.#point = point;
    this.#allOffers = allOffers;
    this.#allDestinations = allDestinations;
    this.#chosenDestination = chosenDestination;
  }

  get template() {
    return createEditPointTemplate(this.#point, this.#allOffers, this.#allDestinations, this.#chosenDestination);
  }
}
