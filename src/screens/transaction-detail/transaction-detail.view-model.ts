import Clipboard from '@react-native-clipboard/clipboard';
import {useNavigation} from '@react-navigation/native';
import {useCallback} from 'react';
import {TransactionData} from '../../components/transaction-item/transaction-item.component';
import useTransactionDetailDisplay from './hooks/use-transaction-detail-display.hook';

/**
 * ViewModel hook for the Transaction Detail screen.
 * Encapsulates the logic and state management for the detail view,
 * including data preparation and handling user interactions like copying ID and navigating back.
 *
 * @param transaction The transaction data object passed to the screen.
 * @returns An object containing formatted display data and action handlers.
 */
export default function useTransactionDetailViewModel(
  transaction: TransactionData,
) {
  // Utilizes a sub-hook to format transaction details for display.
  const transactionDetailDisplay = useTransactionDetailDisplay(transaction);

  // Callback function to copy the transaction ID to the clipboard.
  // Memoized with useCallback for performance optimization.
  const handleCopyTransactionId = useCallback((id: string) => {
    Clipboard.setString(id);
  }, []);

  // Hook to get the navigation object for screen transitions.
  const navigation = useNavigation();

  // Callback function to navigate back to the previous screen.
  // Memoized with useCallback, depends on the navigation object.
  const goBack = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  // Exposes the necessary data and functions to the view component.
  return {
    handleCopyTransactionId,
    goBack,
    transactionDetailDisplay, // Contains formatted data from the display hook.
  };
}
