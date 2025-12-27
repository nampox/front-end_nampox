import { useState, useEffect, useRef } from 'react'
import './Home.css'

// Custom smooth scroll with easing
const smoothScrollTo = (targetY, duration = 800) => {
  const startY = window.scrollY
  const difference = targetY - startY
  const startTime = performance.now()

  // Easing function - easeInOutQuart for buttery smooth feel
  const easeInOutQuart = (t) => {
    return t < 0.5 ? 8 * t * t * t * t : 1 - Math.pow(-2 * t + 2, 4) / 2
  }

  const animateScroll = (currentTime) => {
    const elapsed = currentTime - startTime
    const progress = Math.min(elapsed / duration, 1)
    const easedProgress = easeInOutQuart(progress)
    
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
  const [isBlinking, setIsBlinking] = useState(false)
  const [isAutoScrolling, setIsAutoScrolling] = useState(false)
  const [squareScale, setSquareScale] = useState(0.3)

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

  // Auto scroll - block native scroll and auto scroll immediately (no jitter)
  useEffect(() => {
    let isInCooldown = false
    let cooldownTimer = null
    const TOLERANCE = 50

    const startCooldown = (duration = 800) => {
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

      // At Section 1 (top) - scroll down
      if (scrollY < TOLERANCE && direction === 'down') {
        e.preventDefault()
        setIsAutoScrolling(true)
        startCooldown(800)
        smoothScrollTo(section2Top, 600)
        setTimeout(() => setIsAutoScrolling(false), 700)
        return
      }

      // At Section 2
      if (Math.abs(scrollY - section2Top) < TOLERANCE) {
        e.preventDefault()
        setIsAutoScrolling(true)
        startCooldown(800)
        
        if (direction === 'down') {
          window.dispatchEvent(new CustomEvent('globalAutoScroll', { detail: { direction: 'down' } }))
          smoothScrollTo(aboutTop, 600)
        } else {
          smoothScrollTo(0, 600)
        }
        
        setTimeout(() => setIsAutoScrolling(false), 700)
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
          style={{ transform: `scale(${squareScale})` }}
        >
          <div className="square-content">
            <h2>Explore My Work</h2>
            <p>Discover innovative solutions and creative projects</p>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Home
