import Icon from '@react-native-vector-icons/fontawesome6';
import {Text, View} from 'react-native';
import {atoms} from '../../utils/style.util';

/**
 * Props for the BankTarget component.
 */
export type BankTargetProps = {
  /** The name of the source bank. */
  sourceBank: string;
  /** The name of the target bank. */
  targetBank: string;
};

/**
 * A component that displays the source and target banks of a transaction
 * with an arrow icon in between.
 */
export function BankTarget({sourceBank, targetBank}: BankTargetProps) {
  return (
    <View style={[atoms.flex_row, atoms.items_center, atoms.gap_sm]}>
      <Text style={[atoms.text_md, atoms.font_bold]}>{sourceBank}</Text>
      <Icon name="arrow-right" size={16} color="black" iconStyle="solid" />
      <Text style={[atoms.text_md, atoms.font_bold]}>{targetBank}</Text>
    </View>
  );
}
