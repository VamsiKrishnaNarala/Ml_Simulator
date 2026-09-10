import React from 'react';

interface ModelInputPanelProps {
  featureNames: string[];
  targetName: string;
  trainSize: number;
  testSize: number;
  trainRatio: number;
  numFeatures: number;
  modelName: string;
  preprocessing: {
    scaling: string;
    encoding: string;
    featureSelection: string;
  };
  mode: 'classification' | 'regression' | 'clustering';
  beginnerMode?: boolean;
}

export const ModelInputPanel: React.FC<ModelInputPanelProps> = ({
  featureNames,
  targetName,
  trainSize,
  testSize,
  trainRatio,
  numFeatures,
  modelName,
  preprocessing,
  mode,
  beginnerMode = false,
}) => {
  const trainPercent = Math.round(trainRatio * 100);
  const testPercent = 100 - trainPercent;

  return (
    <div className="bg-surface-secondary border border-border rounded-lg p-4 text-primary text-sm">
      <h3 className="font-semibold text-lg mb-4">Model Input Summary</h3>

      <div className="space-y-6">
        {/* Section 1: Dimensions */}
        <div>
          <h4 className="text-muted mb-2 border-b border-border/60 pb-1">Dimensions</h4>
          <div className="font-mono bg-surface p-2 rounded">
            <p>X ∈ ℝ^({trainSize} × {numFeatures})</p>
            <p className="text-muted mt-1 text-xs">n = {trainSize} samples, d = {numFeatures} features</p>
            {mode !== 'clustering' && (
              <p className="mt-2">
                {mode === 'classification' ? 'y ∈ \\{0, 1, ..., k-1\\}' : 'y ∈ ℝ'}
              </p>
            )}
          </div>
        </div>

        {/* Section 2: Features Table */}
        <div>
          <h4 className="text-muted mb-2 border-b border-border/60 pb-1">Features Used</h4>
          <ul className="font-mono space-y-1 bg-surface p-2 rounded">
            {featureNames.map((name, idx) => (
              <li key={idx}><span className="text-muted">Feature {idx + 1}:</span> {name}</li>
            ))}
            {mode !== 'clustering' && (
              <li className="mt-1 pt-1 border-t border-border/30">
                <span className="text-muted">Target:   </span> {targetName}
              </li>
            )}
          </ul>
        </div>

        {/* Section 3: Train / Test Split */}
        <div>
          <h4 className="text-muted mb-2 border-b border-border/60 pb-1">Train / Test Split</h4>
          <div className="mb-1 flex justify-between text-xs">
            <span>{trainSize} training samples</span>
            <span>{testSize} test samples</span>
          </div>
          <div className="w-full h-3 bg-surface rounded-full overflow-hidden flex">
            <div className="h-full bg-brand" style={{ width: `${trainPercent}%` }} />
            <div className="h-full bg-error" style={{ width: `${testPercent}%` }} />
          </div>
          <p className="text-center text-muted text-xs mt-1">
            {trainPercent}% / {testPercent}% split
          </p>
        </div>

        {/* Section 4: Preprocessing Applied */}
        <div>
          <h4 className="text-muted mb-2 border-b border-border/60 pb-1">Preprocessing Applied</h4>
          <div className="grid grid-cols-1 gap-2 bg-surface p-2 rounded">
            <div className="flex justify-between">
              <span className="text-muted">Scaling</span>
              <span>{preprocessing.scaling}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted">Encoding</span>
              <span>{preprocessing.encoding}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted">Feature Selection</span>
              <span>{preprocessing.featureSelection}</span>
            </div>
          </div>
        </div>

        {/* Section 5 & 6: Explanations */}
        <div>
          <h4 className="text-muted mb-2 border-b border-border/60 pb-1">
            {beginnerMode ? 'Explanation' : 'Formal Definition'}
          </h4>
          <div className="italic text-muted bg-brand/5 p-3 rounded border border-brand/20">
            {beginnerMode ? (
              <p>
                We gave the model the {featureNames.join(' and ')} coordinates of each point as input features. 
                The model learned patterns from {trainSize} training examples, then we tested it on {testSize} new examples it had never seen.
              </p>
            ) : (
              <p>
                The model receives the design matrix X ∈ ℝ^({trainSize}×{numFeatures}) and learns a function 
                f: ℝ^{numFeatures} → {mode === 'classification' ? '\\{0,1\\}' : 'ℝ'} that maps input features to {mode === 'classification' ? 'class labels' : 'continuous targets'} 
                by minimizing the empirical risk over the training distribution.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
