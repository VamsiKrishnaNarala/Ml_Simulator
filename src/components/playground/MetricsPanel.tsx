import React from 'react';
import MetricTooltip from './MetricTooltip';
import { AlertTriangle, Lightbulb } from 'lucide-react';

export interface MetricResult {
  key: string;
  name: string;
  value: number | string;
  formatted: string;
  formula: string;
  explanation: string;
  direction: 'higher' | 'lower';
  goodScore: string;
  highlight?: boolean;
  warning?: string;
}

interface MetricsPanelProps {
  title: string;
  metrics: MetricResult[];
  recommendation?: string;
  className?: string;
}

export default function MetricsPanel({ title, metrics, recommendation, className = '' }: MetricsPanelProps) {
  return (
    <div className={`flex flex-col gap-4 ${className}`}>
      <h3 className="text-sm font-semibold text-muted uppercase tracking-wider">{title}</h3>
      
      <div className="flex flex-col gap-3">
        {metrics.map((metric) => (
          <div 
            key={metric.key}
            className={`flex flex-col p-4 rounded-xl border ${
              metric.highlight 
                ? 'bg-brand/5 border-brand/30' 
                : 'bg-surface-secondary border-default'
            }`}
          >
            <div className="flex justify-between items-start mb-2">
              <MetricTooltip
                name={metric.name}
                formula={metric.formula}
                explanation={metric.explanation}
                direction={metric.direction}
                goodScore={metric.goodScore}
                className={metric.highlight ? 'text-brand' : ''}
              />
              <div className={`text-2xl font-bold font-mono tracking-tight ${
                metric.highlight ? 'text-brand' : 'text-primary'
              }`}>
                {metric.formatted}
              </div>
            </div>

            {metric.warning && (
              <div className="flex items-start gap-1.5 mt-2 text-xs text-warning bg-warning/10 p-2 rounded-lg border border-warning/20">
                <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                <p>{metric.warning}</p>
              </div>
            )}
          </div>
        ))}
      </div>

      {recommendation && (
        <div className="mt-2 flex items-start gap-3 bg-surface border border-default rounded-xl p-4 text-sm text-primary shadow-sm">
          <div className="bg-brand/20 p-2 rounded-lg shrink-0 text-brand">
            <Lightbulb className="w-5 h-5" />
          </div>
          <div className="flex-1 pt-0.5 leading-relaxed">
            {recommendation}
          </div>
        </div>
      )}
    </div>
  );
}
