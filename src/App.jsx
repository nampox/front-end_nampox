import { useState, useEffect } from 'react'
import './App.css'

function App() {
  const [activeTab, setActiveTab] = useState('hello')
  const [helloData, setHelloData] = useState(null)
  const [usersData, setUsersData] = useState(null)
  const [timeData, setTimeData] = useState(null)
  const [loading, setLoading] = useState({})
  const [inputName, setInputName] = useState('')

  const fetchApi = async (endpoint, options = {}) => {
    const key = endpoint.split('?')[0].replace('/api/', '')
    setLoading(prev => ({ ...prev, [key]: true }))
    
    try {
      const res = await fetch(endpoint, options)
      const data = await res.json()
      return data
    } catch (error) {
      console.error('API Error:', error)
      return { error: error.message }
    } finally {
      setLoading(prev => ({ ...prev, [key]: false }))
    }
  }

  const handleHelloApi = async () => {
    const name = inputName.trim() || undefined
    const query = name ? `?name=${encodeURIComponent(name)}` : ''
    const data = await fetchApi(`/api/hello${query}`)
    setHelloData(data)
  }

  const handleUsersApi = async () => {
    const data = await fetchApi('/api/users')
    setUsersData(data)
  }

  const handleTimeApi = async () => {
    const data = await fetchApi('/api/time')
    setTimeData(data)
  }

  useEffect(() => {
    // Auto-fetch time on mount
    handleTimeApi()
  }, [])

  return (
    <div className="app">
      {/* Header */}
      <header className="header">
        <div className="header-content">
          <div className="logo">
            <span className="logo-icon">⚡</span>
            <span className="logo-text">Nampox</span>
          </div>
          <nav className="nav">
            <a href="https://vercel.com" target="_blank" rel="noopener noreferrer">
              Vercel
            </a>
            <a href="https://vitejs.dev" target="_blank" rel="noopener noreferrer">
              Vite
            </a>
            <a href="https://react.dev" target="_blank" rel="noopener noreferrer">
              React
            </a>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content animate-fade-in">
          <h1 className="hero-title">
            <span className="gradient-text">React</span> + 
            <span className="gradient-text-alt"> Serverless API</span>
          </h1>
          <p className="hero-subtitle">
            Webapp hiện đại với React và Vercel Serverless Functions
          </p>
          <div className="hero-badges">
            <span className="badge">⚡ Vite</span>
            <span className="badge">⚛️ React 18</span>
            <span className="badge">🚀 Serverless</span>
            <span className="badge">▲ Vercel</span>
          </div>
        </div>
      </section>

      {/* API Demo Section */}
      <main className="main">
        <div className="container">
          <h2 className="section-title animate-fade-in">
            🔌 Demo Serverless API
          </h2>
          
          {/* Tabs */}
          <div className="tabs animate-fade-in animate-delay-1">
            <button 
              className={`tab ${activeTab === 'hello' ? 'active' : ''}`}
              onClick={() => setActiveTab('hello')}
            >
              👋 Hello API
            </button>
            <button 
              className={`tab ${activeTab === 'users' ? 'active' : ''}`}
              onClick={() => setActiveTab('users')}
            >
              👥 Users API
            </button>
            <button 
              className={`tab ${activeTab === 'time' ? 'active' : ''}`}
              onClick={() => setActiveTab('time')}
            >
              🕐 Time API
            </button>
          </div>

          {/* Tab Content */}
          <div className="tab-content animate-fade-in animate-delay-2">
            {activeTab === 'hello' && (
              <div className="api-demo">
                <div className="api-info">
                  <code className="endpoint">GET /api/hello?name=&#123;name&#125;</code>
                  <p>API chào hỏi đơn giản với query parameter</p>
                </div>
                <div className="api-input-group">
                  <input
                    type="text"
                    placeholder="Nhập tên của bạn..."
                    value={inputName}
                    onChange={(e) => setInputName(e.target.value)}
                    className="input"
                  />
                  <button 
                    onClick={handleHelloApi} 
                    disabled={loading.hello}
                    className="btn btn-primary"
                  >
                    {loading.hello ? '⏳ Đang gọi...' : '🚀 Gọi API'}
                  </button>
                </div>
                {helloData && (
                  <div className="api-response">
                    <h4>📤 Response:</h4>
                    <pre><code>{JSON.stringify(helloData, null, 2)}</code></pre>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'users' && (
              <div className="api-demo">
                <div className="api-info">
                  <code className="endpoint">GET /api/users</code>
                  <p>API lấy danh sách người dùng (fake database)</p>
                </div>
                <button 
                  onClick={handleUsersApi} 
                  disabled={loading.users}
                  className="btn btn-primary"
                >
                  {loading.users ? '⏳ Đang tải...' : '📋 Lấy danh sách Users'}
                </button>
                {usersData && (
                  <div className="api-response">
                    <h4>📤 Response:</h4>
                    {usersData.success && (
                      <div className="users-grid">
                        {usersData.data.map(user => (
                          <div key={user.id} className="user-card">
                            <div className="user-avatar">
                              {user.name.charAt(0)}
                            </div>
                            <div className="user-info">
                              <h5>{user.name}</h5>
                              <p className="mono">{user.email}</p>
                              <span className={`role-badge ${user.role.toLowerCase()}`}>
                                {user.role}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                    <details>
                      <summary>Xem JSON Response</summary>
                      <pre><code>{JSON.stringify(usersData, null, 2)}</code></pre>
                    </details>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'time' && (
              <div className="api-demo">
                <div className="api-info">
                  <code className="endpoint">GET /api/time</code>
                  <p>API lấy thời gian server (múi giờ Việt Nam)</p>
                </div>
                <button 
                  onClick={handleTimeApi} 
                  disabled={loading.time}
                  className="btn btn-primary"
                >
                  {loading.time ? '⏳ Đang tải...' : '🔄 Cập nhật thời gian'}
                </button>
                {timeData && (
                  <div className="api-response">
                    <h4>📤 Response:</h4>
                    <div className="time-display">
                      <div className="time-card">
                        <span className="time-label">🇻🇳 Việt Nam</span>
                        <span className="time-value">{timeData.formatted}</span>
                      </div>
                      <div className="time-card">
                        <span className="time-label">🌐 UTC</span>
                        <span className="time-value mono">{timeData.utc}</span>
                      </div>
                      <div className="time-card">
                        <span className="time-label">⏱️ Unix Timestamp</span>
                        <span className="time-value mono">{timeData.unix}</span>
                      </div>
                      <div className="time-card">
                        <span className="time-label">🖥️ Server</span>
                        <span className="time-value">{timeData.server}</span>
                      </div>
                    </div>
                    <details>
                      <summary>Xem JSON Response</summary>
                      <pre><code>{JSON.stringify(timeData, null, 2)}</code></pre>
                    </details>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* API Endpoints */}
          <section className="endpoints-section animate-fade-in animate-delay-3">
            <h3>📡 Available Endpoints</h3>
            <div className="endpoints-grid">
              <div className="endpoint-card">
                <span className="method get">GET</span>
                <code>/api/hello</code>
                <p>API chào hỏi</p>
              </div>
              <div className="endpoint-card">
                <span className="method get">GET</span>
                <code>/api/users</code>
                <p>Lấy danh sách users</p>
              </div>
              <div className="endpoint-card">
                <span className="method post">POST</span>
                <code>/api/users</code>
                <p>Tạo user mới</p>
              </div>
              <div className="endpoint-card">
                <span className="method get">GET</span>
                <code>/api/time</code>
                <p>Lấy thời gian server</p>
              </div>
            </div>
          </section>
        </div>
      </main>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-content">
          <p>
            Made with 💜 by <span className="gradient-text">Nampox</span>
          </p>
          <p className="mono">
            Deployed on Vercel • React + Serverless
          </p>
        </div>
      </footer>
    </div>
  )
}

export default App

