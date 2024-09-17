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

export const formatDate = (date) => {
  const options = { month: "short", day: "numeric" };
  return new Intl.DateTimeFormat("en-US", options).format(new Date(date));
};

export const formatTime = (date) => {
  const options = { hour: "numeric", minute: "numeric", hour12: true };
  return new Intl.DateTimeFormat("en-US", options)
    .format(new Date(date))
    .replace("AM", "am")
    .replace("PM", "pm");
};

export const formatEventDates = (start_date, end_date) => {
  const startDate = new Date(start_date);
  const endDate = new Date(end_date);

  const isSameDayAndMonth =
    startDate.getDate() === endDate.getDate() &&
    startDate.getMonth() === endDate.getMonth() &&
    startDate.getFullYear() === endDate.getFullYear();

  const startDateFormatted = formatDate(start_date);
  const endDateFormatted = formatDate(end_date);
  const startTimeFormatted = formatTime(start_date);
  const endTimeFormatted = formatTime(end_date);

  if (isSameDayAndMonth) {
    return `${startDateFormatted} from ${startTimeFormatted}`;
  } else {
    return `${startDateFormatted} to ${endDateFormatted} from ${startTimeFormatted}`;
  }
};

export function formatCurrencyWithCommas(number) {
  // Round to the nearest whole number
  const roundedNumber = Math.round(number);

  // Format with commas
  return roundedNumber.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

// Function to format phone number
export const formatPhoneNumberToMpesaFormat = (phoneNumber) => {
  return phoneNumber.replace(/^0/, "254");
};

export function formatTimestamp(timestamp) {
  const date = new Date(timestamp);
  const now = new Date();

  const isToday = date.toDateString() === now.toDateString();

  const yesterday = new Date();
  yesterday.setDate(now.getDate() - 1);
  const isYesterday = date.toDateString() === yesterday.toDateString();

  if (isToday) {
    return `Today, ${date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    })}`;
  } else if (isYesterday) {
    return `Yesterday, ${date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    })}`;
  } else {
    return date.toLocaleString("en-US", {
      weekday: "long",
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    });
  }
}
