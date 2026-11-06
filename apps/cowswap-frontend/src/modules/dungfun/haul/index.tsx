import { ReactNode, useEffect, useRef, useState } from 'react'

import { UiOrderType } from '@cowprotocol/types'

import { OrderStatusEvents, ORDER_STATUS_EVENT_EMITTER } from 'modules/orders'
import type {
  OnCancelledOrderPayload,
  OnExpiredOrderPayload,
  OnFulfilledOrderPayload,
  OnPostedOrderPayload,
  OrderStatusEventListener,
} from 'modules/orders'

import { HaulOverlay } from './HaulOverlay'

import { FarmhandsRaceOverlay } from '../farmhands'
import { dungSounds } from '../lib/dungSounds'

import type { HaulInfo } from './haulAnimation'

import '../styles/dung.css'

interface PendingHaulInfo extends HaulInfo {
  orderUid: string
}

/**
 * dung.fun order lifecycle theatre:
 * - posted → farmhands race while the order is in flight
 * - filled → the shovel haul animation with the real sell/buy symbols on the buckets
 * - cancelled/expired → a sad trombone and back to the field
 */
export function DungfunHaulOverlay(): ReactNode {
  const [haul, setHaul] = useState<HaulInfo | null>(null)
  const [raceActive, setRaceActive] = useState(false)
  const pendingRef = useRef<PendingHaulInfo | null>(null)

  useEffect(() => {
    const listeners: OrderStatusEventListener[] = [
      {
        event: OrderStatusEvents.ON_POSTED_ORDER,
        handler(payload: OnPostedOrderPayload): void {
          dungSounds.scrape(0.16, 0.08)
          pendingRef.current = {
            orderUid: payload.orderDetails.orderUid,
            sellSymbol: payload.orderDetails.inputToken.symbol || 'PILE',
            buySymbol: payload.orderDetails.outputToken.symbol || 'DUNG',
          }
          // limit/twap orders can sit open for a long time — the race is only for in-flight market hauls
          if (payload.orderDetails.orderType === UiOrderType.SWAP) {
            setRaceActive(true)
          }
        },
      },
      {
        event: OrderStatusEvents.ON_FULFILLED_ORDER,
        handler(payload: OnFulfilledOrderPayload): void {
          const pending = pendingRef.current
          pendingRef.current = null
          setRaceActive(false)
          if (pending && pending.orderUid === payload.order.uid) {
            setHaul({ sellSymbol: pending.sellSymbol, buySymbol: pending.buySymbol })
          } else {
            setHaul({ sellSymbol: 'MANURE', buySymbol: 'CROPS' })
          }
        },
      },
      {
        event: OrderStatusEvents.ON_CANCELLED_ORDER,
        handler(_payload: OnCancelledOrderPayload): void {
          pendingRef.current = null
          setRaceActive(false)
          dungSounds.sad()
        },
      },
      {
        event: OrderStatusEvents.ON_EXPIRED_ORDER,
        handler(_payload: OnExpiredOrderPayload): void {
          pendingRef.current = null
          setRaceActive(false)
          dungSounds.sad()
        },
      },
    ]

    listeners.forEach((listener) => ORDER_STATUS_EVENT_EMITTER.on(listener))
    return () => {
      listeners.forEach((listener) => ORDER_STATUS_EVENT_EMITTER.off(listener))
    }
  }, [])

  return (
    <>
      <FarmhandsRaceOverlay active={raceActive} />
      <HaulOverlay haul={haul} onDone={() => setHaul(null)} />
    </>
  )
}
