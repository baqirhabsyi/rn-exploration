import {Platform, SafeAreaView, StatusBar} from 'react-native';
import TransactionList from '../../components/transaction-list/transaction-list.component';
import {useTheme} from '../../store/theme.store';
import {atoms} from '../../utils/style.util';
import useTransactionListViewModel from './transaction-list.view-model';
export default function TransactionListView() {
  const {transactionListDisplay} = useTransactionListViewModel();

  const theme = useTheme();

  return (
    <SafeAreaView
      style={[
        Platform.OS === 'android' && {
          paddingTop: StatusBar.currentHeight,
        },
        {
          backgroundColor: theme.theme.background,
        },
        atoms.p_md,
      ]}>
      <StatusBar />
      <TransactionList
        items={transactionListDisplay.items}
        searchProps={transactionListDisplay.searchProps}
        sortProps={transactionListDisplay.sortProps}
      />
    </SafeAreaView>
  );
}
