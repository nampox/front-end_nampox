import { useState, useCallback } from 'react'
import './Header.css'
import PageTransition from '../PageTransition/PageTransition'
import { useLanguage } from '../../context/LanguageContext'

function Header() {
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [targetHref, setTargetHref] = useState(null)
  const { language, toggleLanguage, t } = useLanguage()

  const menuItems = [
    { label: t('header.home'), href: '#home' },
    { label: t('header.about'), href: '#about' },
    { label: t('header.works'), href: '#works' },
    { label: t('header.contact'), href: '#contact' },
  ]

  const handleNavClick = (e, href) => {
    e.preventDefault()
    
    // Don't trigger if already transitioning
    if (isTransitioning) return
    
    // Start transition
    setTargetHref(href)
    setIsTransitioning(true)
    
    // Dispatch event to disable auto-scroll
    window.dispatchEvent(new CustomEvent('headerNavClick'))
  }

  // Scroll to target while overlay covers screen
  const handleTransitionMiddle = useCallback(() => {
    if (targetHref) {
      const element = document.querySelector(targetHref)
      if (element) {
        element.scrollIntoView({ behavior: 'instant' })
      }
    }
  }, [targetHref])

  // Animation complete - cleanup
  const handleTransitionComplete = useCallback(() => {
    setIsTransitioning(false)
    setTargetHref(null)
  }, [])

  return (
    <>
      <PageTransition 
        isActive={isTransitioning} 
        onMiddle={handleTransitionMiddle}
        onComplete={handleTransitionComplete} 
      />
      
      <header className="header">
        <div className="header-content">
          <div className="logo">
            <span className="logo-text">NAMPOX</span>
          </div>
          <nav className="nav">
            {menuItems.map((item) => (
              <a 
                key={item.href} 
                href={item.href} 
                className="nav-link"
                onClick={(e) => handleNavClick(e, item.href)}
              >
                <span className="nav-link-text">
                  <span className="nav-link-text-inner">{item.label}</span>
                  <span className="nav-link-text-inner">{item.label}</span>
                </span>
              </a>
            ))}
            <button 
              className="lang-toggle"
              onClick={toggleLanguage}
              aria-label="Toggle language"
            >
              {language === 'en' ? 'VI' : 'EN'}
            </button>
          </nav>
        </div>
      </header>
    </>
  )
}

export default Header

