import { useEffect, useRef, useState } from 'react'
import './About.css'

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
  const sectionRef = useRef(null)
  const [isAutoScrolling, setIsAutoScrolling] = useState(false)

  // Ultra responsive auto scroll - no delay
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

    const handleWheel = (e) => {
      if (isAutoScrolling || isInCooldown) return

      const scrollY = window.scrollY
      const sectionTop = sectionRef.current?.offsetTop || 0
      const homeSection2 = document.querySelector('.home-section-2')
      const section2Top = homeSection2?.offsetTop || 0

      const direction = e.deltaY > 0 ? 'down' : 'up'

      // At About section top - scroll up instantly
      if (Math.abs(scrollY - sectionTop) < TOLERANCE && direction === 'up') {
        e.preventDefault()
        setIsAutoScrolling(true)
        startCooldown(500)
        smoothScrollTo(section2Top, 450)
        setTimeout(() => setIsAutoScrolling(false), 500)
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

