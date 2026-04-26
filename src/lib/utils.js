/** Retorna as iniciais de um nome para o avatar fallback */
export function getInitials(name = '') {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((n) => n[0].toUpperCase())
    .join('');
}

/** Normaliza o nome do time para uso em classes CSS */
export function teamClass(team = '') {
  return team.toLowerCase().replace(/\s+/g, '-').replace(/ó/g, 'o');
}

/** Normaliza o nível para uso em classes CSS */
export function levelClass(level = '') {
  return level.toLowerCase().replace(/\s+/g, '-');
}

export const LEVELS = [
  'Junior', 'Pleno', 'Senior', 'Lead',
  'Coordenador', 'Head', 'Gerente', 'Diretor',
];

export const TEAMS = ['Design', 'Tecnologia', 'RH', 'Atendimento', 'Negócios'];

export const TEAM_EMOJIS = {
  Design: '🎨',
  Tecnologia: '💻',
  RH: '👥',
  Atendimento: '💬',
  'Negócios': '📈',
};

export const TEAM_COLORS = {
  Design:      { bg: 'rgba(236,72,153,0.12)', color: '#ec4899' },
  Tecnologia:  { bg: 'rgba(99,102,241,0.12)', color: '#818cf8' },
  RH:          { bg: 'rgba(20,184,166,0.12)', color: '#14b8a6' },
  Atendimento: { bg: 'rgba(245,158,11,0.12)', color: '#f59e0b' },
  'Negócios':  { bg: 'rgba(34,197,94,0.12)',  color: '#22c55e' },
};
