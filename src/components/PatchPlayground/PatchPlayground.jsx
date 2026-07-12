import { useEffect, useRef } from 'react'
import patchFront from '../../assets/patch-front.svg'
import patchBack from '../../assets/patch-back.svg'

/*
 * PatchPlayground — the patches as a zero-gravity physics toy.
 *
 * Five product patches float in the container. They drift gently on their
 * own, ease away from the cursor, and can be grabbed and thrown: they carry
 * momentum, bounce off the container walls, and knock into each other
 * (they're treated as circles, so the collisions are honest). Double-click
 * or double-tap a patch to flip it over and see the back.
 *
 * Rendering is plain DOM (the real product SVGs) driven by one rAF loop
 * that writes transforms directly, so React never re-renders per frame.
 *
 * Pass `obstacleRef` (a ref to an element inside the same section) to make
 * that element solid: patches bounce off its rectangle and can never overlap
 * it. Used to keep them off the section copy.
 *
 * Drop it inside any sized container:  <PatchPlayground />
 */

// hx/hy: home offsets from the cluster center for the load arrangement —
// the big patch sits in the middle with the other five in an even ring
// around it (72 degrees apart, nudged off-axis so it reads casual).
const PATCHES = [
  { frac: 0.20, face: 'front', hx: 0, hy: 0 },
  { frac: 0.165, face: 'back', hx: -0.25, hy: -0.76 },
  { frac: 0.145, face: 'front', hx: 0.65, hy: -0.47 },
  { frac: 0.12, face: 'front', hx: 0.65, hy: 0.47 },
  { frac: 0.10, face: 'back', hx: -0.25, hy: 0.76 },
  { frac: 0.11, face: 'front', hx: -0.8, hy: 0 },
]

const WALL_BOUNCE = 0.8 // energy kept when hitting a wall
const COLLISION_BOUNCE = 0.85 // energy kept in patch-vs-patch hits
const DRIFT = 0.005 // strength of the idle wander force (kept subtle)
const MOUSE_RADIUS = 120 // cursor influence, px

