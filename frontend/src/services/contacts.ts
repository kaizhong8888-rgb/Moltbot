import { request } from './api'

export interface Contact {
  id: string
  name: string
  email: string
  phone?: string
  company?: string
  notes?: string
  tags: string[]
  totalTickets: number
  lastContact: string
  createdAt: string
  updatedAt: string
}

export interface ContactListResponse {
  data: Contact[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

export interface CreateContactParams {
  name: string
  email: string
  phone?: string
  company?: string
  notes?: string
  tags?: string[]
}

export interface UpdateContactParams {
  name?: string
  email?: string
  phone?: string
  company?: string
  notes?: string
  tags?: string[]
}

export const contactService = {
  getList: (params?: {
    search?: string
    page?: number
    limit?: number
  }) => request.get<ContactListResponse>('/contacts', { params }),

  getById: (id: string) =>
    request.get<Contact>(`/contacts/${id}`),

  create: (data: CreateContactParams) =>
    request.post<Contact>('/contacts', data),

  update: (id: string, data: UpdateContactParams) =>
    request.patch<Contact>(`/contacts/${id}`, data),

  delete: (id: string) =>
    request.delete(`/contacts/${id}`),
}
