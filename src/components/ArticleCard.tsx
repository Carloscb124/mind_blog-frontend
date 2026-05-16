import { Link } from 'react-router-dom'
import { Clock, Eye, Heart } from 'lucide-react'
import { Article } from '../types'
import './ArticleCard.css'

interface Props {
  article: Article
  variant?: 'grid' | 'list'
}

const PLACEHOLDER = 'https://placehold.co/600x400/1a1a1a/888?text=Sem+Imagem'

const CATEGORY_COLORS: Record<string, string> = {
  'Desenvolvimento web': '#e8a033',
  'Backend': '#a033e8',
  'Frontend': '#33a8e8',
  'DevOps': '#33e880',
  'IA': '#e833a0',
  'Mobile': '#e85533',
}

function readingTime(content: string) {
  const words = content.trim().split(/\s+/).length
  return Math.max(1, Math.ceil(words / 200))
}

function formatDate(date: string) {
  return new Date(date).toLocaleDateString('pt-BR', {
    day: '2-digit', month: 'short', year: 'numeric',
  })
}

export default function ArticleCard({ article, variant = 'grid' }: Props) {
  const color = article.category ? CATEGORY_COLORS[article.category] || '#888' : '#888'

  if (variant === 'list') {
    return (
      <Link to={`/articles/${article.id}`} className="article-card article-card--list">
        <div className="article-card__thumb">
          <img
            src={article.banner_url ? `http://localhost:3333${article.banner_url}` : PLACEHOLDER}
            alt={article.title}
          />
        </div>
        <div className="article-card__body">
          <div className="article-card__meta-top">
            {article.category && (
              <span className="article-card__cat" style={{ background: `${color}22`, color }}>
                {article.category}
              </span>
            )}
            <span className="article-card__date">{formatDate(article.published_at)}</span>
          </div>
          <h3 className="article-card__title">{article.title}</h3>
          <p className="article-card__excerpt">
            {article.summary || article.content.slice(0, 120)}...
          </p>
          <div className="article-card__footer">
            <span className="article-card__author">{article.author_name}</span>
            <div className="article-card__stats">
              <span><Clock size={12} /> {readingTime(article.content)}min</span>
              <span><Eye size={12} /> 122</span>
              <span><Heart size={12} /> 1</span>
            </div>
          </div>
        </div>
      </Link>
    )
  }

  return (
    <Link to={`/articles/${article.id}`} className="article-card article-card--grid">
      <div className="article-card__img-wrap">
        <img
          src={article.banner_url ? `http://localhost:3333${article.banner_url}` : PLACEHOLDER}
          alt={article.title}
        />
      </div>
      <div className="article-card__body">
        <div className="article-card__meta-top">
          {article.category && (
            <span className="article-card__cat" style={{ background: `${color}22`, color }}>
              {article.category}
            </span>
          )}
          <span className="article-card__date">{formatDate(article.published_at)}</span>
        </div>
        <h3 className="article-card__title">{article.title}</h3>
        <p className="article-card__excerpt">
          {article.summary || article.content.slice(0, 100)}...
        </p>
        <div className="article-card__footer">
          <span className="article-card__author">{article.author_name}</span>
          <div className="article-card__stats">
            <span><Clock size={12} /> {readingTime(article.content)}min</span>
            <span><Eye size={12} /> 122</span>
            <span><Heart size={12} /> 1</span>
          </div>
        </div>
      </div>
    </Link>
  )
}
