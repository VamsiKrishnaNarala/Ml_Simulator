import type { Point2D } from '../types'

export interface LogisticWeights {
  w1: number
  w2: number
  b: number
  history: { iter: number; loss: number }[]
}

function sigmoid(z: number) {
  return 1 / (1 + Math.exp(-z))
}

// Trains via batch gradient descent on normalized coordinates.
export function trainLogisticRegression(
  points: Point2D[],
  opts: { learningRate: number; iterations: number },
): LogisticWeights {
  const { learningRate, iterations } = opts
  let w1 = 0
  let w2 = 0
  let b = 0
  const n = points.length || 1
  const history: { iter: number; loss: number }[] = []
  const scale = 10 // normalize coords roughly into [-1,1]

  for (let iter = 0; iter < iterations; iter++) {
    let dw1 = 0
    let dw2 = 0
    let db = 0
    let loss = 0
    for (const p of points) {
      const nx = p.x / scale
      const ny = p.y / scale
      const z = w1 * nx + w2 * ny + b
      const pred = sigmoid(z)
      const err = pred - p.label
      dw1 += err * nx
      dw2 += err * ny
      db += err
      const eps = 1e-9
      loss += -(p.label * Math.log(pred + eps) + (1 - p.label) * Math.log(1 - pred + eps))
    }
    w1 -= learningRate * (dw1 / n)
    w2 -= learningRate * (dw2 / n)
    b -= learningRate * (db / n)
    if (iter % Math.max(1, Math.floor(iterations / 40)) === 0 || iter === iterations - 1) {
      history.push({ iter, loss: loss / n })
    }
  }

  return { w1, w2, b, history }
}

export function logisticPredictProba(weights: LogisticWeights, x: number, y: number, scale = 10) {
  const z = weights.w1 * (x / scale) + weights.w2 * (y / scale) + weights.b
  return sigmoid(z)
}

export function logisticPredict(weights: LogisticWeights, x: number, y: number, threshold = 0.5) {
  return logisticPredictProba(weights, x, y) >= threshold ? 1 : 0
}
