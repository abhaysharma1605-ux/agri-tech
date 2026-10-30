import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { LineChart, Line, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import api, { errMsg } from '../api';
import { useFetch } from '../hooks';
import { Loader, ErrorMsg, Modal, Field, StatusBadge } from '../components/Common';

const ratingColor = { low: 'danger', optimal: 'success', high: 'warning' };
const soilBlank = { ph: '', nitrogen: '', phosphorus: '', potassium: '', moisture: '', organicCarbon: '' };

export default function CropDetail() {
  const { t } = useTranslation();
  const { id } = useParams();
  const navigate = useNavigate();
  const { data, loading, error, reload } = useFetch(`/crops/${id}`);
  const [modal, setModal] = useState(null); // 'soil' | 'activity' | 'edit'
  const [soil, setSoil] = useState(soilBlank);
  const [act, setAct] = useState({ type: 'irrigation', description: '', date: new Date().toISOString().slice(0, 10) });
  const [status, setStatus] = useState({ status: '', actualYieldKg: '' });
  const [err, setErr] = useState('');

  const submit = async (fn) => {
    setErr('');
    try {
      await fn();
      setModal(null);
      reload();
    } catch (e) {
      setErr(errMsg(e));
    }
  };

  const addSoil = (e) => {
    e.preventDefault();
    const payload = {};
    Object.entries(soil).forEach(([k, v]) => v !== '' && (payload[k] = Number(v)));
    submit(() => api.post(`/crops/${id}/soil`, payload).then(() => setSoil(soilBlank)));
  };
  const addActivity = (e) => {
    e.preventDefault();
    submit(() => api.post(`/crops/${id}/activities`, act));
  };
  const updateStatus = (e) => {
    e.preventDefault();
    const payload = { status: status.status };
    if (status.actualYieldKg !== '') payload.actualYieldKg = Number(status.actualYieldKg);
    submit(() => api.put(`/crops/${id}`, payload));
  };
  const del = async () => {
    if (!window.confirm(t('common.confirmDelete'))) return;
    await api.delete(`/crops/${id}`);
    navigate('/crops');
  };
  const delActivity = async (aid) => {
    await api.delete(`/crops/${id}/activities/${aid}`);
    reload();
  };

  if (loading) return <Loader />;
  if (error) return <ErrorMsg error={error} />;
  const { crop, soilAnalysis } = data;
  const trend = crop.soilReadings.map((r) => ({ date: new Date(r.date).toLocaleDateString(), pH: r.ph, Moisture: r.moisture }));

  return (
    <>
      <Link to="/crops" className="small">← {t('nav.crops')}</Link>
      <div className="d-flex flex-wrap justify-content-between align-items-center my-2">
        <h2 className="page-title mb-0">{crop.name} <StatusBadge status={crop.status} /></h2>
        <div className="d-flex gap-2">
          <button className="btn btn-outline-success" onClick={() => { setStatus({ status: crop.status, actualYieldKg: crop.actualYieldKg ?? '' }); setModal('edit'); }}>{t('common.edit')}</button>
          <button className="btn btn-outline-danger" onClick={del}>{t('common.delete')}</button>
        </div>
      </div>
      <p className="text-muted">{crop.variety} · {crop.season} · {t('crop.sowing')}: {new Date(crop.sowingDate).toLocaleDateString()}{crop.expectedYieldKg ? ` · ${t('crop.expYield')}: ${crop.expectedYieldKg}` : ''}{crop.actualYieldKg ? ` · ${t('crop.actYield')}: ${crop.actualYieldKg}` : ''}</p>

      <div className="row g-3">
        <div className="col-lg-6">
          <div className="card h-100"><div className="card-body">
            <div className="d-flex justify-content-between mb-2">
              <h5>{t('crop.soilTitle')}</h5>
              <button className="btn btn-sm btn-agri" onClick={() => { setErr(''); setModal('soil'); }}>+ {t('crop.addReading')}</button>
            </div>
            {soilAnalysis ? (
              <>
                <div className="d-flex align-items-center gap-3 mb-3">
                  <div className="display-6 fw-bold text-success">{soilAnalysis.score}</div>
                  <div><div className="text-muted small">{t('crop.score')}</div><strong>{soilAnalysis.grade}</strong></div>
                </div>
                <div className="d-flex flex-wrap gap-2 mb-3">
                  {soilAnalysis.findings.map((f) => <span key={f.parameter} className={`badge text-bg-${ratingColor[f.rating]}`}>{f.parameter}: {f.value} ({f.rating})</span>)}
                </div>
                <h6>{t('crop.recs')}</h6>
                <ul className="mb-3">{soilAnalysis.recommendations.map((r, i) => <li key={i}>{r}</li>)}</ul>
                {trend.length > 1 && (
                  <ResponsiveContainer width="100%" height={180}>
                    <LineChart data={trend}><XAxis dataKey="date" /><YAxis /><Tooltip /><Legend /><Line dataKey="pH" stroke="#2e7d32" /><Line dataKey="Moisture" stroke="#1976d2" /></LineChart>
                  </ResponsiveContainer>
                )}
              </>
            ) : <p className="text-muted">{t('common.none')}</p>}
          </div></div>
        </div>
        <div className="col-lg-6">
          <div className="card h-100"><div className="card-body">
            <div className="d-flex justify-content-between mb-2">
              <h5>{t('crop.activities')}</h5>
              <button className="btn btn-sm btn-agri" onClick={() => { setErr(''); setModal('activity'); }}>+ {t('crop.addActivity')}</button>
            </div>
            {crop.activities.length ? (
              <ul className="list-group list-group-flush">
                {[...crop.activities].reverse().map((a) => (
                  <li key={a._id} className="list-group-item d-flex justify-content-between align-items-start px-0">
                    <div><span className="badge text-bg-light text-capitalize me-2">{a.type}</span>{a.description}<div className="small text-muted">{new Date(a.date).toLocaleDateString()}</div></div>
                    <button className="btn btn-sm btn-link text-danger" aria-label={t('common.delete')} onClick={() => delActivity(a._id)}>✕</button>
                  </li>
                ))}
              </ul>
            ) : <p className="text-muted">{t('common.none')}</p>}
          </div></div>
        </div>
      </div>

      {modal === 'soil' && (
        <Modal title={t('crop.addReading')} onClose={() => setModal(null)}>
          <ErrorMsg error={err} />
          <form onSubmit={addSoil}>
            <div className="row">
              {[['ph', 'pH', '0.1', 14], ['moisture', 'Moisture %', '0.1', 100], ['nitrogen', 'N (kg/ha)', '1'], ['phosphorus', 'P (kg/ha)', '1'], ['potassium', 'K (kg/ha)', '1'], ['organicCarbon', 'Organic C %', '0.01', 100]].map(([k, label, step, max]) => (
                <div className="col-6" key={k}><Field label={label}><input type="number" min="0" max={max} step={step} className="form-control" value={soil[k]} onChange={(e) => setSoil({ ...soil, [k]: e.target.value })} /></Field></div>
              ))}
            </div>
            <div className="text-end"><button className="btn btn-agri">{t('common.save')}</button></div>
          </form>
        </Modal>
      )}
      {modal === 'activity' && (
        <Modal title={t('crop.addActivity')} onClose={() => setModal(null)}>
          <ErrorMsg error={err} />
          <form onSubmit={addActivity}>
            <Field label={t('crop.type')}><select className="form-select" value={act.type} onChange={(e) => setAct({ ...act, type: e.target.value })}>{['sowing', 'irrigation', 'fertilizer', 'pesticide', 'weeding', 'harvest', 'other'].map((s) => <option key={s}>{s}</option>)}</select></Field>
            <Field label={t('common.details')}><input type="date" className="form-control" value={act.date} onChange={(e) => setAct({ ...act, date: e.target.value })} /></Field>
            <Field label={t('crop.description')}><textarea className="form-control" rows="2" value={act.description} onChange={(e) => setAct({ ...act, description: e.target.value })} /></Field>
            <div className="text-end"><button className="btn btn-agri">{t('common.save')}</button></div>
          </form>
        </Modal>
      )}
      {modal === 'edit' && (
        <Modal title={t('common.edit')} onClose={() => setModal(null)}>
          <ErrorMsg error={err} />
          <form onSubmit={updateStatus}>
            <Field label={t('common.status')}><select className="form-select" value={status.status} onChange={(e) => setStatus({ ...status, status: e.target.value })}>{['planned', 'growing', 'harvested', 'failed'].map((s) => <option key={s}>{s}</option>)}</select></Field>
            <Field label={t('crop.actYield')}><input type="number" min="0" className="form-control" value={status.actualYieldKg} onChange={(e) => setStatus({ ...status, actualYieldKg: e.target.value })} /></Field>
            <div className="text-end"><button className="btn btn-agri">{t('common.save')}</button></div>
          </form>
        </Modal>
      )}
    </>
  );
}
