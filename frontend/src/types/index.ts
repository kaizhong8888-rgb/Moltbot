// User types from auth service
export interface User {
  id: string
  email: string
  name: string
  role: string
  createdAt?: string
  updatedAt?: string
}

// Language type
export type Language = 'en' | 'zh'

// Ticket types from tickets service
export type TicketStatus = 'open' | 'pending' | 'resolved' | 'closed'
export type TicketPriority = 'low' | 'medium' | 'high' | 'urgent'

export interface Ticket {
  id: string
  subject: string
  description: string
  status: TicketStatus
  priority: TicketPriority
  customerId: string
  assigneeId?: string
  tags: string[]
  messages: number
  createdAt: string
  updatedAt: string
}

// Contact types from contacts service
export interface Contact {
  id: string
  name: string
  email: string
  phone?: string
  company?: string
  totalTickets: number
  lastContact: string
  tags: string[]
  createdAt: string
  updatedAt: string
}

// AI Agent types from aiAgents service
export type AIAgentStatus = 'active' | 'inactive'

export interface AIAgent {
  id: string
  name: string
  description: string
  status: AIAgentStatus
  intents: string[]
  knowledgeBaseIds: string[]
  totalConversations: number
  model: string
  temperature: number
  createdAt: string
  updatedAt: string
}

// Knowledge Article types from knowledgeBase service
export interface KnowledgeArticle {
  id: string
  title: string
  content: string
  category: string
  views: number
  authorId: string
  published: boolean
  createdAt: string
  updatedAt: string
}

export interface Category {
  id: string
  name: string
  description?: string
  articleCount: number
  createdAt: string
  updatedAt: string
}
