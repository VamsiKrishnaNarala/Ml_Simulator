import { useMemo, useState } from 'react'
import { CheckCircle2, XCircle, RotateCcw, Trophy } from 'lucide-react'
import { Panel, Eyebrow } from '../components/ui'
import { useLocalStorage } from '../hooks/useLocalStorage'

interface Question {
  q: string
  options: string[]
  correct: number
  explain: string
}

const QUESTIONS: Question[] = [
  {
    q: 'What happens when K becomes too small in KNN (e.g. K = 1)?',
    options: [
      'The model becomes very smooth and underfits',
      'The model becomes sensitive to noise and overfits',
      'The model stops making predictions',
      'K has no effect on the decision boundary',
    ],
    correct: 1,
    explain: 'A tiny K means a single noisy neighbor can flip the prediction — the boundary becomes jagged and overfit.',
  },
  {
    q: "What is the purpose of a test set?",
    options: [
      'To train the model faster',
      'To give the model more data to learn from',
      'To evaluate the model on data it has never seen',
      'To remove outliers from the dataset',
    ],
    correct: 2,
    explain: 'A test set checks whether the model generalizes, rather than just memorizing the training data.',
  },
  {
    q: 'Which algorithm assigns points to groups using centroids?',
    options: ['Logistic Regression', 'K-Means', 'Decision Tree', 'Naive Bayes'],
    correct: 1,
    explain: 'K-Means repeatedly assigns points to the nearest centroid, then moves each centroid to the mean of its group.',
  },
  {
    q: 'What does recall measure?',
    options: [
      'Out of all predicted positives, how many were correct',
      'Out of all actual positives, how many the model found',
      'How fast the model trains',
      'How many features the model uses',
    ],
    correct: 1,
    explain: 'Recall = TP / (TP + FN) — the fraction of real positives the model actually caught.',
  },
  {
    q: 'Which situation best describes overfitting?',
    options: [
      'Low training error and low validation error',
      'High training error and high validation error',
      'Very low training error but high validation error',
      'The model refuses to train',
    ],
    correct: 2,
    explain: 'Overfitting is when a model memorizes training data (very low training error) but fails to generalize (high validation error).',
  },
  {
    q: 'Why do KNN and K-Means need feature scaling?',
    options: [
      'They don\'t — scaling never matters for them',
      'Because they compute distances, and large-range features would dominate',
      'Because they require categorical features only',
      'Because scaling speeds up rendering',
    ],
    correct: 1,
    explain: 'Distance-based algorithms treat every unit equally, so a feature like salary (thousands) would swamp a feature like age (tens) unless scaled.',
  },
  {
    q: 'In a decision tree, what does a lower Gini impurity at a node mean?',
    options: [
      'The classes at that node are more mixed',
      'The classes at that node are more pure (mostly one class)',
      'The node has more samples',
      'The tree has finished training',
    ],
    correct: 1,
    explain: 'Gini impurity is 0 when a node is perfectly pure — every sample belongs to the same class.',
  },
  {
    q: 'What does logistic regression actually output before thresholding?',
    options: ['A class label directly', 'A probability between 0 and 1', 'A cluster ID', 'A distance value'],
    correct: 1,
    explain: 'Logistic regression outputs a probability via the sigmoid function; a threshold (often 0.5) turns it into a class.',
  },
]

export default function Quiz() {
  const [index, setIndex] = useState(0)
  const [selected, setSelected] = useState<number | null>(null)
  const [correctCount, setCorrectCount] = useState(0)
  const [finished, setFinished] = useState(false)
  const [bestScore, setBestScore] = useLocalStorage('mllab-quiz-best', 0)

  const question = QUESTIONS[index]
  const progressPct = useMemo(() => Math.round((index / QUESTIONS.length) * 100), [index])

  function selectOption(i: number) {
    if (selected !== null) return
    setSelected(i)
    if (i === question.correct) setCorrectCount((c) => c + 1)
  }

  function next() {
    if (index + 1 >= QUESTIONS.length) {
      const finalScore = correctCount + (selected === question.correct ? 0 : 0)
      setBestScore((b) => Math.max(b, finalScore))
      setFinished(true)
    } else {
      setIndex((i) => i + 1)
      setSelected(null)
    }
  }

  function restart() {
    setIndex(0)
    setSelected(null)
    setCorrectCount(0)
    setFinished(false)
  }

  if (finished) {
    return (
      <div className="mx-auto max-w-xl px-5 py-20 text-center">
        <Trophy className="mx-auto h-10 w-10 text-amber" />
        <h1 className="mt-4 font-display text-3xl font-semibold text-paper">
          {correctCount} / {QUESTIONS.length} correct
        </h1>
        <p className="mt-2 text-graphite-500">Your best score on this device: {bestScore} / {QUESTIONS.length}</p>
        <button onClick={restart} className="btn-primary mt-6">
          <RotateCcw className="h-4 w-4" /> Try again
        </button>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-2xl px-5 py-14">
      <Eyebrow>Quiz</Eyebrow>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="font-display text-3xl font-semibold text-paper">Test yourself</h1>
        <span className="font-mono text-xs text-graphite-500">
          {index + 1} / {QUESTIONS.length}
        </span>
      </div>
      <div className="mb-6 h-1.5 w-full overflow-hidden rounded-full bg-graphite-700">
        <div className="h-full rounded-full bg-cyan transition-all" style={{ width: `${progressPct}%` }} />
      </div>

      <Panel>
        <h2 className="font-display text-lg font-semibold text-paper">{question.q}</h2>
        <div className="mt-4 space-y-2.5">
          {question.options.map((opt, i) => {
            const isSelected = selected === i
            const isCorrect = i === question.correct
            const showState = selected !== null
            return (
              <button
                key={i}
                onClick={() => selectOption(i)}
                disabled={selected !== null}
                className={`flex w-full items-center justify-between rounded-xl border px-4 py-3 text-left text-sm transition ${
                  showState && isCorrect
                    ? 'border-cyan bg-cyan/10 text-cyan'
                    : showState && isSelected
                    ? 'border-rose bg-rose/10 text-rose'
                    : 'border-graphite-600 text-graphite-500 hover:border-graphite-500 hover:text-paper'
                }`}
              >
                {opt}
                {showState && isCorrect && <CheckCircle2 className="h-4 w-4 shrink-0" />}
                {showState && isSelected && !isCorrect && <XCircle className="h-4 w-4 shrink-0" />}
              </button>
            )
          })}
        </div>

        {selected !== null && (
          <div className="mt-4 rounded-xl border border-graphite-600/60 bg-graphite-900/60 p-4">
            <p className="text-sm text-graphite-500">{question.explain}</p>
            <button onClick={next} className="btn-primary mt-4 !py-1.5 text-sm">
              {index + 1 >= QUESTIONS.length ? 'See results' : 'Next question'}
            </button>
          </div>
        )}
      </Panel>
    </div>
  )
}
