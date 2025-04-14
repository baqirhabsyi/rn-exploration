import React from 'react';
import {FlatList} from 'react-native';
import {atoms} from '../../utils/style.util';
import SearchBar, {SearchBarProps} from '../search-bar/search-bar.component';
import TransactionItem, {
  TransactionData,
} from '../transaction-item/transaction-item.component';

/**
 * Props for the TransactionList component.
 */
export type TransactionListProps = {
  /** An array of transaction data objects to display. */
  items: TransactionData[];
  /** Props to pass down to the SearchBar component for search functionality. */
  searchProps: SearchBarProps['search'];
  /** Props to pass down to the SearchBar component for sort functionality. */
  sortProps: SearchBarProps['sort'];
  /** Callback function executed when a transaction item is pressed. */
  onTransactionPress: (transaction: TransactionData) => void;
};

/**
 * A component that displays a list of transactions with a search and sort bar.
 * Uses FlatList for efficient rendering of potentially long lists.
 */
export default function TransactionList({
  items,
  searchProps,
  sortProps,
  onTransactionPress,
}: TransactionListProps) {
  return (
    <FlatList
      // Renders the SearchBar component at the top of the list.
      ListHeaderComponent={<SearchBar search={searchProps} sort={sortProps} />}
      // Provides a unique key for each item in the list for efficient updates.
      keyExtractor={item => item.id}
      // The array of data to be rendered.
      data={items}
      // Styles the container that wraps the list items.
      contentContainerStyle={[atoms.gap_md]}
      // Renders each item in the list using the TransactionItem component.
      renderItem={({item}) => (
        <TransactionItem onTransactionPress={onTransactionPress} data={item} />
      )}
    />
  );
}
