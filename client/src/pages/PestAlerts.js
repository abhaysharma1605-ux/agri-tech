import React from 'react';
import { useTranslation } from 'react-i18next';
import { useFetch } from '../hooks';
import { Loader, ErrorMsg, Empty, SeverityBadge } from '../components/Common';

export default function PestAlerts() {
  const { t } = useTranslation();
  const { data, loading, error } = useFetch('/alerts/mine');
  if (loading) return <Loader />;

  return (
    <>
      <h2 className="page-title mb-3">{t('alerts.title')}</h2>
      <ErrorMsg error={error} />
      {!data?.length && <Empty />}
      {(data || []).map((a) => (
        <div key={a._id} className={`card mb-3 severity-${a.severity}`}>
          <div className="card-body">
            <div className="d-flex justify-content-between">
              <h5>{a.title}</h5>
              <SeverityBadge level={a.severity} />
            </div>
            <p className="mb-2">{a.description}</p>
            {a.affectedCrops.length > 0 && <p className="small mb-1"><strong>{t('alerts.crops')}:</strong> {a.affectedCrops.join(', ')}</p>}
            {a.prevention && <p className="small mb-1"><strong>{t('alerts.prevention')}:</strong> {a.prevention}</p>}
            {a.treatment && <p className="small mb-0"><strong>{t('alerts.treatment')}:</strong> {a.treatment}</p>}
          </div>
        </div>
      ))}
    </>
  );
}
