import {render, RenderPosition} from './framework/render.js';

import TripInfoView from './view/trip-info-view.js';

import TripPresenter from './presenter/trip-presenter.js';
import FilterPresenter from './presenter/filter-presenter.js';

import MockService from './service/mock-service.js';
import PointsModel from './model/points-model.js';
import OffersModel from './model/offers-model.js';
import DestinationsModel from './model/destinations-model.js';

const tripMainElement = document.querySelector('.trip-main');
const filtersElement = document.querySelector('.trip-controls__filters');
const tripEventsElement = document.querySelector('.trip-events');

const mockService = new MockService();
const pointsModel = new PointsModel(mockService);
const offersModel = new OffersModel(mockService);
const destinationsModel = new DestinationsModel(mockService);

const filterPresenter = new FilterPresenter({
  container: filtersElement,
  pointsModel
});

const tripPresenter = new TripPresenter({
  tripContainer: tripEventsElement,
  pointsModel,
  offersModel,
  destinationsModel
});

render(new TripInfoView(), tripMainElement, RenderPosition.AFTERBEGIN);

filterPresenter.init();
tripPresenter.init();