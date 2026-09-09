import { useMemo, useState } from 'react'
import { Info, RotateCcw, TrendingUp, AlertTriangle, CheckCircle2, ChevronDown } from 'lucide-react'
import Plot from '../Plot'
import { Panel, Eyebrow, SliderControl, SegmentedControl, StatCard, InsightBox } from '../ui'
import { generateDataset, DATASET_PRESETS } from '../../datasets/generators'
import type { DatasetKind, Point2D } from '../../types'
import { trainClassifier, ALGO_META, type AlgoId } from '../../algorithms/classifiers'
import { trainTestSplit, confusionMatrix, metricsFromConfusion } from '../../utils/evaluate'
import { kNearest } from '../../algorithms/knn'

const ALGOS: AlgoId[] = ['knn', 'logistic', 'decisionTree', 'naiveBayes', 'svm', 'randomForest']

// ------- ROC-AUC approximation via trapezoidal rule -------
function estimateRocAuc(
  testPoints: Point2D[],
  predictProba: ((x: number, y: number) => number) | undefined,
  predict: (x: number, y: number) => number,
): number {
  if (!predictProba) {
    // Use 0/1 predictions to get a rough AUC (either 0.5 or accuracy-based)
    const tp = testPoints.filter((p) => p.label === 1 && predict(p.x, p.y) === 1).length
    const fp = testPoints.filter((p) => p.label === 0 && predict(p.x, p.y) === 1).length
    const fn = testPoints.filter((p) => p.label === 1 && predict(p.x, p.y) === 0).length
    const tn = testPoints.filter((p) => p.label === 0 && predict(p.x, p.y) === 0).length
    const tpr = tp + fn > 0 ? tp / (tp + fn) : 0
    const fpr = fp + tn > 0 ? fp / (fp + tn) : 0
    return 0.5 * (tpr + (1 - fpr)) // rough estimate
  }
  const thresholds = Array.from({ length: 21 }, (_, i) => i / 20)
  const points: { tpr: number; fpr: number }[] = []
  for (const t of thresholds) {
    let tp = 0, fp = 0, fn = 0, tn = 0
    for (const p of testPoints) {
      const prob = predictProba(p.x, p.y)
      const pred = prob >= t ? 1 : 0
      if (p.label === 1 && pred === 1) tp++
      else if (p.label === 0 && pred === 1) fp++
      else if (p.label === 1 && pred === 0) fn++
      else tn++
    }
    const tpr = tp + fn > 0 ? tp / (tp + fn) : 0
    const fpr = fp + tn > 0 ? fp / (fp + tn) : 0
    points.push({ tpr, fpr })
  }
  points.sort((a, b) => a.fpr - b.fpr)
  let auc = 0
  for (let i = 1; i < points.length; i++) {
    auc += (points[i].fpr - points[i - 1].fpr) * (points[i].tpr + points[i - 1].tpr) / 2
  }
  return Math.min(1, Math.max(0, auc))
}

// ------- Log Loss -------
function computeLogLoss(
  testPoints: Point2D[],
  predictProba: ((x: number, y: number) => number) | undefined,
  predict: (x: number, y: number) => number,
): number {
  const eps = 1e-7
  if (!predictProba) {
    // Use hard predictions
    let loss = 0
    for (const p of testPoints) {
      const pred = predict(p.x, p.y)
      const prob = pred === 1 ? 1 - eps : eps
      loss += p.label === 1 ? -Math.log(prob) : -Math.log(1 - prob)
    }
    return loss / testPoints.length
  }
  let loss = 0
  for (const p of testPoints) {
    const prob = Math.min(Math.max(predictProba(p.x, p.y), eps), 1 - eps)
    loss += p.label === 1 ? -Math.log(prob) : -Math.log(1 - prob)
  }
  return loss / testPoints.length
}

// ------- Imbalance detection -------
function detectImbalance(points: Point2D[]): {
  isImbalanced: boolean
  isStronglyImbalanced: boolean
  classCounts: Map<number, number>
  majorityPct: number
} {
  const counts = new Map<number, number>()
  for (const p of points) counts.set(p.label, (counts.get(p.label) ?? 0) + 1)
  const total = points.length
  const max = Math.max(...Array.from(counts.values()))
  const majorityPct = total > 0 ? max / total : 0
  return {
    isImbalanced: majorityPct > 0.7,
    isStronglyImbalanced: majorityPct > 0.85,
    classCounts: counts,
    majorityPct,
  }
}

