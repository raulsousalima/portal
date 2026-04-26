import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Lock, LogOut, Eye, EyeOff, ArrowLeft } from 'lucide-react';
import AppHeader from '../components/ui/AppHeader';
import Avatar from '../components/ui/Avatar';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

export default function ProfilePage() {
  const { user, signOut, updatePassword } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [passwordForm, setPasswordForm] = useState({ password: '', confirmPassword: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [loadingPassword, setLoadingPassword] = useState(false);
  const [loadingSignOut, setLoadingSignOut] = useState(false);
  const [passwordOpen, setPasswordOpen] = useState(false);

  // Abre a seção de senha se veio de ?section=password
  useEffect(() => {
    if (searchParams.get('section') === 'password') {
      setPasswordOpen(true);
    }
  }, [searchParams]);

  const name = user?.user_metadata?.name || user?.email?.split('@')[0] || 'Usuário';
  const email = user?.email || '';
  const createdAt = user?.created_at
    ? new Date(user.created_at).toLocaleDateString('pt-BR')
    : '—';

  function handlePasswordChange(e) {
    setPasswordForm((p) => ({ ...p, [e.target.name]: e.target.value }));
  }

  async function handlePasswordSubmit(e) {
    e.preventDefault();
    if (passwordForm.password !== passwordForm.confirmPassword) {
      toast.error('As senhas não coincidem.');
      return;
    }
    if (passwordForm.password.length < 6) {
      toast.error('A senha deve ter pelo menos 6 caracteres.');
      return;
    }
    setLoadingPassword(true);
    try {
      await updatePassword(passwordForm.password);
      toast.success('Senha alterada com sucesso!');
      setPasswordForm({ password: '', confirmPassword: '' });
      setPasswordOpen(false);
    } catch (err) {
      toast.error(err.message || 'Erro ao alterar senha.');
    } finally {
      setLoadingPassword(false);
    }
  }

  async function handleSignOut() {
    setLoadingSignOut(true);
    try {
      await signOut();
      navigate('/auth/login');
    } catch {
      toast.error('Erro ao sair.');
    } finally {
      setLoadingSignOut(false);
    }
  }

  return (
    <div className="app-layout">
      <AppHeader />
      <main className="app-content">
        <div className="profile-layout">
          <button className="back-btn" onClick={() => navigate('/home')}>
            <ArrowLeft size={16} /> Voltar
          </button>

          <div className="card">
            {/* Hero */}
            <div className="profile-hero">
              <Avatar name={name} size={96} />
              <h1 className="profile-name">{name}</h1>
              <p className="profile-email">{email}</p>
              <p style={{ fontSize: 'var(--fs-xs)', color: 'var(--text-muted)' }}>
                Membro desde {createdAt}
              </p>
            </div>

            {/* Alterar Senha */}
            <div className="profile-section">
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--sp-4)' }}>
                <div className="profile-section-title" style={{ margin: 0 }}>Segurança</div>
                <button
                  id="btn-toggle-password"
                  className="btn btn-outline btn-sm"
                  onClick={() => setPasswordOpen((o) => !o)}
                >
                  <Lock size={13} /> Alterar Senha
                </button>
              </div>

              {passwordOpen && (
                <form onSubmit={handlePasswordSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div className="form-group">
                    <label className="form-label" htmlFor="profile-password">Nova Senha</label>
                    <div className="form-input-icon-wrap" style={{ position: 'relative' }}>
                      <Lock size={15} className="input-icon" />
                      <input
                        id="profile-password"
                        className="form-input"
                        name="password"
                        type={showPassword ? 'text' : 'password'}
                        value={passwordForm.password}
                        onChange={handlePasswordChange}
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
                    <label className="form-label" htmlFor="profile-confirm">Confirmar Nova Senha</label>
                    <div className="form-input-icon-wrap">
                      <Lock size={15} className="input-icon" />
                      <input
                        id="profile-confirm"
                        className="form-input"
                        name="confirmPassword"
                        type={showPassword ? 'text' : 'password'}
                        value={passwordForm.confirmPassword}
                        onChange={handlePasswordChange}
                        placeholder="Repita a senha"
                        required
                      />
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                    <button
                      type="button"
                      className="btn btn-outline btn-sm"
                      onClick={() => { setPasswordOpen(false); setPasswordForm({ password: '', confirmPassword: '' }); }}
                    >
                      Cancelar
                    </button>
                    <button type="submit" className="btn btn-primary btn-sm" disabled={loadingPassword}>
                      {loadingPassword ? <span className="spinner" /> : null}
                      Salvar Senha
                    </button>
                  </div>
                </form>
              )}
            </div>

            {/* Sair */}
            <div className="profile-section" style={{ borderTop: '1px solid var(--border)' }}>
              <div className="profile-section-title">Sessão</div>
              <p style={{ fontSize: 'var(--fs-sm)', color: 'var(--text-secondary)', marginBottom: '16px' }}>
                Ao sair, você precisará fazer login novamente para acessar o portal.
              </p>
              <button
                id="btn-signout"
                className="btn btn-danger"
                onClick={handleSignOut}
                disabled={loadingSignOut}
              >
                {loadingSignOut ? <span className="spinner" /> : <LogOut size={15} />}
                Sair da Conta
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
