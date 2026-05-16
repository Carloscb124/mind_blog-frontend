import { useState, useRef, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { LayoutDashboard, Settings, LogOut, ChevronDown } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import './Navbar.css'

export default function Navbar() {
  const { user, isAuthenticated, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  const handleLogout = () => {
    logout()
    navigate('/')
    setDropdownOpen(false)
  }

  const isActive = (path: string) => location.pathname === path

  const getInitials = (name: string) =>
    name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)

  return (
    <header className="navbar">
      <div className="navbar__inner">
        <Link to="/" className="navbar__logo">
          &lt;M/&gt;
        </Link>

        <nav className="navbar__nav">
          <Link to="/" className={`navbar__link ${isActive('/') ? 'navbar__link--active' : ''}`}>
            Home
          </Link>
          <Link to="/articles" className={`navbar__link ${isActive('/articles') ? 'navbar__link--active' : ''}`}>
            Artigos
          </Link>
        </nav>

        <div className="navbar__actions">
          {isAuthenticated && user ? (
            <div className="navbar__user" ref={dropdownRef}>
              <button
                className="navbar__avatar-btn"
                onClick={() => setDropdownOpen(!dropdownOpen)}
              >
                {user.avatar_url ? (
                  <img src={user.avatar_url} alt={user.name} className="navbar__avatar" />
                ) : (
                  <div className="navbar__avatar navbar__avatar--initials">
                    {getInitials(user.name)}
                  </div>
                )}
                <ChevronDown size={14} className={`navbar__chevron ${dropdownOpen ? 'navbar__chevron--open' : ''}`} />
              </button>

              {dropdownOpen && (
                <div className="navbar__dropdown">
                  <div className="navbar__dropdown-header">
                    <span className="navbar__dropdown-name">{user.name}</span>
                    <span className="navbar__dropdown-email">{user.email}</span>
                  </div>
                  <div className="navbar__dropdown-divider" />
                  <Link to="/dashboard" className="navbar__dropdown-item" onClick={() => setDropdownOpen(false)}>
                    <LayoutDashboard size={15} /> Dashboard
                  </Link>
                  <Link to="/settings" className="navbar__dropdown-item" onClick={() => setDropdownOpen(false)}>
                    <Settings size={15} /> Configurações
                  </Link>
                  <div className="navbar__dropdown-divider" />
                  <button className="navbar__dropdown-item navbar__dropdown-item--danger" onClick={handleLogout}>
                    <LogOut size={15} /> Sair
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link to="/login" className="navbar__btn-ghost">Entrar</Link>
              <Link to="/register" className="navbar__btn-accent">Cadastrar</Link>
            </>
          )}
        </div>
      </div>
    </header>
  )
}
