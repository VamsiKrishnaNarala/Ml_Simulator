export interface Point2D {
  x: number
  y: number
  label: number // class label (0,1,2...) or bucket for regression noise
}

export type DatasetKind = 'blobs' | 'moons' | 'circles' | 'linear' | 'xor' | 'noise'

export interface RegressionPoint {
  x: number
  y: number
}

export type ClassifierKind =
  | 'knn'
  | 'logistic'
  | 'decisionTree'
  | 'naiveBayes'

export interface ClassifierModel {
  predict: (x: number, y: number) => number
  predictProba?: (x: number, y: number) => number
}

export interface ConfusionCounts {
  tp: number
  fp: number
  fn: number
  tn: number
}
