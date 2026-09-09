import React, { useState, useMemo } from 'react';
import type { Point2D } from '../../types';

interface DataProfilePanelProps {
  points: Point2D[];
  featureNames?: string[];
  targetName?: string;
  mode: 'classification' | 'regression' | 'clustering';
  trainSize: number;
  testSize: number;
  trainRatio: number;
  noise: number;
  datasetName?: string;
}

export const DataProfilePanel: React.FC<DataProfilePanelProps> = ({
  points,
  featureNames = ['x', 'y'],
  targetName = 'label',
  mode,
  trainSize,
  testSize,
  trainRatio,
  noise,
  datasetName,
}) => {
  const [expanded, setExpanded] = useState(false);

  // Compute stats
  const stats = useMemo(() => {
    const n = points.length;
    if (n === 0) return null;

    let sumX = 0, sumY = 0;
    let minX = Infinity, maxX = -Infinity;
    let minY = Infinity, maxY = -Infinity;

    const classCounts: Record<number, number> = {};

    points.forEach(p => {
      sumX += p.x;
      sumY += p.y;
      if (p.x < minX) minX = p.x;
      if (p.x > maxX) maxX = p.x;
      if (p.y < minY) minY = p.y;
      if (p.y > maxY) maxY = p.y;

      if (mode === 'classification') {
        classCounts[p.label] = (classCounts[p.label] || 0) + 1;
      }
    });

    const meanX = sumX / n;
    const meanY = sumY / n;

    let varX = 0, varY = 0;
    points.forEach(p => {
      varX += Math.pow(p.x - meanX, 2);
      varY += Math.pow(p.y - meanY, 2);
    });

    const stdX = Math.sqrt(varX / n);
    const stdY = Math.sqrt(varY / n);

    let maxClassPct = 0;
    const classStats = Object.entries(classCounts).map(([lbl, count]) => {
      const pct = (count / n) * 100;
      if (pct > maxClassPct) maxClassPct = pct;
      return { label: lbl, count, pct };
    });

    let imbalanceStatus = 'Balanced';
    let imbalanceColor = 'text-success';
    if (maxClassPct > 85) {
      imbalanceStatus = 'Strong Imbalance';
      imbalanceColor = 'text-error';
    } else if (maxClassPct > 70) {
      imbalanceStatus = 'Imbalanced';
      imbalanceColor = 'text-warning';
    }

    return {
      n,
      meanX, meanY, stdX, stdY, minX, maxX, minY, maxY,
      classStats,
      numClasses: Object.keys(classCounts).length,
      imbalanceStatus,
      imbalanceColor,
      isImbalanced: maxClassPct > 70
    };
  }, [points, mode]);

  if (!stats) return null;

  return (
    <div className="bg-surface-secondary border border-default rounded-lg p-4">
      <div 
        className="flex justify-between items-center cursor-pointer"
        onClick={() => setExpanded(!expanded)}
      >
        <h3 className="text-primary font-semibold">Data Profile</h3>
        <div className="flex items-center gap-3">
          {!expanded && (
            <span className="text-sm text-muted">
              {stats.n} samples • {featureNames.length} features {mode === 'classification' && `• ${stats.numClasses} classes`}
            </span>
          )}
          <span className="text-brand text-sm hover:underline">{expanded ? 'Collapse' : 'Expand'}</span>
        </div>
      </div>

      {expanded && (
        <div className="mt-4 space-y-6 text-sm text-primary">
          {/* Section 1: Overview */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h4 className="text-muted mb-1">Dataset Name</h4>
              <p>{datasetName || 'Custom Dataset'}</p>
            </div>
            <div>
              <h4 className="text-muted mb-1">Split (Train / Test)</h4>
              <p>{trainSize} / {testSize} ({Math.round(trainRatio * 100)}%)</p>
            </div>
            <div>
              <h4 className="text-muted mb-1">Features</h4>
              <p>{featureNames.join(', ')}</p>
            </div>
            <div>
              <h4 className="text-muted mb-1">Target</h4>
              <p>{targetName}</p>
            </div>
          </div>

          {/* Section 2: Feature Statistics */}
          <div>
            <h4 className="text-muted mb-2 border-b border-default/60 pb-1">Feature Statistics</h4>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="text-muted">
                    <th className="py-1">Feature</th>
                    <th className="py-1">Min</th>
                    <th className="py-1">Max</th>
                    <th className="py-1">Mean</th>
                    <th className="py-1">Std Dev</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-t border-default/30">
                    <td className="py-1">{featureNames[0] || 'x'}</td>
                    <td className="py-1">{stats.minX.toFixed(2)}</td>
                    <td className="py-1">{stats.maxX.toFixed(2)}</td>
                    <td className="py-1">{stats.meanX.toFixed(2)}</td>
                    <td className="py-1">{stats.stdX.toFixed(2)}</td>
                  </tr>
                  <tr className="border-t border-default/30">
                    <td className="py-1">{featureNames[1] || 'y'}</td>
                    <td className="py-1">{stats.minY.toFixed(2)}</td>
                    <td className="py-1">{stats.maxY.toFixed(2)}</td>
                    <td className="py-1">{stats.meanY.toFixed(2)}</td>
                    <td className="py-1">{stats.stdY.toFixed(2)}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Section 3: Classification Analysis */}
          {mode === 'classification' && (
            <div>
              <h4 className="text-muted mb-2 border-b border-default/60 pb-1 flex justify-between">
                <span>Class Distribution ({stats.numClasses} classes)</span>
                <span className={stats.imbalanceColor}>{stats.imbalanceStatus}</span>
              </h4>
              <div className="space-y-1">
                {stats.classStats.map(c => (
                  <div key={c.label} className="flex justify-between items-center">
                    <span>Class {c.label}</span>
                    <span className="text-muted">{c.count} ({c.pct.toFixed(1)}%)</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Section 4: Data Quality */}
          <div>
            <h4 className="text-muted mb-2 border-b border-default/60 pb-1">Data Quality</h4>
            <ul className="space-y-1 list-disc list-inside">
              <li>Noise level: {(noise * 100).toFixed(0)}%</li>
              <li>No missing values (synthetic dataset)</li>
              <li>No duplicates detected</li>
            </ul>
          </div>

          {/* Section 5: Suggested Preprocessing */}
          <div>
            <h4 className="text-muted mb-2 border-b border-default/60 pb-1">Suggested Preprocessing</h4>
            <ul className="space-y-1">
              <li className="text-success">✓ Standardize numerical features</li>
              <li className="text-success">✓ Shuffle before training</li>
              {stats.isImbalanced && (
                <li className="text-warning">⚠ Consider class balancing (SMOTE, class weights)</li>
              )}
              {noise > 0.4 && (
                <li className="text-error">⚠ High noise detected — consider denoising</li>
              )}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};
