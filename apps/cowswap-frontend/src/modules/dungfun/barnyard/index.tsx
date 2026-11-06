import { ReactNode } from 'react'

import barnyardUrl from './barnyard-background.svg?url'

import '../styles/dung.css'

/**
 * The dung.fun barnyard, painted behind the whole app.
 * The SVG is self-contained (cel-shaded cows, pig, steam, flies, lantern)
 * and is rendered as an <img> so its CSS animations stay isolated.
 */
export function BarnyardBackground(): ReactNode {
  return (
    <div className="dung-barnyard-bg" aria-hidden="true">
      <img src={barnyardUrl} alt="" />
      <div className="dung-barnyard-veil" />
    </div>
  )
}
