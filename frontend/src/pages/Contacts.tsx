import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Search, Plus, Mail, Phone, Calendar, MessageSquare, MoreVertical, X } from 'lucide-react'
import Card from '@/components/Card'
import { contactService, Contact } from '@/services/contacts'
import clsx from 'clsx'

const mockContacts: Contact[] = [
  { id: '1', name: 'John Smith', email: 'john.smith@example.com', phone: '+1 234-567-8901', company: 'Tech Corp', totalTickets: 12, lastContact: '2024-02-08', tags: ['VIP', 'Enterprise'], createdAt: '2023-06-15T10:00:00Z', updatedAt: '2024-02-08T10:00:00Z' },
  { id: '2', name: 'Sarah Johnson', email: 'sarah.j@example.com', phone: '+1 234-567-8902', company: 'Design Studio', totalTickets: 8, lastContact: '2024-02-07', tags: ['Regular'], createdAt: '2023-08-20T14:30:00Z', updatedAt: '2024-02-07T09:00:00Z' },
  { id: '3', name: 'Mike Chen', email: 'mike.chen@example.com', phone: '+1 234-567-8903', company: 'Startup Inc', totalTickets: 15, lastContact: '2024-02-06', tags: ['Enterprise'], createdAt: '2023-03-10T09:00:00Z', updatedAt: '2024-02-06T16:00:00Z' },
  { id: '4', name: 'Emily Davis', email: 'emily.d@example.com', phone: '+1 234-567-8904', company: 'Marketing Pro', totalTickets: 5, lastContact: '2024-02-05', tags: ['New'], createdAt: '2024-01-15T10:00:00Z', updatedAt: '2024-02-05T10:00:00Z' },
  { id: '5', name: 'Alex Wang', email: 'alex.w@example.com', phone: '+1 234-567-8905', company: 'E-com LLC', totalTickets: 20, lastContact: '2024-02-04', tags: ['VIP', 'Frequent'], createdAt: '2023-01-20T10:00:00Z', updatedAt: '2024-02-04T10:00:00Z' },
]

