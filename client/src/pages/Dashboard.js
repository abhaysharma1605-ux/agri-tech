import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { useAuth } from '../context/AuthContext';
import { useFetch } from '../hooks';
import { Loader, ErrorMsg, StatCard, SeverityBadge } from '../components/Common';

const COLORS = ['#2e7d32', '#f9a825', '#1976d2', '#c62828', '#6d4c41'];

export default function Dashboard() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const farms = useFetch('/farms');
  const analytics = useFetch('/crops/analytics/summary');
  const alerts = useFetch('/alerts/mine');
  const orders = useFetch('/orders/mine');

  if (farms.loading || analytics.loading) return <Loader />;
  const a = analytics.data || { byStatus: [], bySeason: [], yields: [] };
  const growing = a.byStatus.find((s) => s.name === 'growing')?.value || 0;

  return (
    <>
      <h2 className="page-title mb-3">{t('dash.hello')}, {user.name} 👋</h2>
      <ErrorMsg error={farms.error || analytics.error} />

      <div className="row g-3 mb-4">
        <div className="col-6 col-md-3"><Link to="/farms" className="text-decoration-none"><StatCard icon="🚜" label={t('dash.farms')} value={farms.data?.length ?? 0} /></Link></div>
        <div className="col-6 col-md-3"><Link to="/crops" className="text-decoration-none"><StatCard icon="🌱" label={t('dash.crops')} value={growing} /></Link></div>
        <div className="col-6 col-md-3"><Link to="/alerts" className="text-decoration-none"><StatCard icon="🐛" label={t('dash.alerts')} value={alerts.data?.length ?? 0} /></Link></div>
        <div className="col-6 col-md-3"><Link to="/orders" className="text-decoration-none"><StatCard icon="📦" label={t('dash.orders')} value={orders.data?.length ?? 0} /></Link></div>
      </div>

      <div className="row g-3">
        <div className="col-lg-4">
          <div className="card h-100"><div className="card-body">
            <h6>{t('dash.cropStatus')}</h6>
            {a.byStatus.length ? (
              <ResponsiveContainer width="100%" height={240}>
                <PieChart>
                  <Pie data={a.byStatus} dataKey="value" nameKey="name" outerRadius={80} label>
                    {a.byStatus.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                  </Pie>
                  <Tooltip /><Legend />
                </PieChart>
              </ResponsiveContainer>
            ) : <p className="text-muted">{t('common.none')}</p>}
          </div></div>
        </div>
        <div className="col-lg-4">
          <div className="card h-100"><div className="card-body">
            <h6>{t('dash.cropSeason')}</h6>
            {a.bySeason.length ? (
              <ResponsiveContainer width="100%" height={240}>
                <BarChart data={a.bySeason}><XAxis dataKey="name" /><YAxis allowDecimals={false} /><Tooltip /><Bar dataKey="value" fill="#2e7d32" /></BarChart>
              </ResponsiveContainer>
            ) : <p className="text-muted">{t('common.none')}</p>}
          </div></div>
        </div>
        <div className="col-lg-4">
          <div className="card h-100"><div className="card-body">
            <h6>{t('dash.yield')}</h6>
            {a.yields.length ? (
              <ResponsiveContainer width="100%" height={240}>
                <BarChart data={a.yields}><XAxis dataKey="name" /><YAxis /><Tooltip /><Legend /><Bar dataKey="expected" fill="#f9a825" /><Bar dataKey="actual" fill="#2e7d32" /></BarChart>
              </ResponsiveContainer>
            ) : <p className="text-muted">{t('common.none')}</p>}
          </div></div>
        </div>
      </div>

      <h5 className="page-title mt-4">{t('dash.latestAlerts')}</h5>
      {(alerts.data || []).slice(0, 3).map((al) => (
        <div key={al._id} className={`card mb-2 severity-${al.severity}`}>
          <div className="card-body py-2 d-flex justify-content-between align-items-center">
            <div><strong>{al.title}</strong><div className="small text-muted">{al.description}</div></div>
            <SeverityBadge level={al.severity} />
          </div>
        </div>
      ))}
    </>
  );
}
