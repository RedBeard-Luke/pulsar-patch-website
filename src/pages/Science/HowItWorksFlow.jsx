import { useEffect, useRef, useState } from 'react'
import igVitB from '../../assets/icons/vitamin-b-pink.svg'
import igVitB3 from '../../assets/icons/vitamin-b3-pink.svg'
import igVitB9 from '../../assets/icons/vitamin-b9-pink.svg'
import igGlutathione from '../../assets/icons/glutathione-pink.svg'
import igNac from '../../assets/icons/nac-pink.svg'
import igGinger from '../../assets/icons/ginger-pink.svg'

/*
 * HOW IT WORKS — "your night, hour by hour"
 *
 * A scrubbable timeline drives a live canvas simulation: the patch sits on a
 * side-view of your skin and releases ingredient particles that diffuse
 * through the skin barrier into a flowing bloodstream, where they intercept
 * incoming toxin particles. Each timeline stage changes what the patch is
 * releasing and how hard the night is hitting.
 *
 * The old exploding-patch version of this section lives in git history if it
 * is ever wanted back.
 */

// Brand palette as raw RGB for canvas rgba() strings
const RGB = {
  pink: '222, 100, 165', // #DE64A5
  blue: '68, 200, 232', // #44C8E8
  blueDark: '53, 179, 209', // #35b3d1
  gold: '255, 167, 0', // #FFA700
  dark: '30, 30, 30', // #1E1E1E
}

const stages = [
  {
    time: '6:00 PM',
    label: 'PRE-GAME',
    title: 'Apply and Prepare',
    desc: 'Apply the Pulsar Patch 30 minutes before your first drink. Your skin warms the adhesive matrix and opens the transdermal delivery paths, bypassing your digestive system entirely.',
    ingredients: [],
    statusNote: 'Priming the delivery pathways',
    sim: { emit: 0.8, colors: ['blue'], toxins: 0, flow: 28 },
  },
  {
    time: '10:00 PM',
    label: 'IN THE MIX',
    title: 'Defense Enters the Bloodstream',
    desc: "Glutathione (your body's master antioxidant) and NAC diffuse directly into your blood. They arm your liver in advance, intercepting oxidative stress and early acetaldehyde build-up.",
    ingredients: [
      { name: 'Glutathione', dose: '9.5mg', icon: igGlutathione, color: 'pink' },
      { name: 'NAC', dose: '4.75mg', icon: igNac, color: 'blueDark' },
    ],
    sim: { emit: 3.0, colors: ['pink', 'blueDark'], toxins: 2.4, flow: 60 },
  },
  {
    time: '2:00 AM',
    label: 'BEDTIME',
    title: 'Overnight Defense',
    desc: 'While you sleep, alcohol burns through your nutrient stores. The patch works in background mode, releasing B-vitamins at a steady rate to keep your cells supplied all night.',
    ingredients: [
      { name: 'Vitamin B', dose: '717.5mcg', icon: igVitB, color: 'blue' },
      { name: 'Vitamin B3', dose: '1,956.5mcg', icon: igVitB3, color: 'blueDark' },
      { name: 'Vitamin B9', dose: '239mcg', icon: igVitB9, color: 'gold' },
    ],
    sim: { emit: 2.6, colors: ['blue', 'blueDark', 'gold'], toxins: 1.4, flow: 45 },
  },
  {
    time: '8:00 AM',
    label: 'WAKING UP',
    title: 'Refresh and Re-energize',
    desc: 'Wake up feeling like yourself instead of a train wreck. B-vitamins keep supporting your nervous system while ginger extract quietly settles your stomach.',
    ingredients: [
      { name: 'Ginger Extract', dose: '1,435mcg', icon: igGinger, color: 'gold' },
      { name: 'Vitamin B', dose: '717.5mcg', icon: igVitB, color: 'blue' },
    ],
    sim: { emit: 2.0, colors: ['gold', 'blue'], toxins: 0.6, flow: 38 },
  },
  {
    time: '12:00 PM',
    label: 'THE NEXT DAY',
    title: 'Peel and Enjoy',
    desc: 'Peel off the patch. You skipped the stomach trouble, the morning-after headache, and the brain fog. Your day is fully yours, completely uninterrupted.',
    ingredients: [],
    statusNote: 'All clear. Your day is yours.',
    sim: { emit: 0, colors: [], toxins: 0, flow: 30 },
  },
]

