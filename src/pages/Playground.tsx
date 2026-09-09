import { useState } from 'react'
import { Eyebrow, SegmentedControl } from '../components/ui'
import ClassifyMode from '../components/playground/ClassifyMode'
import RegressMode from '../components/playground/RegressMode'
import ClusterMode from '../components/playground/ClusterMode'
import TrainingTheory from '../components/playground/TrainingTheory'

type Mode = 'classify' | 'regress' | 'cluster' | 'theory'

export default function Playground() {
  const [mode, setMode] = useState<Mode>('classify')

  return (
    <div className="mx-auto max-w-[1400px] px-5 py-10">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <Eyebrow>Interactive playground</Eyebrow>
          <h1 className="font-display text-3xl font-semibold text-brand">
            {mode === 'classify' && 'Classification Lab'}
            {mode === 'regress' && 'Regression Lab'}
            {mode === 'cluster' && 'Clustering Lab'}
            {mode === 'theory' && 'Training Theory'}
          </h1>
        </div>
        <SegmentedControl
          value={mode}
          onChange={setMode}
          options={[
            { id: 'classify', label: 'Classify' },
            { id: 'regress', label: 'Regress' },
            { id: 'cluster', label: 'Cluster' },
            { id: 'theory', label: 'Theory' },
          ]}
        />
      </div>

      {mode === 'classify' && <ClassifyMode />}
      {mode === 'regress' && <RegressMode />}
      {mode === 'cluster' && <ClusterMode />}
      {mode === 'theory' && (
        <div className="max-w-3xl mx-auto">
          <p className="mb-6 text-muted text-sm leading-relaxed">
            An educational guide to how machine learning models are trained — covering prediction, loss
            functions, gradient descent, and how to diagnose underfitting and overfitting.
          </p>
          <TrainingTheory mode="regression" modelName="Linear Regression" />
        </div>
      )}
    </div>
  )
}
