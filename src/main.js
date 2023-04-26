import {render, RenderPosition} from './render.js';
import TripInfoView from './view/trip-info-view.js';
import FilterView from './view/filter-view.js';
import SortView from './view/sort-view.js';
import TripPresenter from './presenter/trip-presenter.js';

const tripMainElement = document.querySelector('.trip-main');
const filtersElement = document.querySelector('.trip-controls__filters');
const tripEventsElement = document.querySelector('.trip-events');
const tripPresenter = new TripPresenter({tripContainer: tripEventsElement});

render(new TripInfoView(), tripMainElement, RenderPosition.AFTERBEGIN);
render(new FilterView(), filtersElement);
render(new SortView(), tripEventsElement);

tripPresenter.init();