import { ReactNode } from 'react'

import { isInjectedWidget } from '@cowprotocol/common-utils'
import { CowLoadingIcon } from '@cowprotocol/ui'

import { DungLoadingIcon } from 'common/brand/dungLoadingIcon'

import * as styledEl from './styled'

// dung.fun icon module is dead-code-eliminated from cowswap builds by the brand define
const isDungfun = process.env['REACT_APP_BRAND'] === 'dungfun'

export interface CurrencyArrowSeparatorProps {
  isLoading: boolean
  disabled?: boolean
  hasSeparatorLine?: boolean
  isCollapsed?: boolean
  isDarkMode?: boolean
  onSwitchTokens(): void
}

export function CurrencyArrowSeparator({
  isLoading,
  onSwitchTokens,
  isCollapsed = true,
  hasSeparatorLine,
  disabled = false,
  isDarkMode = false,
}: CurrencyArrowSeparatorProps): ReactNode {
  const isInjectedWidgetMode = isInjectedWidget()

  return (
    <styledEl.Box
      id="currency-arrow-separator"
      data-isLoading={isLoading ? true : undefined}
      isCollapsed={isCollapsed}
      hasSeparatorLine={hasSeparatorLine}
    >
      <styledEl.LoadingWrapper type="button" $isLoading={isLoading} disabled={disabled} onClick={onSwitchTokens}>
        {!isInjectedWidgetMode && isLoading ? (
          isDungfun ? (
            <DungLoadingIcon size={26} />
          ) : (
            <CowLoadingIcon size={26} isDarkMode={isDarkMode} />
          )
        ) : (
          <styledEl.ArrowDownIcon disabled={disabled} />
        )}
      </styledEl.LoadingWrapper>
    </styledEl.Box>
  )
}
