import { useState } from 'react'
import { Eyebrow, SegmentedControl } from '../components/ui'
import ClassifyMode from '../components/playground/ClassifyMode'
import RegressMode from '../components/playground/RegressMode'
import ClusterMode from '../components/playground/ClusterMode'

type Mode = 'classify' | 'regress' | 'cluster'

export default function Playground() {
  const [mode, setMode] = useState<Mode>('classify')

  return (
    <div className="mx-auto max-w-[1400px] px-5 py-10">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <Eyebrow>Interactive playground</Eyebrow>
          <h1 className="font-display text-3xl font-semibold text-paper">
            {mode === 'classify' && 'Classification lab'}
            {mode === 'regress' && 'Regression lab'}
            {mode === 'cluster' && 'Clustering lab'}
          </h1>
        </div>
        <SegmentedControl
          value={mode}
          onChange={setMode}
          options={[
            { id: 'classify', label: 'Classify' },
            { id: 'regress', label: 'Regress' },
            { id: 'cluster', label: 'Cluster' },
          ]}
        />
      </div>

      {mode === 'classify' && <ClassifyMode />}
      {mode === 'regress' && <RegressMode />}
      {mode === 'cluster' && <ClusterMode />}
    </div>
  )
}
