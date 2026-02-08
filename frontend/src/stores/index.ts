import { create } from 'zustand'
import { User, Language, Contact, Ticket, AIAgent, KnowledgeArticle } from '@/types'

interface AppState {
  // User
  currentUser: User | null
  setCurrentUser: (user: User | null) => void

  // Language
  language: Language
  setLanguage: (lang: Language) => void

  // Sidebar
  sidebarCollapsed: boolean
  toggleSidebar: () => void

  // Tickets
  tickets: Ticket[]
  setTickets: (tickets: Ticket[]) => void
  addTicket: (ticket: Ticket) => void
  updateTicket: (id: string, updates: Partial<Ticket>) => void

  // Contacts
  contacts: Contact[]
  setContacts: (contacts: Contact[]) => void
  addContact: (contact: Contact) => void
  updateContact: (id: string, updates: Partial<Contact>) => void

  // AI Agents
  aiAgents: AIAgent[]
  setAIAgents: (agents: AIAgent[]) => void
  addAIAgent: (agent: AIAgent) => void
  updateAIAgent: (id: string, updates: Partial<AIAgent>) => void

  // Knowledge Base
  articles: KnowledgeArticle[]
  setArticles: (articles: KnowledgeArticle[]) => void
  addArticle: (article: KnowledgeArticle) => void
}

export const useAppStore = create<AppState>((set) => ({
  // User
  currentUser: {
    id: '1',
    name: 'Admin User',
    email: 'admin@example.com',
    role: 'admin',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  setCurrentUser: (user) => set({ currentUser: user }),

  // Language
  language: 'zh',
  setLanguage: (lang) => set({ language: lang }),

  // Sidebar
  sidebarCollapsed: false,
  toggleSidebar: () => set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),

  // Tickets
  tickets: [],
  setTickets: (tickets) => set({ tickets }),
  addTicket: (ticket) => set((state) => ({ tickets: [...state.tickets, ticket] })),
  updateTicket: (id, updates) => set((state) => ({
    tickets: state.tickets.map((t) => t.id === id ? { ...t, ...updates } : t)
  })),

  // Contacts
  contacts: [],
  setContacts: (contacts) => set({ contacts }),
  addContact: (contact) => set((state) => ({ contacts: [...state.contacts, contact] })),
  updateContact: (id, updates) => set((state) => ({
    contacts: state.contacts.map((c) => c.id === id ? { ...c, ...updates } : c)
  })),

  // AI Agents
  aiAgents: [],
  setAIAgents: (aiAgents) => set({ aiAgents }),
  addAIAgent: (agent) => set((state) => ({ aiAgents: [...state.aiAgents, agent] })),
  updateAIAgent: (id, updates) => set((state) => ({
    aiAgents: state.aiAgents.map((a) => a.id === id ? { ...a, ...updates } : a)
  })),

  // Knowledge Base
  articles: [],
  setArticles: (articles) => set({ articles }),
  addArticle: (article) => set((state) => ({ articles: [...state.articles, article] })),
}))
