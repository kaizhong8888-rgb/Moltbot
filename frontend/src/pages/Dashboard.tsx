import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { Ticket, Clock, CheckCircle, Users, Plus, MessageSquare, FileText, Settings, X } from 'lucide-react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts'
import Card from '@/components/Card'
import { reportService, DashboardStats, TicketVolumeData } from '@/services/reports'
import clsx from 'clsx'

const quickActions = [
  { icon: Plus, label: 'New Ticket', color: 'bg-primary-500', action: 'newTicket' },
  { icon: MessageSquare, label: 'AI Response', color: 'bg-green-500', action: 'aiResponse' },
  { icon: FileText, label: 'KB Article', color: 'bg-purple-500', action: 'kbArticle' },
  { icon: Settings, label: 'Settings', color: 'bg-gray-500', action: 'settings' },
]

const statusColors: Record<string, string> = {
  open: 'bg-yellow-100 text-yellow-700',
  pending: 'bg-blue-100 text-blue-700',
  resolved: 'bg-green-100 text-green-700',
  closed: 'bg-gray-100 text-gray-700',
}

const priorityColors: Record<string, string> = {
  low: 'bg-gray-100 text-gray-600',
  medium: 'bg-blue-100 text-blue-600',
  high: 'bg-orange-100 text-orange-600',
  urgent: 'bg-red-100 text-red-600',
}

interface RecentTicket {
  id: string
  subject: string
  customer: string
  status: string
  priority: string
  time: string
}

const mockRecentTickets: RecentTicket[] = [
  { id: 'TK-1001', subject: 'Unable to login to account', customer: 'John Smith', status: 'open', priority: 'high', time: '10 min ago' },
  { id: 'TK-1002', subject: 'Billing inquiry for March', customer: 'Sarah Johnson', status: 'pending', priority: 'medium', time: '25 min ago' },
  { id: 'TK-1003', subject: 'Feature request: Dark mode', customer: 'Mike Chen', status: 'resolved', priority: 'low', time: '1 hour ago' },
  { id: 'TK-1004', subject: 'App crashes on startup', customer: 'Emily Davis', status: 'open', priority: 'urgent', time: '2 hours ago' },
]

const mockTicketTrend = [
  { date: '01-08', count: 45 },
  { date: '02-08', count: 52 },
  { date: '03-08', count: 38 },
  { date: '04-08', count: 65 },
  { date: '05-08', count: 48 },
  { date: '06-08', count: 59 },
  { date: '07-08', count: 42 },
]

const categoryData = [
  { name: 'Technical', value: 35 },
  { name: 'Billing', value: 25 },
  { name: 'General', value: 20 },
  { name: 'Feature', value: 20 },
]

