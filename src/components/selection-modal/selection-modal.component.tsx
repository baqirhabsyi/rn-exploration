import Icon from '@react-native-vector-icons/fontawesome6';
import {memo, useCallback, useState} from 'react';
import {FlatList, Modal, Pressable, StyleSheet, Text, View} from 'react-native';
import {useTheme} from '../../store/theme.store';
import {atoms, useThemeAtoms} from '../../utils/style.util';

/**
 * Props for the SelectionModal component.
 */
export type SelectionModalProps = {
  /** The initially selected option. */
  initialValue: {
    label: string;
    value: string;
  };
  /** The list of available options to choose from. */
  options: {
    label: string;
    value: string;
  }[];
  /** Callback function invoked when an option is selected. */
  onChange: (option: {label: string; value: string}) => void;
};

/**
 * A component that displays a button to trigger a modal for selecting an option
 * from a list. It manages the modal visibility state and the selected option.
 */
function SelectionModal({
  initialValue,
  options,
  onChange,
}: SelectionModalProps) {
  // State to control the visibility of the modal.
  const [modalVisible, setModalVisible] = useState(false);
  // State to keep track of the currently selected option.
  const [selectedOption, setSelectedOption] = useState(initialValue);

  // Access theme information for styling.
  const themeAtoms = useThemeAtoms();
  const theme = useTheme();

  // Memoized callback function to handle option selection.
  // Updates the selected option state, closes the modal, and calls the onChange prop.
  const handleSelect = useCallback(
    (option: {label: string; value: string}) => {
      setSelectedOption(option);
      setModalVisible(false);
      onChange(option);
    },
    [onChange], // Dependency array ensures the callback is stable unless onChange changes.
  );

  return (
    <View>
      {/* Pressable area that displays the selected option and opens the modal on press */}
      <Pressable onPress={() => setModalVisible(true)}>
        <View style={[atoms.flex_row, atoms.items_center, atoms.gap_sm]}>
          {/* Displays the label of the currently selected option */}
          <Text style={[atoms.font_bold, {color: theme.theme.primary}]}>
            {selectedOption.label}
          </Text>
          {/* Down arrow icon indicating a dropdown/selection */}
          <Icon
            name="chevron-down"
            size={20}
            color={theme.theme.primary}
            iconStyle="solid"
          />
        </View>
      </Pressable>

      {/* The modal component itself */}
      <Modal
        transparent={true} // Allows underlying content to be partially visible.
        animationType="fade" // Specifies the animation when the modal appears/disappears.
        visible={modalVisible} // Controls whether the modal is currently visible.
        onRequestClose={() => setModalVisible(false)} // Android back button handler.
      >
        {/* Full screen pressable overlay to close the modal when tapping outside the content area */}
        <Pressable
          style={[
            atoms.flex_1,
            atoms.items_center,
            atoms.justify_center,
            componentStyles.bg_semi_transparent,
          ]}
          onPress={() => setModalVisible(false)}>
          {/* Pressable container for the modal content, prevents closing when tapping inside */}
          <Pressable
            style={[
              atoms.w_full, // Takes full width with margins.
              atoms.mx_lg, // Horizontal margins.
              atoms.p_lg, // Padding inside the modal content area.
              atoms.rounded_lg, // Rounded corners.
              themeAtoms.bg_card, // Background color from theme.
            ]}
            onPress={e => e.stopPropagation()} // Prevents taps inside from closing the modal.
          >
            {/* List of selectable options */}
            <FlatList
              data={options} // The array of options to display.
              keyExtractor={item => item.value} // Unique key for each option.
              renderItem={({item}) => {
                // Check if the current item is the selected one.
                const isSelected = item.value === selectedOption.value;
                return (
                  // Pressable area for each individual option.
                  <Pressable
                    style={[atoms.flex_row, atoms.items_center, atoms.py_md]}
                    onPress={() => handleSelect(item)} // Call handleSelect when an option is pressed.
                  >
                    {/* Custom radio button indicator */}
                    <View
                      style={[
                        componentStyles.w_md,
                        componentStyles.h_md,
                        atoms.rounded_full, // Makes it circular.
                        atoms.border, // Adds a border.
                        atoms.mr_md, // Margin to the right.
                        // Conditional styling for selected state.
                        isSelected
                          ? [themeAtoms.bg_primary, themeAtoms.border_primary]
                          : themeAtoms.border_input,
                      ]}
                    />
                    {/* Text label for the option */}
                    <Text
                      style={[
                        atoms.text_md,
                        // Conditional text color for selected state.
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

// Local styles specific to the SelectionModal component.
const componentStyles = StyleSheet.create({
  bg_semi_transparent: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  w_md: {
    width: 16,
  },
  h_md: {
    height: 16,
  },
});

// Exports the SelectionModal component wrapped in React.memo.
// This prevents re-renders if the props (initialValue, options, onChange) haven't changed.
export default memo(SelectionModal);
