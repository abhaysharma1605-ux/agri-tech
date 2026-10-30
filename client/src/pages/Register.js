import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';
import { errMsg } from '../api';
import { ErrorMsg } from '../components/Common';

export default function Register() {
  const { t, i18n } = useTranslation();
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '', phone: '', state: '', district: '' });
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    if (form.password.length < 6) return setError('Password must be at least 6 characters');
    setBusy(true);
    setError('');
    try {
      const { state, district, ...rest } = form;
      await register({ ...rest, language: i18n.language, location: { state, district } });
      navigate('/');
    } catch (err) {
      setError(errMsg(err));
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="row justify-content-center">
      <div className="col-md-8 col-lg-6">
        <div className="card p-4">
          <h3 className="page-title mb-3">{t('auth.registerTitle')}</h3>
          <ErrorMsg error={error} />
          <form onSubmit={submit}>
            <div className="row g-3">
              <div className="col-12"><label className="form-label">{t('common.name')}</label><input className="form-control" required value={form.name} onChange={set('name')} /></div>
              <div className="col-md-6"><label className="form-label">{t('common.email')}</label><input type="email" className="form-control" required value={form.email} onChange={set('email')} /></div>
              <div className="col-md-6"><label className="form-label">{t('common.phone')}</label><input className="form-control" value={form.phone} onChange={set('phone')} /></div>
              <div className="col-md-6"><label className="form-label">{t('farm.state')}</label><input className="form-control" value={form.state} onChange={set('state')} /></div>
              <div className="col-md-6"><label className="form-label">{t('farm.district')}</label><input className="form-control" value={form.district} onChange={set('district')} /></div>
              <div className="col-12"><label className="form-label">{t('common.password')}</label><input type="password" minLength={6} className="form-control" required value={form.password} onChange={set('password')} /></div>
            </div>
            <button className="btn btn-agri w-100 mt-3" disabled={busy}>{busy ? '...' : t('nav.register')}</button>
          </form>
          <p className="mt-3 mb-0 small">{t('auth.haveAccount')} <Link to="/login">{t('nav.login')}</Link></p>
        </div>
      </div>
    </div>
  );
}
