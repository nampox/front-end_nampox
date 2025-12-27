import './Header.css'

function Header() {
  const menuItems = [
    { label: 'Home', href: '#home' },
    { label: 'About', href: '#about' },
    { label: 'Works', href: '#works' },
    { label: 'Contact us', href: '#contact' },
  ]

  const handleNavClick = () => {
    // Dispatch event to disable auto-scroll snap for 2 seconds
    window.dispatchEvent(new CustomEvent('headerNavClick'))
  }

  return (
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
              onClick={handleNavClick}
            >
              <span className="nav-link-text">
                <span className="nav-link-text-inner">{item.label}</span>
                <span className="nav-link-text-inner">{item.label}</span>
              </span>
            </a>
          ))}
        </nav>
      </div>
    </header>
  )
}

export default Header

