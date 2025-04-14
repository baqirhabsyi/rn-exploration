import {useMemo} from 'react';
import {
  StyleSheet,
  type ColorValue,
  type TextStyle,
  type ViewStyle,
} from 'react-native';
import {fontSizes, radius, scale} from '../constants/style.constant';
import {type ThemePalette} from '../constants/theme.constant';
import {useTheme} from '../store/theme.store';

const tShirtSizes = ['xxs', 'xs', 'sm', 'md', 'lg', 'xl', 'xxl'] as const;
type TShirtSize = (typeof tShirtSizes)[number];

// Explicitly define T-shirt sizes that have a corresponding numeric radius key
const radiusTShirtSizes = ['xxs', 'xs', 'sm', 'md', 'lg', 'xl'] as const;
type RadiusTShirtSize = (typeof radiusTShirtSizes)[number];

const fontWeights = {
  light: '300',
  regular: '400',
  medium: '500',
  semibold: '600',
  bold: '700',
} as const;
type FontWeightName = keyof typeof fontWeights;

// --- Define types for generated atoms ---
type GapAtomKey =
  | `gap_${TShirtSize}`
  | `gap_x_${TShirtSize}`
  | `gap_y_${TShirtSize}`;
type SpacingAtomKey =
  | `m_${TShirtSize}`
  | `mt_${TShirtSize}`
  | `mb_${TShirtSize}`
  | `ml_${TShirtSize}`
  | `mr_${TShirtSize}`
  | `mx_${TShirtSize}`
  | `my_${TShirtSize}`
  | `p_${TShirtSize}`
  | `pt_${TShirtSize}`
  | `pb_${TShirtSize}`
  | `pl_${TShirtSize}`
  | `pr_${TShirtSize}`
  | `px_${TShirtSize}`
  | `py_${TShirtSize}`;
type FontSizeAtomKey = `text_${TShirtSize}`;
type FontWeightAtomKey = `font_${FontWeightName}`;
type RadiusAtomKey = `rounded_${RadiusTShirtSize}`;

// --- Define type for manually defined static atom keys ---
type StaticAtomKey =
  // Display & Flexbox
  | 'hidden'
  | 'flex'
  | 'flex_1'
  | 'flex_row'
  | 'flex_col'
  | 'flex_wrap'
  | 'flex_nowrap'
  | 'items_start'
  | 'items_end'
  | 'items_center'
  | 'items_stretch'
  | 'items_baseline'
  | 'justify_start'
  | 'justify_end'
  | 'justify_center'
  | 'justify_between'
  | 'justify_around'
  | 'justify_evenly'
  | 'self_auto'
  | 'self_start'
  | 'self_end'
  | 'self_center'
  | 'self_stretch'
  | 'self_baseline'
  // Spacing
  | 'm_auto'
  | 'mx_auto'
  | 'my_auto'
  // Sizing
  | 'w_full'
  | 'h_full'
  | 'w_auto'
  | 'h_auto'
  // Typography
  | 'text_left'
  | 'text_center'
  | 'text_right'
  | 'text_justify'
  // Borders
  | 'border_0'
  | 'border'
  | 'border_t'
  | 'border_b'
  | 'border_l'
  | 'border_r'
  | 'rounded_full'
  // Position
  | 'absolute'
  | 'relative'
  | 'inset_0'
  | 'top_0'
  | 'bottom_0'
  | 'left_0'
  | 'right_0'
  // Effects
  | 'opacity_0'
  | 'opacity_50'
  | 'opacity_100'
  // Layout Misc
  | 'overflow_hidden'
  | 'overflow_visible'
  | 'overflow_scroll';

// --- Define combined type for ALL atom keys ---
type AtomKey =
  | StaticAtomKey
  | GapAtomKey
  | SpacingAtomKey
  | FontSizeAtomKey
  | FontWeightAtomKey
  | RadiusAtomKey;

// --- Generate atoms with explicit types ---

