import { request } from './api'

export interface DashboardStats {
  totalTickets: number
  openTickets: number
  resolvedToday: number
  avgResponseTime: number
  ticketTrend: { date: string; count: number }[]
}

export interface TicketVolumeData {
  period: string
  data: { month: string; tickets: number; resolved: number }[]
}

export interface ResponseTimeData {
  data: { month: string; avgTime: number }[]
}

export interface ResolutionRateData {
  overall: number
  byPriority: {
    low: number
    medium: number
    high: number
    urgent: number
  }
}

export interface SatisfactionData {
  score: number
  distribution: { level: string; percentage: number }[]
  trend: { month: string; score: number }[]
}

export interface ChannelData {
  data: { channel: string; percentage: number; count: number }[]
}

export interface AgentPerformanceData {
  data: {
    agentId: string
    name: string
    ticketsResolved: number
    avgResponseTime: number
    satisfaction: number
  }[]
}

export const reportService = {
  getDashboard: () =>
    request.get<DashboardStats>('/reports/dashboard'),

  getTicketVolume: (params?: { period?: string }) =>
    request.get<TicketVolumeData>('/reports/tickets/volume', { params }),

  getResponseTime: () =>
    request.get<ResponseTimeData>('/reports/tickets/response-time'),

  getResolutionRate: () =>
    request.get<ResolutionRateData>('/reports/tickets/resolution-rate'),

  getSatisfaction: () =>
    request.get<SatisfactionData>('/reports/satisfaction'),

  getChannels: () =>
    request.get<ChannelData>('/reports/channels'),

  getAgentPerformance: () =>
    request.get<AgentPerformanceData>('/reports/agents/performance'),
}
