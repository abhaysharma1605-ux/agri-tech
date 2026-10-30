import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import api, { errMsg } from '../api';
import { useAuth } from '../context/AuthContext';
import { useFetch } from '../hooks';
import { Loader, ErrorMsg, StatCard, Field, StatusBadge, SeverityBadge, Modal } from '../components/Common';

function Overview() {
  const { t } = useTranslation();
  const { data, loading, error } = useFetch('/admin/stats');
  if (loading) return <Loader />;
  if (error) return <ErrorMsg error={error} />;
  return (
    <>
      <div className="row g-3 mb-4">
        {[['👥', t('admin.users'), data.users], ['🚜', t('nav.farms'), data.farms], ['🌱', t('nav.crops'), data.crops], ['📦', t('admin.orders'), data.orders], ['💰', t('admin.revenue'), `₹${data.revenue}`], ['⏳', t('admin.pending'), data.pendingResources], ['🐛', t('admin.alerts'), data.activeAlerts], ['❓', t('nav.consult'), data.openConsultations]].map(([i, l, v]) => (
          <div className="col-6 col-md-3" key={l}><StatCard icon={i} label={l} value={v} /></div>
        ))}
      </div>
      <div className="row g-3">
        {[['Top crops', data.topCrops], ['Orders by status', data.ordersByStatus]].map(([title, d]) => (
          <div className="col-md-6" key={title}><div className="card"><div className="card-body">
            <h6>{title}</h6>
            <ResponsiveContainer width="100%" height={220}><BarChart data={d}><XAxis dataKey="name" /><YAxis allowDecimals={false} /><Tooltip /><Bar dataKey="value" fill="#2e7d32" /></BarChart></ResponsiveContainer>
          </div></div></div>
        ))}
      </div>
    </>
  );
}

function Users() {
  const { t } = useTranslation();
  const { user: me } = useAuth();
  const { data, loading, error, reload } = useFetch('/admin/users');
  const [show, setShow] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'expert' });
  const [err, setErr] = useState('');

  const act = (fn) => fn().then(reload).catch((e) => alert(errMsg(e)));
  const create = async (e) => {
    e.preventDefault();
    try { await api.post('/admin/users', form); setShow(false); setForm({ name: '', email: '', password: '', role: 'expert' }); reload(); } catch (er) { setErr(errMsg(er)); }
  };
  if (loading) return <Loader />;

  return (
    <>
      <ErrorMsg error={error} />
      <button className="btn btn-agri mb-3" onClick={() => { setErr(''); setShow(true); }}>+ {t('common.add')}</button>
      <div className="card"><div className="table-responsive"><table className="table align-middle mb-0">
        <thead><tr><th>{t('common.name')}</th><th>{t('common.email')}</th><th>{t('common.role')}</th><th>{t('common.status')}</th><th>{t('common.actions')}</th></tr></thead>
        <tbody>{(data || []).map((u) => (
          <tr key={u._id}>
            <td>{u.name}</td><td>{u.email}</td>
            <td><select className="form-select form-select-sm w-auto" value={u.role} disabled={u._id === me._id} onChange={(e) => act(() => api.put(`/admin/users/${u._id}`, { role: e.target.value }))}>{['farmer', 'expert', 'admin'].map((r) => <option key={r}>{r}</option>)}</select></td>
            <td><span className={`badge text-bg-${u.isActive ? 'success' : 'secondary'}`}>{u.isActive ? 'active' : 'inactive'}</span></td>
            <td className="text-nowrap">
              <button className="btn btn-sm btn-outline-secondary me-1" disabled={u._id === me._id} onClick={() => act(() => api.put(`/admin/users/${u._id}`, { isActive: !u.isActive }))}>{u.isActive ? t('admin.deactivate') : t('admin.activate')}</button>
              <button className="btn btn-sm btn-outline-danger" disabled={u._id === me._id} onClick={() => window.confirm(t('common.confirmDelete')) && act(() => api.delete(`/admin/users/${u._id}`))}>{t('common.delete')}</button>
            </td>
          </tr>))}
        </tbody></table></div></div>
      {show && (
        <Modal title={t('common.add')} onClose={() => setShow(false)}>
          <ErrorMsg error={err} />
          <form onSubmit={create}>
            <Field label={t('common.name')}><input className="form-control" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></Field>
            <Field label={t('common.email')}><input type="email" className="form-control" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} /></Field>
            <Field label={t('common.password')}><input type="password" minLength={6} className="form-control" required value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} /></Field>
            <Field label={t('common.role')}><select className="form-select" value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}>{['farmer', 'expert', 'admin'].map((r) => <option key={r}>{r}</option>)}</select></Field>
            <div className="text-end"><button className="btn btn-agri">{t('common.save')}</button></div>
          </form>
        </Modal>
      )}
    </>
  );
}

