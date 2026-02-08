import { NavLink, useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useAppStore } from '@/stores'
import { LayoutDashboard, Ticket, Users, Bot, BookOpen, BarChart3, Settings, ChevronLeft, ChevronRight } from 'lucide-react'
import clsx from 'clsx'

const menuItems = [
  { path: '/dashboard', icon: LayoutDashboard, key: 'nav.dashboard' },
  { path: '/tickets', icon: Ticket, key: 'nav.tickets' },
  { path: '/contacts', icon: Users, key: 'nav.contacts' },
  { path: '/ai-agent', icon: Bot, key: 'nav.aiAgent' },
  { path: '/knowledge-base', icon: BookOpen, key: 'nav.knowledgeBase' },
  { path: '/reports', icon: BarChart3, key: 'nav.reports' },
  { path: '/settings', icon: Settings, key: 'nav.settings' },
]

export default function Sidebar() {
  const { t } = useTranslation()
  const { sidebarCollapsed, toggleSidebar } = useAppStore()
  const location = useLocation()

  return (
    <aside
      className={clsx(
        'fixed left-0 top-0 h-full bg-white border-r border-gray-200 transition-all duration-300 z-40',
        sidebarCollapsed ? 'w-16' : 'w-64'
      )}
    >
      {/* Logo */}
      <div className="h-16 flex items-center justify-between px-4 border-b border-gray-200">
        {!sidebarCollapsed && (
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
              <Bot className="w-5 h-5 text-white" />
            </div>
            <span className="font-semibold text-gray-900">CS System</span>
          </div>
        )}
        <button
          onClick={toggleSidebar}
          className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-500"
        >
          {sidebarCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </button>
      </div>

      {/* Menu */}
      <nav className="p-3 space-y-1">
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path
          const Icon = item.icon

          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={clsx(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200',
                isActive
                  ? 'bg-primary-50 text-primary-600'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              )}
            >
              <Icon size={20} />
              {!sidebarCollapsed && (
                <span className="font-medium">{t(item.key)}</span>
              )}
            </NavLink>
          )
        })}
      </nav>
    </aside>
  )
}
