import Icon from '@react-native-vector-icons/fontawesome6';
import {useCallback} from 'react';
import {Pressable, Text, View} from 'react-native';
import {useTheme} from '../../store/theme.store';
import {atoms, useThemeAtoms} from '../../utils/style.util';

export type DetailHeaderProps = {
  transactionID: string;
  onRequestClose: () => void;
  onCopyTransactionId: (transactionID: string) => void;
};

export function DetailHeader({
  transactionID,
  onRequestClose,
  onCopyTransactionId,
}: DetailHeaderProps) {
  const handleCopyTransactionID = useCallback(() => {
    onCopyTransactionId(transactionID);
  }, [onCopyTransactionId, transactionID]);

  const theme = useTheme();
  const themeAtoms = useThemeAtoms();

  return (
    <>
      <View
        style={[atoms.flex_row, atoms.items_center, atoms.gap_sm, atoms.p_xl]}>
        <Text style={[atoms.font_bold]}>ID TRANSAKSI: #{transactionID}</Text>
        <Pressable onPress={handleCopyTransactionID}>
          <Icon name="copy" size={20} color={theme.theme.primary} />
        </Pressable>
      </View>
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
