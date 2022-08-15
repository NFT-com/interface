import { useUser } from 'hooks/state/useUser';

import { rgba } from 'polished';

export interface ThemeColors {
  // hex color strings
  alwaysWhite: string;
  alwaysBlack: string;
  red: string;
  green: string;
  pink: string;
  heroPink: string;
  transparent: string;
  accent: string;
  accentBorder: string;
  background: string;
  headerBackground: string;
  tileBackground: string;
  tileBackgroundSecondary: string;
  inputBackground: string;
  inputBorder: string;
  primaryButtonText: string;
  primaryButtonText_rebrand: string;
  primaryButtonTextDisabled: string;
  primaryButtonTextDisabled_rebrand: string;
  primaryButtonBackground: string;
  primaryButtonBackground_rebrand: string;
  primaryButtonBackgroundDisabled: string;
  secondaryButtonBackgroundEnabled: string;
  secondaryButtonBorderEnabled: string;
  secondaryButtonBorderDisabled: string;
  secondaryButtonBackground: string,
  secondaryButtonBackgroundDisabled: string,
  secondaryButtonText: string,
  secondaryButtonTextDisabled: string,
  errorButtonBackground: string;
  disabledButtonBackground: string;
  modalOverlay: string;
  modalBackground: string;
  primaryText: string;
  primaryIcon: string;
  secondaryIcon: string;
  secondaryText: string;
  rowBackgroundActive: string;
  rowBackgroundInactive: string;
  rowBorder: string;
  link: string;
  // tailwind css classNames (should control colors)
  dividerColorClass: string;
  primaryTextClass: string;
}

export function useThemeColors(): ThemeColors {
  const { user } = useUser();
  return {
    // constants
    alwaysBlack: '#000000',
    alwaysWhite: '#FFFFFF',
    red: user?.isDarkMode ? '#F36886' : rgba(239, 68, 68, 1),
    green: user?.isDarkMode ? '#8EE4BD' : rgba(16, 185, 129, 1),
    pink: '#F2358E',
    heroPink: '#FF62EF',
    transparent: rgba(255, 255, 255, 0),
    // hex colors
    accent: user?.isDarkMode ? '#2C3448' : '#F0F5FF',
    accentBorder: user?.isDarkMode ? '#384260' : 'transparent',
    background: user?.isDarkMode ? '#0C0F17' : rgba(244, 246, 251, 1),
    headerBackground: user?.isDarkMode ? '#0C0F17' : '#FFFFFF',
    tileBackground: user?.isDarkMode ? rgba(17, 21, 32, 0.75) : '#FFFFFF',
    tileBackgroundSecondary: user?.isDarkMode ? '#303030' : '#FFFFFF',
    inputBackground: user?.isDarkMode ? '#111520' : rgba(202, 210, 234, 0.2),
    inputBorder: user?.isDarkMode ? '#37425C' : '#CAD2EA',
    primaryButtonBackground: '#00A4FF',
    primaryButtonBackground_rebrand: '#F9D963',
    primaryButtonBackgroundDisabled: rgba(52, 58, 80, 0.5),
    secondaryButtonBackgroundDisabled: '#000000',
    secondaryButtonBackgroundEnabled: '#F2358E',
    secondaryButtonBorderEnabled: '#F2358E',
    secondaryButtonBorderDisabled: '#37425C',
    secondaryButtonText: '#7C8294',
    secondaryButtonTextDisabled: '#FFFFFF',
    secondaryButtonBackground: '#FFFFFF',
    link: '#00A4FF',
    primaryButtonText: '#FFFFFF',
    primaryButtonText_rebrand: '#4D4412',
    primaryButtonTextDisabled: '#777E91',
    primaryButtonTextDisabled_rebrand: '#4D4412',
    errorButtonBackground: '#E8006F',
    disabledButtonBackground: '#6B7280',
    modalOverlay: user?.isDarkMode ? rgba(23, 27, 39, 0.5) : rgba(240, 245, 255, 0.5),
    modalBackground: user?.isDarkMode ? '#22293B' : '#FFFFFF',
    primaryText: user?.isDarkMode ? '#FFFFFF' : '#000000',
    primaryIcon: user?.isDarkMode ? '#FFFFFF' : '#000000',
    secondaryIcon: '#777E93',
    rowBackgroundActive: user?.isDarkMode ? rgba(44, 51, 74, 0.75) : '#F0F5FF',
    rowBackgroundInactive: user?.isDarkMode ? rgba(23, 27, 39, 0.75) : rgba(255, 255, 255, 0.8),
    rowBorder: user?.isDarkMode ? 'transparent' : '#E6ECFF',
    secondaryText: '#777E93',
    // class names
    dividerColorClass: user?.isDarkMode ? 'border-gray-200' : 'border-gray-800',
    primaryTextClass: user?.isDarkMode ? 'text-white' : 'text-black',
  };
}