function Resources() {
  const { t } = useTranslation();
  const { data, loading, error, reload } = useFetch('/resources');
  const blank = { name: '', category: 'seeds', price: '', unit: 'kg', stock: '', description: '' };
  const [form, setForm] = useState(blank);
  const [err, setErr] = useState('');
  const act = (fn) => fn().then(reload).catch((e) => alert(errMsg(e)));
  const create = async (e) => {
    e.preventDefault();
    try { await api.post('/resources', { ...form, price: Number(form.price), stock: Number(form.stock || 0) }); setForm(blank); setErr(''); reload(); } catch (er) { setErr(errMsg(er)); }
  };
  if (loading) return <Loader />;
  return (
    <>
      <ErrorMsg error={error || err} />
      <form className="card card-body mb-3" onSubmit={create}>
        <div className="row g-2">
          <div className="col-md-3"><input className="form-control" placeholder={t('common.name')} required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></div>
          <div className="col-md-2"><select className="form-select" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>{['seeds', 'fertilizer', 'pesticide', 'equipment', 'tools', 'other'].map((c) => <option key={c}>{c}</option>)}</select></div>
          <div className="col-md-2"><input type="number" min="0" className="form-control" placeholder="₹ price" required value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} /></div>
          <div className="col-md-1"><input className="form-control" placeholder="unit" value={form.unit} onChange={(e) => setForm({ ...form, unit: e.target.value })} /></div>
          <div className="col-md-2"><input type="number" min="0" className="form-control" placeholder="stock" value={form.stock} onChange={(e) => setForm({ ...form, stock: e.target.value })} /></div>
          <div className="col-md-2"><button className="btn btn-agri w-100">{t('common.add')}</button></div>
        </div>
      </form>
      <div className="card"><div className="table-responsive"><table className="table align-middle mb-0">
        <thead><tr><th>{t('common.name')}</th><th>Category</th><th>₹</th><th>Stock</th><th>{t('common.status')}</th><th /></tr></thead>
        <tbody>{(data || []).map((r) => (
          <tr key={r._id}>
            <td>{r.name}</td><td>{r.category}</td><td>{r.price}/{r.unit}</td><td>{r.stock}</td>
            <td><span className={`badge text-bg-${r.isApproved ? 'success' : 'warning'}`}>{r.isApproved ? 'approved' : 'pending'}</span></td>
            <td className="text-nowrap">
              <button className="btn btn-sm btn-outline-success me-1" onClick={() => act(() => api.patch(`/resources/${r._id}/approve`, { isApproved: !r.isApproved }))}>{r.isApproved ? t('admin.hide') : t('admin.approve')}</button>
              <button className="btn btn-sm btn-outline-danger" onClick={() => window.confirm(t('common.confirmDelete')) && act(() => api.delete(`/resources/${r._id}`))}>{t('common.delete')}</button>
            </td>
          </tr>))}
        </tbody></table></div></div>
    </>
  );
}

function Orders() {
  const { t } = useTranslation();
  const { data, loading, error, reload } = useFetch('/orders');
  if (loading) return <Loader />;
  const change = (id, status) => api.patch(`/orders/${id}/status`, { status }).then(reload).catch((e) => alert(errMsg(e)));
  return (
    <>
      <ErrorMsg error={error} />
      <div className="card"><div className="table-responsive"><table className="table align-middle mb-0">
        <thead><tr><th>#</th><th>{t('common.name')}</th><th>{t('orders.items')}</th><th>{t('common.total')}</th><th>{t('common.status')}</th></tr></thead>
        <tbody>{(data || []).map((o) => (
          <tr key={o._id}>
            <td>{o._id.slice(-6).toUpperCase()}</td><td>{o.user?.name}</td>
            <td className="small">{o.items.map((i) => `${i.name}×${i.quantity}`).join(', ')}</td>
            <td>₹{o.totalAmount}</td>
            <td><select className="form-select form-select-sm w-auto" value={o.status} onChange={(e) => change(o._id, e.target.value)}>{['placed', 'confirmed', 'shipped', 'delivered', 'cancelled'].map((s) => <option key={s}>{s}</option>)}</select></td>
          </tr>))}
        </tbody></table></div></div>
    </>
  );
}

