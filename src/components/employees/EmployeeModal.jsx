import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { createEmployee, updateEmployee } from '../../lib/employeeService';
import { LEVELS, TEAMS } from '../../lib/utils';
import toast from 'react-hot-toast';

const EMPTY_FORM = {
  name: '',
  role: '',
  level: '',
  team: '',
  bio: '',
  email: '',
  address: '',
  photo_url: '',
  is_manager: false,
};

export default function EmployeeModal({ employee, onClose, onSaved }) {
  const isEdit = Boolean(employee);
  const [form, setForm] = useState(EMPTY_FORM);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (employee) {
      setForm({
        name: employee.name || '',
        role: employee.role || '',
        level: employee.level || '',
        team: employee.team || '',
        bio: employee.bio || '',
        email: employee.email || '',
        address: employee.address || '',
        photo_url: employee.photo_url || '',
        is_manager: employee.is_manager || false,
      });
    } else {
      setForm(EMPTY_FORM);
    }
  }, [employee]);

  function handleChange(e) {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim()) {
      toast.error('Nome e e-mail são obrigatórios.');
      return;
    }
    setLoading(true);
    try {
      let saved;
      if (isEdit) {
        saved = await updateEmployee(employee.id, form);
        toast.success('Colaborador atualizado!');
      } else {
        saved = await createEmployee(form);
        toast.success('Colaborador cadastrado!');
      }
      onSaved(saved);
      onClose();
    } catch (err) {
      toast.error(err.message || 'Erro ao salvar colaborador.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">{isEdit ? 'Editar Colaborador' : 'Novo Colaborador'}</h2>
          <button className="btn btn-ghost btn-icon" onClick={onClose} aria-label="Fechar">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            {/* Nome e Cargo */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div className="form-group">
                <label className="form-label" htmlFor="emp-name">Nome *</label>
                <input
                  id="emp-name"
                  className="form-input"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Nome completo"
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="emp-role">Cargo</label>
                <input
                  id="emp-role"
                  className="form-input"
                  name="role"
                  value={form.role}
                  onChange={handleChange}
                  placeholder="Ex: Designer UX"
                />
              </div>
            </div>

            {/* Nível e Time */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div className="form-group">
                <label className="form-label" htmlFor="emp-level">Nível</label>
                <select
                  id="emp-level"
                  className="form-select"
                  name="level"
                  value={form.level}
                  onChange={handleChange}
                >
                  <option value="">Selecionar...</option>
                  {LEVELS.map((l) => (
                    <option key={l} value={l}>{l}</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="emp-team">Time</label>
                <select
                  id="emp-team"
                  className="form-select"
                  name="team"
                  value={form.team}
                  onChange={handleChange}
                >
                  <option value="">Selecionar...</option>
                  {TEAMS.map((t) => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Email */}
            <div className="form-group">
              <label className="form-label" htmlFor="emp-email">E-mail *</label>
              <input
                id="emp-email"
                className="form-input"
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                placeholder="colaborador@empresa.com"
                required
              />
            </div>

            {/* URL da Foto */}
            <div className="form-group">
              <label className="form-label" htmlFor="emp-photo">URL da Foto</label>
              <input
                id="emp-photo"
                className="form-input"
                name="photo_url"
                value={form.photo_url}
                onChange={handleChange}
                placeholder="https://..."
              />
            </div>

            {/* Endereço */}
            <div className="form-group">
              <label className="form-label" htmlFor="emp-address">Endereço</label>
              <input
                id="emp-address"
                className="form-input"
                name="address"
                value={form.address}
                onChange={handleChange}
                placeholder="Cidade, Estado"
              />
            </div>

            {/* Bio */}
            <div className="form-group">
              <label className="form-label" htmlFor="emp-bio">Bio</label>
              <textarea
                id="emp-bio"
                className="form-input"
                name="bio"
                value={form.bio}
                onChange={handleChange}
                placeholder="Breve descrição sobre o colaborador..."
                rows={3}
              />
            </div>

            {/* Gestor */}
            <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
              <input
                type="checkbox"
                name="is_manager"
                checked={form.is_manager}
                onChange={handleChange}
                style={{ width: 16, height: 16, accentColor: 'var(--primary)' }}
              />
              <span style={{ fontSize: 'var(--fs-sm)', color: 'var(--text-secondary)' }}>
                Gestor do time (representante na aba Times)
              </span>
            </label>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-outline" onClick={onClose} disabled={loading}>
              Cancelar
            </button>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? <span className="spinner" /> : null}
              {isEdit ? 'Salvar Alterações' : 'Cadastrar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
