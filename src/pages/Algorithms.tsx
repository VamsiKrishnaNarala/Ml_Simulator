import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import {
  ChevronDown,
  ArrowRight,
  Search,
  BookOpen,
  Brain,
  Layers,
  Zap,
  FlaskConical,
  GraduationCap,
  CheckCircle2,
  Clock,
  X,
} from 'lucide-react'
import { Panel, Eyebrow } from '../components/ui'
import MathBlock from '../components/MathBlock'
import {
  ALGORITHM_LIBRARY,
  CATEGORIES,
  type AlgoDoc,
} from '../data/algorithmLibrary'

type Category = (typeof CATEGORIES)[number]

const CATEGORY_META: Record<
  Category,
  { label: string; description: string; icon: React.ReactNode; color: string }
> = {
  supervised: {
    label: 'Supervised',
    description: 'Learn from labeled data to make predictions',
    icon: <BookOpen className="h-4 w-4" />,
    color: 'text-blue-400 bg-blue-400/10 border-blue-400/30',
  },
  unsupervised: {
    label: 'Unsupervised',
    description: 'Discover hidden patterns in unlabeled data',
    icon: <Brain className="h-4 w-4" />,
    color: 'text-purple-400 bg-purple-400/10 border-purple-400/30',
  },
  'semi-supervised': {
    label: 'Semi-Supervised',
    description: 'Combine labeled and unlabeled data',
    icon: <Layers className="h-4 w-4" />,
    color: 'text-amber-400 bg-amber-400/10 border-amber-400/30',
  },
  reinforcement: {
    label: 'Reinforcement',
    description: 'Learn through reward and environment interaction',
    icon: <Zap className="h-4 w-4" />,
    color: 'text-error bg-rose/10 border-rose/30',
  },
}

const STATUS_META: Record<
  NonNullable<AlgoDoc['implementationStatus']>,
  { label: string; icon: React.ReactNode; color: string }
> = {
  production: {
    label: 'Production',
    icon: <CheckCircle2 className="h-3 w-3" />,
    color: 'text-emerald-400 bg-emerald-400/10 border-emerald-400/30',
  },
  experimental: {
    label: 'Experimental',
    icon: <FlaskConical className="h-3 w-3" />,
    color: 'text-amber-400 bg-amber-400/10 border-amber-400/30',
  },
  educational: {
    label: 'Theory',
    icon: <GraduationCap className="h-3 w-3" />,
    color: 'text-muted bg-surface-secondary border-default',
  },
}

type DetailTab =
  | 'simple'
  | 'howItWorks'
  | 'math'
  | 'hyperparams'
  | 'proscons'
  | 'usecases'
  | 'metrics'

const DETAIL_TABS: { id: DetailTab; label: string }[] = [
  { id: 'simple', label: 'Simple' },
  { id: 'howItWorks', label: 'How It Works' },
  { id: 'math', label: 'Mathematics' },
  { id: 'hyperparams', label: 'Hyperparameters' },
  { id: 'proscons', label: 'Pros & Cons' },
  { id: 'usecases', label: 'Use Cases' },
  { id: 'metrics', label: 'Metrics' },
]

