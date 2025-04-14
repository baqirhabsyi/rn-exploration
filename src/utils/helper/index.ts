import Logger from '../logger';

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

  // Start the process with the first attempt (attempt 0)
  return attempt(0);
}

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
 * Takes a sequence of functions and returns a new function that passes its input through each function in order.
 * Type-safe: Ensures the output of one function matches the input of the next.
 * Infers the final return type based on the last function in the sequence.
 *
 * @example
 * const add5 = (x: number) => x + 5;
 * const multiplyBy2 = (x: number) => x * 2;
 * const numToString = (x: number) => String(x);
 *
 * const add5AndMultiplyBy2 = pipe(add5, multiplyBy2);
 * add5AndMultiplyBy2(10); // Output: 30, Type: number
 *
 * const add5ThenString = pipe(add5, numToString);
 * add5ThenString(10); // Output: "15", Type: string
 *
 * // const invalidPipe = pipe(add5, numToString, add5); // Type error: string is not assignable to number
 *
 * @param fns The functions to compose. The first function takes the initial value, and subsequent functions take the output of the previous function.
 * @returns A new function that applies the sequence of functions to its input.
 */

// Overloads for type safety and inference
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

// Implementation (uses 'any' internally, but overloads provide external type safety)
export function pipe<T>(
  ...fns: Array<(arg: any) => any>
): (initialValue: T) => any {
  if (fns.length === 0) {
    return (initialValue: T) => initialValue; // Handle empty pipe case
  }
  return (initialValue: T) => fns.reduce((acc, fn) => fn(acc), initialValue);
}

export function formatCurrency(amount: number): string {
  // Format with Intl.NumberFormat first
  const formatted = new Intl.NumberFormat('id-ID', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);

  // Remove the space after "Rp"
  return `Rp${formatted}`;
}

export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(date);
}

export function capitalizeBank(str: string) {
  return str.length > 4
    ? [str[0].toUpperCase(), str.slice(1)].join('')
    : str.toUpperCase();
}