/* ── The bloodstream simulation canvas ── */
function BloodstreamCanvas({ stage }) {
  const canvasRef = useRef(null)
  const stageRef = useRef(stage)

  useEffect(() => {
    stageRef.current = stage
  }, [stage])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    const parent = canvas.parentElement

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const hasFinePointer = window.matchMedia('(pointer: fine)').matches

    let width = 0
    let height = 0
    let dpr = 1
    let rafId = null
    let running = false
    let lastT = 0

    const ingredients = [] // particles released by the patch
    const toxins = [] // acetaldehyde coming in from the night
    const cells = [] // passive background cells that give the stream life
    const pops = [] // expanding rings when a toxin gets neutralized
    let neutralized = 0
    let emitAcc = 0
    let toxinAcc = 0
    let sparkleAcc = 0
    let wavePhase = 0
    const mouse = { x: -9999, y: -9999, active: false }

    // Vertical layout of the scene, as fractions of canvas height
    const L = {
      skinTop: 0.2,
      skinBot: 0.36,
      streamTop: 0.44,
      streamBot: 0.92,
    }
    const streamY = (frac) => {
      const top = height * L.streamTop
      const bot = height * L.streamBot
      return top + (bot - top) * frac
    }
    const patchRect = () => {
      const w = Math.max(120, width * 0.3)
      const h = Math.max(26, height * 0.085)
      return { x: (width - w) / 2, y: height * L.skinTop - h, w, h }
    }
    // Ingredients enter through three diffusion channels under the patch
    const channelXs = () => {
      const p = patchRect()
      return [p.x + p.w * 0.22, p.x + p.w * 0.5, p.x + p.w * 0.78]
    }

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

      cells.length = 0
      const cellCount = Math.min(Math.round(width / 34), 26)
      for (let i = 0; i < cellCount; i++) {
        cells.push({
          x: Math.random() * width,
          yFrac: 0.08 + Math.random() * 0.84,
          r: 5 + Math.random() * 6,
          speed: 0.5 + Math.random() * 0.5,
          wobble: Math.random() * Math.PI * 2,
          wobbleSpeed: 0.4 + Math.random() * 0.6,
          px: 0,
          py: 0,
        })
      }
    }

    function spawnIngredient(sim) {
      if (ingredients.length > 90) return
      const xs = channelXs()
      const colorKey = sim.colors[Math.floor(Math.random() * sim.colors.length)] || 'blue'
      ingredients.push({
        x: xs[Math.floor(Math.random() * xs.length)] + (Math.random() - 0.5) * 8,
        y: height * L.skinTop + 2,
        vy: 14 + Math.random() * 10,
        vx: 0,
        px: 0,
        py: 0,
        r: 2.6 + Math.random() * 1.8,
        color: RGB[colorKey],
        inStream: false,
        baseY: 0,
        wobble: Math.random() * Math.PI * 2,
        wobbleSpeed: 1.2 + Math.random() * 1.4,
      })
    }

    function spawnToxin(sim) {
      if (toxins.length > 45) return
      toxins.push({
        x: -12,
        baseY: streamY(0.1 + Math.random() * 0.8),
        vx: sim.flow * (0.9 + Math.random() * 0.4),
        px: 0,
        py: 0,
        r: 3.4 + Math.random() * 2.2,
        wobble: Math.random() * Math.PI * 2,
        wobbleSpeed: 1 + Math.random() * 1.2,
        y: 0,
      })
    }

    function applyMouse(p) {
      if (!mouse.active) return
      const dx = p.x - mouse.x
      const dy = p.y - mouse.y
      const dist = Math.hypot(dx, dy)
      const RADIUS = 110
      if (dist < RADIUS && dist > 0.01) {
        const force = ((RADIUS - dist) / RADIUS) ** 2 * 1.1
        p.px += (dx / dist) * force
        p.py += (dy / dist) * force
      }
    }

    function update(dt) {
      const sim = stageRef.current.sim
      wavePhase += dt * 0.8

      // Spawning, paced in particles-per-second
      emitAcc += sim.emit * dt
      while (emitAcc >= 1) {
        spawnIngredient(sim)
        emitAcc -= 1
      }
      toxinAcc += sim.toxins * dt
      while (toxinAcc >= 1) {
        spawnToxin(sim)
        toxinAcc -= 1
      }
      // Calm shimmer once the night is over and nothing is left to fight
      if (sim.emit === 0 && sim.toxins === 0 && toxins.length === 0) {
        sparkleAcc += dt * 0.9
        while (sparkleAcc >= 1) {
          pops.push({ x: width * (0.1 + Math.random() * 0.8), y: streamY(0.1 + Math.random() * 0.8), r: 1, alpha: 0.5, color: RGB.blue })
          sparkleAcc -= 1
        }
      }

      for (const c of cells) {
        applyMouse(c)
        c.wobble += c.wobbleSpeed * dt
        c.x += sim.flow * c.speed * dt + c.px
        c.y = streamY(c.yFrac) + Math.sin(c.wobble) * 5 + c.py
        c.px *= 0.9
        c.py *= 0.9
        if (c.x > width + 15) c.x = -15
      }

      for (let i = ingredients.length - 1; i >= 0; i--) {
        const p = ingredients[i]
        applyMouse(p)
        if (!p.inStream) {
          // Diffusing down through the skin barrier
          p.y += p.vy * dt
          p.x += (Math.random() - 0.5) * 0.4
          if (p.y > height * L.streamTop + 8) {
            p.inStream = true
            p.baseY = Math.min(p.y + Math.random() * 30, streamY(0.85))
          }
        } else {
          p.vx = Math.min(p.vx + 40 * dt, sim.flow * (0.8 + 0.4 * Math.sin(p.wobble * 0.7)))
          p.wobble += p.wobbleSpeed * dt
          p.x += p.vx * dt + p.px
          p.y = p.baseY + Math.sin(p.wobble) * 9 + p.py
        }
        p.px *= 0.9
        p.py *= 0.9
        if (p.x > width + 15) ingredients.splice(i, 1)
      }

      for (let i = toxins.length - 1; i >= 0; i--) {
        const t = toxins[i]
        applyMouse(t)
        t.wobble += t.wobbleSpeed * dt
        t.x += t.vx * dt + t.px
        t.y = t.baseY + Math.sin(t.wobble) * 7 + t.py
        t.px *= 0.9
        t.py *= 0.9
        if (t.x > width + 15) {
          toxins.splice(i, 1)
          continue
        }
        // Interception: a nearby ingredient neutralizes the toxin
        for (let j = ingredients.length - 1; j >= 0; j--) {
          const p = ingredients[j]
          if (!p.inStream) continue
          const dx = t.x - p.x
          const dy = t.y - p.y
          if (Math.abs(dx) > 16 || Math.abs(dy) > 16) continue
          if (Math.hypot(dx, dy) < t.r + p.r + 6) {
            pops.push({ x: (t.x + p.x) / 2, y: (t.y + p.y) / 2, r: 2, alpha: 0.9, color: p.color })
            ingredients.splice(j, 1)
            toxins.splice(i, 1)
            neutralized++
            break
          }
        }
      }

      for (let i = pops.length - 1; i >= 0; i--) {
        const pop = pops[i]
        pop.r += 46 * dt
        pop.alpha -= 2 * dt
        if (pop.alpha <= 0) pops.splice(i, 1)
      }
    }

    function drawZoneLabel(text, y) {
      ctx.font = '700 9px "Futura PT", Futura, Inter, sans-serif'
      if ('letterSpacing' in ctx) ctx.letterSpacing = '2px'
      ctx.fillStyle = 'rgba(30, 30, 30, 0.3)'
      ctx.textAlign = 'left'
      ctx.textBaseline = 'middle'
      ctx.fillText(text.toUpperCase(), 14, y)
      if ('letterSpacing' in ctx) ctx.letterSpacing = '0px'
    }

    function drawStreamEdge(yBase, flip) {
      ctx.beginPath()
      for (let x = 0; x <= width; x += 8) {
        const y = yBase + Math.sin(x * 0.02 + wavePhase * (flip ? -1 : 1)) * 4
        x === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y)
      }
    }

    function draw() {
      ctx.clearRect(0, 0, width, height)
      const skinTop = height * L.skinTop
      const skinBot = height * L.skinBot
      const streamTop = height * L.streamTop
      const streamBot = height * L.streamBot

      // Skin barrier band
      ctx.fillStyle = 'rgba(212, 241, 249, 0.55)'
      ctx.fillRect(0, skinTop, width, skinBot - skinTop)
      ctx.strokeStyle = 'rgba(30, 30, 30, 0.07)'
      ctx.lineWidth = 1
      ctx.beginPath()
      ctx.moveTo(0, skinTop)
      ctx.lineTo(width, skinTop)
      ctx.moveTo(0, skinBot)
      ctx.lineTo(width, skinBot)
      ctx.stroke()

      // Diffusion channels through the skin, under the patch
      ctx.strokeStyle = 'rgba(68, 200, 232, 0.45)'
      ctx.setLineDash([2, 5])
      for (const cx of channelXs()) {
        ctx.beginPath()
        ctx.moveTo(cx, skinTop + 3)
        ctx.lineTo(cx, streamTop + 2)
        ctx.stroke()
      }
      ctx.setLineDash([])

      // Bloodstream with gently waving edges
      drawStreamEdge(streamTop, false)
      // close the shape down and around to fill the stream body
      ctx.lineTo(width, streamBot)
      for (let x = width; x >= 0; x -= 8) {
        ctx.lineTo(x, streamBot + Math.sin(x * 0.02 - wavePhase) * 4)
      }
      ctx.closePath()
      ctx.fillStyle = 'rgba(68, 200, 232, 0.09)'
      ctx.fill()
      ctx.strokeStyle = 'rgba(68, 200, 232, 0.35)'
      drawStreamEdge(streamTop, false)
      ctx.stroke()
      drawStreamEdge(streamBot, true)
      ctx.stroke()

      // Passive cells
      for (const c of cells) {
        ctx.fillStyle = 'rgba(68, 200, 232, 0.14)'
        ctx.beginPath()
        ctx.arc(c.x, c.y, c.r, 0, Math.PI * 2)
        ctx.fill()
      }

      // The patch itself
      const p = patchRect()
      ctx.save()
      ctx.shadowColor = 'rgba(68, 200, 232, 0.45)'
      ctx.shadowBlur = 14
      ctx.fillStyle = '#44C8E8'
      ctx.beginPath()
      ctx.roundRect(p.x, p.y, p.w, p.h, [10, 10, 3, 3])
      ctx.fill()
      ctx.restore()
      ctx.font = `700 ${Math.max(12, p.h * 0.42)}px "Futura PT", Futura, Inter, sans-serif`
      ctx.fillStyle = 'white'
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      ctx.fillText('pulsar.', p.x + p.w / 2, p.y + p.h * 0.46)
      // Reservoir dots: the ingredients waiting inside the matrix
      const resColors = [RGB.pink, RGB.gold, RGB.blueDark, RGB.pink, RGB.gold]
      resColors.forEach((c, i) => {
        ctx.fillStyle = `rgba(${c}, 0.9)`
        ctx.beginPath()
        ctx.arc(p.x + p.w * (0.18 + i * 0.16), p.y + p.h - 5, 2.2, 0, Math.PI * 2)
        ctx.fill()
      })

      // Zone labels
      drawZoneLabel('Patch', p.y + p.h / 2)
      drawZoneLabel('Skin', (skinTop + skinBot) / 2)
      drawZoneLabel('Bloodstream', (streamTop + streamBot) / 2)

      // Toxins (acetaldehyde)
      for (const t of toxins) {
        ctx.fillStyle = 'rgba(30, 30, 30, 0.45)'
        ctx.beginPath()
        ctx.arc(t.x, t.y, t.r, 0, Math.PI * 2)
        ctx.fill()
      }

      // Ingredient particles
      for (const ing of ingredients) {
        ctx.fillStyle = `rgba(${ing.color}, 0.92)`
        ctx.beginPath()
        ctx.arc(ing.x, ing.y, ing.r, 0, Math.PI * 2)
        ctx.fill()
      }

      // Neutralization pops
      for (const pop of pops) {
        ctx.strokeStyle = `rgba(${pop.color}, ${Math.max(pop.alpha, 0)})`
        ctx.lineWidth = 2
        ctx.beginPath()
        ctx.arc(pop.x, pop.y, pop.r, 0, Math.PI * 2)
        ctx.stroke()
      }

      // Running scoreboard
      ctx.textAlign = 'right'
      ctx.textBaseline = 'alphabetic'
      ctx.font = '700 8px "Futura PT", Futura, Inter, sans-serif'
      if ('letterSpacing' in ctx) ctx.letterSpacing = '1.5px'
      ctx.fillStyle = 'rgba(30, 30, 30, 0.4)'
      ctx.fillText('TOXINS NEUTRALIZED', width - 16, 22)
      if ('letterSpacing' in ctx) ctx.letterSpacing = '0px'
      ctx.font = '800 20px "Futura PT", Futura, Inter, sans-serif'
      ctx.fillStyle = 'rgba(222, 100, 165, 0.95)'
      ctx.fillText(String(neutralized), width - 16, 44)
    }

    function loop(t) {
      const dt = Math.min((t - lastT) / 1000 || 0.016, 0.05)
      lastT = t
      update(dt)
      draw()
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

    function onMouseMove(e) {
      const rect = canvas.getBoundingClientRect()
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
      // Static frame: pre-fill the scene so it still tells the story
      for (let i = 0; i < 14; i++) {
        spawnIngredient(stageRef.current.sim.colors.length ? stageRef.current.sim : { ...stageRef.current.sim, colors: ['blue'] })
        const ing = ingredients[ingredients.length - 1]
        if (ing) {
          ing.inStream = true
          ing.x = Math.random() * width
          ing.baseY = streamY(0.1 + Math.random() * 0.8)
          ing.y = ing.baseY
        }
      }
      draw()
    }

    const resizeObserver = new ResizeObserver(resize)
    resizeObserver.observe(parent)

    const io = new IntersectionObserver(
      ([entry]) => (entry.isIntersecting ? start() : stop()),
      { threshold: 0 }
    )
    io.observe(parent)

    if (hasFinePointer) {
      canvas.addEventListener('mousemove', onMouseMove)
      canvas.addEventListener('mouseleave', onMouseLeave)
    }

    return () => {
      stop()
      resizeObserver.disconnect()
      io.disconnect()
      if (hasFinePointer) {
        canvas.removeEventListener('mousemove', onMouseMove)
        canvas.removeEventListener('mouseleave', onMouseLeave)
      }
    }
  }, [])

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" aria-hidden="true" />
}

