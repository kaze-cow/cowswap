const TOKENS = {
  DUNG: { emoji: '💩', name: 'Manure', price: 6.9 },
  HAY: { emoji: '🌾', name: 'Hay', price: 4.2 },
  CORN: { emoji: '🌽', name: 'Corn', price: 0.69 },
  MILK: { emoji: '🥛', name: 'Milk', price: 1.33 },
  TRAC: { emoji: '🚜', name: 'Tractor', price: 42 },
  GOAT: { emoji: '🐐', name: 'Goat', price: 13.7 },
}

const ERRORS = [
  {
    code: '400',
    kind: 'http',
    field: 'Bad Seed',
    real: '400 Bad Request',
    fix: 'Order malformed — check the manure schema and re-plant.',
  },
  {
    code: '401',
    kind: 'http',
    field: 'Wrong Farmer',
    real: '401 Unauthorized',
    fix: 'Signature mismatch. That pitchfork is not yours.',
  },
  {
    code: '402',
    kind: 'http',
    field: 'Cream Required',
    real: '402 Payment Required',
    fix: "The farmhands don't work for free — fund the tip jar.",
  },
  {
    code: '404',
    kind: 'http',
    field: 'Bale Not Found',
    real: '404 Not Found',
    fix: 'Order not found in the barn. It may have composted.',
  },
  {
    code: '408',
    kind: 'http',
    field: 'Cow Stared Into Distance',
    real: '408 Request Timeout',
    fix: 'Request timed out. The tractor is warming up — retry.',
  },
  {
    code: '410',
    kind: 'http',
    field: 'Went To Seed',
    real: '410 Gone',
    fix: 'This order expired and flowered. Nothing left to harvest.',
  },
  {
    code: '429',
    kind: 'http',
    field: 'Too Many Flies',
    real: '429 Too Many Requests',
    fix: 'Rate limit reached. Let the flies settle, then retry with backoff.',
  },
  {
    code: '500',
    kind: 'http',
    field: 'Tractor Backfire',
    real: '500 Internal Server Error',
    fix: 'Something broke in the barn. Farmhands dispatched with wrenches.',
  },
  {
    code: '502',
    kind: 'http',
    field: 'Gate Hinge Squeaks',
    real: '502 Bad Gateway',
    fix: 'Upstream gate is stuck. Retry idempotently in a moment.',
  },
  {
    code: '503',
    kind: 'http',
    field: 'Out Of Fuel',
    real: '503 Service Unavailable',
    fix: 'The tractor is dry. Chores paused — back after the refill.',
  },
  {
    code: '504',
    kind: 'http',
    field: 'Horse Asleep',
    real: '504 Gateway Timeout',
    fix: 'Upstream never answered. The horse is napping; retry once it wakes.',
  },
  {
    code: 'E1',
    kind: 'order',
    field: 'Wheelbarrow Empty',
    real: 'INSUFFICIENT_BALANCE',
    fix: 'Not enough in the pile for this haul.',
  },
  {
    code: 'E2',
    kind: 'order',
    field: 'Gate Not Opened',
    real: 'INSUFFICIENT_ALLOWANCE',
    fix: 'Approve the farmhands to cart your pile first.',
  },
  {
    code: 'E3',
    kind: 'order',
    field: 'Farmer Slammed The Gate',
    real: 'USER_REJECTED',
    fix: 'You rejected the signature. The pigs are disappointed in you.',
  },
  {
    code: 'E4',
    kind: 'order',
    field: 'Spillage Detected',
    real: 'SLIPPAGE_CHECK_FAILED',
    fix: 'Price moved more than your tolerance. Nothing was dumped.',
  },
  {
    code: 'E5',
    kind: 'order',
    field: 'Fox Spotted',
    real: 'MEV_DETECTED',
    fix: 'Sandwich attempt detected. The fence handled it. ⚡ Nothing spilled.',
  },
  {
    code: 'E6',
    kind: 'order',
    field: 'Wrong Wagon',
    real: 'BATCH_NOT_FOUND',
    fix: 'That batch already left for the fields.',
  },
  {
    code: 'E7',
    kind: 'order',
    field: "Tractor Won't Start",
    real: 'GAS_ESTIMATION_FAILED',
    fix: 'Estimation reverted under the hood. Check your load and try again.',
  },
  {
    code: 'E8',
    kind: 'order',
    field: 'Seed Order Wrong',
    real: 'NONCE_TOO_LOW',
    fix: 'That seed was already planted. Bump the nonce and re-sow.',
  },
  {
    code: 'E9',
    kind: 'order',
    field: 'Farmhands On Strike',
    real: 'NO_SOLVER_BIDS',
    fix: 'No farmhands bid on this batch. They want better hay. Try the next one.',
  },
]

const FAIL_POOL = ['E4', 'E5', '503', '504', '429']

const FARMHANDS = [
  { name: 'Butterchurn Prime', hue: 0 },
  { name: 'Kernel Sanders', hue: 70 },
  { name: 'Barn Owl DAO', hue: 140 },
  { name: 'Milky Whey', hue: 200 },
  { name: 'Green Acres Quant', hue: 260 },
  { name: 'Two Chickens In A Trenchcoat', hue: 310 },
]

