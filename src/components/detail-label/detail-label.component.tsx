import {StyleSheet, Text, View} from 'react-native';
import {atoms} from '../../utils/style.util';

/**
 * Props for the DetailLabel component.
 */
export type DetailLabelProps = {
  /** The label text to display. */
  label: string;
  /** The value text to display. */
  value: string;
};

/**
 * A component that displays a label and a corresponding value, typically used
 * in detail views. The label is displayed in uppercase and bold.
 */
export function DetailLabel({label, value}: DetailLabelProps) {
  return (
    <View style={[atoms.flex_col, atoms.gap_xxs, componentStyles.half_width]}>
      {/* Label text, converted to uppercase */}
      <Text style={[atoms.text_md, atoms.font_bold]}>
        {label.toUpperCase()}
      </Text>
      {/* Value text */}
      <Text style={[atoms.text_md]}>{value}</Text>
    </View>
  );
}

// Local styles specific to the DetailLabel component.
const componentStyles = StyleSheet.create({
  // Ensures the component takes up roughly half the width for layout purposes.
  half_width: {
    minWidth: '38%',
  },
});
