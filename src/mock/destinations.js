import {getRandomArrayElement} from '../utils.js';

const picturePlaceholderUrl = 'https://place-hold.it/300x200/';

const mockDestinations = [
  {
    'id': 1,
    'description': 'Chamonix, is a beautiful city, a true asian pearl, with crowded streets.',
    'name': 'Chamonix',
    'pictures': [
      {
        'src': picturePlaceholderUrl,
        'description': 'Chamonix parliament building'
      },
      {
        'src': picturePlaceholderUrl,
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
        'src': picturePlaceholderUrl,
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
