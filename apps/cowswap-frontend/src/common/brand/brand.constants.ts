export type AppBrand = 'cowswap' | 'dungfun'

export const BRAND: AppBrand = process.env['REACT_APP_BRAND'] === 'dungfun' ? 'dungfun' : 'cowswap'

export function isDungfunBrand(): boolean {
  return BRAND === 'dungfun'
}
