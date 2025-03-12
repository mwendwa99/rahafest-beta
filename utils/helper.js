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
  const formattedDate = new Date(date);
  if (isNaN(formattedDate)) return ""; // Check for invalid date
  return new Intl.DateTimeFormat("en-US", options).format(formattedDate);
};

export const formatTime = (date) => {
  const options = { hour: "numeric", minute: "numeric", hour12: true };
  const formattedTime = new Date(date);
  if (isNaN(formattedTime)) return ""; // Check for invalid date
  return new Intl.DateTimeFormat("en-US", options)
    .format(formattedTime)
    .replace("AM", "am")
    .replace("PM", "pm");
};

export function formatEventDates(start_date, end_date) {
  if (!start_date || !end_date) return "Invalid date range";

  // Parse dates without timezone conversion
  const startDate = new Date(start_date);
  const endDate = new Date(end_date);

  // Check if end date is midnight (00:00:00) of the next day
  const isMidnightNextDay =
    endDate.getHours() === 0 &&
    endDate.getMinutes() === 0 &&
    endDate.getSeconds() === 0 &&
    new Date(endDate.getTime() - 86400000).getDate() === startDate.getDate() &&
    new Date(endDate.getTime() - 86400000).getMonth() ===
      startDate.getMonth() &&
    new Date(endDate.getTime() - 86400000).getFullYear() ===
      startDate.getFullYear();

  // If it's midnight of the next day, adjust the end date to be the previous day
  const adjustedEndDate = isMidnightNextDay
    ? new Date(endDate.getTime() - 1) // Subtract 1 ms to get 23:59:59 of the previous day
    : endDate;

  // Extract date components
  const startYear = startDate.getFullYear();
  const startMonth = startDate.getMonth();
  const startDay = startDate.getDate();

  const endYear = adjustedEndDate.getFullYear();
  const endMonth = adjustedEndDate.getMonth();
  const endDay = adjustedEndDate.getDate();

  // Compare dates - now using the adjusted end date
  if (startYear === endYear && startMonth === endMonth && startDay === endDay) {
    return formatDate(start_date);
  } else {
    return `${formatDate(start_date)} and ${formatDate(end_date)}`;
  }
}

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

export function getTime(date) {
  if (!date) return "Invalid date";
  return new Date(date).toLocaleString("en-US", {
    hour: "numeric",
    minute: "numeric",
    hour12: true,
  });
}

export const stripHtmlTags = (html) => {
  return html.replace(/<[^>]*>/g, "").trim();
};
