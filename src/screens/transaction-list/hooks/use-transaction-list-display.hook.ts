import {useMemo} from 'react';
import {SearchBarProps} from '../../../components/search-bar/search-bar.component';
import {TransactionItemProps} from '../../../components/transaction-item/transaction-item.component';
import useTransactionList, {
  SortProperties,
} from '../../../hooks/use-transaction-list/use-transaction-list.hook';
import {TransactionStatus} from '../../../services/api/models/transaction.model';

const STATUS_MAPPING: Record<TransactionStatus, string> = {
  [TransactionStatus.PENDING]: 'Pengecekan',
  [TransactionStatus.SUCCESS]: 'Berhasil',
};

export default function useTransactionListDisplay() {
  const {data, changeSearchValue, changeSortBy, searchValue} =
    useTransactionList();

  const items: TransactionItemProps[] = useMemo(
    () =>
      data?.map(item => ({
        id: item.id,
        amount: item.amount,
        recipientBank: item.beneficiary_bank,
        recipientName: item.beneficiary_name.toUpperCase(),
        senderBank: item.sender_bank,
        status: item.status,
        statusLabel: STATUS_MAPPING[item.status],
        transactionDate: item.created_at,
      })) ?? [],
    [data],
  );

  const searchProps = useMemo((): SearchBarProps['search'] => {
    return {
      placeholder: 'Cari nama, bank, atau nominal',
      value: searchValue,
      onChangeText: changeSearchValue,
    };
  }, [searchValue, changeSearchValue]);

  const sortProps = useMemo((): SearchBarProps['sort'] => {
    return {
      initialValue: {label: 'URUTKAN', value: ''},
      options: [
        {label: 'URUTKAN', value: ''},
        {label: 'Nama A-Z', value: 'beneficiary_name:asc'},
        {label: 'Nama Z-A', value: 'beneficiary_name:desc'},
        {label: 'Tanggal Terbaru', value: 'created_at:desc'},
        {label: 'Tanggal Terlama', value: 'created_at:asc'},
      ],
      onChange: (option: {label: string; value: string}) => {
        if (option.value === '') {
          changeSortBy(undefined);
          return;
        }

        const [key, order] = option.value.split(':');
        changeSortBy([key as SortProperties, order as 'asc' | 'desc']);
      },
    };
  }, [changeSortBy]);

  return {
    items,
    searchProps,
    sortProps,
  };
}
