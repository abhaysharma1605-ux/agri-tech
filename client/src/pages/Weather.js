import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { useFetch } from '../hooks';
import { Loader, ErrorMsg } from '../components/Common';

// WMO weather code -> emoji
const icon = (c) => (c === 0 ? '☀️' : c <= 3 ? '⛅' : c <= 48 ? '🌫️' : c <= 67 ? '🌧️' : c <= 77 ? '❄️' : c <= 82 ? '🌦️' : '⛈️');
const lvl = { warning: 'warning', info: 'info', success: 'success' };

export default function Weather() {
  const { t } = useTranslation();
  const farms = useFetch('/farms');
  const [farmId, setFarmId] = useState('');
  useEffect(() => {
    if (farms.data?.length && !farmId) setFarmId(farms.data[0]._id);
  }, [farms.data, farmId]);
  const w = useFetch(farmId ? `/weather/farm/${farmId}` : null, [farmId]);

  if (farms.loading) return <Loader />;
  if (!farms.data?.length) return <div className="alert alert-info">{t('weather.noFarm')}</div>;

  const cur = w.data?.weather.current;
  const daily = w.data?.weather.daily || [];

  return (
    <>
      <div className="d-flex flex-wrap justify-content-between align-items-center mb-3 gap-2">
        <h2 className="page-title mb-0">{t('weather.title')}</h2>
        <select className="form-select w-auto" value={farmId} onChange={(e) => setFarmId(e.target.value)} aria-label={t('weather.selectFarm')}>
          {farms.data.map((f) => <option key={f._id} value={f._id}>{f.name}</option>)}
        </select>
      </div>
      <ErrorMsg error={w.error} />
      {w.loading ? <Loader /> : w.data && (
        <>
          <div className="card mb-3"><div className="card-body d-flex flex-wrap align-items-center gap-4">
            <div className="display-4">{icon(cur.weatherCode)}</div>
            <div><div className="display-6 fw-bold">{cur.temperature}°C</div><div className="text-muted">{t('weather.now')}</div></div>
            <div>💧 {t('weather.humidity')}: <strong>{cur.humidity}%</strong></div>
            <div>💨 {t('weather.wind')}: <strong>{cur.windSpeed} km/h</strong></div>
            <div>🌧️ {t('weather.rain')}: <strong>{cur.precipitation} mm</strong></div>
          </div></div>

          <h5 className="page-title">{t('weather.advisories')}</h5>
          {w.data.advisories.map((a) => <div key={a.key} className={`alert alert-${lvl[a.level]} py-2`}>{a.message}</div>)}

          <h5 className="page-title mt-4">{t('weather.forecast')}</h5>
          <div className="d-flex gap-2 overflow-auto pb-2 mb-3">
            {daily.map((d) => (
              <div key={d.date} className="card weather-day text-center"><div className="card-body p-2">
                <div className="small text-muted">{new Date(d.date).toLocaleDateString(undefined, { weekday: 'short', day: 'numeric' })}</div>
                <div className="fs-3">{icon(d.weatherCode)}</div>
                <div><strong>{Math.round(d.tempMax)}°</strong> / {Math.round(d.tempMin)}°</div>
                <div className="small text-primary">🌧 {d.rainMm} mm ({d.rainProbability ?? 0}%)</div>
              </div></div>
            ))}
          </div>
          <div className="card"><div className="card-body">
            <ResponsiveContainer width="100%" height={220}>
              <AreaChart data={daily.map((d) => ({ date: d.date.slice(5), Max: d.tempMax, Min: d.tempMin }))}>
                <XAxis dataKey="date" /><YAxis unit="°" /><Tooltip /><Legend />
                <Area type="monotone" dataKey="Max" stroke="#e65100" fill="#ffcc80" />
                <Area type="monotone" dataKey="Min" stroke="#1976d2" fill="#bbdefb" />
              </AreaChart>
            </ResponsiveContainer>
          </div></div>
        </>
      )}
    </>
  );
}
