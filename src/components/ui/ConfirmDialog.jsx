import { Trash2 } from 'lucide-react';

export default function ConfirmDialog({ title, description, onConfirm, onCancel, loading }) {
  return (
    <div className="modal-overlay" onClick={onCancel}>
      <div className="confirm-box" onClick={(e) => e.stopPropagation()}>
        <div className="confirm-icon">
          <Trash2 size={24} />
        </div>
        <h2 className="confirm-title">{title}</h2>
        <p className="confirm-desc">{description}</p>
        <div className="confirm-actions">
          <button className="btn btn-outline" onClick={onCancel} disabled={loading}>
            Cancelar
          </button>
          <button className="btn btn-danger" onClick={onConfirm} disabled={loading}>
            {loading ? <span className="spinner" /> : null}
            Excluir
          </button>
        </div>
      </div>
    </div>
  );
}
