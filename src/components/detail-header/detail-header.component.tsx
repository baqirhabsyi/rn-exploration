import Icon from '@react-native-vector-icons/fontawesome6';
import {useCallback} from 'react';
import {Pressable, Text, View} from 'react-native';
import {useTheme} from '../../store/theme.store';
import {atoms, useThemeAtoms} from '../../utils/style.util';

/**
 * Props for the DetailHeader component.
 */
export type DetailHeaderProps = {
  /** The unique identifier for the transaction. */
  transactionID: string;
  /** Callback function invoked when the close action is requested. */
  onRequestClose: () => void;
  /** Callback function invoked when the transaction ID copy action is requested. */
  onCopyTransactionId: (transactionID: string) => void;
};

/**
 * A header component for the transaction detail view.
 * Displays the transaction ID, a copy button, the section title, and a close button.
 */
export function DetailHeader({
  transactionID,
  onRequestClose,
  onCopyTransactionId,
}: DetailHeaderProps) {
  // Memoizes the copy handler to prevent unnecessary re-renders.
  const handleCopyTransactionID = useCallback(() => {
    onCopyTransactionId(transactionID);
  }, [onCopyTransactionId, transactionID]);

  // Accesses theme information for styling.
  const theme = useTheme();
  const themeAtoms = useThemeAtoms();

  return (
    <>
      {/* Section displaying the transaction ID and copy button */}
      <View
        style={[atoms.flex_row, atoms.items_center, atoms.gap_sm, atoms.p_xl]}>
        <Text style={[atoms.font_bold]}>ID TRANSAKSI: #{transactionID}</Text>
        <Pressable onPress={handleCopyTransactionID}>
          <Icon name="copy" size={20} color={theme.theme.primary} />
        </Pressable>
      </View>
      {/* Section displaying the title and close button */}
      <View
        style={[
          atoms.flex_row,
          atoms.items_center,
          atoms.justify_between,
          atoms.p_xl,
        ]}>
        <Text style={[atoms.font_bold]}>DETAIL TRANSAKSI</Text>
        <Pressable onPress={onRequestClose}>
          <Text style={[themeAtoms.text_primary]}>Tutup</Text>
        </Pressable>
      </View>
    </>
  );
}
