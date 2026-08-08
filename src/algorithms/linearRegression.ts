export interface RegressionPoint {
  x: number
  y: number
}

export interface GdStep {
  iter: number
  m: number
  b: number
  mse: number
}

export function computeMSE(points: RegressionPoint[], m: number, b: number): number {
  if (points.length === 0) return 0
  let sum = 0
  for (const p of points) {
    const pred = m * p.x + b
    sum += (p.y - pred) ** 2
  }
  return sum / points.length
}

// Runs full gradient descent up-front and returns every iteration's state,
// so the UI can scrub/animate through the training process.
export function runGradientDescent(
  points: RegressionPoint[],
  opts: { learningRate: number; iterations: number },
): GdStep[] {
  const { learningRate, iterations } = opts
  let m = 0
  let b = 0
  const n = points.length || 1
  const steps: GdStep[] = []
  // normalize x for stable gradients, we will store real-space m/b
  const scale = 10

  for (let iter = 0; iter < iterations; iter++) {
    let dm = 0
    let db = 0
    for (const p of points) {
      const nx = p.x / scale
      const pred = m * nx + b
      const err = pred - p.y
      dm += err * nx
      db += err
    }
    m -= learningRate * (dm / n)
    b -= learningRate * (db / n)
    const realM = m / scale
    const mse = computeMSE(points, realM, b)
    steps.push({ iter, m: realM, b, mse })
  }
  return steps
}
