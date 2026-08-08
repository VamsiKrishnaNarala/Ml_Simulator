import type { Point2D } from '../types'

interface ClassStats {
  label: number
  prior: number
  meanX: number
  meanY: number
  varX: number
  varY: number
}

export interface NaiveBayesModel {
  classes: ClassStats[]
}

function gaussianPdf(x: number, mean: number, variance: number) {
  const v = Math.max(variance, 1e-3)
  const coeff = 1 / Math.sqrt(2 * Math.PI * v)
  return coeff * Math.exp(-((x - mean) ** 2) / (2 * v))
}

export function trainNaiveBayes(points: Point2D[]): NaiveBayesModel {
  const labels = Array.from(new Set(points.map((p) => p.label)))
  const classes: ClassStats[] = labels.map((label) => {
    const subset = points.filter((p) => p.label === label)
    const meanX = subset.reduce((s, p) => s + p.x, 0) / subset.length
    const meanY = subset.reduce((s, p) => s + p.y, 0) / subset.length
    const varX = subset.reduce((s, p) => s + (p.x - meanX) ** 2, 0) / subset.length
    const varY = subset.reduce((s, p) => s + (p.y - meanY) ** 2, 0) / subset.length
    return { label, prior: subset.length / points.length, meanX, meanY, varX, varY }
  })
  return { classes }
}

export function naiveBayesPredict(model: NaiveBayesModel, x: number, y: number): number {
  let bestLabel = 0
  let bestScore = -Infinity
  for (const c of model.classes) {
    const score =
      Math.log(c.prior + 1e-9) +
      Math.log(gaussianPdf(x, c.meanX, c.varX) + 1e-9) +
      Math.log(gaussianPdf(y, c.meanY, c.varY) + 1e-9)
    if (score > bestScore) {
      bestScore = score
      bestLabel = c.label
    }
  }
  return bestLabel
}
