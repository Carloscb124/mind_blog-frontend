import { useState, FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, User, Mail } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import './Settings.css'

export default function Settings() {
  const { user, updateUser } = useAuth()
  const [name, setName] = useState(user?.name || '')
  const [email, setEmail] = useState(user?.email || '')
  const [bio, setBio] = useState(user?.bio || '')
  const [avatarUrl, setAvatarUrl] = useState(user?.avatar_url || '')
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)

  const getInitials = (n: string) =>
    n.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setSuccess(false)
    // Atualização local (backend pode ser expandido com PATCH /auth/me)
    setTimeout(() => {
      updateUser({ ...user!, name, email, bio, avatar_url: avatarUrl })
      setSuccess(true)
      setLoading(false)
    }, 600)
  }

  return (
    <div className="settings-page">
      <div className="settings-page__container container">
        <Link to="/dashboard" className="settings-page__back">
          <ArrowLeft size={15} /> Voltar ao Dashboard
        </Link>

        <div className="settings-page__header">
          <h1>Configurações do Perfil</h1>
          <p>Gerencie suas informações pessoais</p>
        </div>

        <div className="settings-card">
          {success && (
            <div className="settings-success">Alterações salvas com sucesso!</div>
          )}

          {/* Avatar */}
          <div className="settings-avatar-section">
            <div className="settings-avatar">
              {avatarUrl ? (
                <img src={avatarUrl} alt={name} />
              ) : (
                <span>{getInitials(name || 'U')}</span>
              )}
            </div>
            <div className="settings-avatar-field">
              <label>Foto de Perfil</label>
              <input
                type="text"
                placeholder="https://..."
                value={avatarUrl}
                onChange={e => setAvatarUrl(e.target.value)}
              />
              <span className="settings-hint">Adicione uma imagem ou deixe em branco</span>
            </div>
          </div>

          <div className="settings-divider" />

          <form className="settings-form" onSubmit={handleSubmit}>
            <div className="settings-field">
              <label><User size={14} /> Nome Completo</label>
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                required
              />
            </div>

            <div className="settings-field">
              <label><Mail size={14} /> Email</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="settings-field">
              <label>Bio</label>
              <textarea
                value={bio}
                onChange={e => setBio(e.target.value)}
                rows={4}
                maxLength={500}
                placeholder="Fale um pouco sobre você..."
              />
              <span className="settings-counter">{bio.length}/500 caracteres</span>
            </div>

            <div className="settings-divider" />

            <div className="settings-info">
              <h3>Informações da conta</h3>
              <div className="settings-info__grid">
                <div>
                  <span>Tipo de conta</span>
                  <strong>Admin</strong>
                </div>
                <div>
                  <span>Membro desde</span>
                  <strong>
                    {user?.created_at
                      ? new Date(user.created_at).toLocaleDateString('pt-BR')
                      : '—'}
                  </strong>
                </div>
              </div>
            </div>

            <button type="submit" className="settings-btn" disabled={loading}>
              {loading ? 'Salvando...' : 'Salvar Alterações'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
