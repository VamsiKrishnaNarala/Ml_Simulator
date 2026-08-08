import { useEffect, useRef, useState, useCallback } from 'react'
import type { Point2D } from '../types'

export const CLASS_COLORS = ['#5B8DEF', '#FF6B7A', '#F5A623', '#5EEAD4']
export const CLASS_COLORS_SOFT = ['rgba(91,141,239,0.22)', 'rgba(255,107,122,0.22)', 'rgba(245,166,35,0.22)', 'rgba(94,234,212,0.22)']

interface Centroid {
  x: number
  y: number
}

interface PlotProps {
  points: Point2D[]
  domain?: number // data spans [-domain, domain] on both axes
  predict?: (x: number, y: number) => number
  showBoundary?: boolean
  resolution?: number // grid cells per axis for the boundary raster
  highlightPoint?: { x: number; y: number } | null
  neighborKeys?: Set<number> // indices of points to ring (KNN neighbors)
  centroids?: Centroid[]
  centroidColors?: string[]
  onCanvasClick?: (x: number, y: number) => void
  onPointDrag?: (index: number, x: number, y: number) => void
  onCentroidDrag?: (index: number, x: number, y: number) => void
  regressionLine?: { m: number; b: number } | null
  regressionPoints?: { x: number; y: number }[]
  height?: number
  ariaLabel?: string
}

