import AbstractView from '../framework/view/abstract-view.js';
import {SortTypes, EnabledSortTypes} from '../const.js';

function createSortItemTemplate(sortType, currentSortType) {
  return (
    `<div class="trip-sort__item  trip-sort__item--${sortType}">
      <input
        id="sort-${sortType}"
        class="trip-sort__input  visually-hidden"
        type="radio"
        name="trip-sort"
        value="sort-${sortType}"
        data-sort-type="${sortType}"
        ${sortType === currentSortType ? 'checked' : ''}
        ${EnabledSortTypes[sortType] ? '' : 'disabled'}
      >
      <label class="trip-sort__btn" for="sort-${sortType}">${sortType}</label>
    </div>`
  );
}

function createSortTemplate(currentSortType) {
  const sortItemsTemplate = Object.values(SortTypes)
    .map((type) => createSortItemTemplate(type, currentSortType))
    .join('');

  return (
    `<form class="trip-events__trip-sort  trip-sort" action="#" method="get">
      ${sortItemsTemplate}
    </form>`
  );
}

export default class SortView extends AbstractView {
  #handleSortTypeChange = null;
  #currentSortType = null;

  constructor({currentSortType, onSortTypeChange}) {
    super();
    this.#handleSortTypeChange = onSortTypeChange;
    this.#currentSortType = currentSortType;

    this.element.addEventListener('change', this.#sortTypeChangeHandler);
  }

  get template() {
    return createSortTemplate(this.#currentSortType);
  }

  #sortTypeChangeHandler = (evt) => {
    if (evt.target.tagName !== 'INPUT') {
      return;
    }

    evt.preventDefault();
    this.#handleSortTypeChange(evt.target.dataset.sortType);
  };
}
