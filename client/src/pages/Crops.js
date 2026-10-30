import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import api, { errMsg } from '../api';
import { useFetch } from '../hooks';
import { Loader, ErrorMsg, Empty, Modal, Field, StatusBadge } from '../components/Common';

const blank = { farm: '', name: '', variety: '', season: 'kharif', sowingDate: '', expectedHarvestDate: '', expectedYieldKg: '' };

export default function Crops() {
  const { t } = useTranslation();
  const crops = useFetch('/crops');
  const farms = useFetch('/farms');
  const [show, setShow] = useState(false);
  const [form, setForm] = useState(blank);
  const [err, setErr] = useState('');
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const save = async (e) => {
    e.preventDefault();
    const payload = { ...form };
    ['expectedHarvestDate', 'expectedYieldKg', 'variety'].forEach((k) => !payload[k] && delete payload[k]);
    try {
      await api.post('/crops', payload);
      setShow(false);
      setForm(blank);
      crops.reload();
    } catch (er) {
      setErr(errMsg(er));
    }
  };

  if (crops.loading || farms.loading) return <Loader />;

  return (
    <>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2 className="page-title mb-0">{t('crop.title')}</h2>
        <button className="btn btn-agri" disabled={!farms.data?.length} onClick={() => { setErr(''); setForm({ ...blank, farm: farms.data[0]._id }); setShow(true); }}>+ {t('crop.add')}</button>
      </div>
      <ErrorMsg error={crops.error} />
      {!farms.data?.length && <div className="alert alert-info">{t('weather.noFarm')}</div>}
      {!crops.data?.length ? <Empty /> : (
        <div className="card"><div className="table-responsive">
          <table className="table table-hover align-middle mb-0">
            <thead><tr><th>{t('common.name')}</th><th>{t('crop.farm')}</th><th>{t('crop.season')}</th><th>{t('crop.sowing')}</th><th>{t('common.status')}</th></tr></thead>
            <tbody>
              {crops.data.map((c) => (
                <tr key={c._id}>
                  <td><Link to={`/crops/${c._id}`} className="fw-semibold text-success">{c.name}</Link> {c.variety && <small className="text-muted">({c.variety})</small>}</td>
                  <td>{c.farm?.name}</td>
                  <td className="text-capitalize">{c.season}</td>
                  <td>{new Date(c.sowingDate).toLocaleDateString()}</td>
                  <td><StatusBadge status={c.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div></div>
      )}

      {show && (
        <Modal title={t('crop.add')} onClose={() => setShow(false)}>
          <ErrorMsg error={err} />
          <form onSubmit={save}>
            <Field label={t('crop.farm')}><select className="form-select" value={form.farm} onChange={set('farm')}>{farms.data.map((f) => <option key={f._id} value={f._id}>{f.name}</option>)}</select></Field>
            <div className="row">
              <div className="col-7"><Field label={t('common.name')}><input className="form-control" required value={form.name} onChange={set('name')} /></Field></div>
              <div className="col-5"><Field label={t('crop.variety')}><input className="form-control" value={form.variety} onChange={set('variety')} /></Field></div>
              <div className="col-6"><Field label={t('crop.season')}><select className="form-select" value={form.season} onChange={set('season')}>{['kharif', 'rabi', 'zaid', 'perennial'].map((s) => <option key={s}>{s}</option>)}</select></Field></div>
              <div className="col-6"><Field label={t('crop.expYield')}><input type="number" min="0" className="form-control" value={form.expectedYieldKg} onChange={set('expectedYieldKg')} /></Field></div>
              <div className="col-6"><Field label={t('crop.sowing')}><input type="date" className="form-control" required value={form.sowingDate} onChange={set('sowingDate')} /></Field></div>
              <div className="col-6"><Field label={t('crop.harvest')}><input type="date" className="form-control" value={form.expectedHarvestDate} onChange={set('expectedHarvestDate')} /></Field></div>
            </div>
            <div className="d-flex gap-2 justify-content-end">
              <button type="button" className="btn btn-light" onClick={() => setShow(false)}>{t('common.cancel')}</button>
              <button className="btn btn-agri">{t('common.save')}</button>
            </div>
          </form>
        </Modal>
      )}
    </>
  );
}