export default function Plot({
  points,
  domain = 10,
  predict,
  showBoundary = true,
  resolution = 48,
  highlightPoint,
  neighborKeys,
  centroids,
  centroidColors,
  onCanvasClick,
  onPointDrag,
  onCentroidDrag,
  regressionLine,
  regressionPoints,
  height = 420,
  ariaLabel = 'Data visualization canvas',
}: PlotProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [size, setSize] = useState({ w: 600, h: height })
  const draggingIndex = useRef<number | null>(null)

  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    const ro = new ResizeObserver((entries) => {
      for (const entry of entries) {
        setSize({ w: entry.contentRect.width, h: height })
      }
    })
    ro.observe(el)
    return () => ro.disconnect()
  }, [height])

  const toPixel = useCallback(
    (x: number, y: number) => {
      const px = ((x + domain) / (domain * 2)) * size.w
      const py = size.h - ((y + domain) / (domain * 2)) * size.h
      return [px, py] as const
    },
    [size, domain],
  )

  const toData = useCallback(
    (px: number, py: number) => {
      const x = (px / size.w) * (domain * 2) - domain
      const y = ((size.h - py) / size.h) * (domain * 2) - domain
      return [x, y] as const
    },
    [size, domain],
  )

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const dpr = window.devicePixelRatio || 1
    canvas.width = size.w * dpr
    canvas.height = size.h * dpr
    canvas.style.width = `${size.w}px`
    canvas.style.height = `${size.h}px`
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    ctx.scale(dpr, dpr)
    ctx.clearRect(0, 0, size.w, size.h)

    // Decision boundary raster
    if (predict && showBoundary) {
      const cellW = size.w / resolution
      const cellH = size.h / resolution
      for (let i = 0; i < resolution; i++) {
        for (let j = 0; j < resolution; j++) {
          const px = i * cellW + cellW / 2
          const py = j * cellH + cellH / 2
          const [dx, dy] = toData(px, py)
          const label = predict(dx, dy)
          ctx.fillStyle = CLASS_COLORS_SOFT[label % CLASS_COLORS_SOFT.length]
          ctx.fillRect(i * cellW, j * cellH, cellW + 1, cellH + 1)
        }
      }
    }

    // Grid lines (axes through origin)
    const [ox, oy] = toPixel(0, 0)
    ctx.strokeStyle = 'rgba(94,234,212,0.25)'
    ctx.lineWidth = 1
    ctx.beginPath()
    ctx.moveTo(0, oy)
    ctx.lineTo(size.w, oy)
    ctx.moveTo(ox, 0)
    ctx.lineTo(ox, size.h)
    ctx.stroke()

    // Regression line
    if (regressionLine) {
      const { m, b } = regressionLine
      const x1 = -domain
      const y1 = m * x1 + b
      const x2 = domain
      const y2 = m * x2 + b
      const [px1, py1] = toPixel(x1, y1)
      const [px2, py2] = toPixel(x2, y2)
      ctx.strokeStyle = '#5EEAD4'
      ctx.lineWidth = 2.5
      ctx.shadowColor = 'rgba(94,234,212,0.6)'
      ctx.shadowBlur = 8
      ctx.beginPath()
      ctx.moveTo(px1, py1)
      ctx.lineTo(px2, py2)
      ctx.stroke()
      ctx.shadowBlur = 0
    }

    // Regression scatter (single-color, for linear regression module)
    if (regressionPoints) {
      for (const p of regressionPoints) {
        const [px, py] = toPixel(p.x, p.y)
        ctx.beginPath()
        ctx.fillStyle = '#F5A623'
        ctx.arc(px, py, 4.5, 0, Math.PI * 2)
        ctx.fill()
      }
    }

    // Classification points
    points.forEach((p, idx) => {
      const [px, py] = toPixel(p.x, p.y)
      const isNeighbor = neighborKeys?.has(idx)
      if (isNeighbor) {
        ctx.beginPath()
        ctx.strokeStyle = '#FFFFFF'
        ctx.lineWidth = 1.5
        ctx.arc(px, py, 9, 0, Math.PI * 2)
        ctx.stroke()
      }
      ctx.beginPath()
      ctx.fillStyle = CLASS_COLORS[p.label % CLASS_COLORS.length]
      ctx.shadowColor = CLASS_COLORS[p.label % CLASS_COLORS.length]
      ctx.shadowBlur = 6
      ctx.arc(px, py, 5.5, 0, Math.PI * 2)
      ctx.fill()
      ctx.shadowBlur = 0
      ctx.strokeStyle = 'rgba(11,13,16,0.6)'
      ctx.lineWidth = 1
      ctx.stroke()
    })

    // Centroids
    if (centroids) {
      centroids.forEach((c, i) => {
        const [px, py] = toPixel(c.x, c.y)
        ctx.beginPath()
        ctx.fillStyle = centroidColors?.[i] ?? CLASS_COLORS[i % CLASS_COLORS.length]
        ctx.strokeStyle = '#FFFFFF'
        ctx.lineWidth = 2
        const s = 8
        ctx.moveTo(px - s, py)
        ctx.lineTo(px, py - s)
        ctx.lineTo(px + s, py)
        ctx.lineTo(px, py + s)
        ctx.closePath()
        ctx.fill()
        ctx.stroke()
      })
    }

    // Highlight / query point
    if (highlightPoint) {
      const [px, py] = toPixel(highlightPoint.x, highlightPoint.y)
      ctx.beginPath()
      ctx.strokeStyle = '#FFFFFF'
      ctx.lineWidth = 2
      ctx.arc(px, py, 8, 0, Math.PI * 2)
      ctx.stroke()
      ctx.beginPath()
      ctx.fillStyle = '#FFFFFF'
      ctx.arc(px, py, 3, 0, Math.PI * 2)
      ctx.fill()
    }
  }, [points, size, domain, predict, showBoundary, resolution, highlightPoint, neighborKeys, centroids, centroidColors, toPixel, toData, regressionLine, regressionPoints])

  function handleClick(e: React.MouseEvent<HTMLCanvasElement>) {
    if (!onCanvasClick) return
    const rect = e.currentTarget.getBoundingClientRect()
    const px = e.clientX - rect.left
    const py = e.clientY - rect.top
    const [x, y] = toData(px, py)
    onCanvasClick(x, y)
  }

  const draggingCentroid = useRef<number | null>(null)

  function findClosest(list: { x: number; y: number }[], px: number, py: number, threshold: number) {
    let best = -1
    let bestDist = Infinity
    list.forEach((p, i) => {
      const [ppx, ppy] = toPixel(p.x, p.y)
      const d = (ppx - px) ** 2 + (ppy - py) ** 2
      if (d < bestDist) {
        bestDist = d
        best = i
      }
    })
    return bestDist < threshold ? best : -1
  }

  function handlePointerDown(e: React.PointerEvent<HTMLCanvasElement>) {
    if (!onPointDrag && !onCentroidDrag) return
    const rect = e.currentTarget.getBoundingClientRect()
    const px = e.clientX - rect.left
    const py = e.clientY - rect.top
    if (onCentroidDrag && centroids) {
      const cIdx = findClosest(centroids, px, py, 300)
      if (cIdx >= 0) {
        draggingCentroid.current = cIdx
        e.currentTarget.setPointerCapture(e.pointerId)
        return
      }
    }
    if (onPointDrag) {
      const idx = findClosest(points, px, py, 400)
      if (idx >= 0) {
        draggingIndex.current = idx
        e.currentTarget.setPointerCapture(e.pointerId)
      }
    }
  }

  function handlePointerMove(e: React.PointerEvent<HTMLCanvasElement>) {
    if (draggingIndex.current === null && draggingCentroid.current === null) return
    const rect = e.currentTarget.getBoundingClientRect()
    const px = e.clientX - rect.left
    const py = e.clientY - rect.top
    const [x, y] = toData(px, py)
    if (draggingCentroid.current !== null && onCentroidDrag) {
      onCentroidDrag(draggingCentroid.current, x, y)
    } else if (draggingIndex.current !== null && onPointDrag) {
      onPointDrag(draggingIndex.current, x, y)
    }
  }

  function handlePointerUp() {
    draggingIndex.current = null
    draggingCentroid.current = null
  }

  return (
    <div ref={containerRef} className="w-full">
      <canvas
        ref={canvasRef}
        role="img"
        aria-label={ariaLabel}
        className={`w-full rounded-xl border border-graphite-600/60 bg-graphite-950/60 ${onCanvasClick ? 'cursor-crosshair' : ''} ${onPointDrag || onCentroidDrag ? 'cursor-grab active:cursor-grabbing' : ''}`}
        style={{ height }}
        onClick={handleClick}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerUp}
      />
    </div>
  )
}
