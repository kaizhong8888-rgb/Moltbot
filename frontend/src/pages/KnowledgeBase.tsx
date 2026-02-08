import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Search, Plus, BookOpen, Eye, Clock, MoreVertical, FileText, Folder, Edit, Trash2, X } from 'lucide-react'
import Card from '@/components/Card'
import { knowledgeBaseService, KnowledgeArticle, Category } from '@/services/knowledgeBase'
import clsx from 'clsx'

const mockArticles: KnowledgeArticle[] = [
  { id: '1', title: 'How to Reset Your Password', content: 'Step-by-step guide...', category: 'Account', views: 1523, authorId: '1', published: true, createdAt: '2024-01-15T10:00:00Z', updatedAt: '2024-02-08T10:00:00Z' },
  { id: '2', title: 'Understanding Your Invoice', content: 'A detailed explanation...', category: 'Billing', views: 982, authorId: '1', published: true, createdAt: '2024-01-20T14:00:00Z', updatedAt: '2024-02-07T09:00:00Z' },
  { id: '3', title: 'Shipping Methods and Delivery Times', content: 'Information about shipping...', category: 'Shipping', views: 2156, authorId: '2', published: true, createdAt: '2024-02-01T09:00:00Z', updatedAt: '2024-02-06T16:00:00Z' },
  { id: '4', title: 'Product Compatibility Guide', content: 'Check compatibility...', category: 'Products', views: 876, authorId: '2', published: false, createdAt: '2024-02-05T11:00:00Z', updatedAt: '2024-02-05T11:00:00Z' },
  { id: '5', title: 'Refund and Return Policy', content: 'Our refund policy...', category: 'Returns', views: 1234, authorId: '1', published: true, createdAt: '2024-01-10T09:00:00Z', updatedAt: '2024-02-04T14:00:00Z' },
]

const categories = [
  { name: 'Account', count: 12, icon: '👤' },
  { name: 'Billing', count: 8, icon: '💳' },
  { name: 'Shipping', count: 15, icon: '📦' },
  { name: 'Products', count: 24, icon: '📦' },
  { name: 'Returns', count: 6, icon: '↩️' },
  { name: 'Technical', count: 18, icon: '⚙️' },
]

export default function KnowledgeBase() {
  const { t } = useTranslation()
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [articles, setArticles] = useState<KnowledgeArticle[]>([])
  const [categoryList, setCategoryList] = useState<Category[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [showNewArticleModal, setShowNewArticleModal] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [articlesRes, categoriesRes] = await Promise.all([
          knowledgeBaseService.getList({
            category: selectedCategory !== 'all' ? selectedCategory : undefined,
            search: searchTerm || undefined,
          }),
          knowledgeBaseService.getCategories(),
        ])
        setArticles(articlesRes.data)
        setCategoryList(categoriesRes.data)
      } catch (err: unknown) {
        console.error('Failed to fetch data:', err)
        setArticles(mockArticles)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [selectedCategory, searchTerm])

  const filteredArticles = articles.filter((article) =>
    article.title.toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (isLoading) {
    return (
      <div className="flex gap-6 h-[calc(100vh-8rem)]">
        <div className="w-64 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex gap-6 h-[calc(100vh-8rem)] animate-fadeIn">
      {/* Sidebar - Categories */}
      <Card className="w-64 flex flex-col">
        <div className="p-4 border-b border-gray-100">
          <h3 className="font-medium text-gray-900">Categories</h3>
        </div>
        <div className="p-3 flex-1 overflow-y-auto">
          <button
            onClick={() => setSelectedCategory('all')}
            className={clsx(
              'w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors',
              selectedCategory === 'all' ? 'bg-primary-50 text-primary-600' : 'text-gray-600 hover:bg-gray-50'
            )}
          >
            <Folder size={16} />
            All Articles
            <span className="ml-auto text-gray-400">{articles.length}</span>
          </button>
          {categories.map((cat) => (
            <button
              key={cat.name}
              onClick={() => setSelectedCategory(cat.name)}
              className={clsx(
                'w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors',
                selectedCategory === cat.name ? 'bg-primary-50 text-primary-600' : 'text-gray-600 hover:bg-gray-50'
              )}
            >
              <span>{cat.icon}</span>
              {cat.name}
              <span className="ml-auto text-gray-400">{cat.count}</span>
            </button>
          ))}
        </div>
        <div className="p-4 border-t border-gray-100">
          <button className="w-full flex items-center justify-center gap-2 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors">
            <Plus size={16} />
            New Category
          </button>
        </div>
      </Card>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{t('kb.title')}</h1>
            <p className="text-gray-500 mt-1">{filteredArticles.length} articles</p>
          </div>
          <button
            className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
            onClick={() => setShowNewArticleModal(true)}
          >
            <Plus size={18} />
            {t('kb.newArticle')}
          </button>
        </div>

        {/* Search */}
        <Card className="p-4 mb-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search articles..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
        </Card>

        {/* Article List */}
        <div className="flex-1 overflow-y-auto">
          <div className="grid gap-3">
            {filteredArticles.map((article) => (
              <Card key={article.id} className="p-4 hover:shadow-md transition-shadow cursor-pointer">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <FileText size={20} className="text-primary-600" />
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">{article.title}</h3>
                      <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                        <span className="flex items-center gap-1">
                          <Folder size={14} />
                          {article.category}
                        </span>
                        <span className="flex items-center gap-1">
                          <Eye size={14} />
                          {article.views.toLocaleString()}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock size={14} />
                          {article.updatedAt.split('T')[0]}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={clsx(
                      'px-2 py-0.5 rounded-full text-xs font-medium',
                      article.published ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                    )}>
                      {article.published ? 'Published' : 'Draft'}
                    </span>
                    <button className="p-1.5 hover:bg-gray-100 rounded-lg text-gray-400">
                      <Edit size={16} />
                    </button>
                    <button className="p-1.5 hover:bg-gray-100 rounded-lg text-gray-400">
                      <MoreVertical size={16} />
                    </button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* New Article Modal */}
      {showNewArticleModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center animate-fadeIn">
          <div className="bg-white rounded-2xl p-6 w-full max-w-2xl mx-4 animate-fadeIn">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">New Article</h2>
              <button
                onClick={() => setShowNewArticleModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X size={20} className="text-gray-500" />
              </button>
            </div>
            <form onSubmit={(e) => { e.preventDefault(); setShowNewArticleModal(false); }}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                  <input
                    type="text"
                    placeholder="Article title"
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                  <select className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500">
                    <option value="Account">Account</option>
                    <option value="Billing">Billing</option>
                    <option value="Shipping">Shipping</option>
                    <option value="Products">Products</option>
                    <option value="Returns">Returns</option>
                    <option value="Technical">Technical</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Content</label>
                  <textarea
                    placeholder="Article content..."
                    rows={6}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none"
                    required
                  />
                </div>
                <div className="flex items-center gap-2">
                  <input type="checkbox" id="publish" className="rounded border-gray-300" />
                  <label htmlFor="publish" className="text-sm text-gray-700">Publish immediately</label>
                </div>
              </div>
              <div className="flex gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => setShowNewArticleModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-200 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                >
                  Create Article
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
