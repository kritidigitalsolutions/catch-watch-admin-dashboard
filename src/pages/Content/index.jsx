import { useState, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Trash2, Edit, Eye, Star, Crown, Plus, X, Upload, Image, Video, Link as LinkIcon, Play } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import DataTable from '../../components/ui/DataTable';
import { StatusBadge } from '../../components/ui/Badge';
import { ConfirmModal } from '../../components/ui/Modal';
import { movies, webSeries, shortDramas } from '../../constants/mockData';
import toast from 'react-hot-toast';
import useThemeStore from '../../store/useThemeStore';

const tabs = [
  { key: 'movies', label: 'Movies' },
  { key: 'series', label: 'Web Series' },
  { key: 'dramas', label: 'Short Dramas' },
];

/* ── Reusable media upload tile ──────────────── */
function UploadTile({ label, field, accept, isVideo, value, onChange, isDark, border, textMuted }) {
  const ref = useRef();
  const inputBg = isDark ? '#0f172a' : '#f8fafc';

  const handleDrop = (e) => {
    e.preventDefault();
    e.currentTarget.style.borderColor = border;
    e.currentTarget.style.background = 'transparent';
    const file = e.dataTransfer.files[0];
    if (file) { onChange(file.name); toast.success(`${label}: ${file.name} selected`); }
  };

  return (
    <div>
      <p style={{ fontSize: '11px', fontWeight: 700, color: textMuted, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '8px' }}>{label}</p>

      {/* Zone */}
      <div
        onClick={() => ref.current?.click()}
        onDragOver={(e) => { e.preventDefault(); e.currentTarget.style.borderColor = '#f97316'; e.currentTarget.style.background = 'rgba(249,115,22,0.05)'; }}
        onDragLeave={(e) => { e.currentTarget.style.borderColor = border; e.currentTarget.style.background = 'transparent'; }}
        onDrop={handleDrop}
        style={{
          border: `2px dashed ${value ? '#f97316' : border}`,
          borderRadius: '12px', padding: '16px', textAlign: 'center',
          cursor: 'pointer', marginBottom: '8px',
          transition: 'border-color 0.2s, background 0.2s',
          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px',
          background: value ? (isDark ? 'rgba(249,115,22,0.06)' : 'rgba(249,115,22,0.03)') : 'transparent',
        }}
      >
        <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: isDark ? 'rgba(249,115,22,0.12)' : 'rgba(249,115,22,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#f97316' }}>
          {isVideo ? <Video size={14} /> : <Image size={14} />}
        </div>
        <p style={{ fontSize: '11px', color: value ? '#f97316' : textMuted, fontWeight: 600, margin: 0 }}>
          {value ? '✓ ' + (value.length > 32 ? value.slice(0, 32) + '...' : value) : 'Click or drag & drop'}
        </p>
        <p style={{ fontSize: '10px', color: textMuted, margin: 0 }}>
          {isVideo ? 'MP4, MKV, MOV' : 'JPG, PNG, WebP'}
        </p>
      </div>
      <input ref={ref} type="file" accept={accept} style={{ display: 'none' }}
        onChange={(e) => { const f = e.target.files[0]; if (f) { onChange(f.name); toast.success(`${label} selected: ${f.name}`); }}} />

      {/* URL input */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <LinkIcon size={12} color={textMuted} style={{ flexShrink: 0 }} />
        <input
          type="text"
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
          placeholder={`Paste ${isVideo ? 'video' : 'image'} URL`}
          style={{ flex: 1, padding: '7px 10px', borderRadius: '9px', border: `1px solid ${border}`, background: inputBg, color: isDark ? '#f1f5f9' : '#0f172a', fontSize: '12px', outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box' }}
          onFocus={(e) => { e.target.style.borderColor = '#f97316'; }}
          onBlur={(e) => { e.target.style.borderColor = border; }}
        />
      </div>
    </div>
  );
}

/* ── Video Player Component ──────────────── */
function VideoPreview({ url, label, isDark, border }) {
  const [playing, setPlaying] = useState(false);
  const videoRef = useRef();

  if (!url) return (
    <div style={{ borderRadius: '12px', border: `1px dashed ${border}`, padding: '24px', textAlign: 'center', color: isDark ? '#475569' : '#94a3b8', fontSize: '12px' }}>
      No {label} URL set
    </div>
  );

  // Check if it's a real video URL or just a filename
  const isRealUrl = url.startsWith('http') || url.startsWith('blob');

  if (!isRealUrl) return (
    <div style={{ borderRadius: '12px', border: `1px solid ${border}`, padding: '16px', background: isDark ? '#0f172a' : '#f8fafc', display: 'flex', alignItems: 'center', gap: '12px' }}>
      <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'rgba(249,115,22,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#f97316', flexShrink: 0 }}>
        <Play size={18} />
      </div>
      <div>
        <p style={{ fontSize: '12px', fontWeight: 600, color: isDark ? '#f1f5f9' : '#0f172a', margin: 0 }}>{url}</p>
        <p style={{ fontSize: '11px', color: isDark ? '#64748b' : '#94a3b8', marginTop: '3px' }}>File selected — will upload on save</p>
      </div>
    </div>
  );

  return (
    <div style={{ borderRadius: '12px', overflow: 'hidden', position: 'relative', background: '#000', border: `1px solid ${border}` }}>
      <video
        ref={videoRef}
        src={url}
        controls
        style={{ width: '100%', maxHeight: '200px', display: 'block', objectFit: 'contain' }}
      />
    </div>
  );
}

