import { useEffect, useMemo, useState } from 'react'
import { Play, RotateCcw, StepForward } from 'lucide-react'
import Plot from '../Plot'
import { Panel, Eyebrow, SliderControl, StatCard, InsightBox } from '../ui'
import { generateDataset } from '../../datasets/generators'
import { initCentroids, kmeansStep, type Centroid } from '../../algorithms/kmeans'
import { computeAllClusterMetrics, CLUSTER_METRIC_META } from '../../utils/clusterMetrics'
import type { Point2D } from '../../types'

const CENTROID_COLORS = ['#5B8DEF', '#FF6B7A', '#F5A623', '#5EEAD4', '#C084FC']

export default function ClusterMode() {
  const [samples, setSamples] = useState(90)
  const [noise, setNoise] = useState(0.3)
  const [k, setK] = useState(3)
  const [seed, setSeed] = useState(5)
  const [centroids, setCentroids] = useState<Centroid[]>([])
  const [assignments, setAssignments] = useState<number[]>([])
  const [iteration, setIteration] = useState(0)
  const [converged, setConverged] = useState(false)

  const rawPoints = useMemo(
    () => generateDataset({ kind: 'blobs', samples, noise, clusters: k, seed, classSeparation: 0.7 }),
    [samples, noise, k, seed],
  )

  function reset() {
    const init = initCentroids(rawPoints, k, seed + 1)
    setCentroids(init)
    setAssignments(rawPoints.map(() => 0))
    setIteration(0)
    setConverged(false)
  }

  useEffect(() => {
    reset()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rawPoints, k])

  function step() {
    if (converged || centroids.length === 0) return
    const result = kmeansStep(rawPoints, centroids)
    setCentroids(result.centroids)
    setAssignments(result.assignments)
    setConverged(result.converged)
    setIteration((i) => i + 1)
  }

  function runToConvergence() {
    let cur = centroids
    let iter = iteration
    let done = converged
    let safety = 0
    while (!done && safety < 100) {
      const result = kmeansStep(rawPoints, cur)
      cur = result.centroids
      done = result.converged
      iter++
      safety++
    }
    const finalResult = kmeansStep(rawPoints, cur)
    setCentroids(finalResult.centroids)
    setAssignments(finalResult.assignments)
    setConverged(true)
    setIteration(iter)
  }

  const coloredPoints: Point2D[] = rawPoints.map((p, i) => ({ ...p, label: assignments[i] ?? 0 }))

  function handleCentroidDrag(index: number, x: number, y: number) {
    setCentroids((cs) => cs.map((c, i) => (i === index ? { x, y } : c)))
    const newAssignments = rawPoints.map((p) => {
      let best = 0
      let bestDist = Infinity
      const updated = centroids.map((c, i) => (i === index ? { x, y } : c))
      updated.forEach((c, i) => {
        const d = (p.x - c.x) ** 2 + (p.y - c.y) ** 2
        if (d < bestDist) {
          bestDist = d
          best = i
        }
      })
      return best
    })
    setAssignments(newAssignments)
    setConverged(false)
  }

  const metrics = useMemo(() => {
    if (assignments.length === 0 || centroids.length === 0) return null;
    return computeAllClusterMetrics(rawPoints, assignments, centroids);
  }, [rawPoints, assignments, centroids]);

  function getSilhouetteInterpretation(score: number | null) {
    if (score === null) return "Requires at least 2 non-empty clusters.";
    if (score > 0.7) return "Excellent cluster separation — clusters are well-defined.";
    if (score > 0.5) return "Good cluster separation.";
    if (score > 0.25) return "Weak cluster structure — clusters may overlap.";
    return "Poor clustering — try different K or dataset.";
  }

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-[300px_1fr_300px]">
      <div className="space-y-4">
        <Panel>
          <Eyebrow>Dataset</Eyebrow>
          <div className="space-y-4">
            <SliderControl label="Samples" value={samples} min={20} max={200} step={10} onChange={setSamples} />
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
          <Eyebrow>K-Means</Eyebrow>
          <div className="space-y-4">
            <SliderControl label="K (clusters)" value={k} min={2} max={5} step={1} onChange={setK} />
            <div className="flex gap-2">
              <button onClick={step} disabled={converged} className="btn-primary flex-1 justify-center !py-1.5 text-sm disabled:opacity-40">
                <StepForward className="h-3.5 w-3.5" /> Step
              </button>
              <button onClick={runToConvergence} disabled={converged} className="btn-secondary flex-1 justify-center !py-1.5 text-sm disabled:opacity-40">
                <Play className="h-3.5 w-3.5" /> Run
              </button>
            </div>
            <button onClick={reset} className="btn-secondary w-full !py-1.5 text-sm justify-center">
              <RotateCcw className="h-3.5 w-3.5" /> Reset centroids
            </button>
            <p className="font-mono text-[11px] text-graphite-500">You can also drag any centroid (diamond marker) by hand.</p>
          </div>
        </Panel>
      </div>

      <div className="space-y-3">
        <Panel className="!p-3">
          <Plot
            points={coloredPoints}
            centroids={centroids}
            centroidColors={centroids.map((_, i) => CENTROID_COLORS[i % CENTROID_COLORS.length])}
            onCentroidDrag={handleCentroidDrag}
            height={440}
            ariaLabel="K-Means clustering plot"
          />
        </Panel>
        <InsightBox>
          {converged
            ? 'Converged — centroids stopped moving because every point is now closest to its own cluster center.'
            : `Iteration ${iteration}: points were reassigned to their nearest centroid, then each centroid moved to the average of its points.`}
        </InsightBox>
        <Panel>
          <p className="text-xs leading-relaxed text-graphite-500">
            <strong className="text-paper">K-Means is unsupervised</strong> — it never sees a label. It only
            uses the x/y position of each point to decide which group it belongs to.
          </p>
        </Panel>
      </div>

      <div className="space-y-4">
        <Panel>
          <Eyebrow>State</Eyebrow>
          <div className="grid grid-cols-2 gap-2.5">
            <StatCard label="Iteration" value={`${iteration}`} />
            <StatCard label="Status" value={converged ? 'Converged' : 'Running'} />
          </div>
        </Panel>

        {metrics && (
          <Panel>
            <Eyebrow>Metrics</Eyebrow>
            <div className="space-y-4">
              {CLUSTER_METRIC_META.map(meta => {
                let value = null;
                if (meta.key === 'silhouette') value = metrics.silhouette;
                else if (meta.key === 'daviesBouldin') value = metrics.daviesBouldin;
                else if (meta.key === 'calinskiHarabasz') value = metrics.calinskiHarabasz;
                else if (meta.key === 'inertia') value = metrics.inertia;

                return (
                  <div key={meta.key} className="space-y-1.5 border-b border-graphite-600/60 pb-3 last:border-0 last:pb-0">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-paper">{meta.name}</span>
                      {value === null ? (
                        <span className="text-sm text-graphite-500">Not available</span>
                      ) : (
                        <span className="text-sm font-mono text-paper">
                          {meta.key === 'inertia' ? value.toFixed(1) : value.toFixed(3)}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      {meta.direction === 'higher' ? (
                        <span className="px-1.5 py-0.5 rounded text-[10px] font-medium text-emerald-400 bg-emerald-400/10">↑ Higher is better</span>
                      ) : meta.direction === 'lower' ? (
                        <span className="px-1.5 py-0.5 rounded text-[10px] font-medium text-blue-400 bg-blue-400/10">↓ Lower is better</span>
                      ) : (
                        <span className="px-1.5 py-0.5 rounded text-[10px] font-medium text-graphite-500 bg-graphite-500/10">Context</span>
                      )}
                    </div>
                    <p className="text-xs text-graphite-500" title={meta.description}>{meta.description}</p>
                  </div>
                )
              })}

              {metrics.isSampled && (
                <p className="text-[11px] text-amber-400 bg-amber-400/10 p-2 rounded">
                  Note: Silhouette computed on {metrics.sampleSize || 500}-point sample for performance.
                </p>
              )}

              <div className="bg-graphite-900/60 p-2.5 rounded border border-graphite-600/60">
                <p className="text-xs font-medium text-paper mb-1">Analysis</p>
                <p className="text-[11px] text-graphite-500">{getSilhouetteInterpretation(metrics.silhouette)}</p>
              </div>
            </div>
          </Panel>
        )}

        {metrics && metrics.clusterDistribution && metrics.clusterDistribution.length > 0 && (
          <Panel>
            <Eyebrow>Distribution</Eyebrow>
            <div className="space-y-3">
              {metrics.clusterDistribution.map((info) => (
                <div key={info.id} className="space-y-1">
                  <div className="flex justify-between text-[11px] text-graphite-500">
                    <span>Cluster {info.id}</span>
                    <span>{info.size} pts ({info.percentage.toFixed(1)}%)</span>
                  </div>
                  <div className="h-2 w-full bg-graphite-900/60 rounded-full overflow-hidden border border-graphite-600/60">
                    <div 
                      className="h-full rounded-full transition-all duration-300" 
                      style={{ width: `${info.percentage}%`, backgroundColor: CENTROID_COLORS[info.id % CENTROID_COLORS.length] }} 
                    />
                  </div>
                </div>
              ))}
            </div>
          </Panel>
        )}
      </div>
    </div>
  )
}
