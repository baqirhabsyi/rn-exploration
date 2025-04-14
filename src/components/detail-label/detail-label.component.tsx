import {StyleSheet, Text, View} from 'react-native';
import {atoms} from '../../utils/style.util';

export type DetailLabelProps = {
  label: string;
  value: string;
};

export function DetailLabel({label, value}: DetailLabelProps) {
  return (
    <View style={[atoms.flex_col, atoms.gap_xxs, componentStyles.half_width]}>
      <Text style={[atoms.text_md, atoms.font_bold]}>
        {label.toUpperCase()}
      </Text>
      <Text style={[atoms.text_md]}>{value}</Text>
    </View>
  );
}

const componentStyles = StyleSheet.create({
  half_width: {
    minWidth: '38%',
  },
});
