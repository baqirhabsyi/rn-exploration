import React from 'react';
import {FlatList} from 'react-native';
import {atoms} from '../../utils/style.util';
import SearchBar, {SearchBarProps} from '../search-bar/search-bar.component';
import TransactionItem, {
  TransactionItemProps,
} from '../transaction-item/transaction-item.component';

export type TransactionListProps = {
  items: TransactionItemProps[];
  searchProps: SearchBarProps['search'];
  sortProps: SearchBarProps['sort'];
};

export default function TransactionList({
  items,
  searchProps,
  sortProps,
}: TransactionListProps) {
  return (
    <FlatList
      ListHeaderComponent={<SearchBar search={searchProps} sort={sortProps} />}
      keyExtractor={item => item.id}
      data={items}
      contentContainerStyle={[atoms.gap_md]}
      renderItem={({item}) => (
        <TransactionItem
          amount={item.amount}
          id={item.id}
          recipientBank={item.recipientBank}
          recipientName={item.recipientName}
          senderBank={item.senderBank}
          status={item.status}
          statusLabel={item.statusLabel}
          transactionDate={item.transactionDate}
        />
      )}
    />
  );
}
