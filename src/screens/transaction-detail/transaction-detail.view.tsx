import {StaticScreenProps} from '@react-navigation/native';
import {Platform, SafeAreaView, StatusBar, View} from 'react-native';
import {BankTarget} from '../../components/bank-target/bank-target.component';
import {DetailHeader} from '../../components/detail-header/detail-header.component';
import {TransactionData} from '../../components/transaction-item/transaction-item.component';
import {atoms, useThemeAtoms} from '../../utils/style.util';
import useTransactionDetailViewModel from './transaction-detail.view-model';

type TransactionDetailViewProps = StaticScreenProps<{
  transaction: TransactionData;
}>;

export default function TransactionDetailView({
  route,
}: TransactionDetailViewProps) {
  const {handleCopyTransactionId, goBack, transactionDetailDisplay} =
    useTransactionDetailViewModel(route.params.transaction);

  const themeAtoms = useThemeAtoms();

  return (
    <SafeAreaView
      style={[
        Platform.OS === 'android' && {
          paddingTop: StatusBar.currentHeight,
        },
        themeAtoms.bg_card,
      ]}>
      <DetailHeader
        transactionID={route.params.transaction.id}
        onRequestClose={goBack}
        onCopyTransactionId={handleCopyTransactionId}
      />

      <View style={[atoms.px_xl, atoms.py_lg, atoms.gap_lg]}>
        <BankTarget
          sourceBank={transactionDetailDisplay.senderBank}
          targetBank={transactionDetailDisplay.recipientBank}
        />
        <View
          style={[
            atoms.flex_row,
            atoms.flex_wrap,
            atoms.justify_between,
            atoms.gap_lg,
          ]}>
          {transactionDetailDisplay.labelsContent}
        </View>
      </View>
    </SafeAreaView>
  );
}
