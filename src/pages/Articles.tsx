import { useState, useEffect, useMemo } from 'react'
import { Search, Filter, LayoutGrid, List } from 'lucide-react'
import { Article } from '../types'
import api from '../services/api'
import ArticleCard from '../components/ArticleCard'
import './Articles.css'

const CATEGORIES = ['Todos', 'Desenvolvimento web', 'Backend', 'Frontend', 'DevOps', 'IA', 'Mobile']

export default function Articles() {
  const [articles, setArticles] = useState<Article[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('Todos')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')

  useEffect(() => {
    api.get('/articles').then(({ data }) => {
      setArticles(data.articles)
    }).finally(() => setLoading(false))
  }, [])

  const filtered = useMemo(() => {
    return articles.filter(a => {
      const matchSearch = !search ||
        a.title.toLowerCase().includes(search.toLowerCase()) ||
        a.content.toLowerCase().includes(search.toLowerCase())
      const matchCat = category === 'Todos' || a.category === category
      return matchSearch && matchCat
    })
  }, [articles, search, category])

  return (
    <div className="articles-page">
      <div className="articles-page__header container">
        <div>
          <h1>Todos os Artigos</h1>
          <p>Explore nossa coleção completa de artigos técnicos</p>
        </div>
      </div>

      <div className="articles-page__toolbar container">
        <div className="articles-search">
          <Search size={15} />
          <input
            type="text"
            placeholder="Buscar artigos..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>

        <div className="articles-controls">
          <div className="articles-filter">
            <Filter size={14} />
            <select value={category} onChange={e => setCategory(e.target.value)}>
              {CATEGORIES.map(c => <option key={c}>{c}</option>)}
            </select>
          </div>

          <div className="articles-view-toggle">
            <button
              className={viewMode === 'grid' ? 'active' : ''}
              onClick={() => setViewMode('grid')}
              title="Grade"
            >
              <LayoutGrid size={16} />
            </button>
            <button
              className={viewMode === 'list' ? 'active' : ''}
              onClick={() => setViewMode('list')}
              title="Lista"
            >
              <List size={16} />
            </button>
          </div>
        </div>
      </div>

      <div className={`articles-page__content container ${viewMode === 'list' ? 'articles-page__content--list' : ''}`}>
        {loading ? (
          <div className={`articles-skeleton ${viewMode === 'list' ? 'articles-skeleton--list' : ''}`}>
            {[...Array(6)].map((_, i) => <div key={i} className="articles-skeleton__item" />)}
          </div>
        ) : filtered.length === 0 ? (
          <div className="articles-empty">
            <p>Nenhum artigo encontrado.</p>
            {search && <button onClick={() => setSearch('')}>Limpar busca</button>}
          </div>
        ) : (
          <div className={viewMode === 'grid' ? 'articles-grid' : 'articles-list'}>
            {filtered.map(a => (
              <ArticleCard key={a.id} article={a} variant={viewMode} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
