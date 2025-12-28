import { useState, useEffect, useRef } from 'react'
import './Home.css'

// Ultra smooth scroll - easeOutExpo for instant response, smooth deceleration
const smoothScrollTo = (targetY, duration = 500) => {
  const startY = window.scrollY
  const difference = targetY - startY
  const startTime = performance.now()

  // easeOutExpo - starts fast, smooth deceleration (like qclay.design)
  const easeOutExpo = (t) => {
    return t === 1 ? 1 : 1 - Math.pow(2, -10 * t)
  }

  const animateScroll = (currentTime) => {
    const elapsed = currentTime - startTime
    const progress = Math.min(elapsed / duration, 1)
    const easedProgress = easeOutExpo(progress)
    
    window.scrollTo(0, startY + difference * easedProgress)

    if (progress < 1) {
      requestAnimationFrame(animateScroll)
    }
  }

  requestAnimationFrame(animateScroll)
}

function Home() {
  const eyeRef = useRef(null)
  const pupilRef = useRef(null)
  const section1Ref = useRef(null)
  const section2Ref = useRef(null)
  const squareRef = useRef(null)
  const videoRef = useRef(null)
  const [isBlinking, setIsBlinking] = useState(false)
  const [isAutoScrolling, setIsAutoScrolling] = useState(false)
  const [squareScale, setSquareScale] = useState(0.3)
  const [isVideoMuted, setIsVideoMuted] = useState(true)
  const [isVideoPlaying, setIsVideoPlaying] = useState(true) // Auto-playing initially

  // Handle video play with sound - restart from beginning
  const handlePlayWithSound = () => {
    if (videoRef.current) {
      videoRef.current.currentTime = 0 // Reset to beginning
      videoRef.current.muted = false
      videoRef.current.play()
      setIsVideoMuted(false)
      setIsVideoPlaying(true)
    }
  }

  // Toggle play/pause when clicking on video
  const handleVideoClick = () => {
    if (!videoRef.current || isVideoMuted) return // Don't handle if still showing play button
    
    if (videoRef.current.paused) {
      videoRef.current.play()
      setIsVideoPlaying(true)
    } else {
      videoRef.current.pause()
      setIsVideoPlaying(false)
    }
  }

  // Track mouse movement for eye
  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!eyeRef.current || !pupilRef.current) return

      const eye = eyeRef.current.getBoundingClientRect()
      const eyeCenterX = eye.left + eye.width / 2
      const eyeCenterY = eye.top + eye.height / 2

      const angleX = (e.clientX - eyeCenterX) / window.innerWidth * 10
      const angleY = (e.clientY - eyeCenterY) / window.innerHeight * 10

      const maxMove = 8
      const moveX = Math.max(-maxMove, Math.min(maxMove, angleX))
      const moveY = Math.max(-maxMove, Math.min(maxMove, angleY))

      pupilRef.current.style.transform = `translate(${moveX}px, ${moveY}px)`
    }

    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  // Ultra responsive auto scroll - no delay, instant response
  useEffect(() => {
    let isInCooldown = false
    let cooldownTimer = null
    const TOLERANCE = 30

    const startCooldown = (duration = 500) => {
      isInCooldown = true
      if (cooldownTimer) clearTimeout(cooldownTimer)
      cooldownTimer = setTimeout(() => {
        isInCooldown = false
      }, duration)
    }

    // Listen for header nav clicks - disable auto-scroll temporarily
    const handleHeaderNavClick = () => {
      startCooldown(1500)
    }
    window.addEventListener('headerNavClick', handleHeaderNavClick)

    const handleWheel = (e) => {
      if (isAutoScrolling || isInCooldown) return

      const scrollY = window.scrollY
      const section1Height = section1Ref.current?.offsetHeight || window.innerHeight
      const section2Top = section1Height
      const aboutSection = document.getElementById('about')
      const aboutTop = aboutSection?.offsetTop || section1Height * 2

      const direction = e.deltaY > 0 ? 'down' : 'up'

      // At Section 1 (top) - scroll down instantly
      if (scrollY < TOLERANCE && direction === 'down') {
        e.preventDefault()
        setIsAutoScrolling(true)
        startCooldown(500)
        smoothScrollTo(section2Top, 450) // Fast, smooth
        setTimeout(() => setIsAutoScrolling(false), 500)
        return
      }

      // At Section 2 - instant response
      if (Math.abs(scrollY - section2Top) < TOLERANCE) {
        e.preventDefault()
        setIsAutoScrolling(true)
        startCooldown(500)
        
        if (direction === 'down') {
          window.dispatchEvent(new CustomEvent('globalAutoScroll', { detail: { direction: 'down' } }))
          smoothScrollTo(aboutTop, 450)
        } else {
          smoothScrollTo(0, 450)
        }
        
        setTimeout(() => setIsAutoScrolling(false), 500)
        return
      }
    }

    window.addEventListener('wheel', handleWheel, { passive: false })
    return () => {
      window.removeEventListener('wheel', handleWheel)
      window.removeEventListener('headerNavClick', handleHeaderNavClick)
      if (cooldownTimer) clearTimeout(cooldownTimer)
    }
  }, [isAutoScrolling])

  // Scale square based on scroll position
  useEffect(() => {
    const handleScroll = () => {
      if (!section1Ref.current || !section2Ref.current) return

      const section1Height = section1Ref.current.offsetHeight
      const scrollY = window.scrollY
      
      // Calculate scale based on scroll position
      // Start scaling after section 1, complete at section 2
      const scrollProgress = Math.max(0, Math.min(1, (scrollY - section1Height * 0.3) / (section1Height * 0.7)))
      const newScale = 0.3 + (scrollProgress * 0.7) // Scale from 0.3 to 1
      
      setSquareScale(newScale)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Random blink effect
  useEffect(() => {
    let timeoutId

    const blink = () => {
      setIsBlinking(true)
      setTimeout(() => setIsBlinking(false), 120)
    }

    const doubleBlink = () => {
      blink()
      setTimeout(() => blink(), 300)
    }

    const scheduleNextBlink = () => {
      const delay = 2000 + Math.random() * 4000
      timeoutId = setTimeout(() => {
        if (Math.random() < 0.2) {
          doubleBlink()
        } else {
          blink()
        }
        scheduleNextBlink()
      }, delay)
    }

    scheduleNextBlink()
    return () => clearTimeout(timeoutId)
  }, [])

  return (
    <section id="home" className="home-wrapper">
      {/* Section 1 - Hero */}
      <div className="home-section home-section-1" ref={section1Ref}>
        <div className="home-container">
          {/* Main Content */}
          <div className="home-main">
            <h1 className="home-headline">
              Backend Developer crafting
              <br />
              <span className="highlight">scalable</span> and <span className="highlight">efficient</span> solutions
          </h1>
            
            <div className="home-footer">
              <div className="rating-badge">
                <div className="logo-mini">N</div>
                <div className="rating-info">
                  <div className="stars">★★★★★</div>
                  <div className="rating-text">Rating 5, 24 reviews</div>
                </div>
              </div>
              
              <div className="services-tags">
                WEB DEVELOPMENT / SYSTEM DESIGN / API /
                <br />
                DATABASE OPTIMIZATION / CLOUD / SECURITY
              </div>
            </div>
          </div>

          {/* Right Side */}
          <div className="home-right">
            <div className="scroll-indicator">
              {/* Eye Icon */}
              <div className={`eye-wrapper ${isBlinking ? 'blinking' : ''}`} ref={eyeRef}>
                <div className="eye-shape">
                  <div className="eyeball">
                    <div className="eye-lashes">
                      <span></span>
                      <span></span>
                      <span></span>
                      <span></span>
                      <span></span>
                    </div>
                    <div className="iris">
                      <div className="pupil" ref={pupilRef}>
                        <div className="pupil-shine"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Rotating Text */}
              <svg className="scroll-text" viewBox="0 0 200 200">
                <defs>
                  <path id="circlePath" d="M 100, 100 m -75, 0 a 75,75 0 1,1 150,0 a 75,75 0 1,1 -150,0"/>
                </defs>
                <text>
                  <textPath href="#circlePath" className="rotating-text">
                    SCROLL DOWN TO SEE MORE • SCROLL DOWN TO SEE MORE •
                  </textPath>
                </text>
              </svg>
            </div>
            
            <a href="#about" className="capabilities-btn">
              Our Capabilities Deck
            </a>
          </div>
        </div>
      </div>

      {/* Section 2 - Expanding Square */}
      <div className="home-section home-section-2" ref={section2Ref}>
        <div 
          className="expanding-square" 
          ref={squareRef}
          style={{ 
            transform: `scale(${squareScale})`,
            borderRadius: squareScale >= 0.95 ? '0px' : `${40 * (1 - squareScale)}px`
          }}
        >
          <video 
            ref={videoRef}
            className={`section2-video ${!isVideoMuted ? 'clickable' : ''}`}
            autoPlay 
            muted 
            loop 
            playsInline
            onClick={handleVideoClick}
          >
            <source src="/video.mp4" type="video/mp4" />
          </video>
          
          {/* Play button overlay */}
          {isVideoMuted && (
            <button 
              className="video-play-btn"
              onClick={handlePlayWithSound}
              aria-label="Play with sound"
            >
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M8 5v14l11-7z"/>
              </svg>
              <span>Play with sound</span>
            </button>
          )}
          
          <div className="square-content">
            <h2>Nam Pox</h2>
            <p>Backend Developer crafting scalable and efficient solutions</p>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Home
