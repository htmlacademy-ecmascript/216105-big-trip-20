import AbstractView from '../framework/view/abstract-view.js';
import {NoPointsMessage} from '../consts.js';

function getMessage({filterType, isLoading, isError}) {
  if (isLoading) {
    return 'Loading...';
  }

  if (isError) {
    return 'Something went wrong. Please try again later.';
  }

  return `${NoPointsMessage[filterType]}`;
}

function createMessageTemplate({filterType, isLoading, isError}) {
  return (
    `<p class="trip-events__msg">
      ${getMessage({filterType, isLoading, isError})}
    </p>`
  );
}

export default class MessageView extends AbstractView {
  #filterType = null;
  #isLoading = false;
  #isError = false;

  constructor({filterType, isLoading, isError}) {
    super();
    this.#filterType = filterType;
    this.#isLoading = isLoading;
    this.#isError = isError;
  }

  get template() {
    return createMessageTemplate({
      filterType: this.#filterType,
      isLoading: this.#isLoading,
      isError: this.#isError
    });
  }
}