/* ── Image Preview Component ──────────────── */
function ImagePreview({ url, label, isDark, border }) {
  if (!url) return (
    <div style={{ borderRadius: '12px', border: `1px dashed ${border}`, padding: '20px', textAlign: 'center', color: isDark ? '#475569' : '#94a3b8', fontSize: '12px' }}>
      No {label} URL set
    </div>
  );

  const isRealUrl = url.startsWith('http') || url.startsWith('/') || url.startsWith('blob');

  if (!isRealUrl) return (
    <div style={{ borderRadius: '12px', border: `1px solid ${border}`, padding: '12px', background: isDark ? '#0f172a' : '#f8fafc', display: 'flex', alignItems: 'center', gap: '10px' }}>
      <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: 'rgba(99,102,241,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#6366f1', flexShrink: 0 }}>
        <Image size={16} />
      </div>
      <p style={{ fontSize: '12px', color: isDark ? '#f1f5f9' : '#0f172a', margin: 0, fontWeight: 500 }}>{url} — ready to upload</p>
    </div>
  );

  return (
    <div style={{ borderRadius: '12px', overflow: 'hidden', border: `1px solid ${border}` }}>
      <img src={url} alt={label} style={{ width: '100%', maxHeight: '160px', objectFit: 'cover', display: 'block' }}
        onError={(e) => { e.target.style.display = 'none'; e.target.parentNode.innerHTML = '<p style="padding:16px;color:#94a3b8;font-size:12px;text-align:center">Image could not be loaded</p>'; }} />
    </div>
  );
}

