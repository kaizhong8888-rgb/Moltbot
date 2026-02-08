import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Search, Filter, Plus, MoreVertical, Mail, Phone, MessageSquare } from 'lucide-react'
import Card from '@/components/Card'
import { ticketService, Ticket, TicketStatus, TicketPriority } from '@/services/tickets'
import clsx from 'clsx'

const statusConfig = {
  open: { label: 'Open', color: 'bg-yellow-100 text-yellow-700', bg: 'bg-yellow-50 border-yellow-200' },
  pending: { label: 'Pending', color: 'bg-blue-100 text-blue-700', bg: 'bg-blue-50 border-blue-200' },
  resolved: { label: 'Resolved', color: 'bg-green-100 text-green-700', bg: 'bg-green-50 border-green-200' },
  closed: { label: 'Closed', color: 'bg-gray-100 text-gray-700', bg: 'bg-gray-50 border-gray-200' },
}

const priorityConfig = {
  low: { label: 'Low', color: 'text-gray-500' },
  medium: { label: 'Medium', color: 'text-blue-500' },
  high: { label: 'High', color: 'text-orange-500' },
  urgent: { label: 'Urgent', color: 'text-red-500' },
}

const mockTickets: Ticket[] = [
  { id: 'TK-1001', subject: 'Unable to login to account', description: 'I cannot access my account after password reset.', status: 'open', priority: 'high', customerId: '1', tags: ['login', 'account'], messages: 5, createdAt: '2024-02-08 10:30', updatedAt: '2024-02-08 10:30' },
  { id: 'TK-1002', subject: 'Billing inquiry for March', description: 'I was charged twice for March subscription.', status: 'pending', priority: 'medium', customerId: '2', tags: ['billing', 'refund'], messages: 3, createdAt: '2024-02-08 09:15', updatedAt: '2024-02-08 11:00' },
  { id: 'TK-1003', subject: 'Feature request: Dark mode', description: 'Would love to have a dark mode option.', status: 'resolved', priority: 'low', customerId: '3', assigneeId: '2', tags: ['feature-request', 'ui'], messages: 8, createdAt: '2024-02-07 16:45', updatedAt: '2024-02-08 09:00' },
  { id: 'TK-1004', subject: 'App crashes on startup', description: 'The app crashes immediately after opening.', status: 'open', priority: 'urgent', customerId: '4', assigneeId: '1', tags: ['bug', 'crash'], messages: 2, createdAt: '2024-02-07 14:20', updatedAt: '2024-02-07 14:20' },
  { id: 'TK-1005', subject: 'Integration with Slack', description: 'How can I connect with Slack integration?', status: 'pending', priority: 'medium', customerId: '5', assigneeId: '3', tags: ['integration', 'slack'], messages: 4, createdAt: '2024-02-07 11:00', updatedAt: '2024-02-07 15:30' },
]

