import {useCallback, useEffect, useState} from 'react';
import {doWithRetry} from '../../../utils/helper';
import Logger from '../../../utils/logger';

interface UseAPIState<U> {
  data: U | null;
  isLoading: boolean;
  error: Error | null;
}

const logger = new Logger('useAPI');

/**
 * A custom hook similar to react-query's useQuery, designed to work with
 * fetcher functions that utilize the HttpService for caching.
 *
 * @param queryKey A unique key for the query, used implicitly by HttpService caching via URL.
 * @param fetcher A function that performs the data fetching, expected to use HttpService.
 * @param options Optional configuration.
 *                enabled: If false, the query will not run automatically.
 *                transformer: An optional function to transform the fetched data.
 */
export function useAPI<T, U = T>(
  queryKey: string, // Often the URL, used by HttpService cache
  fetcher: () => Promise<T>,
  options: {enabled?: boolean; transformer?: (data: T) => U} = {},
) {
  const {enabled = true, transformer} = options;

  const [state, setState] = useState<UseAPIState<U>>({
    data: null,
    isLoading: enabled, // Start loading if enabled
    error: null,
  });

  const fetchData = useCallback(async () => {
    logger.info(`Fetching data for key: ${queryKey}`);

    setState(prevState => ({
      ...prevState,
      isLoading: true,
      error: null,
    }));

    try {
      const data = await doWithRetry(fetcher);
      const transformedData = transformer
        ? transformer(data)
        : (data as unknown as U);

      logger.info(`Data fetched successfully for key: ${queryKey}`);

      setState({
        data: transformedData,
        isLoading: false,
        error: null,
      });
    } catch (error: unknown) {
      const savedError =
        error instanceof Error ? error : new Error(String(error));

      logger.error(`Error fetching data for key: ${queryKey}:`, savedError);

      setState({
        data: null,
        isLoading: false,
        error: savedError,
      });
    }
  }, [fetcher, queryKey, transformer]); // Include transformer in dependency array

  useEffect(() => {
    if (enabled) {
      fetchData();
    } else {
      // If disabled, reset to initial state without data/error
      setState({
        data: null,
        isLoading: false,
        error: null,
      });
    }
    // Adding fetchData to dependencies as it's defined with useCallback
  }, [enabled, fetchData]); // Rerun when enabled changes or fetcher identity changes

  // Function to manually refetch data
  const refetch = useCallback(() => {
    if (!enabled) {
      return;
    }

    // Invalidate cache entry before refetching to ensure fresh data if needed
    // Note: HttpService's get method automatically handles cache checks,
    // but a manual invalidation might be desired in some refetch scenarios.
    // Consider if explicit invalidation is always needed or should be optional.
    // httpService.invalidateCacheEntry(queryKey);
    logger.info(`Refetching data for key: ${queryKey}`);
    fetchData();
  }, [fetchData, enabled, queryKey]);

  return {...state, refetch};
}
