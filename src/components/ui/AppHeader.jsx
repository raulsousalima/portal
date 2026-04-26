import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, User, Lock, LogOut, ChevronDown, Users, Sun, Moon } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import Avatar from '../ui/Avatar';
import toast from 'react-hot-toast';

export default function AppHeader({ onSearch }) {
  const { user, signOut, isGuest, exitGuest } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);
  const name = isGuest ? 'Visitante' : (user?.user_metadata?.name || user?.email?.split('@')[0] || 'Usuário');

  // Fechar menu ao clicar fora
  useEffect(() => {
    function handleClick(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  async function handleSignOut() {
    if (isGuest) {
      exitGuest();
      navigate('/auth/login');
      return;
    }
    try {
      await signOut();
      navigate('/auth/login');
    } catch {
      toast.error('Erro ao sair.');
    }
  }

  return (
    <header className="app-header">
      {/* Logo */}
      <Link to="/home" className="header-logo">
        <div className="header-logo-icon">
          <Users size={18} color="#fff" />
        </div>
        <span className="header-logo-name">Portal RH</span>
      </Link>

      {/* Search */}
      {onSearch && (
        <div className="header-search">
          <div className="search-bar">
            <Search size={15} className="search-icon" />
            <input
              type="search"
              placeholder="Buscar colaborador..."
              onChange={(e) => onSearch(e.target.value)}
              aria-label="Buscar colaborador"
            />
          </div>
        </div>
      )}

      {/* Theme toggle */}
      <button
        className="theme-toggle"
        onClick={toggleTheme}
        aria-label={theme === 'dark' ? 'Ativar modo claro' : 'Ativar modo escuro'}
        title={theme === 'dark' ? 'Modo claro' : 'Modo escuro'}
      >
        {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
      </button>

      {/* User menu */}
      <div className="user-menu" ref={menuRef}>
        <button
          className="user-menu-trigger"
          onClick={() => setMenuOpen((o) => !o)}
          aria-label="Menu do usuário"
          aria-expanded={menuOpen}
        >
          <Avatar name={name} size={28} />
          <span className="user-menu-name">{name}</span>
          <ChevronDown size={14} color="var(--text-muted)" />
        </button>

        {menuOpen && (
          <div className="user-menu-dropdown">
            <div className="user-menu-info">
              <div className="user-menu-info-name">{name}</div>
              <div className="user-menu-info-email">{isGuest ? 'Modo visitante' : user?.email}</div>
            </div>

            {!isGuest && (
              <>
                <button
                  className="user-menu-item"
                  onClick={() => { navigate('/profile'); setMenuOpen(false); }}
                >
                  <User size={15} /> Meu Perfil
                </button>
                <button
                  className="user-menu-item"
                  onClick={() => { navigate('/profile?section=password'); setMenuOpen(false); }}
                >
                  <Lock size={15} /> Alterar Senha
                </button>
              </>
            )}
            <button className="user-menu-item danger" onClick={handleSignOut}>
              <LogOut size={15} /> Sair
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
