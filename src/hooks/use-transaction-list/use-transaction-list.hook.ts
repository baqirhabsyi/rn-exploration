import {apiService} from '@services/api/api.service';
import {useAPI} from '@services/api/hook/useAPI.hook';
import {parseDate} from '@utils/dates';

export default function useTransactionList() {
  const {data, isLoading, error} = useAPI(
    'transactions',
    apiService.frontendTest.getTransactions,
    {
      transformer: _data =>
        Object.values(_data).map(item => ({
          ...item,
          completed_at: parseDate(item.completed_at),
          created_at: parseDate(item.created_at),
        })),
    },
  );

  // TODO: Add filter/search functionality

  // TODO: Add sorting functionality

  return {
    data,
    isLoading,
    error,
  };
}