function AlgoCard({ algo }: { algo: AlgoDoc }) {
  const [open, setOpen] = useState(false)
  const [activeTab, setActiveTab] = useState<DetailTab>('simple')
  const catMeta = CATEGORY_META[algo.category]
  const status = algo.implementationStatus ?? 'production'
  const statusMeta = STATUS_META[status]

  return (
    <Panel className="!p-0 overflow-hidden transition-all">
      {/* Header */}
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-start justify-between gap-3 px-5 py-4 text-left"
        aria-expanded={open}
      >
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-1">
            <span className="font-display text-base font-semibold text-brand">{algo.name}</span>
            <span
              className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-medium ${statusMeta.color}`}
            >
              {statusMeta.icon}
              {statusMeta.label}
            </span>
          </div>
          <div className="flex flex-wrap items-center gap-1.5 mt-1">
            <span className="font-mono text-[11px] text-muted">{algo.subcategory}</span>
            <span className="text-muted">·</span>
            {algo.problemType.map((pt) => (
              <span
                key={pt}
                className="rounded-full border border-default bg-background/40 px-2 py-0.5 font-mono text-[10px] text-muted"
              >
                {pt}
              </span>
            ))}
            {algo.complexity && (
              <>
                <span className="text-muted">·</span>
                <span className="font-mono text-[10px] text-muted">{algo.complexity}</span>
              </>
            )}
          </div>
          {!open && (
            <p className="mt-1.5 text-xs text-muted line-clamp-2">{algo.simple}</p>
          )}
        </div>
        <div className="flex items-center gap-2 shrink-0 mt-0.5">
          {algo.playgroundMode && (
            <span className="hidden sm:flex items-center gap-1 rounded-full border border-brand/30 bg-brand/5 px-2 py-0.5 font-mono text-[10px] text-brand">
              <FlaskConical className="h-2.5 w-2.5" /> Playground
            </span>
          )}
          <ChevronDown
            className={`h-4 w-4 text-muted transition-transform duration-200 ${open ? 'rotate-180 text-brand' : ''}`}
          />
        </div>
      </button>

      {/* Expanded detail */}
      {open && (
        <div className="border-t border-default/70">
          {/* Tab bar */}
          <div className="flex overflow-x-auto gap-0 border-b border-default/70 px-5 pt-2">
            {DETAIL_TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`shrink-0 border-b-2 px-3 py-2 font-mono text-[11px] transition-colors ${
                  activeTab === tab.id
                    ? 'border-primary text-brand'
                    : 'border-transparent text-muted hover:text-brand'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab content */}
          <div className="px-5 py-5 space-y-4">
            {activeTab === 'simple' && (
              <div className="space-y-4">
                <div>
                  <p className="label-eyebrow mb-2">Plain English</p>
                  <p className="text-sm leading-relaxed text-muted">{algo.simple}</p>
                </div>
                <div>
                  <p className="label-eyebrow mb-2">Mathematical Intuition</p>
                  <p className="text-sm leading-relaxed text-muted">{algo.mathIntuition}</p>
                </div>
                <div>
                  <p className="label-eyebrow mb-2">Data Requirements</p>
                  <p className="text-sm leading-relaxed text-muted">{algo.dataRequirements}</p>
                </div>
              </div>
            )}

            {activeTab === 'howItWorks' && (
              <div className="space-y-4">
                <div>
                  <p className="label-eyebrow mb-2">Working Process</p>
                  <p className="text-sm leading-relaxed text-muted">{algo.howItWorks}</p>
                </div>
                <div>
                  <p className="label-eyebrow mb-2">Objective</p>
                  <div className="rounded-lg border border-default bg-background/50 px-3 py-2.5">
                    <p className="font-mono text-xs text-muted">{algo.objective}</p>
                  </div>
                </div>
                <div>
                  <p className="label-eyebrow mb-2">Optimizer</p>
                  <p className="text-sm text-muted">{algo.optimizer}</p>
                </div>
                <div>
                  <p className="label-eyebrow mb-2">Example</p>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="rounded-lg border border-default bg-background/40 p-3">
                      <p className="font-mono text-[10px] text-muted uppercase tracking-wider mb-1">Input</p>
                      <p className="font-mono text-xs text-brand">{algo.exampleIO.input}</p>
                    </div>
                    <div className="rounded-lg border border-brand/20 bg-brand/5 p-3">
                      <p className="font-mono text-[10px] text-brand uppercase tracking-wider mb-1">Output</p>
                      <p className="font-mono text-xs text-brand">{algo.exampleIO.output}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'math' && (
              <div className="space-y-5">
                {algo.equations.map((eq, i) => (
                  <div key={i} className="space-y-2">
                    <p className="label-eyebrow">{eq.label}</p>
                    <div className="rounded-lg border border-default bg-background/50 px-4 py-3 overflow-x-auto">
                      <MathBlock latex={eq.latex} displayMode={true} />
                    </div>
                    <p className="text-xs text-muted leading-relaxed">{eq.explanation}</p>
                  </div>
                ))}
                <div>
                  <p className="label-eyebrow mb-2">Objective Function</p>
                  <div className="rounded-lg border border-default bg-background/40 px-3 py-2.5">
                    <p className="font-mono text-xs text-muted">{algo.objective}</p>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'hyperparams' && (
              <div className="space-y-3">
                {algo.hyperparameters.length === 0 ? (
                  <p className="text-sm text-muted">No user-configurable hyperparameters.</p>
                ) : (
                  <div className="rounded-xl border border-default overflow-hidden">
                    <table className="w-full text-xs">
                      <thead className="border-b border-default/70 bg-surface-secondary">
                        <tr>
                          <th className="text-left px-4 py-2.5 font-mono text-[10px] uppercase tracking-wider text-muted">
                            Parameter
                          </th>
                          <th className="text-left px-4 py-2.5 font-mono text-[10px] uppercase tracking-wider text-muted">
                            Role
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {algo.hyperparameters.map((hp, i) => (
                          <tr
                            key={i}
                            className="border-b border-default/40 last:border-0"
                          >
                            <td className="px-4 py-2.5 font-mono text-brand">{hp.name}</td>
                            <td className="px-4 py-2.5 text-muted">{hp.role}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'proscons' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <p className="label-eyebrow mb-2 text-emerald-400">Advantages</p>
                  <ul className="space-y-1.5">
                    {algo.advantages.map((a, i) => (
                      <li key={i} className="flex items-start gap-2 text-xs text-muted">
                        <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 mt-0.5 shrink-0" />
                        {a}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <p className="label-eyebrow mb-2 text-error">Disadvantages</p>
                  <ul className="space-y-1.5">
                    {algo.disadvantages.map((d, i) => (
                      <li key={i} className="flex items-start gap-2 text-xs text-muted">
                        <X className="h-3.5 w-3.5 text-error mt-0.5 shrink-0" />
                        {d}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            {activeTab === 'usecases' && (
              <div className="space-y-3">
                <div>
                  <p className="label-eyebrow mb-2">Best Use Cases</p>
                  <ul className="space-y-2">
                    {algo.useCases.map((uc, i) => (
                      <li
                        key={i}
                        className="flex items-start gap-2 rounded-lg border border-default/40 bg-background/40 px-3 py-2 text-xs text-muted"
                      >
                        <ArrowRight className="h-3.5 w-3.5 text-brand mt-0.5 shrink-0" />
                        {uc}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            {activeTab === 'metrics' && (
              <div className="space-y-3">
                <p className="label-eyebrow mb-2">Evaluation Metrics</p>
                <div className="flex flex-wrap gap-2">
                  {algo.metrics.map((m, i) => (
                    <span
                      key={i}
                      className="rounded-full border border-default bg-surface-secondary px-3 py-1 font-mono text-xs text-muted"
                    >
                      {m}
                    </span>
                  ))}
                </div>
                {algo.complexity && (
                  <div className="mt-3">
                    <p className="label-eyebrow mb-1">Computational Complexity</p>
                    <p className="font-mono text-xs text-brand">{algo.complexity}</p>
                  </div>
                )}
              </div>
            )}

            {/* Footer actions */}
            <div className="flex flex-wrap items-center gap-3 pt-2 border-t border-default/40">
              {algo.playgroundMode ? (
                <Link
                  to="/playground"
                  className="inline-flex items-center gap-1.5 rounded-full border border-brand/30 bg-brand/5 px-3 py-1.5 font-mono text-xs text-brand hover:bg-brand/10 transition"
                >
                  <FlaskConical className="h-3 w-3" /> Try in Playground{' '}
                  <ArrowRight className="h-3 w-3" />
                </Link>
              ) : (
                <span className="inline-flex items-center gap-1.5 rounded-full border border-default px-3 py-1.5 font-mono text-xs text-muted">
                  <Clock className="h-3 w-3" /> Playground not available
                </span>
              )}
            </div>
          </div>
        </div>
      )}
    </Panel>
  )
}

export default function Algorithms() {
  const [activeCategory, setActiveCategory] = useState<Category>('supervised')
  const [searchQuery, setSearchQuery] = useState('')
  const [subcategoryFilter, setSubcategoryFilter] = useState<string | null>(null)

  const filtered = useMemo(() => {
    const q = searchQuery.toLowerCase().trim()
    return ALGORITHM_LIBRARY.filter((a) => {
      if (a.category !== activeCategory) return false
      if (
        subcategoryFilter &&
        a.subcategory !== subcategoryFilter
      )
        return false
      if (!q) return true
      return (
        a.name.toLowerCase().includes(q) ||
        a.subcategory.toLowerCase().includes(q) ||
        a.problemType.some((p) => p.toLowerCase().includes(q)) ||
        a.simple.toLowerCase().includes(q)
      )
    })
  }, [activeCategory, searchQuery, subcategoryFilter])

  const subcategories = useMemo(() => {
    const cats = new Set(
      ALGORITHM_LIBRARY.filter((a) => a.category === activeCategory).map(
        (a) => a.subcategory
      )
    )
    return Array.from(cats)
  }, [activeCategory])

  const countByCategory = useMemo(() => {
    const counts: Record<string, number> = {}
    CATEGORIES.forEach((c) => {
      counts[c] = ALGORITHM_LIBRARY.filter((a) => a.category === c).length
    })
    return counts
  }, [])

  return (
    <div className="mx-auto max-w-5xl px-5 py-14">
      <Eyebrow>Reference Library</Eyebrow>
      <h1 className="font-display text-4xl font-semibold text-brand">
        ML Algorithm Library
      </h1>
      <p className="mt-2 max-w-2xl text-muted">
        {ALGORITHM_LIBRARY.length} algorithms across 4 categories — each with plain-language
        explanations, step-by-step working, LaTeX mathematics, hyperparameters, and evaluation
        metrics.
      </p>

      {/* Category tabs */}
      <div className="mt-8 grid grid-cols-2 gap-2 sm:grid-cols-4">
        {CATEGORIES.map((cat) => {
          const meta = CATEGORY_META[cat]
          const isActive = activeCategory === cat
          return (
            <button
              key={cat}
              onClick={() => {
                setActiveCategory(cat)
                setSubcategoryFilter(null)
                setSearchQuery('')
              }}
              className={`rounded-xl border p-3 text-left transition ${
                isActive
                  ? `${meta.color} border-current`
                  : 'border-default text-muted hover:border-brand hover:text-brand'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="flex items-center gap-1.5">{meta.icon} <span className="font-mono text-[11px] font-semibold">{meta.label}</span></span>
                <span className="rounded-full bg-current/10 px-1.5 py-0.5 font-mono text-[10px]">
                  {countByCategory[cat]}
                </span>
              </div>
              <p className="font-mono text-[10px] opacity-70 leading-tight">{meta.description}</p>
            </button>
          )
        })}
      </div>

      {/* Search + subcategory filters */}
      <div className="mt-5 flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search algorithms..."
            className="w-full rounded-xl border border-default bg-background/50 py-2.5 pl-9 pr-4 font-mono text-sm text-brand placeholder:text-muted outline-none focus:border-primary focus:ring-1 focus:ring-primary"
          />
        </div>
        <div className="flex flex-wrap gap-1.5">
          <button
            onClick={() => setSubcategoryFilter(null)}
            className={`rounded-full border px-3 py-1.5 font-mono text-xs transition ${
              !subcategoryFilter
                ? 'border-primary bg-brand/10 text-brand'
                : 'border-default text-muted hover:text-brand'
            }`}
          >
            All
          </button>
          {subcategories.map((sc) => (
            <button
              key={sc}
              onClick={() =>
                setSubcategoryFilter(subcategoryFilter === sc ? null : sc)
              }
              className={`rounded-full border px-3 py-1.5 font-mono text-xs transition ${
                subcategoryFilter === sc
                  ? 'border-primary bg-brand/10 text-brand'
                  : 'border-default text-muted hover:text-brand'
              }`}
            >
              {sc}
            </button>
          ))}
        </div>
      </div>

      {/* Results count */}
      <p className="mt-3 font-mono text-xs text-muted">
        Showing {filtered.length} algorithm{filtered.length !== 1 ? 's' : ''}
        {subcategoryFilter ? ` in "${subcategoryFilter}"` : ''}
        {searchQuery ? ` matching "${searchQuery}"` : ''}
      </p>

      {/* Algorithm list */}
      <div className="mt-4 space-y-3">
        {filtered.length === 0 ? (
          <Panel className="text-center py-10">
            <Search className="h-8 w-8 mx-auto text-muted mb-3" />
            <p className="text-muted">No algorithms found. Try a different search or filter.</p>
          </Panel>
        ) : (
          filtered.map((algo) => <AlgoCard key={algo.id} algo={algo} />)
        )}
      </div>
    </div>
  )
}
