import { Link } from 'react-router-dom'
import { FlaskConical, Github, ArrowRight, ShieldCheck, Cpu, Sparkles } from 'lucide-react'
import { Panel, Eyebrow } from '../components/ui'

export default function About() {
  return (
    <div className="mx-auto max-w-3xl px-5 py-14">
      <Eyebrow>About</Eyebrow>
      <h1 className="font-display text-4xl font-semibold text-paper">A lab, not a lecture</h1>
      <p className="mt-4 leading-relaxed text-graphite-500">
        ML Lab is a small, self-contained machine learning laboratory that runs entirely inside your
        browser tab. Every algorithm — KNN, logistic regression, decision trees, Naive Bayes, linear
        SVM, random forests, linear regression, and K-Means — is implemented from scratch in
        TypeScript and trained live, right where you're reading this. There's no backend, no API
        call, and no data ever leaves your device.
      </p>
      <p className="mt-4 leading-relaxed text-graphite-500">
        The goal isn't to replace a textbook. It's to give you a place to build intuition first —
        drag a point, change a hyperparameter, watch the boundary redraw — before the formulas have
        to mean anything to you.
      </p>

      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        <Panel>
          <Cpu className="h-5 w-5 text-primary" strokeWidth={1.75} />
          <h3 className="mt-3 font-display text-base font-semibold text-paper">Real models</h3>
          <p className="mt-1.5 text-sm text-graphite-500">
            No mock screens. Every boundary, split, and centroid is computed by real, running code.
          </p>
        </Panel>
        <Panel>
          <ShieldCheck className="h-5 w-5 text-primary" strokeWidth={1.75} />
          <h3 className="mt-3 font-display text-base font-semibold text-paper">Fully client-side</h3>
          <p className="mt-1.5 text-sm text-graphite-500">
            No server, no database, no accounts. Progress is saved only in your browser's local storage.
          </p>
        </Panel>
        <Panel>
          <Sparkles className="h-5 w-5 text-primary" strokeWidth={1.75} />
          <h3 className="mt-3 font-display text-base font-semibold text-paper">Built to experiment</h3>
          <p className="mt-1.5 text-sm text-graphite-500">
            Change one thing at a time and watch what happens — that's the whole method.
          </p>
        </Panel>
      </div>

      <div className="mt-10 flex flex-wrap items-center gap-3">
        <Link to="/playground" className="btn-primary">
          Open the playground <ArrowRight className="h-4 w-4" />
        </Link>
        <a href="https://github.com" target="_blank" rel="noreferrer" className="btn-secondary">
          <Github className="h-4 w-4" /> View source
        </a>
      </div>

      <div className="mt-14 flex items-center gap-2 text-graphite-600">
        <FlaskConical className="h-4 w-4" />
        <span className="font-mono text-xs">Machine Learning, you can see.</span>
      </div>
    </div>
  )
}
