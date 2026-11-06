import { ReactNode } from 'react'

import { MessageDescriptor } from '@lingui/core'

import { ACCOUNT_PROXY_LABEL } from '@cowprotocol/common-const'
import { useExtractText } from '@cowprotocol/common-utils'
import { isEvmChain, SupportedChainId } from '@cowprotocol/cow-sdk'
import { useWalletInfo } from '@cowprotocol/wallet'

import { msg } from '@lingui/core/macro'
import { NavLink } from 'react-router'

import { SideMenu } from 'legacy/components/SideMenu'

import { getProxyAccountUrl } from 'modules/accountProxy'

import { isDungfunBrand } from 'common/brand/brand.constants'
import { Routes } from 'common/constants/routes'

interface MenuItem {
  title: string | MessageDescriptor
  url: string
}

const ACCOUNT_MENU_LINKS = (chainId: SupportedChainId): MenuItem[] => {
  const links: MenuItem[] = [
    { title: msg`Overview`, url: '/account' },
    { title: msg`Affiliate`, url: Routes.ACCOUNT_AFFILIATE_PARTNER },
    { title: msg`My Rewards`, url: Routes.ACCOUNT_AFFILIATE_TRADER },
    { title: msg`Tokens`, url: '/account/tokens' },
    ...(isEvmChain(chainId) ? [{ title: ACCOUNT_PROXY_LABEL, url: getProxyAccountUrl(chainId) }] : []),
  ]

  return isDungfunBrand()
    ? links.filter(({ url }) => url !== Routes.ACCOUNT_AFFILIATE_PARTNER && url !== Routes.ACCOUNT_AFFILIATE_TRADER)
    : links
}

export function AccountMenu(): ReactNode {
  const { chainId } = useWalletInfo()
  const { extractTextFromStringOrI18nDescriptor } = useExtractText()

  return (
    <SideMenu longList>
      <ul>
        {ACCOUNT_MENU_LINKS(chainId).map(({ title, url }) => (
          <li key={url}>
            <NavLink end={url === '/account'} to={url} className={({ isActive }) => (isActive ? 'active' : undefined)}>
              {extractTextFromStringOrI18nDescriptor(title)}
            </NavLink>
          </li>
        ))}
      </ul>
    </SideMenu>
  )
}