const TICKERS = {
  fence:
    'BREAKING: local fox attempts sandwich attack on a fresh pile — gets absolutely cooked ⚡ fence holding steady at 10,000 V',
  herd: 'HERDING DAY: orders gently guided into batch trucks — no order left behind, no gas spent 🐖',
  bars: 'PLEASE STAND BY · dung.fun engineering is spreading a fresh batch · we now return you to your regularly scheduled manure',
}

const state = {
  connected: false,
  address: '',
  sell: 'HAY',
  buy: 'DUNG',
  sellAmount: '',
  spillage: 0.5,
  sound: true,
  hauling: false,
  forceSafe: false,
  detailsOpen: true,
  balances: { HAY: 12504.2, CORN: 33333, MILK: 4206.9, DUNG: 0.042, TRAC: 0.5, GOAT: 3 },
}

const $ = (id) => document.getElementById(id)

const els = {
  walletBtn: $('walletBtn'),
  netBtn: $('netBtn'),
  soundToggle: $('soundToggle'),
  sellInput: $('sellInput'),
  sellTokenBtn: $('sellTokenBtn'),
  buyTokenBtn: $('buyTokenBtn'),
  sellBal: $('sellBal'),
  buyBal: $('buyBal'),
  buyOut: $('buyOut'),
  switchBtn: $('switchBtn'),
  ctaBtn: $('ctaBtn'),
  gearBtn: $('gearBtn'),
  settingsPanel: $('settingsPanel'),
  spillRow: $('spillRow'),
  detailsToggle: $('detailsToggle'),
  details: $('details'),
  detailsChev: $('detailsChev'),
  receipt: $('receipt'),
  toast: $('toast'),
  tokenMenu: $('tokenMenu'),
  overlay: $('haulOverlay'),
  stageWrap: $('stageWrap'),
  batchNote: $('batchNote'),
  fillSell: $('fillSell'),
  fillBuy: $('fillBuy'),
  labelSell: $('labelSell'),
  labelBuy: $('labelBuy'),
  fallHost: $('fallHost'),
  poof: $('poof'),
  shovel: $('shovel'),
  brand: $('brand'),
  brandMark: $('brandMark'),
  nav: $('nav'),
  poopRain: $('poopRain'),
  fenceChip: $('fenceChip'),
  farmChip: $('farmChip'),
  statLoads: $('statLoads'),
  statBatches: $('statBatches'),
  statScoops: $('statScoops'),
  statFoxes: $('statFoxes'),
  track: $('track'),
  raceBatchNum: $('raceBatchNum'),
  raceStatus: $('raceStatus'),
  raceWinner: $('raceWinner'),
  boardBody: $('boardBody'),
  sceneFence: $('sceneFence'),
  sceneHerd: $('sceneHerd'),
  sceneBars: $('sceneBars'),
  foxEl: $('foxEl'),
  fenceLine: $('fenceLine'),
  fencePile: $('fencePile'),
  zapBolt: $('zapBolt'),
  dizzyEl: $('dizzyEl'),
  tvFlash: $('tvFlash'),
  tickerInner: $('tickerInner'),
  simBtn: $('simBtn'),
  simOut: $('simOut'),
  almHttp: $('almHttp'),
  almOrder: $('almOrder'),
}

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms))
const rand = (min, max) => min + Math.random() * (max - min)
const pick = (arr) => arr[Math.floor(Math.random() * arr.length)]

function amount() {
  return parseFloat(state.sellAmount) || 0
}

function computeOut(amount) {
  return amount * rate() * (1 + surplusFor(amount) / 100)
}

function fmt(n) {
  if (!isFinite(n) || n <= 0) return '0'
  if (n >= 100000) return Math.round(n).toLocaleString('en-US')
  if (n >= 1000) return n.toLocaleString('en-US', { maximumFractionDigits: 2 })
  if (n >= 1) return trimNum(n, 4)
  return trimNum(n, 6)
}

function rate() {
  return TOKENS[state.sell].price / TOKENS[state.buy].price
}

function surplusFor(amount) {
  const s = String(amount)
  let h = 7
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) % 997
  return 0.05 + (h % 36) / 100
}

function trimNum(n, decimals) {
  const s = n.toFixed(decimals)
  return s.includes('.') ? s.replace(/0+$/, '').replace(/\.$/, '') : s
}

let toastTimer = null
function toast(msg) {
  els.toast.textContent = msg
  els.toast.classList.remove('hidden')
  clearTimeout(toastTimer)
  toastTimer = setTimeout(() => els.toast.classList.add('hidden'), 2600)
}

let actx = null
function audio() {
  if (!actx) actx = new (window.AudioContext || window.webkitAudioContext)()
  if (actx.state === 'suspended') actx.resume()
  return actx
}

function bounceLabel() {
  els.labelBuy.classList.remove('bounce')
  void els.labelBuy.offsetWidth
  els.labelBuy.classList.add('bounce')
}

function closeTokenMenu() {
  els.tokenMenu.classList.add('hidden')
}

function connectWallet() {
  state.connected = true
  const hex = Array.from(crypto.getRandomValues(new Uint8Array(4)))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('')
  state.address = `0x${hex.slice(0, 4).toUpperCase()}…${hex.slice(4).toUpperCase()}`
  els.walletBtn.textContent = state.address
  els.walletBtn.title = 'Hitched to the plow'
  toast('🚜 Wallet hitched. The farm awaits.')
}

