import { JSX, useEffect, useRef } from 'react'

import { finishHaul, runHaulAnimation, scaleStage } from './haulAnimation'

import type { HaulInfo } from './haulAnimation'

import '../styles/dung.css'

interface HaulOverlayProps {
  haul: HaulInfo | null
  onDone: () => void
}

export function HaulOverlay({ haul, onDone }: HaulOverlayProps): JSX.Element {
  const overlayRef = useRef<HTMLDivElement | null>(null)
  const stageWrapRef = useRef<HTMLDivElement | null>(null)
  const batchNoteRef = useRef<HTMLDivElement | null>(null)
  const shovelRef = useRef<HTMLDivElement | null>(null)
  const fillSellRef = useRef<HTMLDivElement | null>(null)
  const fillBuyRef = useRef<HTMLDivElement | null>(null)
  const labelSellRef = useRef<HTMLDivElement | null>(null)
  const labelBuyRef = useRef<HTMLDivElement | null>(null)
  const fallHostRef = useRef<HTMLDivElement | null>(null)
  const poofRef = useRef<HTMLDivElement | null>(null)
  const onDoneRef = useRef(onDone)

  useEffect(() => {
    onDoneRef.current = onDone
  }, [onDone])

  useEffect(() => {
    const overlay = overlayRef.current
    const stageWrap = stageWrapRef.current
    const batchNote = batchNoteRef.current
    const shovel = shovelRef.current
    const fillSell = fillSellRef.current
    const fillBuy = fillBuyRef.current
    const labelSell = labelSellRef.current
    const labelBuy = labelBuyRef.current
    const fallHost = fallHostRef.current
    const poof = poofRef.current
    if (
      !haul ||
      !overlay ||
      !stageWrap ||
      !batchNote ||
      !shovel ||
      !fillSell ||
      !fillBuy ||
      !labelSell ||
      !labelBuy ||
      !fallHost ||
      !poof
    ) {
      return
    }

    let cancelled = false
    const isCancelled = (): boolean => cancelled
    scaleStage(stageWrap)
    overlay.classList.remove('fade', 'dung-hidden')

    void runHaulAnimation(
      { batchNote, shovel, fillSell, fillBuy, labelSell, labelBuy, fallHost, poof },
      haul,
      isCancelled,
    ).then(() => {
      if (!cancelled) finishHaul(overlay, isCancelled, onDoneRef.current)
    })

    return () => {
      cancelled = true
    }
  }, [haul])

  return (
    <div className="overlay dung-scope dung-hidden" ref={overlayRef}>
      <div className="dung-stage-wrap" ref={stageWrapRef}>
        <div className="dung-stage">
          <div className="dung-batch-note" ref={batchNoteRef}>
            Batch #420 — spreading…
          </div>
          <div className="dung-ground" />
          <div className="dung-bucket">
            <div className="dung-bucket-body">
              <div className="dung-bucket-fill" ref={fillSellRef} />
            </div>
            <div className="dung-bucket-rim" />
            <div className="dung-bucket-label" ref={labelSellRef}>
              PILE
            </div>
          </div>
          <div className="dung-bucket dung-bucket-right">
            <div className="dung-bucket-body">
              <div className="dung-bucket-fill" ref={fillBuyRef} />
            </div>
            <div className="dung-bucket-rim" />
            <div className="dung-bucket-label" ref={labelBuyRef}>
              DUNG
            </div>
            <div className="dung-fall-host" ref={fallHostRef} />
            <div className="dung-poof" ref={poofRef}>
              💨
            </div>
          </div>
          <div className="dung-shovel" ref={shovelRef}>
            <ShovelSvg />
            <div className="dung-cargo dung-cargo-1" />
            <div className="dung-cargo dung-cargo-2" />
            <div className="dung-cargo dung-cargo-3" />
          </div>
          <div className="dung-fly dung-fly-1">🪰</div>
          <div className="dung-fly dung-fly-2">🪰</div>
        </div>
      </div>
    </div>
  )
}

function ShovelSvg(): JSX.Element {
  return (
    <svg viewBox="0 0 46 140" width="46" height="140" aria-hidden="true">
      <rect x="20" y="4" width="6" height="84" rx="3" fill="#8a5a2b" />
      <rect x="17" y="2" width="12" height="8" rx="3" fill="#6d4522" />
      <rect x="15" y="84" width="16" height="6" rx="2" fill="#4d4d4d" />
      <path d="M6 90 H40 L36 122 Q23 134 10 122 Z" fill="#aeb6bf" />
      <path d="M6 90 H40 L39 97 H7 Z" fill="#8d97a1" />
    </svg>
  )
}
