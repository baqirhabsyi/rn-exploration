import Icon from '@react-native-vector-icons/fontawesome6';
import {memo, useMemo} from 'react';
import {TextInput, View} from 'react-native';
import {useTheme} from '../../store/theme.store';
import {atoms} from '../../utils/style.util';
import SelectionModal from '../selection-modal/selection-modal.component';

export type SearchBarProps = {
  search: {
    placeholder: string;
    value: string;
    onChangeText: (text: string) => void;
  };
  sort: {
    initialValue: {
      label: string;
      value: string;
    };
    options: {
      label: string;
      value: string;
    }[];
    onChange: (option: {label: string; value: string}) => void;
  };
};

function SearchBar({search, sort}: SearchBarProps) {
  const theme = useTheme();

  const selectionModalContent = useMemo(() => {
    console.log('render selection modal');
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
        atoms.flex_row,
        atoms.items_center,
        atoms.justify_between,
        atoms.rounded_md,
        atoms.px_lg,
        atoms.py_sm,
        {
          backgroundColor: theme.theme.card,
        },
      ]}>
      <View style={[atoms.flex_row, atoms.items_center, atoms.gap_sm]}>
        <Icon
          name="magnifying-glass"
          size={20}
          color={theme.theme.inputPlaceholder}
          iconStyle="solid"
        />
        <TextInput
          style={[atoms.text_md]}
          placeholderTextColor={theme.theme.inputPlaceholder}
          placeholder={search.placeholder}
          value={search.value}
          onChangeText={search.onChangeText}
        />
      </View>
      <View style={[atoms.flex_row, atoms.items_center, atoms.gap_sm]}>
        {selectionModalContent}
      </View>
    </View>
  );
}

export default memo(SearchBar);
