import { useEffect, useState, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { Search, Plus, Settings, MoreVertical, MessageSquare, BookOpen, Play, Pause, Trash2, Edit, Send, X, Bot, User } from 'lucide-react'
import Card from '@/components/Card'
import { aiAgentService, type AIAgent as AIAgentType } from '@/services/aiAgents'
import clsx from 'clsx'

const mockAgents: AIAgentType[] = [
  { id: '1', name: 'Customer Support Bot', description: 'Handles general customer inquiries and basic support', status: 'active', intents: [], knowledgeBaseIds: [], totalConversations: 1234, model: 'gpt-4', temperature: 0.7, createdAt: '2024-01-15T10:00:00Z', updatedAt: '2024-02-08T10:00:00Z' },
  { id: '2', name: 'Technical Support AI', description: 'Provides technical assistance for product issues', status: 'active', intents: [], knowledgeBaseIds: [], totalConversations: 567, model: 'gpt-4', temperature: 0.5, createdAt: '2024-01-20T14:00:00Z', updatedAt: '2024-02-07T16:00:00Z' },
  { id: '3', name: 'Sales Assistant', description: 'Helps with product recommendations and sales inquiries', status: 'inactive', intents: [], knowledgeBaseIds: [], totalConversations: 890, model: 'gpt-4', temperature: 0.8, createdAt: '2024-02-01T09:00:00Z', updatedAt: '2024-02-05T11:00:00Z' },
  { id: '4', name: 'Billing Specialist', description: 'Handles billing and payment related queries', status: 'active', intents: [], knowledgeBaseIds: [], totalConversations: 345, model: 'gpt-4', temperature: 0.6, createdAt: '2024-02-10T10:00:00Z', updatedAt: '2024-02-10T10:00:00Z' },
]

// Mock responses for test chat
const mockResponses: Record<string, string[]> = {
  'Customer Support Bot': [
    "Hello! I'm the Customer Support Bot. How can I assist you today?",
    "I understand your concern. Let me help you with that.",
    "You can track your order by logging into your account and visiting the 'Orders' section.",
    "For refunds, please visit our Returns page or contact our support team.",
    "Our customer service hours are 9 AM to 6 PM, Monday through Friday.",
  ],
  'Technical Support AI': [
    "Hi! I'm here to help with technical issues.",
    "Could you please describe the problem you're experiencing?",
    "Have you tried restarting the application?",
    "I recommend checking your internet connection and browser settings.",
    "For immediate assistance, please contact our technical support hotline.",
  ],
  'Sales Assistant': [
    "Hello! I'm your Sales Assistant. How can I help you today?",
    "We have some great products that might interest you!",
    "Our current promotions include 20% off on all premium plans.",
    "Would you like me to show you our product catalog?",
    "Feel free to ask any questions about our services.",
  ],
  'Billing Specialist': [
    "Hello! I'm here to help with billing inquiries.",
    "I can assist you with payment methods, invoices, and refunds.",
    "Your account is in good standing.",
    "For payment issues, please verify your billing information.",
    "Would you like a detailed breakdown of your recent charges?",
  ],
}

interface ChatMessage {
  id: string
  role: 'user' | 'bot'
  content: string
  timestamp: Date
}

export default function AIAgent() {
  const { t } = useTranslation()
  const [searchTerm, setSearchTerm] = useState('')
  const [agents, setAgents] = useState<AIAgentType[]>([])
  const [selectedAgent, setSelectedAgent] = useState<AIAgentType | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [showChat, setShowChat] = useState(false)
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [inputMessage, setInputMessage] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const fetchAgents = async () => {
      try {
        const response = await aiAgentService.getList()
        setAgents(response.data)
        if (response.data.length > 0 && !selectedAgent) {
          setSelectedAgent(response.data[0])
        }
      } catch (err) {
        console.error('Failed to fetch agents:', err)
        setAgents(mockAgents)
        if (mockAgents.length > 0 && !selectedAgent) {
          setSelectedAgent(mockAgents[0])
        }
      } finally {
        setIsLoading(false)
      }
    }

    fetchAgents()
  }, [])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const filteredAgents = agents.filter((agent) =>
    agent.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    agent.description.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleTestChat = () => {
    setShowChat(true)
    // Initialize with welcome message
    if (selectedAgent) {
      setMessages([
        {
          id: Date.now().toString(),
          role: 'bot',
          content: `Hello! I'm ${selectedAgent.name}. ${selectedAgent.description} How can I assist you today?`,
          timestamp: new Date(),
        },
      ])
    }
  }

  const handleSendMessage = () => {
    if (!inputMessage.trim() || !selectedAgent) return

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: inputMessage,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInputMessage('')
    setIsTyping(true)

    // Simulate bot response
    setTimeout(() => {
      const responses = mockResponses[selectedAgent.name] || ['I apologize, but I did not understand your message. Could you please rephrase?']
      const randomResponse = responses[Math.floor(Math.random() * responses.length)]

      const botMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'bot',
        content: randomResponse,
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, botMessage])
      setIsTyping(false)
    }, 1000 + Math.random() * 1000)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

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
      {/* Agent List */}
      <div className="w-1/3 flex flex-col">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{t('aiAgent.title')}</h1>
            <p className="text-gray-500 mt-1">{filteredAgents.length} AI Agents</p>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors">
            <Plus size={18} />
            {t('aiAgent.newAgent')}
          </button>
        </div>

        {/* Search */}
        <Card className="p-4 mb-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              id="agent-search"
              name="search"
              placeholder="Search agents..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
        </Card>

        {/* Agent Items */}
        <div className="flex-1 overflow-y-auto space-y-2">
          {filteredAgents.map((agent) => (
            <Card
              key={agent.id}
              className={clsx(
                'p-4 cursor-pointer transition-all',
                selectedAgent?.id === agent.id ? 'ring-2 ring-primary-500' : 'hover:shadow-md'
              )}
              onClick={() => setSelectedAgent(agent)}
            >
              <div className="flex items-start gap-3">
                <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center text-2xl flex-shrink-0">
                  🤖
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium text-gray-900 truncate">{agent.name}</h3>
                    <span className={clsx(
                      'px-2 py-0.5 rounded-full text-xs font-medium',
                      agent.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
                    )}>
                      {agent.status === 'active' ? t('aiAgent.active') : t('aiAgent.inactive')}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500 line-clamp-1 mt-1">{agent.description}</p>
                  <div className="flex items-center gap-4 mt-2 text-sm text-gray-400">
                    <span className="flex items-center gap-1">
                      <MessageSquare size={14} />
                      {agent.totalConversations}
                    </span>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Agent Detail */}
      <Card className="w-2/3 flex flex-col overflow-hidden relative">
        {selectedAgent ? (
          <>
            {/* Detail Header */}
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-gray-100 rounded-xl flex items-center justify-center text-3xl">
                    🤖
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900">{selectedAgent.name}</h2>
                    <p className="text-gray-500">{selectedAgent.description}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <span className={clsx(
                        'px-2 py-0.5 rounded-full text-xs font-medium',
                        selectedAgent.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
                      )}>
                        {selectedAgent.status === 'active' ? t('aiAgent.active') : t('aiAgent.inactive')}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button className="p-2 hover:bg-gray-100 rounded-lg text-gray-500">
                    <Edit size={18} />
                  </button>
                  <button className="p-2 hover:bg-gray-100 rounded-lg text-gray-500">
                    <Settings size={18} />
                  </button>
                  <button className="p-2 hover:bg-gray-100 rounded-lg text-gray-500">
                    <MoreVertical size={18} />
                  </button>
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="p-6 border-b border-gray-100">
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-gray-50 rounded-xl p-4">
                  <p className="text-sm text-gray-500">{t('aiAgent.conversations')}</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{selectedAgent.totalConversations.toLocaleString()}</p>
                </div>
                <div className="bg-gray-50 rounded-xl p-4">
                  <p className="text-sm text-gray-500">Model</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{selectedAgent.model}</p>
                </div>
                <div className="bg-gray-50 rounded-xl p-4">
                  <p className="text-sm text-gray-500">Temperature</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{selectedAgent.temperature}</p>
                </div>
              </div>
            </div>

            {/* Configuration */}
            <div className="flex-1 overflow-y-auto p-6">
              {/* Intents */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-medium text-gray-500">{t('aiAgent.intents')}</h3>
                  <button className="text-sm text-primary-600 hover:text-primary-700 font-medium">+ Add Intent</button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {['Order Status', 'Refund Policy', 'Shipping Info', 'Product Info'].map((intent) => (
                    <span key={intent} className="px-3 py-1.5 bg-primary-50 text-primary-700 rounded-lg text-sm">
                      {intent}
                    </span>
                  ))}
                </div>
              </div>

              {/* Knowledge Bases */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-medium text-gray-500">{t('aiAgent.knowledgeBases')}</h3>
                  <button className="text-sm text-primary-600 hover:text-primary-700 font-medium">+ Link KB</button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {['General FAQ', 'Products', 'Billing'].map((kb) => (
                    <span key={kb} className="px-3 py-1.5 bg-green-50 text-green-700 rounded-lg text-sm flex items-center gap-2">
                      <BookOpen size={14} />
                      {kb}
                    </span>
                  ))}
                </div>
              </div>

              {/* Conversation Preview */}
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-3">Conversation Preview</h3>
                <div className="bg-gray-50 rounded-xl p-4 space-y-3">
                  <div className="flex gap-3">
                    <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center text-sm">👤</div>
                    <div className="flex-1 bg-white rounded-lg p-3 shadow-sm">
                      <p className="text-sm text-gray-700">How can I track my order?</p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center text-sm">🤖</div>
                    <div className="flex-1 bg-primary-50 rounded-lg p-3 shadow-sm">
                      <p className="text-sm text-gray-700">
                        You can track your order by logging into your account and visiting the "Orders" section.
                        Alternatively, you can use the tracking number sent to your email.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="p-4 border-t border-gray-100 flex items-center gap-3">
              <button
                onClick={handleTestChat}
                className="flex-1 flex items-center justify-center gap-2 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
              >
                <Play size={16} />
                Test Chat
              </button>
              <button className="flex-1 flex items-center justify-center gap-2 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                {selectedAgent.status === 'active' ? (
                  <>
                    <Pause size={16} />
                    Pause Agent
                  </>
                ) : (
                  <>
                    <Play size={16} />
                    Activate Agent
                  </>
                )}
              </button>
              <button className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                <Trash2 size={18} />
              </button>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-400">
            Select an agent to view details
          </div>
        )}

        {/* Chat Modal */}
        {showChat && selectedAgent && (
          <div className="absolute inset-0 bg-white z-50 flex flex-col animate-fadeIn">
            {/* Chat Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                  <Bot size={20} className="text-primary-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{selectedAgent.name}</h3>
                  <p className="text-sm text-green-600 flex items-center gap-1">
                    <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                    Online
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowChat(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X size={20} className="text-gray-500" />
              </button>
            </div>

            {/* Chat Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={clsx(
                    'flex gap-3',
                    message.role === 'user' ? 'flex-row-reverse' : ''
                  )}
                >
                  <div className={clsx(
                    'w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0',
                    message.role === 'user' ? 'bg-gray-200' : 'bg-primary-100'
                  )}>
                    {message.role === 'user' ? (
                      <User size={16} className="text-gray-600" />
                    ) : (
                      <Bot size={16} className="text-primary-600" />
                    )}
                  </div>
                  <div className={clsx(
                    'max-w-[70%] rounded-2xl px-4 py-2',
                    message.role === 'user'
                      ? 'bg-primary-600 text-white rounded-tr-sm'
                      : 'bg-gray-100 text-gray-700 rounded-tl-sm'
                  )}>
                    <p className="text-sm">{message.content}</p>
                    <p className={clsx(
                      'text-xs mt-1',
                      message.role === 'user' ? 'text-primary-200' : 'text-gray-400'
                    )}>
                      {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>
              ))}
              {isTyping && (
                <div className="flex gap-3">
                  <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                    <Bot size={16} className="text-primary-600" />
                  </div>
                  <div className="bg-gray-100 rounded-2xl rounded-tl-sm px-4 py-3">
                    <div className="flex gap-1">
                      <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                      <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                      <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Chat Input */}
            <div className="p-4 border-t border-gray-100">
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  id="chat-input"
                  name="message"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Type your message..."
                  className="flex-1 px-4 py-2 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
                <button
                  onClick={handleSendMessage}
                  disabled={!inputMessage.trim() || isTyping}
                  className={clsx(
                    'p-2 rounded-full transition-colors',
                    inputMessage.trim() && !isTyping
                      ? 'bg-primary-600 text-white hover:bg-primary-700'
                      : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  )}
                >
                  <Send size={20} />
                </button>
              </div>
            </div>
          </div>
        )}
      </Card>
    </div>
  )
}
