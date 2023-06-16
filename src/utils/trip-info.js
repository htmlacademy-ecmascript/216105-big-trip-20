import dayjs from 'dayjs';

const DATE_FORMAT = 'MMM D';

function getDestinationsNames({points, destinations}) {
  return points.map((point) => {
    const pointDestination = destinations
      .find((destination) => destination.id === point.destination);
    return pointDestination?.name;
  });
}

function getTripTitle(destinationsNames) {
  if (destinationsNames.length > 3) {
    destinationsNames = [
      destinationsNames.at(0),
      '&hellip;',
      destinationsNames.at(-1)
    ];
  }

  return destinationsNames
    .map((destinationName) => `${destinationName}`)
    .join(' &mdash; ');
}

function getTripDuration({startDate, endDate}) {
  startDate = dayjs(startDate);
  endDate = dayjs(endDate);

  if (startDate.month() === endDate.month()) {
    return `
      ${startDate.format(DATE_FORMAT)}
      &nbsp;&mdash;&nbsp;
      ${endDate.format('D')}
    `;
  }

  return `
    ${startDate.format(DATE_FORMAT)}
    &nbsp;&mdash;&nbsp;
    ${endDate.format(DATE_FORMAT)}
  `;
}

function getTotalSum({points, offersModel}) {
  return points.reduce((totalSum, point) => {
    const pointOffers = offersModel.getByIdsAndType({
      offers: point.offers,
      type: point.type
    });

    const pointOffersSum = pointOffers
      .reduce((offersSum, offer) => Number(offer.price) + offersSum, 0);

    return Number(point.basePrice) + pointOffersSum + totalSum;
  }, 0);
}

export {getDestinationsNames, getTripTitle, getTripDuration, getTotalSum};
