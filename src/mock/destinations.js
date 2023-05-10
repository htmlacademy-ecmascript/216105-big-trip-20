import {getRandomArrayElement} from './utils.js';

const PICTURE_PLACEHOLDER_URL = 'https://place-hold.it/300x200/';

const mockDestinations = [
  {
    'id': 1,
    'description': 'Chamonix, is a beautiful city, a true asian pearl, with crowded streets.',
    'name': 'Chamonix',
    'pictures': [
      {
        'src': PICTURE_PLACEHOLDER_URL,
        'description': 'Chamonix parliament building'
      },
      {
        'src': PICTURE_PLACEHOLDER_URL,
        'description': 'Chamonix parliament building'
      }
    ]
  },
  {
    'id': 2,
    'description': 'Geneva is a city in Switzerland that lies at the southern tip of expansive Lac Léman (Lake Geneva). Surrounded by the Alps and Jura mountains, the city has views of dramatic Mont Blanc.',
    'name': 'Geneva',
    'pictures': [
      {
        'src': PICTURE_PLACEHOLDER_URL,
        'description': 'Geneva img test desc'
      }
    ]
  },
  {
    'id': 3,
    'description': 'Amsterdam test desc',
    'name': 'Amsterdam',
    'pictures': []
  }
];

function getRandomDestination() {
  return getRandomArrayElement(mockDestinations).id;
}

export {mockDestinations, getRandomDestination};
