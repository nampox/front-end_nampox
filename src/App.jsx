import { useEffect, useRef, useState } from 'react'
import './App.css'

// Bộ sưu tập kỷ niệm (thay url bằng ảnh thật của bạn)
const MEMORIES = [
  { id: 1, url: '/img1.jpg', caption: 'Ngày đầu tiên...' },
  { id: 2, url: '/img2.jpg', caption: 'Ẻm hông chịu' },
  { id: 3, url: '/img3.jpg', caption: 'Em đáng iu, em dỗi' },
  { id: 4, url: '/img4.jpg', caption: 'Và em là của anh.' },
]

function App() {
  const [currentLayer, setCurrentLayer] = useState('opening')
  // Flow: 1 hold -> 2 mist -> 2.5 gallery -> 3 timeline -> 4 open
  const [letterStep, setLetterStep] = useState(1)
  const [isWarm, setIsWarm] = useState(false)
  const [isMusicPausedByUser, setIsMusicPausedByUser] = useState(false)

  // Đánh dấu người quay lại
  const [isReturning, setIsReturning] = useState(false)
  const [showReturningIntro, setShowReturningIntro] = useState(false)

  // Audio Ref
  const audioRef = useRef(null)
  const bgFadeIntervalRef = useRef(null)

  useEffect(() => {
    audioRef.current = new Audio('/music.mp3')
    audioRef.current.loop = true
    // Giảm volume nền mặc định cho nhẹ hơn
    audioRef.current.volume = 0.3 
    
    return () => {
      if (audioRef.current) {
        audioRef.current.pause()
        audioRef.current.currentTime = 0
      }
    }
  }, [])

  // Check lần vào thứ mấy (chỉ đánh dấu sau khi đã xem tới layer 4)
  useEffect(() => {
    try {
      const visited = localStorage.getItem('valentine_visited')
      if (visited) {
        setIsReturning(true)
        setShowReturningIntro(true)
      }
    } catch (e) {
      console.warn('localStorage unavailable', e)
    }
  }, [])

  // Khi user đã tới bước mở thư (layer 4) thì mới đánh dấu đã xem
  useEffect(() => {
    if (letterStep === 4) {
      try {
        localStorage.setItem('valentine_visited', 'true')
      } catch (e) {
        console.warn('localStorage set failed', e)
      }
    }
  }, [letterStep])

  const handleStart = () => {
    if (audioRef.current) {
      audioRef.current.play().catch(e => console.log("Audio play failed:", e))
    }
    setCurrentLayer('letter')
  }

  const handleVoicePlayingChange = (isPlaying) => {
    if (!audioRef.current) return

    // Dừng fade cũ nếu đang chạy
    if (bgFadeIntervalRef.current) {
      clearInterval(bgFadeIntervalRef.current)
      bgFadeIntervalRef.current = null
    }

    const duration = 7000 // 7s
    const stepMs = 100
    const steps = duration / stepMs

    const startVolume = audioRef.current.volume
    // Khi voice play: giảm còn 50% volume hiện tại, khi dừng: về mức nền 0.3
    const targetVolume = isPlaying ? startVolume * 0.5 : 0.3

    let currentStep = 0
    bgFadeIntervalRef.current = setInterval(() => {
      currentStep += 1
      const progress = Math.min(currentStep / steps, 1)
      const newVolume = startVolume + (targetVolume - startVolume) * progress
      audioRef.current.volume = Math.max(0, Math.min(1, newVolume))

      if (progress >= 1) {
        clearInterval(bgFadeIntervalRef.current)
        bgFadeIntervalRef.current = null
      }
    }, stepMs)
  }

  const handleToggleMusic = () => {
    if (!audioRef.current) return

    if (audioRef.current.paused) {
      audioRef.current.play().catch(e => console.log('Resume bg music failed', e))
      setIsMusicPausedByUser(false)
    } else {
      audioRef.current.pause()
      setIsMusicPausedByUser(true)
    }
  }

  return (
    <div className={`app ${isWarm ? 'app--warm' : ''}`}>

      {/* Lần 2 trở đi: màn chào nhỏ trước khi vào flow */}
      {isReturning && showReturningIntro && (
        <div className="returning-intro-overlay">
          <div className="returning-intro-box">
            <p className="returning-intro-text">
              em lại nhớ anh rồi phải không,<br />
              xem lại lời chúc Valentine của anh nhaaaaaa 😊
            </p>
            <button
              type="button"
              className="returning-intro-button"
              onClick={() => setShowReturningIntro(false)}
            >
              Tiếp tục →
            </button>
          </div>
        </div>
      )}
      {/* LAYER 1 – OPENING */}
      <section className={`layer-opening ${currentLayer === 'opening' ? 'layer-active' : 'layer-hidden'}`}>
        <div className="film-grain" aria-hidden="true" />
        <div className="layer-left">
          <div className="text-block">
            <h1 className="title-valentine">VALENTINE</h1>
            <p className="subtitle-line">Một chút yên bình cho em.</p>
            <div className="detail-year">2026</div>
          </div>
        </div>
        <div className="layer-right">
          <div className="portrait-shell">
            <div className="portrait-light" />
          </div>
        </div>
        
        <div className="scroll-hint cursor-pointer" onClick={handleStart}>
          <span className="scroll-text">Bắt đầu</span>
          <span className="scroll-arrow">→</span>
        </div>
      </section>

      {/* LAYER 2, 3, 4 – JOURNEY */}
      <div className={`layer-container ${currentLayer === 'letter' ? 'layer-active' : 'layer-hidden'}`}>
        <LetterLayer
          letterStep={letterStep}
          setLetterStep={setLetterStep}
          isWarm={isWarm}
          setIsWarm={setIsWarm}
          onVoicePlayingChange={handleVoicePlayingChange}
          onToggleMusic={handleToggleMusic}
          isMusicPaused={isMusicPausedByUser}
        />
      </div>
    </div>
  )
}

