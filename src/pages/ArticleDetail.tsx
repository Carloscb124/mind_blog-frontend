import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, Clock, Eye, Heart, Bookmark, Share2 } from 'lucide-react'
import { Article } from '../types'
import { useAuth } from '../contexts/AuthContext'
import api from '../services/api'
import './ArticleDetail.css'

interface Comment {
  id: number
  content: string
  user_name: string
  user_avatar?: string
  created_at: string
}

const PLACEHOLDER = 'https://placehold.co/800x400/1a1a1a/888?text=Sem+Imagem'

function formatDate(date: string) {
  return new Date(date).toLocaleDateString('pt-BR', {
    day: '2-digit', month: '2-digit', year: 'numeric',
  })
}

function readingTime(content: string) {
  return Math.max(1, Math.ceil(content.trim().split(/\s+/).length / 200))
}

function renderContent(content: string) {
  return content.split('\n').map((line, i) => {
    if (line.startsWith('## ')) return <h2 key={i}>{line.slice(3)}</h2>
    if (line.startsWith('# ')) return <h1 key={i}>{line.slice(2)}</h1>
    if (line.trim() === '') return <br key={i} />
    return <p key={i}>{line}</p>
  })
}

export default function ArticleDetail() {
  const { id } = useParams()
  const { user, isAuthenticated } = useAuth()
  const [article, setArticle] = useState<Article | null>(null)
  const [comments, setComments] = useState<Comment[]>([])
  const [newComment, setNewComment] = useState('')
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    setLoading(true)
    api.get(`/articles/${id}`).then(({ data }) => {
      setArticle(data.article)
    }).finally(() => setLoading(false))
    // Comments would be fetched here if backend supports it
  }, [id])

  const handleComment = async () => {
    if (!newComment.trim()) return
    setSubmitting(true)
    try {
      // Optimistic update (local only for now)
      setComments(prev => [...prev, {
        id: Date.now(),
        content: newComment,
        user_name: user?.name || 'Você',
        created_at: new Date().toISOString(),
      }])
      setNewComment('')
    } finally {
      setSubmitting(false)
    }
  }

  const getInitials = (name: string) =>
    name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)

  if (loading) return (
    <div className="article-detail container">
      <div className="article-detail__skeleton" />
    </div>
  )

  if (!article) return (
    <div className="article-detail container">
      <p className="article-detail__not-found">Artigo não encontrado.</p>
    </div>
  )

  return (
    <div className="article-detail">
      <div className="article-detail__container container">
        <Link to="/articles" className="article-detail__back">
          <ArrowLeft size={16} /> Voltar aos Artigos
        </Link>

        <div className="article-detail__main">
          {article.category && (
            <span className="article-detail__cat">{article.category}</span>
          )}

          <h1 className="article-detail__title">{article.title}</h1>

          {article.summary && (
            <p className="article-detail__summary">{article.summary}</p>
          )}

          <div className="article-detail__meta">
            <div className="article-detail__author-info">
              <div className="article-detail__avatar">
                {getInitials(article.author_name)}
              </div>
              <div>
                <span className="article-detail__author-name">{article.author_name}</span>
                <span className="article-detail__date">
                  {formatDate(article.published_at)} • <Clock size={12} /> {readingTime(article.content)}min
                </span>
              </div>
            </div>
            <div className="article-detail__actions">
              <button title="Curtir"><Heart size={16} /></button>
              <button title="Salvar"><Bookmark size={16} /></button>
              <button title="Compartilhar"><Share2 size={16} /></button>
            </div>
          </div>

          <div className="article-detail__stats">
            <span><Heart size={13} /> 1 curtidas</span>
            <span><Eye size={13} /> 122 visualizações</span>
            <span>💬 {comments.length} comentários</span>
          </div>

          <div className="article-detail__banner">
            <img
              src={article.banner_url ? `http://localhost:3333${article.banner_url}` : PLACEHOLDER}
              alt={article.title}
            />
          </div>

          <div className="article-detail__content">
            {renderContent(article.content)}
          </div>

          {article.tags && article.tags.length > 0 && (
            <div className="article-detail__tags">
              {article.tags.map(tag => (
                <span key={tag} className="article-detail__tag">{tag}</span>
              ))}
            </div>
          )}

          {/* Comments */}
          <div className="article-comments">
            <h3 className="article-comments__title">Comentário ({comments.length})</h3>

            {!isAuthenticated ? (
              <div className="article-comments__login">
                <p>Faça login para comentar</p>
                <Link to="/login" className="article-comments__login-btn">Fazer login</Link>
              </div>
            ) : (
              <div className="article-comments__form">
                <textarea
                  placeholder="Escreva um comentário..."
                  value={newComment}
                  onChange={e => setNewComment(e.target.value)}
                  rows={3}
                />
                <button
                  className="article-comments__submit"
                  onClick={handleComment}
                  disabled={submitting || !newComment.trim()}
                >
                  Publicar Comentário
                </button>
              </div>
            )}

            <div className="article-comments__list">
              {comments.map(c => (
                <div key={c.id} className="article-comment">
                  <div className="article-comment__header">
                    <div className="article-comment__user">
                      <div className="article-detail__avatar article-detail__avatar--sm">
                        {getInitials(c.user_name)}
                      </div>
                      <div>
                        <span className="article-comment__name">{c.user_name}</span>
                        <span className="article-comment__date">{formatDate(c.created_at)}</span>
                      </div>
                    </div>
                    <button className="article-comment__like"><Heart size={13} /> 1</button>
                  </div>
                  <p className="article-comment__text">{c.content}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