function openTokenMenu(side, btn) {
  const other = side === 'sell' ? state.buy : state.sell
  const current = state[side]
  els.tokenMenu.innerHTML =
    `<p class="token-menu-title">${side === 'sell' ? 'Pick your pile' : 'Pick your bucket'}</p>` +
    Object.keys(TOKENS)
      .map((sym) => {
        const t = TOKENS[sym]
        return `<button class="token-item ${sym === current ? 'is-current' : ''}" data-sym="${sym}">
          <span class="ti-emoji">${t.emoji}</span>
          <span>${sym}</span>
          <span class="ti-name">${t.name}</span>
          <span class="ti-bal">${fmt(state.balances[sym])}</span>
        </button>`
      })
      .join('')
  els.tokenMenu.classList.remove('hidden')
  const rect = btn.getBoundingClientRect()
  const menuW = 260
  const left = Math.max(12, Math.min(rect.left, window.innerWidth - menuW - 12))
  els.tokenMenu.style.left = `${left}px`
  els.tokenMenu.style.top = `${rect.bottom + 8}px`
  els.tokenMenu.querySelectorAll('.token-item').forEach((item) => {
    item.addEventListener('click', () => {
      const sym = item.dataset.sym
      if (sym === other) {
        const prev = state[side]
        state[side] = sym
        if (side === 'sell') state.buy = prev
        else state.sell = prev
      } else {
        state[side] = sym
      }
      closeTokenMenu()
      renderAll()
    })
  })
}

function playBeep() {
  tone(1000, 1000, 0.12, 'sine', 0.07)
}

function playCrackle(dur = 0.12, vol = 0.18) {
  if (!state.sound) return
  const ctx = audio()
  const t = ctx.currentTime
  const buf = ctx.createBuffer(1, Math.floor(ctx.sampleRate * dur), ctx.sampleRate)
  const data = buf.getChannelData(0)
  for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1
  const src = ctx.createBufferSource()
  src.buffer = buf
  const hp = ctx.createBiquadFilter()
  hp.type = 'highpass'
  hp.frequency.setValueAtTime(1400, t)
  const g = ctx.createGain()
  g.gain.setValueAtTime(vol, t)
  g.gain.exponentialRampToValueAtTime(0.0001, t + dur)
  src.connect(hp).connect(g).connect(ctx.destination)
  src.start(t)
}

function playJingle() {
  if (!state.sound) return
  tone(392, 392, 0.14, 'triangle', 0.13, 0)
  tone(494, 494, 0.14, 'triangle', 0.13, 0.11)
  tone(587, 587, 0.2, 'triangle', 0.13, 0.22)
}

function playPlop(pitch = 1) {
  tone(210 * pitch, 55 * pitch, 0.14, 'sine', 0.35)
}

function playSad() {
  if (!state.sound) return
  tone(294, 294, 0.2, 'triangle', 0.11, 0)
  tone(233, 233, 0.32, 'triangle', 0.11, 0.22)
}

function playScrape(dur = 0.26, vol = 0.14) {
  if (!state.sound) return
  const ctx = audio()
  const t = ctx.currentTime
  const buf = ctx.createBuffer(1, Math.floor(ctx.sampleRate * dur), ctx.sampleRate)
  const data = buf.getChannelData(0)
  for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1
  const src = ctx.createBufferSource()
  src.buffer = buf
  const bp = ctx.createBiquadFilter()
  bp.type = 'bandpass'
  bp.Q.value = 1.2
  bp.frequency.setValueAtTime(320, t)
  bp.frequency.exponentialRampToValueAtTime(950, t + dur)
  const g = ctx.createGain()
  g.gain.setValueAtTime(0.0001, t)
  g.gain.exponentialRampToValueAtTime(vol, t + 0.04)
  g.gain.exponentialRampToValueAtTime(0.0001, t + dur)
  src.connect(bp).connect(g).connect(ctx.destination)
  src.start(t)
}

function playWin() {
  if (!state.sound) return
  tone(330, 330, 0.1, 'triangle', 0.12, 0)
  tone(415, 415, 0.1, 'triangle', 0.12, 0.09)
  tone(494, 494, 0.1, 'triangle', 0.12, 0.18)
  tone(660, 660, 0.22, 'triangle', 0.13, 0.3)
}

function playZap() {
  if (!state.sound) return
  tone(2600, 90, 0.1, 'square', 0.2)
  playCrackle(0.12, 0.16)
}

function popPoof() {
  els.poof.classList.remove('pop')
  void els.poof.offsetWidth
  els.poof.classList.add('pop')
}

function renderAll() {
  renderTokens()
  renderBalances()
  renderOutput()
  renderDetails()
  renderCta()
}

function renderBalances() {
  els.sellBal.textContent = fmt(state.balances[state.sell])
  els.buyBal.textContent = fmt(state.balances[state.buy])
}

function renderCta() {
  const btn = els.ctaBtn
  if (state.hauling) {
    btn.disabled = true
    btn.textContent = 'Farmhands are shoveling…'
    return
  }
  const amt = amount()
  if (!state.connected) {
    btn.disabled = false
    btn.textContent = 'Connect Wallet to Scoop'
  } else if (amt <= 0) {
    btn.disabled = false
    btn.textContent = 'Enter a load'
  } else if (amt > state.balances[state.sell]) {
    btn.disabled = false
    btn.textContent = 'Not enough in the pile'
  } else {
    btn.disabled = false
    btn.textContent = 'Scoop & Dump 🪣'
  }
}

