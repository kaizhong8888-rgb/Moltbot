import { request } from './api'

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

export interface TicketListResponse {
  data: Ticket[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

export interface CreateTicketParams {
  subject: string
  description: string
  priority?: TicketPriority
  customerId?: string
  tags?: string[]
}

export interface UpdateTicketParams {
  status?: TicketStatus
  priority?: TicketPriority
  assigneeId?: string
  tags?: string[]
}

export interface AddMessageParams {
  content: string
  senderId: string
  isInternal?: boolean
}

export const ticketService = {
  getList: (params?: {
    status?: TicketStatus
    priority?: TicketPriority
    search?: string
    page?: number
    limit?: number
  }) => request.get<TicketListResponse>('/tickets', { params }),

  getById: (id: string) =>
    request.get<Ticket>(`/tickets/${id}`),

  create: (data: CreateTicketParams) =>
    request.post<Ticket>('/tickets', data),

  update: (id: string, data: UpdateTicketParams) =>
    request.patch<Ticket>(`/tickets/${id}`, data),

  addMessage: (id: string, data: AddMessageParams) =>
    request.post<{ message: string; messages: number }>(`/tickets/${id}/messages`, data),
}
