import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Check, Circle, Plus, Trash2, ArrowRight } from 'lucide-react'
import { Panel, Eyebrow, SliderControl, InsightBox } from '../components/ui'
import { useLocalStorage } from '../hooks/useLocalStorage'

interface Row {
  height: number
  weight: number
  exercise: 'High' | 'Low'
  category: 'Fit' | 'Unfit'
}

const initialRows: Row[] = [
  { height: 170, weight: 65, exercise: 'High', category: 'Fit' },
  { height: 160, weight: 80, exercise: 'Low', category: 'Unfit' },
  { height: 180, weight: 72, exercise: 'High', category: 'Fit' },
  { height: 165, weight: 90, exercise: 'Low', category: 'Unfit' },
  { height: 175, weight: 68, exercise: 'High', category: 'Fit' },
]

const MODULES = [
  'what-is-ml',
  'dataset',
  'train-test-split',
  'classification',
  'regression',
  'clustering',
] as const
type ModuleId = (typeof MODULES)[number]

export default function Learn() {
  const [completed, setCompleted] = useLocalStorage<ModuleId[]>('mllab-progress', [])
  const [rows, setRows] = useState<Row[]>(initialRows)
  const [trainPct, setTrainPct] = useState(70)

  const trainCount = Math.round((rows.length * trainPct) / 100)
  const testCount = rows.length - trainCount

  function toggleComplete(id: ModuleId) {
    setCompleted((prev) => (prev.includes(id) ? prev.filter((m) => m !== id) : [...prev, id]))
  }

  function addRow() {
    setRows((r) => [...r, { height: 168, weight: 70, exercise: 'High', category: 'Fit' }])
  }
  function removeRow(i: number) {
    setRows((r) => r.filter((_, idx) => idx !== i))
  }
  function updateRow(i: number, patch: Partial<Row>) {
    setRows((r) => r.map((row, idx) => (idx === i ? { ...row, ...patch } : row)))
  }

  const progressPct = Math.round((completed.length / MODULES.length) * 100)

  return (
    <div className="mx-auto max-w-5xl px-5 py-14">
      <Eyebrow>Learn ML</Eyebrow>
      <h1 className="font-display text-4xl font-semibold text-brand">Your ML journey</h1>
      <p className="mt-2 max-w-2xl text-muted">
        Six short modules. Check each one off as you go — your progress is saved on this device.
      </p>

      <div className="mt-6">
        <div className="h-2 w-full overflow-hidden rounded-full bg-surface-secondary">
          <div className="h-full rounded-full bg-primary transition-all" style={{ width: `${progressPct}%` }} />
        </div>
        <p className="mt-2 font-mono text-xs text-muted">{progressPct}% complete</p>
      </div>

      {/* Module 1 */}
      <ModuleShell
        id="what-is-ml"
        index={1}
        title="What is Machine Learning?"
        completed={completed.includes('what-is-ml')}
        onToggle={toggleComplete}
      >
        <p className="text-muted">
          Traditional programming and machine learning flip the same three ingredients around:
        </p>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <FlowCard title="Traditional programming" steps={['Rules', 'Data', '→ Output']} />
          <FlowCard title="Machine learning (training)" steps={['Data', 'Answers', '→ Model']} accent />
        </div>
        <div className="mt-3">
          <FlowCard title="Machine learning (using it)" steps={['New data', 'Model', '→ Prediction']} accent />
        </div>
        <InsightBox>
          Instead of writing the rules yourself, you show the computer examples of inputs and
          correct answers. It works backward from those examples to find the rules — the{' '}
          <strong>model</strong>.
        </InsightBox>
      </ModuleShell>

      {/* Module 2 */}
      <ModuleShell
        id="dataset"
        index={2}
        title="Datasets: samples, features, labels"
        completed={completed.includes('dataset')}
        onToggle={toggleComplete}
      >
        <p className="text-muted">
          Each <strong className="text-brand">row</strong> is a sample. Each column except the last is a{' '}
          <strong className="text-brand">feature</strong> — something the model can look at. The last
          column is the <strong className="text-brand">label</strong> — what the model is trying to predict.
        </p>
        <div className="mt-4 overflow-x-auto rounded-xl border border-default">
          <table className="w-full text-left font-mono text-sm">
            <thead className="bg-surface-secondary/80 text-muted">
              <tr>
                <th className="px-3 py-2 font-normal">Height</th>
                <th className="px-3 py-2 font-normal">Weight</th>
                <th className="px-3 py-2 font-normal">Exercise</th>
                <th className="px-3 py-2 font-normal text-brand">Category (label)</th>
                <th className="px-3 py-2" />
              </tr>
            </thead>
            <tbody>
              {rows.map((row, i) => (
                <tr key={i} className="border-t border-default/70">
                  <td className="px-2 py-1.5">
                    <input
                      type="number"
                      value={row.height}
                      onChange={(e) => updateRow(i, { height: Number(e.target.value) })}
                      className="w-16 rounded bg-surface-secondary px-2 py-1 text-brand outline-none focus-visible:outline-primary"
                    />
                  </td>
                  <td className="px-2 py-1.5">
                    <input
                      type="number"
                      value={row.weight}
                      onChange={(e) => updateRow(i, { weight: Number(e.target.value) })}
                      className="w-16 rounded bg-surface-secondary px-2 py-1 text-brand outline-none focus-visible:outline-primary"
                    />
                  </td>
                  <td className="px-2 py-1.5">
                    <select
                      value={row.exercise}
                      onChange={(e) => updateRow(i, { exercise: e.target.value as Row['exercise'] })}
                      className="rounded bg-surface-secondary px-2 py-1 text-brand outline-none focus-visible:outline-primary"
                    >
                      <option>High</option>
                      <option>Low</option>
                    </select>
                  </td>
                  <td className="px-2 py-1.5">
                    <select
                      value={row.category}
                      onChange={(e) => updateRow(i, { category: e.target.value as Row['category'] })}
                      className="rounded bg-surface-secondary px-2 py-1 text-brand outline-none focus-visible:outline-primary"
                    >
                      <option>Fit</option>
                      <option>Unfit</option>
                    </select>
                  </td>
                  <td className="px-2 py-1.5">
                    <button
                      onClick={() => removeRow(i)}
                      aria-label="Remove row"
                      className="rounded p-1.5 text-muted hover:text-error"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <button onClick={addRow} className="btn-secondary mt-3 !py-1.5 !px-4 text-sm">
          <Plus className="h-4 w-4" /> Add row
        </button>
      </ModuleShell>

      {/* Module 3 */}
      <ModuleShell
        id="train-test-split"
        index={3}
        title="Train / test split"
        completed={completed.includes('train-test-split')}
        onToggle={toggleComplete}
      >
        <p className="text-muted">
          We never judge a model on the data it studied from. Some samples are held back as a{' '}
          <strong className="text-brand">test set</strong> the model never sees during training —
          that's the only fair way to check if it actually learned, instead of just memorizing.
        </p>
        <div className="mt-4">
          <SliderControl
            label="Training split"
            value={trainPct}
            min={10}
            max={90}
            step={5}
            onChange={setTrainPct}
            formatValue={(v) => `${v}%`}
          />
        </div>
        <div className="mt-4 grid grid-cols-2 gap-3">
          <div className="rounded-xl border border-brand/30 bg-brand/5 p-4 text-center">
            <p className="font-mono text-xs text-muted">Training</p>
            <p className="font-display text-2xl font-semibold text-brand">{trainCount} samples</p>
          </div>
          <div className="rounded-xl border border-rose/30 bg-rose/5 p-4 text-center">
            <p className="font-mono text-xs text-muted">Testing</p>
            <p className="font-display text-2xl font-semibold text-error">{testCount} samples</p>
          </div>
        </div>
        <div className="mt-3 flex h-8 w-full overflow-hidden rounded-full border border-default">
          <div className="bg-primary/70 transition-all" style={{ width: `${trainPct}%` }} />
          <div className="flex-1 bg-rose/70 transition-all" />
        </div>
      </ModuleShell>

      {/* Modules 4-6: pointers into Playground with brief framing */}
      <ModuleShell
        id="classification"
        index={4}
        title="Classification"
        completed={completed.includes('classification')}
        onToggle={toggleComplete}
      >
        <p className="text-muted">
          Classification predicts a <strong className="text-brand">category</strong> — fit or unfit,
          spam or not spam. The model draws an invisible boundary through feature space; anything
          on one side gets one label, the other side gets the other.
        </p>
        <PlaygroundLink to="/playground" label="Try KNN, logistic regression, and decision trees live" />
      </ModuleShell>

      <ModuleShell
        id="regression"
        index={5}
        title="Regression"
        completed={completed.includes('regression')}
        onToggle={toggleComplete}
      >
        <p className="text-muted">
          Regression predicts a <strong className="text-brand">number</strong> — a price, a
          temperature, a score. Linear regression fits a straight line by nudging its slope and
          intercept, step by step, until the error stops shrinking. That process is called{' '}
          <strong className="text-brand">gradient descent</strong>.
        </p>
        <PlaygroundLink to="/playground" label="Watch gradient descent fit a line in real time" />
      </ModuleShell>

      <ModuleShell
        id="clustering"
        index={6}
        title="Clustering"
        completed={completed.includes('clustering')}
        onToggle={toggleComplete}
      >
        <p className="text-muted">
          Clustering finds groups in data that has <strong className="text-brand">no labels at
          all</strong>. K-Means repeats a simple loop — assign points to the nearest centroid, then
          move the centroid to the middle of its points — until nothing moves anymore.
        </p>
        <PlaygroundLink to="/playground" label="Run K-Means and watch centroids converge" />
      </ModuleShell>

      <div className="mt-10 flex justify-center">
        <Link to="/quiz" className="btn-primary">
          Test yourself in the quiz <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </div>
  )
}

function ModuleShell({
  id,
  index,
  title,
  completed,
  onToggle,
  children,
}: {
  id: ModuleId
  index: number
  title: string
  completed: boolean
  onToggle: (id: ModuleId) => void
  children: React.ReactNode
}) {
  return (
    <Panel className="mt-6">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-baseline gap-3">
          <span className="font-mono text-xs text-muted">Module {index}</span>
          <h2 className="font-display text-xl font-semibold text-brand">{title}</h2>
        </div>
        <button
          onClick={() => onToggle(id)}
          className={`flex shrink-0 items-center gap-1.5 rounded-full border px-3 py-1.5 font-mono text-xs transition ${
            completed ? 'border-primary bg-brand/10 text-brand' : 'border-default text-muted hover:text-brand'
          }`}
        >
          {completed ? <Check className="h-3.5 w-3.5" /> : <Circle className="h-3.5 w-3.5" />}
          {completed ? 'Done' : 'Mark done'}
        </button>
      </div>
      <div className="mt-4 space-y-4">{children}</div>
    </Panel>
  )
}

function FlowCard({ title, steps, accent }: { title: string; steps: string[]; accent?: boolean }) {
  return (
    <div className={`rounded-xl border p-4 ${accent ? 'border-brand/30 bg-brand/5' : 'border-default bg-background/50'}`}>
      <p className="font-mono text-[11px] uppercase tracking-wide text-muted">{title}</p>
      <div className="mt-2 flex flex-wrap items-center gap-2 font-mono text-sm text-brand">
        {steps.map((s, i) => (
          <span key={i} className={i === steps.length - 1 ? 'text-brand' : ''}>
            {s}
          </span>
        ))}
      </div>
    </div>
  )
}

function PlaygroundLink({ to, label }: { to: string; label: string }) {
  return (
    <Link to={to} className="inline-flex items-center gap-1.5 font-mono text-sm text-brand hover:underline">
      {label} <ArrowRight className="h-3.5 w-3.5" />
    </Link>
  )
}