function renderDetails() {
  const amt = amount()
  if (amt > 0) {
    els.detailsToggle.classList.remove('hidden')
    const pct = surplusFor(amt).toFixed(2)
    els.details.innerHTML = `
      <div class="d-row"><span>Rate</span><b>1 ${state.sell} = ${fmt(rate())} ${state.buy}</b></div>
      <div class="d-row"><span>Cream off the top</span><b>0 ${state.buy}</b></div>
      <div class="d-row"><span>Extra scoop</span><b>+${pct}% 🥄</b></div>
      <div class="d-row"><span>Spillage tolerance</span><b>${state.spillage}%</b></div>
      <div class="d-row"><span>Order type</span><b>Instant Scoop • batch auction</b></div>`
    els.details.classList.toggle('hidden', !state.detailsOpen)
    els.detailsToggle.classList.toggle('closed', !state.detailsOpen)
  } else {
    els.detailsToggle.classList.add('hidden')
    els.details.classList.add('hidden')
    els.details.innerHTML = ''
  }
}

function renderOutput() {
  const amt = amount()
  els.buyOut.textContent = amt > 0 ? fmt(computeOut(amt)) : '0.0'
}

function renderTokens() {
  els.sellTokenBtn.innerHTML = tokenBtnHtml(state.sell)
  els.buyTokenBtn.innerHTML = tokenBtnHtml(state.buy)
}

function scaleStage() {
  const scale = Math.min(1, (window.innerWidth - 32) / 540)
  els.stageWrap.style.transform = `scale(${scale})`
}

function shake(el) {
  el.animate(
    [
      { transform: 'translateX(0)' },
      { transform: 'translateX(-6px)' },
      { transform: 'translateX(6px)' },
      { transform: 'translateX(-4px)' },
      { transform: 'translateX(0)' },
    ],
    { duration: 300, easing: 'ease-in-out' },
  )
}

function spawnFallBlob() {
  const blob = document.createElement('div')
  blob.className = 'fall-blob'
  blob.style.left = `${16 + Math.random() * 62}px`
  els.fallHost.appendChild(blob)
  setTimeout(() => blob.remove(), 450)
}

function tokenBtnHtml(sym) {
  return `<span class="t-emoji">${TOKENS[sym].emoji}</span><b>${sym}</b><span class="caret">▾</span>`
}

function tone(freqFrom, freqTo, dur, type, vol, delay = 0) {
  if (!state.sound) return
  const ctx = audio()
  const t = ctx.currentTime + delay
  const o = ctx.createOscillator()
  const g = ctx.createGain()
  o.type = type
  o.frequency.setValueAtTime(freqFrom, t)
  if (freqTo !== freqFrom) o.frequency.exponentialRampToValueAtTime(freqTo, t + dur)
  g.gain.setValueAtTime(0.0001, t)
  g.gain.exponentialRampToValueAtTime(vol, t + 0.015)
  g.gain.exponentialRampToValueAtTime(0.0001, t + dur)
  o.connect(g).connect(ctx.destination)
  o.start(t)
  o.stop(t + dur + 0.03)
}

const HOME = 'translateX(0px) translateY(0px) rotate(0deg)'
const AT_LEFT = 'translateX(-150px) translateY(-34px) rotate(22deg)'
const DIPPED = 'translateX(-152px) translateY(26px) rotate(40deg)'
const LIFTED = 'translateX(-148px) translateY(-48px) rotate(14deg)'
const MID_AIR = 'translateX(140px) translateY(-120px) rotate(2deg)'
const AT_RIGHT = 'translateX(174px) translateY(-44px) rotate(8deg)'
const TIPPED = 'translateX(174px) translateY(-44px) rotate(-64deg)'

function bindReceiptActions() {
  $('againBtn').addEventListener('click', () => {
    els.receipt.classList.add('hidden')
    els.sellInput.focus()
  })
  $('scopeLink').addEventListener('click', (e) => {
    e.preventDefault()
    toast('🔬 The Smell-o-scope is out for calibration.')
  })
}

function errorCardHtml(e) {
  return `
    <div class="err-head"><span class="err-code">${e.code}</span><b>${e.field}</b></div>
    <p class="err-fix">${e.fix}</p>
    <p class="err-real">dev translation: <code>${e.real}</code></p>`
}

function moveShovel(from, to, options) {
  return els.shovel.animate([{ transform: from }, { transform: to }], Object.assign({ fill: 'forwards' }, options))
    .finished
}

