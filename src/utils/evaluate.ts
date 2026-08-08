import type { Point2D, ConfusionCounts } from '../types'
import { makeRng } from '../datasets/generators'

export function trainTestSplit(points: Point2D[], trainRatio: number, seed = 11) {
  const rng = makeRng(seed)
  const shuffled = [...points].sort(() => rng() - 0.5)
  const splitAt = Math.round(shuffled.length * trainRatio)
  return {
    train: shuffled.slice(0, splitAt),
    test: shuffled.slice(splitAt),
  }
}

export function confusionMatrix(
  actual: Point2D[],
  predict: (x: number, y: number) => number,
): ConfusionCounts {
  let tp = 0,
    fp = 0,
    fn = 0,
    tn = 0
  for (const p of actual) {
    const pred = predict(p.x, p.y)
    if (p.label === 1 && pred === 1) tp++
    else if (p.label === 0 && pred === 1) fp++
    else if (p.label === 1 && pred === 0) fn++
    else tn++
  }
  return { tp, fp, fn, tn }
}

export function metricsFromConfusion(c: ConfusionCounts) {
  const total = c.tp + c.fp + c.fn + c.tn || 1
  const accuracy = (c.tp + c.tn) / total
  const precision = c.tp + c.fp > 0 ? c.tp / (c.tp + c.fp) : 0
  const recall = c.tp + c.fn > 0 ? c.tp / (c.tp + c.fn) : 0
  const specificity = c.tn + c.fp > 0 ? c.tn / (c.tn + c.fp) : 0
  const f1 = precision + recall > 0 ? (2 * precision * recall) / (precision + recall) : 0
  return { accuracy, precision, recall, specificity, f1 }
}
