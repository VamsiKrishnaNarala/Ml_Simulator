export function computeMAE(y: number[], yHat: number[]): number {
  if (y.length === 0 || y.length !== yHat.length) return 0;
  let sum = 0;
  for (let i = 0; i < y.length; i++) {
    sum += Math.abs(y[i] - yHat[i]);
  }
  return sum / y.length;
}

export function computeMSE(y: number[], yHat: number[]): number {
  if (y.length === 0 || y.length !== yHat.length) return 0;
  let sum = 0;
  for (let i = 0; i < y.length; i++) {
    const diff = y[i] - yHat[i];
    sum += diff * diff;
  }
  return sum / y.length;
}

export function computeRMSE(y: number[], yHat: number[]): number {
  return Math.sqrt(computeMSE(y, yHat));
}

export function computeR2(y: number[], yHat: number[]): number {
  if (y.length === 0 || y.length !== yHat.length) return 0;
  
  let yMean = 0;
  for (let i = 0; i < y.length; i++) yMean += y[i];
  yMean /= y.length;
  
  let ssTot = 0;
  let ssRes = 0;
  for (let i = 0; i < y.length; i++) {
    const diffTot = y[i] - yMean;
    const diffRes = y[i] - yHat[i];
    ssTot += diffTot * diffTot;
    ssRes += diffRes * diffRes;
  }
  
  if (ssTot === 0) return 0;
  return 1 - (ssRes / ssTot);
}

export function computeAdjustedR2(y: number[], yHat: number[], p: number): number {
  const n = y.length;
  if (n <= p + 1) return NaN;
  const r2 = computeR2(y, yHat);
  return 1 - ((1 - r2) * (n - 1)) / (n - p - 1);
}

export function computeMAPE(y: number[], yHat: number[]): number {
  if (y.length === 0 || y.length !== yHat.length) return NaN;
  let sum = 0;
  let count = 0;
  for (let i = 0; i < y.length; i++) {
    if (y[i] !== 0) {
      sum += Math.abs((y[i] - yHat[i]) / y[i]);
      count++;
    }
  }
  if (count === 0) return NaN;
  return (100 / count) * sum;
}

export interface RegressionMetrics {
  mae: number;
  mse: number;
  rmse: number;
  r2: number;
  adjustedR2: number;
  mape: number;
  n: number;
  p: number;
}

export function computeAllRegressionMetrics(
  y: number[],
  yHat: number[],
  p: number
): RegressionMetrics {
  return {
    mae: computeMAE(y, yHat),
    mse: computeMSE(y, yHat),
    rmse: computeRMSE(y, yHat),
    r2: computeR2(y, yHat),
    adjustedR2: computeAdjustedR2(y, yHat, p),
    mape: computeMAPE(y, yHat),
    n: y.length,
    p
  };
}

export interface MetricMeta {
  key: keyof RegressionMetrics;
  name: string;
  formula: string;
  explanation: string;
  direction: 'higher' | 'lower';
  goodScore: string;
}

export const REGRESSION_METRIC_META: MetricMeta[] = [
  {
    key: 'mae',
    name: 'Mean Absolute Error (MAE)',
    formula: '(1/n) * Σ|y_i - ŷ_i|',
    explanation: 'Average absolute difference between predictions and actual values.',
    direction: 'lower',
    goodScore: 'Closer to 0'
  },
  {
    key: 'mse',
    name: 'Mean Squared Error (MSE)',
    formula: '(1/n) * Σ(y_i - ŷ_i)²',
    explanation: 'Average squared difference between predictions and actual values.',
    direction: 'lower',
    goodScore: 'Closer to 0'
  },
  {
    key: 'rmse',
    name: 'Root Mean Squared Error (RMSE)',
    formula: '√MSE',
    explanation: 'Square root of MSE, interpretable in the same units as the target variable.',
    direction: 'lower',
    goodScore: 'Closer to 0'
  },
  {
    key: 'r2',
    name: 'R-squared (R²)',
    formula: '1 - SS_res / SS_tot',
    explanation: 'Proportion of variance in the target variable explained by the model.',
    direction: 'higher',
    goodScore: 'Closer to 1'
  },
  {
    key: 'adjustedR2',
    name: 'Adjusted R-squared',
    formula: '1 - ((1 - R²)(n - 1)) / (n - p - 1)',
    explanation: 'R-squared adjusted for the number of predictors in the model.',
    direction: 'higher',
    goodScore: 'Closer to 1'
  },
  {
    key: 'mape',
    name: 'Mean Absolute Percentage Error (MAPE)',
    formula: '(100/n) * Σ |( y_i - ŷ_i ) / y_i|',
    explanation: 'Average absolute percentage error of predictions.',
    direction: 'lower',
    goodScore: 'Lower percentage is better'
  }
];
