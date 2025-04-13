import Logger from '@utils/logger';

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
  return data.sort((a, b) => {
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
  return data.sort((a, b) => {
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