async function onCta() {
  if (state.hauling) return
  if (!state.connected) {
    connectWallet()
    renderAll()
    return
  }
  const amt = amount()
  if (amt <= 0) {
    shake(els.sellInput)
    els.sellInput.focus()
    return
  }
  if (amt > state.balances[state.sell]) {
    toast('🚜 The wheelbarrow is empty — not enough in the pile.')
    return
  }
  const sellSym = state.sell
  const buySym = state.buy
  const out = computeOut(amt)
  const surplusPct = surplusFor(amt)
  const batchNum = 400 + Math.floor(Math.random() * 99)
  const willFail = !state.forceSafe && Math.random() < 0.15
  const failError = willFail ? ERRORS.find((e) => e.code === pick(FAIL_POOL)) : null
  state.forceSafe = false

  state.hauling = true
  renderCta()
  await playHaul({ sellSym, buySym, batchNum, failError })
  state.hauling = false

  if (failError) {
    renderAll()
    showFailedReceipt(failError)
    return
  }

  state.balances[sellSym] -= amt
  state.balances[buySym] += out
  state.sellAmount = ''
  els.sellInput.value = ''
  renderAll()
  showReceipt({ amt, out, sellSym, buySym, surplusPct, batchNum })
}

async function playHaul({ sellSym, buySym, batchNum, failError }) {
  els.labelSell.textContent = `${TOKENS[sellSym].emoji} ${sellSym}`
  els.labelBuy.textContent = `${TOKENS[buySym].emoji} ${buySym}`
  els.labelBuy.classList.remove('bounce')
  els.fillSell.style.height = '68%'
  els.fillBuy.style.height = '5%'
  els.fallHost.innerHTML = ''
  els.batchNote.classList.remove('done')
  els.batchNote.classList.remove('fail')
  els.overlay.classList.remove('fade')
  els.overlay.classList.remove('hidden')
  scaleStage()

  await wait(600)

  if (failError) {
    els.batchNote.textContent = `⚠️ ${failError.code} — ${failError.field}`
    els.batchNote.classList.add('fail')
    playSad()
    await wait(1300)
    els.overlay.classList.add('fade')
    await wait(360)
    els.overlay.classList.add('hidden')
    return
  }

  els.batchNote.textContent = `Batch #${batchNum} — spreading…`
  await wait(300)
  await moveShovel(HOME, AT_LEFT, { duration: 420, easing: 'ease-in-out' })
  playScrape()
  await moveShovel(AT_LEFT, DIPPED, { duration: 300, easing: 'ease-in' })
  document.querySelectorAll('.cargo').forEach((c) => c.classList.add('show'))
  els.fillSell.style.height = '42%'
  await wait(200)
  await moveShovel(DIPPED, LIFTED, { duration: 280, easing: 'ease-out' })
  await els.shovel.animate([{ transform: LIFTED }, { transform: MID_AIR, offset: 0.5 }, { transform: AT_RIGHT }], {
    duration: 720,
    easing: 'ease-in-out',
    fill: 'forwards',
  }).finished
  await moveShovel(AT_RIGHT, TIPPED, { duration: 320, easing: 'ease-in' })
  document.querySelectorAll('.cargo').forEach((c) => c.classList.remove('show'))

  for (let i = 0; i < 4; i++) {
    setTimeout(() => {
      spawnFallBlob()
      playPlop(1 + i * 0.15)
      if (i === 0) popPoof()
    }, i * 120)
  }
  setTimeout(() => {
    els.fillBuy.style.height = '41%'
    bounceLabel()
  }, 380)

  await wait(700)
  playScrape(0.16, 0.08)
  await els.shovel.animate([{ transform: TIPPED }, { transform: MID_AIR }, { transform: HOME }], {
    duration: 560,
    easing: 'ease-in-out',
    fill: 'forwards',
  }).finished
  els.batchNote.textContent = 'Haul complete! 🪣'
  els.batchNote.classList.add('done')
  playJingle()
  await wait(800)
  els.overlay.classList.add('fade')
  await wait(360)
  els.overlay.classList.add('hidden')
}

function rainPoops() {
  const count = 3 + Math.floor(Math.random() * 4)
  for (let i = 0; i < count; i++) {
    setTimeout(() => {
      const drop = document.createElement('div')
      drop.className = 'poop-drop'
      drop.textContent = '💩'
      drop.style.left = `${5 + Math.random() * 90}vw`
      els.poopRain.appendChild(drop)
      setTimeout(() => drop.remove(), 1700)
    }, i * 160)
  }
}

function showFailedReceipt(e) {
  els.receipt.classList.add('error')
  els.receipt.innerHTML = `
    <div class="receipt-error-title">🚫 Haul failed</div>
    ${errorCardHtml(e)}
    <div class="receipt-actions">
      <button class="r-btn" id="retryBtn">Try the haul again</button>
      <a class="r-link" href="#" id="almLink">Read the Almanac ↗</a>
    </div>`
  els.receipt.classList.remove('hidden')
  $('retryBtn').addEventListener('click', () => {
    els.receipt.classList.add('hidden')
    state.forceSafe = true
    onCta()
  })
  $('almLink').addEventListener('click', (ev) => {
    ev.preventDefault()
    showView('almanac')
    flashAlmRow(e.code)
  })
  els.receipt.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
}