function LetterLayer({ letterStep, setLetterStep, isWarm, setIsWarm, onVoicePlayingChange, onToggleMusic, isMusicPaused }) {
  return (
    <section className={`layer-letter ${isWarm ? 'layer-letter--warm' : 'layer-letter--quiet'}`}>
      
      {/* Film grain luôn hiện diện ở các bước tối */}
      {!isWarm && <div className="film-grain" style={{opacity: 0.05}} />}

      <div className={`bloom-overlay ${isWarm ? 'bloom-visible' : ''}`} />

      {letterStep === 1 && (
        <LetterHoldStep onComplete={() => setLetterStep(2)} />
      )}

      {letterStep === 2 && (
        <MistStep onComplete={() => setLetterStep(2.5)} />
      )}

      {/* LAYER 2.5: MEMORY GALLERY */}
      {letterStep === 2.5 && (
        <GalleryStep onComplete={() => setLetterStep(3)} />
      )}

      {/* LAYER 3: TIMELINE */}
      {letterStep === 3 && (
        <TimelineStep onComplete={() => setLetterStep(4)} />
      )}

      {/* LAYER 4: CLIMAX (Mở thư) */}
      {letterStep === 4 && (
        <LetterOpenStep
          isWarm={isWarm}
          onOpen={() => setIsWarm(true)}
          onVoicePlayingChange={onVoicePlayingChange}
          onToggleMusic={onToggleMusic}
          isMusicPaused={isMusicPaused}
        />
      )}
    </section>
  )
}

