import AbstractView from '../framework/view/abstract-view.js';

function createNewPointButtonTemplate() {
  return '<button class="trip-main__event-add-btn  btn  btn--big  btn--yellow" type="button">New event</button>';
}

export default class NewPointButtonView extends AbstractView {
  #handleNewPointButtonClick = null;

  constructor({handleNewPointButtonClick}) {
    super();
    this.#handleNewPointButtonClick = handleNewPointButtonClick;
    this.element.addEventListener('click', this.#clickNewPointButtonHandler);
  }

  get template() {
    return createNewPointButtonTemplate();
  }

  setDisabled(isDisabled = false) {
    this.element.disabled = isDisabled;
  }

  #clickNewPointButtonHandler = (evt) => {
    evt.preventDefault();
    this.#handleNewPointButtonClick();
  };
}
