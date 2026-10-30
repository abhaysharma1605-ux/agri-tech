import React from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';
import api from '../api';

const LANGS = [
  { code: 'en', label: 'English' },
  { code: 'hi', label: 'हिन्दी' },
  { code: 'mr', label: 'मराठी' },
];

export default function Navbar() {
  const { t, i18n } = useTranslation();
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const changeLang = (e) => {
    i18n.changeLanguage(e.target.value);
    if (user) api.put('/auth/profile', { language: e.target.value }).catch(() => {});
  };

  const links = [];
  if (user) {
    links.push(['/', t('nav.dashboard')], ['/farms', t('nav.farms')], ['/crops', t('nav.crops')], ['/weather', t('nav.weather')], ['/alerts', t('nav.alerts')], ['/market', t('nav.market')], ['/orders', t('nav.orders')], ['/consult', t('nav.consult')], ['/forum', t('nav.forum')]);
    if (user.role === 'admin') links.push(['/admin', t('nav.admin')]);
  }

  return (
    <nav className="navbar navbar-expand-lg navbar-dark navbar-agri sticky-top">
      <div className="container-fluid px-3">
        <Link className="navbar-brand fw-bold" to="/">🌾 {t('appName')}</Link>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#nav" aria-controls="nav" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon" />
        </button>
        <div className="collapse navbar-collapse" id="nav">
          <ul className="navbar-nav me-auto">
            {links.map(([to, label]) => (
              <li className="nav-item" key={to}>
                <NavLink end={to === '/'} className="nav-link" to={to}>{label}</NavLink>
              </li>
            ))}
          </ul>
          <div className="d-flex align-items-center gap-2 py-2 py-lg-0">
            <select className="form-select form-select-sm" style={{ width: 110 }} value={i18n.language} onChange={changeLang} aria-label={t('common.language')}>
              {LANGS.map((l) => <option key={l.code} value={l.code}>{l.label}</option>)}
            </select>
            {user ? (
              <>
                <span className="text-white-50 small d-none d-lg-inline">{user.name} ({user.role})</span>
                <button className="btn btn-sm btn-outline-light" onClick={() => { logout(); navigate('/login'); }}>{t('nav.logout')}</button>
              </>
            ) : (
              <>
                <Link className="btn btn-sm btn-outline-light" to="/login">{t('nav.login')}</Link>
                <Link className="btn btn-sm btn-light" to="/register">{t('nav.register')}</Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