const gapAtoms = Object.fromEntries(
  tShirtSizes.flatMap(size => [
    [`gap_${size}`, {gap: scale[size]} as ViewStyle],
    [`gap_x_${size}`, {columnGap: scale[size]} as ViewStyle],
    [`gap_y_${size}`, {rowGap: scale[size]} as ViewStyle],
  ]),
) as Record<GapAtomKey, ViewStyle>;

const spacingAtoms = Object.fromEntries(
  tShirtSizes.flatMap(size => [
    [`m_${size}`, {margin: scale[size]} as ViewStyle],
    [`mt_${size}`, {marginTop: scale[size]} as ViewStyle],
    [`mb_${size}`, {marginBottom: scale[size]} as ViewStyle],
    [`ml_${size}`, {marginLeft: scale[size]} as ViewStyle],
    [`mr_${size}`, {marginRight: scale[size]} as ViewStyle],
    [`mx_${size}`, {marginHorizontal: scale[size]} as ViewStyle],
    [`my_${size}`, {marginVertical: scale[size]} as ViewStyle],
    [`p_${size}`, {padding: scale[size]} as ViewStyle],
    [`pt_${size}`, {paddingTop: scale[size]} as ViewStyle],
    [`pb_${size}`, {paddingBottom: scale[size]} as ViewStyle],
    [`pl_${size}`, {paddingLeft: scale[size]} as ViewStyle],
    [`pr_${size}`, {paddingRight: scale[size]} as ViewStyle],
    [`px_${size}`, {paddingHorizontal: scale[size]} as ViewStyle],
    [`py_${size}`, {paddingVertical: scale[size]} as ViewStyle],
  ]),
) as Record<SpacingAtomKey, ViewStyle>;

const fontSizeAtoms = Object.fromEntries(
  tShirtSizes.map(size => [
    `text_${size}`,
    {fontSize: fontSizes[size]} as TextStyle,
  ]),
) as Record<FontSizeAtomKey, TextStyle>;

const fontWeightAtoms = Object.fromEntries(
  Object.entries(fontWeights).map(([name, value]) => [
    `font_${name}`,
    {fontWeight: value} as TextStyle, // No need for 'as TextStyle['fontWeight']'
  ]),
) as Record<FontWeightAtomKey, TextStyle>;

const radiusAtoms = Object.fromEntries(
  radiusTShirtSizes.map(size => [
    `rounded_${size}`,
    {borderRadius: radius[size]} as ViewStyle,
  ]),
) as Record<RadiusAtomKey, ViewStyle>;

