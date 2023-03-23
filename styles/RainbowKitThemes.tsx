import {
  darkTheme,
  lightTheme,
  Theme } from '@rainbow-me/rainbowkit';
import merge from 'lodash/merge';

export const rainbowDark = merge(darkTheme(), {
  colors: {
    accentColor: '#00A4FF',
    modalBackground: '#222222',
  },
  fonts: {
    body: 'Rubik',
  },
  radii: {
    modal: '10px',
    modalMobile: '10px',
    actionButton: '10px',
    menuButton: '10px',
  },
} as Theme);

export const rainbowLight = merge(lightTheme(), {
  colors: {
    accentColor: '#0077BA',
    modalBackground: 'white',
  },
  fonts: {
    body: 'Rubik',
  },
  radii: {
    modal: '10px',
    modalMobile: '10px',
    actionButton: '10px',
    menuButton: '10px',
  },
} as Theme);
