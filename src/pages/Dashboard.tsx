import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { FileText, MessageSquare, Heart, TrendingUp, Settings, Plus, Pencil, Trash2 } from 'lucide-react'
import { Article } from '../types'
import { useAuth } from '../contexts/AuthContext'
import api from '../services/api'
import './Dashboard.css'

const PLACEHOLDER = 'https://placehold.co/100x80/1a1a1a/888?text=...'

function formatDate(date: string) {
  return new Date(date).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' })
}

export default function Dashboard() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [articles, setArticles] = useState<Article[]>([])
  const [loading, setLoading] = useState(true)
  const [deleteId, setDeleteId] = useState<number | null>(null)
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    api.get('/articles').then(({ data }) => {
      const mine = data.articles.filter((a: Article) => a.author_id === user?.id)
      setArticles(mine)
    }).finally(() => setLoading(false))
  }, [user])

  const handleDelete = async () => {
    if (!deleteId) return
    setDeleting(true)
    try {
      await api.delete(`/articles/${deleteId}`)
      setArticles(prev => prev.filter(a => a.id !== deleteId))
      setDeleteId(null)
    } finally {
      setDeleting(false)
    }
  }

  const stats = {
    total: articles.length,
    engagement: articles.length * 2,
    likes: articles.length * 10,
    avgTime: articles.length > 0 ? `${Math.ceil(articles.reduce((acc, a) => acc + a.content.split(' ').length, 0) / articles.length / 200)}min` : '0min',
  }

  return (
    <div className="dashboard">
      <div className="dashboard__container container">
        {/* Header */}
        <div className="dashboard__header">
          <div>
            <h1>Dashboard</h1>
            <p>Bem-vindo de volta, {user?.name}!</p>
          </div>
          <div className="dashboard__header-actions">
            <Link to="/settings" className="dashboard__btn-outline">
              <Settings size={15} /> Configurações
            </Link>
            <Link to="/articles/new" className="dashboard__btn-accent">
              <Plus size={15} /> Novo Artigo
            </Link>
          </div>
        </div>

        {/* Stats */}
        <div className="dashboard__stats">
          <div className="dashboard__stat">
            <div className="dashboard__stat-header">
              <span>Total de Artigos</span>
              <FileText size={16} />
            </div>
            <span className="dashboard__stat-value">{stats.total}</span>
          </div>
          <div className="dashboard__stat">
            <div className="dashboard__stat-header">
              <span>Engajamento</span>
              <MessageSquare size={16} />
            </div>
            <span className="dashboard__stat-value">{stats.engagement}</span>
          </div>
          <div className="dashboard__stat">
            <div className="dashboard__stat-header">
              <span>Curtidas</span>
              <Heart size={16} />
            </div>
            <span className="dashboard__stat-value">{stats.likes}</span>
          </div>
          <div className="dashboard__stat">
            <div className="dashboard__stat-header">
              <span>Tempo médio de leitura</span>
              <TrendingUp size={16} />
            </div>
            <span className="dashboard__stat-value">{stats.avgTime}</span>
          </div>
        </div>

        {/* Content */}
        <div className="dashboard__body">
          {/* My Articles */}
          <div className="dashboard__articles">
            <h2>Meus Artigos</h2>
            {loading ? (
              <div className="dashboard__articles-skeleton">
                {[...Array(3)].map((_, i) => <div key={i} className="dashboard__article-skeleton" />)}
              </div>
            ) : articles.length === 0 ? (
              <div className="dashboard__empty">
                <p>Você ainda não publicou nenhum artigo.</p>
                <Link to="/articles/new" className="dashboard__btn-accent">
                  <Plus size={14} /> Criar primeiro artigo
                </Link>
              </div>
            ) : (
              articles.map(a => (
                <div key={a.id} className="dashboard__article-item">
                  <img
                    src={a.banner_url ? `http://localhost:3333${a.banner_url}` : PLACEHOLDER}
                    alt={a.title}
                    className="dashboard__article-thumb"
                  />
                  <div className="dashboard__article-info">
                    <h3>{a.title}</h3>
                    <p>{a.content.slice(0, 80)}...</p>
                    <div className="dashboard__article-meta">
                      <span>{formatDate(a.published_at)}</span>
                      <span>• 💬 2</span>
                      <span>• ♥ 1</span>
                    </div>
                  </div>
                  <div className="dashboard__article-btns">
                    <button
                      className="dashboard__btn-edit"
                      onClick={() => navigate(`/articles/edit/${a.id}`)}
                    >
                      <Pencil size={13} /> Editar
                    </button>
                    <button
                      className="dashboard__btn-delete"
                      onClick={() => setDeleteId(a.id)}
                    >
                      <Trash2 size={13} /> Excluir
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Recent Activity */}
          <div className="dashboard__activity">
            <h2>Atividade Recente</h2>
            <div className="dashboard__activity-list">
              {articles.slice(0, 3).map((a, i) => (
                <div key={i} className="dashboard__activity-item">
                  <div className="dashboard__activity-avatar">MN</div>
                  <div>
                    <p>
                      <strong>Marie Smith</strong> comentou em{' '}
                      <Link to={`/articles/${a.id}`}>{a.title}</Link>
                    </p>
                    <span>5 min atrás</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Delete Modal */}
      {deleteId && (
        <div className="modal-overlay" onClick={() => setDeleteId(null)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <h3>Excluir Artigo</h3>
            <p>Tem certeza que deseja excluir este artigo? Esta ação não pode ser desfeita.</p>
            <div className="modal__actions">
              <button className="modal__btn-cancel" onClick={() => setDeleteId(null)}>
                Cancelar
              </button>
              <button className="modal__btn-delete" onClick={handleDelete} disabled={deleting}>
                {deleting ? 'Excluindo...' : 'Excluir'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
