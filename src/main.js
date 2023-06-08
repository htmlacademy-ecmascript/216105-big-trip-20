import {render, RenderPosition} from './framework/render.js';

import TripInfoView from './view/trip-info-view.js';

import TripPresenter from './presenter/trip-presenter.js';
import FilterPresenter from './presenter/filter-presenter.js';

import MockService from './service/mock-service.js';
import PointsModel from './model/points-model.js';
import OffersModel from './model/offers-model.js';
import DestinationsModel from './model/destinations-model.js';
import FilterModel from './model/filter-model.js';

const tripMainElement = document.querySelector('.trip-main');
const filtersElement = document.querySelector('.trip-controls__filters');
const tripEventsElement = document.querySelector('.trip-events');

const mockService = new MockService();
const pointsModel = new PointsModel(mockService);
const offersModel = new OffersModel(mockService);
const destinationsModel = new DestinationsModel(mockService);
const filterModel = new FilterModel();

const filterPresenter = new FilterPresenter({
  container: filtersElement,
  pointsModel,
  filterModel
});

const tripPresenter = new TripPresenter({
  mainContainer: tripMainElement,
  tripContainer: tripEventsElement,
  pointsModel,
  offersModel,
  destinationsModel,
  filterModel,
});

render(new TripInfoView(), tripMainElement, RenderPosition.AFTERBEGIN);

filterPresenter.init();
tripPresenter.init();
