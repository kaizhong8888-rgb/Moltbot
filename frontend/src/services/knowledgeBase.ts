import { request } from './api'

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

export interface ArticleListResponse {
  data: KnowledgeArticle[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

export interface Category {
  name: string
  count: number
}

export interface CategoryResponse {
  data: Category[]
}

export interface CreateArticleParams {
  title: string
  content: string
  category: string
  published?: boolean
}

export interface UpdateArticleParams {
  title?: string
  content?: string
  category?: string
  published?: boolean
}

export const knowledgeBaseService = {
  getList: (params?: {
    category?: string
    search?: string
    published?: boolean
    page?: number
    limit?: number
  }) => request.get<ArticleListResponse>('/knowledge-base', { params }),

  getCategories: () =>
    request.get<CategoryResponse>('/knowledge-base/categories'),

  getById: (id: string) =>
    request.get<KnowledgeArticle>(`/knowledge-base/${id}`),

  create: (data: CreateArticleParams) =>
    request.post<KnowledgeArticle>('/knowledge-base', data),

  update: (id: string, data: UpdateArticleParams) =>
    request.patch<KnowledgeArticle>(`/knowledge-base/${id}`, data),

  delete: (id: string) =>
    request.delete(`/knowledge-base/${id}`),
}