interface MetricCardProps {
  label: string
  value: string
  formula: string
  explanation: string
  direction: 'higher' | 'lower'
  highlight?: boolean
  warning?: boolean
}

function MetricCard({ label, value, formula, explanation, direction, highlight, warning }: MetricCardProps) {
  const [showTooltip, setShowTooltip] = useState(false)
  return (
    <div
      className={`relative rounded-xl border p-3 transition ${
        highlight
          ? 'border-primary/40 bg-primary/5'
          : warning
          ? 'border-amber-400/30 bg-amber-400/5'
          : 'border-graphite-600/60 bg-graphite-900/60'
      }`}
    >
      <div className="flex items-start justify-between gap-1">
        <div className="min-w-0">
          <p className="font-mono text-[10px] uppercase tracking-wider text-graphite-500 truncate">{label}</p>
          <p
            className={`mt-1 font-display text-xl font-semibold ${
              highlight ? 'text-primary' : warning ? 'text-amber-400' : 'text-paper'
            }`}
          >
            {value}
          </p>
        </div>
        <button
          className="mt-0.5 shrink-0"
          onMouseEnter={() => setShowTooltip(true)}
          onMouseLeave={() => setShowTooltip(false)}
          onFocus={() => setShowTooltip(true)}
          onBlur={() => setShowTooltip(false)}
          aria-label={`Info for ${label}`}
        >
          <Info className="h-3.5 w-3.5 text-graphite-500 hover:text-primary transition" />
        </button>
      </div>
      <p className="mt-1 font-mono text-[10px] text-graphite-500">
        {direction === 'higher' ? '↑ higher is better' : '↓ lower is better'}
      </p>
      {showTooltip && (
        <div className="absolute right-0 top-full z-50 mt-1 w-56 rounded-xl border border-graphite-600 bg-graphite-900 p-3 shadow-xl text-xs">
          <p className="font-mono text-primary mb-1">{formula}</p>
          <p className="text-graphite-500 leading-relaxed">{explanation}</p>
        </div>
      )}
    </div>
  )
}

