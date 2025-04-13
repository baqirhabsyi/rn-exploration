/**
 * Parses a date string into a JavaScript Date object.
 *
 * This function converts date strings in the format "YYYY-MM-DD HH:MM:SS"
 * to a standard JavaScript Date object by replacing the space between date and time
 * with 'T' to make it closer to ISO 8601 format for broader compatibility.
 *
 * @param {string} date - The date string to parse (expected format: "YYYY-MM-DD HH:MM:SS")
 * @returns {Date} A JavaScript Date object representing the parsed date
 */
export function parseDate(date: string): Date {
  const dateFormatRegex = /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/;

  if (!dateFormatRegex.test(date)) {
    throw new Error(
      `Invalid date format: "${date}". Expected format is "YYYY-MM-DD HH:MM:SS".`,
    );
  }

  // Replace space with 'T' to make it closer to ISO 8601 format for broader compatibility
  const isoFormattedDate = date.replace(' ', 'T');
  return new Date(isoFormattedDate);
}
