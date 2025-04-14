import {Platform, SafeAreaView, StatusBar} from 'react-native';
import TransactionList from '../../components/transaction-list/transaction-list.component';
import {useTheme} from '../../store/theme.store';
import {atoms} from '../../utils/style.util';
import useTransactionListViewModel from './transaction-list.view-model';

/**
 * View component for the Transaction List screen.
 * Responsible for rendering the list of transactions, including search and sort controls.
 * It utilizes a ViewModel (`useTransactionListViewModel`) to fetch and manage the data and logic.
 */
export default function TransactionListView() {
  // Use the ViewModel to get display data and handlers.
  const {transactionListDisplay} = useTransactionListViewModel();

  // Use the theme hook to access current theme colors.
  const theme = useTheme();

  return (
    // SafeAreaView ensures content stays within safe screen boundaries.
    <SafeAreaView
      style={[
        // Add padding top for Android status bar.
        Platform.OS === 'android' && {
          paddingTop: StatusBar.currentHeight,
        },
        // Set the background color based on the current theme.
        {
          backgroundColor: theme.theme.background,
        },
        // Apply padding using atomic styles.
        atoms.p_md,
      ]}>
      {/* Render the status bar (can be styled further if needed). */}
      <StatusBar />
      {/* Render the core TransactionList component. */}
      <TransactionList
        // Pass the list of transaction items from the ViewModel.
        items={transactionListDisplay.items}
        // Pass the search configuration props from the ViewModel.
        searchProps={transactionListDisplay.searchProps}
        // Pass the sort configuration props from the ViewModel.
        sortProps={transactionListDisplay.sortProps}
        // Pass the handler for when a transaction item is pressed.
        onTransactionPress={transactionListDisplay.handleTransactionPress}
      />
    </SafeAreaView>
  );
}
