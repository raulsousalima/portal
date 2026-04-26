import { useNavigate } from 'react-router-dom';
import { Crown } from 'lucide-react';
import Avatar from '../ui/Avatar';
import { TEAM_EMOJIS, TEAM_COLORS } from '../../lib/utils';

export default function TeamCard({ team }) {
  const navigate = useNavigate();
  const emoji = TEAM_EMOJIS[team.name] || '🏢';
  const colors = TEAM_COLORS[team.name] || { bg: 'rgba(255,255,255,0.08)', color: '#fff' };
  const totalCount = (team.manager ? 1 : 0) + team.members.length;

  return (
    <div className="card team-card">
      <div className="team-card-header">
        <div
          className="team-icon"
          style={{ background: colors.bg, color: colors.color }}
        >
          {emoji}
        </div>
        <div>
          <div className="team-name">{team.name}</div>
          <div className="team-count">{totalCount} colaborador{totalCount !== 1 ? 'es' : ''}</div>
        </div>
      </div>

      {team.manager ? (
        <div
          className="team-manager"
          onClick={() => navigate(`/employee/${team.manager.id}`)}
          style={{ cursor: 'pointer' }}
        >
          <Avatar src={team.manager.photo_url} name={team.manager.name} size={36} />
          <div style={{ flex: 1, minWidth: 0 }}>
            <div className="team-manager-label" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Crown size={10} /> Gestor
            </div>
            <div className="team-manager-name truncate">{team.manager.name}</div>
          </div>
        </div>
      ) : (
        <div
          style={{
            padding: '12px 16px',
            background: 'var(--bg-hover)',
            borderRadius: 'var(--r-md)',
            marginBottom: '16px',
            fontSize: 'var(--fs-xs)',
            color: 'var(--text-muted)',
          }}
        >
          Sem gestor definido
        </div>
      )}

      <div className="team-members">
        {team.members.slice(0, 5).map((member) => (
          <div
            key={member.id}
            className="team-member"
            onClick={() => navigate(`/employee/${member.id}`)}
          >
            <Avatar src={member.photo_url} name={member.name} size={30} />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div className="team-member-name truncate">{member.name}</div>
              <div className="team-member-role truncate">{member.role || member.level || '—'}</div>
            </div>
          </div>
        ))}
        {team.members.length > 5 && (
          <div
            style={{
              fontSize: 'var(--fs-xs)',
              color: 'var(--text-muted)',
              textAlign: 'center',
              padding: '8px',
            }}
          >
            +{team.members.length - 5} mais
          </div>
        )}
        {team.members.length === 0 && !team.manager && (
          <div
            style={{
              fontSize: 'var(--fs-xs)',
              color: 'var(--text-muted)',
              textAlign: 'center',
              padding: '8px',
            }}
          >
            Time sem colaboradores
          </div>
        )}
      </div>
    </div>
  );
}
