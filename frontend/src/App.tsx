import { BrowserRouter, Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { AuthProvider } from './contexts/AuthContext'
import Dashboard from './pages/Dashboard'
import Tickets from './pages/Tickets'
import Contacts from './pages/Contacts'
import AIAgent from './pages/AIAgent'
import KnowledgeBase from './pages/KnowledgeBase'
import Reports from './pages/Reports'
import Settings from './pages/Settings'

// SVG Icons as components
const Icons = {
  Home: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/></svg>,
  Ticket: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z"/></svg>,
  Users: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/></svg>,
  Bot: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8M12 17v4M12 11h.01"/></svg>,
  Book: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 19.5A2.5 2.5 0 016.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z"/></svg>,
  Chart: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 20V10M12 20V4M6 20v-6"/></svg>,
  Settings: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 01-2.83 2.83l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06a1.65 1.65 0 001.82.33H9a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z"/></svg>,
  Search: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>,
  Bell: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 01-3.46 0"/></svg>,
  Menu: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/></svg>,
  Logout: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9"/></svg>,
  Globe: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z"/></svg>,
}

function Sidebar({ collapsed }: { collapsed: boolean }) {
  const location = useLocation()
  const navigate = useNavigate()
  const [activeItem, setActiveItem] = useState('dashboard')

  const menuItems = [
    { id: 'dashboard', name: 'Dashboard', nameCN: '仪表盘', path: '/dashboard', icon: Icons.Home },
    { id: 'tickets', name: 'Tickets', nameCN: '工单管理', path: '/tickets', icon: Icons.Ticket },
    { id: 'contacts', name: 'Contacts', nameCN: '客户管理', path: '/contacts', icon: Icons.Users },
    { id: 'ai-agent', name: 'AI Agent', nameCN: 'AI智能体', path: '/ai-agent', icon: Icons.Bot },
    { id: 'knowledge', name: 'Knowledge Base', nameCN: '知识库', path: '/knowledge', icon: Icons.Book },
    { id: 'reports', name: 'Reports', nameCN: '数据报表', path: '/reports', icon: Icons.Chart },
    { id: 'settings', name: 'Settings', nameCN: '系统设置', path: '/settings', icon: Icons.Settings },
  ]

  useEffect(() => {
    const current = menuItems.find(item => item.path === location.pathname)
    if (current) setActiveItem(current.id)
  }, [location.pathname])

  return (
    <aside className={`sidebar ${collapsed ? 'sidebar-collapsed' : ''}`}>
      <div className="sidebar-logo">
        <div className="sidebar-logo-icon">{collapsed ? '🤖' : '🤖'}</div>
        {!collapsed && <span className="sidebar-logo-text">CS System</span>}
      </div>
      <nav className="sidebar-menu">
        {menuItems.map((item) => {
          const Icon = item.icon
          const isActive = activeItem === item.id
          return (
            <div
              key={item.id}
              className={`sidebar-item ${isActive ? 'active' : ''}`}
              onClick={() => { setActiveItem(item.id); navigate(item.path) }}
              style={{ justifyContent: collapsed ? 'center' : 'flex-start' }}
            >
              <Icon />
              {!collapsed && <span>{item.name}</span>}
            </div>
          )
        })}
      </nav>
    </aside>
  )
}

function Header({ onMenuClick }: { onMenuClick: () => void }) {
  const [currentLang, setCurrentLang] = useState('zh')

  return (
    <header className="header">
      <div className="header-left">
        <button className="header-icon-btn" onClick={onMenuClick}>
          <Icons.Menu />
        </button>
        <div className="header-search">
          <Icons.Search />
          <input type="text" id="search" name="search" placeholder="搜索..." />
        </div>
      </div>
      <div className="header-right">
        <button
          className="header-icon-btn"
          onClick={() => setCurrentLang(currentLang === 'zh' ? 'en' : 'zh')}
          title={currentLang === 'zh' ? 'Switch to English' : '切换到中文'}
        >
          <Icons.Globe />
        </button>
        <button className="header-icon-btn">
          <Icons.Bell />
          <span className="header-badge"></span>
        </button>
        <div className="header-user-info">
          <div className="header-user-name">Admin User</div>
          <div className="header-user-role">Administrator</div>
        </div>
        <div className="header-avatar">A</div>
      </div>
    </header>
  )
}

function Layout({ children, collapsed, onToggle }: { children: React.ReactNode; collapsed: boolean; onToggle: () => void }) {
  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar collapsed={collapsed} />
      <Header onMenuClick={onToggle} />
      <main className={`main-content ${collapsed ? 'main-content-collapsed' : ''}`}>
        <div className="p-6">
          {children}
        </div>
      </main>
    </div>
  )
}

function App() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route
            path="/*"
            element={
              <Layout collapsed={sidebarCollapsed} onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}>
                <Routes>
                  <Route path="/" element={<Navigate to="/dashboard" replace />} />
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/tickets" element={<Tickets />} />
                  <Route path="/contacts" element={<Contacts />} />
                  <Route path="/ai-agent" element={<AIAgent />} />
                  <Route path="/knowledge" element={<KnowledgeBase />} />
                  <Route path="/reports" element={<Reports />} />
                  <Route path="/settings" element={<Settings />} />
                </Routes>
              </Layout>
            }
          />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}

function LoginPage() {
  const navigate = useNavigate()

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    navigate('/dashboard')
  }

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-logo">🤖</div>
        <h1>CS System</h1>
        <p style={{ color: '#64748b', marginTop: '8px', marginBottom: '24px' }}>
          Customer Service Management Platform
        </p>
        <form onSubmit={handleLogin}>
          <input
            type="email"
            id="email"
            name="email"
            placeholder="Email"
            style={{ width: '100%', marginBottom: '12px' }}
            defaultValue="admin@example.com"
          />
          <input
            type="password"
            id="password"
            name="password"
            placeholder="Password"
            style={{ width: '100%', marginBottom: '24px' }}
            defaultValue="password"
          />
          <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
            Sign In
          </button>
        </form>
      </div>
    </div>
  )
}

export default App
