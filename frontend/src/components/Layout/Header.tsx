import { useTranslation } from 'react-i18next'
import { useAppStore } from '@/stores'
import { Search, HelpCircle, Globe, Bell, User, ChevronDown } from 'lucide-react'
import clsx from 'clsx'

export default function Header() {
  const { t, i18n } = useTranslation()
  const { currentUser, sidebarCollapsed, language, setLanguage } = useAppStore()

  const toggleLanguage = () => {
    const newLang = language === 'zh' ? 'en' : 'zh'
    setLanguage(newLang)
    i18n.changeLanguage(newLang)
  }

  return (
    <header
      className={clsx(
        'fixed top-0 right-0 h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 z-30 transition-all duration-300',
        sidebarCollapsed ? 'left-16' : 'left-64'
      )}
    >
      {/* Search */}
      <div className="flex items-center flex-1 max-w-xl">
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder={t('common.search')}
            className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-4">
        {/* Language Toggle */}
        <button
          onClick={toggleLanguage}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg hover:bg-gray-50 text-gray-600"
        >
          <Globe size={18} />
          <span className="text-sm font-medium">{language === 'zh' ? '中文' : 'EN'}</span>
        </button>

        {/* Help */}
        <button className="p-2 rounded-lg hover:bg-gray-50 text-gray-500">
          <HelpCircle size={20} />
        </button>

        {/* Notifications */}
        <button className="p-2 rounded-lg hover:bg-gray-50 text-gray-500 relative">
          <Bell size={20} />
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>

        {/* User Menu */}
        <div className="flex items-center gap-3 pl-4 border-l border-gray-200">
          <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
            <User size={16} className="text-primary-600" />
          </div>
          <div className="hidden md:block">
            <p className="text-sm font-medium text-gray-900">{currentUser?.name || 'Guest'}</p>
            <p className="text-xs text-gray-500">{currentUser?.email || ''}</p>
          </div>
          <ChevronDown size={16} className="text-gray-400" />
        </div>
      </div>
    </header>
  )
}
