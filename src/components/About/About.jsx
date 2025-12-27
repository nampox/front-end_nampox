import { useEffect, useRef, useState } from 'react'
import './About.css'

// Custom smooth scroll with easing
const smoothScrollTo = (targetY, duration = 800) => {
  const startY = window.scrollY
  const difference = targetY - startY
  const startTime = performance.now()

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

function About() {
  const sectionRef = useRef(null)
  const [isAutoScrolling, setIsAutoScrolling] = useState(false)

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

    // Listen for global auto-scroll events
    const handleGlobalAutoScroll = () => {
      startCooldown(800)
    }
    window.addEventListener('globalAutoScroll', handleGlobalAutoScroll)

    // Listen for header nav clicks
    const handleHeaderNavClick = () => {
      startCooldown(1500)
    }
    window.addEventListener('headerNavClick', handleHeaderNavClick)

    const handleWheel = (e) => {
      if (isAutoScrolling || isInCooldown) return

      const scrollY = window.scrollY
      const sectionTop = sectionRef.current?.offsetTop || 0
      const homeSection2 = document.querySelector('.home-section-2')
      const section2Top = homeSection2?.offsetTop || 0

      const direction = e.deltaY > 0 ? 'down' : 'up'

      // At About section top - scroll up
      if (Math.abs(scrollY - sectionTop) < TOLERANCE && direction === 'up') {
        e.preventDefault()
        setIsAutoScrolling(true)
        startCooldown(800)
        smoothScrollTo(section2Top, 600)
        setTimeout(() => setIsAutoScrolling(false), 700)
        return
      }
    }

    window.addEventListener('wheel', handleWheel, { passive: false })
    return () => {
      window.removeEventListener('wheel', handleWheel)
      window.removeEventListener('globalAutoScroll', handleGlobalAutoScroll)
      window.removeEventListener('headerNavClick', handleHeaderNavClick)
      if (cooldownTimer) clearTimeout(cooldownTimer)
    }
  }, [isAutoScrolling])

  return (
    <section id="about" className="about-section" ref={sectionRef}>
      <div className="about-content">
        <h2 className="about-title">About Us</h2>
        <p className="about-description">
          We are a creative agency focused on delivering exceptional digital solutions. 
          With passion and innovation, we help brands stand out in the digital landscape.
        </p>
        <div className="about-stats">
          <div className="stat-item">
            <span className="stat-number">50+</span>
            <span className="stat-label">Projects Completed</span>
          </div>
          <div className="stat-item">
            <span className="stat-number">30+</span>
            <span className="stat-label">Happy Clients</span>
          </div>
          <div className="stat-item">
            <span className="stat-number">5+</span>
            <span className="stat-label">Years Experience</span>
          </div>
        </div>
      </div>
    </section>
  )
}

export default About

