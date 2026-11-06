import { isInjectedWidget } from '@cowprotocol/common-utils'

import { isDungfunBrand } from 'common/brand/brand.constants'

export function useShouldShowAffiliateTraderHeaderButton(): boolean {
  return !isInjectedWidget() && !isDungfunBrand()
}
