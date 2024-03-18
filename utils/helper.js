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
