import {useMemo} from 'react';
import {DetailLabel} from '../../../components/detail-label/detail-label.component';
import {TransactionData} from '../../../components/transaction-item/transaction-item.component';
import {
  capitalizeBank,
  formatCurrency,
  formatDate,
} from '../../../utils/helper';

export default function useTransactionDetailDisplay(
  transaction: TransactionData,
) {
  const senderBank = capitalizeBank(transaction.senderBank);
  const recipientBank = capitalizeBank(transaction.recipientBank);

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

  const labelsContent = useMemo(() => {
    return labels.map(label => (
      <DetailLabel key={label.label} label={label.label} value={label.value} />
    ));
  }, [labels]);

  return {
    senderBank,
    recipientBank,
    labelsContent,
  };
}
