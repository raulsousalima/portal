import { useState, useEffect, useCallback } from 'react';
import { Users, LayoutGrid, Plus, Filter } from 'lucide-react';
import AppHeader from '../components/ui/AppHeader';
import EmployeeCard from '../components/employees/EmployeeCard';
import EmployeeModal from '../components/employees/EmployeeModal';
import TeamCard from '../components/teams/TeamCard';
import { getEmployees, getTeams, deleteEmployee } from '../lib/employeeService';
import { LEVELS, TEAMS } from '../lib/utils';

export default function HomePage() {
  const [tab, setTab] = useState('employees'); // 'employees' | 'teams'
  const [employees, setEmployees] = useState([]);
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterTeam, setFilterTeam] = useState('');
  const [filterLevel, setFilterLevel] = useState('');
  const [modalOpen, setModalOpen] = useState(false);

  const fetchEmployees = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getEmployees({ search, team: filterTeam, level: filterLevel });
      setEmployees(data || []);
    } finally {
      setLoading(false);
    }
  }, [search, filterTeam, filterLevel]);

  const fetchTeams = useCallback(async () => {
    if (tab !== 'teams') return;
    setLoading(true);
    try {
      const data = await getTeams();
      setTeams(data || []);
    } finally {
      setLoading(false);
    }
  }, [tab]);

  useEffect(() => {
    if (tab === 'employees') fetchEmployees();
  }, [tab, fetchEmployees]);

  useEffect(() => {
    if (tab === 'teams') fetchTeams();
  }, [tab, fetchTeams]);

  function handleSearch(val) {
    setSearch(val);
  }

  function handleSaved() {
    fetchEmployees();
    if (tab === 'teams') fetchTeams();
  }

  return (
    <div className="app-layout">
      <AppHeader onSearch={tab === 'employees' ? handleSearch : undefined} />

      <main className="app-content">
        {/* Page header */}
        <div className="page-header">
          <div>
            <h1 className="page-title">Portal RH</h1>
            <p className="page-subtitle">
              {tab === 'employees'
                ? `${employees.length} colaborador${employees.length !== 1 ? 'es' : ''} encontrado${employees.length !== 1 ? 's' : ''}`
                : `${teams.length} time${teams.length !== 1 ? 's' : ''} ativo${teams.length !== 1 ? 's' : ''}`}
            </p>
          </div>

          <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
            {/* Tabs */}
            <div className="tabs">
              <button
                id="tab-employees"
                className={`tab-btn ${tab === 'employees' ? 'active' : ''}`}
                onClick={() => setTab('employees')}
              >
                <Users size={15} /> Colaboradores
              </button>
              <button
                id="tab-teams"
                className={`tab-btn ${tab === 'teams' ? 'active' : ''}`}
                onClick={() => setTab('teams')}
              >
                <LayoutGrid size={15} /> Times
              </button>
            </div>

            {tab === 'employees' && (
              <button
                id="btn-add-employee"
                className="btn btn-primary"
                onClick={() => setModalOpen(true)}
              >
                <Plus size={15} /> Novo Colaborador
              </button>
            )}
          </div>
        </div>

        {/* Filters (employees tab only) */}
        {tab === 'employees' && (
          <div className="filters-bar">
            <span style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: 'var(--fs-xs)', color: 'var(--text-muted)' }}>
              <Filter size={12} /> Filtrar por
            </span>
            <button
              className={`filter-chip ${!filterTeam ? 'active' : ''}`}
              onClick={() => setFilterTeam('')}
            >
              Todos os Times
            </button>
            {TEAMS.map((t) => (
              <button
                key={t}
                className={`filter-chip ${filterTeam === t ? 'active' : ''}`}
                onClick={() => setFilterTeam(filterTeam === t ? '' : t)}
              >
                {t}
              </button>
            ))}

            <div style={{ width: '1px', height: '20px', background: 'var(--border)', margin: '0 4px' }} />

            <select
              className="form-select"
              value={filterLevel}
              onChange={(e) => setFilterLevel(e.target.value)}
              style={{ width: 'auto', padding: '6px 32px 6px 12px', fontSize: 'var(--fs-xs)' }}
              aria-label="Filtrar por nível"
            >
              <option value="">Todos os Níveis</option>
              {LEVELS.map((l) => (
                <option key={l} value={l}>{l}</option>
              ))}
            </select>
          </div>
        )}

        {/* Content */}
        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '80px' }}>
            <div className="spinner-page" />
          </div>
        ) : tab === 'employees' ? (
          employees.length > 0 ? (
            <div className="employees-grid">
              {employees.map((emp) => (
                <EmployeeCard key={emp.id} employee={emp} />
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <div className="empty-state-icon">👤</div>
              <h3>Nenhum colaborador encontrado</h3>
              <p>
                {search || filterTeam || filterLevel
                  ? 'Tente ajustar os filtros ou a busca.'
                  : 'Cadastre o primeiro colaborador clicando em "Novo Colaborador".'}
              </p>
              {!search && !filterTeam && !filterLevel && (
                <button className="btn btn-primary" onClick={() => setModalOpen(true)} style={{ marginTop: '8px' }}>
                  <Plus size={15} /> Novo Colaborador
                </button>
              )}
            </div>
          )
        ) : (
          teams.length > 0 ? (
            <div className="teams-grid">
              {teams.map((team) => (
                <TeamCard key={team.name} team={team} />
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <div className="empty-state-icon">🏢</div>
              <h3>Nenhum time encontrado</h3>
              <p>Cadastre colaboradores e organize-os por times.</p>
            </div>
          )
        )}
      </main>

      {/* Add/Edit Modal */}
      {modalOpen && (
        <EmployeeModal
          onClose={() => setModalOpen(false)}
          onSaved={handleSaved}
        />
      )}
    </div>
  );
}
