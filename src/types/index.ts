export interface User {
  id: number
  name: string
  email: string
  avatar_url?: string
  bio?: string
  created_at: string
}

export interface Article {
  id: number
  title: string
  content: string
  summary?: string
  banner_url: string | null
  category?: string
  tags?: string[]
  author_id: number
  author_name: string
  author_email: string
  author_avatar?: string
  published_at: string
  updated_at: string
}

export interface Comment {
  id: number
  content: string
  article_id: number
  user_id: number
  user_name: string
  user_avatar?: string
  created_at: string
}

export interface AuthContextType {
  user: User | null
  token: string | null
  login: (email: string, password: string) => Promise<void>
  register: (name: string, email: string, password: string) => Promise<void>
  logout: () => void
  updateUser: (user: User) => void
  isAuthenticated: boolean
}
