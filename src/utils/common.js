function capitalizeFirstLetter(str) {
  return str.substring(0, 1).toUpperCase() + str.substring(1);
}

function updateItems(items, update) {
  return items.map((item) => item.id === update.id ? update : item);
}

export {capitalizeFirstLetter, updateItems};
