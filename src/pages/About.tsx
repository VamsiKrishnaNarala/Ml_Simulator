import { Link } from 'react-router-dom'
import { FlaskConical, Github, ArrowRight, ShieldCheck, Cpu, Sparkles, GraduationCap, MapPin, BookOpen } from 'lucide-react'
import { Panel, Eyebrow } from '../components/ui'

export default function About() {
  return (
    <div className="mx-auto max-w-3xl px-5 py-14">
      <Eyebrow>About</Eyebrow>
      <h1 className="font-display text-4xl font-semibold text-primary">A lab, not a lecture</h1>
      <p className="mt-4 leading-relaxed text-secondary">
        ML Lab is a small, self-contained machine learning laboratory that runs entirely inside your
        browser tab. Every algorithm — KNN, logistic regression, decision trees, Naive Bayes, linear
        SVM, random forests, linear regression, and K-Means — is implemented from scratch in
        TypeScript and trained live, right where you're reading this. There's no backend, no API
        call, and no data ever leaves your device.
      </p>
      <p className="mt-4 leading-relaxed text-secondary">
        The goal isn't to replace a textbook. It's to give you a place to build intuition first —
        drag a point, change a hyperparameter, watch the boundary redraw — before the formulas have
        to mean anything to you.
      </p>

      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        <Panel>
          <Cpu className="h-5 w-5 text-brand" strokeWidth={1.75} />
          <h3 className="mt-3 font-display text-base font-semibold text-primary">Real models</h3>
          <p className="mt-1.5 text-sm text-secondary">
            No mock screens. Every boundary, split, and centroid is computed by real, running code.
          </p>
        </Panel>
        <Panel>
          <ShieldCheck className="h-5 w-5 text-brand" strokeWidth={1.75} />
          <h3 className="mt-3 font-display text-base font-semibold text-primary">Fully client-side</h3>
          <p className="mt-1.5 text-sm text-secondary">
            No server, no database, no accounts. Progress is saved only in your browser's local storage.
          </p>
        </Panel>
        <Panel>
          <Sparkles className="h-5 w-5 text-brand" strokeWidth={1.75} />
          <h3 className="mt-3 font-display text-base font-semibold text-primary">Built to experiment</h3>
          <p className="mt-1.5 text-sm text-secondary">
            Change one thing at a time and watch what happens — that's the whole method.
          </p>
        </Panel>
      </div>

      {/* ── Instructor / Creator Card ── */}
      <div className="mt-10 rounded-xl border border-brand/20 bg-gradient-to-br from-brand-light/60 to-secondary-light/40 p-6">
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0 flex items-center justify-center w-14 h-14 rounded-full bg-brand text-white shadow-sm">
            <GraduationCap className="h-7 w-7" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-brand/70 mb-1">Created &amp; Supervised by</p>
            <h2 className="font-display text-xl font-semibold text-primary">
              Dr. Sumalatha Lingamgunta
            </h2>
            <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1.5">
              <span className="inline-flex items-center gap-1.5 text-sm text-secondary">
                <BookOpen className="h-3.5 w-3.5 text-brand/60" />
                Professor, Dept. of Computer Science &amp; Engineering
              </span>
              <span className="inline-flex items-center gap-1.5 text-sm text-secondary">
                <MapPin className="h-3.5 w-3.5 text-brand/60" />
                University College of Engineering Kakinada (UCEK), JNTUK
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8 flex flex-wrap items-center gap-3">
        <Link to="/playground" className="btn-primary">
          Open the playground <ArrowRight className="h-4 w-4" />
        </Link>
        <a href="https://github.com" target="_blank" rel="noreferrer" className="btn-secondary">
          <Github className="h-4 w-4" /> View source
        </a>
      </div>

      <div className="mt-14 flex items-center gap-2 text-muted">
        <FlaskConical className="h-4 w-4" />
        <span className="font-mono text-xs">Machine Learning, you can see.</span>
      </div>
    </div>
  )
}
