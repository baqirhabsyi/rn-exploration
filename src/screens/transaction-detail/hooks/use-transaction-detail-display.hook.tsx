import {useMemo} from 'react';
import {DetailLabel} from '../../../components/detail-label/detail-label.component';
import {TransactionData} from '../../../components/transaction-item/transaction-item.component';
import {
  capitalizeBank,
  formatCurrency,
  formatDate,
} from '../../../utils/helper.util';

/**
 * Custom hook to prepare display data for the Transaction Detail screen.
 * It takes raw transaction data and formats it for presentation.
 *
 * @param transaction The transaction data object.
 * @returns An object containing formatted sender/recipient bank names and an array of DetailLabel components.
 */
export default function useTransactionDetailDisplay(
  transaction: TransactionData,
) {
  // Capitalize sender and recipient bank names for display consistency.
  const senderBank = capitalizeBank(transaction.senderBank);
  const recipientBank = capitalizeBank(transaction.recipientBank);

  // Memoized array of label-value pairs for transaction details.
  // This prevents recalculation on every render unless the transaction data changes.
  const labels: {label: string; value: string}[] = useMemo(
    () => [
      {
        label: transaction.recipientName,
        value: transaction.accountNumber,
      },
      {
        label: 'Nominal',
        value: formatCurrency(transaction.amount),
      },
      {
        label: 'Berita Transfer',
        value: transaction.remark,
      },
      {
        label: 'Kode Unik',
        value: transaction.uniqueCode,
      },
      {
        label: 'Waktu Dibuat',
        value: formatDate(transaction.transactionDate),
      },
    ],
    [transaction],
  );

  // Memoized array of DetailLabel components generated from the labels array.
  // This avoids re-rendering the labels if the labels themselves haven't changed.
  const labelsContent = useMemo(() => {
    return labels.map(label => (
      <DetailLabel key={label.label} label={label.label} value={label.value} />
    ));
  }, [labels]);

  // Return the processed data ready for rendering.
  return {
    senderBank,
    recipientBank,
    labelsContent,
  };
}
