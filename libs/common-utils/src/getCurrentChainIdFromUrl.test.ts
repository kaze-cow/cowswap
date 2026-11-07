import { SupportedChainId } from '@cowprotocol/cow-sdk'

import { getCurrentChainIdFromUrl } from './getCurrentChainIdFromUrl'

describe('getCurrentChainIdFromUrl()', () => {
  it('When chainId presents in the url path, then it should taken as chainId', () => {
    const chainId = getCurrentChainIdFromUrl({
      hash: '#/11155111/WETH',
    } as Location)

    expect(chainId).toBe(SupportedChainId.SEPOLIA)
  })

  it('When chainId from the url path is not valid, then should take mainnet as default', () => {
    const chainId = getCurrentChainIdFromUrl({
      hash: '#/999/WETH',
    } as Location)

    expect(chainId).toBe(SupportedChainId.MAINNET)
  })

  it('When chainId from the url path is Robinhood, then it should taken as chainId', () => {
    const chainId = getCurrentChainIdFromUrl({
      hash: `#/${SupportedChainId.ROBINHOOD}/WETH`,
    } as Location)

    expect(chainId).toBe(SupportedChainId.ROBINHOOD)
  })

  it('When network name presents in the url query, then it should taken as chainId', () => {
    const chainId = getCurrentChainIdFromUrl({
      hash: '#/WETH?chain=gnosis_chain',
    } as Location)

    expect(chainId).toBe(SupportedChainId.GNOSIS_CHAIN)
  })

  it('When network name from the url query is not valid, then should take mainnet as default', () => {
    const chainId = getCurrentChainIdFromUrl({
      hash: '#/WETH?chain=blabla',
    } as Location)

    expect(chainId).toBe(SupportedChainId.MAINNET)
  })
})

describe('getCurrentChainIdFromUrl() brand fallback', () => {
  const brand = process.env.REACT_APP_BRAND

  afterEach(() => {
    jest.resetModules()

    if (typeof brand === 'undefined') {
      delete process.env.REACT_APP_BRAND
    } else {
      process.env.REACT_APP_BRAND = brand
    }
  })

  it('When url has no chain and brand is not dungfun, then falls back to mainnet', async () => {
    delete process.env.REACT_APP_BRAND
    jest.resetModules()

    const { getCurrentChainIdFromUrl: get } = await import('./getCurrentChainIdFromUrl')

    expect(get({ hash: '#/swap' } as Location)).toBe(SupportedChainId.MAINNET)
  })

  it('When url has no chain and brand is dungfun, then falls back to solana', async () => {
    process.env.REACT_APP_BRAND = 'dungfun'
    jest.resetModules()

    const { getCurrentChainIdFromUrl: get } = await import('./getCurrentChainIdFromUrl')

    expect(get({ hash: '#/swap' } as Location)).toBe(SupportedChainId.SOLANA)
  })

  it('When url has an explicit chain, then the brand fallback does not apply', async () => {
    process.env.REACT_APP_BRAND = 'dungfun'
    jest.resetModules()

    const { getCurrentChainIdFromUrl: get } = await import('./getCurrentChainIdFromUrl')

    expect(get({ hash: '#/1/WETH' } as Location)).toBe(SupportedChainId.MAINNET)
  })
})
