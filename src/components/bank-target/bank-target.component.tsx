import Icon from '@react-native-vector-icons/fontawesome6';
import {Text, View} from 'react-native';
import {atoms} from '../../utils/style.util';

export type BankTargetProps = {
  sourceBank: string;
  targetBank: string;
};

export function BankTarget({sourceBank, targetBank}: BankTargetProps) {
  return (
    <View style={[atoms.flex_row, atoms.items_center, atoms.gap_sm]}>
      <Text style={[atoms.text_md, atoms.font_bold]}>{sourceBank}</Text>
      <Icon name="arrow-right" size={16} color="black" iconStyle="solid" />
      <Text style={[atoms.text_md, atoms.font_bold]}>{targetBank}</Text>
    </View>
  );
}
