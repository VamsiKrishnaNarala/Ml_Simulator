import { useMemo, useState } from 'react'
import { Info, RotateCcw } from 'lucide-react'
import Plot from '../Plot'
import { Panel, Eyebrow, SliderControl, SegmentedControl, StatCard, InsightBox } from '../ui'
import { generateDataset, DATASET_PRESETS } from '../../datasets/generators'
import type { DatasetKind, Point2D } from '../../types'
import { trainClassifier, ALGO_META, type AlgoId } from '../../algorithms/classifiers'
import { trainTestSplit, confusionMatrix, metricsFromConfusion } from '../../utils/evaluate'
import { kNearest } from '../../algorithms/knn'

const ALGOS: AlgoId[] = ['knn', 'logistic', 'decisionTree', 'naiveBayes', 'svm', 'randomForest']

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

  const baseData = useMemo(
    () => generateDataset({ kind: datasetKind, samples, noise, seed, classSeparation: 0.6 }),
    [datasetKind, samples, noise, seed],
  )
  const allPoints = useMemo(() => [...baseData, ...extraPoints], [baseData, extraPoints])

  const { train, test } = useMemo(() => trainTestSplit(allPoints, trainSplit / 100, seed + 1), [allPoints, trainSplit, seed])

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

  const confusion = useMemo(() => confusionMatrix(test.length ? test : train, model.predict), [test, train, model])
  const metrics = useMemo(() => metricsFromConfusion(confusion), [confusion])

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
      // add a new labeled point of the "currently minority" class, cycling classes on shift not supported here
      setExtraPoints((pts) => [...pts, { x, y, label: pts.length % 2 }])
    }
  }

  function resetExtras() {
    setExtraPoints([])
    setQueryPoint(null)
  }

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-[300px_1fr_280px]">
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
      </div>

      {/* Center: visualization */}
      <div className="space-y-3">
        <Panel className="!p-3">
          <div className="mb-2 flex items-center justify-between px-1">
            <p className="font-mono text-xs text-graphite-500">
              {algo === 'knn'
                ? 'Click the graph to drop a test point'
                : 'Click the graph to add a labeled point'}
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
      </div>

      {/* Right: results */}
      <div className="space-y-4">
        <Panel>
          <Eyebrow>Results {test.length > 0 ? '(held-out test set)' : '(training set)'}</Eyebrow>
          <div className="grid grid-cols-2 gap-2.5">
            <StatCard label="Accuracy" value={`${(metrics.accuracy * 100).toFixed(1)}%`} />
            <StatCard label="F1 score" value={metrics.f1.toFixed(2)} />
            <StatCard label="Precision" value={metrics.precision.toFixed(2)} />
            <StatCard label="Recall" value={metrics.recall.toFixed(2)} />
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
        </Panel>

        <Panel>
          <div className="flex items-start gap-2">
            <Info className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
            <p className="text-xs leading-relaxed text-graphite-500">
              <strong className="text-paper">{ALGO_META[algo].label}</strong> is best for{' '}
              {ALGO_META[algo].bestFor.toLowerCase()}. Complexity: {ALGO_META[algo].complexity}.
            </p>
          </div>
        </Panel>
      </div>
    </div>
  )
}
