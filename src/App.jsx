import { useEffect, useRef, useState } from 'react'
import './App.css'

const HOLD_DURATION_MS = 8000
const HOLD_PROGRESS_DELAY_MS = 1500

function App() {
  // Quản lý xem đang ở layer nào: 'opening' | 'letter' | 'timeline'
  const [currentLayer, setCurrentLayer] = useState('opening')

  const [mood] = useState('quiet')
  const [letterStep, setLetterStep] = useState(1) // 1: hold, 2: distance, 3: open
  const [readyForTimeline, setReadyForTimeline] = useState(false)

  const handleStart = () => {
    setCurrentLayer('letter')
  }

  useEffect(() => {
    if (readyForTimeline) {
      console.log('Letter finished, ready for next layer')
    }
  }, [readyForTimeline])

  return (
    <div className="app">
      {/* LAYER 1 – OPENING */}
      <section className={`layer-opening ${currentLayer === 'opening' ? 'layer-active' : 'layer-hidden'}`}>
        {/* Film grain overlay */}
        <div className="film-grain" aria-hidden="true" />

        {/* Left: Typography */}
        <div className="layer-left">
          <div className="text-block">
            <h1 className="title-valentine">
              VALENTINE
            </h1>

            <p className="subtitle-line">
              A quiet Valentine.
            </p>

            <div className="detail-year">
              2026
            </div>
          </div>
        </div>

        {/* Right: Portrait / silhouette placeholder */}
        <div className="layer-right">
          <div className="portrait-shell">
            <div className="portrait-light" />
          </div>
        </div>

        {/* Start button (was scroll hint) */}
        <div
          className="scroll-hint cursor-pointer"
          onClick={handleStart}
          style={{ cursor: 'pointer' }}
        >
          <span className="scroll-text">Bắt đầu</span>
          <span className="scroll-arrow">→</span>
        </div>
      </section>

      {/* LAYER 2 – BỨC THƯ CHƯA MỞ ĐƯỢC */}
      <div className={`layer-container ${currentLayer === 'letter' ? 'layer-active' : 'layer-hidden'}`}>
        <LetterLayer
          mood={mood}
          letterStep={letterStep}
          setLetterStep={setLetterStep}
          readyForTimeline={readyForTimeline}
          setReadyForTimeline={setReadyForTimeline}
        />
      </div>
    </div>
  )
}

function LetterLayer({ mood, letterStep, setLetterStep, readyForTimeline, setReadyForTimeline }) {
  return (
    <section className={`layer-letter layer-letter--${mood}`}>
      {letterStep === 1 && (
        <LetterHoldStep onComplete={() => setLetterStep(2)} />
      )}

      {letterStep === 2 && (
            <MistStep
              onComplete={() => {
                setLetterStep(3)
              }}
            />
      )}

      {letterStep === 3 && (
        <LetterOpenStep
          onReady={() => {
            if (!readyForTimeline) {
              setReadyForTimeline(true)
            }
          }}
        />
      )}
      </section>
    )
  }

// STEP 2.1 – BẤM VÀ ĐỢI (ĐƠN GIẢN HÓA TỪ GIỮ CHUỘT)
function LetterHoldStep({ onComplete }) {
  const [message, setMessage] = useState('')
  const [completed, setCompleted] = useState(false)

  const handleClick = () => {
    if (completed) return
    // Vẫn giữ cảm giác “chờ”, nhưng không bắt người dùng giữ chuột
    setMessage('Có những điều…\ncần thời gian.')
    setCompleted(true)

    setTimeout(() => {
      onComplete?.()
    }, 1800)
  }

  const envelopeMoodClass = 'envelope--quiet'

  return (
    <div className="letter-step letter-step--hold">
      <div className="letter-center">
        <div
          className={`envelope ${envelopeMoodClass} ${completed ? 'envelope--completed' : ''}`}
          onClick={handleClick}
        >
          <div className="envelope-flap" />
          <div className="envelope-body" />
        </div>

        <p className="hold-caption">
          Đừng mở vội.
        </p>

        {message && (
          <p className="hold-message">
            {message.split('\n').map((line) => (
              <span key={line}>
                {line}
                <br />
              </span>
            ))}
          </p>
        )}
      </div>
    </div>
  )
}

