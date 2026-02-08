import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'

const resources = {
  en: {
    translation: {
      // Navigation
      'nav.dashboard': 'Dashboard',
      'nav.tickets': 'Tickets',
      'nav.contacts': 'Contacts',
      'nav.aiAgent': 'AI Agent',
      'nav.knowledgeBase': 'Knowledge Base',
      'nav.reports': 'Reports',
      'nav.settings': 'Settings',

      // Common
      'common.search': 'Search',
      'common.help': 'Help',
      'common.language': 'Language',
      'common.profile': 'Profile',
      'common.logout': 'Logout',
      'common.save': 'Save',
      'common.cancel': 'Cancel',
      'common.delete': 'Delete',
      'common.edit': 'Edit',
      'common.add': 'Add',
      'common.submit': 'Submit',

      // Dashboard
      'dashboard.title': 'Dashboard',
      'dashboard.totalTickets': 'Total Tickets',
      'dashboard.openTickets': 'Open Tickets',
      'dashboard.resolvedToday': 'Resolved Today',
      'dashboard.avgResponseTime': 'Avg Response Time',
      'dashboard.recentTickets': 'Recent Tickets',
      'dashboard.ticketTrend': 'Ticket Trend',
      'dashboard.quickActions': 'Quick Actions',

      // Tickets
      'tickets.title': 'Ticket Management',
      'tickets.newTicket': 'New Ticket',
      'tickets.ticketId': 'Ticket ID',
      'tickets.subject': 'Subject',
      'tickets.status': 'Status',
      'tickets.priority': 'Priority',
      'tickets.customer': 'Customer',
      'tickets.assignee': 'Assignee',
      'tickets.createdAt': 'Created At',
      'tickets.updatedAt': 'Updated At',

      // Contacts
      'contacts.title': 'Contact Management',
      'contacts.newContact': 'New Contact',
      'contacts.name': 'Name',
      'contacts.email': 'Email',
      'contacts.phone': 'Phone',
      'contacts.company': 'Company',
      'contacts.notes': 'Notes',

      // AI Agent
      'aiAgent.title': 'AI Agent Management',
      'aiAgent.newAgent': 'New AI Agent',
      'aiAgent.agentName': 'Agent Name',
      'aiAgent.description': 'Description',
      'aiAgent.intents': 'Intents',
      'aiAgent.knowledgeBases': 'Knowledge Bases',
      'aiAgent.status': 'Status',
      'aiAgent.active': 'Active',
      'aiAgent.inactive': 'Inactive',
      'aiAgent.conversations': 'Conversations',

      // Knowledge Base
      'kb.title': 'Knowledge Base',
      'kb.newArticle': 'New Article',
      'kb.articleTitle': 'Article Title',
      'kb.category': 'Category',
      'kb.content': 'Content',
      'kb.views': 'Views',

      // Reports
      'reports.title': 'Reports & Analytics',
      'reports.ticketVolume': 'Ticket Volume',
      'reports.responseTime': 'Response Time',
      'reports.resolutionRate': 'Resolution Rate',
      'reports.customerSatisfaction': 'Customer Satisfaction',

      // Settings
      'settings.title': 'Settings',
      'settings.general': 'General',
      'settings.notifications': 'Notifications',
      'settings.integrations': 'Integrations',
      'settings.team': 'Team',
      'settings.billing': 'Billing',

      // Status
      'status.open': 'Open',
      'status.pending': 'Pending',
      'status.resolved': 'Resolved',
      'status.closed': 'Closed',

      // Priority
      'priority.low': 'Low',
      'priority.medium': 'Medium',
      'priority.high': 'High',
      'priority.urgent': 'Urgent',
    }
  },
  zh: {
    translation: {
      // Navigation
      'nav.dashboard': '仪表盘',
      'nav.tickets': '工单管理',
      'nav.contacts': '客户管理',
      'nav.aiAgent': 'AI 自动化',
      'nav.knowledgeBase': '知识库',
      'nav.reports': '报表分析',
      'nav.settings': '系统设置',

      // Common
      'common.search': '搜索',
      'common.help': '帮助',
      'common.language': '语言',
      'common.profile': '个人资料',
      'common.logout': '退出登录',
      'common.save': '保存',
      'common.cancel': '取消',
      'common.delete': '删除',
      'common.edit': '编辑',
      'common.add': '添加',
      'common.submit': '提交',

      // Dashboard
      'dashboard.title': '仪表盘',
      'dashboard.totalTickets': '工单总数',
      'dashboard.openTickets': '待处理工单',
      'dashboard.resolvedToday': '今日已解决',
      'dashboard.avgResponseTime': '平均响应时间',
      'dashboard.recentTickets': '最近工单',
      'dashboard.ticketTrend': '工单趋势',
      'dashboard.quickActions': '快捷操作',

      // Tickets
      'tickets.title': '工单管理',
      'tickets.newTicket': '新建工单',
      'tickets.ticketId': '工单编号',
      'tickets.subject': '主题',
      'tickets.status': '状态',
      'tickets.priority': '优先级',
      'tickets.customer': '客户',
      'tickets.assignee': '负责人',
      'tickets.createdAt': '创建时间',
      'tickets.updatedAt': '更新时间',

      // Contacts
      'contacts.title': '客户管理',
      'contacts.newContact': '新建客户',
      'contacts.name': '姓名',
      'contacts.email': '邮箱',
      'contacts.phone': '电话',
      'contacts.company': '公司',
      'contacts.notes': '备注',

      // AI Agent
      'aiAgent.title': 'AI 自动化管理',
      'aiAgent.newAgent': '新建 AI 代理',
      'aiAgent.agentName': '代理名称',
      'aiAgent.description': '描述',
      'aiAgent.intents': '意图',
      'aiAgent.knowledgeBases': '知识库',
      'aiAgent.status': '状态',
      'aiAgent.active': '已启用',
      'aiAgent.inactive': '已禁用',
      'aiAgent.conversations': '对话数',

      // Knowledge Base
      'kb.title': '知识库',
      'kb.newArticle': '新建文章',
      'kb.articleTitle': '文章标题',
      'kb.category': '分类',
      'kb.content': '内容',
      'kb.views': '浏览量',

      // Reports
      'reports.title': '报表分析',
      'reports.ticketVolume': '工单量',
      'reports.responseTime': '响应时间',
      'reports.resolutionRate': '解决率',
      'reports.customerSatisfaction': '客户满意度',

      // Settings
      'settings.title': '系统设置',
      'settings.general': '通用',
      'settings.notifications': '通知',
      'settings.integrations': '集成',
      'settings.team': '团队',
      'settings.billing': '账单',

      // Status
      'status.open': '待处理',
      'status.pending': '处理中',
      'status.resolved': '已解决',
      'status.closed': '已关闭',

      // Priority
      'priority.low': '低',
      'priority.medium': '中',
      'priority.high': '高',
      'priority.urgent': '紧急',
    }
  }
}

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'zh',
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
  })

export default i18n
