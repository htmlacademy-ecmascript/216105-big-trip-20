import AbstractView from '../framework/view/abstract-view.js';
import {NoPointsMessage} from '../consts.js';

function createNoPointsTemplate(currentFilter) {
  return (
    `<p class="trip-events__msg">
      ${NoPointsMessage[currentFilter]}
    </p>`
  );
}

export default class NoPointsView extends AbstractView {
  #currentFilter = null;

  constructor(currentFilter) {
    super();
    this.#currentFilter = currentFilter;
  }

  get template() {
    return createNoPointsTemplate(this.#currentFilter);
  }
}
