import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import api, { errMsg } from '../api';
import { useAuth } from '../context/AuthContext';
import { useFetch } from '../hooks';
import { Loader, ErrorMsg, Empty, Modal, Field } from '../components/Common';

function PostCard({ post, user, onChange }) {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const [detail, setDetail] = useState(null);
  const [text, setText] = useState('');

  const toggle = async () => {
    if (!open) {
      const { data } = await api.get(`/forum/${post._id}`);
      setDetail(data);
    }
    setOpen(!open);
  };
  const comment = async (e) => {
    e.preventDefault();
    await api.post(`/forum/${post._id}/comments`, { text });
    setText('');
    const { data } = await api.get(`/forum/${post._id}`);
    setDetail(data);
    onChange();
  };
  const remove = async () => {
    if (!window.confirm(t('common.confirmDelete'))) return;
    await api.delete(`/forum/${post._id}`);
    onChange();
  };

  return (
    <div className="card mb-3"><div className="card-body">
      <div className="d-flex justify-content-between">
        <h5 className="mb-1">{post.title}</h5>
        {(user.role === 'admin' || user._id === post.author?._id) && <button className="btn btn-sm btn-link text-danger" onClick={remove}>{t('common.delete')}</button>}
      </div>
      <div className="small text-muted mb-2">{post.author?.name} ({post.author?.role}) · {new Date(post.createdAt).toLocaleDateString()}</div>
      <p style={{ whiteSpace: 'pre-wrap' }}>{post.body}</p>
      <div className="mb-2">{post.tags.map((tg) => <span key={tg} className="badge text-bg-light me-1">#{tg}</span>)}</div>
      <button className="btn btn-sm btn-outline-success" onClick={toggle}>💬 {t('forum.comments')} ({detail ? detail.comments.length : post.commentCount})</button>
      {open && detail && (
        <div className="mt-3">
          {detail.comments.map((c) => (
            <div key={c._id} className="border-start border-3 border-success ps-2 mb-2">
              <div className="small text-muted">{c.author?.name} ({c.author?.role})</div>{c.text}
            </div>
          ))}
          <form onSubmit={comment} className="d-flex gap-2 mt-2">
            <input className="form-control" required placeholder={t('forum.comment')} value={text} onChange={(e) => setText(e.target.value)} />
            <button className="btn btn-agri">{t('forum.post')}</button>
          </form>
        </div>
      )}
    </div></div>
  );
}

export default function Forum() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [tag, setTag] = useState('');
  const { data, loading, error, reload } = useFetch(`/forum${tag ? `?tag=${encodeURIComponent(tag)}` : ''}`);
  const [show, setShow] = useState(false);
  const [form, setForm] = useState({ title: '', body: '', tags: '' });
  const [err, setErr] = useState('');

  const create = async (e) => {
    e.preventDefault();
    try {
      await api.post('/forum', { title: form.title, body: form.body, tags: form.tags.split(',') });
      setShow(false);
      setForm({ title: '', body: '', tags: '' });
      reload();
    } catch (er) {
      setErr(errMsg(er));
    }
  };

  return (
    <>
      <div className="d-flex justify-content-between align-items-center mb-3 gap-2">
        <h2 className="page-title mb-0">{t('forum.title')}</h2>
        <div className="d-flex gap-2">
          <input className="form-control" placeholder="#tag" value={tag} onChange={(e) => setTag(e.target.value.trim().toLowerCase())} />
          <button className="btn btn-agri text-nowrap" onClick={() => { setErr(''); setShow(true); }}>+ {t('forum.newPost')}</button>
        </div>
      </div>
      <ErrorMsg error={error} />
      {loading ? <Loader /> : !data?.length ? <Empty /> : data.map((p) => <PostCard key={p._id} post={p} user={user} onChange={reload} />)}

      {show && (
        <Modal title={t('forum.newPost')} onClose={() => setShow(false)}>
          <ErrorMsg error={err} />
          <form onSubmit={create}>
            <Field label={t('forum.postTitle')}><input className="form-control" required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} /></Field>
            <Field label={t('forum.body')}><textarea className="form-control" rows="5" required value={form.body} onChange={(e) => setForm({ ...form, body: e.target.value })} /></Field>
            <Field label={t('forum.tags')}><input className="form-control" value={form.tags} onChange={(e) => setForm({ ...form, tags: e.target.value })} /></Field>
            <div className="text-end"><button className="btn btn-agri">{t('forum.post')}</button></div>
          </form>
        </Modal>
      )}
    </>
  );
}