// === STEP 2.1: HOLD ===
function LetterHoldStep({ onComplete }) {
  const [status, setStatus] = useState('idle') 
  const [progress, setProgress] = useState(0)
  const startTimeRef = useRef(0)
  const progressFrameRef = useRef(null)
  
  const SILENT_PHASE = 500 
  const TOTAL_DURATION = 3000 // Nhanh hơn chút để vào phần chính

  const startHolding = () => {
    if (status === 'completed') return
    setStatus('holding')
    startTimeRef.current = Date.now()
    
    const updateProgress = () => {
      const elapsed = Date.now() - startTimeRef.current
      if (elapsed < SILENT_PHASE) {
        setProgress(0)
      } else {
        if (status !== 'holding-visible') setStatus('holding-visible')
        const visibleElapsed = elapsed - SILENT_PHASE
        const visibleDuration = TOTAL_DURATION - SILENT_PHASE
        const p = Math.min(visibleElapsed / visibleDuration, 1)
        setProgress(p)
      }

      if (elapsed < TOTAL_DURATION) {
        progressFrameRef.current = requestAnimationFrame(updateProgress)
      } else {
        setStatus('completed')
        setTimeout(() => onComplete?.(), 1000)
      }
    }
    progressFrameRef.current = requestAnimationFrame(updateProgress)
  }

  const stopHolding = () => {
    if (status === 'completed') return
    cancelAnimationFrame(progressFrameRef.current)
    setStatus('idle')
    setProgress(0)
  }

  return (
    <div className="letter-step letter-step--hold">
      <div className="letter-center">
        <div 
          className={`envelope envelope--quiet ${status === 'completed' ? 'envelope--completed' : ''} ${status === 'holding-visible' ? 'envelope--pulsing' : ''}`}
          onMouseDown={startHolding} onMouseUp={stopHolding} onMouseLeave={stopHolding}
          onTouchStart={startHolding} onTouchEnd={stopHolding}
        >
          <div className="envelope-flap" />
          <div className="envelope-body" />
        </div>
        <div className="hold-text-container">
          <p className={`hold-caption ${status === 'idle' ? 'fade-in' : 'fade-out'}`}>Giữ lấy phong thư này.</p>
          <p className={`hold-message warning ${status === 'holding-visible' ? 'fade-in' : 'fade-out'}`}>Đừng buông tay...</p>
          <p className={`hold-message success ${status === 'completed' ? 'fade-in' : 'fade-out'}`}>Được rồi.</p>
        </div>
        <div className="hold-progress-track" style={{ opacity: status === 'holding-visible' ? 1 : 0 }}>
          <div className="hold-progress-fill" style={{ width: `${progress * 100}%` }} />
        </div>
      </div>
    </div>
  )
}

