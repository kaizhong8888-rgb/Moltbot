import { request } from './api'

export type AIAgentStatus = 'active' | 'inactive'

export interface AIAgentIntent {
  id: string
  name: string
  examples: string[]
  response: string
}

export interface AIAgent {
  id: string
  name: string
  description: string
  status: AIAgentStatus
  intents: AIAgentIntent[]
  knowledgeBaseIds: string[]
  totalConversations: number
  model: string
  temperature: number
  createdAt: string
  updatedAt: string
}

export interface AIAgentListResponse {
  data: AIAgent[]
}

export interface CreateAIAgentParams {
  name: string
  description: string
  status?: AIAgentStatus
  intents?: AIAgentIntent[]
  knowledgeBaseIds?: string[]
  model?: string
  temperature?: number
}

export interface UpdateAIAgentParams {
  name?: string
  description?: string
  status?: AIAgentStatus
  intents?: AIAgentIntent[]
  knowledgeBaseIds?: string[]
  model?: string
  temperature?: number
}

export interface ChatParams {
  message: string
  conversationHistory?: { role: string; content: string }[]
}

export interface ChatResponse {
  response: string
  agent: string
  timestamp: string
}

export const aiAgentService = {
  getList: (params?: { status?: AIAgentStatus }) =>
    request.get<AIAgentListResponse>('/ai-agents', { params }),

  getById: (id: string) =>
    request.get<AIAgent>(`/ai-agents/${id}`),

  create: (data: CreateAIAgentParams) =>
    request.post<AIAgent>('/ai-agents', data),

  update: (id: string, data: UpdateAIAgentParams) =>
    request.patch<AIAgent>(`/ai-agents/${id}`, data),

  delete: (id: string) =>
    request.delete(`/ai-agents/${id}`),

  chat: (id: string, data: ChatParams) =>
    request.post<ChatResponse>(`/ai-agents/${id}/chat`, data),
}
