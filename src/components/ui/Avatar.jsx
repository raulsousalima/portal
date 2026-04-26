import { getInitials } from '../../lib/utils';

export default function Avatar({ src, name, size = 40, className = '' }) {
  const initials = getInitials(name);

  if (src) {
    return (
      <img
        src={src}
        alt={name}
        className={`avatar ${className}`}
        style={{ width: size, height: size }}
        onError={(e) => {
          e.target.style.display = 'none';
          e.target.nextSibling?.style.removeProperty('display');
        }}
      />
    );
  }

  return (
    <div
      className={`avatar-fallback ${className}`}
      style={{
        width: size,
        height: size,
        fontSize: size * 0.36,
      }}
      aria-label={name}
    >
      {initials}
    </div>
  );
}
