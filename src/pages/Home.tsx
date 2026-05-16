import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ArrowRight, Mail } from 'lucide-react'
import { Article } from '../types'
import api from '../services/api'
import ArticleCard from '../components/ArticleCard'
import './Home.css'

export default function Home() {
  const [articles, setArticles] = useState<Article[]>([])
  const [loading, setLoading] = useState(true)
  const [email, setEmail] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    api.get('/articles').then(({ data }) => {
      setArticles(data.articles)
    }).finally(() => setLoading(false))
  }, [])

  const featured = articles.slice(0, 4)
  const recent = articles.slice(0, 4)

  return (
    <div className="home">
      {/* Hero */}
      <section className="hero">
        <div className="hero__inner container">
          <h1 className="hero__title">
            Explore o Futuro da<br />
            <span className="hero__title--accent">Tecnologia</span>
          </h1>
          <p className="hero__subtitle">
            Artigos sobre IA, desenvolvimento,<br />
            DevOps e as últimas tendências tecnológicas
          </p>
          <div className="hero__ctas">
            <Link to="/articles" className="hero__btn-primary">Explorar Artigos</Link>
            <Link to="/register" className="hero__btn-ghost">Começar a Escrever</Link>
          </div>
        </div>
      </section>

      {/* Featured */}
      <section className="home-section container">
        <div className="home-section__header">
          <div>
            <h2 className="home-section__title">Artigos em Destaque</h2>
            <p className="home-section__sub">Os melhores conteúdos selecionados para você</p>
          </div>
          <Link to="/articles" className="home-section__link">
            Ver todos <ArrowRight size={14} />
          </Link>
        </div>

        {loading ? (
          <div className="home__skeleton-grid">
            {[...Array(4)].map((_, i) => <div key={i} className="home__skeleton" />)}
          </div>
        ) : articles.length === 0 ? (
          <p className="home__empty">Nenhum artigo publicado ainda.</p>
        ) : (
          <div className="home__grid">
            {featured.map(a => <ArticleCard key={a.id} article={a} />)}
          </div>
        )}
      </section>

      {/* Recent */}
      <section className="home-section container">
        <div className="home-section__header">
          <div>
            <h2 className="home-section__title">Artigos Recentes</h2>
            <p className="home-section__sub">Conteúdo recente da comunidade</p>
          </div>
        </div>

        {!loading && (
          <div className="home__grid home__grid--3">
            {recent.map(a => <ArticleCard key={a.id} article={a} />)}
          </div>
        )}
      </section>

      {/* Newsletter */}
      <section className="newsletter">
        <div className="newsletter__inner container">
          <Mail size={32} className="newsletter__icon" />
          <h2 className="newsletter__title">Newsletter Semanal</h2>
          <p className="newsletter__sub">
            Receba os melhores artigos de tecnologia diretamente no seu email.<br />
            Sem spam, apenas conteúdo de qualidade.
          </p>
          <div className="newsletter__form">
            <input
              type="email"
              placeholder="exemplo@email.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
            />
            <button className="newsletter__btn">Inscrever</button>
          </div>
          <span className="newsletter__proof">Mais de 10.000 desenvolvedores já recebem nossa newsletter</span>
        </div>
      </section>

      {/* CTA */}
      <section className="home-cta container">
        <h2>Compartilhe Seu Conhecimento</h2>
        <p>Junte-se à nossa comunidade de escritores e compartilhe suas experiências e conhecimentos em tecnologia</p>
        <button className="home-cta__btn" onClick={() => navigate('/register')}>
          Criar Conta Gratuita
        </button>
      </section>
    </div>
  )
}
