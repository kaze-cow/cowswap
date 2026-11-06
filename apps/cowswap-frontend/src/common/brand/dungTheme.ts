import type { Colors } from '@cowprotocol/ui'

/**
 * dung.fun palette overrides applied on top of baseTheme('dark').
 * Keys without an override inherit the CoW dark-mode defaults.
 */
export const DUNG_THEME_COLORS: Partial<Colors> = {
  primary: '#e3a83c',
  background: '#160e07',
  paper: '#20140a',
  paperCustom: '#2b1b0e',
  paperDarkerCustom: '#1a1109',
  paperDarkestCustom: '#120b05',
  buttonTextCustom: '#241503',
  text: '#f5ecd9',
  text1: '#f5ecd9',
  text4: '#cdb894',
  disabledText: '#9d8a6b',
  border: '#5a3b1e',
  border2: '#3b2613',
  disabled: '#3b2613',
  bg2: '#2b1b0e',
  bg3: '#160e07',
  bg5: '#0f0904',
  bg8: '#33200f',
  blueShade: '#1a1109',
  blueShade3: '#120b05',
  blue1: '#2b1b0e',
  blue2: '#33200f',
  danger: '#d06830',
  alert: '#e0763d',
  warning: '#e3a83c',
  success: '#8bb84f',
  green1: '#8bb84f',
}
