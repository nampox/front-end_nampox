import { useEffect, useRef, useState } from 'react'
import './App.css'

const HOLD_DURATION_MS = 8000
const HOLD_PROGRESS_DELAY_MS = 1500

function App() {
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

        {/* Start button */}
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
        <DistanceStep
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

// STEP 2.2 – KÉO KHOẢNG CÁCH (TỰ ĐỘNG CHẠY)
function DistanceStep({ onComplete }) {
  const [progress, setProgress] = useState(0) // 0 → 1
  const [completed, setCompleted] = useState(false)

  // Tự động kéo hai chấm lại gần nhau theo thời gian
  useEffect(() => {
    if (completed) return

    const duration = 5000 // 5s để đi từ 0 -> 1
    const start = Date.now()

    const tick = () => {
      const elapsed = Date.now() - start
      const t = Math.min(elapsed / duration, 1)
      const eased = 1 - Math.pow(1 - t, 3) // ease-out nhẹ
      setProgress(eased)

      if (t < 1) {
        requestAnimationFrame(tick)
      } else if (!completed) {
        setCompleted(true)
        // Cho ánh sáng lan + nhạc nâng nhẹ rồi mới sang bước 3
        setTimeout(() => {
          onComplete?.()
        }, 1600)
      }
    }

    const id = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(id)
  }, [completed, onComplete])

  return (
    <div className="letter-step letter-step--distance">
      <div className="letter-center">
        <p className="distance-text">
          Khoảng cách không phải lúc nào cũng xa.
        </p>

        <div className="distance-track">
          {/* Vệt sáng rất mảnh */}
          <div
            className="distance-trail"
            style={{
              transform: `scaleX(${Math.max(progress, 0.02)})`,
            }}
          />

          {/* Hai chấm sáng */}
          <div className="distance-dot distance-dot--left" />
          <div
            className={`distance-dot distance-dot--right ${completed ? 'distance-dot--merged' : ''}`}
            style={{
              transform: `translateX(${-50 * (1 - progress)}%)`,
            }}
          />

          {completed && <div className="distance-glow" />}
        </div>

        {completed && (
          <p className="distance-message">
            Chỉ là…<br />
            chưa đủ gần.
          </p>
        )}
      </div>
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