export default function Contacts() {
  const { t } = useTranslation()
  const [searchTerm, setSearchTerm] = useState('')
  const [contacts, setContacts] = useState<Contact[]>([])
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showNewContactModal, setShowNewContactModal] = useState(false)

  useEffect(() => {
    const fetchContacts = async () => {
      try {
        const response = await contactService.getList({
          search: searchTerm || undefined,
        })
        setContacts(response.data)
        if (response.data.length > 0 && !selectedContact) {
          setSelectedContact(response.data[0])
        }
      } catch (err) {
        console.error('Failed to fetch contacts:', err)
        setContacts(mockContacts)
        if (mockContacts.length > 0 && !selectedContact) {
          setSelectedContact(mockContacts[0])
        }
      } finally {
        setIsLoading(false)
      }
    }

    fetchContacts()
  }, [searchTerm])

  const filteredContacts = contacts.filter((contact) =>
    contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    contact.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    contact.company?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (isLoading) {
    return (
      <div className="flex gap-6 h-[calc(100vh-8rem)]">
        <div className="w-1/3 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex gap-6 h-[calc(100vh-8rem)] animate-fadeIn">
      {/* Contact List */}
      <div className="w-1/3 flex flex-col">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{t('contacts.title')}</h1>
            <p className="text-gray-500 mt-1">{filteredContacts.length} contacts</p>
          </div>
          <button
            className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
            onClick={() => setShowNewContactModal(true)}
          >
            <Plus size={18} />
            {t('contacts.newContact')}
          </button>
        </div>

        {/* Search */}
        <Card className="p-4 mb-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search contacts..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
        </Card>

        {/* Contact Items */}
        <div className="flex-1 overflow-y-auto space-y-2">
          {filteredContacts.map((contact) => (
            <Card
              key={contact.id}
              className={clsx(
                'p-4 cursor-pointer transition-all',
                selectedContact?.id === contact.id ? 'ring-2 ring-primary-500' : 'hover:shadow-md'
              )}
              onClick={() => setSelectedContact(contact)}
            >
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-primary-600 font-medium">{contact.name.charAt(0)}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium text-gray-900 truncate">{contact.name}</h3>
                    <span className="text-xs text-gray-400">{contact.totalTickets} tickets</span>
                  </div>
                  <p className="text-sm text-gray-500 truncate">{contact.company || 'No company'}</p>
                  <div className="flex items-center gap-2 mt-2">
                    {contact.tags.map((tag) => (
                      <span key={tag} className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full text-xs">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Contact Detail */}
      <Card className="w-2/3 flex flex-col overflow-hidden">
        {selectedContact ? (
          <>
            {/* Profile Header */}
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center">
                    <span className="text-primary-600 text-2xl font-bold">{selectedContact.name.charAt(0)}</span>
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900">{selectedContact.name}</h2>
                    <p className="text-gray-500">{selectedContact.company || 'No company'}</p>
                    <div className="flex items-center gap-2 mt-2">
                      {selectedContact.tags.map((tag) => (
                        <span key={tag} className="px-2 py-0.5 bg-primary-50 text-primary-600 rounded-full text-xs">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
                <button className="p-2 hover:bg-gray-100 rounded-lg">
                  <MoreVertical size={18} className="text-gray-400" />
                </button>
              </div>
            </div>

            {/* Contact Info */}
            <div className="p-6 border-b border-gray-100">
              <h3 className="text-sm font-medium text-gray-500 mb-4">Contact Information</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gray-50 rounded-lg flex items-center justify-center">
                    <Mail size={18} className="text-gray-500" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">{t('contacts.email')}</p>
                    <p className="text-sm text-gray-900">{selectedContact.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gray-50 rounded-lg flex items-center justify-center">
                    <Phone size={18} className="text-gray-500" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">{t('contacts.phone')}</p>
                    <p className="text-sm text-gray-900">{selectedContact.phone || 'N/A'}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gray-50 rounded-lg flex items-center justify-center">
                    <MessageSquare size={18} className="text-gray-500" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Total Tickets</p>
                    <p className="text-sm text-gray-900">{selectedContact.totalTickets}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gray-50 rounded-lg flex items-center justify-center">
                    <Calendar size={18} className="text-gray-500" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Last Contact</p>
                    <p className="text-sm text-gray-900">{selectedContact.lastContact}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="flex-1 overflow-y-auto p-6">
              <h3 className="text-sm font-medium text-gray-500 mb-4">Recent Activity</h3>
              <div className="space-y-4">
                {[
                  { action: 'Created ticket TK-1001', time: '2 hours ago', icon: '📝' },
                  { action: 'Updated ticket status', time: '3 hours ago', icon: '🔄' },
                  { action: 'Sent email response', time: '1 day ago', icon: '📧' },
                  { action: 'Resolved ticket TK-0998', time: '2 days ago', icon: '✅' },
                ].map((activity, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <span className="text-lg">{activity.icon}</span>
                    <div className="flex-1">
                      <p className="text-sm text-gray-700">{activity.action}</p>
                      <p className="text-xs text-gray-400">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="p-4 border-t border-gray-100 flex items-center gap-3">
              <button className="flex-1 flex items-center justify-center gap-2 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors">
                <MessageSquare size={16} />
                New Ticket
              </button>
              <button className="flex-1 flex items-center justify-center gap-2 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                <Mail size={16} />
                Send Email
              </button>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-400">
            Select a contact to view details
          </div>
        )}
      </Card>

      {/* New Contact Modal */}
      {showNewContactModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center animate-fadeIn">
          <div className="bg-white rounded-2xl p-6 w-full max-w-lg mx-4 animate-fadeIn">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">New Contact</h2>
              <button
                onClick={() => setShowNewContactModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X size={20} className="text-gray-500" />
              </button>
            </div>
            <form onSubmit={(e) => { e.preventDefault(); setShowNewContactModal(false); }}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                  <input
                    type="text"
                    placeholder="Full name"
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input
                    type="email"
                    placeholder="Email address"
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                  <input
                    type="tel"
                    placeholder="Phone number"
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Company</label>
                  <input
                    type="text"
                    placeholder="Company name"
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>
              </div>
              <div className="flex gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => setShowNewContactModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-200 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                >
                  Create Contact
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
