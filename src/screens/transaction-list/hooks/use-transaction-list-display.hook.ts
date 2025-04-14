import {useNavigation} from '@react-navigation/native';
import {useCallback, useMemo} from 'react';
import {SearchBarProps} from '../../../components/search-bar/search-bar.component';
import {TransactionData} from '../../../components/transaction-item/transaction-item.component';
import useTransactionList, {
  SortProperties,
} from '../../../hooks/use-transaction-list/use-transaction-list.hook';
import {TransactionStatus} from '../../../services/api/models/transaction.model';

// Maps internal transaction status enum to human-readable Indonesian strings.
const STATUS_MAPPING: Record<TransactionStatus, string> = {
  [TransactionStatus.PENDING]: 'Pengecekan',
  [TransactionStatus.SUCCESS]: 'Berhasil',
};

/**
 * Custom hook to manage the display logic for the Transaction List screen.
 * It orchestrates fetching/sorting/filtering of data via `useTransactionList`,
 * handles navigation, maps data for display, and prepares props for UI components (SearchBar).
 *
 * @returns An object containing mapped transaction items, search/sort props, and navigation handlers.
 */
export default function useTransactionListDisplay() {
  // Use the core transaction list hook to get data and control functions.
  const {data, changeSearchValue, changeSortBy, searchValue} =
    useTransactionList();

  // Hook to get the navigation object.
  const navigation = useNavigation();

  // Callback to handle navigation when a transaction item is pressed.
  // Memoized with useCallback for performance.
  const handleTransactionPress = useCallback(
    (transaction: TransactionData) => {
      // Navigate to the TransactionDetail screen, passing the selected transaction data.
      navigation.navigate('TransactionDetail', {transaction});
    },
    [navigation],
  );

  // Memoized transformation of raw transaction data (from API) into the format
  // expected by the TransactionItem component (TransactionData).
  // Recalculates only when the raw `data` changes.
  const items: TransactionData[] = useMemo(
    () =>
      data?.map(item => ({
        id: item.id,
        amount: item.amount,
        recipientBank: item.beneficiary_bank,
        recipientName: item.beneficiary_name.toUpperCase(), // Ensure recipient name is uppercase.
        senderBank: item.sender_bank,
        status: item.status,
        statusLabel: STATUS_MAPPING[item.status], // Map status to display label.
        transactionDate: item.created_at,
        accountNumber: item.account_number,
        remark: item.remark,
        uniqueCode: item.unique_code,
      })) ?? [], // Return empty array if data is null/undefined.
    [data],
  );

  // Memoized props object for the search input part of the SearchBar component.
  // Recalculates only when searchValue or changeSearchValue changes.
  const searchProps = useMemo((): SearchBarProps['search'] => {
    return {
      placeholder: 'Cari nama, bank, atau nominal', // Placeholder text for the search input.
      value: searchValue, // Current search value from useTransactionList.
      onChangeText: changeSearchValue, // Function to update search value from useTransactionList.
    };
  }, [searchValue, changeSearchValue]);

  // Memoized props object for the sort dropdown part of the SearchBar component.
  // Recalculates only when changeSortBy changes.
  const sortProps = useMemo((): SearchBarProps['sort'] => {
    return {
      initialValue: {label: 'URUTKAN', value: ''}, // Default display text.
      options: [
        // Available sorting options.
        {label: 'URUTKAN', value: ''}, // Option to clear sorting.
        {label: 'Nama A-Z', value: 'beneficiary_name:asc'},
        {label: 'Nama Z-A', value: 'beneficiary_name:desc'},
        {label: 'Tanggal Terbaru', value: 'created_at:desc'},
        {label: 'Tanggal Terlama', value: 'created_at:asc'},
      ],
      // Handler for when a sort option is selected.
      onChange: (option: {label: string; value: string}) => {
        // If the default/clear option is selected, reset sorting.
        if (option.value === '') {
          changeSortBy(undefined);
          return;
        }

        // Parse the selected option value (e.g., "beneficiary_name:asc") into key and order.
        const [key, order] = option.value.split(':');
        // Update the sort criteria in the useTransactionList hook.
        changeSortBy([key as SortProperties, order as 'asc' | 'desc']);
      },
    };
  }, [changeSortBy]);

  // Return the prepared data and props for the view component.
  return {
    items, // Mapped transaction data for the list.
    searchProps, // Props for the search input.
    sortProps, // Props for the sort dropdown.
    handleTransactionPress, // Handler for item press/navigation.
  };
}
