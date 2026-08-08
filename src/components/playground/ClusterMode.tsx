import { useEffect, useMemo, useState } from 'react'
import { Play, RotateCcw, StepForward } from 'lucide-react'
import Plot from '../Plot'
import { Panel, Eyebrow, SliderControl, StatCard, InsightBox } from '../ui'
import { generateDataset } from '../../datasets/generators'
import { initCentroids, kmeansStep, type Centroid } from '../../algorithms/kmeans'
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

  const inertia = useMemo(() => {
    let sum = 0
    rawPoints.forEach((p, i) => {
      const c = centroids[assignments[i]]
      if (c) sum += (p.x - c.x) ** 2 + (p.y - c.y) ** 2
    })
    return sum
  }, [rawPoints, centroids, assignments])

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

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-[300px_1fr_280px]">
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
      </div>

      <div className="space-y-4">
        <Panel>
          <Eyebrow>State</Eyebrow>
          <div className="grid grid-cols-2 gap-2.5">
            <StatCard label="Iteration" value={`${iteration}`} />
            <StatCard label="Status" value={converged ? 'Converged' : 'Running'} />
          </div>
          <div className="mt-2.5">
            <StatCard label="Inertia (total spread)" value={inertia.toFixed(1)} hint="lower is tighter clusters" />
          </div>
        </Panel>
        <Panel>
          <p className="text-xs leading-relaxed text-graphite-500">
            <strong className="text-paper">K-Means is unsupervised</strong> — it never sees a label. It only
            uses the x/y position of each point to decide which group it belongs to.
          </p>
        </Panel>
      </div>
    </div>
  )
}
