import Icon from '@react-native-vector-icons/fontawesome6';
import React, {memo, useCallback} from 'react';
import {Pressable, StyleSheet, Text, View} from 'react-native';
import {colors} from '../../constants/style.constant';
import {TransactionStatus} from '../../services/api/models/transaction.model';
import {capitalizeBank, formatCurrency, formatDate} from '../../utils/helper';
import {atoms} from '../../utils/style.util';
import {BankTarget} from '../bank-target/bank-target.component';
import Pill from '../pill/pill.component';

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

export type TransactionItemProps = {
  data: TransactionData;
  onTransactionPress: (item: TransactionData) => void;
};

function TransactionItem({data, onTransactionPress}: TransactionItemProps) {
  console.log('render');

  const statusMapping =
    data.status === TransactionStatus.PENDING ? 'warning' : 'success';

  const formattedAmount = formatCurrency(data.amount);

  const formattedDate = formatDate(data.transactionDate);

  const capitalizedSenderBank = capitalizeBank(data.senderBank);

  const capitalizedRecipientBank = capitalizeBank(data.recipientBank);

  const isSuccess = data.status === TransactionStatus.SUCCESS;

  const handlePress = useCallback(() => {
    onTransactionPress(data);
  }, [onTransactionPress, data]);

  return (
    <Pressable onPress={handlePress}>
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
          <BankTarget
            sourceBank={capitalizedSenderBank}
            targetBank={capitalizedRecipientBank}
          />
          <View>
            <Text style={[atoms.text_md]}>{data.recipientName}</Text>
          </View>
          <View style={[atoms.flex_row, atoms.items_center, atoms.gap_sm]}>
            <Text style={[atoms.text_md]}>{formattedAmount}</Text>
            <Icon name="circle" size={10} color="black" iconStyle="solid" />
            <Text style={[atoms.text_md]}>{formattedDate}</Text>
          </View>
        </View>
        <View style={[atoms.justify_center]}>
          <Pill type={statusMapping} label={data.statusLabel} />
        </View>
      </View>
    </Pressable>
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