export default function ClassifyMode() {
  const [datasetKind, setDatasetKind] = useState<DatasetKind>('moons')
  const [samples, setSamples] = useState(120)
  const [noise, setNoise] = useState(0.25)
  const [trainSplit, setTrainSplit] = useState(80)
  const [algo, setAlgo] = useState<AlgoId>('knn')
  const [k, setK] = useState(5)
  const [maxDepth, setMaxDepth] = useState(4)
  const [numTrees, setNumTrees] = useState(9)
  const [threshold, setThreshold] = useState(0.5)
  const [seed, setSeed] = useState(42)
  const [queryPoint, setQueryPoint] = useState<{ x: number; y: number } | null>(null)
  const [extraPoints, setExtraPoints] = useState<Point2D[]>([])
  const [showDataProfile, setShowDataProfile] = useState(false)
  const [showTrainingInfo, setShowTrainingInfo] = useState(false)

  const baseData = useMemo(
    () => generateDataset({ kind: datasetKind, samples, noise, seed, classSeparation: 0.6 }),
    [datasetKind, samples, noise, seed],
  )
  const allPoints = useMemo(() => [...baseData, ...extraPoints], [baseData, extraPoints])

  const { train, test } = useMemo(
    () => trainTestSplit(allPoints, trainSplit / 100, seed + 1),
    [allPoints, trainSplit, seed],
  )

  const model = useMemo(
    () =>
      trainClassifier(algo, train, {
        k,
        maxDepth,
        numTrees,
        threshold,
        learningRate: algo === 'svm' ? 0.3 : 0.5,
        iterations: 300,
      }),
    [algo, train, k, maxDepth, numTrees, threshold],
  )

  const evalSet = test.length > 0 ? test : train

  const confusion = useMemo(
    () => confusionMatrix(evalSet, model.predict),
    [evalSet, model],
  )
  const metrics = useMemo(() => metricsFromConfusion(confusion), [confusion])

  const rocAuc = useMemo(
    () => estimateRocAuc(evalSet, model.predictProba, model.predict),
    [evalSet, model],
  )

  const logLoss = useMemo(
    () => computeLogLoss(evalSet, model.predictProba, model.predict),
    [evalSet, model],
  )

  const imbalance = useMemo(() => detectImbalance(allPoints), [allPoints])

  const neighbors = useMemo(() => {
    if (algo !== 'knn' || !queryPoint) return null
    return kNearest(train, queryPoint.x, queryPoint.y, k)
  }, [algo, queryPoint, train, k])

  const neighborKeys = useMemo(() => {
    if (!neighbors) return undefined
    const set = new Set<number>()
    neighbors.forEach((n) => {
      const idx = train.findIndex((p) => p.x === n.x && p.y === n.y && p.label === n.label)
      if (idx >= 0) set.add(idx)
    })
    return set
  }, [neighbors, train])

  const voteCounts = useMemo(() => {
    if (!neighbors) return null
    const counts = new Map<number, number>()
    neighbors.forEach((n) => counts.set(n.label, (counts.get(n.label) ?? 0) + 1))
    return counts
  }, [neighbors])

  function handleCanvasClick(x: number, y: number) {
    if (algo === 'knn') {
      setQueryPoint({ x, y })
    } else {
      setExtraPoints((pts) => [...pts, { x, y, label: pts.length % 2 }])
    }
  }

  function resetExtras() {
    setExtraPoints([])
    setQueryPoint(null)
  }

  // Metric priority based on imbalance
  const primaryMetric = imbalance.isImbalanced ? 'f1' : 'accuracy'

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-[300px_1fr_300px]">
      {/* Left: dataset + algorithm controls */}
      <div className="space-y-4">
        <Panel>
          <Eyebrow>Dataset</Eyebrow>
          <div className="space-y-4">
            <div>
              <p className="mb-1.5 font-mono text-xs text-graphite-500">Shape</p>
              <div className="grid grid-cols-2 gap-1.5">
                {DATASET_PRESETS.map((d) => (
                  <button
                    key={d.id}
                    onClick={() => setDatasetKind(d.id)}
                    title={d.blurb}
                    className={`rounded-lg border px-2 py-1.5 font-mono text-[11px] transition ${
                      datasetKind === d.id
                        ? 'border-primary bg-primary/10 text-primary'
                        : 'border-graphite-600 text-graphite-500 hover:text-paper'
                    }`}
                  >
                    {d.label}
                  </button>
                ))}
              </div>
            </div>
            <SliderControl label="Samples" value={samples} min={20} max={300} step={10} onChange={setSamples} />
            <SliderControl
              label="Noise"
              value={noise}
              min={0}
              max={1}
              step={0.05}
              onChange={setNoise}
              formatValue={(v) => v.toFixed(2)}
            />
            <SliderControl
              label="Train / test split"
              value={trainSplit}
              min={10}
              max={95}
              step={5}
              onChange={setTrainSplit}
              formatValue={(v) => `${v}% / ${100 - v}%`}
            />
            <button
              onClick={() => setSeed((s) => s + 1)}
              className="btn-secondary w-full !py-1.5 text-sm justify-center"
            >
              <RotateCcw className="h-3.5 w-3.5" /> Regenerate dataset
            </button>
          </div>
        </Panel>

        {/* Imbalance warning */}
        {imbalance.isImbalanced && (
          <div
            className={`rounded-xl border p-3 text-xs ${
              imbalance.isStronglyImbalanced
                ? 'border-rose/30 bg-rose/5 text-rose'
                : 'border-amber-400/30 bg-amber-400/5 text-amber-400'
            }`}
          >
            <div className="flex items-start gap-2">
              <AlertTriangle className="h-3.5 w-3.5 mt-0.5 shrink-0" />
              <div>
                <p className="font-semibold mb-0.5">
                  {imbalance.isStronglyImbalanced ? 'Strong class imbalance' : 'Class imbalance detected'}
                </p>
                <p className="opacity-80">
                  Majority class: {(imbalance.majorityPct * 100).toFixed(0)}%. Prioritizing F1, Recall, and
                  ROC-AUC over Accuracy.
                </p>
              </div>
            </div>
          </div>
        )}

        <Panel>
          <Eyebrow>Algorithm</Eyebrow>
          <div className="flex flex-col gap-1.5">
            {ALGOS.map((id) => (
              <button
                key={id}
                onClick={() => setAlgo(id)}
                className={`rounded-lg border px-3 py-2 text-left font-mono text-xs transition ${
                  algo === id
                    ? 'border-primary bg-primary/10 text-primary'
                    : 'border-graphite-600 text-graphite-500 hover:text-paper'
                }`}
              >
                {ALGO_META[id].label}
              </button>
            ))}
          </div>

          <div className="mt-4 space-y-4">
            {algo === 'knn' && (
              <SliderControl label="K (neighbors)" value={k} min={1} max={15} step={2} onChange={setK} />
            )}
            {algo === 'decisionTree' && (
              <SliderControl label="Max depth" value={maxDepth} min={1} max={10} step={1} onChange={setMaxDepth} />
            )}
            {algo === 'randomForest' && (
              <>
                <SliderControl label="Number of trees" value={numTrees} min={1} max={25} step={2} onChange={setNumTrees} />
                <SliderControl label="Max depth" value={maxDepth} min={1} max={8} step={1} onChange={setMaxDepth} />
              </>
            )}
            {algo === 'logistic' && (
              <SliderControl
                label="Decision threshold"
                value={threshold}
                min={0.05}
                max={0.95}
                step={0.05}
                onChange={setThreshold}
                formatValue={(v) => v.toFixed(2)}
              />
            )}
          </div>
        </Panel>

        {/* Data Profile */}
        <Panel className="!p-0 overflow-hidden">
          <button
            onClick={() => setShowDataProfile((v) => !v)}
            className="flex w-full items-center justify-between px-4 py-3 text-left"
          >
            <span className="font-mono text-xs text-graphite-500">Dataset Profile</span>
            <ChevronDown
              className={`h-3.5 w-3.5 text-graphite-500 transition-transform ${showDataProfile ? 'rotate-180' : ''}`}
            />
          </button>
          {showDataProfile && (
            <div className="border-t border-graphite-700/70 px-4 py-3 space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-2">
                <div className="rounded-lg border border-graphite-600/40 bg-graphite-900/40 p-2">
                  <p className="text-[10px] text-graphite-500 mb-0.5">Total points</p>
                  <p className="font-display font-semibold text-paper">{allPoints.length}</p>
                </div>
                <div className="rounded-lg border border-graphite-600/40 bg-graphite-900/40 p-2">
                  <p className="text-[10px] text-graphite-500 mb-0.5">Features</p>
                  <p className="font-display font-semibold text-paper">2 (x, y)</p>
                </div>
                <div className="rounded-lg border border-graphite-600/40 bg-graphite-900/40 p-2">
                  <p className="text-[10px] text-graphite-500 mb-0.5">Train</p>
                  <p className="font-display font-semibold text-paper">{train.length}</p>
                </div>
                <div className="rounded-lg border border-graphite-600/40 bg-graphite-900/40 p-2">
                  <p className="text-[10px] text-graphite-500 mb-0.5">Test</p>
                  <p className="font-display font-semibold text-paper">{test.length}</p>
                </div>
              </div>
              <div>
                <p className="text-[10px] text-graphite-500 mb-1.5">Class Distribution</p>
                {Array.from(imbalance.classCounts.entries()).map(([cls, cnt]) => (
                  <div key={cls} className="flex items-center gap-2 mb-1">
                    <span className="font-mono text-[10px] text-graphite-500 w-12">Class {cls}</span>
                    <div className="flex-1 h-1.5 rounded-full bg-graphite-700/60">
                      <div
                        className="h-full rounded-full bg-primary"
                        style={{ width: `${((cnt / allPoints.length) * 100).toFixed(0)}%` }}
                      />
                    </div>
                    <span className="font-mono text-[10px] text-graphite-500">
                      {cnt} ({((cnt / allPoints.length) * 100).toFixed(0)}%)
                    </span>
                  </div>
                ))}
              </div>
              <div className="space-y-1">
                <p className="text-[10px] text-graphite-500 mb-1">Preprocessing</p>
                <p className="flex items-center gap-1.5 text-emerald-400">
                  <CheckCircle2 className="h-3 w-3" /> Features normalized to [0,1]
                </p>
                <p className="flex items-center gap-1.5 text-emerald-400">
                  <CheckCircle2 className="h-3 w-3" /> Shuffled before split
                </p>
                {imbalance.isImbalanced && (
                  <p className="flex items-center gap-1.5 text-amber-400">
                    <AlertTriangle className="h-3 w-3" /> Consider class weights or SMOTE
                  </p>
                )}
              </div>
              <div className="rounded-lg border border-graphite-600/40 bg-graphite-900/40 p-2">
                <p className="text-[10px] text-graphite-500 mb-0.5">Model Input</p>
                <p className="font-mono text-[10px] text-paper">X ∈ ℝ^({train.length} × 2)</p>
                <p className="font-mono text-[10px] text-graphite-500">n={train.length} samples, d=2 features</p>
              </div>
            </div>
          )}
        </Panel>
      </div>

      {/* Center: visualization */}
      <div className="space-y-3">
        <Panel className="!p-3">
          <div className="mb-2 flex items-center justify-between px-1">
            <p className="font-mono text-xs text-graphite-500">
              {algo === 'knn' ? 'Click the graph to drop a test point' : 'Click the graph to add a labeled point'}
            </p>
            {extraPoints.length > 0 || queryPoint ? (
              <button onClick={resetExtras} className="font-mono text-[11px] text-primary hover:underline">
                clear added points
              </button>
            ) : null}
          </div>
          <Plot
            points={train}
            predict={model.predict}
            highlightPoint={queryPoint}
            neighborKeys={neighborKeys}
            onCanvasClick={handleCanvasClick}
            height={440}
            ariaLabel="Classification decision boundary plot"
          />
        </Panel>

        {algo === 'knn' && voteCounts && neighbors && (
          <InsightBox>
            <p className="font-mono text-xs text-graphite-500 mb-1">Nearest {k} neighbors vote:</p>
            <div className="flex flex-wrap gap-3">
              {Array.from(voteCounts.entries()).map(([label, count]) => (
                <span key={label} className="font-mono text-sm">
                  class {label}: <strong className="text-primary">{count}</strong>
                </span>
              ))}
            </div>
            <p className="mt-2 text-sm">
              Prediction → <strong className="text-primary">class {model.predict(queryPoint!.x, queryPoint!.y)}</strong>.
              KNN looks at the {k} closest points and lets them vote.
            </p>
          </InsightBox>
        )}

        {/* Training info expandable */}
        <Panel className="!p-0 overflow-hidden">
          <button
            onClick={() => setShowTrainingInfo((v) => !v)}
            className="flex w-full items-center justify-between px-4 py-3"
          >
            <span className="flex items-center gap-2 font-mono text-xs text-graphite-500">
              <TrendingUp className="h-3.5 w-3.5" /> Model Training Info
            </span>
            <ChevronDown
              className={`h-3.5 w-3.5 text-graphite-500 transition-transform ${showTrainingInfo ? 'rotate-180' : ''}`}
            />
          </button>
          {showTrainingInfo && (
            <div className="border-t border-graphite-700/70 px-4 py-3 space-y-2 text-xs text-graphite-500">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <p className="text-[10px] uppercase tracking-wider mb-0.5">Algorithm</p>
                  <p className="text-paper font-mono">{ALGO_META[algo].label}</p>
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-wider mb-0.5">Training time</p>
                  <p className="text-paper font-mono">{model.trainingTimeMs.toFixed(1)}ms</p>
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-wider mb-0.5">Complexity</p>
                  <p className="text-paper">{ALGO_META[algo].complexity}</p>
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-wider mb-0.5">Best for</p>
                  <p className="text-paper">{ALGO_META[algo].bestFor}</p>
                </div>
              </div>
              <div className="rounded-lg border border-graphite-600/40 bg-graphite-900/40 p-2 mt-2">
                <p className="text-[10px] text-graphite-500">Loss function: Binary Cross-Entropy</p>
                <p className="font-mono text-[10px] text-paper mt-0.5">L = -Σ [y·log(ŷ) + (1-y)·log(1-ŷ)]</p>
              </div>
            </div>
          )}
        </Panel>
      </div>

      {/* Right: results + metrics */}
      <div className="space-y-4">
        {/* Imbalance-aware metric priority banner */}
        {imbalance.isImbalanced && (
          <InsightBox>
            <p className="text-xs font-semibold text-paper mb-1">
              ⚠ Imbalanced dataset — metric priority adjusted
            </p>
            <p className="text-xs text-graphite-500">
              Accuracy can be misleading. Primary metrics: <strong className="text-primary">F1, Recall, ROC-AUC</strong>.
            </p>
          </InsightBox>
        )}

        <Panel>
          <Eyebrow>Results {test.length > 0 ? '(held-out test set)' : '(training set)'}</Eyebrow>
          <div className="grid grid-cols-2 gap-2.5">
            <MetricCard
              label="Accuracy"
              value={`${(metrics.accuracy * 100).toFixed(1)}%`}
              formula="(TP + TN) / (TP + TN + FP + FN)"
              explanation="Fraction of all predictions that were correct. Can be misleading on imbalanced datasets."
              direction="higher"
              highlight={primaryMetric === 'accuracy'}
              warning={imbalance.isImbalanced}
            />
            <MetricCard
              label="F1 Score"
              value={metrics.f1.toFixed(3)}
              formula="2 × (Precision × Recall) / (Precision + Recall)"
              explanation="Harmonic mean of Precision and Recall. Best metric for imbalanced datasets."
              direction="higher"
              highlight={primaryMetric === 'f1'}
            />
            <MetricCard
              label="Precision"
              value={metrics.precision.toFixed(3)}
              formula="TP / (TP + FP)"
              explanation="Of all predicted positives, how many were actually positive? High precision = few false alarms."
              direction="higher"
            />
            <MetricCard
              label="Recall"
              value={metrics.recall.toFixed(3)}
              formula="TP / (TP + FN)"
              explanation="Of all actual positives, how many did we find? High recall = few missed positives."
              direction="higher"
            />
            <MetricCard
              label="ROC-AUC"
              value={rocAuc.toFixed(3)}
              formula="Area under the ROC curve"
              explanation="Probability that the model ranks a random positive higher than a random negative. 0.5 = random, 1.0 = perfect."
              direction="higher"
              highlight={imbalance.isImbalanced}
            />
            <MetricCard
              label="Log Loss"
              value={logLoss.toFixed(3)}
              formula="-Σ[y·log(ŷ) + (1-y)·log(1-ŷ)] / n"
              explanation="Penalizes confident wrong predictions heavily. Lower is better."
              direction="lower"
            />
          </div>
        </Panel>

        <Panel>
          <Eyebrow>Confusion matrix</Eyebrow>
          <table className="w-full font-mono text-xs">
            <thead>
              <tr className="text-graphite-500">
                <td />
                <td className="px-2 py-1 text-center">Pred +</td>
                <td className="px-2 py-1 text-center">Pred −</td>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="pr-2 text-graphite-500">Actual +</td>
                <td className="rounded bg-primary/15 px-2 py-2 text-center text-primary">{confusion.tp}</td>
                <td className="rounded bg-rose/10 px-2 py-2 text-center text-rose">{confusion.fn}</td>
              </tr>
              <tr>
                <td className="pr-2 text-graphite-500">Actual −</td>
                <td className="rounded bg-rose/10 px-2 py-2 text-center text-rose">{confusion.fp}</td>
                <td className="rounded bg-primary/15 px-2 py-2 text-center text-primary">{confusion.tn}</td>
              </tr>
            </tbody>
          </table>
          <div className="mt-3 grid grid-cols-2 gap-1.5 text-[10px] text-graphite-500">
            <p><span className="text-primary font-semibold">TP={confusion.tp}</span> True Positive</p>
            <p><span className="text-rose font-semibold">FP={confusion.fp}</span> False Positive</p>
            <p><span className="text-rose font-semibold">FN={confusion.fn}</span> False Negative</p>
            <p><span className="text-primary font-semibold">TN={confusion.tn}</span> True Negative</p>
          </div>
        </Panel>

        <Panel>
          <div className="flex items-start gap-2">
            <Info className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
            <div>
              <p className="text-xs leading-relaxed text-graphite-500">
                <strong className="text-paper">{ALGO_META[algo].label}</strong> is best for{' '}
                {ALGO_META[algo].bestFor.toLowerCase()}.
              </p>
              {imbalance.isImbalanced ? (
                <p className="mt-1 text-xs text-amber-400">
                  For this imbalanced dataset, F1 Score ({metrics.f1.toFixed(3)}) and ROC-AUC (
                  {rocAuc.toFixed(3)}) are more meaningful than Accuracy ({(metrics.accuracy * 100).toFixed(1)}%).
                </p>
              ) : (
                <p className="mt-1 text-xs text-graphite-500">
                  Dataset is balanced. Accuracy ({(metrics.accuracy * 100).toFixed(1)}%) and F1 ({metrics.f1.toFixed(3)}) are both reliable metrics.
                </p>
              )}
            </div>
          </div>
        </Panel>
      </div>
    </div>
  )
}
