const POINT_TYPES = ['taxi', 'bus', 'train', 'ship', 'drive', 'flight', 'check-in', 'sightseeing', 'restaurant'];

const DEFAULT_TYPE = 'flight';

const BLANK_POINT = {
  basePrice: 0,
  dateFrom: null,
  dateTo: null,
  destination: null,
  isFavourite: false,
  offers: [],
  type: DEFAULT_TYPE
};

const FilterType = {
  EVERYTHING: 'everything',
  PAST: 'past',
  PRESENT: 'present',
  FUTURE: 'future'
};

const NoPointsMessage = {
  EVERYTHING: 'Click New Event to create your first point',
  PAST: 'There are no past events now',
  PRESENT: 'There are no present events now',
  FUTURE: 'There are no future events now'
};

const SortTypes = {
  DAY: 'day',
  EVENT: 'event',
  TIME: 'time',
  PRICE: 'price',
  OFFER: 'offer'
};

const EnabledSortTypes = {
  [SortTypes.DAY]: true,
  [SortTypes.EVENT]: false,
  [SortTypes.TIME]: true,
  [SortTypes.PRICE]: true,
  [SortTypes.OFFER]: false
};

const DEFAULT_SORT_TYPE = 'DAY';

export {
  POINT_TYPES, BLANK_POINT, NoPointsMessage,
  FilterType, SortTypes, EnabledSortTypes, DEFAULT_SORT_TYPE
};
