// Function to filter and sort lineup data

export function filterAndSortLineup(dayKey, specialBandName, lineup) {
  const dayData = lineup[dayKey];
  const filteredData = dayData.filter(
    (artist) => artist.band_name !== specialBandName
  );
  const specialArtist = dayData.find(
    (artist) => artist.band_name === specialBandName
  );
  if (specialArtist) {
    filteredData.unshift(specialArtist);
  }
  return filteredData;
}

export function getCategory(data) {
  const uniqueCategory = new Set();
  data.forEach((item) => {
    uniqueCategory.add(item.category.name);
  });
  return Array.from(uniqueCategory);
}

export function getSubCategory(data) {
  const uniqueSubCategory = new Set();
  data.forEach((item) => {
    uniqueSubCategory.add(item.subcategory.name);
  });
  return Array.from(uniqueSubCategory);
}

export function getRandomNumber() {
  // Generate a random number between 0 (inclusive) and 1 (exclusive)
  const random = Math.random();

  // Scale the random number to fit your desired range (1 to 4)
  // Math.floor is used to ensure the result is an integer
  const randomNumber = Math.floor(random * 4) + 1;

  return randomNumber;
}
