import { useEffect, useRef } from 'react'

interface Pt {
  x: number
  y: number
  vx: number
  vy: number
  label: number
}

// A living scatterplot: points drift, a boundary line sweeps and bends between
// classes, faint concentric rings pulse from cluster centers. Pure decoration
// on the hero, but built from the same visual language as the real plots.
export default function HeroCanvas() {
  const ref = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    let w = 0
    let h = 0
    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    const points: Pt[] = []
    const N = 46

    function resize() {
      const rect = canvas!.getBoundingClientRect()
      w = rect.width
      h = rect.height
      canvas!.width = w * dpr
      canvas!.height = h * dpr
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0)
    }
    resize()
    window.addEventListener('resize', resize)

    for (let i = 0; i < N; i++) {
      points.push({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.12,
        vy: (Math.random() - 0.5) * 0.12,
        label: i % 2,
      })
    }

    let raf = 0
    let t = 0

    function frame() {
      if (!ctx) return
      ctx.clearRect(0, 0, w, h)

      // sweeping boundary curve
      t += reduceMotion ? 0 : 0.006
      ctx.beginPath()
      for (let x = 0; x <= w; x += 8) {
        const y = h / 2 + Math.sin(x * 0.012 + t * 2) * 40 + Math.sin(t) * 30
        if (x === 0) ctx.moveTo(x, y)
        else ctx.lineTo(x, y)
      }
      ctx.strokeStyle = 'rgba(94,234,212,0.35)'
      ctx.lineWidth = 1.5
      ctx.stroke()

      for (const p of points) {
        if (!reduceMotion) {
          p.x += p.vx
          p.y += p.vy
          if (p.x < 0 || p.x > w) p.vx *= -1
          if (p.y < 0 || p.y > h) p.vy *= -1
        }
        const boundaryY = h / 2 + Math.sin(p.x * 0.012 + t * 2) * 40 + Math.sin(t) * 30
        const side = p.y > boundaryY ? 1 : 0
        const color = side === 0 ? '#5B8DEF' : '#FF6B7A'
        ctx.beginPath()
        ctx.fillStyle = color
        ctx.shadowColor = color
        ctx.shadowBlur = 8
        ctx.arc(p.x, p.y, 3.2, 0, Math.PI * 2)
        ctx.fill()
        ctx.shadowBlur = 0
      }

      raf = requestAnimationFrame(frame)
    }
    frame()

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', resize)
    }
  }, [])

  return <canvas ref={ref} className="h-full w-full" aria-hidden="true" />
}
