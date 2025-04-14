import {useCallback, useMemo, useState} from 'react';
import {apiService} from '../../services/api/api.service';
import {useAPI} from '../../services/api/hook/useAPI.hook';
import {Transaction} from '../../services/api/models/transaction.model';
import {GetTransactionsRes} from '../../services/api/repositories/frontend-test/frontend-test.interface.repository';
import {parseDate} from '../../utils/dates.util';
import {
  pipe,
  searchData,
  sortDataAlphabetically,
  sortDataByDate,
} from '../../utils/helper.util';

// Defines the properties of a Transaction that can be used for sorting.
export type SortProperties = Extract<
  keyof Transaction,
  'beneficiary_name' | 'created_at' | 'completed_at'
>;

// Custom hook to manage fetching, searching, and sorting of transaction data.
export default function useTransactionList() {
  // Transformer function memoized with useCallback.
  // It processes the raw API response, parsing date strings into Date objects.
  const transformer = useCallback((_data: GetTransactionsRes) => {
    return Object.values(_data).map(item => ({
      ...item,
      completed_at: parseDate(item.completed_at),
      created_at: parseDate(item.created_at),
    }));
  }, []);

  // Fetches transaction data using the useAPI hook.
  // 'transactions' is the cache key.
  // apiService.frontendTest.getTransactions is the function to fetch data.
  // The transformer is applied to the fetched data.
  const {data, isLoading, error} = useAPI(
    'transactions',
    apiService.frontendTest.getTransactions,
    {
      transformer,
    },
  );

  // State variable to hold the current search term entered by the user.
  const [searchValue, setSearchValue] = useState('');
  // State variable to hold the current sorting criteria (property and direction).
  const [sortBy, setSortBy] = useState<[SortProperties, 'asc' | 'desc']>();

  // Memoized calculation of the data to be displayed.
  // This recalculates only when the raw data, search value, or sort criteria changes.
  const displayedData = useMemo(() => {
    if (!data) {
      return null;
    }

    // Uses a pipe function to chain data processing steps: searching and sorting.
    return pipe(
      // Step 1: Filter data based on the search value.
      _data =>
        !searchValue
          ? data // If no search value, use the original data.
          : searchData(
              data,
              ['beneficiary_name', 'sender_bank', 'beneficiary_bank', 'amount'],
              searchValue,
            ),
      // Step 2: Sort the filtered data based on the sortBy state.
      searchedData => {
        if (!sortBy) {
          return searchedData; // If no sort criteria, return the searched data.
        }

        const [key, order] = sortBy;

        // Determine if sorting is by date or alphabetically.
        const isSortingByDate = key === 'created_at' || key === 'completed_at';

        // Apply the appropriate sorting function.
        const sortedData = isSortingByDate
          ? sortDataByDate(searchedData, key, order)
          : sortDataAlphabetically(searchedData, key, order);

        return sortedData;
      },
    )(data); // Initial input to the pipe is the raw fetched data.
  }, [data, searchValue, sortBy]);

  // Returns the processed data, loading/error states, and functions to update search/sort.
  return {
    data: displayedData,
    isLoading,
    error,
    changeSearchValue: setSearchValue,
    changeSortBy: setSortBy,
    sortBy,
    searchValue,
  };
}
