import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, ArrowLeft, Users } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

export default function ForgotPasswordPage() {
  const { resetPasswordRequest, updatePassword } = useAuth();
  const navigate = useNavigate();

  // Detecta se veio do link de redefinição (hash com access_token ou type=recovery)
  const [mode, setMode] = useState('request'); // 'request' | 'reset'
  const [form, setForm] = useState({ email: '', password: '', confirmPassword: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  useEffect(() => {
    // O Supabase redireciona com hash: #access_token=...&type=recovery
    const hash = window.location.hash;
    if (hash.includes('type=recovery') || hash.includes('access_token')) {
      setMode('reset');
    }
  }, []);

  function handleChange(e) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleRequest(e) {
    e.preventDefault();
    setLoading(true);
    try {
      await resetPasswordRequest(form.email);
      setSent(true);
      toast.success('E-mail enviado! Verifique sua caixa de entrada.');
    } catch (err) {
      toast.error(err.message || 'Erro ao enviar e-mail.');
    } finally {
      setLoading(false);
    }
  }

  async function handleReset(e) {
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
      await updatePassword(form.password);
      toast.success('Senha alterada com sucesso!');
      navigate('/auth/login');
    } catch (err) {
      toast.error(err.message || 'Erro ao alterar senha.');
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
          <h1>Recuperar<br />acesso.</h1>
          <p>Sem problemas. Enviaremos um link para você redefinir sua senha com segurança.</p>
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
            <h2 className="auth-form-title">
              {mode === 'reset' ? 'Nova Senha' : 'Esqueci a Senha'}
            </h2>
            <p className="auth-form-subtitle">
              {mode === 'reset'
                ? 'Defina sua nova senha abaixo.'
                : 'Informe seu e-mail para receber o link de redefinição.'}
            </p>
          </div>

          {/* MODE: request */}
          {mode === 'request' && !sent && (
            <form className="auth-form" onSubmit={handleRequest} noValidate>
              <div className="form-group">
                <label className="form-label" htmlFor="forgot-email">E-mail</label>
                <div className="form-input-icon-wrap">
                  <Mail size={15} className="input-icon" />
                  <input
                    id="forgot-email"
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
              <button type="submit" className="btn btn-primary btn-lg w-full" disabled={loading}>
                {loading ? <span className="spinner" /> : null}
                Enviar Link de Redefinição
              </button>
            </form>
          )}

          {/* MODE: request - sent */}
          {mode === 'request' && sent && (
            <div
              style={{
                background: 'rgba(0,212,170,0.08)',
                border: '1px solid rgba(0,212,170,0.2)',
                borderRadius: 'var(--r-lg)',
                padding: '24px',
                textAlign: 'center',
              }}
            >
              <div style={{ fontSize: '32px', marginBottom: '12px' }}>📬</div>
              <p style={{ fontWeight: 600, marginBottom: '8px' }}>E-mail enviado!</p>
              <p style={{ fontSize: 'var(--fs-sm)', color: 'var(--text-secondary)' }}>
                Verifique sua caixa de entrada e clique no link para redefinir sua senha.
              </p>
            </div>
          )}

          {/* MODE: reset */}
          {mode === 'reset' && (
            <form className="auth-form" onSubmit={handleReset} noValidate>
              <div className="form-group">
                <label className="form-label" htmlFor="reset-password">Nova Senha</label>
                <div className="form-input-icon-wrap" style={{ position: 'relative' }}>
                  <Lock size={15} className="input-icon" />
                  <input
                    id="reset-password"
                    className="form-input"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    value={form.password}
                    onChange={handleChange}
                    placeholder="Mínimo 6 caracteres"
                    required
                    style={{ paddingRight: '42px' }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((s) => !s)}
                    style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', background: 'none', border: 'none', cursor: 'pointer' }}
                    aria-label="Mostrar senha"
                  >
                    {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="reset-confirm">Confirmar Nova Senha</label>
                <div className="form-input-icon-wrap">
                  <Lock size={15} className="input-icon" />
                  <input
                    id="reset-confirm"
                    className="form-input"
                    name="confirmPassword"
                    type={showPassword ? 'text' : 'password'}
                    value={form.confirmPassword}
                    onChange={handleChange}
                    placeholder="Repita a senha"
                    required
                  />
                </div>
              </div>
              <button type="submit" className="btn btn-primary btn-lg w-full" disabled={loading}>
                {loading ? <span className="spinner" /> : null}
                Salvar Nova Senha
              </button>
            </form>
          )}

          <div className="auth-form-footer">
            <Link to="/auth/login" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
              <ArrowLeft size={14} /> Voltar para o Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
