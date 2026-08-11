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

const ALL_QUESTIONS: Question[] = [
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
  {
    q: 'Which of the following is an example of unsupervised learning?',
    options: ['Classifying emails as spam', 'Predicting house prices', 'Grouping customers by purchasing behavior', 'Diagnosing a disease'],
    correct: 2,
    explain: 'Unsupervised learning finds hidden patterns in unlabeled data, like grouping similar customers without predefined categories.',
  },
  {
    q: 'What is the main goal of Gradient Descent?',
    options: ['To increase the model loss', 'To find the minimum of a cost function', 'To randomly initialize weights', 'To add more features to the dataset'],
    correct: 1,
    explain: 'Gradient Descent iteratively adjusts parameters in the direction that reduces the cost (or error) function the most.',
  },
  {
    q: 'What does the learning rate determine?',
    options: ['How fast the computer runs', 'The size of the steps taken towards the minimum loss', 'The number of layers in the network', 'The number of features in the input'],
    correct: 1,
    explain: 'The learning rate controls how big of a step the algorithm takes during optimization. Too large, and it misses the minimum; too small, and it takes too long.',
  },
  {
    q: 'Which algorithm is best suited for predicting a continuous numerical value?',
    options: ['Logistic Regression', 'K-Means', 'Linear Regression', 'Decision Tree Classifier'],
    correct: 2,
    explain: 'Linear Regression predicts continuous output variables, while Logistic Regression and Classifiers predict categories.',
  },
  {
    q: 'What is a hyperparameter?',
    options: ['A parameter learned by the model during training', 'A configuration value set before training begins', 'A data point that is an outlier', 'A feature that has been scaled'],
    correct: 1,
    explain: 'Hyperparameters (like K in KNN or the learning rate) are choices you make before training starts, not numbers the model learns on its own.',
  },
  {
    q: 'What problem does cross-validation help solve?',
    options: ['It makes the model train faster', 'It ensures the model does not overfit to a specific train/test split', 'It removes the need for feature scaling', 'It increases the size of the dataset'],
    correct: 1,
    explain: 'Cross-validation rotates which data is used for testing, ensuring the model\'s evaluation is robust and not just lucky on one split.',
  },
  {
    q: 'In Random Forests, how are individual trees made different from each other?',
    options: ['They are given different target variables', 'They are trained on random subsets of data and features', 'They use completely different algorithms', 'They are exactly the same'],
    correct: 1,
    explain: 'Random Forests gain power by training many unique decision trees using random samples of data and random subsets of features (bagging).',
  }
]

export default function Quiz() {
  const [currentQuestions, setCurrentQuestions] = useState<Question[]>([])
  const [index, setIndex] = useState(0)
  const [selected, setSelected] = useState<number | null>(null)
  const [correctCount, setCorrectCount] = useState(0)
  const [finished, setFinished] = useState(false)
  const [bestScore, setBestScore] = useLocalStorage('mllab-quiz-best', 0)

  // Initialize a random set of questions on mount
  useMemo(() => {
    if (currentQuestions.length === 0) {
      const shuffled = [...ALL_QUESTIONS].sort(() => 0.5 - Math.random())
      setCurrentQuestions(shuffled.slice(0, 8))
    }
  }, [currentQuestions.length])

  if (currentQuestions.length === 0) return null

  const question = currentQuestions[index]
  const progressPct = Math.round((index / currentQuestions.length) * 100)

  function selectOption(i: number) {
    if (selected !== null) return
    setSelected(i)
    if (i === question.correct) setCorrectCount((c) => c + 1)
  }

  function next() {
    if (index + 1 >= currentQuestions.length) {
      const finalScore = correctCount + (selected === question.correct ? 1 : 0)
      setBestScore((b) => Math.max(b, finalScore))
      setFinished(true)
    } else {
      setIndex((i) => i + 1)
      setSelected(null)
    }
  }

  function restart() {
    const shuffled = [...ALL_QUESTIONS].sort(() => 0.5 - Math.random())
    setCurrentQuestions(shuffled.slice(0, 8))
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
          {correctCount} / {currentQuestions.length} correct
        </h1>
        <p className="mt-2 text-graphite-500">Your best score on this device: {bestScore} / {currentQuestions.length}</p>
        <button onClick={restart} className="btn-primary mt-6">
          <RotateCcw className="h-4 w-4" /> Try another set
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
          {index + 1} / {currentQuestions.length}
        </span>
      </div>
      <div className="mb-6 h-1.5 w-full overflow-hidden rounded-full bg-graphite-700">
        <div className="h-full rounded-full bg-primary transition-all" style={{ width: `${progressPct}%` }} />
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
                    ? 'border-primary bg-primary/10 text-primary'
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
              {index + 1 >= currentQuestions.length ? 'See results' : 'Next question'}
            </button>
          </div>
        )}
      </Panel>
    </div>
  )
}
