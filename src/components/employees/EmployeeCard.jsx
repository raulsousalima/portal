import { useNavigate } from 'react-router-dom';
import { Mail } from 'lucide-react';
import Avatar from '../ui/Avatar';
import { levelClass, teamClass } from '../../lib/utils';

export default function EmployeeCard({ employee }) {
  const navigate = useNavigate();

  return (
    <div
      className="card card-hover employee-card"
      onClick={() => navigate(`/employee/${employee.id}`)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && navigate(`/employee/${employee.id}`)}
      aria-label={`Ver perfil de ${employee.name}`}
    >
      <div className="employee-card-top">
        <Avatar src={employee.photo_url} name={employee.name} size={52} />
        <div className="employee-card-info" style={{ marginLeft: '12px' }}>
          <div className="employee-card-name truncate">{employee.name}</div>
          <div className="employee-card-role truncate">{employee.role || '—'}</div>
        </div>
        {employee.is_manager && (
          <span
            title="Gestor"
            style={{
              fontSize: '10px',
              fontWeight: 700,
              letterSpacing: '0.05em',
              textTransform: 'uppercase',
              padding: '3px 8px',
              borderRadius: '999px',
              background: 'var(--primary-subtle)',
              color: 'var(--primary)',
              flexShrink: 0,
            }}
          >
            Gestor
          </span>
        )}
      </div>

      <div className="employee-card-badges">
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
      </div>

      {employee.email && (
        <div className="employee-card-email">
          <Mail size={12} />
          <span className="truncate">{employee.email}</span>
        </div>
      )}
    </div>
  );
}
