import {render, RenderPosition} from './framework/render.js';

import TripInfoView from './view/trip-info-view.js';

import TripPresenter from './presenter/trip-presenter.js';
import FilterPresenter from './presenter/filter-presenter.js';

import PointsApiService from './service/points-api-service.js';

import PointsModel from './model/points-model.js';
import OffersModel from './model/offers-model.js';
import DestinationsModel from './model/destinations-model.js';
import FilterModel from './model/filter-model.js';

const AUTHORIZATION = 'Basic 4I3gT8Cn0jmjetxy';
const END_POINT = 'https://20.ecmascript.pages.academy/big-trip';

const tripMainElement = document.querySelector('.trip-main');
const filtersElement = document.querySelector('.trip-controls__filters');
const tripEventsElement = document.querySelector('.trip-events');

const pointsApiService = new PointsApiService(END_POINT, AUTHORIZATION);

const offersModel = new OffersModel(pointsApiService);
const destinationsModel = new DestinationsModel(pointsApiService);
const pointsModel = new PointsModel({
  service: pointsApiService,
  offersModel,
  destinationsModel
});
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
pointsModel.init();
