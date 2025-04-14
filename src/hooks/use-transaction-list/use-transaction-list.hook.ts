import {useCallback, useMemo, useState} from 'react';
import {apiService} from '../../services/api/api.service';
import {useAPI} from '../../services/api/hook/useAPI.hook';
import {Transaction} from '../../services/api/models/transaction.model';
import {GetTransactionsRes} from '../../services/api/repositories/frontend-test/frontend-test.interface.repository';
import {parseDate} from '../../utils/dates';
import {
  pipe,
  searchData,
  sortDataAlphabetically,
  sortDataByDate,
} from '../../utils/helper';

export type SortProperties = Extract<
  keyof Transaction,
  'beneficiary_name' | 'created_at' | 'completed_at'
>;

export default function useTransactionList() {
  const transformer = useCallback((_data: GetTransactionsRes) => {
    return Object.values(_data).map(item => ({
      ...item,
      completed_at: parseDate(item.completed_at),
      created_at: parseDate(item.created_at),
    }));
  }, []);

  const {data, isLoading, error} = useAPI(
    'transactions',
    apiService.frontendTest.getTransactions,
    {
      transformer,
    },
  );

  const [searchValue, setSearchValue] = useState('');
  const [sortBy, setSortBy] = useState<[SortProperties, 'asc' | 'desc']>();

  const displayedData = useMemo(() => {
    if (!data) {
      return null;
    }

    return pipe(
      _data =>
        !searchValue
          ? data
          : searchData(
              data,
              ['beneficiary_name', 'sender_bank', 'beneficiary_bank', 'amount'],
              searchValue,
            ),
      searchedData => {
        if (!sortBy) {
          return searchedData;
        }

        const [key, order] = sortBy;

        const isSortingByDate = key === 'created_at' || key === 'completed_at';

        const sortedData = isSortingByDate
          ? sortDataByDate(searchedData, key, order)
          : sortDataAlphabetically(searchedData, key, order);

        return sortedData;
      },
    )(data);
  }, [data, searchValue, sortBy]);

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