/* ── The full section ── */
export default function HowItWorksFlow() {
  const [activeIndex, setActiveIndex] = useState(1)
  const [playing, setPlaying] = useState(false)
  const stage = stages[activeIndex]
  const atEnd = activeIndex === stages.length - 1
  // Playback naturally ends at the last stage; no explicit stop needed
  const isPlaying = playing && !atEnd

  useEffect(() => {
    if (!isPlaying) return
    const id = setTimeout(() => {
      setActiveIndex((i) => Math.min(i + 1, stages.length - 1))
    }, 3500)
    return () => clearTimeout(id)
  }, [isPlaying, activeIndex])

  const jumpTo = (idx) => {
    setPlaying(false)
    setActiveIndex(idx)
  }

  const togglePlay = () => {
    if (isPlaying) {
      setPlaying(false)
    } else {
      if (atEnd) setActiveIndex(0)
      setPlaying(true)
    }
  }

  return (
    <section className="relative w-full bg-[#E8F7FB] overflow-hidden pt-12 pb-24 lg:pb-32" id="how-it-works">
      {/* Wave transition from above (white section) */}
      <div className="absolute top-0 left-0 w-full leading-none z-10 pointer-events-none transform -translate-y-px">
        <svg className="block w-full h-[40px] sm:h-[70px] lg:h-[120px]" viewBox="0 0 1440 120" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M0 80 Q 120 0, 240 80 T 480 80 T 720 80 T 960 80 T 1200 80 T 1440 80 L 1440 120 L 0 120 Z" fill="#E8F7FB" />
        </svg>
      </div>

      <div className="max-w-[1920px] mx-auto px-5 sm:px-8 lg:px-16 xl:px-[140px] pt-[60px] lg:pt-[100px] relative z-20">
        {/* Header */}
        <div className="text-center mb-10 lg:mb-12">
          <span className="font-futura font-bold text-[13px] uppercase tracking-[3px] text-pulsar-pink">How it Works</span>
          <h2 className="font-futura font-[900] text-[clamp(2rem,6vw,3rem)] leading-[1.1] text-pulsar-blue uppercase tracking-wide mt-3 mb-5">
            Your night, hour by hour
          </h2>
          <p className="font-inter text-[15px] lg:text-[16px] leading-[1.6] text-pulsar-dark/70 max-w-[620px] mx-auto">
            Scrub through the night, or press play and watch the patch release its defense into your bloodstream while the drinks try to keep up.
          </p>
          <button
            onClick={togglePlay}
            className="mt-6 inline-flex items-center gap-2.5 bg-pulsar-pink text-white font-futura font-bold text-[13px] uppercase tracking-[1px] px-7 py-3 rounded-full transition-all duration-300 hover:bg-pulsar-pink-dark hover:-translate-y-0.5"
          >
            {isPlaying ? (
              <>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><rect x="5" y="4" width="5" height="16" rx="1.5" /><rect x="14" y="4" width="5" height="16" rx="1.5" /></svg>
                Pause
              </>
            ) : (
              <>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M7 4.8c0-1.2 1.3-1.9 2.3-1.3l11 7.2c.9.6.9 1.9 0 2.5l-11 7.2c-1 .7-2.3-.1-2.3-1.3V4.8z" /></svg>
                {atEnd ? 'Replay the night' : 'Play the night'}
              </>
            )}
          </button>
        </div>

        {/* Timeline scrubber */}
        <div className="relative w-full max-w-[860px] mx-auto h-[76px] flex items-start justify-between select-none mb-10 lg:mb-14">
          {/* Track */}
          <div className="absolute left-[14px] right-[14px] top-[11px] h-[6px] bg-white rounded-full shadow-inner z-0" />
          {/* Progress: sunset blue into late-night pink */}
          <div
            className="absolute left-[14px] top-[11px] h-[6px] rounded-full bg-gradient-to-r from-pulsar-blue to-pulsar-pink z-0 transition-all duration-500 ease-out"
            style={{ width: `calc(${(activeIndex / (stages.length - 1)) * 100}% - ${(activeIndex / (stages.length - 1)) * 28 - 14}px)` }}
          />

          {stages.map((s, idx) => {
            const isActive = idx === activeIndex
            const isPassed = idx < activeIndex
            return (
              <button
                key={idx}
                onClick={() => jumpTo(idx)}
                className="relative z-30 flex flex-col items-center group focus:outline-none w-[28px]"
                aria-label={`Jump to ${s.time}`}
              >
                <div
                  className={`w-[28px] h-[28px] rounded-full border-[3px] flex items-center justify-center transition-all duration-300 ${
                    isActive
                      ? 'bg-pulsar-pink border-pulsar-pink scale-110 shadow-[0_0_14px_rgba(222,100,165,0.55)]'
                      : isPassed
                        ? 'bg-pulsar-blue border-pulsar-blue'
                        : 'bg-white border-pulsar-blue/25 group-hover:border-pulsar-blue'
                  }`}
                >
                  {isActive && <div className="w-[8px] h-[8px] rounded-full bg-white" />}
                  {isPassed && (
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6L9 17l-5-5" /></svg>
                  )}
                </div>
                <span className={`font-futura font-bold text-[11px] sm:text-[12px] mt-2.5 uppercase tracking-wide whitespace-nowrap transition-colors ${isActive ? 'text-pulsar-pink' : 'text-pulsar-blue/50 group-hover:text-pulsar-blue'}`}>
                  {s.time}
                </span>
                <span className="font-inter text-[9px] font-semibold text-pulsar-blue/35 hidden sm:block whitespace-nowrap">
                  {s.label}
                </span>
              </button>
            )
          })}

          {/* Invisible native range slider on top for smooth dragging + keyboard access */}
          <input
            type="range"
            min="0"
            max={stages.length - 1}
            step="1"
            value={activeIndex}
            onChange={(e) => jumpTo(parseInt(e.target.value))}
            className="absolute left-0 right-0 top-0 h-[50px] w-full opacity-0 cursor-pointer timeline-slider z-20"
            aria-label="Timeline progress slider"
          />
        </div>

        {/* Stage card + simulation */}
        <div className="flex flex-col-reverse lg:flex-row items-stretch gap-8 lg:gap-[60px]">
          {/* Left: stage details */}
          <div className="w-full lg:flex-[0_0_40%] flex flex-col">
            <div className="flex-1 p-8 rounded-[24px] border-2 border-pulsar-blue bg-white shadow-md text-pulsar-dark">
              <div className="flex items-center gap-3 mb-4">
                <span className="px-3 py-1 font-futura font-bold text-[11px] uppercase tracking-wider rounded-full bg-pulsar-pink text-white shadow-sm">
                  {stage.label}
                </span>
                <span className="font-futura font-bold text-[14px] text-pulsar-blue/70 tracking-wider">
                  {stage.time}
                </span>
              </div>
              <h3 className="font-futura font-[900] text-[24px] uppercase tracking-wide mb-3 text-pulsar-blue">
                {stage.title}
              </h3>
              <p className="font-inter text-[14px] sm:text-[15px] leading-[1.7] text-pulsar-dark/80 mb-6">
                {stage.desc}
              </p>

              <span className="block font-futura font-bold text-[10px] uppercase tracking-[2px] text-pulsar-dark/40 mb-3">
                Releasing right now
              </span>
              {stage.ingredients.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {stage.ingredients.map((ing) => (
                    <span key={ing.name} className="inline-flex items-center gap-2 bg-pulsar-light-blue-bg border border-pulsar-blue/20 rounded-full pl-2.5 pr-3.5 py-1.5">
                      <span className="w-[9px] h-[9px] rounded-full shrink-0" style={{ backgroundColor: `rgb(${RGB[ing.color]})` }} />
                      <img src={ing.icon} alt="" className="w-[16px] h-[16px] object-contain" />
                      <span className="font-futura font-bold text-[11px] uppercase tracking-wide text-pulsar-dark/80">{ing.name}</span>
                    </span>
                  ))}
                </div>
              ) : (
                <p className="font-inter text-[13px] italic text-pulsar-dark/50">{stage.statusNote}</p>
              )}
            </div>
          </div>

          {/* Right: live bloodstream simulation */}
          <div className="w-full lg:flex-1 flex flex-col">
            <div className="relative w-full flex-1 min-h-[340px] sm:min-h-[400px] lg:min-h-[440px] rounded-[24px] bg-white border-2 border-pulsar-blue/20 shadow-md overflow-hidden">
              <BloodstreamCanvas stage={stage} />
            </div>
            <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-1 mt-3 px-1">
              <div className="flex items-center gap-5">
                <span className="inline-flex items-center gap-2 font-inter text-[11px] text-pulsar-dark/55">
                  <span className="flex gap-1">
                    <span className="w-[8px] h-[8px] rounded-full bg-pulsar-pink" />
                    <span className="w-[8px] h-[8px] rounded-full bg-pulsar-blue" />
                    <span className="w-[8px] h-[8px] rounded-full bg-[#FFA700]" />
                  </span>
                  Patch ingredients
                </span>
                <span className="inline-flex items-center gap-2 font-inter text-[11px] text-pulsar-dark/55">
                  <span className="w-[8px] h-[8px] rounded-full bg-pulsar-dark/50" />
                  Acetaldehyde, the bad stuff
                </span>
              </div>
              <span className="font-inter text-[10px] italic text-pulsar-dark/35">
                Illustrative simulation. Not to scale, obviously.
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Wave transition to the next section (white section) */}
      <div className="absolute -bottom-px left-0 w-full leading-none z-10 pointer-events-none">
        <svg className="block w-full h-[40px] sm:h-[70px] lg:h-[120px]" viewBox="0 0 1440 120" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M0 80 Q 120 0, 240 80 T 480 80 T 720 80 T 960 80 T 1200 80 T 1440 80 L 1440 120 L 0 120 Z" fill="white" />
        </svg>
      </div>
    </section>
  )
}
