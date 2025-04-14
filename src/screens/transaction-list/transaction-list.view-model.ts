import useTransactionListDisplay from './hooks/use-transaction-list-display.hook';

export default function useTransactionListViewModel() {
  const transactionListDisplay = useTransactionListDisplay();

  return {transactionListDisplay};
}
