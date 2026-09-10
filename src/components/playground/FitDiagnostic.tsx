import React from 'react';
import { AlertCircle, CheckCircle2, TrendingDown } from 'lucide-react';

interface FitDiagnosticProps {
  trainScore: number;
  valScore: number;
  metricName?: string;
  mode?: 'classification' | 'regression' | 'clustering';
  className?: string;
}

export default function FitDiagnostic({
  trainScore,
  valScore,
  metricName = "Score",
  mode = 'classification',
  className = ''
}: FitDiagnosticProps) {
  
  const gap = trainScore - valScore;
  
  let fitStatus: 'underfitting' | 'overfitting' | 'good';
  let badgeColor: string;
  let icon: React.ReactNode;
  let recommendations: string[];
  let message: string;

  if (valScore < 0.5 && trainScore < 0.6) {
    fitStatus = 'underfitting';
    badgeColor = 'bg-warning/10 text-warning border-warning/20';
    icon = <TrendingDown className="w-4 h-4" />;
    message = "Model is failing to learn the underlying patterns.";
    recommendations = [
      "Try a more complex model (e.g. increase depth, more layers)",
      "Add more meaningful features or polynomial features",
      "Reduce regularization parameters",
      "Train for more iterations/epochs"
    ];
  } else if (gap > 0.15) {
    fitStatus = 'overfitting';
    badgeColor = 'bg-error/10 text-error border-error/20';
    icon = <AlertCircle className="w-4 h-4" />;
    message = "Model memorized training data but fails to generalize.";
    recommendations = [
      "Increase regularization (L1/L2, dropout)",
      "Provide more diverse training data if possible",
      "Reduce model complexity (fewer parameters/depth)",
      "Use early stopping or cross-validation"
    ];
  } else {
    fitStatus = 'good';
    badgeColor = 'bg-success/10 text-success border-success/20';
    icon = <CheckCircle2 className="w-4 h-4" />;
    message = "Training and validation performance are both strong and similar.";
    recommendations = [
      "Fine-tune hyperparameters for minor improvements",
      "Evaluate on a completely held-out test set to confirm",
      "Check performance across specific subgroups or edge cases"
    ];
  }

  const statusLabels = {
    underfitting: "Underfitting",
    overfitting: "Overfitting",
    good: "Good Fit"
  };

  return (
    <div className={`flex flex-col bg-surface-secondary border border-border rounded-xl p-5 ${className}`}>
      <div className="flex justify-between items-center mb-4 border-b border-border/70 pb-3">
        <h3 className="text-sm font-semibold text-muted uppercase tracking-wider">
          Fit Diagnostic <span className="text-[10px] font-normal normal-case text-muted bg-surface px-1.5 py-0.5 rounded ml-1">(Heuristic)</span>
        </h3>
        
        <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full border text-xs font-medium ${badgeColor}`}>
          {icon}
          {statusLabels[fitStatus]}
        </div>
      </div>

      <p className="text-sm text-primary mb-5">
        {message}
      </p>

      <div className="flex flex-col gap-3 mb-6">
        {/* Train Score Bar */}
        <div className="flex items-center gap-3">
          <div className="w-12 text-xs font-medium text-muted text-right">Train</div>
          <div className="flex-1 h-3 bg-surface rounded-full overflow-hidden">
            <div 
              className="h-full bg-brand/60 transition-all duration-500 rounded-full"
              style={{ width: `${Math.max(0, Math.min(100, trainScore * 100))}%` }}
            />
          </div>
          <div className="w-10 text-xs font-mono text-primary text-right">
            {trainScore.toFixed(2)}
          </div>
        </div>
        
        {/* Validation Score Bar */}
        <div className="flex items-center gap-3">
          <div className="w-12 text-xs font-medium text-muted text-right">Val</div>
          <div className="flex-1 h-3 bg-surface rounded-full overflow-hidden relative">
            <div 
              className={`h-full transition-all duration-500 rounded-full ${fitStatus === 'overfitting' ? 'bg-error/80' : 'bg-brand/90'}`}
              style={{ width: `${Math.max(0, Math.min(100, valScore * 100))}%` }}
            />
          </div>
          <div className="w-10 text-xs font-mono text-primary text-right">
            {valScore.toFixed(2)}
          </div>
        </div>
        
        <div className="flex justify-end pr-2 text-[10px] text-muted font-mono mt-1">
          Gap: {gap > 0 ? '+' : ''}{gap.toFixed(3)}
        </div>
      </div>

      <div className="bg-surface rounded-lg p-4 border border-border/50">
        <h4 className="text-xs font-medium text-primary mb-2">Recommendations</h4>
        <ul className="text-xs text-muted space-y-1.5 list-disc pl-4">
          {recommendations.map((rec, i) => (
            <li key={i}>{rec}</li>
          ))}
        </ul>
      </div>

      <div className="mt-4 pt-4 border-t border-border/50 text-[10px] text-muted italic text-center">
        These thresholds are heuristic guides, not absolute rules. Results depend on dataset size, domain, and problem type.
      </div>
    </div>
  );
}
