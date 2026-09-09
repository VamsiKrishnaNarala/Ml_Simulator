import React, { useMemo, useEffect, useState } from 'react';

interface LossCurveProps {
  losses: number[];
  width?: number;
  height?: number;
  label?: string;
  color?: string;
  showAxes?: boolean;
  className?: string;
}

export default function LossCurve({
  losses,
  width = 280,
  height = 120,
  label = "Loss",
  color = 'rgb(var(--primary))',
  showAxes = true,
  className = ''
}: LossCurveProps) {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);
    
    const handler = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  const { pathData, padding, minLoss, maxLoss, startLoss, endLoss } = useMemo(() => {
    if (!losses || losses.length < 2) {
      return { pathData: '', padding: 20, minLoss: 0, maxLoss: 0, startLoss: 0, endLoss: 0 };
    }
    
    const pad = showAxes ? 30 : 10;
    const minLoss = Math.min(...losses);
    const maxLoss = Math.max(...losses);
    
    const range = maxLoss - minLoss === 0 ? 1 : maxLoss - minLoss;
    const chartWidth = width - pad * 2;
    const chartHeight = height - pad * 2;
    
    const points = losses.map((loss, i) => {
      const x = pad + (i / (losses.length - 1)) * chartWidth;
      const y = pad + chartHeight - ((loss - minLoss) / range) * chartHeight;
      return `${x},${y}`;
    });
    
    const startLoss = losses[0];
    const endLoss = losses[losses.length - 1];
    
    let d = `M ${points[0]}`;
    for (let i = 1; i < points.length; i++) {
      d += ` L ${points[i]}`;
    }
    
    return { pathData: d, padding: pad, minLoss, maxLoss, startLoss, endLoss };
  }, [losses, width, height, showAxes]);

  const getInterpretationText = () => {
    if (!losses || losses.length < 2) return "Waiting for training data...";
    
    const reductionRatio = (startLoss - endLoss) / startLoss;
    const minReached = Math.min(...losses);
    const plateauLength = losses.length > 10 ? 10 : Math.floor(losses.length / 2);
    
    const recentLosses = losses.slice(-plateauLength);
    const recentMax = Math.max(...recentLosses);
    const recentMin = Math.min(...recentLosses);
    const isPlateaued = (recentMax - recentMin) / startLoss < 0.05;

    if (reductionRatio > 0.8 && isPlateaued) {
      return "Rapid learning then convergence — model appears well-fitted.";
    } else if (reductionRatio > 0.5) {
      return "Loss decreased significantly — model is learning well.";
    } else if (reductionRatio < 0.1 && losses.length > 20) {
      return "Loss did not decrease much — try a higher learning rate.";
    } else {
      return "Loss curve shows training progress.";
    }
  };

  const chartWidth = width - padding * 2;
  const chartHeight = height - padding * 2;
  const endX = losses.length > 0 ? padding + chartWidth : 0;
  const endY = losses.length > 0 ? padding + chartHeight - ((endLoss - minLoss) / (maxLoss - minLoss || 1)) * chartHeight : 0;

  return (
    <div className={`flex flex-col bg-surface-secondary border border-default rounded-xl p-4 ${className}`} style={{ width: showAxes ? '100%' : width }}>
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm font-semibold text-muted uppercase tracking-wider">{label}</span>
        {losses.length > 0 && (
          <span className="text-xs font-mono text-primary bg-surface px-2 py-1 rounded border border-default/50">
            {endLoss.toFixed(4)}
          </span>
        )}
      </div>
      
      <div className="relative w-full flex justify-center overflow-hidden">
        <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} className="overflow-visible">
          {showAxes && (
            <g className="text-[10px] fill-muted font-mono">
              <line x1={padding} y1={padding} x2={padding} y2={height - padding} stroke="currentColor" strokeWidth="1" className="text-muted/30" />
              <line x1={padding} y1={height - padding} x2={width - padding} y2={height - padding} stroke="currentColor" strokeWidth="1" className="text-muted/30" />
              
              <text x={padding - 5} y={padding + 4} textAnchor="end">{maxLoss.toFixed(2)}</text>
              <text x={padding - 5} y={height - padding + 4} textAnchor="end">{minLoss.toFixed(2)}</text>
              
              <text x={padding} y={height - padding + 15} textAnchor="middle">0</text>
              <text x={width - padding} y={height - padding + 15} textAnchor="middle">{losses.length}</text>
            </g>
          )}
          
          {losses.length > 1 && (
            <>
              <path
                d={pathData}
                fill="none"
                stroke={color}
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className={prefersReducedMotion ? '' : 'transition-all duration-300 ease-linear'}
              />
              <circle 
                cx={endX} 
                cy={endY} 
                r="4" 
                fill={color}
                className={prefersReducedMotion ? '' : 'transition-all duration-300 ease-linear shadow-[0_0_8px_rgba(91,141,239,0.5)]'}
              />
            </>
          )}
        </svg>
      </div>

      <p className="mt-3 text-xs text-muted text-center leading-relaxed">
        {getInterpretationText()}
      </p>
    </div>
  );
}
