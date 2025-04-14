import {StaticScreenProps} from '@react-navigation/native';
import {Platform, SafeAreaView, StatusBar, View} from 'react-native';
import {BankTarget} from '../../components/bank-target/bank-target.component';
import {DetailHeader} from '../../components/detail-header/detail-header.component';
import {TransactionData} from '../../components/transaction-item/transaction-item.component';
import {atoms, useThemeAtoms} from '../../utils/style.util';
import useTransactionDetailViewModel from './transaction-detail.view-model';

// Type definition for the props received by the TransactionDetailView component,
// primarily the route parameters containing the transaction data.
type TransactionDetailViewProps = StaticScreenProps<{
  transaction: TransactionData;
}>;

/**
 * View component for the Transaction Detail screen.
 * Displays the detailed information of a specific transaction.
 * It receives transaction data via route parameters and uses a ViewModel for logic and display data.
 *
 * @param route The route object containing parameters passed during navigation.
 */
export default function TransactionDetailView({
  route,
}: TransactionDetailViewProps) {
  // Utilize the ViewModel to get formatted data and action handlers.
  const {handleCopyTransactionId, goBack, transactionDetailDisplay} =
    useTransactionDetailViewModel(route.params.transaction);

  // Hook to access theme-based atomic styles.
  const themeAtoms = useThemeAtoms();

  return (
    // SafeAreaView ensures content is within the safe area boundaries (e.g., avoiding notches).
    <SafeAreaView
      style={[
        // Add padding top specifically for Android to account for the status bar.
        Platform.OS === 'android' && {
          paddingTop: StatusBar.currentHeight,
        },
        // Apply background color from the theme.
        themeAtoms.bg_card,
      ]}>
      {/* Header component displaying transaction ID and providing close/copy actions. */}
      <DetailHeader
        transactionID={route.params.transaction.id}
        onRequestClose={goBack} // Action handler from ViewModel.
        onCopyTransactionId={handleCopyTransactionId} // Action handler from ViewModel.
      />

      {/* Main content area with padding and spacing. */}
      <View style={[atoms.px_xl, atoms.py_lg, atoms.gap_lg]}>
        {/* Component displaying sender and recipient bank information. */}
        <BankTarget
          sourceBank={transactionDetailDisplay.senderBank} // Formatted data from ViewModel.
          targetBank={transactionDetailDisplay.recipientBank} // Formatted data from ViewModel.
        />
        {/* Container for displaying various transaction details (labels and values). */}
        <View
          style={[
            atoms.flex_row, // Arrange items horizontally.
            atoms.flex_wrap, // Allow items to wrap to the next line.
            atoms.justify_between, // Distribute space between items.
            atoms.gap_lg, // Add spacing between items.
          ]}>
          {/* Render the pre-generated DetailLabel components from the ViewModel. */}
          {transactionDetailDisplay.labelsContent}
        </View>
      </View>
    </SafeAreaView>
  );
}
