import { useEffect, useRef } from 'react'

/*
 * ParticleField — an interactive "nutrients in solution" canvas.
 *
 * Brand-colored particles drift slowly and link into molecule-style bonds
 * when they pass near each other. The mouse gently pushes particles away
 * and draws brighter bonds to whatever is nearby, so the field feels alive
 * without fighting the copy sitting on top of it.
 *
 * Zero dependencies. Drop it inside any `relative overflow-hidden` section:
 *   <ParticleField />
 *
 * To remove it later, delete this folder and the two lines that reference
 * it in the page using it.
 */

// Palette tuned for the pulsar-blue hero. `weight` = relative spawn chance.
const PARTICLE_COLORS = [
  { rgb: '255, 255, 255', weight: 5 }, // white
  { rgb: '222, 100, 165', weight: 3 }, // pulsar pink #DE64A5
  { rgb: '212, 241, 249', weight: 2 }, // light blue #D4F1F9
]

const DENSITY = 1 / 16000 // particles per px² of canvas
const MAX_PARTICLES = 130
const LINK_DIST = 110 // px — how close two particles must be to bond
const MOUSE_RADIUS = 160 // px — how far the cursor's influence reaches

function pickColor(rand) {
  const total = PARTICLE_COLORS.reduce((sum, c) => sum + c.weight, 0)
  let roll = rand() * total
  for (const c of PARTICLE_COLORS) {
    roll -= c.weight
    if (roll <= 0) return c.rgb
  }
  return PARTICLE_COLORS[0].rgb
}

function makeParticle(w, h) {
  const rand = Math.random
  return {
    x: rand() * w,
    y: rand() * h,
    // Base drift is slow; the mouse adds temporary velocity on top.
    vx: (rand() - 0.5) * 0.35,
    vy: (rand() - 0.5) * 0.35,
    // Extra velocity from mouse pushes, decays each frame
    px: 0,
    py: 0,
    r: 1.2 + rand() * 2.2,
    color: pickColor(rand),
    baseAlpha: 0.35 + rand() * 0.45,
    // Each particle "breathes" on its own phase so the field shimmers
    pulse: rand() * Math.PI * 2,
    pulseSpeed: 0.008 + rand() * 0.012,
  }
}

export default function ParticleField({ className = '' }) {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    const parent = canvas.parentElement

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    // Coarse pointers (touch) don't hover, so skip mouse physics there
    const hasFinePointer = window.matchMedia('(pointer: fine)').matches

    let particles = []
    let width = 0
    let height = 0
    let dpr = 1
    let rafId = null
    let running = false
    const mouse = { x: -9999, y: -9999, active: false }

    function resize() {
      const rect = parent.getBoundingClientRect()
      width = rect.width
      height = rect.height
      dpr = Math.min(window.devicePixelRatio || 1, 2)
      canvas.width = width * dpr
      canvas.height = height * dpr
      canvas.style.width = `${width}px`
      canvas.style.height = `${height}px`
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)

      const target = Math.min(Math.round(width * height * DENSITY), MAX_PARTICLES)
      while (particles.length < target) particles.push(makeParticle(width, height))
      particles.length = target
    }

    function step() {
      ctx.clearRect(0, 0, width, height)

      // Move
      for (const p of particles) {
        p.pulse += p.pulseSpeed

        if (mouse.active) {
          const dx = p.x - mouse.x
          const dy = p.y - mouse.y
          const dist = Math.hypot(dx, dy)
          if (dist < MOUSE_RADIUS && dist > 0.01) {
            // Ease-out push: strongest at the cursor, fading to zero at the edge
            const force = ((MOUSE_RADIUS - dist) / MOUSE_RADIUS) ** 2 * 1.4
            p.px += (dx / dist) * force
            p.py += (dy / dist) * force
          }
        }

        p.x += p.vx + p.px
        p.y += p.vy + p.py
        p.px *= 0.92
        p.py *= 0.92

        // Wrap around edges with a small margin so particles fade in/out naturally
        if (p.x < -20) p.x = width + 20
        if (p.x > width + 20) p.x = -20
        if (p.y < -20) p.y = height + 20
        if (p.y > height + 20) p.y = -20
      }

      // Bonds between nearby particles
      ctx.lineWidth = 1
      for (let i = 0; i < particles.length; i++) {
        const a = particles[i]
        for (let j = i + 1; j < particles.length; j++) {
          const b = particles[j]
          const dx = a.x - b.x
          const dy = a.y - b.y
          if (Math.abs(dx) > LINK_DIST || Math.abs(dy) > LINK_DIST) continue
          const dist = Math.hypot(dx, dy)
          if (dist > LINK_DIST) continue
          const alpha = (1 - dist / LINK_DIST) * 0.18
          ctx.strokeStyle = `rgba(255, 255, 255, ${alpha})`
          ctx.beginPath()
          ctx.moveTo(a.x, a.y)
          ctx.lineTo(b.x, b.y)
          ctx.stroke()
        }
      }

      // Brighter bonds from the cursor to whatever it's near
      if (mouse.active) {
        for (const p of particles) {
          const dx = p.x - mouse.x
          const dy = p.y - mouse.y
          const dist = Math.hypot(dx, dy)
          if (dist < MOUSE_RADIUS) {
            const alpha = (1 - dist / MOUSE_RADIUS) * 0.4
            ctx.strokeStyle = `rgba(${p.color}, ${alpha})`
            ctx.beginPath()
            ctx.moveTo(p.x, p.y)
            ctx.lineTo(mouse.x, mouse.y)
            ctx.stroke()
          }
        }
      }

      // Particles on top of bonds
      for (const p of particles) {
        const alpha = p.baseAlpha * (0.75 + 0.25 * Math.sin(p.pulse))
        ctx.fillStyle = `rgba(${p.color}, ${alpha})`
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
        ctx.fill()
      }
    }

    function loop() {
      step()
      rafId = requestAnimationFrame(loop)
    }

    function start() {
      if (running || reduceMotion) return
      running = true
      rafId = requestAnimationFrame(loop)
    }

    function stop() {
      running = false
      if (rafId) cancelAnimationFrame(rafId)
      rafId = null
    }

    function onMouseMove(e) {
      const rect = parent.getBoundingClientRect()
      mouse.x = e.clientX - rect.left
      mouse.y = e.clientY - rect.top
      mouse.active = true
    }

    function onMouseLeave() {
      mouse.active = false
      mouse.x = -9999
      mouse.y = -9999
    }

    resize()

    if (reduceMotion) {
      // Honor the OS setting: draw one static frame, no animation
      step()
    }

    const resizeObserver = new ResizeObserver(resize)
    resizeObserver.observe(parent)

    // Only animate while the section is actually on screen
    const io = new IntersectionObserver(
      ([entry]) => (entry.isIntersecting ? start() : stop()),
      { threshold: 0 }
    )
    io.observe(parent)

    if (hasFinePointer) {
      parent.addEventListener('mousemove', onMouseMove)
      parent.addEventListener('mouseleave', onMouseLeave)
    }

    return () => {
      stop()
      resizeObserver.disconnect()
      io.disconnect()
      if (hasFinePointer) {
        parent.removeEventListener('mousemove', onMouseMove)
        parent.removeEventListener('mouseleave', onMouseLeave)
      }
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className={`absolute inset-0 w-full h-full pointer-events-none ${className}`}
      aria-hidden="true"
    />
  )
}
