import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {colors} from '../../constants/style.constant';
import {atoms} from '../../utils/style.util';

export type PillProps = {
  type: 'success' | 'warning';
  label: string;
};

export default function Pill({type, label}: PillProps) {
  const isSuccess = type === 'success';

  return (
    <View
      style={[
        atoms.py_xxs,
        atoms.px_sm,
        atoms.border,
        atoms.rounded_sm,
        componentStyles.border,
        isSuccess
          ? componentStyles.green_border
          : componentStyles.orange_border,
        isSuccess && componentStyles.bg_green,
      ]}>
      <Text
        style={[
          atoms.text_sm,
          atoms.font_bold,
          isSuccess ? componentStyles.white_text : componentStyles.black_text,
        ]}>
        {label}
      </Text>
    </View>
  );
}

const componentStyles = StyleSheet.create({
  black_text: {
    color: 'black',
  },
  white_text: {
    color: 'white',
  },
  border: {
    borderWidth: 2,
  },
  orange_border: {
    borderColor: colors.orange.base,
  },
  green_border: {
    borderColor: colors.green.base,
  },
  bg_green: {
    backgroundColor: colors.green.base,
  },
});