function showReceipt({ amt, out, sellSym, buySym, surplusPct, batchNum }) {
  const s = TOKENS[sellSym]
  const b = TOKENS[buySym]
  els.receipt.classList.remove('error')
  els.receipt.innerHTML = `
    <h2>🪣 Haul complete!</h2>
    <div class="r-row"><span>You dumped</span><b>${fmt(amt)} ${sellSym} ${s.emoji}</b></div>
    <div class="r-row"><span>You hauled</span><b>${fmt(out)} ${buySym} ${b.emoji}</b></div>
    <div class="r-row"><span>Extra scoop</span><b>+${surplusPct.toFixed(2)}% 🥄</b></div>
    <div class="r-row"><span>Cream off the top</span><b>0.00</b></div>
    <div class="r-row"><span>Batch</span><b>#${batchNum}</b></div>
    <div class="receipt-actions">
      <button class="r-btn" id="againBtn">Scoop again</button>
      <a class="r-link" href="#" id="scopeLink">View on Smell-o-scope ↗</a>
    </div>`
  els.receipt.classList.remove('hidden')
  bindReceiptActions()
  els.receipt.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
}

const VIEWS = ['scoop', 'farmhands', 'fencetv', 'almanac']
let currentView = 'scoop'

function showView(id) {
  if (!VIEWS.includes(id) || id === currentView) {
    if (VIEWS.includes(id)) {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
    return
  }
  currentView = id
  document.querySelectorAll('.view').forEach((section) => {
    section.classList.toggle('hidden', section.id !== `view-${id}`)
  })
  document.querySelectorAll('.nav-link[data-view]').forEach((btn) => {
    btn.classList.toggle('is-active', btn.dataset.view === id)
  })
  stopFarmhands()
  stopTv()
  if (id === 'farmhands') startFarmhands()
  if (id === 'fencetv') startTv()
  window.scrollTo({ top: 0 })
}

const stats = { loads: 13337, batches: 420, scoopsKg: 1204, foxes: 89 }

function renderStats() {
  els.statLoads.textContent = stats.loads.toLocaleString('en-US')
  els.statBatches.textContent = stats.batches.toLocaleString('en-US')
  els.statScoops.textContent = `${Math.round(stats.scoopsKg).toLocaleString('en-US')} kg`
  els.statFoxes.textContent = stats.foxes.toLocaleString('en-US')
}

const raceState = { active: false, raf: 0, paused: false, batchNum: 421, last: 0 }
let racers = []

function buildRace() {
  els.track.innerHTML = ''
  racers = FARMHANDS.map((f) => {
    const lane = document.createElement('div')
    lane.className = 'lane'
    lane.innerHTML = `
      <div class="lane-info"><b>${f.name}</b><span class="bid"></span></div>
      <div class="lane-track">
        <span class="tractor" style="filter:hue-rotate(${f.hue}deg) saturate(1.3)">🚜</span>
        <span class="finish">🏁</span>
      </div>`
    els.track.appendChild(lane)
    return {
      ...f,
      progress: 0,
      speed: rand(0.06, 0.13),
      bid: rand(0.05, 0.35),
      wins: Math.floor(rand(40, 130)),
      scoopAvg: rand(0.15, 0.36),
      haulsToday: Math.floor(rand(900, 4000)),
      el: lane.querySelector('.tractor'),
      bidEl: lane.querySelector('.bid'),
    }
  })
  renderBoard()
  syncRaceLabels()
}

function declareWin(r) {
  raceState.paused = true
  els.raceStatus.textContent = 'cooldown…'
  els.raceStatus.classList.add('cooling')
  els.raceWinner.innerHTML = `🏆 <b>${r.name}</b> wins batch #${raceState.batchNum} — everyone gets +${r.bid.toFixed(2)}% extra scoop!`
  els.raceWinner.classList.remove('hidden')
  playWin()
  r.wins += 1
  r.haulsToday += Math.floor(rand(10, 50))
  stats.batches += 1
  stats.loads += Math.floor(rand(2, 8))
  renderStats()
  renderBoard()
  setTimeout(() => {
    raceState.batchNum += 1
    racers.forEach((x) => {
      x.progress = 0
      x.speed = rand(0.06, 0.13)
      x.bid = rand(0.05, 0.35)
    })
    els.raceWinner.classList.add('hidden')
    els.raceStatus.textContent = 'spreading…'
    els.raceStatus.classList.remove('cooling')
    syncRaceLabels()
    raceState.paused = false
  }, 3200)
}

function raceStep(now) {
  if (!raceState.active) return
  const dt = Math.min(0.05, (now - raceState.last) / 1000)
  raceState.last = now
  if (!raceState.paused) {
    let winner = null
    for (const r of racers) {
      if (Math.random() < 0.01) r.speed = Math.min(0.15, Math.max(0.05, r.speed + rand(-0.02, 0.02)))
      r.progress += r.speed * dt
      r.el.style.left = `${2 + Math.min(1, r.progress) * 80}%`
      if (r.progress >= 1 && !winner) winner = r
    }
    if (winner) declareWin(winner)
  }
  raceState.raf = requestAnimationFrame(raceStep)
}

function renderBoard() {
  const medals = ['🥇', '🥈', '🥉']
  const sorted = [...racers].sort((a, b) => b.wins - a.wins)
  els.boardBody.innerHTML = sorted
    .map(
      (r, i) => `
      <tr>
        <td class="rank">${medals[i] || i + 1}</td>
        <td><span class="fh"><span class="fh-tractor" style="filter:hue-rotate(${r.hue}deg) saturate(1.3)">🚜</span>${r.name}</span></td>
        <td><b>${r.wins}</b></td>
        <td>${r.scoopAvg.toFixed(2)}%</td>
        <td>${r.haulsToday.toLocaleString('en-US')}</td>
      </tr>`,
    )
    .join('')
}

function startFarmhands() {
  if (raceState.active) return
  raceState.active = true
  if (!racers.length) buildRace()
  raceState.last = performance.now()
  raceState.raf = requestAnimationFrame(raceStep)
}

function stopFarmhands() {
  raceState.active = false
  cancelAnimationFrame(raceState.raf)
}

function syncRaceLabels() {
  els.raceBatchNum.textContent = raceState.batchNum
  racers.forEach((r) => {
    r.bidEl.textContent = `bid +${r.bid.toFixed(2)}%`
    r.el.style.left = `${2 + Math.min(1, r.progress) * 80}%`
  })
}

setInterval(() => {
  if (!raceState.active) return
  stats.loads += 1 + Math.floor(Math.random() * 3)
  stats.scoopsKg += Math.random() * 2
  if (Math.random() < 0.12) stats.foxes += 1
  renderStats()
}, 1600)

const tvState = { active: false, ch: 'fence', token: 0, beep: 0 }

function buildAlmanac() {
  const head = `<thead><tr><th>Code</th><th>Field name</th><th>Real-world</th><th>What to do</th></tr></thead>`
  ;[
    [els.almHttp, 'http'],
    [els.almOrder, 'order'],
  ].forEach(([table, kind]) => {
    const rows = ERRORS.filter((e) => e.kind === kind)
      .map(
        (e) => `
        <tr data-code="${e.code}">
          <td class="c-code">${e.code}</td>
          <td class="c-field">${e.field}</td>
          <td class="c-real"><code>${e.real}</code></td>
          <td class="c-fix">${e.fix}</td>
        </tr>`,
      )
      .join('')
    table.innerHTML = head + `<tbody>${rows}</tbody>`
  })
  document.querySelectorAll('.alm tbody tr').forEach((row) => {
    row.addEventListener('click', () => {
      const e = ERRORS.find((x) => x.code === row.dataset.code)
      toast(`${e.code} ${e.field} — ${e.fix}`)
    })
  })
}

function flashAlmRow(code) {
  setTimeout(() => {
    const row = document.querySelector(`.alm tr[data-code="${code}"]`)
    if (!row) return
    row.scrollIntoView({ behavior: 'smooth', block: 'center' })
    row.classList.remove('flash-row')
    void row.offsetWidth
    row.classList.add('flash-row')
  }, 150)
}

async function foxLoop() {
  const my = ++tvState.token
  const alive = () => tvState.active && tvState.ch === 'fence' && my === tvState.token
  while (alive()) {
    const fox = els.foxEl
    fox.getAnimations().forEach((a) => a.cancel())
    fox.style.opacity = '1'
    fox.classList.remove('charred')
    els.dizzyEl.classList.add('hidden')
    els.zapBolt.classList.add('hidden')
    fox.style.transform = 'translateX(0)'
    await wait(600)
    if (!alive()) return
    const sceneRect = els.sceneFence.getBoundingClientRect()
    const fenceRect = els.fenceLine.getBoundingClientRect()
    const target = Math.max(30, fenceRect.left - sceneRect.left - 34)
    try {
      await fox.animate([{ transform: 'translateX(0)' }, { transform: `translateX(${target}px)` }], {
        duration: 2500,
        easing: 'linear',
        fill: 'forwards',
      }).finished
    } catch {
      return
    }
    if (!alive()) return
    els.tvFlash.classList.remove('zap')
    void els.tvFlash.offsetWidth
    els.tvFlash.classList.add('zap')
    els.sceneFence.classList.remove('shake')
    void els.sceneFence.offsetWidth
    els.sceneFence.classList.add('shake')
    els.zapBolt.style.left = `${els.fenceLine.offsetLeft - 8}px`
    els.zapBolt.classList.remove('hidden')
    els.zapBolt.classList.remove('pop')
    void els.zapBolt.offsetWidth
    els.zapBolt.classList.add('pop')
    playZap()
    fox.classList.add('charred')
    els.fencePile.classList.remove('wiggle')
    void els.fencePile.offsetWidth
    els.fencePile.classList.add('wiggle')
    els.dizzyEl.style.left = `${target + 4}px`
    els.dizzyEl.classList.remove('hidden')
    try {
      await fox.animate(
        [
          { transform: `translateX(${target}px) translateY(0) rotate(0deg)`, opacity: 1 },
          { transform: `translateX(${target - 110}px) translateY(-64px) rotate(-420deg)`, opacity: 1 },
          { transform: `translateX(${target - 130}px) translateY(4px) rotate(-680deg)`, opacity: 0.9 },
        ],
        { duration: 850, easing: 'ease-out', fill: 'forwards' },
      ).finished
    } catch {
      return
    }
    if (!alive()) return
    await wait(1100)
    if (!alive()) return
    try {
      await fox.animate([{ opacity: 0.9 }, { opacity: 0 }], { duration: 250, fill: 'forwards' }).finished
    } catch {
      return
    }
  }
}

function setChannel(ch) {
  tvState.ch = ch
  tvState.token += 1
  if (tvState.beep) {
    clearInterval(tvState.beep)
    tvState.beep = 0
  }
  const scenes = { fence: els.sceneFence, herd: els.sceneHerd, bars: els.sceneBars }
  Object.entries(scenes).forEach(([key, el]) => el.classList.toggle('hidden', key !== ch))
  document.querySelectorAll('.tv-ch').forEach((btn) => {
    btn.classList.toggle('is-on', btn.dataset.ch === ch)
  })
  setTicker(TICKERS[ch])
  if (!tvState.active) return
  if (ch === 'fence') foxLoop()
  if (ch === 'bars') {
    playBeep()
    tvState.beep = setInterval(playBeep, 2200)
  }
}

function setTicker(text) {
  els.tickerInner.innerHTML = `<span>${text}</span><span>${text}</span>`
}

function startTv() {
  if (tvState.active) return
  tvState.active = true
  setChannel(tvState.ch)
}

function stopTv() {
  tvState.active = false
  tvState.token += 1
  if (tvState.beep) {
    clearInterval(tvState.beep)
    tvState.beep = 0
  }
}

els.sellInput.addEventListener('input', () => {
  const v = els.sellInput.value
  if (v === '' || /^\d*\.?\d*$/.test(v)) {
    state.sellAmount = v
  } else {
    els.sellInput.value = state.sellAmount
  }
  renderAll()
})

els.sellInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') onCta()
})

