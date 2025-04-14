import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {colors} from '../../constants/style.constant';
import {atoms} from '../../utils/style.util';

/**
 * Props for the Pill component.
 */
export type PillProps = {
  /** Determines the visual style of the pill (e.g., 'success', 'warning'). */
  type: 'success' | 'warning';
  /** The text content to display inside the pill. */
  label: string;
};

/**
 * A small, rounded component (pill) used to display status information.
 * The appearance changes based on the specified type (success or warning).
 */
export default function Pill({type, label}: PillProps) {
  // Determines if the pill type is 'success' for conditional styling.
  const isSuccess = type === 'success';

  return (
    <View
      style={[
        // Basic layout and styling atoms.
        atoms.py_xxs,
        atoms.px_sm,
        atoms.border,
        atoms.rounded_sm,
        // Local component styles.
        componentStyles.border,
        // Conditional border color based on type.
        isSuccess
          ? componentStyles.green_border
          : componentStyles.orange_border,
        // Conditional background color for success type.
        isSuccess && componentStyles.bg_green,
      ]}>
      <Text
        style={[
          // Basic text styling atoms.
          atoms.text_sm,
          atoms.font_bold,
          // Conditional text color based on type.
          isSuccess ? componentStyles.white_text : componentStyles.black_text,
        ]}>
        {label}
      </Text>
    </View>
  );
}

// Local styles specific to the Pill component.
const componentStyles = StyleSheet.create({
  // Text color styles.
  black_text: {
    color: 'black',
  },
  white_text: {
    color: 'white',
  },
  // Border style.
  border: {
    borderWidth: 2,
  },
  // Border color styles based on type.
  orange_border: {
    borderColor: colors.orange.base,
  },
  green_border: {
    borderColor: colors.green.base,
  },
  // Background color style for success type.
  bg_green: {
    backgroundColor: colors.green.base,
  },
});
