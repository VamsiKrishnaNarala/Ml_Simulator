import { useState, useMemo, useEffect, useRef } from 'react'
import { Panel, Eyebrow, SliderControl, StatCard, InsightBox } from '../ui'
import Plot from '../Plot'
import { generateRegressionData } from '../../datasets/generators'
import { runGradientDescent } from '../../algorithms/linearRegression'
import { computeAllRegressionMetrics, REGRESSION_METRIC_META, type RegressionMetrics } from '../../utils/regressionMetrics'
import type { RegressionPoint } from '../../types'

export default function RegressMode() {
  // Dataset state
  const [samples, setSamples] = useState(50);
  const [noise, setNoise] = useState(0.5);
  const [seed, setSeed] = useState(42);

  // Gradient Descent state
  const [learningRate, setLearningRate] = useState(0.01);
  const [iterations, setIterations] = useState(100);

  // Playback state
  const [step, setStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showExplanation, setShowExplanation] = useState(false);

  const timerRef = useRef<number | null>(null);

  // Generate data
  const data = useMemo(() => {
    return generateRegressionData({ samples, noise, seed });
  }, [samples, noise, seed]);

  // Run gradient descent
  const steps = useMemo(() => {
    setStep(0);
    setIsPlaying(false);
    return runGradientDescent(data, { learningRate, iterations });
  }, [data, learningRate, iterations]);

  const current = steps[step] || { m: 0, b: 0, mse: 0, iter: 0 };
  const maxStep = steps.length - 1;

  // Animation effect
  useEffect(() => {
    if (isPlaying) {
      timerRef.current = window.setInterval(() => {
        setStep(s => {
          if (s >= maxStep) {
            setIsPlaying(false);
            return s;
          }
          return s + 1;
        });
      }, 50);
    } else if (timerRef.current !== null) {
      clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current !== null) clearInterval(timerRef.current);
    };
  }, [isPlaying, maxStep]);

  // Compute metrics
  const metrics = useMemo<RegressionMetrics | null>(() => {
    if (step === 0 || data.length === 0) return null;
    const y = data.map(d => d.y);
    const yHat = data.map(d => current.m * d.x + current.b);
    return computeAllRegressionMetrics(y, yHat, 1);
  }, [data, current.m, current.b, step]);

  // Loss Curve logic
  const lossCurve = useMemo(() => {
    if (steps.length === 0) return null;
    const width = 300;
    const height = 60;
    const padding = 5;
    
    const maxMse = Math.max(...steps.map(s => s.mse));
    const minMse = Math.min(...steps.map(s => s.mse));
    const range = maxMse - minMse || 1;

    const points = steps.map((s, i) => {
      const x = padding + (i / maxStep) * (width - 2 * padding);
      const y = height - padding - ((s.mse - minMse) / range) * (height - 2 * padding);
      return `${x},${y}`;
    }).join(' ');

    const initialMse = steps[0].mse;
    const finalMse = steps[maxStep].mse;
    
    let interpretation = "Loss decreased during training.";
    if (finalMse < initialMse * 0.3) {
      interpretation = "Loss reduced by >70% — model is learning well.";
    } else if (finalMse > initialMse * 0.9) {
      interpretation = "Loss barely decreased — try adjusting the learning rate.";
    }

    return { points, width, height, interpretation };
  }, [steps, maxStep]);

  // Fit Assessment
  const fitDiagnostic = useMemo(() => {
    if (!metrics) return null;
    const r2 = metrics.r2;
    let message = "";
    if (r2 > 0.8) message = "Good Fit — the model explains most variance in the data.";
    else if (r2 > 0.5) message = "Moderate Fit — consider adding polynomial features for non-linear data.";
    else message = "Poor Fit — the model may be underfitting. Try increasing noise or using a more flexible model.";
    
    return { r2, message };
  }, [metrics]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-full text-paper">
      {/* Left Column: Controls */}
      <div className="flex flex-col gap-6 overflow-y-auto pr-2">
        <Panel>
          <Eyebrow>Dataset Generator</Eyebrow>
          <div className="space-y-4 mt-4">
            <SliderControl
              label="Samples"
              value={samples}
              min={10}
              max={200}
              step={1}
              onChange={setSamples}
            />
            <SliderControl
              label="Noise Level"
              value={noise}
              min={0}
              max={2}
              step={0.1}
              onChange={setNoise}
            />
            <SliderControl
              label="Random Seed"
              value={seed}
              min={1}
              max={100}
              step={1}
              onChange={setSeed}
            />
          </div>
        </Panel>

        <Panel>
          <Eyebrow>Gradient Descent Params</Eyebrow>
          <div className="space-y-4 mt-4">
            <SliderControl
              label="Learning Rate"
              value={learningRate}
              min={0.001}
              max={0.1}
              step={0.001}
              onChange={setLearningRate}
            />
            <SliderControl
              label="Iterations"
              value={iterations}
              min={10}
              max={500}
              step={10}
              onChange={setIterations}
            />
          </div>
        </Panel>
        
        <Panel>
          <Eyebrow>Math & Intuition</Eyebrow>
          <div className="mt-4 space-y-4">
            <div className="flex justify-between items-center text-sm">
              <span className="text-graphite-500">Show beginner explanation</span>
              <button 
                onClick={() => setShowExplanation(!showExplanation)}
                className={`w-10 h-5 rounded-full relative transition-colors ${showExplanation ? 'bg-primary' : 'bg-graphite-600/60'}`}
              >
                <div className={`absolute top-1 left-1 w-3 h-3 rounded-full bg-white transition-transform ${showExplanation ? 'translate-x-5' : ''}`} />
              </button>
            </div>
            
            {showExplanation && (
              <div className="text-sm bg-primary/10 border border-primary/20 p-3 rounded text-primary">
                The model is trying to find the best fitting line by iteratively reducing the error between its predictions and the actual data points.
              </div>
            )}
            
            <div className="bg-graphite-900/60 p-3 rounded border border-graphite-600/60 font-mono text-xs overflow-x-auto text-amber-400">
              <div>MSE = (1/n) Σ (y_i - (mx_i + b))²</div>
              <div className="mt-2 text-emerald-400">m ← m - α · ∂MSE/∂m</div>
              <div className="text-emerald-400">b ← b - α · ∂MSE/∂b</div>
            </div>
          </div>
        </Panel>
      </div>

      {/* Center Column: Plot & Loss Curve */}
      <div className="flex flex-col gap-6">
        <Panel className="flex-1 flex flex-col min-h-[400px]">
          <Eyebrow>Linear Regression Fit</Eyebrow>
          <div className="flex-1 mt-4 relative">
            <Plot
              regressionPoints={data}
              regressionLine={current}
              ariaLabel="Regression plot"
            />
          </div>
          
          <div className="mt-6 space-y-4">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className="px-4 py-2 bg-primary text-white rounded hover:bg-primary/90 transition-colors font-medium min-w-[80px]"
              >
                {isPlaying ? 'Pause' : step >= maxStep ? 'Restart' : 'Play'}
              </button>
              <div className="flex-1">
                <SliderControl
                  label={`Step ${step} / ${maxStep}`}
                  value={step}
                  min={0}
                  max={maxStep}
                  step={1}
                  onChange={setStep}
                />
              </div>
            </div>
            
            {lossCurve && (
              <div className="bg-graphite-900/60 rounded p-4 border border-graphite-600/60">
                <div className="text-sm text-graphite-500 mb-2">Loss Curve (MSE over iterations)</div>
                <div className="w-full flex justify-center overflow-hidden">
                  <svg width="100%" viewBox={`0 0 ${lossCurve.width} ${lossCurve.height}`} preserveAspectRatio="none" className="overflow-visible h-[60px]">
                    <polyline
                      points={lossCurve.points}
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      className="text-primary"
                      strokeLinejoin="round"
                      strokeLinecap="round"
                    />
                  </svg>
                </div>
                <div className="text-xs text-graphite-500 mt-2 text-center">
                  {lossCurve.interpretation}
                </div>
              </div>
            )}
          </div>
        </Panel>
      </div>

      {/* Right Column: Metrics & State */}
      <div className="flex flex-col gap-6 overflow-y-auto pr-2">
        <Panel>
          <Eyebrow>Current State</Eyebrow>
          <div className="grid grid-cols-2 gap-4 mt-4">
            <StatCard label="Slope (m)" value={current.m.toFixed(4)} />
            <StatCard label="Intercept (b)" value={current.b.toFixed(4)} />
            <StatCard label="MSE" value={current.mse.toFixed(4)} className="col-span-2" />
          </div>
          <div className="mt-4 p-3 bg-graphite-900/60 rounded border border-graphite-600/60 text-sm">
            <div className="text-graphite-500 mb-1">Current Equation:</div>
            <div className="font-mono text-emerald-400">
              y = {current.m.toFixed(3)}x {current.b >= 0 ? '+' : '-'} {Math.abs(current.b).toFixed(3)}
            </div>
          </div>
        </Panel>

        {metrics && (
          <>
            <Panel>
              <Eyebrow>Regression Metrics</Eyebrow>
              <div className="space-y-3 mt-4">
                {REGRESSION_METRIC_META.map(meta => {
                  let valStr = "N/A";
                  if (meta.key === 'mape' && !isFinite(metrics.mape)) {
                    valStr = "N/A*";
                  } else {
                    valStr = metrics[meta.key].toFixed(4);
                  }
                  
                  return (
                    <div key={meta.key} className="p-3 bg-graphite-900/60 rounded border border-graphite-600/60 flex flex-col gap-1">
                      <div className="flex justify-between items-center">
                        <span className="font-medium text-sm" title={meta.explanation}>{meta.name}</span>
                        <span className={`font-mono text-sm ${meta.direction === 'higher' ? 'text-emerald-400' : 'text-amber-400'}`}>
                          {valStr}
                        </span>
                      </div>
                      <div className="text-xs text-graphite-500 flex justify-between">
                        <span>{meta.formula}</span>
                        <span>{meta.direction === 'higher' ? '↑ Better' : '↓ Better'}</span>
                      </div>
                    </div>
                  );
                })}
                {!isFinite(metrics.mape) && (
                  <div className="text-xs text-graphite-500 mt-2">
                    * MAPE is N/A because the dataset contains zero values.
                  </div>
                )}
                {metrics.r2 && (
                  <InsightBox className="mt-4">
                    The fitted line explains {(metrics.r2 * 100).toFixed(1)}% of the variance in the data (R² = {metrics.r2.toFixed(4)}).
                  </InsightBox>
                )}
              </div>
            </Panel>

            {fitDiagnostic && (
              <Panel>
                <Eyebrow>Model Fit Assessment</Eyebrow>
                <div className="mt-4 space-y-3">
                  <div className={`p-3 rounded border text-sm font-medium ${
                    fitDiagnostic.r2 > 0.8 ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' : 
                    fitDiagnostic.r2 > 0.5 ? 'bg-amber-500/10 border-amber-500/30 text-amber-400' : 
                    'bg-rose-500/10 border-rose-500/30 text-rose'
                  }`}>
                    {fitDiagnostic.message}
                  </div>
                  <div className="text-xs text-graphite-500 italic">
                    This is a heuristic assessment. R² interpretation depends on the domain and problem.
                  </div>
                </div>
              </Panel>
            )}
          </>
        )}
      </div>
    </div>
  );
}