// --- Combine static and generated atoms ---
const staticAtoms = {
  // --- Display & Flexbox ---
  hidden: {display: 'none'} as ViewStyle,
  flex: {display: 'flex'} as ViewStyle,
  flex_1: {flex: 1} as ViewStyle,
  flex_row: {flexDirection: 'row'} as ViewStyle,
  flex_col: {flexDirection: 'column'} as ViewStyle,
  flex_wrap: {flexWrap: 'wrap'} as ViewStyle,
  flex_nowrap: {flexWrap: 'nowrap'} as ViewStyle,
  items_start: {alignItems: 'flex-start'} as ViewStyle,
  items_end: {alignItems: 'flex-end'} as ViewStyle,
  items_center: {alignItems: 'center'} as ViewStyle,
  items_stretch: {alignItems: 'stretch'} as ViewStyle,
  items_baseline: {alignItems: 'baseline'} as ViewStyle,
  justify_start: {justifyContent: 'flex-start'} as ViewStyle,
  justify_end: {justifyContent: 'flex-end'} as ViewStyle,
  justify_center: {justifyContent: 'center'} as ViewStyle,
  justify_between: {justifyContent: 'space-between'} as ViewStyle,
  justify_around: {justifyContent: 'space-around'} as ViewStyle,
  justify_evenly: {justifyContent: 'space-evenly'} as ViewStyle,
  self_auto: {alignSelf: 'auto'} as ViewStyle,
  self_start: {alignSelf: 'flex-start'} as ViewStyle,
  self_end: {alignSelf: 'flex-end'} as ViewStyle,
  self_center: {alignSelf: 'center'} as ViewStyle,
  self_stretch: {alignSelf: 'stretch'} as ViewStyle,
  self_baseline: {alignSelf: 'baseline'} as ViewStyle,

  // --- Flexbox Gap (Generated) ---
  ...gapAtoms,

  // --- Spacing (Generated & Static) ---
  ...spacingAtoms,
  m_auto: {margin: 'auto'} as ViewStyle, // Keep specific 'auto' values
  mx_auto: {marginHorizontal: 'auto'} as ViewStyle,
  my_auto: {marginVertical: 'auto'} as ViewStyle,

  // --- Sizing ---
  w_full: {width: '100%'} as ViewStyle,
  h_full: {height: '100%'} as ViewStyle,
  w_auto: {width: 'auto'} as ViewStyle,
  h_auto: {height: 'auto'} as ViewStyle,

  // --- Typography (Generated & Static) ---
  ...fontSizeAtoms,
  ...fontWeightAtoms,
  text_left: {textAlign: 'left'} as TextStyle,
  text_center: {textAlign: 'center'} as TextStyle,
  text_right: {textAlign: 'right'} as TextStyle,
  text_justify: {textAlign: 'justify'} as TextStyle,

  // --- Borders ---
  border_0: {borderWidth: 0} as ViewStyle,
  border: {borderWidth: StyleSheet.hairlineWidth} as ViewStyle,
  border_t: {borderTopWidth: StyleSheet.hairlineWidth} as ViewStyle,
  border_b: {borderBottomWidth: StyleSheet.hairlineWidth} as ViewStyle,
  border_l: {borderLeftWidth: StyleSheet.hairlineWidth} as ViewStyle,
  border_r: {borderRightWidth: StyleSheet.hairlineWidth} as ViewStyle,
  ...radiusAtoms,
  rounded_full: {borderRadius: radius.full} as ViewStyle, // Keep specific 'full' value

  // --- Position ---
  absolute: {position: 'absolute'} as ViewStyle,
  relative: {position: 'relative'} as ViewStyle,
  inset_0: {top: 0, bottom: 0, left: 0, right: 0} as ViewStyle,
  top_0: {top: 0} as ViewStyle,
  bottom_0: {bottom: 0} as ViewStyle,
  left_0: {left: 0} as ViewStyle,
  right_0: {right: 0} as ViewStyle,

  // --- Effects ---
  opacity_0: {opacity: 0} as ViewStyle,
  opacity_50: {opacity: 0.5} as ViewStyle,
  opacity_100: {opacity: 1} as ViewStyle,

  // --- Layout Misc ---
  overflow_hidden: {overflow: 'hidden'} as ViewStyle,
  overflow_visible: {overflow: 'visible'} as ViewStyle,
  overflow_scroll: {overflow: 'scroll'} as ViewStyle,
};

// Explicitly type the final atoms object for StyleSheet.create
type StaticAtomStyle = ViewStyle | TextStyle;
export const atoms =
  StyleSheet.create<Record<AtomKey, StaticAtomStyle>>(staticAtoms);

// --- Themed Atoms Hook (using Context) ---

type ThemedAtomStyles = {
  [key: string]: ViewStyle | TextStyle;
};

const createThemedAtomStyles = (theme: ThemePalette): ThemedAtomStyles => {
  const styles: ThemedAtomStyles = {};
  for (const [key, value] of Object.entries(theme)) {
    const colorName = key as keyof ThemePalette;
    styles[`bg_${colorName}`] = {backgroundColor: value as ColorValue};
    styles[`text_${colorName}`] = {color: value as ColorValue};
    styles[`border_${colorName}`] = {borderColor: value as ColorValue};
  }
  return styles;
};

// Hook to get themed atoms using Context state
export const useThemeAtoms = () => {
  const {theme} = useTheme();

  // Use useMemo to prevent re-creating the StyleSheet on every render
  const themedStyles = useMemo(() => {
    const themedAtomStyles = createThemedAtomStyles(theme);
    return StyleSheet.create(themedAtomStyles);
  }, [theme]);

  return themedStyles;
};