function Alerts() {
  const { t } = useTranslation();
  const { data, loading, error, reload } = useFetch('/alerts');
  const blank = { title: '', pest: '', description: '', severity: 'medium', affectedCrops: '', prevention: '', treatment: '' };
  const [form, setForm] = useState(blank);
  const [err, setErr] = useState('');
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });
  const create = async (e) => {
    e.preventDefault();
    try {
      await api.post('/alerts', { ...form, affectedCrops: form.affectedCrops.split(',').map((s) => s.trim()).filter(Boolean) });
      setForm(blank); setErr(''); reload();
    } catch (er) { setErr(errMsg(er)); }
  };
  const act = (fn) => fn().then(reload).catch((e) => alert(errMsg(e)));
  if (loading) return <Loader />;
  return (
    <>
      <ErrorMsg error={error || err} />
      <form className="card card-body mb-3" onSubmit={create}>
        <div className="row g-2">
          <div className="col-md-4"><input className="form-control" placeholder="Title" required value={form.title} onChange={set('title')} /></div>
          <div className="col-md-4"><input className="form-control" placeholder="Pest / disease" required value={form.pest} onChange={set('pest')} /></div>
          <div className="col-md-4"><select className="form-select" value={form.severity} onChange={set('severity')}>{['low', 'medium', 'high', 'critical'].map((s) => <option key={s}>{s}</option>)}</select></div>
          <div className="col-12"><textarea className="form-control" rows="2" placeholder={t('crop.description')} required value={form.description} onChange={set('description')} /></div>
          <div className="col-md-4"><input className="form-control" placeholder="Affected crops (comma separated)" value={form.affectedCrops} onChange={set('affectedCrops')} /></div>
          <div className="col-md-4"><input className="form-control" placeholder={t('alerts.prevention')} value={form.prevention} onChange={set('prevention')} /></div>
          <div className="col-md-4"><input className="form-control" placeholder={t('alerts.treatment')} value={form.treatment} onChange={set('treatment')} /></div>
          <div className="col-12 text-end"><button className="btn btn-agri">{t('common.add')}</button></div>
        </div>
      </form>
      {(data || []).map((a) => (
        <div key={a._id} className={`card mb-2 severity-${a.severity}`}><div className="card-body py-2 d-flex justify-content-between align-items-center">
          <div><strong>{a.title}</strong> <SeverityBadge level={a.severity} /> {!a.isActive && <span className="badge text-bg-secondary">inactive</span>}<div className="small text-muted">{a.pest}</div></div>
          <div className="text-nowrap">
            <button className="btn btn-sm btn-outline-secondary me-1" onClick={() => act(() => api.put(`/alerts/${a._id}`, { isActive: !a.isActive }))}>{a.isActive ? t('admin.deactivate') : t('admin.activate')}</button>
            <button className="btn btn-sm btn-outline-danger" onClick={() => window.confirm(t('common.confirmDelete')) && act(() => api.delete(`/alerts/${a._id}`))}>{t('common.delete')}</button>
          </div>
        </div></div>
      ))}
    </>
  );
}

function Moderation() {
  const { t } = useTranslation();
  const { data, loading, error, reload } = useFetch('/forum');
  if (loading) return <Loader />;
  const toggle = (p) => api.patch(`/forum/${p._id}/moderate`, { isHidden: !p.isHidden }).then(reload).catch((e) => alert(errMsg(e)));
  return (
    <>
      <ErrorMsg error={error} />
      {(data || []).map((p) => (
        <div key={p._id} className="card mb-2"><div className="card-body py-2 d-flex justify-content-between align-items-center">
          <div><strong>{p.title}</strong> {p.isHidden && <StatusBadge status="closed" />}<div className="small text-muted">{p.author?.name} · {p.commentCount} 💬</div></div>
          <button className="btn btn-sm btn-outline-secondary" onClick={() => toggle(p)}>{p.isHidden ? t('admin.show') : t('admin.hide')}</button>
        </div></div>
      ))}
    </>
  );
}

export default function Admin() {
  const { t } = useTranslation();
  const [tab, setTab] = useState('overview');
  const tabs = [['overview', t('nav.dashboard'), Overview], ['users', t('admin.users'), Users], ['resources', t('admin.resources'), Resources], ['orders', t('admin.orders'), Orders], ['alerts', t('admin.alerts'), Alerts], ['forum', t('admin.forum'), Moderation]];
  const Active = tabs.find((x) => x[0] === tab)[2];
  return (
    <>
      <h2 className="page-title mb-3">{t('admin.title')}</h2>
      <ul className="nav nav-pills mb-3 flex-wrap">
        {tabs.map(([k, label]) => (
          <li className="nav-item" key={k}><button className={`nav-link ${tab === k ? 'active bg-success' : 'text-success'}`} onClick={() => setTab(k)}>{label}</button></li>
        ))}
      </ul>
      <Active />
    </>
  );
}
