import { Link } from 'react-router-dom'
import {
  ArrowRight,
  Sparkles,
  ScatterChart,
  TrendingUp,
  Network,
  GitBranch,
  CircleDot,
  Gauge,
  SlidersHorizontal,
  Ruler,
} from 'lucide-react'
import HeroCanvas from '../components/HeroCanvas'
import { Panel, Eyebrow } from '../components/ui'

const topics = [
  { icon: ScatterChart, title: 'Classification', desc: 'Draw a line — or a curve — between two ideas.' },
  { icon: TrendingUp, title: 'Regression', desc: 'Fit a trend to noisy, real-world numbers.' },
  { icon: CircleDot, title: 'Clustering', desc: 'Find groups nobody labeled for you.' },
  { icon: GitBranch, title: 'Decision Trees', desc: 'A flowchart the model writes itself.' },
  { icon: ScatterChart, title: 'K-Nearest Neighbors', desc: 'Judge a point by the company it keeps.' },
  { icon: TrendingUp, title: 'Linear Regression', desc: 'Watch gradient descent find the best-fit line.' },
  { icon: Gauge, title: 'Logistic Regression', desc: 'Turn a line into a probability.' },
  { icon: CircleDot, title: 'K-Means', desc: 'Centroids that chase their own clusters.' },
  { icon: Network, title: 'Neural Networks', desc: 'Layers of tiny decisions, stacked up.' },
  { icon: SlidersHorizontal, title: 'Model Evaluation', desc: 'Accuracy is not the whole story.' },
  { icon: Sparkles, title: 'Overfitting & Underfitting', desc: 'The tightrope every model walks.' },
  { icon: Ruler, title: 'Feature Scaling', desc: 'Why units quietly break distance-based models.' },
]

export default function Home() {
  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-graphite-700/70">
        <div className="mx-auto grid max-w-7xl gap-10 px-5 py-16 sm:py-20 lg:grid-cols-[1.1fr_1fr] lg:py-28">
          <div className="flex flex-col justify-center">
            <Eyebrow>A machine learning laboratory, in your browser</Eyebrow>
            <h1 className="font-display text-4xl font-semibold leading-[1.08] tracking-tight text-paper sm:text-5xl lg:text-6xl">
              Machine Learning,
              <br />
              <span className="text-cyan">you can see.</span>
            </h1>
            <p className="mt-5 max-w-xl text-base leading-relaxed text-graphite-500 sm:text-lg">
              Stop memorizing algorithms. Move the data. Watch the boundary bend.
              Every simulation on this site is a real, running model — trained live,
              right where you're reading this.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/learn" className="btn-primary">
                Start Learning <ArrowRight className="h-4 w-4" />
              </Link>
              <Link to="/playground" className="btn-secondary">
                Open ML Playground
              </Link>
            </div>
            <div className="mt-10 flex items-center gap-6 font-mono text-xs text-graphite-500">
              <span>0 backend calls</span>
              <span className="h-1 w-1 rounded-full bg-graphite-600" />
              <span>0 data leaves your tab</span>
              <span className="h-1 w-1 rounded-full bg-graphite-600" />
              <span>100% real models</span>
            </div>
          </div>

          <div className="relative min-h-[320px] overflow-hidden rounded-2xl border border-graphite-600/60 bg-graphite-950/50 lg:min-h-[420px]">
            <HeroCanvas />
            <div className="pointer-events-none absolute left-4 top-4 font-mono text-[11px] text-graphite-500">
              live decision boundary — class A / class B
            </div>
          </div>
        </div>
      </section>

      {/* What you'll learn */}
      <section className="mx-auto max-w-7xl px-5 py-16 sm:py-20">
        <Eyebrow>Curriculum</Eyebrow>
        <h2 className="font-display text-3xl font-semibold text-paper sm:text-4xl">What you'll learn</h2>
        <p className="mt-3 max-w-2xl text-graphite-500">
          Twelve ideas that make up almost everything in classical machine learning —
          each one taught by touching it, not reading about it.
        </p>

        <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {topics.map((t) => (
            <Panel key={t.title} className="transition hover:border-cyan/40 hover:shadow-glow">
              <t.icon className="h-5 w-5 text-cyan" strokeWidth={1.75} />
              <h3 className="mt-3 font-display text-lg font-semibold text-paper">{t.title}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-graphite-500">{t.desc}</p>
            </Panel>
          ))}
        </div>
      </section>

      {/* How it works strip */}
      <section className="border-t border-graphite-700/70 bg-graphite-950/40">
        <div className="mx-auto max-w-7xl px-5 py-16 sm:py-20">
          <div className="grid gap-8 sm:grid-cols-3">
            {[
              { n: '01', title: 'Touch the data', desc: 'Add points, drag them, generate a new dataset shape.' },
              { n: '02', title: 'Pick a model', desc: 'Swap KNN for a decision tree and watch the boundary redraw itself.' },
              { n: '03', title: 'See it think', desc: 'Every prediction, split, and gradient step is rendered as it happens.' },
            ].map((s) => (
              <div key={s.n}>
                <span className="font-mono text-sm text-cyan/70">{s.n}</span>
                <h3 className="mt-2 font-display text-xl font-semibold text-paper">{s.title}</h3>
                <p className="mt-1.5 text-sm text-graphite-500">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
