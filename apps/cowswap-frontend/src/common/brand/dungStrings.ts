import type { Messages } from '@lingui/core'

import { compileMessage } from '@lingui/message-utils/compileMessage'
import { generateMessageId } from '@lingui/message-utils/generateMessageId'

/**
 * dung.fun brand overrides for the en-US catalog, keyed by the original msgid.
 * Values support ICU placeholders just like real catalog messages.
 * Keep this map as the only place where dung copy replaces upstream strings:
 * the .po catalogs must stay identical to upstream for merge-friendliness.
 */
const DUNG_MESSAGE_OVERRIDES: Record<string, string> = {
  'CoW Swap | The smartest way to trade cryptocurrencies': 'DUNG.FUN | THE #2 DEX IN DEFI',
  Swap: 'Scoop',
  'Trade tokens': 'Spread your pile',
  Limit: 'Stash',
  'Limit order': 'Stash order',
  'Set your own price': 'Wait for a ripe price',
  TWAP: 'Trickler',
  'Place orders with a time-weighted average price': 'Trickle your pile over time',
  'Connect wallet': 'Hitch wallet',
  'Connect Wallet': 'Hitch wallet',
  'Connect a wallet': 'Hitch a wallet',
  'Connecting...': 'Hitching...',
  'Wallet not connected': 'Wallet not hitched',
  'Enter an amount': 'Enter a load',
  'Confirm Swap': 'Confirm Scoop',
  'Swap anyway': 'Scoop anyway',
  'Order type': 'Haul type',
  'Select a token': 'Pick a crop',
  'Select token': 'Pick crop',
  Sell: 'Dump',
  Buy: 'Haul',
  From: 'From pile',
  To: 'To bucket',
  'You sell': 'You dump',
  Trade: 'Haul',
  Recipient: 'Deliver to',
  Surplus: 'Extra scoop',
  'Max. swap slippage': 'Max. spillage',
  'Order expires in': 'Order goes to seed in',
  "You don't have any orders at the moment.": 'The wheelbarrow is empty — no orders yet.',
}

export function applyDungStringOverrides(messages: Messages): Messages {
  const overridden = { ...messages }
  const misses: string[] = []

  for (const [msgid, replacement] of Object.entries(DUNG_MESSAGE_OVERRIDES)) {
    const key = generateMessageId(msgid)
    if (key in overridden) {
      overridden[key] = compileMessage(replacement)
    } else {
      misses.push(msgid)
    }
  }

  if (misses.length) {
    console.warn(
      '[dung.fun] catalog overrides no longer match upstream msgids (rename or remove them):',
      misses.join(' | '),
    )
  }

  return overridden
}
