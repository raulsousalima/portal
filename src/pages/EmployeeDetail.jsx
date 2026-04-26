import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Pencil, Trash2, Mail, MapPin, Star } from 'lucide-react';
import AppHeader from '../components/ui/AppHeader';
import Avatar from '../components/ui/Avatar';
import EmployeeModal from '../components/employees/EmployeeModal';
import ConfirmDialog from '../components/ui/ConfirmDialog';
import { getEmployee, deleteEmployee } from '../lib/employeeService';
import { levelClass, teamClass } from '../lib/utils';
import toast from 'react-hot-toast';

export default function EmployeeDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [employee, setEmployee] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editOpen, setEditOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        const data = await getEmployee(id);
        setEmployee(data);
      } catch {
        toast.error('Colaborador não encontrado.');
        navigate('/home');
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [id, navigate]);

  async function handleDelete() {
    setDeleting(true);
    try {
      await deleteEmployee(id);
      toast.success('Colaborador excluído.');
      navigate('/home');
    } catch (err) {
      toast.error(err.message || 'Erro ao excluir.');
    } finally {
      setDeleting(false);
    }
  }

  if (loading) {
    return (
      <div className="app-layout">
        <AppHeader />
        <div className="loading-page"><div className="spinner-page" /></div>
      </div>
    );
  }

  if (!employee) return null;

  return (
    <div className="app-layout">
      <AppHeader />
      <main className="app-content">
        <div className="detail-layout">
          <button className="back-btn" onClick={() => navigate('/home')}>
            <ArrowLeft size={16} /> Voltar
          </button>

          <div className="card">
            {/* Hero */}
            <div className="detail-hero">
              <Avatar src={employee.photo_url} name={employee.name} size={120} />
              <div className="detail-hero-info">
                <h1 className="detail-name">{employee.name}</h1>
                <p className="detail-role">{employee.role || '—'}</p>
                <div className="detail-badges">
                  {employee.level && (
                    <span className={`badge badge-level-${levelClass(employee.level)}`}>
                      {employee.level}
                    </span>
                  )}
                  {employee.team && (
                    <span className={`badge badge-team-${teamClass(employee.team)}`}>
                      {employee.team}
                    </span>
                  )}
                  {employee.is_manager && (
                    <span
                      style={{
                        display: 'inline-flex', alignItems: 'center', gap: '4px',
                        fontSize: '10px', fontWeight: 700, letterSpacing: '0.05em',
                        textTransform: 'uppercase', padding: '3px 10px', borderRadius: '999px',
                        background: 'var(--primary-subtle)', color: 'var(--primary)',
                      }}
                    >
                      <Star size={10} /> Gestor
                    </span>
                  )}
                </div>
                <div className="detail-actions">
                  <button
                    id="btn-edit-employee"
                    className="btn btn-outline"
                    onClick={() => setEditOpen(true)}
                  >
                    <Pencil size={14} /> Editar
                  </button>
                  <button
                    id="btn-delete-employee"
                    className="btn btn-danger"
                    onClick={() => setConfirmOpen(true)}
                  >
                    <Trash2 size={14} /> Excluir
                  </button>
                </div>
              </div>
            </div>

            {/* Bio */}
            {employee.bio && (
              <div className="detail-section">
                <div className="detail-section-title">Sobre</div>
                <p style={{ fontSize: 'var(--fs-sm)', color: 'var(--text-secondary)', lineHeight: 1.7 }}>
                  {employee.bio}
                </p>
              </div>
            )}

            {/* Contato */}
            <div className="detail-section">
              <div className="detail-section-title">Contato & Informações</div>
              <div className="detail-grid">
                <div className="detail-field">
                  <div className="detail-field-label" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Mail size={12} /> E-mail
                  </div>
                  <div className="detail-field-value">
                    <a href={`mailto:${employee.email}`} style={{ color: 'var(--primary)' }}>
                      {employee.email || '—'}
                    </a>
                  </div>
                </div>
                <div className="detail-field">
                  <div className="detail-field-label" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <MapPin size={12} /> Endereço
                  </div>
                  <div className="detail-field-value">{employee.address || '—'}</div>
                </div>
                <div className="detail-field">
                  <div className="detail-field-label">Cargo</div>
                  <div className="detail-field-value">{employee.role || '—'}</div>
                </div>
                <div className="detail-field">
                  <div className="detail-field-label">Nível</div>
                  <div className="detail-field-value">{employee.level || '—'}</div>
                </div>
                <div className="detail-field">
                  <div className="detail-field-label">Time</div>
                  <div className="detail-field-value">{employee.team || '—'}</div>
                </div>
                <div className="detail-field">
                  <div className="detail-field-label">Gestor do Time</div>
                  <div className="detail-field-value">{employee.is_manager ? 'Sim' : 'Não'}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {editOpen && (
        <EmployeeModal
          employee={employee}
          onClose={() => setEditOpen(false)}
          onSaved={(updated) => setEmployee(updated)}
        />
      )}

      {confirmOpen && (
        <ConfirmDialog
          title="Excluir Colaborador"
          description={`Tem certeza que deseja excluir "${employee.name}"? Esta ação não pode ser desfeita.`}
          loading={deleting}
          onConfirm={handleDelete}
          onCancel={() => setConfirmOpen(false)}
        />
      )}
    </div>
  );
}
