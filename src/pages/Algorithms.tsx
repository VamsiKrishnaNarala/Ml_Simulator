import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ChevronDown, ArrowRight } from 'lucide-react'
import { Panel, Eyebrow } from '../components/ui'

interface AlgoDoc {
  id: string
  name: string
  simple: string
  visual: string[]
  math: string
  playgroundMode: 'classify' | 'regress' | 'cluster'
}

const docs: AlgoDoc[] = [
  {
    id: 'knn',
    name: 'K-Nearest Neighbors',
    simple: 'To guess a new point\'s class, look at its K closest neighbors and copy whichever class shows up most.',
    visual: ['Choose K', 'Find the K nearest points', 'Count each class among them', 'Take the majority', 'That\'s the prediction'],
    math: 'distance = √((x₁−x₂)² + (y₁−y₂)²) — computed to every training point, then the K smallest are kept.',
    playgroundMode: 'classify',
  },
  {
    id: 'logistic',
    name: 'Logistic Regression',
    simple: 'Draw a straight line, then turn "which side of the line" into a probability between 0 and 1.',
    visual: ['Compute a weighted sum of features', 'Squash it with a sigmoid curve', 'Get a probability', 'Compare to a threshold', 'Classify'],
    math: 'p = 1 / (1 + e^−(w₁x + w₂y + b)), trained by gradient descent on cross-entropy loss.',
    playgroundMode: 'classify',
  },
  {
    id: 'decisionTree',
    name: 'Decision Tree',
    simple: 'Ask a series of yes/no questions about the data, each one splitting it into purer and purer groups.',
    visual: ['Start with all data', 'Try every possible split', 'Pick the one that separates classes best', 'Repeat on each branch', 'Stop at a leaf'],
    math: 'Gini impurity = 1 − Σpᵢ². Each split is chosen to maximize the drop in impurity (information gain).',
    playgroundMode: 'classify',
  },
  {
    id: 'naiveBayes',
    name: 'Naive Bayes',
    simple: 'Assume each feature independently points toward a class, then multiply those hints together.',
    visual: ['Learn a mean/spread per class per feature', 'For a new point, score how "typical" it is for each class', 'Weight by how common each class is', 'Pick the highest score'],
    math: 'P(class|x,y) ∝ P(class) · P(x|class) · P(y|class), each P(feature|class) modeled as a Gaussian.',
    playgroundMode: 'classify',
  },
  {
    id: 'svm',
    name: 'Support Vector Machine',
    simple: 'Find the line that separates classes with the widest possible margin on both sides.',
    visual: ['Draw many possible separating lines', 'Measure the gap to the closest points on each side', 'Keep the line with the biggest gap', 'That\'s the decision boundary'],
    math: 'Minimizes ½‖w‖² + CΣmax(0, 1 − yᵢ(w·xᵢ+b)) — the hinge loss penalizes points inside the margin.',
    playgroundMode: 'classify',
  },
  {
    id: 'randomForest',
    name: 'Random Forest',
    simple: 'Train many different decision trees on random slices of the data, then let them vote.',
    visual: ['Sample the data with replacement, many times', 'Grow a shallow tree on each sample', 'Ask every tree for its prediction', 'Take the majority vote'],
    math: 'Bootstrap aggregation (bagging): reduces variance by averaging many high-variance, low-bias trees.',
    playgroundMode: 'classify',
  },
  {
    id: 'linearRegression',
    name: 'Linear Regression',
    simple: 'Fit the straight line that comes closest, on average, to every point in the data.',
    visual: ['Start with a random line', 'Measure how wrong it is (error)', 'Nudge the slope and intercept to reduce that error', 'Repeat until the error stops shrinking'],
    math: 'MSE = (1/n)Σ(y−ŷ)², minimized by gradient descent: m ← m − α·∂MSE/∂m.',
    playgroundMode: 'regress',
  },
  {
    id: 'kmeans',
    name: 'K-Means',
    simple: 'Guess K group centers, assign every point to its closest center, then move each center to the middle of its group. Repeat.',
    visual: ['Place K random centroids', 'Assign each point to the nearest centroid', 'Move each centroid to the average of its points', 'Repeat until nothing moves'],
    math: 'Minimizes inertia = ΣΣ‖xᵢ − centroid(cluster(xᵢ))‖² via Lloyd\'s algorithm.',
    playgroundMode: 'cluster',
  },
]

export default function Algorithms() {
  const [open, setOpen] = useState<string | null>('knn')

  return (
    <div className="mx-auto max-w-4xl px-5 py-14">
      <Eyebrow>Reference</Eyebrow>
      <h1 className="font-display text-4xl font-semibold text-paper">Algorithms, explained three ways</h1>
      <p className="mt-2 max-w-2xl text-graphite-500">
        Every algorithm gets a plain-language explanation, a step-by-step visual breakdown, and — if
        you want it — the underlying mathematics.
      </p>

      <div className="mt-8 space-y-3">
        {docs.map((d) => {
          const isOpen = open === d.id
          return (
            <Panel key={d.id} className="!p-0 overflow-hidden">
              <button
                onClick={() => setOpen(isOpen ? null : d.id)}
                className="flex w-full items-center justify-between px-5 py-4 text-left"
                aria-expanded={isOpen}
              >
                <span className="font-display text-lg font-semibold text-paper">{d.name}</span>
                <ChevronDown className={`h-4 w-4 text-graphite-500 transition-transform ${isOpen ? 'rotate-180 text-primary' : ''}`} />
              </button>
              {isOpen && (
                <div className="space-y-5 border-t border-graphite-700/70 px-5 py-5">
                  <div>
                    <p className="label-eyebrow">Simple explanation</p>
                    <p className="mt-1.5 text-graphite-500">{d.simple}</p>
                  </div>
                  <div>
                    <p className="label-eyebrow">Visual explanation</p>
                    <div className="mt-2 flex flex-wrap items-center gap-2 font-mono text-xs">
                      {d.visual.map((step, i) => (
                        <div key={i} className="flex items-center gap-2">
                          <span className="rounded-full border border-graphite-600 px-2.5 py-1 text-paper">{step}</span>
                          {i < d.visual.length - 1 && <ArrowRight className="h-3 w-3 text-graphite-600" />}
                        </div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className="label-eyebrow">Mathematical explanation</p>
                    <p className="mt-1.5 rounded-lg bg-graphite-900/70 px-3 py-2.5 font-mono text-xs leading-relaxed text-graphite-500">
                      {d.math}
                    </p>
                  </div>
                  <Link
                    to="/playground"
                    className="inline-flex items-center gap-1.5 font-mono text-xs text-primary hover:underline"
                  >
                    Try it in the playground <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              )}
            </Panel>
          )
        })}
      </div>
    </div>
  )
}