export default function PatchPlayground({ className = '', obstacleRef }) {
  const containerRef = useRef(null)
  const patchEls = useRef([])

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    let width = 0
    let height = 0
    let rafId = null
    let running = false
    let lastT = 0
    let obstacle = null // solid rect (container coords) patches bounce off
    let stirred = false // patches hold their pose until the cursor reaches them
    const mouse = { x: -9999, y: -9999, active: false }

    // One physics body per patch
    const bodies = PATCHES.map((cfg, i) => ({
      cfg,
      el: patchEls.current[i],
      baseZ: 5 + i, // below the section text (z-20); grabbed patches jump to 50
      x: 0,
      y: 0,
      // Perfectly still on load; motion starts with the first interaction
      vx: 0,
      vy: 0,
      r: 50,
      angle: (Math.random() - 0.5) * 20,
      va: 0,
      tiltX: 0,
      tiltY: 0,
      flipTarget: cfg.face === 'back' ? 180 : 0,
      flipCur: cfg.face === 'back' ? 180 : 0,
      wander: Math.random() * Math.PI * 2,
      wanderSpeed: 0.2 + Math.random() * 0.3,
      grabbed: false,
      targetX: 0,
      targetY: 0,
      lastTap: 0,
    }))

    function measureObstacle(containerRect) {
      const el = obstacleRef?.current
      if (!el) {
        obstacle = null
        return
      }
      const or = el.getBoundingClientRect()
      if (or.width === 0 || or.height === 0) {
        obstacle = null
        return
      }
      const PAD = 10 // breathing room so rotated corners don't graze the copy
      obstacle = {
        left: or.left - containerRect.left - PAD,
        top: or.top - containerRect.top - PAD,
        right: or.right - containerRect.left + PAD,
        bottom: or.bottom - containerRect.top + PAD,
      }
    }

    // Circle-vs-rect: push the patch out of the obstacle and reflect the
    // velocity component pointing into it.
    function collideObstacle(b) {
      if (!obstacle) return
      const cx = Math.max(obstacle.left, Math.min(b.x, obstacle.right))
      const cy = Math.max(obstacle.top, Math.min(b.y, obstacle.bottom))
      const dx = b.x - cx
      const dy = b.y - cy
      const dist = Math.hypot(dx, dy)
      if (dist >= b.r) return
      if (dist < 0.01) {
        // Center ended up inside the rect (fast drag): exit via nearest face
        const dl = b.x - obstacle.left
        const dr = obstacle.right - b.x
        const dt = b.y - obstacle.top
        const db = obstacle.bottom - b.y
        const min = Math.min(dl, dr, dt, db)
        if (min === dl) { b.x = obstacle.left - b.r; b.vx = -Math.abs(b.vx) * WALL_BOUNCE }
        else if (min === dr) { b.x = obstacle.right + b.r; b.vx = Math.abs(b.vx) * WALL_BOUNCE }
        else if (min === dt) { b.y = obstacle.top - b.r; b.vy = -Math.abs(b.vy) * WALL_BOUNCE }
        else { b.y = obstacle.bottom + b.r; b.vy = Math.abs(b.vy) * WALL_BOUNCE }
        return
      }
      const nx = dx / dist
      const ny = dy / dist
      const push = b.r - dist
      b.x += nx * push
      b.y += ny * push
      const vn = b.vx * nx + b.vy * ny
      if (vn < 0) {
        b.vx -= (1 + WALL_BOUNCE) * vn * nx
        b.vy -= (1 + WALL_BOUNCE) * vn * ny
      }
    }

    function layout(first) {
      const rect = container.getBoundingClientRect()
      measureObstacle(rect)
      const oldW = width || rect.width
      const oldH = height || rect.height
      width = rect.width
      height = rect.height
      // The layer spans the full section now, so don't let patch size track
      // the whole viewport width; keep them scaled like the old right column.
      const base = Math.min(Math.max(width * 0.45, 340), height * 0.8)

      // Two-column layouts start at lg (1024px): spawn in the free right
      // column there, centered when the layout is stacked. R sizes the ring
      // so the outer patches sit just off the center one; the relax pass
      // below resolves any remaining overlap.
      const isTwoCol = width >= 1024
      const cx = width * (isTwoCol ? 0.71 : 0.5)
      const cy = height * (isTwoCol ? 0.48 : 0.62)
      const ringR = Math.min(width * 0.15, height * 0.42)

      bodies.forEach((b) => {
        b.r = Math.max(34, (b.cfg.frac * base * 1.9) / 2)
        if (first) {
          b.x = cx + b.cfg.hx * ringR
          b.y = cy + b.cfg.hy * ringR
        } else {
          b.x = (b.x / oldW) * width
          b.y = (b.y / oldH) * height
        }
      })
      // Relax any initial overlaps so nothing spawns intersecting
      for (let pass = 0; pass < 8; pass++) {
        for (let i = 0; i < bodies.length; i++) {
          for (let j = i + 1; j < bodies.length; j++) {
            const a = bodies[i]
            const c = bodies[j]
            const dx = c.x - a.x
            const dy = c.y - a.y
            const dist = Math.hypot(dx, dy) || 1
            const overlap = a.r + c.r + 6 - dist
            if (overlap > 0) {
              const nx = dx / dist
              const ny = dy / dist
              a.x -= (nx * overlap) / 2
              a.y -= (ny * overlap) / 2
              c.x += (nx * overlap) / 2
              c.y += (ny * overlap) / 2
            }
          }
        }
        bodies.forEach((b) => {
          b.x = Math.min(Math.max(b.x, b.r), width - b.r)
          b.y = Math.min(Math.max(b.y, b.r), height - b.r)
          collideObstacle(b)
        })
      }
      render()
    }

    function step(f) {
      for (const b of bodies) {
        if (b.grabbed) {
          // Kinematic while held: chase the pointer, remember the velocity
          const prevX = b.x
          const prevY = b.y
          b.x += (b.targetX - b.x) * Math.min(0.4 * f, 1)
          b.y += (b.targetY - b.y) * Math.min(0.4 * f, 1)
          b.vx = (b.x - prevX) / f
          b.vy = (b.y - prevY) / f
        } else {
          // Faint idle drift, but only after the visitor has stirred the pile;
          // before that the patches hold their loaded arrangement.
          if (stirred) {
            b.wander += b.wanderSpeed * 0.016 * f
            b.vx += Math.cos(b.wander) * DRIFT * f
            b.vy += Math.sin(b.wander * 0.9) * DRIFT * f
          }

          if (mouse.active) {
            const dx = b.x - mouse.x
            const dy = b.y - mouse.y
            const dist = Math.hypot(dx, dy)
            const reach = MOUSE_RADIUS + b.r
            if (dist < reach && dist > 0.01) {
              stirred = true
              const force = ((reach - dist) / reach) ** 2 * 0.35 * f
              b.vx += (dx / dist) * force
              b.vy += (dy / dist) * force
            }
          }

          b.vx *= 0.985 ** f
          b.vy *= 0.985 ** f
          b.x += b.vx * f
          b.y += b.vy * f
        }

        b.va *= 0.98 ** f
        b.angle += b.va * f

        // Walls
        if (b.x < b.r) { b.x = b.r; b.vx = Math.abs(b.vx) * WALL_BOUNCE }
        if (b.x > width - b.r) { b.x = width - b.r; b.vx = -Math.abs(b.vx) * WALL_BOUNCE }
        if (b.y < b.r) { b.y = b.r; b.vy = Math.abs(b.vy) * WALL_BOUNCE }
        if (b.y > height - b.r) { b.y = height - b.r; b.vy = -Math.abs(b.vy) * WALL_BOUNCE }

        // The section copy is solid: bounce off it, never cross it
        collideObstacle(b)

        // Lean into the direction of travel, spring flat when settled
        const tx = Math.max(-16, Math.min(16, -b.vy * 3))
        const ty = Math.max(-16, Math.min(16, b.vx * 3))
        b.tiltX += (tx - b.tiltX) * Math.min(0.1 * f, 1)
        b.tiltY += (ty - b.tiltY) * Math.min(0.1 * f, 1)

        b.flipCur += (b.flipTarget - b.flipCur) * Math.min(0.12 * f, 1)
      }

      // Patch-vs-patch collisions (mass scales with area)
      for (let i = 0; i < bodies.length; i++) {
        for (let j = i + 1; j < bodies.length; j++) {
          const a = bodies[i]
          const c = bodies[j]
          const dx = c.x - a.x
          const dy = c.y - a.y
          const dist = Math.hypot(dx, dy) || 1
          const overlap = a.r + c.r - dist
          if (overlap <= 0) continue
          const nx = dx / dist
          const ny = dy / dist
          const invA = a.grabbed ? 0 : 1 / (a.r * a.r)
          const invC = c.grabbed ? 0 : 1 / (c.r * c.r)
          const invSum = invA + invC || 1
          // Push apart
          a.x -= nx * overlap * (invA / invSum)
          a.y -= ny * overlap * (invA / invSum)
          c.x += nx * overlap * (invC / invSum)
          c.y += ny * overlap * (invC / invSum)
          // Impulse along the normal (skip if already separating)
          const rvx = c.vx - a.vx
          const rvy = c.vy - a.vy
          const relNorm = rvx * nx + rvy * ny
          if (relNorm < 0) {
            const impulse = (-(1 + COLLISION_BOUNCE) * relNorm) / invSum
            a.vx -= impulse * invA * nx
            a.vy -= impulse * invA * ny
            c.vx += impulse * invC * nx
            c.vy += impulse * invC * ny
            // A hit puts a little spin on both
            const relTang = rvx * -ny + rvy * nx
            a.va -= relTang * 0.02
            c.va += relTang * 0.02
          }
        }
      }
    }

    function render() {
      for (const b of bodies) {
        if (!b.el) continue
        const d = b.r * 2
        b.el.style.width = `${d}px`
        b.el.style.height = `${d}px`
        b.el.style.transform = `translate3d(${b.x - b.r}px, ${b.y - b.r}px, 0)`
        b.el.style.zIndex = b.grabbed ? 50 : b.baseZ
        const inner = b.el.firstChild
        if (inner) {
          inner.style.transform = `rotateZ(${b.angle}deg) rotateX(${b.tiltX}deg) rotateY(${b.flipCur + b.tiltY}deg) scale(${b.grabbed ? 1.06 : 1})`
        }
      }
    }

    function loop(t) {
      const dt = Math.min((t - lastT) / 1000 || 0.016, 0.033)
      lastT = t
      const f = dt * 60 // normalize physics tuning to 60fps units
      step(f)
      render()
      rafId = requestAnimationFrame(loop)
    }

    function start() {
      if (running || reduceMotion) return
      running = true
      lastT = performance.now()
      rafId = requestAnimationFrame(loop)
    }

    function stop() {
      running = false
      if (rafId) cancelAnimationFrame(rafId)
      rafId = null
    }

    function containerPoint(e) {
      const rect = container.getBoundingClientRect()
      return { x: e.clientX - rect.left, y: e.clientY - rect.top }
    }

    // The layer is pointer-events-none (so the text stays clickable), which
    // means ambient cursor push has to listen on the window and check bounds.
    function onWindowPointerMove(e) {
      const p = containerPoint(e)
      if (p.x >= 0 && p.x <= width && p.y >= 0 && p.y <= height) {
        mouse.x = p.x
        mouse.y = p.y
        mouse.active = true
      } else {
        mouse.active = false
      }
    }

    const grabCleanups = []
    bodies.forEach((b) => {
      const el = b.el
      if (!el) return

      const onDown = (e) => {
        if (reduceMotion) return
        e.preventDefault()
        stirred = true
        // Double-click / double-tap flips the patch over
        const now = performance.now()
        if (now - b.lastTap < 320) b.flipTarget += 180
        b.lastTap = now

        const p = containerPoint(e)
        b.grabbed = true
        b.grabDX = b.x - p.x
        b.grabDY = b.y - p.y
        b.targetX = b.x
        b.targetY = b.y
        el.style.cursor = 'grabbing'
        try { el.setPointerCapture(e.pointerId) } catch { /* synthetic or already-lost pointer */ }
      }
      const onMove = (e) => {
        if (!b.grabbed) return
        const p = containerPoint(e)
        b.targetX = p.x + b.grabDX
        b.targetY = p.y + b.grabDY
        // Dragging fast puts spin on the patch
        b.va = Math.max(-4, Math.min(4, b.vx * 0.12))
      }
      const onUp = (e) => {
        if (!b.grabbed) return
        b.grabbed = false
        el.style.cursor = 'grab'
        try { if (el.hasPointerCapture(e.pointerId)) el.releasePointerCapture(e.pointerId) } catch { /* ignore */ }
      }

      el.addEventListener('pointerdown', onDown)
      el.addEventListener('pointermove', onMove)
      el.addEventListener('pointerup', onUp)
      el.addEventListener('pointercancel', onUp)
      grabCleanups.push(() => {
        el.removeEventListener('pointerdown', onDown)
        el.removeEventListener('pointermove', onMove)
        el.removeEventListener('pointerup', onUp)
        el.removeEventListener('pointercancel', onUp)
      })
    })

    layout(true)

    const resizeObserver = new ResizeObserver(() => layout(false))
    resizeObserver.observe(container)
    if (obstacleRef?.current) resizeObserver.observe(obstacleRef.current)

    const io = new IntersectionObserver(
      ([entry]) => (entry.isIntersecting ? start() : stop()),
      { threshold: 0 }
    )
    io.observe(container)

    window.addEventListener('pointermove', onWindowPointerMove)

    return () => {
      stop()
      resizeObserver.disconnect()
      io.disconnect()
      window.removeEventListener('pointermove', onWindowPointerMove)
      grabCleanups.forEach((fn) => fn())
    }
  }, [obstacleRef])

  return (
    <div ref={containerRef} className={`relative w-full h-full overflow-hidden pointer-events-none ${className}`}>
      {PATCHES.map((cfg, i) => (
        <div
          key={i}
          ref={(el) => { patchEls.current[i] = el }}
          className="absolute top-0 left-0 pointer-events-auto cursor-grab select-none touch-none will-change-transform"
          style={{ perspective: '700px' }}
          aria-hidden="true"
        >
          <div className="relative w-full h-full" style={{ transformStyle: 'preserve-3d' }}>
            <img
              src={patchFront}
              alt=""
              className="absolute inset-0 w-full h-full"
              style={{ backfaceVisibility: 'hidden' }}
              draggable={false}
            />
            <img
              src={patchBack}
              alt=""
              className="absolute inset-0 w-full h-full"
              style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
              draggable={false}
            />
          </div>
        </div>
      ))}
    </div>
  )
}
