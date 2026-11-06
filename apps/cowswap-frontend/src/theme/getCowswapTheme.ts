// These values are static and don't change during runtime
import { isIframe, isInjectedWidget } from '@cowprotocol/common-utils'
import { baseTheme } from '@cowprotocol/ui'

import { CoWSwapTheme } from 'styled-components'

import { isDungfunBrand } from 'common/brand/brand.constants'
import { DUNG_THEME_COLORS } from 'common/brand/dungTheme'

const isWidget = isInjectedWidget()
const widgetMode = {
  isWidget,
  isIframe: isIframe(),
}

export function getCowswapTheme(darkmode: boolean): CoWSwapTheme {
  if (isDungfunBrand()) {
    return {
      ...baseTheme('dark'),
      ...DUNG_THEME_COLORS,
      ...widgetMode,
    }
  }

  return {
    ...baseTheme(darkmode ? 'dark' : 'light'),
    ...widgetMode,
  }
}
