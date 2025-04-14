import Icon from '@react-native-vector-icons/fontawesome6';
import React, {memo, useCallback} from 'react';
import {Pressable, StyleSheet, Text, View} from 'react-native';
import {colors} from '../../constants/style.constant';
import {TransactionStatus} from '../../services/api/models/transaction.model';
import {capitalizeBank, formatCurrency, formatDate} from '../../utils/helper';
import {atoms} from '../../utils/style.util';
import {BankTarget} from '../bank-target/bank-target.component';
import Pill from '../pill/pill.component';

/**
 * Defines the structure for transaction data used by the TransactionItem component.
 */
export type TransactionData = {
  id: string;
  senderBank: string;
  recipientBank: string;
  recipientName: string;
  accountNumber: string;
  remark: string;
  uniqueCode: string;
  amount: number;
  transactionDate: Date;
  status: TransactionStatus;
  statusLabel: string;
};

/**
 * Props for the TransactionItem component.
 */
export type TransactionItemProps = {
  /** The transaction data object to display. */
  data: TransactionData;
  /** Callback function invoked when the transaction item is pressed. */
  onTransactionPress: (item: TransactionData) => void;
};

/**
 * A component representing a single transaction item in a list.
 * Displays key details like bank names, amount, date, and status.
 * It's memoized for performance optimization.
 */
function TransactionItem({data, onTransactionPress}: TransactionItemProps) {
  // Map transaction status to Pill component type ('warning' or 'success').
  const statusMapping =
    data.status === TransactionStatus.PENDING ? 'warning' : 'success';

  // Format the transaction amount into a currency string.
  const formattedAmount = formatCurrency(data.amount);

  // Format the transaction date into a readable string.
  const formattedDate = formatDate(data.transactionDate);

  // Capitalize bank names for display.
  const capitalizedSenderBank = capitalizeBank(data.senderBank);
  const capitalizedRecipientBank = capitalizeBank(data.recipientBank);

  // Determine if the transaction status is success for conditional styling.
  const isSuccess = data.status === TransactionStatus.SUCCESS;

  // Memoized callback for handling presses on the item.
  const handlePress = useCallback(() => {
    onTransactionPress(data);
  }, [onTransactionPress, data]);

  return (
    // Pressable wrapper to handle tap events.
    <Pressable onPress={handlePress}>
      {/* Main container for the transaction item content. */}
      <View
        style={[
          // Layout and styling atoms.
          atoms.flex,
          atoms.flex_row,
          atoms.w_full,
          atoms.justify_between,
          atoms.pl_xl,
          atoms.pr_lg,
          atoms.py_md,
          atoms.rounded_md,
          atoms.overflow_hidden,
          atoms.relative,
          // Local component styles.
          componentStyles.white_background,
        ]}>
        {/* Left color border indicating status (Green for success, Orange for pending/other). */}
        <View
          style={[
            atoms.absolute,
            atoms.left_0,
            atoms.top_0,
            atoms.bottom_0,
            isSuccess
              ? componentStyles.green_border
              : componentStyles.orange_border,
          ]}
        />
        {/* Container for the main transaction details (left side). */}
        <View style={[atoms.gap_xs]}>
          {/* Displays source and target banks. */}
          <BankTarget
            sourceBank={capitalizedSenderBank}
            targetBank={capitalizedRecipientBank}
          />
          {/* Displays recipient name. */}
          <View>
            <Text style={[atoms.text_md]}>{data.recipientName}</Text>
          </View>
          {/* Displays formatted amount and date. */}
          <View style={[atoms.flex_row, atoms.items_center, atoms.gap_sm]}>
            <Text style={[atoms.text_md]}>{formattedAmount}</Text>
            <Icon name="circle" size={10} color="black" iconStyle="solid" />
            <Text style={[atoms.text_md]}>{formattedDate}</Text>
          </View>
        </View>
        {/* Container for the status pill (right side). */}
        <View style={[atoms.justify_center]}>
          {/* Displays the transaction status using the Pill component. */}
          <Pill type={statusMapping} label={data.statusLabel} />
        </View>
      </View>
    </Pressable>
  );
}

// Local styles specific to the TransactionItem component.
const componentStyles = StyleSheet.create({
  // Style for the left border when status is pending/warning.
  orange_border: {
    backgroundColor: colors.orange.base,
    width: 8,
  },
  // Style for the left border when status is success.
  green_border: {
    backgroundColor: colors.green.base,
    width: 8,
  },
  // Background color for the item container.
  white_background: {
    backgroundColor: 'white',
  },
});

// Exports the TransactionItem component wrapped in React.memo.
// This prevents re-renders if the props (data, onTransactionPress) haven't changed.
export default memo(TransactionItem);
