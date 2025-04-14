import React from 'react';
import {FlatList} from 'react-native';
import {atoms} from '../../utils/style.util';
import SearchBar, {SearchBarProps} from '../search-bar/search-bar.component';
import TransactionItem, {
  TransactionData,
} from '../transaction-item/transaction-item.component';

export type TransactionListProps = {
  items: TransactionData[];
  searchProps: SearchBarProps['search'];
  sortProps: SearchBarProps['sort'];
  onTransactionPress: (transaction: TransactionData) => void;
};

export default function TransactionList({
  items,
  searchProps,
  sortProps,
  onTransactionPress,
}: TransactionListProps) {
  return (
    <FlatList
      ListHeaderComponent={<SearchBar search={searchProps} sort={sortProps} />}
      keyExtractor={item => item.id}
      data={items}
      contentContainerStyle={[atoms.gap_md]}
      renderItem={({item}) => (
        <TransactionItem onTransactionPress={onTransactionPress} data={item} />
      )}
    />
  );
}
