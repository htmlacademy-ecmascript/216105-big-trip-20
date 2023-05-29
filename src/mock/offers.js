const mockOffers = [
  {
    'type': 'taxi',
    'offers': [
      {
        'id': '1',
        'title': 'Choose the radio station',
        'price': 5
      },
      {
        'id': '2',
        'title': 'Test taxi offer 2',
        'price': 7
      }
    ]
  },
  {
    'type': 'flight',
    'offers': [
      {
        'id': '1',
        'title': 'Add luggage',
        'price': 30
      },
      {
        'id': '2',
        'title': 'Switch to comfort class',
        'price': 100
      },
      {
        'id': '3',
        'title': 'Add meal',
        'price': 15
      }
    ]
  },
  {
    'type': 'check-in',
    'offers': []
  }
];

function getRandomOffers(type) {
  return mockOffers
    .find((item) => item.type === type).offers
    .map((item) => item.id)
    .filter(() => Boolean(Math.round(Math.random())));
}

export {mockOffers, getRandomOffers};
