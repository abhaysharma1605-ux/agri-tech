import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import api, { errMsg } from '../api';
import { useAuth } from '../context/AuthContext';
import { useFetch } from '../hooks';
import { Loader, ErrorMsg, Empty, Modal, Field, StatusBadge } from '../components/Common';

export default function Consultations() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const { data, loading, error, reload } = useFetch('/consultations');
  const [ask, setAsk] = useState(false);
  const [form, setForm] = useState({ subject: '', question: '', crop: '' });
  const [reply, setReply] = useState({ id: null, text: '' });
  const [err, setErr] = useState('');
  const canAnswer = user.role === 'expert' || user.role === 'admin';

  const send = async (e) => {
    e.preventDefault();
    try {
      await api.post('/consultations', form);
      setAsk(false);
      setForm({ subject: '', question: '', crop: '' });
      reload();
    } catch (er) {
      setErr(errMsg(er));
    }
  };

  const sendReply = async (e) => {
    e.preventDefault();
    try {
      await api.put(`/consultations/${reply.id}/answer`, { answer: reply.text });
      setReply({ id: null, text: '' });
      reload();
    } catch (er) {
      alert(errMsg(er));
    }
  };

  const close = async (id) => {
    await api.patch(`/consultations/${id}/close`);
    reload();
  };

  if (loading) return <Loader />;

  return (
    <>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2 className="page-title mb-0">{t('consult.title')}</h2>
        {user.role === 'farmer' && <button className="btn btn-agri" onClick={() => { setErr(''); setAsk(true); }}>+ {t('consult.ask')}</button>}
      </div>
      <ErrorMsg error={error} />
      {!data?.length && <Empty />}
      {(data || []).map((c) => (
        <div className="card mb-3" key={c._id}><div className="card-body">
          <div className="d-flex justify-content-between">
            <h5>{c.subject} {c.crop && <small className="text-muted">· {c.crop}</small>}</h5>
            <StatusBadge status={c.status} />
          </div>
          <p className="small text-muted mb-1">{c.farmer?.name} · {new Date(c.createdAt).toLocaleDateString()}</p>
          <p>{c.question}</p>
          {c.answer && <div className="alert alert-success py-2 mb-2"><strong>{t('consult.answer')}{c.expert ? ` (${c.expert.name})` : ''}:</strong> {c.answer}</div>}

          {canAnswer && c.status !== 'closed' && (reply.id === c._id ? (
            <form onSubmit={sendReply}>
              <textarea className="form-control mb-2" rows="3" required value={reply.text} onChange={(e) => setReply({ ...reply, text: e.target.value })} />
              <button className="btn btn-sm btn-agri me-2">{t('common.submit')}</button>
              <button type="button" className="btn btn-sm btn-light" onClick={() => setReply({ id: null, text: '' })}>{t('common.cancel')}</button>
            </form>
          ) : <button className="btn btn-sm btn-outline-success" onClick={() => setReply({ id: c._id, text: c.answer || '' })}>{t('consult.reply')}</button>)}
          {user.role === 'farmer' && c.status === 'answered' && <button className="btn btn-sm btn-outline-secondary" onClick={() => close(c._id)}>{t('consult.closed')}</button>}
        </div></div>
      ))}

      {ask && (
        <Modal title={t('consult.ask')} onClose={() => setAsk(false)}>
          <ErrorMsg error={err} />
          <form onSubmit={send}>
            <Field label={t('consult.subject')}><input className="form-control" required value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} /></Field>
            <Field label={t('nav.crops')}><input className="form-control" value={form.crop} onChange={(e) => setForm({ ...form, crop: e.target.value })} /></Field>
            <Field label={t('consult.question')}><textarea className="form-control" rows="4" required value={form.question} onChange={(e) => setForm({ ...form, question: e.target.value })} /></Field>
            <div className="text-end"><button className="btn btn-agri">{t('common.submit')}</button></div>
          </form>
        </Modal>
      )}
    </>
  );
}
