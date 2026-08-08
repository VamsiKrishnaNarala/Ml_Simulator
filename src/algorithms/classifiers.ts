import type { Point2D } from '../types'
import { makeKnnClassifier } from './knn'
import { trainLogisticRegression, logisticPredict, logisticPredictProba } from './logisticRegression'
import { buildTree, treePredict } from './decisionTree'
import { trainNaiveBayes, naiveBayesPredict } from './naiveBayes'
import { trainLinearSvm, svmPredict } from './svmForest'
import { trainRandomForest, forestPredict } from './svmForest'

export type AlgoId =
  | 'knn'
  | 'logistic'
  | 'decisionTree'
  | 'naiveBayes'
  | 'svm'
  | 'randomForest'

export const ALGO_META: Record<AlgoId, { label: string; short: string; complexity: 'Low' | 'Medium' | 'High'; bestFor: string }> = {
  knn: { label: 'K-Nearest Neighbors', short: 'KNN', complexity: 'Low', bestFor: 'Simple, local patterns' },
  logistic: { label: 'Logistic Regression', short: 'LogReg', complexity: 'Low', bestFor: 'Linearly separable data' },
  decisionTree: { label: 'Decision Tree', short: 'Tree', complexity: 'Medium', bestFor: 'Rule-like, interpretable splits' },
  naiveBayes: { label: 'Naive Bayes', short: 'NB', complexity: 'Low', bestFor: 'Fast probabilistic baselines' },
  svm: { label: 'Support Vector Machine', short: 'SVM', complexity: 'Medium', bestFor: 'Max-margin linear boundaries' },
  randomForest: { label: 'Random Forest', short: 'Forest', complexity: 'High', bestFor: 'Noisy, non-linear data' },
}

export interface TrainedClassifier {
  predict: (x: number, y: number) => number
  predictProba?: (x: number, y: number) => number
  trainingTimeMs: number
  extra?: Record<string, unknown>
}

export interface ClassifierParams {
  k?: number
  learningRate?: number
  iterations?: number
  maxDepth?: number
  numTrees?: number
  threshold?: number
}

export function trainClassifier(algo: AlgoId, points: Point2D[], params: ClassifierParams = {}): TrainedClassifier {
  const start = performance.now()
  switch (algo) {
    case 'knn': {
      const model = makeKnnClassifier(points, params.k ?? 5)
      return { predict: model.predict, trainingTimeMs: performance.now() - start }
    }
    case 'logistic': {
      const weights = trainLogisticRegression(points, {
        learningRate: params.learningRate ?? 0.5,
        iterations: params.iterations ?? 300,
      })
      return {
        predict: (x, y) => logisticPredict(weights, x, y, params.threshold ?? 0.5),
        predictProba: (x, y) => logisticPredictProba(weights, x, y),
        trainingTimeMs: performance.now() - start,
        extra: { weights },
      }
    }
    case 'decisionTree': {
      const tree = buildTree(points, params.maxDepth ?? 4)
      return { predict: (x, y) => treePredict(tree, x, y), trainingTimeMs: performance.now() - start, extra: { tree } }
    }
    case 'naiveBayes': {
      const model = trainNaiveBayes(points)
      return { predict: (x, y) => naiveBayesPredict(model, x, y), trainingTimeMs: performance.now() - start }
    }
    case 'svm': {
      const weights = trainLinearSvm(points, {
        learningRate: params.learningRate ?? 0.3,
        iterations: params.iterations ?? 200,
      })
      return { predict: (x, y) => svmPredict(weights, x, y), trainingTimeMs: performance.now() - start, extra: { weights } }
    }
    case 'randomForest': {
      const model = trainRandomForest(points, { numTrees: params.numTrees ?? 9, maxDepth: params.maxDepth ?? 4 })
      return { predict: (x, y) => forestPredict(model, x, y), trainingTimeMs: performance.now() - start }
    }
  }
}