els.sellBal.addEventListener('click', () => {
  const bal = state.balances[state.sell]
  const v = trimNum(bal, bal >= 1000 ? 2 : 6)
  state.sellAmount = v
  els.sellInput.value = v
  renderAll()
})

els.switchBtn.addEventListener('click', () => {
  const prevSell = state.sell
  state.sell = state.buy
  state.buy = prevSell
  els.switchBtn.classList.remove('spin')
  void els.switchBtn.offsetWidth
  els.switchBtn.classList.add('spin')
  renderAll()
})

els.sellTokenBtn.addEventListener('click', () => openTokenMenu('sell', els.sellTokenBtn))
els.buyTokenBtn.addEventListener('click', () => openTokenMenu('buy', els.buyTokenBtn))

document.addEventListener('click', (e) => {
  if (
    !els.tokenMenu.contains(e.target) &&
    !els.sellTokenBtn.contains(e.target) &&
    !els.buyTokenBtn.contains(e.target)
  ) {
    closeTokenMenu()
  }
  if (!els.settingsPanel.contains(e.target) && e.target !== els.gearBtn) {
    els.settingsPanel.classList.add('hidden')
    els.gearBtn.classList.remove('open')
  }
})

els.gearBtn.addEventListener('click', (e) => {
  e.stopPropagation()
  els.settingsPanel.classList.toggle('hidden')
  els.gearBtn.classList.toggle('open')
})