// === STEP 2 MỚI: MIST EFFECT (SƯƠNG MỜ) ===
function MistStep({ onComplete }) {
  const canvasRef = useRef(null)
  const [opacity, setOpacity] = useState(1)
  const [clearedPercent, setClearedPercent] = useState(0)
  const [finished, setFinished] = useState(false)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d', { willReadFrequently: true })
    let animationFrameId

    const handleResize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
      ctx.fillStyle = '#0a0a0d'
      ctx.fillRect(0, 0, canvas.width, canvas.height)
    }

    handleResize()
    window.addEventListener('resize', handleResize)

    const brushRadius = 60

    const draw = (x, y) => {
      if (finished) return
      ctx.save()
      ctx.globalCompositeOperation = 'destination-out'
      ctx.beginPath()
      const radgrad = ctx.createRadialGradient(x, y, brushRadius * 0.2, x, y, brushRadius)
      radgrad.addColorStop(0, 'rgba(0,0,0,1)')
      radgrad.addColorStop(1, 'rgba(0,0,0,0)')
      ctx.fillStyle = radgrad
      ctx.arc(x, y, brushRadius, 0, Math.PI * 2)
      ctx.fill()
      ctx.restore()
    }

    const handleMove = (e) => {
      if (!canvas) return
      e.preventDefault()
      const rect = canvas.getBoundingClientRect()
      let clientX, clientY
      if (e.touches && e.touches.length > 0) {
        clientX = e.touches[0].clientX
        clientY = e.touches[0].clientY
      } else {
        clientX = e.clientX
        clientY = e.clientY
      }
      const x = clientX - rect.left
      const y = clientY - rect.top
      draw(x, y)
    }

    canvas.addEventListener('mousemove', handleMove)
    canvas.addEventListener('touchmove', handleMove, { passive: false })

    let frameCount = 0
    const checkInterval = 30

    const loop = () => {
      if (finished) return
      ctx.globalCompositeOperation = 'source-over'
      ctx.fillStyle = 'rgba(10, 10, 13, 0.015)'
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      frameCount++
      if (frameCount % checkInterval === 0) {
        const w = canvas.width
        const h = canvas.height
        const checkW = Math.floor(w * 0.6)
        const checkH = Math.floor(h * 0.6)
        const startX = Math.floor(w * 0.2)
        const startY = Math.floor(h * 0.2)
        try {
          const imageData = ctx.getImageData(startX, startY, checkW, checkH)
          const data = imageData.data
          let transparentPixels = 0
          for (let i = 0; i < data.length; i += 4 * 10) {
            if (data[i + 3] < 150) {
              transparentPixels++
            }
          }
          const totalChecked = data.length / (4 * 10)
          const percent = transparentPixels / totalChecked
          setClearedPercent(percent)
          if (percent > 0.55) {
            setFinished(true)
            setOpacity(0)
            setTimeout(() => {
              onComplete?.()
            }, 1000)
            return
          }
        } catch (err) {
          // getImageData can throw if canvas is tainted; ignore gracefully
          // console.warn(err)
        }
      }

      animationFrameId = requestAnimationFrame(loop)
    }

    loop()

    return () => {
      window.removeEventListener('resize', handleResize)
      canvas.removeEventListener('mousemove', handleMove)
      canvas.removeEventListener('touchmove', handleMove)
      cancelAnimationFrame(animationFrameId)
    }
  }, [finished, onComplete])

  return (
    <div className="letter-step letter-step--mist">
      <div className="mist-underlay">
        <div className="mist-envelope-hint" />
        <p className="mist-hint-text" style={{ opacity: Math.max(0, 1 - clearedPercent * 2) }}>
          Có gì đó đang ẩn giấu...<br/>
          <span style={{ fontSize: '0.8em', opacity: 0.7 }}>(Lau nhẹ màn hình để hơi ấm lan tỏa)</span>
        </p>
      </div>

      <canvas
        ref={canvasRef}
        className="mist-canvas"
        style={{ opacity: opacity, transition: 'opacity 1s ease' }}
      />
    </div>
  )
}

// STEP 2.3 – CLICK DÒNG CHỮ (QUYỀN ĐƯỢC MỞ)
function LetterOpenStep({ onReady }) {
  const [canOpen, setCanOpen] = useState(false)
  const [opening, setOpening] = useState(false)
  const [opened, setOpened] = useState(false)

  useEffect(() => {
    // Cho chút thời gian trước khi hiện dòng chữ "Giờ thì mở được rồi."
    const t = setTimeout(() => {
      setCanOpen(true)
    }, 700)
    return () => clearTimeout(t)
  }, [])

  const handleOpen = () => {
    // Cho phép click bất cứ lúc nào ở step 3,
    // chỉ chặn khi đang mở dở hoặc đã mở xong
    if (opening || opened) return
    setOpening(true)

    // Bắt đầu hiệu ứng hé thư ngay lập tức bằng CSS
    setOpened(true)

    // Sau khi hiệu ứng hé xong một nhịp, mới báo ready cho layer sau
    setTimeout(() => {
      setOpening(false)
      onReady?.()
    }, 900)
  }

  return (
    <div className="letter-step letter-step--open">
      <div className="letter-center">
        <div
          className={`envelope envelope--final ${opened ? 'envelope--opened' : ''}`}
          onClick={handleOpen}
        >
          <div className="envelope-flap" />
          <div className="envelope-body" />
        </div>

        <button
          type="button"
          className={`open-hint ${canOpen ? 'open-hint--visible' : ''}`}
          onClick={handleOpen}
        >
          Giờ thì mở được rồi.
        </button>

        {opened && (
          <div className="letter-content">
            <p>
              Bức thư này<br />
              không cần được đọc vội.
            </p>
            <p>
              Chỉ cần cậu ở đây,<br />
              thế là đủ.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

export default App
