import { makeRng } from '../datasets/generators'

export interface Centroid {
  x: number
  y: number
}

export interface KMeansStep {
  centroids: Centroid[]
  assignments: number[]
  converged: boolean
}

export function initCentroids(points: { x: number; y: number }[], k: number, seed = 1): Centroid[] {
  const rng = makeRng(seed)
  const shuffled = [...points].sort(() => rng() - 0.5)
  const chosen = shuffled.slice(0, Math.max(1, Math.min(k, points.length)))
  // pad if fewer points than k
  while (chosen.length < k) {
    chosen.push({
      x: (rng() - 0.5) * 16,
      y: (rng() - 0.5) * 16,
    })
  }
  return chosen.map((p) => ({ x: p.x, y: p.y }))
}

function dist2(ax: number, ay: number, bx: number, by: number) {
  return (ax - bx) ** 2 + (ay - by) ** 2
}

export function assignPoints(points: { x: number; y: number }[], centroids: Centroid[]): number[] {
  return points.map((p) => {
    let best = 0
    let bestDist = Infinity
    centroids.forEach((c, i) => {
      const d = dist2(p.x, p.y, c.x, c.y)
      if (d < bestDist) {
        bestDist = d
        best = i
      }
    })
    return best
  })
}

export function recomputeCentroids(
  points: { x: number; y: number }[],
  assignments: number[],
  k: number,
  previous: Centroid[],
): Centroid[] {
  const sums = Array.from({ length: k }, () => ({ x: 0, y: 0, count: 0 }))
  points.forEach((p, i) => {
    const c = assignments[i]
    sums[c].x += p.x
    sums[c].y += p.y
    sums[c].count += 1
  })
  return sums.map((s, i) =>
    s.count > 0 ? { x: s.x / s.count, y: s.y / s.count } : previous[i],
  )
}

export function kmeansStep(
  points: { x: number; y: number }[],
  centroids: Centroid[],
): KMeansStep {
  const assignments = assignPoints(points, centroids)
  const newCentroids = recomputeCentroids(points, assignments, centroids.length, centroids)
  const converged = newCentroids.every(
    (c, i) => Math.abs(c.x - centroids[i].x) < 1e-3 && Math.abs(c.y - centroids[i].y) < 1e-3,
  )
  return { centroids: newCentroids, assignments, converged }
}
