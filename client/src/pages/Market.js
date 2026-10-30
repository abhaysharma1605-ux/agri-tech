import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import api, { errMsg } from '../api';
import { useFetch } from '../hooks';
import { Loader, ErrorMsg, Empty } from '../components/Common';

const CATS = ['', 'seeds', 'fertilizer', 'pesticide', 'equipment', 'tools', 'other'];

export default function Market() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [category, setCategory] = useState('');
  const [q, setQ] = useState('');
  const url = `/resources?${category ? `category=${category}&` : ''}${q ? `q=${encodeURIComponent(q)}` : ''}`;
  const { data, loading, error } = useFetch(url);
  const [cart, setCart] = useState({}); // id -> {resource, quantity}
  const [address, setAddress] = useState('');
  const [msg, setMsg] = useState({ type: '', text: '' });

  const add = (r) => setCart((c) => ({ ...c, [r._id]: { resource: r, quantity: Math.min((c[r._id]?.quantity || 0) + 1, r.stock) } }));
  const setQty = (id, n) => setCart((c) => {
    const next = { ...c };
    if (n < 1) delete next[id];
    else next[id] = { ...next[id], quantity: Math.min(n, next[id].resource.stock) };
    return next;
  });

  const lines = Object.values(cart);
  const total = lines.reduce((s, l) => s + l.resource.price * l.quantity, 0);

  const checkout = async () => {
    setMsg({ type: '', text: '' });
    try {
      await api.post('/orders', { items: lines.map((l) => ({ resource: l.resource._id, quantity: l.quantity })), deliveryAddress: address });
      setCart({});
      setAddress('');
      setMsg({ type: 'success', text: t('market.placed') });
      setTimeout(() => navigate('/orders'), 800);
    } catch (e) {
      setMsg({ type: 'danger', text: errMsg(e) });
    }
  };

  return (
    <>
      <h2 className="page-title mb-3">{t('market.title')}</h2>
      <div className="row g-3">
        <div className="col-lg-8">
          <div className="d-flex gap-2 mb-3">
            <input className="form-control" placeholder={t('common.search')} value={q} onChange={(e) => setQ(e.target.value)} />
            <select className="form-select w-auto" value={category} onChange={(e) => setCategory(e.target.value)}>
              {CATS.map((c) => <option key={c} value={c}>{c || 'All'}</option>)}
            </select>
          </div>
          <ErrorMsg error={error} />
          {loading ? <Loader /> : !data?.length ? <Empty /> : (
            <div className="row g-3">
              {data.map((r) => (
                <div className="col-sm-6" key={r._id}>
                  <div className="card h-100"><div className="card-body d-flex flex-column">
                    <span className="badge text-bg-light align-self-start mb-1 text-capitalize">{r.category}</span>
                    <h6>{r.name}</h6>
                    <p className="small text-muted flex-grow-1">{r.description}</p>
                    <div className="d-flex justify-content-between align-items-center">
                      <div><strong>₹{r.price}</strong> <small className="text-muted">/ {r.unit}</small><div className="small">{t('market.stock')}: {r.stock}</div></div>
                      <button className="btn btn-sm btn-agri" disabled={r.stock < 1} onClick={() => add(r)}>{t('market.addToCart')}</button>
                    </div>
                  </div></div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="col-lg-4">
          <div className="card sticky-top" style={{ top: 80 }}><div className="card-body">
            <h5>🛒 {t('market.cart')}</h5>
            {!lines.length ? <p className="text-muted">{t('market.empty')}</p> : (
              <>
                {lines.map(({ resource: r, quantity }) => (
                  <div key={r._id} className="d-flex justify-content-between align-items-center mb-2">
                    <div className="small">{r.name}<div className="text-muted">₹{r.price} × {quantity}</div></div>
                    <div className="btn-group btn-group-sm">
                      <button className="btn btn-outline-secondary" aria-label="decrease" onClick={() => setQty(r._id, quantity - 1)}>−</button>
                      <span className="btn btn-light disabled">{quantity}</span>
                      <button className="btn btn-outline-secondary" aria-label="increase" onClick={() => setQty(r._id, quantity + 1)}>+</button>
                    </div>
                  </div>
                ))}
                <hr />
                <div className="d-flex justify-content-between mb-2"><strong>{t('common.total')}</strong><strong>₹{total}</strong></div>
                <textarea className="form-control mb-2" rows="2" placeholder={t('market.address')} value={address} onChange={(e) => setAddress(e.target.value)} />
                {msg.text && <div className={`alert alert-${msg.type} py-1`}>{msg.text}</div>}
                <button className="btn btn-agri w-100" disabled={!address.trim()} onClick={checkout}>{t('market.checkout')}</button>
              </>
            )}
          </div></div>
        </div>
      </div>
    </>
  );
}