export default function Dashboard() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [ticketVolume, setTicketVolume] = useState<TicketVolumeData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [showNewTicketModal, setShowNewTicketModal] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [dashboardData, volumeData] = await Promise.all([
          reportService.getDashboard(),
          reportService.getTicketVolume({ period: '6months' }),
        ])
        setStats(dashboardData)
        setTicketVolume(volumeData)
      } catch (err: unknown) {
        console.error('Failed to fetch dashboard data:', err)
        // Use mock data as fallback when API is unavailable
        setStats({
          totalTickets: 2023,
          openTickets: 89,
          resolvedToday: 42,
          avgResponseTime: 2.5,
          ticketTrend: mockTicketTrend,
        })
        setTicketVolume({
          period: '6months',
          data: mockTicketTrend.map(item => ({
            month: item.date,
            tickets: item.count,
            resolved: Math.floor(item.count * 0.8),
          })),
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [])

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      open: t('status.open'),
      pending: t('status.pending'),
      resolved: t('status.resolved'),
      closed: t('status.closed'),
    }
    return labels[status] || status
  }

  const getPriorityLabel = (priority: string) => {
    const labels: Record<string, string> = {
      low: t('priority.low'),
      medium: t('priority.medium'),
      high: t('priority.high'),
      urgent: t('priority.urgent'),
    }
    return labels[priority] || priority
  }

  const trendData = ticketVolume?.data.map(item => ({
    date: item.month,
    count: item.tickets,
  })) || mockTicketTrend

  const handleQuickAction = (action: string) => {
    switch (action) {
      case 'newTicket':
        setShowNewTicketModal(true)
        break
      case 'aiResponse':
        navigate('/ai-agent')
        break
      case 'kbArticle':
        navigate('/knowledge')
        break
      case 'settings':
        navigate('/settings')
        break
      default:
        break
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{t('dashboard.title')}</h1>
          <p className="text-gray-500 mt-1">Welcome back! Here's what's happening today.</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">{t('dashboard.totalTickets')}</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                {stats?.totalTickets?.toLocaleString() || '2,023'}
              </p>
            </div>
            <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center">
              <Ticket className="w-6 h-6 text-primary-600" />
            </div>
          </div>
          <div className="mt-3 flex items-center text-sm">
            <span className="text-green-600 font-medium">+12%</span>
            <span className="text-gray-500 ml-1">vs last week</span>
          </div>
        </Card>

        <Card className="p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">{t('dashboard.openTickets')}</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                {stats?.openTickets || '89'}
              </p>
            </div>
            <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center">
              <Clock className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
          <div className="mt-3 flex items-center text-sm">
            <span className="text-red-600 font-medium">-5%</span>
            <span className="text-gray-500 ml-1">vs yesterday</span>
          </div>
        </Card>

        <Card className="p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">{t('dashboard.resolvedToday')}</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                {stats?.resolvedToday || '42'}
              </p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
          </div>
          <div className="mt-3 flex items-center text-sm">
            <span className="text-green-600 font-medium">+18%</span>
            <span className="text-gray-500 ml-1">vs yesterday</span>
          </div>
        </Card>

        <Card className="p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">{t('dashboard.avgResponseTime')}</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                {stats?.avgResponseTime || '2.5'}h
              </p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
              <Users className="w-6 h-6 text-purple-600" />
            </div>
          </div>
          <div className="mt-3 flex items-center text-sm">
            <span className="text-green-600 font-medium">-8%</span>
            <span className="text-gray-500 ml-1">improvement</span>
          </div>
        </Card>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Ticket Trend Chart */}
        <Card className="lg:col-span-2 p-5">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">{t('dashboard.ticketTrend')}</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="date" stroke="#9ca3af" fontSize={12} />
                <YAxis stroke="#9ca3af" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#fff',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)',
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="count"
                  stroke="#0ea5e9"
                  strokeWidth={2}
                  dot={{ fill: '#0ea5e9', strokeWidth: 2 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Category Chart */}
        <Card className="p-5">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Category Distribution</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={categoryData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis type="number" stroke="#9ca3af" fontSize={12} />
                <YAxis type="category" dataKey="name" stroke="#9ca3af" fontSize={12} width={70} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#fff',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                  }}
                />
                <Bar dataKey="value" fill="#0ea5e9" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      {/* Quick Actions & Recent Tickets */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Quick Actions */}
        <Card className="p-5">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">{t('dashboard.quickActions')}</h3>
          <div className="grid grid-cols-2 gap-3">
            {quickActions.map((action, index) => {
              const Icon = action.icon
              return (
                <button
                  key={index}
                  onClick={() => handleQuickAction(action.action)}
                  className="flex flex-col items-center gap-2 p-4 rounded-xl border border-gray-100 hover:bg-gray-50 transition-colors cursor-pointer"
                >
                  <div className={clsx('w-10 h-10 rounded-lg flex items-center justify-center', action.color)}>
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-sm text-gray-700">{action.label}</span>
                </button>
              )
            })}
          </div>
        </Card>

        {/* Recent Tickets */}
        <Card className="lg:col-span-2 p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">{t('dashboard.recentTickets')}</h3>
            <button
              onClick={() => navigate('/tickets')}
              className="text-sm text-primary-600 hover:text-primary-700 font-medium"
            >
              View All
            </button>
          </div>
          <div className="space-y-3">
            {mockRecentTickets.map((ticket) => (
              <div
                key={ticket.id}
                className="flex items-center justify-between p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white rounded-lg border border-gray-200 flex items-center justify-center text-sm font-medium text-gray-600">
                    {ticket.id.split('-')[1]}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{ticket.subject}</p>
                    <p className="text-sm text-gray-500">{ticket.customer} - {ticket.time}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className={clsx('px-2.5 py-1 rounded-full text-xs font-medium', statusColors[ticket.status])}>
                    {getStatusLabel(ticket.status)}
                  </span>
                  <span className={clsx('px-2.5 py-1 rounded-full text-xs font-medium', priorityColors[ticket.priority])}>
                    {getPriorityLabel(ticket.priority)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* New Ticket Modal */}
      {showNewTicketModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center animate-fadeIn">
          <div className="bg-white rounded-2xl p-6 w-full max-w-lg mx-4 animate-fadeIn">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">New Ticket</h2>
              <button
                onClick={() => setShowNewTicketModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X size={20} className="text-gray-500" />
              </button>
            </div>
            <form onSubmit={(e) => { e.preventDefault(); setShowNewTicketModal(false); navigate('/tickets'); }}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
                  <input
                    type="text"
                    placeholder="Brief description of the issue"
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea
                    placeholder="Detailed description..."
                    rows={4}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none"
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
                    <select className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500">
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                      <option value="urgent">Urgent</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                    <select className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500">
                      <option value="technical">Technical</option>
                      <option value="billing">Billing</option>
                      <option value="general">General</option>
                      <option value="feature">Feature Request</option>
                    </select>
                  </div>
                </div>
              </div>
              <div className="flex gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => setShowNewTicketModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-200 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                >
                  Create Ticket
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
