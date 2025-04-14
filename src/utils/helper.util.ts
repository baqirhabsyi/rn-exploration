import Logger from './logger.util';

/**
 * Executes an asynchronous function with automatic retries on failure.
 * Implements exponential backoff with jitter to avoid overwhelming the target service.
 *
 * @template T The expected return type of the function.
 * @param fn The asynchronous function to execute.
 * @param retries The maximum number of retry attempts (default: 3).
 * @param initialDelay The initial delay in milliseconds before the first retry (default: 1000).
 * @returns A promise resolving to the result of the function if successful.
 * @throws Throws the last error encountered if all retries fail.
 */
export async function doWithRetry<T>(
  fn: () => Promise<T>,
  retries: number = 3,
  initialDelay: number = 1000,
): Promise<T> {
  const logger = new Logger(fn.name);

  // Define the recursive helper function
  async function attempt(currentAttempt: number): Promise<T> {
    try {
      // Attempt to execute the function
      return await fn();
    } catch (error) {
      if (currentAttempt >= retries) {
        // If max retries reached, log and re-throw the last error
        logger.error(
          `Function failed after ${retries} retries (${
            currentAttempt + 1
          } attempts total).`,
          error,
        );
        throw error;
      }

      // Calculate delay with random jitter
      const delay = Math.min(initialDelay * Math.pow(2, currentAttempt), 10000);
      logger.warn(
        `Attempt ${
          currentAttempt + 1
        } failed. Retrying in ${delay}ms... Error:`,
        error instanceof Error ? error.message : error,
      );

      // Wait for the calculated delay
      await new Promise(resolve => setTimeout(resolve, delay));

      // Make the recursive call for the next attempt
      return attempt(currentAttempt + 1);
    }
  }

  // Start the retry process with the first attempt (attempt 0).
  return attempt(0);
}

/**
 * Sorts an array of objects alphabetically based on a specified key.
 * Case-insensitive sorting.
 *
 * @template T The type of objects in the array.
 * @param data The array of objects to sort.
 * @param key The key of the object property to sort by.
 * @param order The sort order: 'asc' (ascending) or 'desc' (descending) (default: 'asc').
 * @returns A new sorted array (shallow copy).
 */
export function sortDataAlphabetically<T>(
  data: T[],
  key: keyof T,
  order: 'asc' | 'desc' = 'asc',
): T[] {
  // Create a shallow copy before sorting
  return [...data].sort((a, b) => {
    const valueA = String(a[key]).toLowerCase();
    const valueB = String(b[key]).toLowerCase();

    let comparison = 0;
    if (valueA > valueB) {
      comparison = 1;
    } else if (valueA < valueB) {
      comparison = -1;
    }

    return order === 'desc' ? comparison * -1 : comparison;
  });
}

/**
 * Sorts an array of objects by date based on a specified key.
 *
 * @template T The type of objects in the array.
 * @param data The array of objects to sort.
 * @param key The key of the object property containing the date (should be parsable by `new Date()`).
 * @param order The sort order: 'asc' (ascending) or 'desc' (descending) (default: 'asc').
 * @returns A new sorted array (shallow copy).
 */
export function sortDataByDate<T>(
  data: T[],
  key: keyof T,
  order: 'asc' | 'desc' = 'asc',
): T[] {
  // Create a shallow copy before sorting
  return [...data].sort((a, b) => {
    // Attempt to parse the date values, handle potential invalid dates
    const dateA = new Date(a[key] as any).getTime();
    const dateB = new Date(b[key] as any).getTime();

    // Handle cases where date parsing might fail (NaN)
    if (isNaN(dateA) && isNaN(dateB)) {
      return 0;
    }
    if (isNaN(dateA)) {
      return order === 'asc' ? 1 : -1;
    } // Treat NaN as greater
    if (isNaN(dateB)) {
      return order === 'asc' ? -1 : 1;
    } // Treat NaN as greater

    const comparison = dateA - dateB;

    return order === 'desc' ? comparison * -1 : comparison;
  });
}

/**
 * Filters an array of objects based on a search value across multiple specified keys.
 * Performs a case-insensitive, fuzzy search (checks if characters of the search value appear in order within the property value).
 *
 * @template T The type of objects in the array.
 * @param data The array of objects to search within.
 * @param keys An array of keys to check within each object.
 * @param searchValue The value to search for (converted to string).
 * @returns A new array containing only the items that match the search criteria.
 */
export function searchData<T>(
  data: T[],
  keys: (keyof T)[],
  searchValue: string | number,
): T[] {
  const lowerCaseSearchValue = String(searchValue).toLowerCase();

  if (!lowerCaseSearchValue) {
    return data; // Return original data if search value is empty
  }

  return data.filter(item => {
    return keys.some(key => {
      const value = item[key];

      if (!(value !== null && value !== undefined)) {
        return false;
      }

      const lowerCaseValue = String(value).toLowerCase();
      // Fuzzy search logic:
      let searchTermIndex = 0;
      for (
        let i = 0;
        i < lowerCaseValue.length &&
        searchTermIndex < lowerCaseSearchValue.length;
        i++
      ) {
        if (lowerCaseValue[i] === lowerCaseSearchValue[searchTermIndex]) {
          searchTermIndex++;
        }
      }
      return searchTermIndex === lowerCaseSearchValue.length;
    });
  });
}

