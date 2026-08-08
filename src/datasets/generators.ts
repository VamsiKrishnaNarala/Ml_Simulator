import type { DatasetKind, Point2D } from '../types'

// Simple seedable PRNG (mulberry32) so datasets are reproducible per-seed
export function makeRng(seed: number) {
  let a = seed
  return function () {
    a |= 0
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

function gaussian(rng: () => number) {
  // Box-Muller transform
  const u1 = Math.max(rng(), 1e-9)
  const u2 = rng()
  return Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2)
}

interface GenOptions {
  kind: DatasetKind
  samples: number
  noise: number // 0..1
  clusters?: number // for blobs
  classSeparation?: number // 0..1
  seed?: number
}

// Space is normalized to roughly [-10, 10] on both axes
export function generateDataset({
  kind,
  samples,
  noise,
  clusters = 2,
  classSeparation = 0.6,
  seed = 42,
}: GenOptions): Point2D[] {
  const rng = makeRng(seed)
  const pts: Point2D[] = []
  const n = Math.max(4, Math.floor(samples))
  const sep = 3 + classSeparation * 6
  const noiseScale = 0.5 + noise * 4

  switch (kind) {
    case 'blobs': {
      const centers: [number, number][] = []
      for (let c = 0; c < clusters; c++) {
        const angle = (c / clusters) * Math.PI * 2
        centers.push([Math.cos(angle) * sep, Math.sin(angle) * sep])
      }
      for (let i = 0; i < n; i++) {
        const c = i % clusters
        const [cx, cy] = centers[c]
        pts.push({
          x: cx + gaussian(rng) * noiseScale,
          y: cy + gaussian(rng) * noiseScale,
          label: c % 2, // binary label by default; parity gives usable 2-class split
        })
      }
      break
    }
    case 'moons': {
      const half = Math.floor(n / 2)
      for (let i = 0; i < n; i++) {
        const isTop = i < half
        const t = rng() * Math.PI
        const r = 6
        if (isTop) {
          pts.push({
            x: Math.cos(t) * r,
            y: Math.sin(t) * r + 1,
            label: 0,
          })
        } else {
          pts.push({
            x: 1 - Math.cos(t) * r,
            y: 1 - Math.sin(t) * r - 1,
            label: 1,
          })
        }
      }
      // add noise
      for (const p of pts) {
        p.x += gaussian(rng) * noiseScale * 0.4
        p.y += gaussian(rng) * noiseScale * 0.4
      }
      break
    }
    case 'circles': {
      const half = Math.floor(n / 2)
      for (let i = 0; i < n; i++) {
        const isInner = i < half
        const angle = rng() * Math.PI * 2
        const r = isInner ? 2.5 : 2.5 + sep
        pts.push({
          x: Math.cos(angle) * r + gaussian(rng) * noiseScale * 0.3,
          y: Math.sin(angle) * r + gaussian(rng) * noiseScale * 0.3,
          label: isInner ? 0 : 1,
        })
      }
      break
    }
    case 'linear': {
      // linearly separable: label by which side of a line
      const angle = Math.PI / 5
      for (let i = 0; i < n; i++) {
        const x = (rng() - 0.5) * 20
        const y = (rng() - 0.5) * 20
        const side = Math.sin(angle) * x - Math.cos(angle) * y
        const marginPush = (side > 0 ? 1 : -1) * (sep * 0.15)
        pts.push({
          x: x + gaussian(rng) * noiseScale * 0.3,
          y: y + marginPush + gaussian(rng) * noiseScale * 0.3,
          label: side > 0 ? 1 : 0,
        })
      }
      break
    }
    case 'xor': {
      for (let i = 0; i < n; i++) {
        const x = (rng() - 0.5) * 16
        const y = (rng() - 0.5) * 16
        const label = (x > 0 ? 1 : 0) ^ (y > 0 ? 1 : 0)
        pts.push({
          x: x + gaussian(rng) * noiseScale * 0.3,
          y: y + gaussian(rng) * noiseScale * 0.3,
          label,
        })
      }
      break
    }
    case 'noise': {
      for (let i = 0; i < n; i++) {
        pts.push({
          x: (rng() - 0.5) * 20,
          y: (rng() - 0.5) * 20,
          label: rng() > 0.5 ? 1 : 0,
        })
      }
      break
    }
  }
  return pts
}

export function generateRegressionData(opts: {
  samples: number
  noise: number
  slope?: number
  intercept?: number
  seed?: number
}) {
  const { samples, noise, slope = 1.4, intercept = -2, seed = 7 } = opts
  const rng = makeRng(seed)
  const pts: { x: number; y: number }[] = []
  const n = Math.max(4, Math.floor(samples))
  for (let i = 0; i < n; i++) {
    const x = (rng() - 0.5) * 20
    const y = slope * x + intercept + gaussian(rng) * (1 + noise * 8)
    pts.push({ x, y })
  }
  return pts
}

export const DATASET_PRESETS: { id: DatasetKind; label: string; blurb: string }[] = [
  { id: 'blobs', label: 'Blobs', blurb: 'Well-separated clusters — the easy case.' },
  { id: 'moons', label: 'Two Moons', blurb: 'Interleaving crescents — needs a curved boundary.' },
  { id: 'circles', label: 'Circles', blurb: 'One class rings the other — no straight line works.' },
  { id: 'linear', label: 'Linearly Separable', blurb: 'A single straight line can split the classes.' },
  { id: 'xor', label: 'XOR', blurb: 'Diagonal quadrants — breaks simple linear models.' },
  { id: 'noise', label: 'Random Noise', blurb: 'No real structure — a stress test for overfitting.' },
]
