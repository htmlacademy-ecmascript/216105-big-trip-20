import AbstractView from '../framework/view/abstract-view.js';
import {
  humanizePointDay,
  humanizePointTime,
  getPointDuration
} from '../utils/point.js';

function createOffersTemplate(pointOffers) {
  return pointOffers.length ? (
    `<ul class="event__selected-offers">
      ${pointOffers.map(({title, price}) => `<li class="event__offer">
        <span class="event__offer-title">${title}</span>
        &plus;&euro;&nbsp;
        <span class="event__offer-price">${price}</span>
      </li>`).join('')}
    </ul>`
  ) : '';
}

function createPointTemplate(point, pointOffers, pointDestination) {
  const {
    dateFrom, dateTo, type,
    basePrice, isFavorite
  } = point;

  const day = humanizePointDay(dateFrom);
  const timeFrom = humanizePointTime(dateFrom);
  const timeTo = humanizePointTime(dateTo);
  const duration = getPointDuration(dateFrom, dateTo);
  const favoriteActiveClassName = isFavorite ?
    'event__favorite-btn--active' : '';

  return (/*html*/
    `<li class="trip-events__item">
      <div class="event">
        <time class="event__date" datetime="2019-03-18">${day}</time>
        <div class="event__type">
          <img class="event__type-icon" width="42" height="42" src="img/icons/${type}.png" alt="Event type icon">
        </div>
        <h3 class="event__title">${type} ${pointDestination.name}</h3>
        <div class="event__schedule">
          <p class="event__time">
            <time class="event__start-time" datetime="${dateFrom}">${timeFrom}</time>
            &mdash;
            <time class="event__end-time" datetime="${dateTo}">${timeTo}</time>
          </p>
          <p class="event__duration">${duration}</p>
        </div>
        <p class="event__price">
          &euro;&nbsp;<span class="event__price-value">${basePrice}</span>
        </p>
        <h4 class="visually-hidden">Offers:</h4>
        ${createOffersTemplate(pointOffers)}
        <button class="event__favorite-btn ${favoriteActiveClassName}" type="button">
          <span class="visually-hidden">Add to favorite</span>
          <svg class="event__favorite-icon" width="28" height="28" viewBox="0 0 28 28">
            <path d="M14 21l-8.22899 4.3262 1.57159-9.1631L.685209 9.67376 9.8855 8.33688 14 0l4.1145 8.33688 9.2003 1.33688-6.6574 6.48934 1.5716 9.1631L14 21z"/>
          </svg>
        </button>
        <button class="event__rollup-btn" type="button">
          <span class="visually-hidden">Open event</span>
        </button>
      </div>
    </li>`
  );
}

export default class PointView extends AbstractView {
  #point = null;
  #pointOffers = null;
  #pointDestination = null;
  #handleEditClick = null;
  #handleFavoriteClick = null;

  constructor({point, pointOffers, pointDestination, onEditClick, onFavoriteClick}) {
    super();
    this.#point = point;
    this.#pointOffers = pointOffers;
    this.#pointDestination = pointDestination;

    this.#handleEditClick = onEditClick;
    this.#handleFavoriteClick = onFavoriteClick;

    this.element.querySelector('.event__rollup-btn')
      .addEventListener('click', this.#editClickHandler);
    this.element.querySelector('.event__favorite-btn')
      .addEventListener('click', this.#favoriteClickHandler);
  }

  get template() {
    return createPointTemplate(this.#point, this.#pointOffers, this.#pointDestination);
  }

  #editClickHandler = (evt) => {
    evt.preventDefault();
    this.#handleEditClick();
  };

  #favoriteClickHandler = (evt) => {
    evt.preventDefault();
    this.#handleFavoriteClick();
  };
}
