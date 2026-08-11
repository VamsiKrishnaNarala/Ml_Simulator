import { useEffect, useMemo, useRef, useState } from 'react'
import { Play, Pause, RotateCcw } from 'lucide-react'
import Plot from '../Plot'
import { Panel, Eyebrow, SliderControl, StatCard, InsightBox } from '../ui'
import { generateRegressionData } from '../../datasets/generators'
import { runGradientDescent } from '../../algorithms/linearRegression'

export default function RegressMode() {
  const [samples, setSamples] = useState(40)
  const [noise, setNoise] = useState(0.3)
  const [learningRate, setLearningRate] = useState(0.6)
  const [iterations, setIterations] = useState(80)
  const [seed, setSeed] = useState(7)
  const [step, setStep] = useState(0)
  const [playing, setPlaying] = useState(false)
  const rafRef = useRef<number>()

  const data = useMemo(() => generateRegressionData({ samples, noise, seed }), [samples, noise, seed])
  const steps = useMemo(
    () => runGradientDescent(data, { learningRate, iterations }),
    [data, learningRate, iterations],
  )

  useEffect(() => {
    setStep(0)
    setPlaying(false)
  }, [data, learningRate, iterations])

  useEffect(() => {
    if (!playing) return
    let last = performance.now()
    function tick(now: number) {
      if (now - last > 40) {
        last = now
        setStep((s) => {
          if (s >= steps.length - 1) {
            setPlaying(false)
            return s
          }
          return s + 1
        })
      }
      rafRef.current = requestAnimationFrame(tick)
    }
    rafRef.current = requestAnimationFrame(tick)
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
    }
  }, [playing, steps.length])

  const current = steps[Math.min(step, steps.length - 1)] ?? { m: 0, b: 0, mse: 0, iter: 0 }
  const initialMse = steps[0]?.mse ?? 0

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-[300px_1fr_280px]">
      <div className="space-y-4">
        <Panel>
          <Eyebrow>Dataset</Eyebrow>
          <div className="space-y-4">
            <SliderControl label="Samples" value={samples} min={10} max={100} step={5} onChange={setSamples} />
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
          <Eyebrow>Gradient descent</Eyebrow>
          <div className="space-y-4">
            <SliderControl
              label="Learning rate"
              value={learningRate}
              min={0.01}
              max={1.5}
              step={0.01}
              onChange={setLearningRate}
              formatValue={(v) => v.toFixed(2)}
            />
            <SliderControl label="Iterations" value={iterations} min={5} max={200} step={5} onChange={setIterations} />
            <div className="flex gap-2">
              <button
                onClick={() => setPlaying((p) => !p)}
                className="btn-primary flex-1 justify-center !py-1.5 text-sm"
              >
                {playing ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5" />}
                {playing ? 'Pause' : 'Train'}
              </button>
              <button
                onClick={() => setStep(0)}
                className="btn-secondary !py-1.5 text-sm"
                aria-label="Restart training"
              >
                <RotateCcw className="h-3.5 w-3.5" />
              </button>
            </div>
            <input
              type="range"
              className="slider"
              min={0}
              max={steps.length - 1}
              value={step}
              onChange={(e) => {
                setPlaying(false)
                setStep(Number(e.target.value))
              }}
              aria-label="Scrub training iteration"
            />
          </div>
        </Panel>
      </div>

      <div className="space-y-3">
        <Panel className="!p-3">
          <Plot
            points={[]}
            regressionPoints={data}
            regressionLine={{ m: current.m, b: current.b }}
            height={440}
            ariaLabel="Linear regression fit plot"
          />
        </Panel>
        <InsightBox>
          The model changes its slope and intercept a little on every iteration to reduce error.
          Early on the line moves fast; as it nears the best fit, updates get smaller.
        </InsightBox>
      </div>

      <div className="space-y-4">
        <Panel>
          <Eyebrow>Training state</Eyebrow>
          <div className="grid grid-cols-2 gap-2.5">
            <StatCard label="Iteration" value={`${current.iter + 1}`} hint={`of ${iterations}`} />
            <StatCard label="MSE" value={current.mse.toFixed(2)} hint={initialMse ? `from ${initialMse.toFixed(1)}` : undefined} />
            <StatCard label="Slope (m)" value={current.m.toFixed(3)} />
            <StatCard label="Intercept (b)" value={current.b.toFixed(3)} />
          </div>
        </Panel>
        <Panel>
          <p className="font-mono text-xs text-graphite-500">Equation</p>
          <p className="mt-1 font-display text-lg text-primary">
            y = {current.m.toFixed(2)}x + {current.b.toFixed(2)}
          </p>
        </Panel>
        <Panel>
          <p className="font-mono text-xs text-graphite-500">Show mathematics</p>
          <p className="mt-2 font-mono text-xs leading-relaxed text-graphite-500">
            MSE = (1/n) · Σ(y − ŷ)²
            <br />
            m ← m − α · ∂MSE/∂m
            <br />
            b ← b − α · ∂MSE/∂b
          </p>
        </Panel>
      </div>
    </div>
  )
}
