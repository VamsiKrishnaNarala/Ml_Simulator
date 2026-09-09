import { useState, type ReactNode, Fragment } from 'react'
import MathBlock, { MathDisplay, MathInline } from '../MathBlock'
import { ChevronDown, ChevronRight } from 'lucide-react'

interface TrainingTheoryProps {
  mode: 'classification' | 'regression' | 'clustering';
  modelName?: string;
  lossCurveData?: number[];
  trainScore?: number;
  valScore?: number;
  learningRate?: number;
  iterations?: number;
  className?: string;
}

export default function TrainingTheory({
  mode,
  modelName,
  lossCurveData,
  trainScore,
  valScore,
  learningRate,
  iterations,
  className = '',
}: TrainingTheoryProps) {
  const [globalAdvanced, setGlobalAdvanced] = useState(false);
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    A: true,
  });

  const toggleSection = (id: string) => {
    setOpenSections((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const Section = ({
    id,
    title,
    children,
  }: {
    id: string;
    title: string;
    children: ReactNode;
  }) => {
    const isOpen = openSections[id];
    return (
      <div className="border border-default rounded-lg bg-surface-secondary overflow-hidden mb-4">
        <button
          onClick={() => toggleSection(id)}
          className="w-full flex items-center justify-between p-4 hover:bg-surface-hover transition-colors"
        >
          <div className="flex items-center gap-3">
            <span className="flex items-center justify-center w-8 h-8 rounded-full bg-brand/10 text-primary border border-brand/30 font-semibold">
              {id}
            </span>
            <span className="font-semibold text-primary flex items-center gap-2">
              {title}
              <CheckCircle2 className="w-4 h-4 text-green-500" />
            </span>
          </div>
          <ChevronDown
            className={`w-5 h-5 text-muted transition-transform duration-300 ${
              isOpen ? 'rotate-180' : ''
            }`}
          />
        </button>
        <div
          className={`grid transition-all duration-300 ease-in-out ${
            isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
          }`}
        >
          <div className="overflow-hidden">
            <div className="p-4 pt-0 border-t border-default mt-2 text-primary">
              {children}
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className={`w-full ${className}`}>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-primary flex items-center gap-2">
          <BookOpen className="w-6 h-6 text-primary" />
          Training Theory
        </h2>
        <div className="flex bg-surface-secondary p-1 rounded-lg border border-default">
          <button
            onClick={() => setGlobalAdvanced(false)}
            className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
              !globalAdvanced
                ? 'bg-primary text-white shadow-sm'
                : 'text-muted hover:text-primary hover:bg-surface-hover'
            }`}
          >
            Beginner
          </button>
          <button
            onClick={() => setGlobalAdvanced(true)}
            className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors flex items-center gap-1 ${
              globalAdvanced
                ? 'bg-primary text-white shadow-sm'
                : 'text-muted hover:text-primary hover:bg-surface-hover'
            }`}
          >
            <GraduationCap className="w-4 h-4" />
            Advanced
          </button>
        </div>
      </div>

      <div className="space-y-4">
        {/* SECTION A */}
        <Section id="A" title="How Prediction Works">
          {!globalAdvanced ? (
            <p className="text-secondary leading-relaxed">
              The model takes your input data (features like x, y coordinates) and applies a mathematical function to produce a prediction.
            </p>
          ) : (
            <div className="space-y-4">
              <div className="bg-black/30 p-4 rounded-lg overflow-x-auto">
                <MathDisplay math="\hat{y} = f(X; \theta)" />
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-default">
                      <th className="py-2 px-4 font-medium text-muted">Symbol</th>
                      <th className="py-2 px-4 font-medium text-muted">Meaning</th>
                    </tr>
                  </thead>
                  <tbody className="text-sm">
                    <tr className="border-b border-default">
                      <td className="py-2 px-4 font-mono">X</td>
                      <td className="py-2 px-4">Input features matrix</td>
                    </tr>
                    <tr className="border-b border-default">
                      <td className="py-2 px-4 font-mono">
                        <MathInline math="\theta" />
                      </td>
                      <td className="py-2 px-4">Model parameters (weights, biases)</td>
                    </tr>
                    <tr className="border-b border-default">
                      <td className="py-2 px-4 font-mono">
                        <MathInline math="\hat{y}" />
                      </td>
                      <td className="py-2 px-4">Predicted output</td>
                    </tr>
                    <tr>
                      <td className="py-2 px-4 font-mono">f</td>
                      <td className="py-2 px-4">The model function</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </Section>

        {/* SECTION B */}
        <Section id="B" title="Loss Function">
          {mode === 'regression' && (
            <div className="space-y-4">
              <h3 className="font-semibold text-lg">Mean Squared Error (MSE)</h3>
              {globalAdvanced ? (
                <div className="bg-black/30 p-4 rounded-lg overflow-x-auto">
                  <MathDisplay math="\mathcal{L} = \frac{1}{n}\sum_{i=1}^{n}(y_i - \hat{y}_i)^2" />
                </div>
              ) : (
                <div className="space-y-4">
                  <p className="text-secondary">
                    We measure how wrong the prediction is by computing the average of the squared differences between actual and predicted values.
                  </p>
                  <div className="bg-surface p-4 rounded-lg space-y-2 text-sm">
                    <div className="font-semibold text-primary mb-2">Steps:</div>
                    <ol className="list-decimal list-inside space-y-1 text-secondary">
                      <li>Make prediction</li>
                      <li>Subtract actual value</li>
                      <li>Square the error</li>
                      <li>Average all errors</li>
                    </ol>
                  </div>
                  <div className="bg-brand/5 border border-brand/20 p-3 rounded-md text-sm">
                    <strong>Why square?</strong> Squaring makes large errors count more and always produces a positive number.
                  </div>
                </div>
              )}
            </div>
          )}

          {mode === 'classification' && (
            <div className="space-y-4">
              <h3 className="font-semibold text-lg">Binary Cross-Entropy</h3>
              {globalAdvanced ? (
                <div className="bg-black/30 p-4 rounded-lg overflow-x-auto">
                  <MathDisplay math="\mathcal{L} = -\frac{1}{n}\sum_{i=1}^{n}[y_i\log(\hat{y}_i) + (1-y_i)\log(1-\hat{y}_i)]" />
                </div>
              ) : (
                <div className="space-y-4">
                  <p className="text-secondary">
                    The model is penalized heavily for being confidently wrong.
                  </p>
                  <ul className="list-disc list-inside space-y-2 text-sm text-secondary bg-surface p-4 rounded-lg">
                    <li><span className="text-error font-medium">Confident wrong prediction</span> &rarr; large penalty</li>
                    <li><span className="text-green-400 font-medium">Confident correct prediction</span> &rarr; small penalty</li>
                  </ul>
                </div>
              )}
            </div>
          )}

          {mode === 'clustering' && (
            <div className="space-y-4">
              <h3 className="font-semibold text-lg">Inertia (Within-Cluster Sum of Squares)</h3>
              {globalAdvanced ? (
                <div className="bg-black/30 p-4 rounded-lg overflow-x-auto">
                  <MathDisplay math="\mathcal{L} = \sum_{k=1}^{K}\sum_{x_i \in C_k}\|x_i - \mu_k\|^2" />
                </div>
              ) : (
                <div className="space-y-4 text-secondary">
                  <p>
                    <MathInline math="\mu_k" /> is the centroid of cluster k. We minimize the total squared distance from each point to its nearest centroid.
                  </p>
                </div>
              )}
            </div>
          )}
        </Section>

        {/* SECTION C */}
        <Section id="C" title="Gradient Descent">
          <div className="space-y-6">
            <div className="bg-black/30 p-4 rounded-lg overflow-x-auto">
              <MathDisplay math="\theta_{\text{new}} = \theta_{\text{old}} - \alpha \nabla_{\theta} \mathcal{L}(\theta)" />
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-default">
                    <th className="py-2 px-4 font-medium text-muted">Symbol</th>
                    <th className="py-2 px-4 font-medium text-muted">Meaning</th>
                  </tr>
                </thead>
                <tbody className="text-sm">
                  <tr className="border-b border-default">
                    <td className="py-2 px-4 font-mono">
                      <MathInline math="\theta" />
                    </td>
                    <td className="py-2 px-4">Current parameters</td>
                  </tr>
                  <tr className="border-b border-default">
                    <td className="py-2 px-4 font-mono">
                      <MathInline math="\alpha" />
                    </td>
                    <td className="py-2 px-4">Learning rate (step size)</td>
                  </tr>
                  <tr className="border-b border-default">
                    <td className="py-2 px-4 font-mono">
                      <MathInline math="\nabla_{\theta}\mathcal{L}" />
                    </td>
                    <td className="py-2 px-4">Gradient of loss w.r.t. parameters</td>
                  </tr>
                  <tr>
                    <td className="py-2 px-4 font-mono">-</td>
                    <td className="py-2 px-4">Negative direction: move downhill on loss surface</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="bg-surface rounded-lg p-4">
              <h4 className="font-semibold mb-4 text-primary">Step-by-step Process</h4>
              <div className="flex flex-wrap items-center gap-2 text-sm text-secondary">
                {[
                  'Initialize Parameters randomly',
                  'Make Predictions using current \\theta',
                  'Calculate Loss L(\\theta)',
                  'Calculate Gradient \\nabla L',
                  'Update Parameters: \\theta \\leftarrow \\theta - \\alpha \\nabla L',
                  'Repeat until convergence',
                  'Stop when loss change < tolerance',
                ].map((step, idx, arr) => (
                  <Fragment key={idx}>
                    <div className="bg-surface-secondary px-3 py-2 rounded-md border border-default">
                      <span className="text-brand font-mono mr-2">{idx + 1}.</span>
                      {step.includes('\\') ? <MathInline math={step} /> : step}
                    </div>
                    {idx < arr.length - 1 && <ChevronRight className="w-4 h-4 text-muted" />}
                  </Fragment>
                ))}
              </div>
            </div>

            <div className="bg-brand/5 border border-brand/20 p-4 rounded-md text-sm">
              <strong className="text-primary block mb-1">Why negative direction?</strong>
              <p className="text-secondary">
                We move in the negative gradient direction because the gradient points uphill (toward increasing loss). We want to go downhill (minimize loss).
              </p>
            </div>
          </div>
        </Section>

        {/* SECTION D */}
        <Section id="D" title="Types of Gradient Descent">
          <div className="overflow-x-auto bg-surface rounded-lg border border-default">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-default bg-surface-secondary">
                  <th className="py-3 px-4 font-medium text-primary">Type</th>
                  <th className="py-3 px-4 font-medium text-muted">Data Per Update</th>
                  <th className="py-3 px-4 font-medium text-muted">Speed</th>
                  <th className="py-3 px-4 font-medium text-muted">Gradient Noise</th>
                  <th className="py-3 px-4 font-medium text-muted">Memory</th>
                  <th className="py-3 px-4 font-medium text-muted">Best For</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                <tr className="border-b border-default hover:bg-surface-hover transition-colors">
                  <td className="py-3 px-4 font-semibold">Batch GD</td>
                  <td className="py-3 px-4 text-secondary">Full dataset</td>
                  <td className="py-3 px-4 text-secondary">Slow</td>
                  <td className="py-3 px-4 text-green-400">Very stable</td>
                  <td className="py-3 px-4 text-error">High</td>
                  <td className="py-3 px-4 text-secondary">Small datasets, convex problems</td>
                </tr>
                <tr className="border-b border-default hover:bg-surface-hover transition-colors">
                  <td className="py-3 px-4 font-semibold">SGD</td>
                  <td className="py-3 px-4 text-secondary">1 sample</td>
                  <td className="py-3 px-4 text-green-400">Fast</td>
                  <td className="py-3 px-4 text-error">Very noisy</td>
                  <td className="py-3 px-4 text-green-400">Low</td>
                  <td className="py-3 px-4 text-secondary">Online learning, large datasets</td>
                </tr>
                <tr className="hover:bg-surface-hover transition-colors">
                  <td className="py-3 px-4 font-semibold">Mini-Batch GD</td>
                  <td className="py-3 px-4 text-secondary">n samples (32-256)</td>
                  <td className="py-3 px-4 text-blue-400">Balanced</td>
                  <td className="py-3 px-4 text-blue-400">Medium</td>
                  <td className="py-3 px-4 text-blue-400">Medium</td>
                  <td className="py-3 px-4 text-secondary">Deep learning, GPU training</td>
                </tr>
              </tbody>
            </table>
          </div>
        </Section>

        {/* SECTION E */}
        <Section id="E" title="Overfitting & Underfitting">
          <div className="space-y-6">
            {trainScore !== undefined && valScore !== undefined && (
              <div className="bg-black/30 rounded-lg p-4 border border-default">
                <h4 className="font-semibold text-primary mb-4">Live Diagnostic</h4>
                <div className="flex flex-col gap-4">
                  <div>
                    <div className="flex justify-between mb-1 text-sm">
                      <span className="text-secondary">Train Score</span>
                      <span className="font-mono text-primary">{(trainScore * 100).toFixed(1)}%</span>
                    </div>
                    <div className="w-full bg-graphite-800 rounded-full h-2">
                      <div
                        className="bg-primary h-2 rounded-full transition-all duration-500"
                        style={{ width: `${trainScore * 100}%` }}
                      ></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between mb-1 text-sm">
                      <span className="text-secondary">Validation Score</span>
                      <span className="font-mono text-green-400">{(valScore * 100).toFixed(1)}%</span>
                    </div>
                    <div className="w-full bg-graphite-800 rounded-full h-2">
                      <div
                        className="bg-green-500 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${valScore * 100}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
                <div className="mt-4 p-3 bg-graphite-900 rounded-md text-sm border border-graphite-700">
                  {trainScore > 0.9 && valScore < 0.7 ? (
                    <p className="text-error"><strong>Possible Overfitting:</strong> Model memorizes training data but fails to generalize.</p>
                  ) : trainScore < 0.6 && valScore < 0.6 ? (
                    <p className="text-amber-500"><strong>Possible Underfitting:</strong> Model is too simple to capture the underlying patterns.</p>
                  ) : (
                    <p className="text-green-400"><strong>Good Fit:</strong> Model performs well on both training and validation sets.</p>
                  )}
                </div>
              </div>
            )}

            <div className="space-y-4">
              <h4 className="font-semibold text-primary">Theory</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Underfitting */}
                <div className="bg-surface border border-default rounded-lg p-4 flex flex-col items-center">
                  <h5 className="font-medium text-sm text-secondary mb-4">Underfitting</h5>
                  <div className="flex items-end gap-2 h-24 mb-4 w-full justify-center border-b border-graphite-700 pb-2">
                    <div className="w-8 bg-primary/40 h-10 rounded-t-sm" title="Train Score"></div>
                    <div className="w-8 bg-green-500/40 h-8 rounded-t-sm" title="Val Score"></div>
                  </div>
                  <p className="text-xs text-muted text-center">Low train, low val scores.</p>
                  <p className="text-xs text-primary mt-2 text-center">Fix: Increase model complexity, train longer.</p>
                </div>
                
                {/* Good Fit */}
                <div className="bg-brand/5 border border-brand/30 rounded-lg p-4 flex flex-col items-center shadow-[0_0_15px_rgba(59,130,246,0.1)]">
                  <h5 className="font-medium text-sm text-primary mb-4">Good Fit</h5>
                  <div className="flex items-end gap-2 h-24 mb-4 w-full justify-center border-b border-brand/20 pb-2">
                    <div className="w-8 bg-primary h-20 rounded-t-sm shadow-[0_0_10px_rgba(59,130,246,0.5)]" title="Train Score"></div>
                    <div className="w-8 bg-green-500 h-16 rounded-t-sm shadow-[0_0_10px_rgba(34,197,94,0.5)]" title="Val Score"></div>
                  </div>
                  <p className="text-xs text-muted text-center">High train, high val scores.</p>
                  <p className="text-xs text-green-400 mt-2 text-center">Ideal state!</p>
                </div>

                {/* Overfitting */}
                <div className="bg-surface border border-default rounded-lg p-4 flex flex-col items-center">
                  <h5 className="font-medium text-sm text-secondary mb-4">Overfitting</h5>
                  <div className="flex items-end gap-2 h-24 mb-4 w-full justify-center border-b border-graphite-700 pb-2">
                    <div className="w-8 bg-primary h-22 rounded-t-sm" title="Train Score" style={{ height: '88px' }}></div>
                    <div className="w-8 bg-green-500/40 h-8 rounded-t-sm" title="Val Score"></div>
                  </div>
                  <p className="text-xs text-muted text-center">High train, lower val scores.</p>
                  <p className="text-xs text-primary mt-2 text-center">Fix: Add regularization, more data, simplify model.</p>
                </div>
              </div>
            </div>

            <div className="text-xs text-muted italic bg-black/10 p-3 rounded border border-graphite-700/50 mt-4">
              <span className="font-semibold">Disclaimer:</span> These diagnostics are heuristic guides based on score gaps. What constitutes overfitting depends heavily on the dataset size, domain complexity, and chosen metric.
            </div>
          </div>
        </Section>
      </div>
    </div>
  );
}
