import type { Point2D } from '../types'

export interface TreeNode {
  isLeaf: boolean
  prediction?: number
  feature?: 'x' | 'y'
  threshold?: number
  gini?: number
  samples: number
  classCounts: Record<number, number>
  left?: TreeNode
  right?: TreeNode
  depth: number
}

export function gini(points: Point2D[]): number {
  if (points.length === 0) return 0
  const counts: Record<number, number> = {}
  for (const p of points) counts[p.label] = (counts[p.label] ?? 0) + 1
  let impurity = 1
  for (const label in counts) {
    const prob = counts[label] / points.length
    impurity -= prob * prob
  }
  return impurity
}

function majorityLabel(points: Point2D[]): number {
  const counts: Record<number, number> = {}
  for (const p of points) counts[p.label] = (counts[p.label] ?? 0) + 1
  let best = 0
  let bestCount = -1
  for (const label in counts) {
    if (counts[label] > bestCount) {
      bestCount = counts[label]
      best = Number(label)
    }
  }
  return best
}

function classCounts(points: Point2D[]): Record<number, number> {
  const counts: Record<number, number> = {}
  for (const p of points) counts[p.label] = (counts[p.label] ?? 0) + 1
  return counts
}

function bestSplit(points: Point2D[]): { feature: 'x' | 'y'; threshold: number; gain: number } | null {
  const parentGini = gini(points)
  let best: { feature: 'x' | 'y'; threshold: number; gain: number } | null = null

  for (const feature of ['x', 'y'] as const) {
    const values = Array.from(new Set(points.map((p) => p[feature]))).sort((a, b) => a - b)
    for (let i = 0; i < values.length - 1; i++) {
      const threshold = (values[i] + values[i + 1]) / 2
      const left = points.filter((p) => p[feature] <= threshold)
      const right = points.filter((p) => p[feature] > threshold)
      if (left.length === 0 || right.length === 0) continue
      const weighted =
        (left.length / points.length) * gini(left) + (right.length / points.length) * gini(right)
      const gain = parentGini - weighted
      if (!best || gain > best.gain) {
        best = { feature, threshold, gain }
      }
    }
  }
  return best
}

export function buildTree(points: Point2D[], maxDepth: number, minSamples = 4, depth = 0): TreeNode {
  const counts = classCounts(points)
  const numClasses = Object.keys(counts).length
  const node: TreeNode = {
    isLeaf: true,
    prediction: majorityLabel(points),
    gini: gini(points),
    samples: points.length,
    classCounts: counts,
    depth,
  }

  if (depth >= maxDepth || points.length < minSamples || numClasses <= 1) {
    return node
  }

  const split = bestSplit(points)
  if (!split || split.gain <= 1e-6) {
    return node
  }

  const left = points.filter((p) => p[split.feature] <= split.threshold)
  const right = points.filter((p) => p[split.feature] > split.threshold)

  node.isLeaf = false
  node.feature = split.feature
  node.threshold = split.threshold
  node.left = buildTree(left, maxDepth, minSamples, depth + 1)
  node.right = buildTree(right, maxDepth, minSamples, depth + 1)
  return node
}

export function treePredict(node: TreeNode, x: number, y: number): number {
  if (node.isLeaf || !node.feature) return node.prediction ?? 0
  const value = node.feature === 'x' ? x : y
  if (value <= (node.threshold ?? 0)) {
    return node.left ? treePredict(node.left, x, y) : node.prediction ?? 0
  }
  return node.right ? treePredict(node.right, x, y) : node.prediction ?? 0
}

export function countNodes(node: TreeNode): number {
  if (node.isLeaf) return 1
  return 1 + (node.left ? countNodes(node.left) : 0) + (node.right ? countNodes(node.right) : 0)
}
