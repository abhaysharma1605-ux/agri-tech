import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';
import { errMsg } from '../api';
import { ErrorMsg } from '../components/Common';

export default function Login() {
  const { t } = useTranslation();
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    setError('');
    try {
      await login(form.email, form.password);
      navigate('/');
    } catch (err) {
      setError(errMsg(err));
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="row justify-content-center">
      <div className="col-md-6 col-lg-5">
        <div className="card p-4">
          <h3 className="page-title mb-3">{t('auth.loginTitle')}</h3>
          <ErrorMsg error={error} />
          <form onSubmit={submit}>
            <div className="mb-3">
              <label className="form-label" htmlFor="email">{t('common.email')}</label>
              <input id="email" type="email" className="form-control" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
            </div>
            <div className="mb-3">
              <label className="form-label" htmlFor="password">{t('common.password')}</label>
              <input id="password" type="password" className="form-control" required value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
            </div>
            <button className="btn btn-agri w-100" disabled={busy}>{busy ? '...' : t('nav.login')}</button>
          </form>
          <p className="mt-3 mb-1 small">{t('auth.noAccount')} <Link to="/register">{t('nav.register')}</Link></p>
          <details className="small text-muted">
            <summary>{t('auth.demo')}</summary>
            <div>admin@agritech.com / admin123</div>
            <div>expert@agritech.com / expert123</div>
            <div>farmer@agritech.com / farmer123</div>
          </details>
        </div>
      </div>
    </div>
  );
}
