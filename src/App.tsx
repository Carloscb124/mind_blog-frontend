import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import PrivateRoute from './components/PrivateRoute'

import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import Articles from './pages/Articles'
import ArticleDetail from './pages/ArticleDetail'
import Dashboard from './pages/Dashboard'
import ArticleForm from './pages/ArticleForm'
import Settings from './pages/Settings'

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
          <Navbar />
          <main style={{ flex: 1 }}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/articles" element={<Articles />} />
              <Route path="/articles/:id" element={<ArticleDetail />} />
              <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
              <Route path="/articles/new" element={<PrivateRoute><ArticleForm /></PrivateRoute>} />
              <Route path="/articles/edit/:id" element={<PrivateRoute><ArticleForm /></PrivateRoute>} />
              <Route path="/settings" element={<PrivateRoute><Settings /></PrivateRoute>} />
              <Route path="*" element={
                <div style={{ textAlign: 'center', padding: '80px 24px', color: 'var(--text-secondary)' }}>
                  <h2 style={{ fontSize: 48, fontFamily: 'var(--font-display)', marginBottom: 12 }}>404</h2>
                  <p>Página não encontrada.</p>
                  <a href="/" style={{ color: 'var(--accent)', marginTop: 16, display: 'inline-block' }}>Voltar ao início</a>
                </div>
              } />
            </Routes>
          </main>
          <Footer />
        </div>
      </BrowserRouter>
    </AuthProvider>
  )
}
