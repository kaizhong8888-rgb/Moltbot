import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useAppStore } from '@/stores'
import { useAuth } from '@/contexts/AuthContext'
import { User, Bell, Link2, Users, CreditCard, Globe, Moon, Save, Check } from 'lucide-react'
import Card from '@/components/Card'
import { settingsService, GeneralSettings, NotificationSettings, BillingInfo } from '@/services/settings'
import clsx from 'clsx'

const tabs = [
  { id: 'general', label: 'General', icon: User },
  { id: 'notifications', label: 'Notifications', icon: Bell },
  { id: 'integrations', label: 'Integrations', icon: Link2 },
  { id: 'team', label: 'Team', icon: Users },
  { id: 'billing', label: 'Billing', icon: CreditCard },
]

export default function Settings() {
  const { t } = useTranslation()
  const { language, setLanguage } = useAppStore()
  const { logout, user } = useAuth()
  const [activeTab, setActiveTab] = useState('general')
  const [darkMode, setDarkMode] = useState(false)
  const [saved, setSaved] = useState(false)
  const [generalSettings, setGeneralSettings] = useState<GeneralSettings | null>(null)
  const [notificationSettings, setNotificationSettings] = useState<NotificationSettings | null>(null)
  const [billingInfo, setBillingInfo] = useState<BillingInfo | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [general, notifications, billing] = await Promise.all([
          settingsService.getGeneral(),
          settingsService.getNotifications(),
          settingsService.getBilling(),
        ])
        setGeneralSettings(general)
        setNotificationSettings(notifications)
        setBillingInfo(billing)
        setDarkMode(general.theme === 'dark')
      } catch (err: unknown) {
        console.error('Failed to fetch settings:', err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [])

  const handleSave = () => {
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const handleLogout = () => {
    logout()
  }

  if (isLoading) {
    return (
      <div className="flex gap-6 h-[calc(100vh-8rem)]">
        <div className="w-64 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex gap-6 h-[calc(100vh-8rem)] animate-fadeIn">
      {/* Sidebar */}
      <Card className="w-64 flex flex-col py-4">
        <div className="px-4 pb-4 border-b border-gray-100 mb-4">
          <h2 className="text-lg font-semibold text-gray-900">{t('settings.title')}</h2>
        </div>
        <div className="flex-1 px-3">
          {tabs.map((tab) => {
            const Icon = tab.icon
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={clsx(
                  'w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
                  activeTab === tab.id
                    ? 'bg-primary-50 text-primary-600'
                    : 'text-gray-600 hover:bg-gray-50'
                )}
              >
                <Icon size={18} />
                {tab.label}
              </button>
            )
          })}
        </div>
        <div className="px-3 pt-4 border-t border-gray-100">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
          >
            <span>🚪</span>
            {t('common.logout')}
          </button>
        </div>
      </Card>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        {activeTab === 'general' && (
          <div className="space-y-6">
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">{t('settings.general')}</h3>
              <div className="space-y-6">
                {/* Language */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                      <Globe size={20} className="text-gray-500" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">Language</p>
                      <p className="text-sm text-gray-500">Select your preferred language</p>
                    </div>
                  </div>
                  <select
                    value={language}
                    onChange={(e) => setLanguage(e.target.value as 'en' | 'zh')}
                    className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  >
                    <option value="zh">中文 (Chinese)</option>
                    <option value="en">English</option>
                  </select>
                </div>

                {/* Dark Mode */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                      <Moon size={20} className="text-gray-500" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">Dark Mode</p>
                      <p className="text-sm text-gray-500">Switch to dark theme</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setDarkMode(!darkMode)}
                    className={clsx(
                      'relative w-12 h-6 rounded-full transition-colors',
                      darkMode ? 'bg-primary-600' : 'bg-gray-200'
                    )}
                  >
                    <span
                      className={clsx(
                        'absolute top-1 w-4 h-4 bg-white rounded-full transition-transform',
                        darkMode ? 'translate-x-7' : 'translate-x-1'
                      )}
                    />
                  </button>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Profile</h3>
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="w-20 h-20 bg-primary-100 rounded-full flex items-center justify-center">
                    <span className="text-primary-600 text-2xl font-bold">{user?.name?.charAt(0) || 'A'}</span>
                  </div>
                  <button className="px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium hover:bg-gray-50">
                    Change Avatar
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                    <input
                      type="text"
                      defaultValue={user?.name?.split(' ')[0] || 'Admin'}
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                    <input
                      type="text"
                      defaultValue={user?.name?.split(' ')[1] || 'User'}
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input
                    type="email"
                    defaultValue={user?.email || 'admin@example.com'}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>
              </div>
            </Card>
          </div>
        )}

        {activeTab === 'notifications' && (
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">{t('settings.notifications')}</h3>
            <div className="space-y-4">
              {[
                { label: 'New Ticket Notifications', desc: 'Get notified when a new ticket is created', key: 'newTicket' },
                { label: 'Ticket Updates', desc: 'Get notified when tickets are updated', key: 'ticketUpdates' },
                { label: 'Customer Messages', desc: 'Get notified about new customer messages', key: 'customerMessages' },
                { label: 'Team Mentions', desc: 'Get notified when mentioned', key: 'teamMentions' },
                { label: 'Weekly Reports', desc: 'Receive weekly performance reports', key: 'weeklyReports' },
              ].map((item, index) => (
                <div key={index} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
                  <div>
                    <p className="font-medium text-gray-900">{item.label}</p>
                    <p className="text-sm text-gray-500">{item.desc}</p>
                  </div>
                  <button
                    className={clsx(
                      'relative w-12 h-6 rounded-full transition-colors',
                      notificationSettings?.[item.key as keyof NotificationSettings] ? 'bg-primary-600' : 'bg-gray-200'
                    )}
                    onClick={() => setNotificationSettings(prev => prev ? { ...prev, [item.key]: !prev[item.key as keyof NotificationSettings] } : null)}
                  >
                    <span
                      className={clsx(
                        'absolute top-1 w-4 h-4 bg-white rounded-full transition-transform',
                        notificationSettings?.[item.key as keyof NotificationSettings] ? 'translate-x-7' : 'translate-x-1'
                      )}
                    />
                  </button>
                </div>
              ))}
            </div>
          </Card>
        )}

        {activeTab === 'integrations' && (
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">{t('settings.integrations')}</h3>
            <div className="space-y-4">
              {[
                { name: 'Slack', desc: 'Send ticket notifications to Slack', status: 'connected', icon: '💬' },
                { name: 'Zendesk', desc: 'Sync tickets with Zendesk', status: 'disconnected', icon: '🔄' },
                { name: 'Salesforce', desc: 'Connect with CRM', status: 'disconnected', icon: '☁️' },
                { name: 'OpenAI', desc: 'AI-powered responses', status: 'connected', icon: '🤖' },
              ].map((item, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{item.icon}</span>
                    <div>
                      <p className="font-medium text-gray-900">{item.name}</p>
                      <p className="text-sm text-gray-500">{item.desc}</p>
                    </div>
                  </div>
                  <button
                    className={clsx(
                      'px-4 py-2 rounded-lg text-sm font-medium transition-colors',
                      item.status === 'connected'
                        ? 'bg-green-100 text-green-700'
                        : 'bg-primary-600 text-white hover:bg-primary-700'
                    )}
                  >
                    {item.status === 'connected' ? (
                      <span className="flex items-center gap-1">
                        <Check size={16} /> Connected
                      </span>
                    ) : (
                      'Connect'
                    )}
                  </button>
                </div>
              ))}
            </div>
          </Card>
        )}

        {activeTab === 'team' && (
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">{t('settings.team')}</h3>
              <button className="px-4 py-2 bg-primary-600 text-white rounded-lg text-sm font-medium hover:bg-primary-700">
                Invite Member
              </button>
            </div>
            <div className="space-y-3">
              {[
                { name: 'Admin User', email: 'admin@example.com', role: 'Admin', avatar: 'A' },
                { name: 'Mike Chen', email: 'mike@example.com', role: 'Agent', avatar: 'M' },
                { name: 'Sarah Johnson', email: 'sarah@example.com', role: 'Agent', avatar: 'S' },
              ].map((member, index) => (
                <div key={index} className="flex items-center justify-between p-4 border border-gray-100 rounded-xl">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                      <span className="text-primary-600 font-medium">{member.avatar}</span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{member.name}</p>
                      <p className="text-sm text-gray-500">{member.email}</p>
                    </div>
                  </div>
                  <select className="px-3 py-1.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500">
                    <option selected={member.role === 'Admin'}>Admin</option>
                    <option selected={member.role === 'Agent'}>Agent</option>
                  </select>
                </div>
              ))}
            </div>
          </Card>
        )}

        {activeTab === 'billing' && (
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">{t('settings.billing')}</h3>
            <div className="bg-primary-50 rounded-xl p-6 mb-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-primary-600">Current Plan</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{billingInfo?.plan || 'Enterprise'}</p>
                  <p className="text-gray-500 mt-1">${billingInfo?.price || 99}/month - Renews on {billingInfo?.nextBillingDate || 'Mar 8, 2024'}</p>
                </div>
                <button className="px-4 py-2 bg-primary-600 text-white rounded-lg text-sm font-medium hover:bg-primary-700">
                  Upgrade Plan
                </button>
              </div>
            </div>
            <div className="space-y-3">
              {[
                { label: 'Team Members', used: 3, limit: 'Unlimited' },
                { label: 'Storage', used: 12.5, limit: 50 },
                { label: 'API Calls', used: 45820, limit: 100000 },
              ].map((item, index) => (
                <div key={index} className="py-3 border-b border-gray-100">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">{item.label}</span>
                    <span className="text-sm text-gray-500">{item.used.toLocaleString()} / {item.limit.toLocaleString()}</span>
                  </div>
                  <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary-500 rounded-full"
                      style={{ width: `${Math.min((item.used / item.limit) * 100, 100)}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </Card>
        )}

        {/* Save Button */}
        <div className="flex justify-end mt-6">
          <button
            onClick={handleSave}
            className={clsx(
              'flex items-center gap-2 px-6 py-2 rounded-lg text-white font-medium transition-all',
              saved ? 'bg-green-500' : 'bg-primary-600 hover:bg-primary-700'
            )}
          >
            {saved ? (
              <>
                <Check size={18} /> Saved
              </>
            ) : (
              <>
                <Save size={18} /> Save Changes
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
