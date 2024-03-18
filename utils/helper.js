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

export function getCategory(data){
  const uniqueCategory = new Set();
  data.forEach(item => {
    uniqueCategory.add(item.category.name)
  });
  return Array.from(uniqueCategory)
}

export function getSubCategory(data){
  const uniqueSubCategory = new Set();
  data.forEach(item => {
    uniqueSubCategory.add(item.subcategory.name)
  });
  return Array.from(uniqueSubCategory)
}
