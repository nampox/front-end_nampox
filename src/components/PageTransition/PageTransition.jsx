import { useEffect, useState } from 'react'
import './PageTransition.css'

function PageTransition({ isActive, onComplete, onMiddle }) {
  const [phase, setPhase] = useState('idle') // idle, entering, showing, leaving

  useEffect(() => {
    if (isActive) {
      // Start animation - overlay slides in
      setPhase('entering')
      
      // After overlay covers screen, show logo + scroll to target
      setTimeout(() => {
        setPhase('showing')
      }, 550) // Slightly before slideIn completes for smooth transition
      
      // Scroll to target while logo is showing
      setTimeout(() => {
        onMiddle?.()
      }, 700)
      
      // Start leaving - overlay fades out
      setTimeout(() => {
        setPhase('leaving')
      }, 1200)
      
      // Animation complete
      setTimeout(() => {
        setPhase('idle')
        onComplete?.()
      }, 1800)
    }
  }, [isActive, onComplete, onMiddle])

  if (phase === 'idle') return null

  return (
    <div className={`page-transition ${phase}`}>
      <div className="transition-overlay">
        <div className="transition-logo">NAMPOX</div>
      </div>
    </div>
  )
}

export default PageTransition

