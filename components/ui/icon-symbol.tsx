// Fallback for using MaterialIcons on Android and web.

import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { SymbolWeight, SymbolViewProps } from 'expo-symbols';
import { ComponentProps } from 'react';
import { OpaqueColorValue, type StyleProp, type TextStyle } from 'react-native';

type IconMapping = Record<SymbolViewProps['name'], ComponentProps<typeof MaterialIcons>['name']>;
type IconSymbolName = keyof typeof MAPPING;

/**
 * Add your SF Symbols to Material Icons mappings here.
 * - see Material Icons in the [Icons Directory](https://icons.expo.fyi).
 * - see SF Symbols in the [SF Symbols](https://developer.apple.com/sf-symbols/) app.
 */
const MAPPING = {
  'house.fill': 'home',
  'paperplane.fill': 'send',
  'chevron.left.forwardslash.chevron.right': 'code',
  'chevron.right': 'chevron-right',
  'magnifyingglass': 'search',
  'person.2.fill': 'people',
  'calendar': 'event',
  'person.fill': 'person',
  'bell.fill': 'notifications',
  'person.crop.circle.fill': 'account-circle',
  'plus': 'add',
  'map': 'map',
  'star.fill': 'star',
  'star': 'star-outline',
  'mappin.and.ellipse': 'location-on',
  'person.3.sequence.fill': 'groups',
  'clock.fill': 'access-time',
  'clock': 'access-time',
  'calendar.badge.exclamationmark': 'event-busy',
  'xmark': 'close',
  'qrcode.viewfinder': 'qr-code-scanner',
  'creditcard': 'credit-card',
  'creditcard.fill': 'credit-card',
  'lock.fill': 'lock',
  'chevron.left': 'chevron-left',
  'square.and.arrow.up': 'share',
  'checkmark.circle.fill': 'check-circle',
  'arrow.up': 'arrow-upward',
  'building.2.fill': 'business',
  'chart.bar.fill': 'bar-chart',
  'rectangle.portrait.and.arrow.right': 'logout',
  'heart.fill': 'favorite',
  'mappin.circle.fill': 'location-on',
  'map.fill': 'map',
} as IconMapping;

/**
 * An icon component that uses native SF Symbols on iOS, and Material Icons on Android and web.
 * This ensures a consistent look across platforms, and optimal resource usage.
 * Icon `name`s are based on SF Symbols and require manual mapping to Material Icons.
 */
export function IconSymbol({
  name,
  size = 24,
  color,
  style,
}: {
  name: IconSymbolName;
  size?: number;
  color: string | OpaqueColorValue;
  style?: StyleProp<TextStyle>;
  weight?: SymbolWeight;
}) {
  return <MaterialIcons color={color} size={size} name={MAPPING[name]} style={style} />;
}
