import type { Point2D } from '../types'

export interface KnnNeighbor extends Point2D {
  dist: number
}

export function distance(ax: number, ay: number, bx: number, by: number) {
  return Math.sqrt((ax - bx) ** 2 + (ay - by) ** 2)
}

export function kNearest(points: Point2D[], x: number, y: number, k: number): KnnNeighbor[] {
  const withDist = points.map((p) => ({ ...p, dist: distance(p.x, p.y, x, y) }))
  withDist.sort((a, b) => a.dist - b.dist)
  return withDist.slice(0, Math.max(1, Math.min(k, points.length)))
}

export function knnPredict(points: Point2D[], x: number, y: number, k: number): number {
  const neighbors = kNearest(points, x, y, k)
  const votes = new Map<number, number>()
  for (const n of neighbors) {
    votes.set(n.label, (votes.get(n.label) ?? 0) + 1)
  }
  let bestLabel = 0
  let bestCount = -1
  for (const [label, count] of votes) {
    if (count > bestCount) {
      bestCount = count
      bestLabel = label
    }
  }
  return bestLabel
}

export function makeKnnClassifier(points: Point2D[], k: number) {
  return {
    predict: (x: number, y: number) => knnPredict(points, x, y, k),
  }
}