// === STEP 2.2: MIST ===
function MistStep({ onComplete }) {
  const canvasRef = useRef(null)
  const [opacity, setOpacity] = useState(1) 
  const [finished, setFinished] = useState(false)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d', { willReadFrequently: true })
    let animationFrameId
    
    const handleResize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
      ctx.fillStyle = '#050507' 
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
      ctx.arc(x, y, brushRadius, 0, Math.PI * 2)
      ctx.fill()
      ctx.restore()
    }

    const handleMove = (e) => {
      if (e.cancelable) e.preventDefault(); 
      const rect = canvas.getBoundingClientRect()
      let clientX, clientY
      if (e.touches && e.touches.length > 0) {
        clientX = e.touches[0].clientX
        clientY = e.touches[0].clientY
      } else {
        clientX = e.clientX
        clientY = e.clientY
      }
      draw(clientX - rect.left, clientY - rect.top)
    }

    canvas.addEventListener('mousemove', handleMove)
    canvas.addEventListener('touchmove', handleMove, { passive: false })
    
    // Check loop simplified
    let frameCount = 0
    const loop = () => {
      if (finished) return
      frameCount++
      if (frameCount % 20 === 0) {
        // Simple check center
        const w = canvas.width, h = canvas.height
        const imageData = ctx.getImageData(w/2 - 50, h/2 - 50, 100, 100)
        let alphaSum = 0
        for(let i=3; i<imageData.data.length; i+=4) alphaSum += imageData.data[i]
        
        // Nếu alpha trung bình thấp -> đã lau sạch vùng giữa
        if (alphaSum < (imageData.data.length / 4) * 100) { 
          setFinished(true)
          setOpacity(0)
          setTimeout(() => onComplete?.(), 1500)
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
        {/* Placeholder cho ảnh mờ ảo nếu có, hiện tại dùng noise tối */}
        <div className="mist-text-wrapper">
             <p className="mist-hint-text">(Lau nhẹ...)</p>
        </div>
      </div>
      <canvas ref={canvasRef} className="mist-canvas" style={{ opacity: opacity, transition: 'opacity 1.5s ease' }} />
    </div>
  )
}

// === STEP 2.5: MEMORY GALLERY ===
function GalleryStep({ onComplete }) {
  const [visible, setVisible] = useState(false)
  const [canContinue, setCanContinue] = useState(false)

  useEffect(() => {
    // Fade in gallery
    const showTimer = setTimeout(() => setVisible(true), 500)
    // Sau 4s mới cho hiện nút tiếp tục
    const continueTimer = setTimeout(() => setCanContinue(true), 4000)
    return () => {
      clearTimeout(showTimer)
      clearTimeout(continueTimer)
    }
  }, [])

  return (
    <div className={`gallery-container ${visible ? 'visible' : ''}`}>
      <div className="gallery-header">
        <p className="gallery-title">Những mảnh ký ức...</p>
      </div>

      <div className="gallery-scroll-area">
        {MEMORIES.map((mem, index) => (
          <div
            key={mem.id}
            className="gallery-item"
            style={{ animationDelay: `${index * 0.3}s` }}
          >
            <div className="gallery-photo-frame">
              <img src={mem.url} alt={mem.caption} className="gallery-img" />
            </div>
            <p className="gallery-caption">{mem.caption}</p>
          </div>
        ))}
        <div style={{ minWidth: '50px' }}></div>
      </div>

      <div className={`gallery-footer ${canContinue ? 'visible' : ''}`}>
        <button className="btn-continue" onClick={onComplete}>
          Tiếp tục hành trình →
        </button>
      </div>
    </div>
  )
}

// === STEP 3: TIMELINE (REMASTERED) ===
function TimelineStep({ onComplete }) {
  const [index, setIndex] = useState(0)
  const [locked, setLocked] = useState(true) // Khóa scroll
  const [fadingOut, setFadingOut] = useState(false) 
  const [voidMode, setVoidMode] = useState(false) // Chế độ "Khoảng không"
  const [voidTextVisible, setVoidTextVisible] = useState(false) // Dòng chữ bất ngờ

  // Điều khiển thời điểm hiện subtext và mũi tên scroll
  const [showSubtext, setShowSubtext] = useState(false)
  const [showIndicator, setShowIndicator] = useState(false)
  // Điều khiển thời điểm hiện vùng hold ở mốc "tired"
  const [showHoldInteraction, setShowHoldInteraction] = useState(false)

  // State riêng cho tương tác "Hold" ở mốc Tired
  const [isHolding, setIsHolding] = useState(false)
  const [holdProgress, setHoldProgress] = useState(0)
  const holdRef = useRef(null)

  const milestones = [
    {
      id: 0,
      text: "Chúng ta bắt đầu...",
      subtext: "...bằng những câu chuyện vu vơ.",
      mood: "start",
      interaction: "scroll",
      lockTime: 2500
    },
    {
      id: 1,
      text: "Rồi những cuộc gọi dài.",
      subtext: "Đến tận sáng.",
      mood: "bonding",
      interaction: "scroll",
      lockTime: 3000
    },
    {
      id: 2,
      // Mốc này KHÔNG scroll được, phải tương tác
      text: "Cũng có những ngày\nchẳng biết\nnói gì.",
      subtext: "(Giữ lấy điểm sáng này...)", 
      mood: "tired",
      interaction: "hold", // Yêu cầu giữ chuột
      lockTime: 1000 
    },
    {
      id: 3,
      text: "Nhưng dù xa...",
      subtext: "...vẫn ở đây.",
      mood: "distance",
      interaction: "scroll",
      lockTime: 3000
    }
  ]

  // Đảm bảo luôn có currentMs hợp lệ, tránh lỗi khi index vượt quá length
  const currentMs = milestones[index] || milestones[milestones.length - 1]

  // Logic Lock thời gian đầu mỗi mốc
  useEffect(() => {
    if (voidMode || !currentMs) return
    setLocked(true)
    setShowSubtext(false)
    setShowIndicator(false)
     setShowHoldInteraction(false)

    const lockTimer = setTimeout(() => {
      setLocked(false)
    }, currentMs.lockTime)

    // Sau 2s kể từ khi vào mốc, mới hiện subtext
    const subtextTimer = setTimeout(() => {
      setShowSubtext(true)
    }, 2000)

    // Sau 3s mới cho hiện mũi tên scroll
    const indicatorTimer = setTimeout(() => {
      setShowIndicator(true)
    }, 3000)

    // Sau 3s mới hiện vùng hold tương tác cho mốc "tired"
    const holdTimer = setTimeout(() => {
      if (currentMs.interaction === 'hold') {
        setShowHoldInteraction(true)
      }
    }, 3000)

    return () => {
      clearTimeout(lockTimer)
      clearTimeout(subtextTimer)
      clearTimeout(indicatorTimer)
      clearTimeout(holdTimer)
    }
  }, [index, voidMode, currentMs?.lockTime])

  // Logic HOLD (Cho mốc Tired)
  useEffect(() => {
    let frame
    if (isHolding && currentMs.interaction === 'hold') {
      const loop = () => {
        setHoldProgress(prev => {
          if (prev >= 100) {
            // Success!
            setIsHolding(false)
            goNext()
            return 100
          }
          return prev + 1.5 // Tốc độ nạp năng lượng
        })
        frame = requestAnimationFrame(loop)
      }
      frame = requestAnimationFrame(loop)
    } else {
      // Nếu thả tay ra thì tụt dần (cho khó chịu chơi)
      if (holdProgress > 0 && holdProgress < 100) {
        const loopDown = () => {
          setHoldProgress(prev => Math.max(0, prev - 2))
          frame = requestAnimationFrame(loopDown)
        }
        frame = requestAnimationFrame(loopDown)
      }
    }
    return () => cancelAnimationFrame(frame)
  }, [isHolding, currentMs?.interaction, holdProgress])

  // Xử lý chuyển cảnh
  const goNext = () => {
    if (index < milestones.length - 1) {
      setFadingOut(true)
      setTimeout(() => {
        setIndex(prev => prev + 1)
        setHoldProgress(0) // Reset hold
        setFadingOut(false)
      }, 1000)
    } else {
      // Hết timeline -> Vào VOID MODE (Khoảng lặng)
      enterTheVoid()
    }
  }

  // Chế độ "Khoảng Lặng"
  const enterTheVoid = () => {
    setFadingOut(true) // Fade hết nội dung cũ
    setTimeout(() => {
      setVoidMode(true) // Màn hình đen
      
      // 1. Im lặng 2s
      setTimeout(() => {
        // 2. Hiện dòng chữ Micro Surprise
        setVoidTextVisible(true)
        
        // 3. Giữ dòng chữ đó 2.5s rồi biến mất
        setTimeout(() => {
           setVoidTextVisible(false)
           
           // 4. End game -> Sang layer mở thư
           setTimeout(() => {
             onComplete?.()
           }, 1500)
        }, 2500)
      }, 2000)
    }, 1000)
  }

  // Sự kiện Scroll (Chỉ active khi interaction = scroll)
  useEffect(() => {
    let touchStartY = 0
    const handleWheel = (e) => {
      if (locked || fadingOut || voidMode || currentMs.interaction === 'hold') return
      if (e.deltaY > 20) goNext()
    }
    const handleTouchStart = (e) => touchStartY = e.touches[0].clientY
    const handleTouchEnd = (e) => {
      if (locked || fadingOut || voidMode || currentMs.interaction === 'hold') return
      if (touchStartY - e.changedTouches[0].clientY > 40) goNext()
    }

    window.addEventListener('wheel', handleWheel)
    window.addEventListener('touchstart', handleTouchStart)
    window.addEventListener('touchend', handleTouchEnd)
    return () => {
      window.removeEventListener('wheel', handleWheel)
      window.removeEventListener('touchstart', handleTouchStart)
      window.removeEventListener('touchend', handleTouchEnd)
    }
  }, [index, locked, fadingOut, voidMode, currentMs])

  if (voidMode) {
    return (
      <div className="timeline-void">
        <p className={`void-message ${voidTextVisible ? 'visible' : ''}`}>
          Cậu vẫn đang ở đây.
        </p>
      </div>
    )
  }

  return (
    <div className={`timeline-container mood-${currentMs.mood}`}>
      
      {/* Background Ambience */}
      <div className={`timeline-bg ${fadingOut ? 'fade-out' : 'fade-in'}`}>
        {currentMs.mood === 'bonding' && <div className="bg-blur-shape shape-1" />}
        {currentMs.mood === 'distance' && <div className="bg-anchor-point" />}
      </div>

      {/* Content */}
      <div className={`timeline-content ${fadingOut ? 'content-exit' : 'content-enter'}`}>
        <h2 className="timeline-text" style={{ whiteSpace: 'pre-line' }}>
          {currentMs.text}
        </h2>
        
        {/* Subtext thường – luôn giữ chỗ, chỉ fade-in sau 2s */}
        {currentMs.interaction !== 'hold' && currentMs.subtext && (
           <p
             className="timeline-subtext"
             style={{ opacity: showSubtext ? 1 : 0, transition: 'opacity 0.8s ease' }}
           >
             {currentMs.subtext}
           </p>
        )}

        {/* INTERACTION: HOLD (Cho mốc Mệt mỏi) - luôn giữ chỗ, chỉ fade-in sau 3s */}
        {currentMs.interaction === 'hold' && (
          <div className={`hold-interaction-zone ${showHoldInteraction ? 'visible' : ''}`}>
             <div 
               className={`hold-trigger-point ${isHolding ? 'holding' : ''}`}
               onMouseDown={() => setIsHolding(true)}
               onMouseUp={() => setIsHolding(false)}
               onMouseLeave={() => setIsHolding(false)}
               onTouchStart={() => setIsHolding(true)}
               onTouchEnd={() => setIsHolding(false)}
             >
                <div className="hold-ring" style={{ transform: `scale(${1 + holdProgress/20})`, opacity: 0.5 + holdProgress/200 }} />
                <div className="hold-core" style={{ opacity: 0.3 + holdProgress/100 }} />
             </div>
             <p className="timeline-hint-text" style={{ opacity: isHolding ? 0.5 : 1 }}>
               {currentMs.subtext}
             </p>
          </div>
        )}
      </div>

      {/* Scroll Indicator (Chỉ hiện khi cho phép scroll) */}
      {showIndicator && !locked && !fadingOut && currentMs.interaction === 'scroll' && (
        <div className="timeline-indicator animate-bounce">↓</div>
      )}
    </div>
  )
}

// === STEP 4: CLIMAX (FLASHBACK + OPEN + VOICE) ===
function LetterOpenStep({ onOpen, isWarm, onVoicePlayingChange, onToggleMusic, isMusicPaused }) {
  const [canOpen, setCanOpen] = useState(false)
  const [isFlashing, setIsFlashing] = useState(false) // Đang tua nhanh ký ức
  const [flashIndex, setFlashIndex] = useState(0)
  const [opened, setOpened] = useState(false)
  const [showVoice, setShowVoice] = useState(false) // Hiện voice note sau khi đọc xong

  const letterLines = [
    "Chào em,",
    "Anh không giỏi nói những lời hoa mỹ,",
    "cũng chưa cho em được những điều rực rỡ nhất.",
    "Nhưng anh sẽ luôn là người đồng hành cùng em, bên em khi em cần.",
    "Đối với anh, Được gặp em là một sự may mắn,",
    "được yêu em nữa thì ông trời đã quá ưu ái anh rồi.",
    "Cảm ơn em vì đã là một phần đời của anh.",
    "Yêu em."
  ]

  useEffect(() => {
    const t = setTimeout(() => { setCanOpen(true) }, 500)
    return () => clearTimeout(t)
  }, [])

  // Xử lý hiệu ứng Flashback dồn dập
  const handleOpen = () => {
    if (opened || isFlashing) return

    // 1. Bắt đầu Flashback
    setIsFlashing(true)

    let count = 0
    const totalFlashes = 10
    const flashInterval = setInterval(() => {
      setFlashIndex(prev => (prev + 1) % MEMORIES.length)
      count++

      if (count >= totalFlashes) {
        // 2. Kết thúc Flashback -> BÙM (Mở thư)
        clearInterval(flashInterval)
        setIsFlashing(false)
        onOpen?.() // Kích hoạt nền ấm
        setOpened(true)

        // 3. Đợi chữ chạy xong thì hiện Voice Note
        const estimateMs = letterLines.length * 1500 + 2000
        setTimeout(() => {
          setShowVoice(true)
        }, estimateMs)
      }
    }, 120)
  }

  return (
    <div className="letter-step letter-step--open">
      
      {/* Màn hình Flashback (Hồi ức tua nhanh) */}
      {isFlashing && (
        <div className="flashback-overlay">
           <img 
             src={MEMORIES[flashIndex].url} 
             className="flashback-img" 
             alt="Memory" 
           />
           <div className="flashback-noise"></div>
        </div>
      )}

      <div className="letter-center">
        {/* Nút gợi ý mở */}
        <button
          type="button"
          className={`open-hint ${canOpen && !opened && !isFlashing ? 'open-hint--visible' : ''}`}
          onClick={handleOpen}
        >
          Mở thư nhé
        </button>

        {/* Nội dung thư */}
        {opened && (
          <div className="letter-content-container">
             <TypewriterEffect lines={letterLines} />

             {/* VOICE NOTE PLAYER */}
             <div className={`voice-note-container ${showVoice ? 'visible' : ''}`}>
                <div className="voice-divider"></div>
                <p className="voice-label">Có điều này anh muốn nói...</p>
                <VoicePlayer src="/voice.mp3" onPlayingChange={onVoicePlayingChange} />

                <p className="music-hint-text">
                  Nếu em không nghe rõ thì hãy&nbsp;
                  <button
                    type="button"
                    className="music-toggle-button"
                    onClick={onToggleMusic}
                  >
                    {isMusicPaused ? 'bật lại nhạc nhé' : 'tắt nhạc nền nhé'}
                  </button>
                </p>
             </div>
          </div>
        )}
      </div>
    </div>
  )
}

// Component Player Voice đơn giản, tinh tế
function VoicePlayer({ src, onPlayingChange }) {
    const [playing, setPlaying] = useState(false)
    const audioRef = useRef(null)

    const togglePlay = () => {
        if (!audioRef.current) return
        if (playing) {
            audioRef.current.pause()
            onPlayingChange?.(false)
        } else {
            audioRef.current.play()
            onPlayingChange?.(true)
        }
        setPlaying(!playing)
    }

    return (
        <div className="simple-audio-player" onClick={togglePlay}>
            <audio
              ref={audioRef}
              src={src}
              onEnded={() => {
                setPlaying(false)
                onPlayingChange?.(false)
              }}
            />
            <div className={`play-icon ${playing ? 'playing' : ''}`}>
                {playing ? 'II' : '▶'}
            </div>
            <div className="waveform-visual">
                {[...Array(10)].map((_, i) => (
                    <div
                      key={i}
                      className={`wave-bar ${playing ? 'animate' : ''}`}
                      style={{ animationDelay: `${i * 0.1}s` }}
                    />
                ))}
            </div>
        </div>
    )
}

// Typewriter giữ lại toàn bộ các dòng đã gõ xong
function TypewriterEffect({ lines }) {
    const [currentLineIndex, setCurrentLineIndex] = useState(0)
    const [currentText, setCurrentText] = useState('')
    
    useEffect(() => {
        if (currentLineIndex >= lines.length) return

        const line = lines[currentLineIndex]
        if (currentText.length < line.length) {
            // Đang gõ dòng hiện tại
            const timeout = setTimeout(() => {
                setCurrentText(line.slice(0, currentText.length + 1))
            }, 50) 
            return () => clearTimeout(timeout)
        } else {
            // Gõ xong dòng hiện tại -> Chuyển dòng
            const timeout = setTimeout(() => {
                setCurrentLineIndex(prev => prev + 1)
                setCurrentText('') // Reset text tạm thời để gõ dòng mới
            }, 1000) 
            return () => clearTimeout(timeout)
        }
    }, [currentLineIndex, currentText, lines])

    return (
        <div className="typewriter-container">
            {lines.map((line, index) => {
                // Dòng đã xong -> Hiện full và giữ nguyên
                if (index < currentLineIndex) {
                    return <p key={index} className="typewriter-line done">{line}</p>
                } 
                // Dòng đang gõ -> Hiện text đang chạy
                else if (index === currentLineIndex) {
                    return (
                      <p key={index} className="typewriter-line active">
                        {currentText}<span className="cursor">|</span>
                      </p>
                    )
                }
                // Dòng chưa đến -> Ẩn (giữ layout ổn định nếu cần)
                return (
                  <p
                    key={index}
                    className="typewriter-line hidden"
                    style={{ opacity: 0 }}
                  >
                    {line}
                  </p>
                )
            })}
        </div>
    )
}

export default App