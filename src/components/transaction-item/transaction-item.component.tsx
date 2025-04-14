import Icon from '@react-native-vector-icons/fontawesome6';
import React, {memo} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {colors} from '../../constants/style.constant';
import {TransactionStatus} from '../../services/api/models/transaction.model';
import {formatCurrency, formatDate} from '../../utils/helper';
import {atoms} from '../../utils/style.util';
import Pill from '../pill/pill.component';

const capitalize = (str: string) => {
  return str.length > 4
    ? [str[0].toUpperCase(), str.slice(1)].join('')
    : str.toUpperCase();
};

export type TransactionItemProps = {
  id: string;
  senderBank: string;
  recipientBank: string;
  recipientName: string;
  amount: number;
  transactionDate: Date;
  status: TransactionStatus;
  statusLabel: string;
};

function TransactionItem({
  senderBank,
  recipientBank,
  recipientName,
  amount,
  transactionDate,
  status,
  statusLabel,
}: TransactionItemProps) {
  const statusMapping =
    status === TransactionStatus.PENDING ? 'warning' : 'success';

  const formattedAmount = formatCurrency(amount);

  const formattedDate = formatDate(transactionDate);

  const capitalizedSenderBank = capitalize(senderBank);

  const capitalizedRecipientBank = capitalize(recipientBank);

  const isSuccess = status === TransactionStatus.SUCCESS;

  return (
    <View
      style={[
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
        componentStyles.white_background,
      ]}>
      {/* Left Border */}
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
      <View style={[atoms.gap_xs]}>
        <View style={[atoms.flex_row, atoms.items_center, atoms.gap_sm]}>
          <Text style={[atoms.text_md, atoms.font_bold]}>
            {capitalizedSenderBank}
          </Text>
          <Icon name="arrow-right" size={16} color="black" iconStyle="solid" />
          <Text style={[atoms.text_md, atoms.font_bold]}>
            {capitalizedRecipientBank}
          </Text>
        </View>
        <View>
          <Text style={[atoms.text_md]}>{recipientName}</Text>
        </View>
        <View style={[atoms.flex_row, atoms.items_center, atoms.gap_sm]}>
          <Text style={[atoms.text_md]}>{formattedAmount}</Text>
          <Icon name="circle" size={10} color="black" iconStyle="solid" />
          <Text style={[atoms.text_md]}>{formattedDate}</Text>
        </View>
      </View>
      <View style={[atoms.justify_center]}>
        <Pill type={statusMapping} label={statusLabel} />
      </View>
    </View>
  );
}

const componentStyles = StyleSheet.create({
  orange_border: {
    backgroundColor: colors.orange.base,
    width: 8,
  },
  green_border: {
    backgroundColor: colors.green.base,
    width: 8,
  },
  white_background: {
    backgroundColor: 'white',
  },
});

export default memo(TransactionItem);
