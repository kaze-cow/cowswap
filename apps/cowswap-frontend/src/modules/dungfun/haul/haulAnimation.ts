import { dungSounds } from '../lib/dungSounds'

export interface HaulInfo {
  sellSymbol: string
  buySymbol: string
}

const HOME = 'translateX(0px) translateY(0px) rotate(0deg)'
const AT_LEFT = 'translateX(-150px) translateY(-34px) rotate(22deg)'
const DIPPED = 'translateX(-152px) translateY(26px) rotate(40deg)'
const LIFTED = 'translateX(-148px) translateY(-48px) rotate(14deg)'
const MID_AIR = 'translateX(140px) translateY(-120px) rotate(2deg)'
const AT_RIGHT = 'translateX(174px) translateY(-44px) rotate(8deg)'
const TIPPED = 'translateX(174px) translateY(-44px) rotate(-64deg)'

const wait = (ms: number): Promise<void> => new Promise((resolve) => setTimeout(resolve, ms))
const finished = (animation: Animation): Promise<Animation | undefined> => animation.finished.catch(() => undefined)

export interface HaulRefs {
  batchNote: HTMLDivElement
  shovel: HTMLDivElement
  fillSell: HTMLDivElement
  fillBuy: HTMLDivElement
  labelSell: HTMLDivElement
  labelBuy: HTMLDivElement
  fallHost: HTMLDivElement
  poof: HTMLDivElement
}

export function finishHaul(overlay: HTMLDivElement, isCancelled: () => boolean, onDone: () => void): void {
  overlay.classList.add('fade')
  window.setTimeout(() => {
    if (isCancelled()) return
    overlay.classList.add('dung-hidden')
    overlay.classList.remove('fade')
    onDone()
  }, 360)
}

export async function runHaulAnimation(refs: HaulRefs, haul: HaulInfo, isCancelled: () => boolean): Promise<void> {
  const { shovel, batchNote, fillSell, fillBuy, labelSell, labelBuy, fallHost } = refs
  shovel.getAnimations().forEach((a) => a.cancel())
  labelSell.textContent = shortSymbol(haul.sellSymbol)
  labelBuy.textContent = shortSymbol(haul.buySymbol)
  labelBuy.classList.remove('bounce')
  fillSell.style.height = '68%'
  fillBuy.style.height = '5%'
  fallHost.innerHTML = ''
  batchNote.classList.remove('done')
  batchNote.textContent = `Batch #${400 + Math.floor(Math.random() * 99)} — spreading…`

  await wait(700)
  if (isCancelled()) return
  if (!(await scoopPhase(shovel, fillSell, isCancelled))) return
  await finished(
    shovel.animate([{ transform: LIFTED }, { transform: MID_AIR, offset: 0.5 }, { transform: AT_RIGHT }], {
      duration: 720,
      easing: 'ease-in-out',
      fill: 'forwards',
    }),
  )
  if (isCancelled()) return
  if (!(await dumpPhase(refs, isCancelled))) return

  batchNote.textContent = 'Haul complete! 🪣'
  batchNote.classList.add('done')
  dungSounds.jingle()
  await wait(800)
}

export function scaleStage(stageWrap: HTMLDivElement): void {
  const scale = Math.min(1, (window.innerWidth - 32) / 540)
  stageWrap.style.transform = `scale(${scale})`
}

async function dumpPhase(refs: HaulRefs, isCancelled: () => boolean): Promise<boolean> {
  const { shovel, fillBuy, labelBuy, fallHost, poof } = refs
  await finished(
    shovel.animate([{ transform: AT_RIGHT }, { transform: TIPPED }], {
      duration: 320,
      easing: 'ease-in',
      fill: 'forwards',
    }),
  )
  if (isCancelled()) return false

  shovel.querySelectorAll('.dung-cargo').forEach((c) => c.classList.remove('show'))
  for (let i = 0; i < 4; i++) {
    window.setTimeout(() => {
      spawnFallBlob(fallHost)
      dungSounds.plop(1 + i * 0.15)
      if (i === 0) {
        poof.classList.remove('pop')
        void poof.offsetWidth
        poof.classList.add('pop')
      }
    }, i * 120)
  }
  window.setTimeout(() => {
    fillBuy.style.height = '41%'
    labelBuy.classList.remove('bounce')
    void labelBuy.offsetWidth
    labelBuy.classList.add('bounce')
  }, 380)

  await wait(700)
  if (isCancelled()) return false
  dungSounds.scrape(0.16, 0.08)
  await finished(
    shovel.animate([{ transform: TIPPED }, { transform: MID_AIR }, { transform: HOME }], {
      duration: 560,
      easing: 'ease-in-out',
      fill: 'forwards',
    }),
  )
  return !isCancelled()
}

async function scoopPhase(
  shovel: HTMLDivElement,
  fillSell: HTMLDivElement,
  isCancelled: () => boolean,
): Promise<boolean> {
  await finished(
    shovel.animate([{ transform: HOME }, { transform: AT_LEFT }], {
      duration: 420,
      easing: 'ease-in-out',
      fill: 'forwards',
    }),
  )
  if (isCancelled()) return false
  dungSounds.scrape()
  await finished(
    shovel.animate([{ transform: AT_LEFT }, { transform: DIPPED }], {
      duration: 300,
      easing: 'ease-in',
      fill: 'forwards',
    }),
  )
  if (isCancelled()) return false
  shovel.querySelectorAll('.dung-cargo').forEach((c) => c.classList.add('show'))
  fillSell.style.height = '42%'
  await wait(200)
  if (isCancelled()) return false
  await finished(
    shovel.animate([{ transform: DIPPED }, { transform: LIFTED }], {
      duration: 280,
      easing: 'ease-out',
      fill: 'forwards',
    }),
  )
  return !isCancelled()
}

function shortSymbol(symbol: string): string {
  return symbol.length > 7 ? `${symbol.slice(0, 6)}…` : symbol
}

function spawnFallBlob(host: HTMLDivElement): void {
  const blob = document.createElement('div')
  blob.className = 'dung-fall-blob'
  blob.style.left = `${16 + Math.random() * 62}px`
  host.appendChild(blob)
  window.setTimeout(() => blob.remove(), 450)
}