export default function Tickets() {
  const { t } = useTranslation()
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [tickets, setTickets] = useState<Ticket[]>([])
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const response = await ticketService.getList({
          status: statusFilter !== 'all' ? statusFilter as TicketStatus : undefined,
          search: searchTerm || undefined,
        })
        setTickets(response.data)
        if (response.data.length > 0 && !selectedTicket) {
          setSelectedTicket(response.data[0])
        }
      } catch (err) {
        console.error('Failed to fetch tickets:', err)
        // Use mock data on error
        setTickets(mockTickets)
        if (mockTickets.length > 0 && !selectedTicket) {
          setSelectedTicket(mockTickets[0])
        }
      } finally {
        setIsLoading(false)
      }
    }

    fetchTickets()
  }, [statusFilter])

  const filteredTickets = tickets.filter((ticket) => {
    const matchesSearch = ticket.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          ticket.id.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'all' || ticket.status === statusFilter
    return matchesSearch && matchesStatus
  })

  if (isLoading) {
    return (
      <div className="flex gap-6 h-[calc(100vh-8rem)]">
        <div className="w-1/2 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex gap-6 h-[calc(100vh-8rem)] animate-fadeIn">
      {/* Ticket List */}
      <div className="w-1/2 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{t('tickets.title')}</h1>
            <p className="text-gray-500 mt-1">{filteredTickets.length} tickets found</p>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors">
            <Plus size={18} />
            {t('tickets.newTicket')}
          </button>
        </div>

        {/* Filters */}
        <Card className="p-4 mb-4">
          <div className="flex items-center gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                id="ticket-search"
                name="search"
                placeholder="Search tickets..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
            <select
              id="status-filter"
              name="status"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="all">All Status</option>
              <option value="open">Open</option>
              <option value="pending">Pending</option>
              <option value="resolved">Resolved</option>
              <option value="closed">Closed</option>
            </select>
            <button className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50">
              <Filter size={20} className="text-gray-500" />
            </button>
          </div>
        </Card>

        {/* Ticket Items */}
        <div className="flex-1 overflow-y-auto space-y-2">
          {filteredTickets.map((ticket) => {
            const config = statusConfig[ticket.status] || statusConfig.open
            const priority = priorityConfig[ticket.priority] || priorityConfig.medium

            return (
              <Card
                key={ticket.id}
                className={clsx(
                  'p-4 cursor-pointer transition-all',
                  selectedTicket?.id === ticket.id ? 'ring-2 ring-primary-500' : 'hover:shadow-md'
                )}
                onClick={() => setSelectedTicket(ticket)}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-gray-500">{ticket.id}</span>
                    <span className={clsx('px-2 py-0.5 rounded-full text-xs font-medium', config.color)}>
                      {config.label}
                    </span>
                    <span className={clsx('text-xs', priority.color)}>
                      {priority.label}
                    </span>
                  </div>
                  <span className="text-xs text-gray-400">{ticket.createdAt}</span>
                </div>
                <h3 className="font-medium text-gray-900 mb-1">{ticket.subject}</h3>
                <p className="text-sm text-gray-500 line-clamp-1">{ticket.description}</p>
                <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <span className="flex items-center gap-1">
                      <MessageSquare size={14} />
                      {ticket.messages}
                    </span>
                  </div>
                </div>
              </Card>
            )
          })}
        </div>
      </div>

      {/* Ticket Detail */}
      <Card className="w-1/2 flex flex-col overflow-hidden">
        {selectedTicket ? (
          <>
            {/* Detail Header */}
            <div className="p-5 border-b border-gray-100">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-sm font-medium text-gray-500">{selectedTicket.id}</span>
                  <span className={clsx('px-2 py-0.5 rounded-full text-xs font-medium', statusConfig[selectedTicket.status]?.color)}>
                    {statusConfig[selectedTicket.status]?.label}
                  </span>
                </div>
                <button className="p-2 hover:bg-gray-100 rounded-lg">
                  <MoreVertical size={18} className="text-gray-400" />
                </button>
              </div>
              <h2 className="text-lg font-semibold text-gray-900">{selectedTicket.subject}</h2>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-5 space-y-4">
              {/* Original Message */}
              <div className="flex gap-3">
                <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-primary-600 text-sm font-medium">C</span>
                </div>
                <div className="flex-1">
                  <div className="bg-gray-50 rounded-xl p-4">
                    <p className="text-gray-700">{selectedTicket.description}</p>
                  </div>
                  <p className="text-xs text-gray-400 mt-1">{selectedTicket.createdAt}</p>
                </div>
              </div>

              {/* Replies */}
              {[1, 2].map((i) => (
                <div key={i} className="flex gap-3">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-green-600 text-sm font-medium">A</span>
                  </div>
                  <div className="flex-1">
                    <div className="bg-primary-50 rounded-xl p-4">
                      <p className="text-gray-700">
                        {i === 1
                          ? `Hi, thank you for reaching out. Let me look into this issue for you.`
                          : `I've checked your account and found the issue. Please allow me to resolve this for you.`}
                      </p>
                    </div>
                    <p className="text-xs text-gray-400 mt-1">Support Agent • {i === 1 ? '10:35' : '10:42'}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Reply Input */}
            <div className="p-4 border-t border-gray-100">
              <div className="flex items-center gap-2 mb-3">
                <button className="px-3 py-1.5 text-sm bg-primary-50 text-primary-600 rounded-lg font-medium">
                  Reply
                </button>
                <button className="px-3 py-1.5 text-sm text-gray-500 hover:bg-gray-100 rounded-lg">
                  Internal Note
                </button>
              </div>
              <textarea
                id="reply-message"
                name="message"
                placeholder="Type your reply..."
                rows={3}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none"
              />
              <div className="flex items-center justify-between mt-3">
                <button className="text-gray-400 hover:text-gray-600">
                  📎 Attach files
                </button>
                <button className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors">
                  Send Reply
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-400">
            Select a ticket to view details
          </div>
        )}
      </Card>
    </div>
  )
}
