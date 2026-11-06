import { JSX, ReactNode, useEffect, useRef, useState } from 'react'
import type { MutableRefObject } from 'react'

import { dungSounds } from '../lib/dungSounds'

import '../styles/dung.css'

const FARMHAND_NAMES: { name: string; hue: number }[] = [
  { name: 'Butterchurn Prime', hue: 0 },
  { name: 'Kernel Sanders', hue: 70 },
  { name: 'Barn Owl DAO', hue: 140 },
  { name: 'Milky Whey', hue: 200 },
  { name: 'Green Acres Quant', hue: 260 },
  { name: 'Two Chickens In A Trenchcoat', hue: 310 },
]

interface Racer {
  name: string
  hue: number
  progress: number
  speed: number
}

const rand = (min: number, max: number): number => min + Math.random() * (max - min)

type ElsRef = MutableRefObject<(HTMLSpanElement | null)[]>

interface FarmhandsRaceOverlayProps {
  active: boolean
}

/**
 * Shown while a haul (order) is in flight: the farmhands race to spread your pile.
 * Disappears as soon as the order is filled, cancelled or expired.
 */
export function FarmhandsRaceOverlay({ active }: FarmhandsRaceOverlayProps): ReactNode {
  const [racers] = useState<Racer[]>(buildRacers)
  const tractorEls = useRef<(HTMLSpanElement | null)[]>([])

  useRaceLoop(racers, tractorEls, active)

  if (!active) return null

  return (
    <div className="dung-race-overlay dung-scope" role="status">
      <div className="dung-race-stage">
        <p className="dung-race-title">🚜 farmhands are racing to spread your pile…</p>
        <RaceLanes racers={racers} tractorEls={tractorEls} />
        <p className="dung-race-note">the winner hauls your dung — hold your shovel</p>
      </div>
    </div>
  )
}

function buildRacers(): Racer[] {
  return FARMHAND_NAMES.map(({ name, hue }) => ({ name, hue, progress: 0, speed: rand(0.06, 0.13) }))
}

function RaceLanes({ racers, tractorEls }: { racers: Racer[]; tractorEls: ElsRef }): JSX.Element {
  return (
    <div className="dung-track">
      {racers.map((r, i) => (
        <div className="dung-lane" key={r.name}>
          <div className="dung-lane-info">
            <b>{r.name}</b>
          </div>
          <div className="dung-lane-track">
            <span
              className="dung-tractor"
              style={{ filter: `hue-rotate(${r.hue}deg) saturate(1.3)` }}
              ref={(el) => {
                if (tractorEls.current) tractorEls.current[i] = el
              }}
            >
              🚜
            </span>
            <span className="dung-finish">🏁</span>
          </div>
        </div>
      ))}
    </div>
  )
}

function useRaceLoop(racers: Racer[], tractorEls: ElsRef, active: boolean): void {
  useEffect(() => {
    if (!active) return

    let raf = 0
    let last = performance.now()
    let pausedAt = 0

    const step = (now: number): void => {
      const dt = Math.min(0.05, (now - last) / 1000)
      last = now

      if (pausedAt && now - pausedAt > 2600) {
        pausedAt = 0
        racers.forEach((r, i) => {
          r.progress = 0
          r.speed = rand(0.06, 0.13)
          const el = tractorEls.current[i]
          if (el) el.style.left = '2%'
        })
      }

      if (!pausedAt) {
        let winner: Racer | null = null
        for (let i = 0; i < racers.length; i++) {
          const r = racers[i]
          if (Math.random() < 0.01) r.speed = Math.min(0.15, Math.max(0.05, r.speed + rand(-0.02, 0.02)))
          r.progress += r.speed * dt
          const el = tractorEls.current[i]
          if (el) el.style.left = `${2 + Math.min(1, r.progress) * 80}%`
          if (r.progress >= 1 && !winner) winner = r
        }
        if (winner) {
          pausedAt = now
          dungSounds.win()
        }
      }

      raf = requestAnimationFrame(step)
    }

    raf = requestAnimationFrame(step)
    return () => cancelAnimationFrame(raf)
  }, [racers, tractorEls, active])
}
