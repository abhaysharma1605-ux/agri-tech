import React from 'react';
import { useTranslation } from 'react-i18next';
import api, { errMsg } from '../api';
import { useFetch } from '../hooks';
import { Loader, ErrorMsg, Empty, StatusBadge } from '../components/Common';

const STEPS = ['placed', 'confirmed', 'shipped', 'delivered'];

export default function Orders() {
  const { t } = useTranslation();
  const { data, loading, error, reload } = useFetch('/orders/mine');

  const cancel = async (id) => {
    if (!window.confirm(t('common.confirmDelete'))) return;
    try {
      await api.patch(`/orders/${id}/cancel`);
      reload();
    } catch (e) {
      alert(errMsg(e));
    }
  };

  if (loading) return <Loader />;

  return (
    <>
      <h2 className="page-title mb-3">{t('orders.title')}</h2>
      <ErrorMsg error={error} />
      {!data?.length && <Empty />}
      {(data || []).map((o) => {
        const idx = STEPS.indexOf(o.status);
        return (
          <div className="card mb-3" key={o._id}><div className="card-body">
            <div className="d-flex justify-content-between flex-wrap">
              <div><strong>#{o._id.slice(-6).toUpperCase()}</strong> <span className="text-muted small">{new Date(o.createdAt).toLocaleString()}</span></div>
              <StatusBadge status={o.status} />
            </div>
            {o.status !== 'cancelled' && (
              <div className="progress my-3" style={{ height: 8 }} role="progressbar" aria-valuenow={idx + 1} aria-valuemin="0" aria-valuemax={STEPS.length}>
                <div className="progress-bar bg-success" style={{ width: `${((idx + 1) / STEPS.length) * 100}%` }} />
              </div>
            )}
            <ul className="mb-2 small">{o.items.map((i, k) => <li key={k}>{i.name} × {i.quantity} — ₹{i.price * i.quantity}</li>)}</ul>
            <div className="d-flex justify-content-between align-items-center">
              <strong>{t('common.total')}: ₹{o.totalAmount}</strong>
              {['placed', 'confirmed'].includes(o.status) && <button className="btn btn-sm btn-outline-danger" onClick={() => cancel(o._id)}>{t('orders.cancel')}</button>}
            </div>
          </div></div>
        );
      })}
    </>
  );
}
