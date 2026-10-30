import React from 'react';
import { useTranslation } from 'react-i18next';

export function Loader() {
  const { t } = useTranslation();
  return (
    <div className="text-center py-5 text-muted">
      <div className="spinner-border text-success me-2" role="status" aria-hidden="true" />
      {t('common.loading')}
    </div>
  );
}

export function ErrorMsg({ error }) {
  return error ? (
    <div className="alert alert-danger" role="alert">
      {error}
    </div>
  ) : null;
}

export function Empty() {
  const { t } = useTranslation();
  return <p className="text-muted text-center py-4">{t('common.none')}</p>;
}

export function StatCard({ label, value, icon }) {
  return (
    <div className="card stat-card h-100">
      <div className="card-body">
        <div className="text-muted small">{icon} {label}</div>
        <div className="stat-value">{value}</div>
      </div>
    </div>
  );
}

export function Modal({ title, onClose, children }) {
  return (
    <>
      <div className="modal d-block" tabIndex="-1" role="dialog" aria-modal="true">
        <div className="modal-dialog modal-dialog-scrollable">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">{title}</h5>
              <button type="button" className="btn-close" aria-label="Close" onClick={onClose} />
            </div>
            <div className="modal-body">{children}</div>
          </div>
        </div>
      </div>
      <div className="modal-backdrop show" onClick={onClose} />
    </>
  );
}

export function Field({ label, children }) {
  return (
    <div className="mb-3">
      <label className="form-label">{label}</label>
      {children}
    </div>
  );
}

const sevClass = { low: 'success', medium: 'warning', high: 'danger', critical: 'dark' };
export const SeverityBadge = ({ level }) => <span className={`badge text-bg-${sevClass[level] || 'secondary'}`}>{level}</span>;

const statusClass = { placed: 'secondary', confirmed: 'info', shipped: 'primary', delivered: 'success', cancelled: 'danger', open: 'warning', answered: 'success', closed: 'secondary', growing: 'success', planned: 'info', harvested: 'primary', failed: 'danger' };
export const StatusBadge = ({ status }) => <span className={`badge text-bg-${statusClass[status] || 'secondary'}`}>{status}</span>;
