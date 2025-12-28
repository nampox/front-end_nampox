import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
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
  const horizontalRef = useRef(null)
  const [isAutoScrolling, setIsAutoScrolling] = useState(false)
  const [horizontalProgress, setHorizontalProgress] = useState(0) // 0 to 1

  const items = [
    {
      id: "01",
      title: "We collaborate",
      desc: "Chúng tôi làm việc như một tập thể, kết hợp chặt chẽ với khách hàng để hiểu rõ nhu cầu và mục tiêu của họ.",
      bgColor: "rgb(247, 244, 244)"
    },
    {
      id: "02",
      title: "Translate research into solutions",
      desc: "Biến nghiên cứu thành giải pháp thực tế. Chúng tôi phân tích dữ liệu và xu hướng thị trường.",
      bgColor: "rgb(239, 251, 249)"
    },
    {
      id: "03",
      title: "Global creative team",
      desc: "Đội ngũ sáng tạo toàn cầu với đa dạng góc nhìn và kinh nghiệm từ khắp nơi trên thế giới.",
      bgColor: "rgb(242, 237, 244)"
    }
  ]

  // Handle horizontal scroll within About section
  useEffect(() => {
    let isInCooldown = false
    let cooldownTimer = null
    const TOLERANCE = 50
    const SCROLL_SPEED = 0.15 // How fast horizontal scroll moves per wheel event

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

    const handleWheel = (e) => {
      if (isAutoScrolling || isInCooldown) return

      const scrollY = window.scrollY
      const sectionTop = sectionRef.current?.offsetTop || 0
      const sectionHeight = sectionRef.current?.offsetHeight || 0
      const homeSection2 = document.querySelector('.home-section-2')
      const section2Top = homeSection2?.offsetTop || 0
      const worksSection = document.getElementById('works')
      const worksTop = worksSection?.offsetTop || (sectionTop + sectionHeight)

      const direction = e.deltaY > 0 ? 'down' : 'up'

      // Check positions
      const isAtAboutTop = Math.abs(scrollY - sectionTop) < TOLERANCE
      const isAtWorksTop = Math.abs(scrollY - worksTop) < TOLERANCE
      const isInAboutSection = scrollY >= sectionTop - TOLERANCE && scrollY < worksTop - TOLERANCE

      // Coming from Works section, scroll UP → need to reverse horizontal
      if (isAtWorksTop && direction === 'up') {
        e.preventDefault()
        // Set horizontal to max and scroll to About top
        setHorizontalProgress(1)
        setIsAutoScrolling(true)
        startCooldown(500)
        smoothScrollTo(sectionTop, 450)
        setTimeout(() => setIsAutoScrolling(false), 500)
        return
      }

      // In About section (anywhere) and scrolling UP with horizontal progress > 0
      // Must reverse horizontal items first before allowing scroll to Home
      if (isInAboutSection && direction === 'up' && horizontalProgress > 0) {
        e.preventDefault()
        
        // First scroll to About top if not there
        if (!isAtAboutTop) {
          setIsAutoScrolling(true)
          startCooldown(300)
          smoothScrollTo(sectionTop, 300)
          setTimeout(() => setIsAutoScrolling(false), 300)
          return
        }
        
        // Then reverse horizontal items
        setHorizontalProgress(prev => Math.max(0, prev - SCROLL_SPEED))
        return
      }

      // At About section top
      if (isAtAboutTop) {
        // Scroll UP from About top AND horizontal at start → go back to Home section 2
        if (direction === 'up' && horizontalProgress <= 0) {
          e.preventDefault()
          setIsAutoScrolling(true)
          startCooldown(500)
          smoothScrollTo(section2Top, 450)
          setTimeout(() => setIsAutoScrolling(false), 500)
          return
        }

        // Scroll DOWN → move horizontal items forward
        if (direction === 'down' && horizontalProgress < 1) {
          e.preventDefault()
          setHorizontalProgress(prev => Math.min(1, prev + SCROLL_SPEED))
          return
        }

        // horizontalProgress >= 1 and scrolling down → allow normal scroll to Works
        if (direction === 'down' && horizontalProgress >= 1) {
          // Allow default scroll
          return
        }
      }
    }

    window.addEventListener('wheel', handleWheel, { passive: false })
    return () => {
      window.removeEventListener('wheel', handleWheel)
      window.removeEventListener('globalAutoScroll', handleGlobalAutoScroll)
      window.removeEventListener('headerNavClick', handleHeaderNavClick)
      if (cooldownTimer) clearTimeout(cooldownTimer)
    }
  }, [isAutoScrolling, horizontalProgress])

  // Calculate horizontal translate (in pixels for smoother control)
  // Items are 1000px each + gap, need more translate distance
  const horizontalTranslate = horizontalProgress * 2500 // Move 2500px total

  return (
    <section id="about" className="about-section" ref={sectionRef}>
      {/* Single horizontal scrolling container for everything */}
      <div 
        className="about-horizontal-wrapper"
        ref={horizontalRef}
        style={{ 
          transform: `translateX(-${horizontalTranslate}px)`,
          transition: 'transform 0.15s ease-out'
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
            What About <br />
            <span className="title-highlight">Nampox?</span>
          </motion.h2>
          <motion.p 
            className="about-intro"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 30 }}
            transition={{ duration: 0.6, delay: 0.2, ease: [0.33, 1, 0.68, 1] }}
            viewport={{ amount: 0.3 }}
          >
            Chúng tôi giúp khách hàng tỏa sáng trên nền tảng số với những giải pháp sáng tạo và hiệu quả.
          </motion.p>
        </motion.div>

        {/* ITEMS - Slide in from right */}
        {items.map((item, index) => (
          <motion.div 
            key={item.id} 
            className="about-item"
            style={{ backgroundColor: item.bgColor }}
            initial={{ opacity: 0, x: 150 }}
            whileInView={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 150 }}
            transition={{ 
              duration: 0.6, 
              ease: [0.25, 0.1, 0.25, 1],
              delay: 0.1 + (index * 0.1),
              opacity: { duration: 0.5 },
              x: { duration: 0.6, ease: [0.33, 1, 0.68, 1] }
            }}
            viewport={{ amount: 0.2 }}
          >
            <span className="item-number">{item.id}</span>
            <h3 className="item-title">{item.title}</h3>
            <p className="item-desc">{item.desc}</p>
          </motion.div>
        ))}
      </div>
    </section>
  )
}

export default About
