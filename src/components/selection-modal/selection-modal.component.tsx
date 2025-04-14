import Icon from '@react-native-vector-icons/fontawesome6';
import {memo, useCallback, useState} from 'react';
import {FlatList, Modal, Pressable, Text, View} from 'react-native';
import {useTheme} from '../../store/theme.store';
import {atoms, useThemeAtoms} from '../../utils/style.util';

export type SelectionModalProps = {
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

function SelectionModal({
  initialValue,
  options,
  onChange,
}: SelectionModalProps) {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedOption, setSelectedOption] = useState(initialValue);

  const themeAtoms = useThemeAtoms();
  const theme = useTheme();

  const handleSelect = useCallback(
    (option: {label: string; value: string}) => {
      setSelectedOption(option);
      setModalVisible(false);
      onChange(option);
    },
    [onChange],
  );

  console.log({selectedOption});

  return (
    <View>
      <Pressable onPress={() => setModalVisible(true)}>
        <View style={[atoms.flex_row, atoms.items_center, atoms.gap_sm]}>
          <Text style={[atoms.font_bold, {color: theme.theme.primary}]}>
            {selectedOption.label}
          </Text>
          <Icon
            name="chevron-down"
            size={20}
            color={theme.theme.primary}
            iconStyle="solid"
          />
        </View>
      </Pressable>
      <Modal
        transparent={true}
        animationType="fade"
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}>
        <Pressable
          style={[
            atoms.flex_1,
            atoms.items_center,
            atoms.justify_center,
            {backgroundColor: 'rgba(0, 0, 0, 0.5)'},
          ]}
          onPress={() => setModalVisible(false)}>
          <Pressable
            style={[
              atoms.w_full,
              atoms.mx_lg,
              atoms.p_lg,
              atoms.rounded_lg,
              themeAtoms.bg_card,
            ]}
            onPress={e => e.stopPropagation()}>
            <FlatList
              data={options}
              keyExtractor={item => item.value}
              renderItem={({item}) => {
                const isSelected = item.value === selectedOption.value;
                return (
                  <Pressable
                    style={[atoms.flex_row, atoms.items_center, atoms.py_md]}
                    onPress={() => handleSelect(item)}>
                    <View
                      style={[
                        {width: 16, height: 16},
                        atoms.rounded_full,
                        atoms.border,
                        atoms.mr_md,
                        isSelected
                          ? [themeAtoms.bg_primary, themeAtoms.border_primary]
                          : themeAtoms.border_input,
                      ]}
                    />
                    <Text
                      style={[
                        atoms.text_md,
                        isSelected
                          ? themeAtoms.text_primary
                          : themeAtoms.text_text,
                      ]}>
                      {item.label}
                    </Text>
                  </Pressable>
                );
              }}
            />
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
}

export default memo(SelectionModal);
