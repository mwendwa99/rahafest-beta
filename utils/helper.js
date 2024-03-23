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

export function getInitials(name) {
  // Split the name into first and second names
  var names = name.split(" ");
  // Get the first letter of each name
  var initials = names[0][0] + names[1][0];
  return initials;
}

export function formatDate(timestamp) {
  const date = new Date(timestamp);
  const options = {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
  };
  return date.toLocaleDateString("en-US", options);
}
