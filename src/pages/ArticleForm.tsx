import { useState, useEffect, FormEvent } from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'
import { ArrowLeft, X, Plus } from 'lucide-react'
import api from '../services/api'
import './ArticleForm.css'

const CATEGORIES = ['Desenvolvimento web', 'Backend', 'Frontend', 'DevOps', 'IA', 'Mobile']

export default function ArticleForm() {
  const { id } = useParams()
  const navigate = useNavigate()
  const isEdit = !!id

  const [title, setTitle] = useState('')
  const [summary, setSummary] = useState('')
  const [category, setCategory] = useState(CATEGORIES[0])
  const [content, setContent] = useState('')
  const [tagInput, setTagInput] = useState('')
  const [tags, setTags] = useState<string[]>([])
  const [banner, setBanner] = useState<File | null>(null)
  const [bannerPreview, setBannerPreview] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (isEdit) {
      api.get(`/articles/${id}`).then(({ data }) => {
        const a = data.article
        setTitle(a.title)
        setSummary(a.summary || '')
        setCategory(a.category || CATEGORIES[0])
        setContent(a.content)
        setTags(a.tags || [])
        if (a.banner_url) setBannerPreview(`http://localhost:3333${a.banner_url}`)
      })
    }
  }, [id, isEdit])

  const handleBanner = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setBanner(file)
    setBannerPreview(URL.createObjectURL(file))
  }

  const addTag = () => {
    const t = tagInput.trim()
    if (t && !tags.includes(t)) setTags(prev => [...prev, t])
    setTagInput('')
  }

  const removeTag = (tag: string) => setTags(prev => prev.filter(t => t !== tag))

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError('')
    if (!title.trim() || !content.trim()) {
      setError('Título e conteúdo são obrigatórios.')
      return
    }
    setLoading(true)
    try {
      const fd = new FormData()
      fd.append('title', title)
      fd.append('content', content)
      fd.append('summary', summary)
      fd.append('category', category)
      tags.forEach(t => fd.append('tags[]', t))
      if (banner) fd.append('banner', banner)

      if (isEdit) {
        await api.put(`/articles/${id}`, fd, { headers: { 'Content-Type': 'multipart/form-data' } })
      } else {
        await api.post('/articles', fd, { headers: { 'Content-Type': 'multipart/form-data' } })
      }
      navigate('/dashboard')
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erro ao salvar artigo.')
    } finally {
      setLoading(false)
    }
  }

  const wordCount = content.trim().split(/\s+/).filter(Boolean).length
  const readTime = Math.max(1, Math.ceil(wordCount / 200))

  return (
    <div className="article-form-page">
      <div className="article-form-page__container container">
        <Link to="/dashboard" className="article-form-page__back">
          <ArrowLeft size={15} /> Voltar ao Dashboard
        </Link>

        <div className="article-form-page__header">
          <h1>{isEdit ? 'Editar Artigo' : 'Criar Novo Artigo'}</h1>
          <p>{isEdit ? 'Atualize as informações do seu artigo' : 'Compartilhe seu conhecimento com a comunidade'}</p>
        </div>

        {error && <div className="article-form-page__error">{error}</div>}

        <form className="article-form" onSubmit={handleSubmit}>
          {/* Title */}
          <div className="article-form__field">
            <label>Título do Artigo *</label>
            <input
              type="text"
              placeholder="O Futuro da Inteligência Artificial em 2025"
              value={title}
              onChange={e => setTitle(e.target.value)}
              required
            />
          </div>

          {/* Summary */}
          <div className="article-form__field">
            <label>Resumo *</label>
            <textarea
              placeholder="Uma breve descrição do artigo..."
              value={summary}
              onChange={e => setSummary(e.target.value)}
              rows={3}
              maxLength={120}
            />
            <span className="article-form__counter">{summary.length}/120 caracteres</span>
          </div>

          {/* Category */}
          <div className="article-form__field">
            <label>Categoria *</label>
            <div className="article-form__select-wrap">
              <select value={category} onChange={e => setCategory(e.target.value)}>
                {CATEGORIES.map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
          </div>

          {/* Banner */}
          <div className="article-form__field">
            <label>Imagem de Capa *</label>
            <label className="article-form__file-label">
              <input type="file" accept="image/*" onChange={handleBanner} />
              {bannerPreview ? (
                <img src={bannerPreview} alt="Preview" className="article-form__preview" />
              ) : (
                <div className="article-form__file-placeholder">
                  <Plus size={20} />
                  <span>Clique para selecionar uma imagem</span>
                </div>
              )}
            </label>
          </div>

          {/* Tags */}
          <div className="article-form__field">
            <label>Tags</label>
            <div className="article-form__tags-input">
              <input
                type="text"
                placeholder="Adicionar tag..."
                value={tagInput}
                onChange={e => setTagInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addTag())}
              />
              <button type="button" onClick={addTag} className="article-form__tag-add">Adicionar</button>
            </div>
            {tags.length > 0 && (
              <div className="article-form__tags">
                {tags.map(t => (
                  <span key={t} className="article-form__tag">
                    {t}
                    <button type="button" onClick={() => removeTag(t)}><X size={12} /></button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Content */}
          <div className="article-form__field">
            <label>Conteúdo do Artigo *</label>
            <textarea
              className="article-form__content"
              placeholder="## Título da seção&#10;&#10;Escreva o conteúdo aqui..."
              value={content}
              onChange={e => setContent(e.target.value)}
              rows={16}
              required
            />
            <div className="article-form__content-stats">
              <span>{content.length}/8000 caracteres</span>
              <span>• {wordCount} palavras</span>
              <span>• {readTime} minuto{readTime > 1 ? 's' : ''} de leitura</span>
            </div>
          </div>

          {/* Actions */}
          <div className="article-form__actions">
            <button type="submit" className="article-form__btn-submit" disabled={loading}>
              {loading ? 'Salvando...' : isEdit ? 'Salvar Alterações' : 'Publicar Artigo'}
            </button>
            <button type="button" className="article-form__btn-cancel" onClick={() => navigate('/dashboard')}>
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
