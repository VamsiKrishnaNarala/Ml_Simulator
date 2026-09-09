import React, { useState, useRef } from 'react';
import { Info, ArrowUp, ArrowDown } from 'lucide-react';

interface MetricTooltipProps {
  name: string;
  formula: string;
  explanation: string;
  direction: 'higher' | 'lower';
  goodScore: string;
  className?: string;
}

export default function MetricTooltip({
  name,
  formula,
  explanation,
  direction,
  goodScore,
  className = ''
}: MetricTooltipProps) {
  const [isVisible, setIsVisible] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <div 
      className={`relative inline-flex items-center gap-1.5 ${className}`}
      ref={containerRef}
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
      onFocus={() => setIsVisible(true)}
      onBlur={() => setIsVisible(false)}
      tabIndex={0}
      role="button"
      aria-label={`Info about ${name}`}
      title={`Info about ${name}`}
    >
      <span className="font-medium text-primary">{name}</span>
      <Info className="w-4 h-4 text-muted hover:text-brand transition-colors cursor-help" />
      
      {isVisible && (
        <div className="absolute z-50 bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 bg-surface-secondary border border-default rounded-xl p-3 text-xs text-muted shadow-lg pointer-events-none transition-opacity animate-in fade-in zoom-in-95 duration-200">
          <div className="mb-2">
            <div className="font-semibold text-primary text-sm mb-1">{name}</div>
            <div className="font-mono text-[10px] bg-surface p-1.5 rounded text-secondary break-words">
              {formula}
            </div>
          </div>
          
          <p className="mb-2 text-muted leading-relaxed">
            {explanation}
          </p>
          
          <div className="flex flex-col gap-1.5 mt-3 pt-3 border-t border-default/70">
            <div className={`flex items-center gap-1 font-medium ${direction === 'higher' ? 'text-brand' : 'text-brand'}`}>
              {direction === 'higher' ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />}
              {direction === 'higher' ? 'Higher is better' : 'Lower is better'}
            </div>
            <div className="text-muted">
              <span className="font-medium text-secondary">Target:</span> {goodScore}
            </div>
          </div>
          
          {/* Arrow */}
          <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-px border-4 border-transparent border-t-default" />
          <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-0.5 border-4 border-transparent border-t-surface-secondary" />
        </div>
      )}
    </div>
  );
}