/**
 * Creates a function composition pipeline.
 * Takes a sequence of functions and returns a new function that passes its input
 * through each function in order, where the output of one is the input to the next.
 * Provides type safety through function overloads.
 *
 * @example
 * const add5 = (x: number) => x + 5;
 * const multiplyBy2 = (x: number) => x * 2;
 * const numToString = (x: number) => String(x);
 *
 * const add5AndMultiplyBy2 = pipe(add5, multiplyBy2);
 * add5AndMultiplyBy2(10); // Output: 30
 *
 * const add5ThenString = pipe(add5, numToString);
 * add5ThenString(10); // Output: "15"
 *
 * @param fns The functions to compose in sequence.
 * @returns A new function that represents the composition of the input functions.
 */

// --- Function Overloads for Pipe (ensuring type safety) ---
export function pipe<T>(): (initialValue: T) => T;
export function pipe<T, R1>(f1: (arg: T) => R1): (initialValue: T) => R1;
export function pipe<T, R1, R2>(
  f1: (arg: T) => R1,
  f2: (arg: R1) => R2,
): (initialValue: T) => R2;
export function pipe<T, R1, R2, R3>(
  f1: (arg: T) => R1,
  f2: (arg: R1) => R2,
  f3: (arg: R2) => R3,
): (initialValue: T) => R3;
export function pipe<T, R1, R2, R3, R4>(
  f1: (arg: T) => R1,
  f2: (arg: R1) => R2,
  f3: (arg: R2) => R3,
  f4: (arg: R3) => R4,
): (initialValue: T) => R4;
export function pipe<T, R1, R2, R3, R4, R5>(
  f1: (arg: T) => R1,
  f2: (arg: R1) => R2,
  f3: (arg: R2) => R3,
  f4: (arg: R3) => R4,
  f5: (arg: R4) => R5,
): (initialValue: T) => R5;
export function pipe<T, R1, R2, R3, R4, R5, R6>(
  f1: (arg: T) => R1,
  f2: (arg: R1) => R2,
  f3: (arg: R2) => R3,
  f4: (arg: R3) => R4,
  f5: (arg: R4) => R5,
  f6: (arg: R5) => R6,
): (initialValue: T) => R6;
export function pipe<T, R1, R2, R3, R4, R5, R6, R7>(
  f1: (arg: T) => R1,
  f2: (arg: R1) => R2,
  f3: (arg: R2) => R3,
  f4: (arg: R3) => R4,
  f5: (arg: R4) => R5,
  f6: (arg: R5) => R6,
  f7: (arg: R6) => R7,
): (initialValue: T) => R7;
export function pipe<T, R1, R2, R3, R4, R5, R6, R7, R8>(
  f1: (arg: T) => R1,
  f2: (arg: R1) => R2,
  f3: (arg: R2) => R3,
  f4: (arg: R3) => R4,
  f5: (arg: R4) => R5,
  f6: (arg: R5) => R6,
  f7: (arg: R6) => R7,
  f8: (arg: R7) => R8,
): (initialValue: T) => R8;

// If you're piping more than 8 functions, good luck.

// --- Pipe Implementation ---
export function pipe<T>( // Type T is the initial input type
  ...fns: Array<(arg: any) => any> // Functions in the pipeline
): (initialValue: T) => any {
  // Returns a function that takes T and returns the final result type
  if (fns.length === 0) {
    return (initialValue: T) => initialValue; // Identity function if no functions are provided
  }
  // Reduce the functions, passing the result of one to the next.
  return (initialValue: T) => fns.reduce((acc, fn) => fn(acc), initialValue);
}

/**
 * Formats a number as Indonesian Rupiah (IDR) currency.
 *
 * @param amount The number to format.
 * @returns A string representing the amount in IDR format (e.g., "Rp10.000").
 */
export function formatCurrency(amount: number): string {
  // Use Intl.NumberFormat for locale-specific number formatting.
  const formatted = new Intl.NumberFormat('id-ID', {
    minimumFractionDigits: 0, // No decimal places for IDR typically.
    maximumFractionDigits: 0,
  }).format(amount);

  // Prepend "Rp" without a space.
  return `Rp${formatted}`;
}

/**
 * Formats a Date object into a localized date string (Indonesian locale).
 *
 * @param date The Date object to format.
 * @returns A string representing the date in a long format (e.g., "17 Agustus 2024").
 */
export function formatDate(date: Date): string {
  // Use Intl.DateTimeFormat for locale-specific date formatting.
  return new Intl.DateTimeFormat('id-ID', {
    day: 'numeric', // e.g., 17
    month: 'long', // e.g., Agustus
    year: 'numeric', // e.g., 2024
  }).format(date);
}

/**
 * Capitalizes a bank name string according to specific rules:
 * - If the string length is > 4, capitalize only the first letter.
 * - Otherwise (length <= 4), convert the entire string to uppercase.
 *
 * @param str The bank name string to capitalize.
 * @returns The capitalized bank name string.
 */
export function capitalizeBank(str: string) {
  // Apply different capitalization based on length.
  return str.length > 4
    ? [str[0].toUpperCase(), str.slice(1)].join('') // Capitalize first letter only
    : str.toUpperCase(); // Uppercase the whole string
}
