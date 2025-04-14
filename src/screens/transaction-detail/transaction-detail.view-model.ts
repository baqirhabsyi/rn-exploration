import Clipboard from '@react-native-clipboard/clipboard';
import {useNavigation} from '@react-navigation/native';
import {useCallback} from 'react';
import {TransactionData} from '../../components/transaction-item/transaction-item.component';
import useTransactionDetailDisplay from './hooks/use-transaction-detail-display.hook';

export default function useTransactionDetailViewModel(
  transaction: TransactionData,
) {
  const transactionDetailDisplay = useTransactionDetailDisplay(transaction);

  const handleCopyTransactionId = useCallback((id: string) => {
    Clipboard.setString(id);
  }, []);

  const navigation = useNavigation();

  const goBack = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  return {
    handleCopyTransactionId,
    goBack,
    transactionDetailDisplay,
  };
}
