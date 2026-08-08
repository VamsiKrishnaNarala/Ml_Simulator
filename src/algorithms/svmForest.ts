import type { Point2D } from '../types'
import { buildTree, treePredict, type TreeNode } from './decisionTree'
import { makeRng } from '../datasets/generators'

// --- Linear SVM (soft-margin, trained with sub-gradient descent on hinge loss) ---
export interface SvmWeights {
  w1: number
  w2: number
  b: number
}

export function trainLinearSvm(
  points: Point2D[],
  opts: { learningRate: number; iterations: number; C?: number },
): SvmWeights {
  const { learningRate, iterations, C = 1 } = opts
  let w1 = 0
  let w2 = 0
  let b = 0
  const scale = 10
  // SVM wants labels in {-1, +1}
  const data = points.map((p) => ({ x: p.x / scale, y: p.y / scale, label: p.label === 1 ? 1 : -1 }))

  for (let iter = 0; iter < iterations; iter++) {
    let dw1 = w1
    let dw2 = w2
    let db = 0
    for (const p of data) {
      const margin = p.label * (w1 * p.x + w2 * p.y + b)
      if (margin < 1) {
        dw1 -= C * p.label * p.x
        dw2 -= C * p.label * p.y
        db -= C * p.label
      }
    }
    w1 -= learningRate * (dw1 / data.length)
    w2 -= learningRate * (dw2 / data.length)
    b -= learningRate * (db / data.length)
  }
  return { w1, w2, b }
}

export function svmPredict(weights: SvmWeights, x: number, y: number, scale = 10) {
  const z = weights.w1 * (x / scale) + weights.w2 * (y / scale) + weights.b
  return z >= 0 ? 1 : 0
}

// --- Random Forest: bootstrap-aggregated shallow decision trees (bagging) ---
export interface ForestModel {
  trees: TreeNode[]
}

export function trainRandomForest(
  points: Point2D[],
  opts: { numTrees: number; maxDepth: number; seed?: number },
): ForestModel {
  const { numTrees, maxDepth, seed = 3 } = opts
  const rng = makeRng(seed)
  const trees: TreeNode[] = []
  for (let t = 0; t < numTrees; t++) {
    const sample: Point2D[] = []
    for (let i = 0; i < points.length; i++) {
      sample.push(points[Math.floor(rng() * points.length)])
    }
    trees.push(buildTree(sample, maxDepth, 3))
  }
  return { trees }
}

export function forestPredict(model: ForestModel, x: number, y: number): number {
  const votes = new Map<number, number>()
  for (const tree of model.trees) {
    const pred = treePredict(tree, x, y)
    votes.set(pred, (votes.get(pred) ?? 0) + 1)
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