export default function ContentLibrary() {
  const { isDark }  = useThemeStore();
  const location    = useLocation();
  const navigate    = useNavigate();

  let activeTab = 'movies';
  if (location.pathname.endsWith('/series')) activeTab = 'series';
  else if (location.pathname.endsWith('/dramas')) activeTab = 'dramas';

  const setActiveTab = (tab) => navigate(`/content/${tab}`);

  const [movieList,   setMovieList]   = useState(movies);
  const [seriesList,  setSeriesList]  = useState(webSeries);
  const [dramaList,   setDramaList]   = useState(shortDramas);
  const [deleteModal, setDeleteModal] = useState({ open: false, item: null });
  const [viewModal,   setViewModal]   = useState(null);
  const [editModal,   setEditModal]   = useState(null);

  /* ── Colour tokens ──────────────────────── */
  const bg        = isDark ? '#1E293B' : '#ffffff';
  const border    = isDark ? '#334155' : '#e2e8f0';
  const textMain  = isDark ? '#f1f5f9' : '#0f172a';
  const textMuted = isDark ? '#94a3b8' : '#64748b';
  const hoverBg   = isDark ? 'rgba(51,65,85,0.5)' : '#f1f5f9';
  const inputBg   = isDark ? '#334155' : '#f8fafc';

  const getData = () => {
    if (activeTab === 'movies') return movieList;
    if (activeTab === 'series') return seriesList;
    return dramaList;
  };

  const handleDelete = (item) => {
    if (activeTab === 'movies') setMovieList((p) => p.filter((m) => m.id !== item.id));
    else if (activeTab === 'series') setSeriesList((p) => p.filter((s) => s.id !== item.id));
    else setDramaList((p) => p.filter((d) => d.id !== item.id));
    toast.success(`"${item.title}" deleted`);
    setDeleteModal({ open: false, item: null });
  };

  const handleSaveEdit = () => {
    if (!editModal) return;
    if (activeTab === 'movies')
      setMovieList((p) => p.map((m) => m.id === editModal.id ? editModal : m));
    else if (activeTab === 'series')
      setSeriesList((p) => p.map((s) => s.id === editModal.id ? editModal : s));
    else
      setDramaList((p) => p.map((d) => d.id === editModal.id ? editModal : d));
    toast.success(`"${editModal.title}" updated successfully`);
    setEditModal(null);
  };

  /* ── Table columns ──────────────────────── */
  const columns = [
    {
      header: 'Title', accessor: 'title',
      render: (row) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ width: '40px', height: '56px', borderRadius: '10px', flexShrink: 0, background: 'linear-gradient(135deg, #f97316, #ea580c)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
            <Star size={16} />
          </div>
          <div>
            <p style={{ fontSize: '13px', fontWeight: 700, color: textMain, margin: 0 }}>{row.title}</p>
            <p style={{ fontSize: '11px', color: textMuted, marginTop: '2px' }}>{row.language}</p>
          </div>
        </div>
      ),
    },
    { header: 'Genre',    accessor: 'genre',    render: (row) => <span style={{ fontSize: '12px', color: textMuted }}>{row.genre}</span> },
    { header: 'Year',     accessor: 'year',     render: (row) => <span style={{ fontSize: '12px', color: textMuted }}>{row.year}</span> },
    {
      header: 'Rating', accessor: 'rating',
      render: (row) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
          <Star size={13} color="#eab308" fill="#eab308" />
          <span style={{ fontSize: '13px', fontWeight: 600, color: textMain }}>{row.rating}</span>
        </div>
      ),
    },
    { header: 'Priority', accessor: 'priority', render: (row) => <span style={{ fontFamily: 'monospace', fontSize: '12px', color: textMuted }}>#{row.priority}</span> },
    {
      header: 'Premium', accessor: 'premium',
      render: (row) => row.premium
        ? <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '11px', fontWeight: 600, padding: '3px 10px', borderRadius: '999px', background: 'rgba(234,179,8,0.12)', color: '#d97706' }}><Crown size={11} /> Premium</span>
        : <span style={{ fontSize: '12px', color: textMuted }}>Free</span>,
    },
    { header: 'Status',   accessor: 'status',   render: (row) => <StatusBadge status={row.status} /> },
    ...(activeTab === 'series' ? [{ header: 'Episodes', accessor: 'episodes', render: (row) => <span style={{ fontSize: '12px', color: textMuted }}>S{row.seasons} · {row.episodes} eps</span> }] : []),
  ];

  /* ── Modal overlay shared style ─── */
  const overlay = { position: 'fixed', inset: 0, zIndex: 50, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px' };
  const backdropStyle = { position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.65)', backdropFilter: 'blur(5px)' };
  const modalBase = { position: 'relative', width: '100%', background: bg, border: `1px solid ${border}`, borderRadius: '22px', boxShadow: '0 25px 60px rgba(0,0,0,0.4)', overflowY: 'auto', boxSizing: 'border-box' };

  const CloseBtn = ({ onClick }) => (
    <button onClick={onClick}
      style={{ position: 'absolute', top: '16px', right: '16px', background: isDark ? '#334155' : '#f1f5f9', border: 'none', cursor: 'pointer', color: textMuted, display: 'flex', padding: '7px', borderRadius: '9px', transition: 'background 0.15s' }}
      onMouseEnter={(e) => { e.currentTarget.style.background = isDark ? '#475569' : '#e2e8f0'; }}
      onMouseLeave={(e) => { e.currentTarget.style.background = isDark ? '#334155' : '#f1f5f9'; }}
    >
      <X size={16} />
    </button>
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      style={{ flex: 1, overflowX: 'hidden', overflowY: 'auto', padding: '24px 24px 48px 24px', width: '100%', minWidth: 0, boxSizing: 'border-box' }}
    >
      <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '24px', minWidth: 0 }}>

        {/* ── Header ── */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <h1 style={{ fontSize: '26px', fontWeight: 700, color: textMain, margin: 0, letterSpacing: '-0.03em' }}>Content Library</h1>
            <p style={{ fontSize: '14px', color: textMuted, marginTop: '6px' }}>Manage all movies, series, and short dramas</p>
          </div>
          <button onClick={() => navigate('/content/add')}
            style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 20px', borderRadius: '12px', border: 'none', background: 'linear-gradient(135deg, #f97316, #ea580c)', color: '#fff', fontSize: '13px', fontWeight: 700, cursor: 'pointer', boxShadow: '0 4px 12px rgba(249,115,22,0.3)', transition: 'opacity 0.2s' }}
            onMouseEnter={(e) => { e.currentTarget.style.opacity = '0.88'; }}
            onMouseLeave={(e) => { e.currentTarget.style.opacity = '1'; }}
          >
            <Plus size={15} /> Add Content
          </button>
        </div>

        {/* ── Tabs ── */}
        <div style={{ display: 'flex', gap: '4px', background: isDark ? '#334155' : '#f1f5f9', borderRadius: '14px', padding: '4px', width: 'fit-content' }}>
          {tabs.map((tab) => {
            const active = activeTab === tab.key;
            return (
              <button key={tab.key} onClick={() => setActiveTab(tab.key)}
                style={{ padding: '9px 20px', borderRadius: '10px', border: 'none', background: active ? 'linear-gradient(135deg, #f97316, #ea580c)' : 'transparent', color: active ? '#fff' : textMuted, fontSize: '13px', fontWeight: 600, cursor: 'pointer', transition: 'all 0.18s', whiteSpace: 'nowrap', boxShadow: active ? '0 4px 10px rgba(249,115,22,0.25)' : 'none' }}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* ── Table ── */}
        <div style={{ background: bg, border: `1px solid ${border}`, borderRadius: '20px', padding: '24px', boxSizing: 'border-box', boxShadow: isDark ? 'none' : '0 1px 4px rgba(0,0,0,0.06)', minWidth: 0, overflow: 'hidden' }}>
          <DataTable
            columns={columns}
            data={getData()}
            searchPlaceholder="Search by title, genre, language..."
            actions={(row) => (
              <>
                <motion.button whileHover={{ scale: 1.15 }} whileTap={{ scale: 0.9 }}
                  title="View" onClick={() => setViewModal(row)}
                  style={{ padding: '6px 8px', borderRadius: '8px', background: 'none', border: 'none', color: textMuted, cursor: 'pointer', display: 'flex' }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = isDark ? 'rgba(99,102,241,0.15)' : 'rgba(99,102,241,0.08)'; e.currentTarget.style.color = '#6366f1'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = 'none'; e.currentTarget.style.color = textMuted; }}
                >
                  <Eye size={14} />
                </motion.button>
                <motion.button whileHover={{ scale: 1.15 }} whileTap={{ scale: 0.9 }}
                  title="Edit" onClick={() => setEditModal({ ...row, posterUrl: row.poster || '', bannerUrl: row.banner || '', trailerUrl: row.trailer || '', videoUrl: row.videoUrl || '' })}
                  style={{ padding: '6px 8px', borderRadius: '8px', background: 'none', border: 'none', color: '#3b82f6', cursor: 'pointer', display: 'flex' }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(59,130,246,0.1)'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = 'none'; }}
                >
                  <Edit size={14} />
                </motion.button>
                <motion.button whileHover={{ scale: 1.15 }} whileTap={{ scale: 0.9 }}
                  title="Delete" onClick={() => setDeleteModal({ open: true, item: row })}
                  style={{ padding: '6px 8px', borderRadius: '8px', background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', display: 'flex' }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(239,68,68,0.1)'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = 'none'; }}
                >
                  <Trash2 size={14} />
                </motion.button>
              </>
            )}
          />
        </div>

        <ConfirmModal
          isOpen={deleteModal.open}
          onClose={() => setDeleteModal({ open: false, item: null })}
          onConfirm={() => deleteModal.item && handleDelete(deleteModal.item)}
          title="Delete Content"
          message={`Are you sure you want to delete "${deleteModal.item?.title}"? This action cannot be undone.`}
          confirmText="Delete"
        />

        {/* ══════════ VIEW MODAL ══════════ */}
        <AnimatePresence>
          {viewModal && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={overlay}>
              <motion.div style={backdropStyle} onClick={() => setViewModal(null)} />
              <motion.div
                initial={{ opacity: 0, scale: 0.96, y: 24 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.96, y: 24 }}
                transition={{ type: 'spring', damping: 26, stiffness: 320 }}
                style={{ ...modalBase, maxWidth: '680px', padding: '28px', maxHeight: '90vh' }}
              >
                <CloseBtn onClick={() => setViewModal(null)} />

                {/* Title row */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '22px', paddingRight: '40px' }}>
                  <div style={{ width: '52px', height: '72px', borderRadius: '12px', background: 'linear-gradient(135deg, #f97316, #ea580c)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', flexShrink: 0 }}>
                    <Star size={22} />
                  </div>
                  <div>
                    <h2 style={{ fontSize: '19px', fontWeight: 800, color: textMain, margin: 0 }}>{viewModal.title}</h2>
                    <p style={{ fontSize: '12px', color: textMuted, marginTop: '4px' }}>{viewModal.language} · {viewModal.year} · {viewModal.genre}</p>
                    <div style={{ marginTop: '8px', display: 'flex', gap: '8px', alignItems: 'center' }}>
                      <StatusBadge status={viewModal.status} />
                      {viewModal.premium && (
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '11px', fontWeight: 600, padding: '2px 9px', borderRadius: '999px', background: 'rgba(234,179,8,0.12)', color: '#d97706' }}>
                          <Crown size={10} /> Premium
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Quick stats */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px', marginBottom: '22px' }}>
                  {[
                    { label: 'Rating',   value: `⭐ ${viewModal.rating}` },
                    { label: 'Priority', value: `#${viewModal.priority}` },
                    ...(viewModal.duration  ? [{ label: 'Duration',  value: viewModal.duration }] : []),
                    ...(viewModal.episodes ? [{ label: 'Episodes',   value: `${viewModal.episodes} eps` }] : []),
                    ...(viewModal.seasons  ? [{ label: 'Seasons',    value: `${viewModal.seasons}` }] : []),
                  ].map(({ label, value }) => (
                    <div key={label} style={{ padding: '10px 12px', borderRadius: '12px', background: isDark ? 'rgba(51,65,85,0.4)' : '#f8fafc', border: `1px solid ${border}`, textAlign: 'center' }}>
                      <p style={{ fontSize: '10px', color: textMuted, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', margin: '0 0 4px 0' }}>{label}</p>
                      <p style={{ fontSize: '13px', color: textMain, fontWeight: 700, margin: 0 }}>{value}</p>
                    </div>
                  ))}
                </div>

                {/* ── Media Sections ── */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>

                  {/* Banner */}
                  <div>
                    <p style={{ fontSize: '12px', fontWeight: 700, color: textMuted, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Image size={13} /> Banner / Poster
                    </p>
                    <ImagePreview url={viewModal.bannerUrl || viewModal.posterUrl} label="Banner" isDark={isDark} border={border} />
                  </div>

                  {/* Trailer */}
                  <div>
                    <p style={{ fontSize: '12px', fontWeight: 700, color: textMuted, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Play size={13} /> Trailer
                    </p>
                    <VideoPreview url={viewModal.trailerUrl} label="Trailer" isDark={isDark} border={border} />
                  </div>

                  {/* Full Video */}
                  <div>
                    <p style={{ fontSize: '12px', fontWeight: 700, color: textMuted, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Video size={13} /> {activeTab === 'series' ? 'Series Episodes' : 'Full Movie'}
                    </p>
                    <VideoPreview url={viewModal.videoUrl} label="Full Video" isDark={isDark} border={border} />
                  </div>
                </div>

                {/* Edit button */}
                <button
                  onClick={() => { setViewModal(null); setEditModal({ ...viewModal, posterUrl: viewModal.poster || '', bannerUrl: viewModal.banner || '', trailerUrl: viewModal.trailer || '', videoUrl: viewModal.videoUrl || '' }); }}
                  style={{ marginTop: '22px', width: '100%', padding: '13px', borderRadius: '13px', border: 'none', background: 'linear-gradient(135deg, #f97316, #ea580c)', color: '#fff', fontSize: '14px', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', boxShadow: '0 6px 18px rgba(249,115,22,0.3)', transition: 'opacity 0.2s' }}
                  onMouseEnter={(e) => { e.currentTarget.style.opacity = '0.9'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.opacity = '1'; }}
                >
                  <Edit size={15} /> Edit This Content
                </button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ══════════ EDIT MODAL ══════════ */}
        <AnimatePresence>
          {editModal && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={overlay}>
              <motion.div style={backdropStyle} onClick={() => setEditModal(null)} />
              <motion.div
                initial={{ opacity: 0, scale: 0.96, y: 24 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.96, y: 24 }}
                transition={{ type: 'spring', damping: 26, stiffness: 320 }}
                style={{ ...modalBase, maxWidth: '700px', padding: '28px', maxHeight: '92vh' }}
              >
                {/* Header */}
                <div style={{ marginBottom: '22px', paddingRight: '40px' }}>
                  <h2 style={{ fontSize: '19px', fontWeight: 800, color: textMain, margin: 0 }}>Edit Content</h2>
                  <p style={{ fontSize: '12px', color: textMuted, marginTop: '4px' }}>{editModal.title}</p>
                </div>
                <CloseBtn onClick={() => setEditModal(null)} />

                <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>

                  {/* ── Section: Basic Info ── */}
                  <div style={{ padding: '18px', borderRadius: '14px', border: `1px solid ${border}`, background: isDark ? 'rgba(51,65,85,0.2)' : '#f8fafc' }}>
                    <p style={{ fontSize: '12px', fontWeight: 700, color: '#f97316', textTransform: 'uppercase', letterSpacing: '0.06em', margin: '0 0 14px 0' }}>Basic Information</p>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>

                      {/* Title */}
                      <div>
                        <label style={{ fontSize: '11px', fontWeight: 700, color: textMuted, textTransform: 'uppercase', letterSpacing: '0.06em', display: 'block', marginBottom: '6px' }}>Title</label>
                        <input value={editModal.title} onChange={(e) => setEditModal((p) => ({ ...p, title: e.target.value }))}
                          style={{ width: '100%', padding: '9px 12px', borderRadius: '10px', border: `1px solid ${border}`, background: inputBg, color: textMain, fontSize: '13px', outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box' }}
                          onFocus={(e) => { e.target.style.borderColor = '#f97316'; }}
                          onBlur={(e) => { e.target.style.borderColor = border; }}
                        />
                      </div>

                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px' }}>
                        {[
                          { label: 'Year',     field: 'year',     type: 'number' },
                          { label: 'Rating',   field: 'rating',   type: 'number' },
                          { label: 'Priority', field: 'priority', type: 'number' },
                        ].map(({ label, field, type }) => (
                          <div key={field}>
                            <label style={{ fontSize: '11px', fontWeight: 700, color: textMuted, textTransform: 'uppercase', letterSpacing: '0.06em', display: 'block', marginBottom: '6px' }}>{label}</label>
                            <input type={type} value={editModal[field] ?? ''} onChange={(e) => setEditModal((p) => ({ ...p, [field]: type === 'number' ? Number(e.target.value) : e.target.value }))}
                              style={{ width: '100%', padding: '9px 12px', borderRadius: '10px', border: `1px solid ${border}`, background: inputBg, color: textMain, fontSize: '13px', outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box' }}
                              onFocus={(e) => { e.target.style.borderColor = '#f97316'; }}
                              onBlur={(e) => { e.target.style.borderColor = border; }}
                            />
                          </div>
                        ))}
                      </div>

                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                        {[
                          { label: 'Language', field: 'language' },
                          { label: 'Genre',    field: 'genre' },
                          ...(editModal.duration !== undefined ? [{ label: 'Duration', field: 'duration' }] : []),
                        ].map(({ label, field }) => (
                          <div key={field}>
                            <label style={{ fontSize: '11px', fontWeight: 700, color: textMuted, textTransform: 'uppercase', letterSpacing: '0.06em', display: 'block', marginBottom: '6px' }}>{label}</label>
                            <input value={editModal[field] ?? ''} onChange={(e) => setEditModal((p) => ({ ...p, [field]: e.target.value }))}
                              style={{ width: '100%', padding: '9px 12px', borderRadius: '10px', border: `1px solid ${border}`, background: inputBg, color: textMain, fontSize: '13px', outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box' }}
                              onFocus={(e) => { e.target.style.borderColor = '#f97316'; }}
                              onBlur={(e) => { e.target.style.borderColor = border; }}
                            />
                          </div>
                        ))}

                        <div>
                          <label style={{ fontSize: '11px', fontWeight: 700, color: textMuted, textTransform: 'uppercase', letterSpacing: '0.06em', display: 'block', marginBottom: '6px' }}>Status</label>
                          <select value={editModal.status} onChange={(e) => setEditModal((p) => ({ ...p, status: e.target.value }))}
                            style={{ width: '100%', padding: '9px 12px', borderRadius: '10px', border: `1px solid ${border}`, background: inputBg, color: textMain, fontSize: '13px', outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box' }}
                          >
                            {['Published', 'Draft', 'Coming Soon', 'Inactive'].map((s) => <option key={s} value={s}>{s}</option>)}
                          </select>
                        </div>
                      </div>

                      {/* Premium toggle */}
                      <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', padding: '10px 14px', borderRadius: '11px', border: `1px solid ${border}`, background: editModal.premium ? (isDark ? 'rgba(234,179,8,0.07)' : 'rgba(234,179,8,0.05)') : inputBg }}>
                        <input type="checkbox" checked={!!editModal.premium} onChange={(e) => setEditModal((p) => ({ ...p, premium: e.target.checked }))}
                          style={{ width: '16px', height: '16px', accentColor: '#f97316', cursor: 'pointer' }} />
                        <span style={{ fontSize: '13px', fontWeight: 600, color: textMain }}>Premium Content</span>
                        {editModal.premium && <Crown size={14} style={{ color: '#d97706', marginLeft: 'auto' }} />}
                      </label>
                    </div>
                  </div>

                  {/* ── Section: Visual Assets ── */}
                  <div style={{ padding: '18px', borderRadius: '14px', border: `1px solid ${border}`, background: isDark ? 'rgba(51,65,85,0.2)' : '#f8fafc' }}>
                    <p style={{ fontSize: '12px', fontWeight: 700, color: '#6366f1', textTransform: 'uppercase', letterSpacing: '0.06em', margin: '0 0 14px 0' }}>Visual Assets</p>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                      <UploadTile
                        label="Poster (Vertical)" field="posterUrl" accept="image/*" isVideo={false}
                        value={editModal.posterUrl}
                        onChange={(v) => setEditModal((p) => ({ ...p, posterUrl: v }))}
                        isDark={isDark} border={border} textMuted={textMuted}
                      />
                      <UploadTile
                        label="Banner (Horizontal)" field="bannerUrl" accept="image/*" isVideo={false}
                        value={editModal.bannerUrl}
                        onChange={(v) => setEditModal((p) => ({ ...p, bannerUrl: v }))}
                        isDark={isDark} border={border} textMuted={textMuted}
                      />
                    </div>
                  </div>

                  {/* ── Section: Video Assets ── */}
                  <div style={{ padding: '18px', borderRadius: '14px', border: `1px solid ${border}`, background: isDark ? 'rgba(51,65,85,0.2)' : '#f8fafc' }}>
                    <p style={{ fontSize: '12px', fontWeight: 700, color: '#22c55e', textTransform: 'uppercase', letterSpacing: '0.06em', margin: '0 0 14px 0' }}>Video Assets</p>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                      <UploadTile
                        label="Trailer Video" field="trailerUrl" accept="video/*" isVideo={true}
                        value={editModal.trailerUrl}
                        onChange={(v) => setEditModal((p) => ({ ...p, trailerUrl: v }))}
                        isDark={isDark} border={border} textMuted={textMuted}
                      />
                      <UploadTile
                        label={activeTab === 'series' ? 'Series / Episode Video' : 'Full Movie Video'} field="videoUrl" accept="video/*" isVideo={true}
                        value={editModal.videoUrl}
                        onChange={(v) => setEditModal((p) => ({ ...p, videoUrl: v }))}
                        isDark={isDark} border={border} textMuted={textMuted}
                      />
                    </div>
                  </div>
                </div>

                {/* Action buttons */}
                <div style={{ display: 'flex', gap: '10px', marginTop: '22px' }}>
                  <button onClick={() => setEditModal(null)}
                    style={{ flex: 1, padding: '13px', borderRadius: '12px', border: `1px solid ${border}`, background: 'transparent', color: textMuted, fontSize: '13px', fontWeight: 600, cursor: 'pointer', transition: 'background 0.15s' }}
                    onMouseEnter={(e) => { e.currentTarget.style.background = isDark ? '#334155' : '#f1f5f9'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
                  >
                    Cancel
                  </button>
                  <button onClick={handleSaveEdit}
                    style={{ flex: 2, padding: '13px', borderRadius: '12px', border: 'none', background: 'linear-gradient(135deg, #f97316, #ea580c)', color: '#fff', fontSize: '14px', fontWeight: 700, cursor: 'pointer', boxShadow: '0 6px 18px rgba(249,115,22,0.3)', transition: 'opacity 0.2s' }}
                    onMouseEnter={(e) => { e.currentTarget.style.opacity = '0.9'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.opacity = '1'; }}
                  >
                    💾 Save Changes
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </motion.div>
  );
}
