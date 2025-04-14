import Icon from '@react-native-vector-icons/fontawesome6';
import {memo, useMemo} from 'react';
import {TextInput, View} from 'react-native';
import {useTheme} from '../../store/theme.store';
import {atoms} from '../../utils/style.util';
import SelectionModal from '../selection-modal/selection-modal.component';

/**
 * Props for the SearchBar component.
 */
export type SearchBarProps = {
  /** Configuration for the search input field. */
  search: {
    /** Placeholder text for the search input. */
    placeholder: string;
    /** Current value of the search input. */
    value: string;
    /** Callback function when the search text changes. */
    onChangeText: (text: string) => void;
  };
  /** Configuration for the sort selection modal. */
  sort: {
    /** The initially selected sort option. */
    initialValue: {
      label: string;
      value: string;
    };
    /** The list of available sort options. */
    options: {
      label: string;
      value: string;
    }[];
    /** Callback function when a sort option is selected. */
    onChange: (option: {label: string; value: string}) => void;
  };
};

/**
 * A component that provides a search input field and a sort selection modal.
 * It uses the theme context for styling and memoization for performance optimization.
 */
function SearchBar({search, sort}: SearchBarProps) {
  // Accesses theme information for styling.
  const theme = useTheme();

  // Memoizes the SelectionModal component to prevent unnecessary re-renders
  // when the parent component re-renders, unless sort props change.
  const selectionModalContent = useMemo(() => {
    return (
      <SelectionModal
        initialValue={sort.initialValue}
        options={sort.options}
        onChange={sort.onChange}
      />
    );
  }, [sort.initialValue, sort.options, sort.onChange]);

  return (
    <View
      style={[
        // Layout and styling atoms.
        atoms.flex_row,
        atoms.items_center,
        atoms.justify_between,
        atoms.rounded_md,
        atoms.px_lg,
        atoms.py_sm,
        // Dynamic background color based on the theme.
        {
          backgroundColor: theme.theme.card,
        },
      ]}>
      {/* Search input section */}
      <View style={[atoms.flex_row, atoms.items_center, atoms.gap_sm]}>
        <Icon
          name="magnifying-glass"
          size={20}
          color={theme.theme.inputPlaceholder}
          iconStyle="solid"
        />
        <TextInput
          style={[atoms.text_md]} // Basic text styling.
          placeholderTextColor={theme.theme.inputPlaceholder} // Placeholder text color from theme.
          placeholder={search.placeholder} // Placeholder text.
          value={search.value} // Current input value.
          onChangeText={search.onChangeText} // Text change handler.
        />
      </View>
      {/* Sort selection section */}
      <View style={[atoms.flex_row, atoms.items_center, atoms.gap_sm]}>
        {selectionModalContent} {/* Renders the memoized SelectionModal */}
      </View>
    </View>
  );
}

// Exports the SearchBar component wrapped in React.memo.
// This prevents re-renders if the props (search, sort) haven't changed.
export default memo(SearchBar);
