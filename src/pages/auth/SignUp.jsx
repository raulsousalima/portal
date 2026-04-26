import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, User, Eye, EyeOff, Users } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

export default function SignUpPage() {
  const { signUp } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  function handleChange(e) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (form.password !== form.confirmPassword) {
      toast.error('As senhas não coincidem.');
      return;
    }
    if (form.password.length < 6) {
      toast.error('A senha deve ter pelo menos 6 caracteres.');
      return;
    }
    setLoading(true);
    try {
      await signUp(form.email, form.password, form.name);
      toast.success('Conta criada! Verifique seu e-mail para confirmar.');
      navigate('/auth/login');
    } catch (err) {
      toast.error(err.message || 'Erro ao criar conta.');
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
          <h1>Conecte pessoas.<br />Construa times.</h1>
          <p>Uma plataforma completa para visualizar, organizar e gerenciar seus colaboradores e times.</p>
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
            <h2 className="auth-form-title">Criar Conta</h2>
            <p className="auth-form-subtitle">Preencha os dados para acessar o portal.</p>
          </div>

          <form className="auth-form" onSubmit={handleSubmit} noValidate>
            <div className="form-group">
              <label className="form-label" htmlFor="signup-name">Nome completo</label>
              <div className="form-input-icon-wrap">
                <User size={15} className="input-icon" />
                <input
                  id="signup-name"
                  className="form-input"
                  name="name"
                  type="text"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Seu nome"
                  autoComplete="name"
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="signup-email">E-mail</label>
              <div className="form-input-icon-wrap">
                <Mail size={15} className="input-icon" />
                <input
                  id="signup-email"
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
              <label className="form-label" htmlFor="signup-password">Senha</label>
              <div className="form-input-icon-wrap" style={{ position: 'relative' }}>
                <Lock size={15} className="input-icon" />
                <input
                  id="signup-password"
                  className="form-input"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  value={form.password}
                  onChange={handleChange}
                  placeholder="Mínimo 6 caracteres"
                  autoComplete="new-password"
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
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="signup-confirm">Confirmar Senha</label>
              <div className="form-input-icon-wrap">
                <Lock size={15} className="input-icon" />
                <input
                  id="signup-confirm"
                  className="form-input"
                  name="confirmPassword"
                  type={showPassword ? 'text' : 'password'}
                  value={form.confirmPassword}
                  onChange={handleChange}
                  placeholder="Repita a senha"
                  autoComplete="new-password"
                  required
                />
              </div>
            </div>

            <button type="submit" className="btn btn-primary btn-lg w-full" disabled={loading}>
              {loading ? <span className="spinner" /> : null}
              Criar Conta
            </button>
          </form>

          <div className="auth-form-footer">
            Já tem conta?{' '}
            <Link to="/auth/login">Entrar</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