els.spillRow.querySelectorAll('.spill').forEach((chip) => {
  chip.addEventListener('click', () => {
    state.spillage = parseFloat(chip.dataset.v)
    els.spillRow.querySelectorAll('.spill').forEach((c) => c.classList.toggle('is-on', c === chip))
    renderDetails()
  })
})

els.detailsToggle.addEventListener('click', () => {
  state.detailsOpen = !state.detailsOpen
  renderDetails()
})

els.ctaBtn.addEventListener('click', onCta)

els.walletBtn.addEventListener('click', () => {
  if (state.connected) toast(`🚜 ${state.address} — hitched and ready.`)
  else {
    connectWallet()
    renderAll()
  }
})

els.netBtn.addEventListener('click', () => {
  toast('🌾 Only Ethereum for now. The south field is fallow.')
})

els.soundToggle.addEventListener('click', () => {
  state.sound = !state.sound
  els.soundToggle.textContent = state.sound ? '🔊' : '🔇'
  if (state.sound) playPlop(1.4)
})

els.nav.addEventListener('click', (e) => {
  const btn = e.target.closest('.nav-link')
  if (!btn) return
  if (btn.dataset.view) {
    showView(btn.dataset.view)
    return
  }
  const names = { stash: 'Stash', trickler: 'Trickler', yield: 'Yield' }
  toast(`🚧 The ${names[btn.dataset.tab]} barn is still being raised — check back after the harvest.`)
})

document.querySelectorAll('[data-nav]').forEach((link) => {
  link.addEventListener('click', (e) => {
    e.preventDefault()
    showView(link.dataset.nav)
  })
})

document.querySelectorAll('[data-toast]').forEach((link) => {
  link.addEventListener('click', (e) => {
    e.preventDefault()
    toast(link.dataset.toast)
  })
})

els.fenceChip.addEventListener('click', () => showView('fencetv'))
els.farmChip.addEventListener('click', () => showView('farmhands'))

document.querySelectorAll('.tv-ch').forEach((btn) => {
  btn.addEventListener('click', () => setChannel(btn.dataset.ch))
})

els.simBtn.addEventListener('click', () => {
  const e = pick(ERRORS)
  els.simOut.innerHTML = errorCardHtml(e)
  els.simOut.classList.remove('hidden')
  playSad()
})

els.brand.addEventListener('click', () => {
  els.brandMark.classList.remove('boing')
  void els.brandMark.offsetWidth
  els.brandMark.classList.add('boing')
  playPlop(0.8)
  rainPoops()
})

window.addEventListener('resize', () => {
  if (!els.overlay.classList.contains('hidden')) scaleStage()
})

buildAlmanac()
setTicker(TICKERS.fence)
renderStats()
renderAll()
