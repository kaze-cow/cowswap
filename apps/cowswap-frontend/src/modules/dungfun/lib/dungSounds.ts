type AudioCtor = typeof AudioContext

let audioCtx: AudioContext | null = null

function getCtx(): AudioContext | null {
  if (typeof window === 'undefined') return null
  if (!audioCtx) {
    const ctor: AudioCtor | undefined =
      window.AudioContext ?? (window as Window & { webkitAudioContext?: AudioCtor }).webkitAudioContext
    if (!ctor) return null
    audioCtx = new ctor()
  }
  if (audioCtx.state === 'suspended') void audioCtx.resume()
  return audioCtx
}

function noiseBurst(dur: number, vol: number, filterType: BiquadFilterType, f0: number, f1: number): void {
  const ctx = getCtx()
  if (!ctx) return
  const t = ctx.currentTime
  const buf = ctx.createBuffer(1, Math.floor(ctx.sampleRate * dur), ctx.sampleRate)
  const data = buf.getChannelData(0)
  for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1
  const src = ctx.createBufferSource()
  src.buffer = buf
  const filter = ctx.createBiquadFilter()
  filter.type = filterType
  filter.frequency.setValueAtTime(f0, t)
  filter.frequency.exponentialRampToValueAtTime(f1, t + dur)
  const g = ctx.createGain()
  g.gain.setValueAtTime(0.0001, t)
  g.gain.exponentialRampToValueAtTime(vol, t + 0.04)
  g.gain.exponentialRampToValueAtTime(0.0001, t + dur)
  src.connect(filter)
  filter.connect(g)
  g.connect(ctx.destination)
  src.start(t)
}

function tone(freqFrom: number, freqTo: number, dur: number, type: OscillatorType, vol: number, delay = 0): void {
  const ctx = getCtx()
  if (!ctx) return
  const t = ctx.currentTime + delay
  const o = ctx.createOscillator()
  const g = ctx.createGain()
  o.type = type
  o.frequency.setValueAtTime(freqFrom, t)
  if (freqTo !== freqFrom) o.frequency.exponentialRampToValueAtTime(freqTo, t + dur)
  g.gain.setValueAtTime(0.0001, t)
  g.gain.exponentialRampToValueAtTime(vol, t + 0.015)
  g.gain.exponentialRampToValueAtTime(0.0001, t + dur)
  o.connect(g)
  g.connect(ctx.destination)
  o.start(t)
  o.stop(t + dur + 0.03)
}

export const dungSounds = {
  scrape(dur = 0.26, vol = 0.14): void {
    noiseBurst(dur, vol, 'bandpass', 320, 950)
  },

  plop(pitch = 1): void {
    tone(210 * pitch, 55 * pitch, 0.14, 'sine', 0.35)
  },

  jingle(): void {
    tone(392, 392, 0.14, 'triangle', 0.13, 0)
    tone(494, 494, 0.14, 'triangle', 0.13, 0.11)
    tone(587, 587, 0.2, 'triangle', 0.13, 0.22)
  },

  win(): void {
    tone(330, 330, 0.1, 'triangle', 0.12, 0)
    tone(415, 415, 0.1, 'triangle', 0.12, 0.09)
    tone(494, 494, 0.1, 'triangle', 0.12, 0.18)
    tone(660, 660, 0.22, 'triangle', 0.13, 0.3)
  },

  sad(): void {
    tone(294, 294, 0.2, 'triangle', 0.11, 0)
    tone(233, 233, 0.32, 'triangle', 0.11, 0.22)
  },

  zap(): void {
    tone(2600, 90, 0.1, 'square', 0.2)
    noiseBurst(0.12, 0.16, 'highpass', 1400, 3000)
  },

  beep(): void {
    tone(1000, 1000, 0.12, 'sine', 0.07)
  },
}
