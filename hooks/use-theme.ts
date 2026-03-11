/**
 * useTheme — one-stop hook for theme colors in any component.
 * 
 * Usage:
 *   const theme = useTheme();
 *   <Text style={{ color: theme.text }}>Hello</Text>
 */
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

export type Theme = typeof Colors.light;

export function useTheme(): Theme {
    const colorScheme = useColorScheme() ?? 'light';
    return Colors[colorScheme];
}
