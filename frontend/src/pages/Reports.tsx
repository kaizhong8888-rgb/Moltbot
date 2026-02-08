import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Download, Calendar, TrendingUp, TrendingDown } from 'lucide-react'
import Card from '@/components/Card'
import { reportService, SatisfactionData, ChannelData, AgentPerformanceData } from '@/services/reports'
import { LineChart, Line, AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts'

const satisfactionData = [
  { name: 'Very Satisfied', value: 45, color: '#22c55e' },
  { name: 'Satisfied', value: 30, color: '#0ea5e9' },
  { name: 'Neutral', value: 15, color: '#f59e0b' },
  { name: 'Dissatisfied', value: 8, color: '#f97316' },
  { name: 'Very Dissatisfied', value: 2, color: '#ef4444' },
]

const channelData = [
  { name: 'Email', value: 40 },
  { name: 'Chat', value: 35 },
  { name: 'Phone', value: 15 },
  { name: 'Social', value: 10 },
]

const ticketVolumeData = [
  { month: 'Jan', tickets: 245, resolved: 230 },
  { month: 'Feb', tickets: 312, resolved: 298 },
  { month: 'Mar', tickets: 287, resolved: 275 },
  { month: 'Apr', tickets: 356, resolved: 340 },
  { month: 'May', tickets: 398, resolved: 385 },
  { month: 'Jun', tickets: 425, resolved: 410 },
]

const responseTimeData = [
  { month: 'Jan', avgTime: 3.2 },
  { month: 'Feb', avgTime: 2.8 },
  { month: 'Mar', avgTime: 2.5 },
  { month: 'Apr', avgTime: 2.3 },
  { month: 'May', avgTime: 2.1 },
  { month: 'Jun', avgTime: 1.9 },
]

export default function Reports() {
  const { t } = useTranslation()
  const [satisfaction, setSatisfaction] = useState<SatisfactionData | null>(null)
  const [channels, setChannels] = useState<ChannelData | null>(null)
  const [agentPerf, setAgentPerf] = useState<AgentPerformanceData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [satData, chanData, perfData] = await Promise.all([
          reportService.getSatisfaction(),
          reportService.getChannels(),
          reportService.getAgentPerformance(),
        ])
        setSatisfaction(satData)
        setChannels(chanData)
        setAgentPerf(perfData)
      } catch (err) {
        console.error('Failed to fetch report data:', err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [])

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{t('reports.title')}</h1>
          <p className="text-gray-500 mt-1">Track performance and analyze trends</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            <Calendar size={18} className="text-gray-500" />
            Last 30 Days
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors">
            <Download size={18} />
            Export Report
          </button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">{t('reports.ticketVolume')}</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">2,023</p>
              <div className="flex items-center mt-1 text-sm">
                <TrendingUp size={14} className="text-green-500 mr-1" />
                <span className="text-green-600">+12.5%</span>
                <span className="text-gray-500 ml-1">vs last month</span>
              </div>
            </div>
          </div>
        </Card>

        <Card className="p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">{t('reports.responseTime')}</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">1.9h</p>
              <div className="flex items-center mt-1 text-sm">
                <TrendingDown size={14} className="text-green-500 mr-1" />
                <span className="text-green-600">-15%</span>
                <span className="text-gray-500 ml-1">improvement</span>
              </div>
            </div>
          </div>
        </Card>

        <Card className="p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">{t('reports.resolutionRate')}</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">94.2%</p>
              <div className="flex items-center mt-1 text-sm">
                <TrendingUp size={14} className="text-green-500 mr-1" />
                <span className="text-green-600">+2.3%</span>
                <span className="text-gray-500 ml-1">vs last month</span>
              </div>
            </div>
          </div>
        </Card>

        <Card className="p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">{t('reports.customerSatisfaction')}</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{satisfaction?.score || '4.5'}/5</p>
              <div className="flex items-center mt-1 text-sm">
                <TrendingUp size={14} className="text-green-500 mr-1" />
                <span className="text-green-600">+0.3</span>
                <span className="text-gray-500 ml-1">vs last month</span>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Ticket Volume Trend */}
        <Card className="p-5">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Ticket Volume & Resolution</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={ticketVolumeData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="month" stroke="#9ca3af" fontSize={12} />
                <YAxis stroke="#9ca3af" fontSize={12} />
                <Tooltip />
                <Legend />
                <Area type="monotone" dataKey="tickets" stackId="1" stroke="#0ea5e9" fill="#0ea5e9" fillOpacity={0.2} />
                <Area type="monotone" dataKey="resolved" stackId="2" stroke="#22c55e" fill="#22c55e" fillOpacity={0.2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Response Time Trend */}
        <Card className="p-5">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Average Response Time (Hours)</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={responseTimeData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="month" stroke="#9ca3af" fontSize={12} />
                <YAxis stroke="#9ca3af" fontSize={12} />
                <Tooltip />
                <Line type="monotone" dataKey="avgTime" stroke="#0ea5e9" strokeWidth={2} dot={{ fill: '#0ea5e9', strokeWidth: 2 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Customer Satisfaction */}
        <Card className="p-5">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Customer Satisfaction Distribution</h3>
          <div className="h-64 flex items-center">
            <ResponsiveContainer width="50%" height="100%">
              <PieChart>
                <Pie
                  data={satisfactionData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {satisfactionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex-1 space-y-2">
              {satisfactionData.map((item) => (
                <div key={item.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                    <span className="text-sm text-gray-600">{item.name}</span>
                  </div>
                  <span className="text-sm font-medium text-gray-900">{item.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </Card>

        {/* Channel Distribution */}
        <Card className="p-5">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Tickets by Channel</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={channelData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis type="number" stroke="#9ca3af" fontSize={12} />
                <YAxis type="category" dataKey="name" stroke="#9ca3af" fontSize={12} width={60} />
                <Tooltip />
                <Bar dataKey="value" fill="#0ea5e9" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>
    </div>
  )
}
