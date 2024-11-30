export const formatDate = (date: string) => {
  const options = { month: "short", day: "numeric" };
  return new Intl.DateTimeFormat("en-US", options).format(new Date(date));
};

export const formatTime = (date: string) => {
  const options = { hour: "numeric", minute: "numeric", hour12: true };
  return new Intl.DateTimeFormat("en-US", options)
    .format(new Date(date))
    .replace("AM", "am")
    .replace("PM", "pm");
};

export const formatEventDates = (start_date: string, end_date: string) => {
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
    // return `${startDateFormatted} from ${startTimeFormatted}`;
    return `${startDateFormatted}`;
  } else {
    // return `${startDateFormatted} to ${endDateFormatted} from ${startTimeFormatted}`;
    return `${startDateFormatted} & ${endDateFormatted}`;
  }
};

export function formatCurrency(value: string): string {
  const numericValue = parseFloat(value); // Convert to a number
  if (isNaN(numericValue)) {
    throw new Error("Invalid input. Please provide a valid number string.");
  }

  return numericValue.toLocaleString("en-US", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });
}

// Example usage
console.log(formatCurrency("6000.00")); // Output: "6,000"
