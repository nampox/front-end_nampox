import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import './About.css'
import { useLanguage } from '../../context/LanguageContext'

// Ultra smooth scroll - easeOutExpo for instant response
const smoothScrollTo = (targetY, duration = 500) => {
  const startY = window.scrollY
  const difference = targetY - startY
  const startTime = performance.now()

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

function About() {
  const { t } = useLanguage()
  const sectionRef = useRef(null)
  const horizontalRef = useRef(null)
  const weCreateRef = useRef(null)
  const [isAutoScrolling, setIsAutoScrolling] = useState(false)
  const [targetProgress, setTargetProgress] = useState(0) // Target value (0 to 1)
  const [currentProgress, setCurrentProgress] = useState(0) // Actual animated value
  const animationRef = useRef(null)

  // Black overlay animation states
  const [isBlackOverlayVisible, setIsBlackOverlayVisible] = useState(false)
  const [showWeCreateText, setShowWeCreateText] = useState(false)

  // Smooth lerp animation for floating effect
  useEffect(() => {
    const lerp = (start, end, factor) => start + (end - start) * factor
    const clamp = (value, min, max) => Math.min(Math.max(value, min), max)
    
    const animate = () => {
      setCurrentProgress(prev => {
        const newValue = lerp(prev, targetProgress, 0.05) // Lower = more floating
        // Clamp to boundaries (0 to 1) - stop at section limits
        const clampedValue = clamp(newValue, 0, 1)
        // Stop animation when close enough
        if (Math.abs(clampedValue - targetProgress) < 0.001) {
          return clamp(targetProgress, 0, 1)
        }
        return clampedValue
      })
      animationRef.current = requestAnimationFrame(animate)
    }
    
    animationRef.current = requestAnimationFrame(animate)
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [targetProgress])

  // WE CREATE Section animation trigger
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY
      const weCreateTop = weCreateRef.current?.offsetTop || 0
      const weCreateHeight = weCreateRef.current?.offsetHeight || 0
      const windowHeight = window.innerHeight

      // Check if WE CREATE section is in viewport
      const sectionInView = scrollY + windowHeight / 2 >= weCreateTop &&
                          scrollY < weCreateTop + weCreateHeight

      // Check if WE CREATE section is out of viewport (scrolled past it)
      const sectionOutOfView = scrollY >= weCreateTop + weCreateHeight ||
                              scrollY + windowHeight < weCreateTop

      if (sectionInView && !isBlackOverlayVisible && !showWeCreateText) {
        // Trigger animation when section comes into view
        setIsBlackOverlayVisible(true)
        setShowWeCreateText(false)

        // Show black overlay for 1 second, then hide it and show text
        setTimeout(() => {
          setIsBlackOverlayVisible(false)
          setTimeout(() => {
            setShowWeCreateText(true)
          }, 600) // Small delay for smooth transition
        }, 600)
      } else if (sectionOutOfView && (isBlackOverlayVisible || showWeCreateText)) {
        // Reset animation when section goes out of view
        setIsBlackOverlayVisible(false)
        setShowWeCreateText(false)
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll() // Check initial position

    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [isBlackOverlayVisible, showWeCreateText])

  // Get items from translations with colors
  const translatedItems = t('about.items')
  const bgColors = ["rgb(247, 244, 244)", "rgb(239, 251, 249)", "rgb(242, 237, 244)"]
  const items = Array.isArray(translatedItems) 
    ? translatedItems.map((item, index) => ({
        ...item,
        bgColor: bgColors[index] || bgColors[0]
      }))
    : []

  // Handle horizontal scroll within About section
  useEffect(() => {
    let isInCooldown = false
    let cooldownTimer = null
    let touchStartY = 0
    const TOLERANCE = 50
    const SCROLL_SPEED = 0.12 // How fast horizontal scroll moves per wheel event
    const TOUCH_SENSITIVITY = 0.003 // For touch swipe

    const startCooldown = (duration = 300) => {
      isInCooldown = true
      if (cooldownTimer) clearTimeout(cooldownTimer)
      cooldownTimer = setTimeout(() => {
        isInCooldown = false
      }, duration)
    }

    // Listen for global auto-scroll events
    const handleGlobalAutoScroll = () => {
      startCooldown(500)
    }
    window.addEventListener('globalAutoScroll', handleGlobalAutoScroll)

    // Listen for header nav clicks
    const handleHeaderNavClick = () => {
      startCooldown(1500)
    }
    window.addEventListener('headerNavClick', handleHeaderNavClick)

    // Touch handlers - disabled on mobile (vertical layout)
    const handleTouchStart = (e) => {
      // Skip on mobile - use vertical scroll
      if (window.innerWidth <= 768) return
      touchStartY = e.touches[0].clientY
    }

    const handleTouchMove = (e) => {
      // Skip on mobile - use vertical scroll
      if (window.innerWidth <= 768) return
      if (isAutoScrolling || isInCooldown) return

      const scrollY = window.scrollY
      const sectionTop = sectionRef.current?.offsetTop || 0
      const isAtAboutTop = Math.abs(scrollY - sectionTop) < TOLERANCE

      if (!isAtAboutTop) return

      const touchCurrentY = e.touches[0].clientY
      const deltaY = touchStartY - touchCurrentY
      const direction = deltaY > 0 ? 'down' : 'up'

      // Only handle horizontal scroll when at About top
      if (direction === 'down' && targetProgress < 0.99) {
        e.preventDefault()
        setTargetProgress(prev => Math.min(1, prev + Math.abs(deltaY) * TOUCH_SENSITIVITY))
        touchStartY = touchCurrentY
      } else if (direction === 'up' && targetProgress > 0.01) {
        e.preventDefault()
        setTargetProgress(prev => Math.max(0, prev - Math.abs(deltaY) * TOUCH_SENSITIVITY))
        touchStartY = touchCurrentY
      }
    }

    const handleWheel = (e) => {
      // Skip on mobile - use vertical scroll
      if (window.innerWidth <= 768) return
      if (isAutoScrolling || isInCooldown) return

      const scrollY = window.scrollY
      const sectionTop = sectionRef.current?.offsetTop || 0
      const sectionHeight = sectionRef.current?.offsetHeight || 0
      const homeSection2 = document.querySelector('.home-section-2')
      const section2Top = homeSection2?.offsetTop || 0
      const weCreateTop = weCreateRef.current?.offsetTop || 0
      const worksSection = document.getElementById('works')
      const worksTop = worksSection?.offsetTop || (weCreateTop + (weCreateRef.current?.offsetHeight || 0))

      const direction = e.deltaY > 0 ? 'down' : 'up'

      // Check positions
      const isAtAboutTop = Math.abs(scrollY - sectionTop) < TOLERANCE
      const isAtWeCreateTop = Math.abs(scrollY - weCreateTop) < TOLERANCE
      const isAtWorksTop = Math.abs(scrollY - worksTop) < TOLERANCE
      const isInAboutSection = scrollY >= sectionTop - TOLERANCE && scrollY <= weCreateTop + TOLERANCE

      // Coming from Works section, scroll UP → go to WE CREATE section
      if (isAtWorksTop && direction === 'up') {
        e.preventDefault()
        setIsAutoScrolling(true)
        startCooldown(600)
        smoothScrollTo(weCreateTop, 500)
        setTimeout(() => setIsAutoScrolling(false), 600)
        return
      }

      // Coming from WE CREATE section, scroll UP → snap to About and set horizontal to max
      if (isAtWeCreateTop && direction === 'up') {
        e.preventDefault()
        setTargetProgress(1)
        setCurrentProgress(1) // Instant set for snap
        setIsAutoScrolling(true)
        startCooldown(800) // Longer cooldown
        smoothScrollTo(sectionTop, 500)
        setTimeout(() => setIsAutoScrolling(false), 800)
        return
      }

      // IMPORTANT: If in About section and scrolling UP with progress > 0
      // Must reverse horizontal items FIRST before any vertical scroll
      if (isInAboutSection && direction === 'up' && targetProgress > 0.01) {
        e.preventDefault()
        
        // If not at About top, scroll there first
        if (!isAtAboutTop) {
          setIsAutoScrolling(true)
          startCooldown(400)
          smoothScrollTo(sectionTop, 350)
          setTimeout(() => setIsAutoScrolling(false), 400)
          return
        }
        
        // At About top, reverse horizontal items
        setTargetProgress(prev => Math.max(0, prev - SCROLL_SPEED))
        return
      }

      // At About section top - handle horizontal scroll
      if (isAtAboutTop) {
        // Scroll UP with horizontal at 0 → go back to Home section 2
        if (direction === 'up' && targetProgress <= 0.01) {
          e.preventDefault()
          setIsAutoScrolling(true)
          startCooldown(600)
          smoothScrollTo(section2Top, 500)
          setTimeout(() => setIsAutoScrolling(false), 600)
          return
        }

        // Scroll DOWN → move horizontal items forward
        if (direction === 'down') {
          if (targetProgress < 0.99) {
            e.preventDefault()
            setTargetProgress(prev => Math.min(1, prev + SCROLL_SPEED))
            return
          }
          // Horizontal at 1 → scroll to WE CREATE section
          if (targetProgress >= 0.99) {
            e.preventDefault()
            const weCreateTop = weCreateRef.current?.offsetTop || 0
            setIsAutoScrolling(true)
            startCooldown(600)
            smoothScrollTo(weCreateTop, 500)
            setTimeout(() => setIsAutoScrolling(false), 600)
            return
          }
        }
      }
    }

    window.addEventListener('wheel', handleWheel, { passive: false })
    window.addEventListener('touchstart', handleTouchStart, { passive: true })
    window.addEventListener('touchmove', handleTouchMove, { passive: false })
    
    return () => {
      window.removeEventListener('wheel', handleWheel)
      window.removeEventListener('touchstart', handleTouchStart)
      window.removeEventListener('touchmove', handleTouchMove)
      window.removeEventListener('globalAutoScroll', handleGlobalAutoScroll)
      window.removeEventListener('headerNavClick', handleHeaderNavClick)
      if (cooldownTimer) clearTimeout(cooldownTimer)
    }
  }, [isAutoScrolling, targetProgress])

  // Calculate horizontal translate using animated currentProgress for floating effect
  // Responsive: detect mobile and adjust translate distance
  const isMobile = typeof window !== 'undefined' && window.innerWidth <= 768
  const translateDistance = isMobile ? 800 : 2500
  const horizontalTranslate = currentProgress * translateDistance

  // Calculate box position for each item based on scroll progress
  // Box moves from left to right as item passes through center of screen
  const getBoxTranslateX = (index) => {
    if (isMobile) return 0 // No parallax on mobile
    
    const boxMaxTranslate = 400 // Di chuyển tối đa 500px sang phải
    
    // Each item has its own progress range
    const itemCount = items.length
    const itemProgressStart = index / (itemCount + 1)
    const itemProgressEnd = (index + 1.5) / (itemCount + 1)
    
    // Calculate how far through this item's range we are
    let itemProgress = (currentProgress - itemProgressStart) / (itemProgressEnd - itemProgressStart)
    itemProgress = Math.max(0, Math.min(1, itemProgress))
    
    return itemProgress * boxMaxTranslate
  }

  return (
    <>
      <section id="about" className="about-section" ref={sectionRef}>
        {/* Single horizontal scrolling container for everything */}
        <div 
          className="about-horizontal-wrapper"
          ref={horizontalRef}
          style={{ 
            transform: `translateX(-${horizontalTranslate}px)`
          }}
        >
          {/* LEFT COLUMN: Title - Fade in from bottom */}
          <motion.div 
            className="about-left"
            initial={{ opacity: 0, y: 80 }}
            whileInView={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 80 }}
            transition={{ 
              duration: 0.8, 
              ease: [0.25, 0.1, 0.25, 1],
              opacity: { duration: 0.6 },
              y: { duration: 0.8, ease: [0.33, 1, 0.68, 1] }
            }}
            viewport={{ amount: 0.3 }}
          >
            <motion.h2 
              className="about-title"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 40 }}
              transition={{ duration: 0.6, delay: 0.1, ease: [0.33, 1, 0.68, 1] }}
              viewport={{ amount: 0.3 }}
            >
              {t('about.title1')} <br />
              <span className="title-highlight">{t('about.title2')}</span>
            </motion.h2>
            <motion.p 
              className="about-intro"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 30 }}
              transition={{ duration: 0.6, delay: 0.2, ease: [0.33, 1, 0.68, 1] }}
              viewport={{ amount: 0.3 }}
            >
              {t('about.intro')}
            </motion.p>
          </motion.div>

          {/* ITEMS - Simple render, no animation conflict */}
          {items.map((item, index) => (
            <div 
              key={item.id} 
              className="about-item"
              style={{ backgroundColor: item.bgColor }}
            >
              <div 
                className="item-image-box"
                style={{ 
                  transform: `translateX(${getBoxTranslateX(index)}px)`,
                  transition: 'transform 0.1s ease-out'
                }}
              >
                <video 
                  src={`/about/${index + 1}.mp4`}
                  autoPlay 
                  muted 
                  loop 
                  playsInline
                  className="item-video"
                />
              </div>
              <span className="item-number">{item.id}</span>
              <h3 className="item-title">{item.title}</h3>
              <p className="item-desc">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* WE CREATE Section */}
      <section className="we-create-section" ref={weCreateRef}>
        {/* Black overlay animation */}
        <motion.div
          className="we-create-overlay"
          initial={{ opacity: 0 }}
          animate={{
            opacity: isBlackOverlayVisible ? 1 : 0,
            backgroundColor: isBlackOverlayVisible ? '#000' : 'transparent'
          }}
          transition={{
            opacity: { duration: 0.5, ease: 'easeInOut' },
            backgroundColor: { duration: 0.5, ease: 'easeInOut' }
          }}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 10,
            pointerEvents: isBlackOverlayVisible ? 'auto' : 'none',
            overflow: 'hidden'
          }}
        >
          {isBlackOverlayVisible && <ScrollingTextBackground />}
        </motion.div>

        <motion.h2
          className="we-create-text"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={showWeCreateText ? {
            opacity: 1,
            scale: 1
          } : {
            opacity: 0,
            scale: 0.8
          }}
          transition={{
            duration: 0.8,
            ease: [0.33, 1, 0.68, 1],
            delay: showWeCreateText ? 0 : 0
          }}
        >
          {t('about.weCreate')}
        </motion.h2>
      </section>
    </>
  )
}

// Scrolling Text Background Component
function ScrollingTextBackground() {
  const text = "WE CREATE WE CREATE WE CREATE WE CREATE WE CREATE WE CREATE WE CREATE WE CREATE " // Dãy dài WE CREATE
  const isMobile = typeof window !== 'undefined' && window.innerWidth <= 768
  const rows = Array.from({ length: isMobile ? 4 : 3  }, (_, i) => i) // 4 rows mobile, 3 rows desktop

  return (
    <div className="scrolling-text-container">
      {rows.map((rowIndex) => (
        <div
          key={rowIndex}
          className="scrolling-text-row"
        >
          <div className={`scrolling-text-inner ${rowIndex % 2 === 0 ? 'scroll-left' : 'scroll-right'}`}>
            <span>{text}</span>
            <span>{text}</span>
          </div>
        </div>
      ))}
    </div>
  )
}

export default About
