import useTransactionListDisplay from './hooks/use-transaction-list-display.hook';

/**
 * ViewModel hook for the Transaction List screen.
 * This hook primarily acts as a bridge, utilizing the `useTransactionListDisplay` hook
 * to encapsulate and provide all necessary display logic and data to the view component.
 *
 * @returns An object containing the results from `useTransactionListDisplay`.
 */
export default function useTransactionListViewModel() {
  // Instantiate the display logic hook.
  const transactionListDisplay = useTransactionListDisplay();

  // Expose the display logic and data to the view.
  return {transactionListDisplay};
}
