import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, Users } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

export default function LoginPage() {
  const { signIn, enterAsGuest } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  function handleChange(e) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    try {
      await signIn(form.email, form.password);
      navigate('/home');
    } catch (err) {
      toast.error(err.message || 'E-mail ou senha inválidos.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-layout" data-theme="light">
      {/* Brand Panel */}
      <div className="auth-brand">
        <div className="auth-brand-logo">
          <div className="auth-brand-logo-icon">
            <Users size={26} color="#fff" />
          </div>
          <div>
            <div className="auth-brand-name">Portal RH</div>
            <div className="auth-brand-tag">Gestão de Pessoas</div>
          </div>
        </div>
        <div className="auth-brand-headline">
          <h1>Bem-vindo<br />de volta.</h1>
          <p>Acesse o portal e gerencie seus colaboradores e times com facilidade.</p>
        </div>
        <div className="auth-brand-stats">
          <div className="auth-brand-stat">
            <div className="auth-brand-stat-num">5</div>
            <div className="auth-brand-stat-label">Times</div>
          </div>
          <div className="auth-brand-stat">
            <div className="auth-brand-stat-num">8</div>
            <div className="auth-brand-stat-label">Níveis</div>
          </div>
          <div className="auth-brand-stat">
            <div className="auth-brand-stat-num">∞</div>
            <div className="auth-brand-stat-label">Colaboradores</div>
          </div>
        </div>
      </div>

      {/* Form Panel */}
      <div className="auth-form-panel">
        <div className="auth-form-inner">
          <div className="auth-form-header">
            <div className="auth-form-mobile-logo">
              <div className="auth-form-mobile-logo-icon">
                <Users size={18} color="#fff" />
              </div>
              <span style={{ fontWeight: 800, fontSize: 'var(--fs-base)' }}>Portal RH</span>
            </div>
            <h2 className="auth-form-title">Entrar</h2>
            <p className="auth-form-subtitle">Acesse sua conta do Portal RH.</p>
          </div>

          <form className="auth-form" onSubmit={handleSubmit} noValidate>
            <div className="form-group">
              <label className="form-label" htmlFor="login-email">E-mail</label>
              <div className="form-input-icon-wrap">
                <Mail size={15} className="input-icon" />
                <input
                  id="login-email"
                  className="form-input"
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="seu@email.com"
                  autoComplete="email"
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="login-password">Senha</label>
              <div className="form-input-icon-wrap" style={{ position: 'relative' }}>
                <Lock size={15} className="input-icon" />
                <input
                  id="login-password"
                  className="form-input"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  value={form.password}
                  onChange={handleChange}
                  placeholder="Sua senha"
                  autoComplete="current-password"
                  required
                  style={{ paddingRight: '42px' }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((s) => !s)}
                  style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', background: 'none', border: 'none', cursor: 'pointer' }}
                  aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
                >
                  {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
              <Link to="/auth/forgot-password" className="auth-forgot-link">
                Esqueci minha senha
              </Link>
            </div>

            <button type="submit" className="btn btn-primary btn-lg w-full" disabled={loading}>
              {loading ? <span className="spinner" /> : null}
              Entrar
            </button>
          </form>

          <div style={{ margin: '4px 0' }}>
            <button
              type="button"
              className="btn btn-outline btn-lg w-full"
              onClick={() => { enterAsGuest(); navigate('/home'); }}
            >
              Entrar como Visitante
            </button>
          </div>

          <div className="auth-form-footer">
            Não tem conta?{' '}
            <Link to="/auth/signup">Criar conta</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
