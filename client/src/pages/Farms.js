import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import api, { errMsg } from '../api';
import { useFetch } from '../hooks';
import { Loader, ErrorMsg, Empty, Modal, Field } from '../components/Common';

const blank = { name: '', areaInAcres: '', soilType: 'loamy', irrigationType: 'rainfed', village: '', district: '', state: '', latitude: '', longitude: '' };

export default function Farms() {
  const { t } = useTranslation();
  const { data, loading, error, reload } = useFetch('/farms');
  const [editing, setEditing] = useState(null); // null | 'new' | farm
  const [form, setForm] = useState(blank);
  const [formError, setFormError] = useState('');
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const open = (farm) => {
    setFormError('');
    if (farm === 'new') setForm(blank);
    else setForm({ name: farm.name, areaInAcres: farm.areaInAcres, soilType: farm.soilType, irrigationType: farm.irrigationType, village: farm.location.village || '', district: farm.location.district || '', state: farm.location.state || '', latitude: farm.location.latitude, longitude: farm.location.longitude });
    setEditing(farm);
  };

  const locate = () => {
    if (!navigator.geolocation) return setFormError('Geolocation not supported');
    navigator.geolocation.getCurrentPosition(
      (p) => setForm((f) => ({ ...f, latitude: p.coords.latitude.toFixed(4), longitude: p.coords.longitude.toFixed(4) })),
      () => setFormError('Could not get your location')
    );
  };

  const save = async (e) => {
    e.preventDefault();
    const payload = {
      name: form.name,
      areaInAcres: Number(form.areaInAcres),
      soilType: form.soilType,
      irrigationType: form.irrigationType,
      location: { village: form.village, district: form.district, state: form.state, latitude: Number(form.latitude), longitude: Number(form.longitude) },
    };
    try {
      if (editing === 'new') await api.post('/farms', payload);
      else await api.put(`/farms/${editing._id}`, payload);
      setEditing(null);
      reload();
    } catch (err) {
      setFormError(errMsg(err));
    }
  };

  const remove = async (f) => {
    if (!window.confirm(t('common.confirmDelete'))) return;
    try {
      await api.delete(`/farms/${f._id}`);
      reload();
    } catch (err) {
      alert(errMsg(err));
    }
  };

  if (loading) return <Loader />;

  return (
    <>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2 className="page-title mb-0">{t('farm.title')}</h2>
        <button className="btn btn-agri" onClick={() => open('new')}>+ {t('farm.add')}</button>
      </div>
      <ErrorMsg error={error} />
      {!data?.length && <Empty />}
      <div className="row g-3">
        {(data || []).map((f) => (
          <div className="col-md-6 col-lg-4" key={f._id}>
            <div className="card h-100"><div className="card-body">
              <h5>{f.name}</h5>
              <p className="text-muted small mb-2">📍 {[f.location.village, f.location.district, f.location.state].filter(Boolean).join(', ') || `${f.location.latitude}, ${f.location.longitude}`}</p>
              <div className="mb-3">
                <span className="badge text-bg-light me-1">{f.areaInAcres} ac</span>
                <span className="badge text-bg-light me-1">{f.soilType}</span>
                <span className="badge text-bg-light">{f.irrigationType}</span>
              </div>
              <button className="btn btn-sm btn-outline-success me-2" onClick={() => open(f)}>{t('common.edit')}</button>
              <button className="btn btn-sm btn-outline-danger" onClick={() => remove(f)}>{t('common.delete')}</button>
            </div></div>
          </div>
        ))}
      </div>

      {editing && (
        <Modal title={editing === 'new' ? t('farm.add') : t('common.edit')} onClose={() => setEditing(null)}>
          <ErrorMsg error={formError} />
          <form onSubmit={save}>
            <Field label={t('common.name')}><input className="form-control" required value={form.name} onChange={set('name')} /></Field>
            <div className="row">
              <div className="col-6"><Field label={t('farm.area')}><input type="number" step="0.01" min="0.01" className="form-control" required value={form.areaInAcres} onChange={set('areaInAcres')} /></Field></div>
              <div className="col-6"><Field label={t('farm.soil')}>
                <select className="form-select" value={form.soilType} onChange={set('soilType')}>{['alluvial', 'black', 'red', 'laterite', 'sandy', 'clay', 'loamy'].map((s) => <option key={s}>{s}</option>)}</select>
              </Field></div>
              <div className="col-12"><Field label={t('farm.irrigation')}>
                <select className="form-select" value={form.irrigationType} onChange={set('irrigationType')}>{['rainfed', 'canal', 'drip', 'sprinkler', 'tubewell'].map((s) => <option key={s}>{s}</option>)}</select>
              </Field></div>
              <div className="col-4"><Field label={t('farm.village')}><input className="form-control" value={form.village} onChange={set('village')} /></Field></div>
              <div className="col-4"><Field label={t('farm.district')}><input className="form-control" value={form.district} onChange={set('district')} /></Field></div>
              <div className="col-4"><Field label={t('farm.state')}><input className="form-control" value={form.state} onChange={set('state')} /></Field></div>
              <div className="col-6"><Field label={t('farm.lat')}><input type="number" step="any" min="-90" max="90" className="form-control" required value={form.latitude} onChange={set('latitude')} /></Field></div>
              <div className="col-6"><Field label={t('farm.lon')}><input type="number" step="any" min="-180" max="180" className="form-control" required value={form.longitude} onChange={set('longitude')} /></Field></div>
            </div>
            <button type="button" className="btn btn-sm btn-outline-secondary mb-3" onClick={locate}>📍 {t('farm.useLocation')}</button>
            <div className="d-flex gap-2 justify-content-end">
              <button type="button" className="btn btn-light" onClick={() => setEditing(null)}>{t('common.cancel')}</button>
              <button className="btn btn-agri">{t('common.save')}</button>
            </div>
          </form>
        </Modal>
      )}
    </>
  );
}
