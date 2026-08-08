import { useMemo, useState } from 'react'
import { RotateCcw } from 'lucide-react'
import Plot from '../components/Plot'
import { Panel, Eyebrow, SliderControl } from '../components/ui'
import { generateDataset, DATASET_PRESETS } from '../datasets/generators'
import type { DatasetKind } from '../types'
import { trainClassifier, ALGO_META, type AlgoId } from '../algorithms/classifiers'
import { trainTestSplit, confusionMatrix, metricsFromConfusion } from '../utils/evaluate'

const ALL_ALGOS: AlgoId[] = ['knn', 'logistic', 'decisionTree', 'naiveBayes', 'svm', 'randomForest']

export default function Compare() {
  const [datasetKind, setDatasetKind] = useState<DatasetKind>('xor')
  const [samples, setSamples] = useState(140)
  const [noise, setNoise] = useState(0.2)
  const [seed, setSeed] = useState(1)
  const [selected, setSelected] = useState<AlgoId[]>(['knn', 'logistic', 'decisionTree', 'svm'])

  const points = useMemo(
    () => generateDataset({ kind: datasetKind, samples, noise, seed, classSeparation: 0.6 }),
    [datasetKind, samples, noise, seed],
  )
  const { train, test } = useMemo(() => trainTestSplit(points, 0.8, seed + 1), [points, seed])

  const results = useMemo(
    () =>
      selected.map((algo) => {
        const model = trainClassifier(algo, train, { k: 5, maxDepth: 4, numTrees: 9, iterations: 250 })
        const confusion = confusionMatrix(test.length ? test : train, model.predict)
        const metrics = metricsFromConfusion(confusion)
        return { algo, model, metrics }
      }),
    [selected, train, test],
  )

  function toggleAlgo(id: AlgoId) {
    setSelected((prev) => (prev.includes(id) ? prev.filter((a) => a !== id) : [...prev, id]))
  }

  return (
    <div className="mx-auto max-w-[1400px] px-5 py-10">
      <Eyebrow>Compare models</Eyebrow>
      <h1 className="font-display text-3xl font-semibold text-paper">Same data, different algorithms</h1>
      <p className="mt-2 max-w-2xl text-graphite-500">
        Every model below is trained live on the exact same dataset and the exact same train/test
        split — the only thing that changes is the algorithm.
      </p>

      <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-[280px_1fr]">
        <div className="space-y-4">
          <Panel>
            <Eyebrow>Dataset</Eyebrow>
            <div className="grid grid-cols-2 gap-1.5">
              {DATASET_PRESETS.map((d) => (
                <button
                  key={d.id}
                  onClick={() => setDatasetKind(d.id)}
                  title={d.blurb}
                  className={`rounded-lg border px-2 py-1.5 font-mono text-[11px] transition ${
                    datasetKind === d.id
                      ? 'border-cyan bg-cyan/10 text-cyan'
                      : 'border-graphite-600 text-graphite-500 hover:text-paper'
                  }`}
                >
                  {d.label}
                </button>
              ))}
            </div>
            <div className="mt-4 space-y-4">
              <SliderControl label="Samples" value={samples} min={40} max={300} step={10} onChange={setSamples} />
              <SliderControl
                label="Noise"
                value={noise}
                min={0}
                max={1}
                step={0.05}
                onChange={setNoise}
                formatValue={(v) => v.toFixed(2)}
              />
              <button onClick={() => setSeed((s) => s + 1)} className="btn-secondary w-full !py-1.5 text-sm justify-center">
                <RotateCcw className="h-3.5 w-3.5" /> Regenerate dataset
              </button>
            </div>
          </Panel>

          <Panel>
            <Eyebrow>Algorithms to compare</Eyebrow>
            <div className="flex flex-col gap-1.5">
              {ALL_ALGOS.map((id) => (
                <label
                  key={id}
                  className="flex cursor-pointer items-center gap-2 rounded-lg border border-graphite-600 px-3 py-2 font-mono text-xs text-graphite-500 has-[:checked]:border-cyan has-[:checked]:text-cyan"
                >
                  <input
                    type="checkbox"
                    checked={selected.includes(id)}
                    onChange={() => toggleAlgo(id)}
                    className="accent-cyan"
                  />
                  {ALGO_META[id].label}
                </label>
              ))}
            </div>
          </Panel>
        </div>

        <div className="space-y-6">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {results.map(({ algo, model, metrics }) => (
              <Panel key={algo} className="!p-3">
                <div className="mb-2 flex items-center justify-between px-1">
                  <span className="font-mono text-xs text-paper">{ALGO_META[algo].short}</span>
                  <span className="font-mono text-xs text-cyan">{(metrics.accuracy * 100).toFixed(1)}%</span>
                </div>
                <Plot points={train} predict={model.predict} showBoundary height={220} resolution={32} ariaLabel={`${ALGO_META[algo].label} decision boundary`} />
              </Panel>
            ))}
          </div>

          <Panel className="overflow-x-auto">
            <Eyebrow>Metrics</Eyebrow>
            <table className="w-full min-w-[560px] text-left font-mono text-xs">
              <thead className="text-graphite-500">
                <tr>
                  <th className="px-2 py-2 font-normal">Algorithm</th>
                  <th className="px-2 py-2 font-normal text-right">Accuracy</th>
                  <th className="px-2 py-2 font-normal text-right">Precision</th>
                  <th className="px-2 py-2 font-normal text-right">Recall</th>
                  <th className="px-2 py-2 font-normal text-right">F1</th>
                  <th className="px-2 py-2 font-normal">Complexity</th>
                  <th className="px-2 py-2 font-normal">Best for</th>
                </tr>
              </thead>
              <tbody>
                {results.map(({ algo, metrics }) => (
                  <tr key={algo} className="border-t border-graphite-700/70">
                    <td className="px-2 py-2 text-paper">{ALGO_META[algo].label}</td>
                    <td className="px-2 py-2 text-right text-cyan">{(metrics.accuracy * 100).toFixed(1)}%</td>
                    <td className="px-2 py-2 text-right text-graphite-500">{metrics.precision.toFixed(2)}</td>
                    <td className="px-2 py-2 text-right text-graphite-500">{metrics.recall.toFixed(2)}</td>
                    <td className="px-2 py-2 text-right text-graphite-500">{metrics.f1.toFixed(2)}</td>
                    <td className="px-2 py-2 text-graphite-500">{ALGO_META[algo].complexity}</td>
                    <td className="px-2 py-2 text-graphite-500">{ALGO_META[algo].bestFor}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Panel>
        </div>
      </div>
    </div>
  )
}
