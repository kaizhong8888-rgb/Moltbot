import { request } from './api'

export interface GeneralSettings {
  language: string
  timezone: string
  dateFormat: string
  theme: string
}

export interface NotificationSettings {
  newTicket: boolean
  ticketUpdates: boolean
  customerMessages: boolean
  teamMentions: boolean
  weeklyReports: boolean
  emailNotifications: boolean
  pushNotifications: boolean
}

export interface Integration {
  connected: boolean
  [key: string]: unknown
}

export interface Integrations {
  slack: Integration
  zendesk: Integration
  salesforce: Integration
  openai: Integration
}

export interface TeamMember {
  id: string
  name: string
  email: string
  role: string
}

export interface TeamResponse {
  members: TeamMember[]
  roles: { id: string; name: string; permissions: string[] }[]
}

export interface InviteParams {
  email: string
  role: string
}

export interface BillingInfo {
  plan: string
  price: number
  billingCycle: string
  nextBillingDate: string
  paymentMethod: {
    type: string
    last4: string
    brand: string
  }
  usage: {
    teamMembers: { used: number; limit: string }
    storage: { used: number; limit: number; unit: string }
    apiCalls: { used: number; limit: number; period: string }
  }
}

export const settingsService = {
  getGeneral: () =>
    request.get<GeneralSettings>('/settings/general'),

  updateGeneral: (data: Partial<GeneralSettings>) =>
    request.patch<GeneralSettings>('/settings/general', data),

  getNotifications: () =>
    request.get<NotificationSettings>('/settings/notifications'),

  updateNotifications: (data: Partial<NotificationSettings>) =>
    request.patch<NotificationSettings>('/settings/notifications', data),

  getIntegrations: () =>
    request.get<Integrations>('/settings/integrations'),

  updateIntegration: (service: string, data: Partial<Integration>) =>
    request.patch<Integration>(`/settings/integrations/${service}`, data),

  getTeam: () =>
    request.get<TeamResponse>('/settings/team'),

  inviteMember: (data: InviteParams) =>
    request.post<{ id: string; email: string; role: string; status: string }>('/settings/team/invite', data),

  getBilling: () =>
    request.get<BillingInfo>('/settings/billing'),
}
