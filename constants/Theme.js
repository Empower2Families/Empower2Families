/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 */
import { DefaultTheme, DarkTheme } from '@react-navigation/native'

const primaryColor = '#159DFF'

export const Theme = {
  light: {
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      primary: primaryColor
    }
  },
  dark: {
    ...DarkTheme,
    colors: {
      ...DarkTheme.colors,
      primary: primaryColor
    }
  },
}

// const tintColorLight = '#0a7ea4'
// const tintColorDark = '#fff'
//
// export const Colors = {
//   light: {
//     text: '#11181C',
//     background: '#fff',
//     tint: tintColorLight,
//     icon: '#687076',
//     tabIconDefault: '#687076',
//     tabIconSelected: tintColorLight,
//   },
//   dark: {
//     text: '#ECEDEE',
//     background: '#151718',
//     tint: tintColorDark,
//     icon: '#9BA1A6',
//     tabIconDefault: '#9BA1A6',
//     tabIconSelected: tintColorDark,
//   },
// };
