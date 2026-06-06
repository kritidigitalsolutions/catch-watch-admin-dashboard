import { useState, useRef } from 'react';
import { Upload, Plus, X, Image, Video, Link as LinkIcon, Send, FileText, Tag, TrendingUp, Star, Award, Flame, Sparkles, ChevronDown, ChevronUp, Users, ListVideo } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import useThemeStore from '../../store/useThemeStore';

/* ── Static data ──────────────────────────── */
const tabs      = [{ key: 'movie', label: 'Movie' }, { key: 'series', label: 'Web Series' }, { key: 'drama', label: 'Short Drama' }];
const genres    = ['Action', 'Comedy', 'Drama', 'Romance', 'Thriller', 'Horror', 'Sci-Fi', 'Mystery', 'Family', 'Adventure', 'War', 'Crime', 'Legal', 'Business'];
const languages = ['Hindi', 'English', 'Tamil', 'Telugu', 'Malayalam', 'Kannada', 'Marathi', 'Bengali', 'Punjabi'];

/* Predefined categories with icons */
const INITIAL_CATEGORIES = [
  { id: 'top10',       label: 'Top 10',       icon: Award,      color: '#f97316', isDefault: true },
  { id: 'trending',    label: 'Trending',      icon: TrendingUp, color: '#3b82f6', isDefault: true },
  { id: 'new',         label: 'New Release',   icon: Sparkles,   color: '#8b5cf6', isDefault: true },
  { id: 'featured',    label: 'Featured',      icon: Star,       color: '#eab308', isDefault: true },
  { id: 'hot',         label: 'Hot Right Now', icon: Flame,      color: '#ef4444', isDefault: true },
  { id: 'editors',     label: "Editor's Pick", icon: Tag,        color: '#22c55e', isDefault: true },
];

export default function AddContent() {
  const { isDark } = useThemeStore();
  const [activeTab, setActiveTab] = useState('movie');
  const [form, setForm] = useState({
    title: '', synopsis: '', language: 'Hindi', releaseYear: '2026', duration: '',
    genre: [], categories: [], imdbRating: '', priority: '', comingSoon: false, premium: false,
    posterUrl: '', bannerUrl: '', trailerUrl: '', videoUrl: '',
    cast: [{ name: '', photo: '' }],
  });
  const [episodes, setEpisodes] = useState([{ season: 1, episode: 1, title: '', videoUrl: '' }]);
  const [allCategories, setAllCategories] = useState(INITIAL_CATEGORIES);
  const [customCategories, setCustomCategories] = useState([]);
  const [newCategoryInput, setNewCategoryInput] = useState('');
  const [castBulkMode, setCastBulkMode] = useState(false);
  const [castBulkText, setCastBulkText] = useState('');
  const [episodeBulkMode, setEpisodeBulkMode] = useState(false);
  const [episodeBulkText, setEpisodeBulkText] = useState('');
  const castFileRef    = useRef(null);
  const episodeFileRef = useRef(null);

  /* ── Colour tokens ──────────────────────── */
  const bg        = isDark ? '#1E293B' : '#ffffff';
  const border    = isDark ? '#334155' : '#e2e8f0';
  const textMain  = isDark ? '#f1f5f9' : '#0f172a';
  const textMuted = isDark ? '#94a3b8' : '#64748b';
  const inputBg   = isDark ? 'rgba(51,65,85,0.5)' : '#f8fafc';
  const hoverBg   = isDark ? 'rgba(51,65,85,0.6)' : '#f1f5f9';
  const chipBg    = isDark ? '#334155' : '#f1f5f9';

  /* ── Helpers ────────────────────────────── */
  const handleChange   = (field, value) => setForm((p) => ({ ...p, [field]: value }));
  const toggleGenre    = (g) => setForm((p) => ({ ...p, genre: p.genre.includes(g) ? p.genre.filter((x) => x !== g) : [...p.genre, g] }));
  const toggleCategory  = (id) => setForm((p) => ({ ...p, categories: p.categories.includes(id) ? p.categories.filter((x) => x !== id) : [...p.categories, id] }));
  const deleteCategory  = (id) => {
    setAllCategories((p) => p.filter((c) => c.id !== id));
    setCustomCategories((p) => p.filter((c) => c.id !== id));
    setForm((p) => ({ ...p, categories: p.categories.filter((x) => x !== id) }));
    toast.success('Category deleted');
  };

  const addCastMember    = () => setForm((p) => ({ ...p, cast: [...p.cast, { name: '', photo: '' }] }));
  const removeCastMember = (i) => setForm((p) => ({ ...p, cast: p.cast.filter((_, idx) => idx !== i) }));
  const addEpisode       = () => setEpisodes((p) => [...p, { season: 1, episode: p.length + 1, title: '', videoUrl: '' }]);
  const removeEpisode    = (i) => setEpisodes((p) => p.filter((_, idx) => idx !== i));

  /* Add custom category */
  const addCustomCategory = () => {
    const label = newCategoryInput.trim();
    if (!label) return;
    const id = label.toLowerCase().replace(/\s+/g, '_');
    if (allCategories.some((c) => c.id === id)) {
      toast.error('Category already exists'); return;
    }
    const newCat = { id, label, icon: Tag, color: '#64748b', isDefault: false };
    setAllCategories((p) => [...p, newCat]);
    setCustomCategories((p) => [...p, newCat]);
    setForm((p) => ({ ...p, categories: [...p.categories, id] }));
    setNewCategoryInput('');
    toast.success(`Category "${label}" added!`);
  };

  /* ── Bulk Cast parse ─────────────────────── */
  const parseBulkCast = (text) => {
    const lines = text.trim().split('\n').filter(Boolean);
    const parsed = lines.map((line) => {
      const parts = line.split(',').map((s) => s.trim());
      return { name: parts[0] || '', photo: parts[1] || '' };
    }).filter((c) => c.name);
    if (!parsed.length) { toast.error('No valid cast entries found'); return; }
    handleChange('cast', parsed);
    setCastBulkMode(false);
    toast.success(`${parsed.length} cast members imported!`);
  };

  const handleCastCSV = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const text = ev.target.result;
      const lines = text.split('\n').filter(Boolean);
      const parsed = lines.map((line) => {
        const parts = line.split(',').map((s) => s.replace(/"/g, '').trim());
        return { name: parts[0] || '', photo: parts[1] || '' };
      }).filter((c) => c.name);
      if (!parsed.length) { toast.error('CSV parse failed — check format'); return; }
      handleChange('cast', parsed);
      toast.success(`${parsed.length} cast members imported from CSV!`);
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  /* ── Bulk Episode parse ──────────────────── */
  const parseBulkEpisodes = (text) => {
    const lines = text.trim().split('\n').filter(Boolean);
    const parsed = lines.map((line) => {
      const parts = line.split(',').map((s) => s.trim());
      return {
        season:   parseInt(parts[0]) || 1,
        episode:  parseInt(parts[1]) || 1,
        title:    parts[2] || '',
        videoUrl: parts[3] || '',
      };
    }).filter((ep) => ep.title || ep.videoUrl);
    if (!parsed.length) { toast.error('No valid episodes found'); return; }
    setEpisodes(parsed);
    setEpisodeBulkMode(false);
    toast.success(`${parsed.length} episodes imported!`);
  };

  const handleEpisodeCSV = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const text = ev.target.result;
      const lines = text.split('\n').filter(Boolean);
      const parsed = lines.map((line) => {
        const parts = line.split(',').map((s) => s.replace(/"/g, '').trim());
        return { season: parseInt(parts[0]) || 1, episode: parseInt(parts[1]) || 1, title: parts[2] || '', videoUrl: parts[3] || '' };
      }).filter((ep) => ep.title);
      if (!parsed.length) { toast.error('CSV parse failed — check format'); return; }
      setEpisodes(parsed);
      toast.success(`${parsed.length} episodes imported from CSV!`);
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const handlePublish = () => {
    if (!form.title.trim()) { toast.error('Title is required'); return; }
    toast.success(`"${form.title}" published successfully!`);
  };

  /* ── Shared styles ──────────────────────── */
  const card = { background: bg, border: `1px solid ${border}`, borderRadius: '20px', padding: '24px', boxSizing: 'border-box', boxShadow: isDark ? 'none' : '0 1px 4px rgba(0,0,0,0.06)' };
  const inputStyle = { width: '100%', padding: '10px 14px', borderRadius: '12px', border: `1px solid ${border}`, background: inputBg, color: textMain, fontSize: '13px', outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box', transition: 'border-color 0.2s, box-shadow 0.2s' };
  const labelStyle = { display: 'block', fontSize: '13px', fontWeight: 500, color: textMuted, marginBottom: '7px' };
  const focusInput = (e) => { e.target.style.borderColor = '#f97316'; e.target.style.boxShadow = '0 0 0 3px rgba(249,115,22,0.12)'; };
  const blurInput  = (e) => { e.target.style.borderColor = border;    e.target.style.boxShadow = 'none'; };

  // allCategories is now state, no need to re-derive

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      style={{ flex: 1, overflowX: 'hidden', overflowY: 'auto', padding: '24px 24px 48px 24px', width: '100%', minWidth: 0, boxSizing: 'border-box' }}
    >
      <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '24px', minWidth: 0 }}>

        {/* ── Page Header ─────────────────────── */}
        <div>
          <h1 style={{ fontSize: '26px', fontWeight: 700, color: textMain, margin: 0, letterSpacing: '-0.03em' }}>Publish New Content</h1>
          <p style={{ fontSize: '14px', color: textMuted, marginTop: '6px' }}>Add movies, web series, or short dramas</p>
        </div>

        {/* ── Content Type Tab ─────────────────── */}
        <div style={{ display: 'flex', gap: '4px', background: isDark ? '#334155' : '#f1f5f9', borderRadius: '14px', padding: '4px', width: 'fit-content' }}>
          {tabs.map((tab) => {
            const active = activeTab === tab.key;
            return (
              <button key={tab.key} onClick={() => setActiveTab(tab.key)}
                style={{ padding: '9px 20px', borderRadius: '10px', border: 'none', background: active ? 'linear-gradient(135deg, #f97316, #ea580c)' : 'transparent', color: active ? '#fff' : textMuted, fontSize: '13px', fontWeight: 600, cursor: 'pointer', transition: 'all 0.18s', boxShadow: active ? '0 4px 10px rgba(249,115,22,0.25)' : 'none' }}>
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* ── Main 2-col Grid ─────────────────── */}
        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1fr) minmax(0,340px)', gap: '20px', alignItems: 'start' }} className="add-content-grid">

          {/* ═══ LEFT COLUMN ════════════════════ */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', minWidth: 0 }}>

            {/* ── Basic Information ─────────────── */}
            <div style={card}>
              <h3 style={{ fontSize: '16px', fontWeight: 700, color: textMain, margin: '0 0 20px 0' }}>Basic Information</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div>
                  <label style={labelStyle}>Title <span style={{ color: '#f97316' }}>*</span></label>
                  <input type="text" value={form.title} onChange={(e) => handleChange('title', e.target.value)} placeholder="Enter content title" style={inputStyle} onFocus={focusInput} onBlur={blurInput} />
                </div>
                <div>
                  <label style={labelStyle}>Synopsis</label>
                  <textarea value={form.synopsis} onChange={(e) => handleChange('synopsis', e.target.value)} placeholder="Enter synopsis or description" rows={4} style={{ ...inputStyle, resize: 'none', lineHeight: '1.6' }} onFocus={focusInput} onBlur={blurInput} />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div>
                    <label style={labelStyle}>Language</label>
                    <select value={form.language} onChange={(e) => handleChange('language', e.target.value)} style={inputStyle} onFocus={focusInput} onBlur={blurInput}>
                      {languages.map((l) => <option key={l} value={l}>{l}</option>)}
                    </select>
                  </div>
                  <div>
                    <label style={labelStyle}>Release Year</label>
                    <input type="text" value={form.releaseYear} onChange={(e) => handleChange('releaseYear', e.target.value)} style={inputStyle} onFocus={focusInput} onBlur={blurInput} />
                  </div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
                  <div>
                    <label style={labelStyle}>Duration</label>
                    <input type="text" value={form.duration} onChange={(e) => handleChange('duration', e.target.value)} placeholder="2h 15m" style={inputStyle} onFocus={focusInput} onBlur={blurInput} />
                  </div>
                  <div>
                    <label style={labelStyle}>IMDB Rating</label>
                    <input type="number" step="0.1" max="10" min="0" value={form.imdbRating} onChange={(e) => handleChange('imdbRating', e.target.value)} placeholder="7.8" style={inputStyle} onFocus={focusInput} onBlur={blurInput} />
                  </div>
                  <div>
                    <label style={labelStyle}>Priority</label>
                    <input type="number" min="1" value={form.priority} onChange={(e) => handleChange('priority', e.target.value)} placeholder="1" style={inputStyle} onFocus={focusInput} onBlur={blurInput} />
                  </div>
                </div>
                {/* Genres */}
                <div>
                  <label style={labelStyle}>Genres</label>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                    {genres.map((g) => {
                      const active = form.genre.includes(g);
                      return (
                        <button key={g} onClick={() => toggleGenre(g)}
                          style={{ padding: '6px 14px', borderRadius: '9px', border: active ? 'none' : `1px solid ${border}`, background: active ? 'linear-gradient(135deg, #f97316, #ea580c)' : inputBg, color: active ? '#fff' : textMuted, fontSize: '12px', fontWeight: 600, cursor: 'pointer', transition: 'all 0.15s', boxShadow: active ? '0 3px 8px rgba(249,115,22,0.2)' : 'none' }}>
                          {g}
                        </button>
                      );
                    })}
                  </div>
                </div>
                {/* Toggles */}
                <div style={{ display: 'flex', gap: '24px' }}>
                  {[{ label: 'Coming Soon', field: 'comingSoon' }, { label: 'Premium Content', field: 'premium' }].map(({ label, field }) => (
                    <label key={field} style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '13px', color: textMain }}>
                      <input type="checkbox" checked={form[field]} onChange={(e) => handleChange(field, e.target.checked)} style={{ width: '15px', height: '15px', accentColor: '#f97316' }} />
                      {label}
                    </label>
                  ))}
                </div>
              </div>
            </div>

            {/* ── Categories ───────────────────────── */}
            <div style={card}>
              <h3 style={{ fontSize: '16px', fontWeight: 700, color: textMain, margin: '0 0 6px 0' }}>Categories</h3>
              <p style={{ fontSize: '13px', color: textMuted, margin: '0 0 18px 0' }}>Assign content to collections & featured lists</p>

              {/* Predefined + custom categories */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginBottom: '18px' }}>
                {allCategories.map(({ id, label, icon: Icon, color }) => {
                  const active = form.categories.includes(id);
                  return (
                    <div key={id} style={{ position: 'relative', display: 'inline-flex' }}
                      onMouseEnter={(e) => { const del = e.currentTarget.querySelector('.cat-del'); if (del) del.style.opacity = '1'; }}
                      onMouseLeave={(e) => { const del = e.currentTarget.querySelector('.cat-del'); if (del) del.style.opacity = '0'; }}>
                      <button onClick={() => toggleCategory(id)}
                        style={{
                          display: 'flex', alignItems: 'center', gap: '7px',
                          padding: '8px 34px 8px 14px',
                          borderRadius: '12px',
                          border: active ? 'none' : `1px solid ${border}`,
                          background: active ? `${color}18` : inputBg,
                          color: active ? color : textMuted,
                          fontSize: '12px', fontWeight: 600, cursor: 'pointer',
                          transition: 'all 0.15s',
                          outline: active ? `2px solid ${color}40` : 'none',
                          outlineOffset: '0px',
                        }}>
                        <Icon size={13} />
                        {label}
                        {active && <span style={{ fontSize: '10px', background: color, color: '#fff', borderRadius: '999px', padding: '1px 6px', fontWeight: 700 }}>✓</span>}
                      </button>
                      {/* Delete button — all categories */}
                      <button
                        className="cat-del"
                        onClick={(e) => { e.stopPropagation(); deleteCategory(id); }}
                        title="Delete category"
                        style={{
                          position: 'absolute', right: '7px', top: '50%',
                          transform: 'translateY(-50%)',
                          width: '18px', height: '18px', borderRadius: '50%',
                          background: '#ef4444', border: 'none',
                          color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center',
                          cursor: 'pointer', opacity: 0,
                          transition: 'opacity 0.15s',
                          padding: 0, lineHeight: 1, flexShrink: 0,
                        }}>
                        <X size={10} />
                      </button>
                    </div>
                  );
                })}
              </div>

              {/* Add custom category */}
              <div style={{ borderTop: `1px solid ${border}`, paddingTop: '16px' }}>
                <label style={{ ...labelStyle, marginBottom: '10px' }}>
                  <Tag size={13} style={{ display: 'inline', marginRight: '5px' }} />
                  Add Custom Category
                </label>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <input
                    type="text"
                    value={newCategoryInput}
                    onChange={(e) => setNewCategoryInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && addCustomCategory()}
                    placeholder="e.g., Must Watch, Binge Worthy..."
                    style={{ ...inputStyle, flex: 1 }}
                    onFocus={focusInput} onBlur={blurInput}
                  />
                  <button onClick={addCustomCategory}
                    style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '10px 18px', borderRadius: '12px', border: 'none', background: 'linear-gradient(135deg, #f97316, #ea580c)', color: '#fff', fontSize: '13px', fontWeight: 700, cursor: 'pointer', whiteSpace: 'nowrap', boxShadow: '0 4px 10px rgba(249,115,22,0.25)' }}>
                    <Plus size={14} /> Add
                  </button>
                </div>

                {/* Selected categories summary */}
                {form.categories.length > 0 && (
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '12px' }}>
                    <span style={{ fontSize: '11px', color: textMuted, alignSelf: 'center' }}>Selected:</span>
                    {form.categories.map((id) => {
                      const cat = allCategories.find((c) => c.id === id);
                      return cat ? (
                        <span key={id} style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '11px', fontWeight: 600, padding: '3px 10px', borderRadius: '999px', background: `${cat.color}18`, color: cat.color }}>
                          {cat.label}
                          <button onClick={() => toggleCategory(id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: cat.color, display: 'flex', padding: 0, marginLeft: '2px' }}>
                            <X size={10} />
                          </button>
                        </span>
                      ) : null;
                    })}
                  </div>
                )}
              </div>
            </div>

            {/* ── Cast & Crew ──────────────────────── */}
            <div style={card}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px', flexWrap: 'wrap', gap: '10px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <Users size={17} color="#f97316" />
                  <h3 style={{ fontSize: '16px', fontWeight: 700, color: textMain, margin: 0 }}>Cast & Crew</h3>
                  <span style={{ fontSize: '11px', fontWeight: 600, padding: '2px 8px', borderRadius: '999px', background: 'rgba(249,115,22,0.12)', color: '#f97316' }}>{form.cast.length} members</span>
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                  {/* Toggle bulk mode */}
                  <button onClick={() => setCastBulkMode((v) => !v)}
                    style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '7px 14px', borderRadius: '10px', border: `1px solid ${border}`, background: castBulkMode ? 'rgba(249,115,22,0.1)' : 'transparent', color: castBulkMode ? '#f97316' : textMuted, fontSize: '12px', fontWeight: 600, cursor: 'pointer', transition: 'all 0.15s' }}>
                    <FileText size={13} /> Bulk
                  </button>
                  {/* CSV upload */}
                  <button onClick={() => castFileRef.current?.click()}
                    style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '7px 14px', borderRadius: '10px', border: `1px solid ${border}`, background: 'transparent', color: textMuted, fontSize: '12px', fontWeight: 600, cursor: 'pointer', transition: 'background 0.15s' }}
                    onMouseEnter={(e) => { e.currentTarget.style.background = hoverBg; }}
                    onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}>
                    <Upload size={13} /> CSV
                  </button>
                  <input ref={castFileRef} type="file" accept=".csv,.txt" style={{ display: 'none' }} onChange={handleCastCSV} />
                  {/* Add single */}
                  <button onClick={addCastMember}
                    style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '7px 14px', borderRadius: '10px', border: `1px solid ${border}`, background: 'transparent', color: textMuted, fontSize: '12px', fontWeight: 600, cursor: 'pointer', transition: 'background 0.15s' }}
                    onMouseEnter={(e) => { e.currentTarget.style.background = hoverBg; }}
                    onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}>
                    <Plus size={13} /> Add
                  </button>
                </div>
              </div>

              {/* Bulk text mode */}
              <AnimatePresence>
                {castBulkMode && (
                  <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} style={{ overflow: 'hidden', marginBottom: '16px' }}>
                    <div style={{ background: isDark ? '#0f172a' : '#f8fafc', border: `1px solid ${border}`, borderRadius: '14px', padding: '16px' }}>
                      <p style={{ fontSize: '12px', color: textMuted, margin: '0 0 10px 0' }}>
                        📋 Paste one cast per line: <code style={{ background: isDark ? '#334155' : '#e2e8f0', padding: '2px 6px', borderRadius: '4px', fontSize: '11px', color: textMain }}>Actor Name, Photo URL</code>
                      </p>
                      <textarea
                        value={castBulkText}
                        onChange={(e) => setCastBulkText(e.target.value)}
                        placeholder={"Shah Rukh Khan, https://cdn.example.com/srk.jpg\nDeepika Padukone, https://cdn.example.com/dp.jpg\nAmitabh Bachchan,"}
                        rows={6}
                        style={{ ...inputStyle, resize: 'vertical', lineHeight: '1.7', fontFamily: 'monospace', fontSize: '12px' }}
                        onFocus={focusInput} onBlur={blurInput}
                      />
                      <div style={{ display: 'flex', gap: '8px', marginTop: '10px', justifyContent: 'flex-end' }}>
                        <button onClick={() => setCastBulkMode(false)}
                          style={{ padding: '8px 16px', borderRadius: '10px', border: `1px solid ${border}`, background: 'transparent', color: textMuted, fontSize: '12px', fontWeight: 600, cursor: 'pointer' }}>
                          Cancel
                        </button>
                        <button onClick={() => parseBulkCast(castBulkText)}
                          style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 16px', borderRadius: '10px', border: 'none', background: 'linear-gradient(135deg, #f97316, #ea580c)', color: '#fff', fontSize: '12px', fontWeight: 700, cursor: 'pointer' }}>
                          <Plus size={12} /> Import Cast
                        </button>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Individual rows */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {form.cast.map((member, i) => (
                  <motion.div key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.03 }}
                    style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                    <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: isDark ? '#334155' : '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: '12px', fontWeight: 700, color: textMuted }}>
                      {i + 1}
                    </div>
                    <input type="text" placeholder="Actor name" value={member.name}
                      onChange={(e) => { const c = [...form.cast]; c[i].name = e.target.value; handleChange('cast', c); }}
                      style={{ ...inputStyle, flex: 1 }} onFocus={focusInput} onBlur={blurInput} />
                    <input type="text" placeholder="Photo URL (optional)" value={member.photo}
                      onChange={(e) => { const c = [...form.cast]; c[i].photo = e.target.value; handleChange('cast', c); }}
                      style={{ ...inputStyle, flex: 1 }} onFocus={focusInput} onBlur={blurInput} />
                    {form.cast.length > 1 && (
                      <button onClick={() => removeCastMember(i)}
                        style={{ padding: '8px', borderRadius: '9px', background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', display: 'flex', flexShrink: 0 }}
                        onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(239,68,68,0.1)'; }}
                        onMouseLeave={(e) => { e.currentTarget.style.background = 'none'; }}>
                        <X size={15} />
                      </button>
                    )}
                  </motion.div>
                ))}
              </div>
              {/* CSV format hint */}
              <p style={{ fontSize: '11px', color: textMuted, marginTop: '12px', opacity: 0.75 }}>
                💡 CSV format: <code style={{ background: isDark ? '#334155' : '#e2e8f0', padding: '2px 5px', borderRadius: '4px' }}>Name, PhotoURL</code> — one row per actor
              </p>
            </div>

            {/* ── Episodes (Web Series) ─────────────── */}
            {activeTab === 'series' && (
              <div style={card}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px', flexWrap: 'wrap', gap: '10px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <ListVideo size={17} color="#f97316" />
                    <h3 style={{ fontSize: '16px', fontWeight: 700, color: textMain, margin: 0 }}>Episodes</h3>
                    <span style={{ fontSize: '11px', fontWeight: 600, padding: '2px 8px', borderRadius: '999px', background: 'rgba(249,115,22,0.12)', color: '#f97316' }}>{episodes.length} eps</span>
                  </div>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button onClick={() => setEpisodeBulkMode((v) => !v)}
                      style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '7px 14px', borderRadius: '10px', border: `1px solid ${border}`, background: episodeBulkMode ? 'rgba(249,115,22,0.1)' : 'transparent', color: episodeBulkMode ? '#f97316' : textMuted, fontSize: '12px', fontWeight: 600, cursor: 'pointer' }}>
                      <FileText size={13} /> Bulk
                    </button>
                    <button onClick={() => episodeFileRef.current?.click()}
                      style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '7px 14px', borderRadius: '10px', border: `1px solid ${border}`, background: 'transparent', color: textMuted, fontSize: '12px', fontWeight: 600, cursor: 'pointer' }}
                      onMouseEnter={(e) => { e.currentTarget.style.background = hoverBg; }}
                      onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}>
                      <Upload size={13} /> CSV
                    </button>
                    <input ref={episodeFileRef} type="file" accept=".csv,.txt" style={{ display: 'none' }} onChange={handleEpisodeCSV} />
                    <button onClick={addEpisode}
                      style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '7px 14px', borderRadius: '10px', border: `1px solid ${border}`, background: 'transparent', color: textMuted, fontSize: '12px', fontWeight: 600, cursor: 'pointer' }}
                      onMouseEnter={(e) => { e.currentTarget.style.background = hoverBg; }}
                      onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}>
                      <Plus size={13} /> Add
                    </button>
                  </div>
                </div>

                {/* Bulk mode */}
                <AnimatePresence>
                  {episodeBulkMode && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} style={{ overflow: 'hidden', marginBottom: '16px' }}>
                      <div style={{ background: isDark ? '#0f172a' : '#f8fafc', border: `1px solid ${border}`, borderRadius: '14px', padding: '16px' }}>
                        <p style={{ fontSize: '12px', color: textMuted, margin: '0 0 10px 0' }}>
                          📋 Paste one episode per line: <code style={{ background: isDark ? '#334155' : '#e2e8f0', padding: '2px 6px', borderRadius: '4px', fontSize: '11px', color: textMain }}>Season, Episode, Title, VideoURL</code>
                        </p>
                        <textarea
                          value={episodeBulkText}
                          onChange={(e) => setEpisodeBulkText(e.target.value)}
                          placeholder={"1, 1, The Beginning, https://cdn.example.com/ep1.mp4\n1, 2, Rising Action, https://cdn.example.com/ep2.mp4\n2, 1, New Season, https://cdn.example.com/s2ep1.mp4"}
                          rows={7}
                          style={{ ...inputStyle, resize: 'vertical', lineHeight: '1.7', fontFamily: 'monospace', fontSize: '12px' }}
                          onFocus={focusInput} onBlur={blurInput}
                        />
                        <div style={{ display: 'flex', gap: '8px', marginTop: '10px', justifyContent: 'flex-end' }}>
                          <button onClick={() => setEpisodeBulkMode(false)}
                            style={{ padding: '8px 16px', borderRadius: '10px', border: `1px solid ${border}`, background: 'transparent', color: textMuted, fontSize: '12px', fontWeight: 600, cursor: 'pointer' }}>
                            Cancel
                          </button>
                          <button onClick={() => parseBulkEpisodes(episodeBulkText)}
                            style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 16px', borderRadius: '10px', border: 'none', background: 'linear-gradient(135deg, #f97316, #ea580c)', color: '#fff', fontSize: '12px', fontWeight: 700, cursor: 'pointer' }}>
                            <Plus size={12} /> Import Episodes
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Episode rows */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {/* Header row */}
                  <div style={{ display: 'grid', gridTemplateColumns: '72px 72px 1fr 1fr 32px', gap: '10px', paddingBottom: '4px', borderBottom: `1px solid ${border}` }}>
                    {['S', 'Ep', 'Episode Title', 'Video URL', ''].map((h, i) => (
                      <span key={i} style={{ fontSize: '11px', fontWeight: 700, color: textMuted, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{h}</span>
                    ))}
                  </div>
                  {episodes.map((ep, i) => (
                    <motion.div key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.02 }}
                      style={{ display: 'grid', gridTemplateColumns: '72px 72px 1fr 1fr 32px', gap: '10px', alignItems: 'center' }}>
                      <input type="number" placeholder="1" value={ep.season} min={1}
                        onChange={(e) => { const n = [...episodes]; n[i].season = parseInt(e.target.value) || 1; setEpisodes(n); }}
                        style={{ ...inputStyle, textAlign: 'center' }} onFocus={focusInput} onBlur={blurInput} />
                      <input type="number" placeholder="1" value={ep.episode} min={1}
                        onChange={(e) => { const n = [...episodes]; n[i].episode = parseInt(e.target.value) || 1; setEpisodes(n); }}
                        style={{ ...inputStyle, textAlign: 'center' }} onFocus={focusInput} onBlur={blurInput} />
                      <input type="text" placeholder="Episode title" value={ep.title}
                        onChange={(e) => { const n = [...episodes]; n[i].title = e.target.value; setEpisodes(n); }}
                        style={inputStyle} onFocus={focusInput} onBlur={blurInput} />
                      <input type="text" placeholder="https://..." value={ep.videoUrl}
                        onChange={(e) => { const n = [...episodes]; n[i].videoUrl = e.target.value; setEpisodes(n); }}
                        style={inputStyle} onFocus={focusInput} onBlur={blurInput} />
                      <button onClick={() => removeEpisode(i)}
                        style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                        onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(239,68,68,0.1)'; }}
                        onMouseLeave={(e) => { e.currentTarget.style.background = 'none'; }}>
                        <X size={14} />
                      </button>
                    </motion.div>
                  ))}
                </div>
                <p style={{ fontSize: '11px', color: textMuted, marginTop: '12px', opacity: 0.75 }}>
                  💡 CSV format: <code style={{ background: isDark ? '#334155' : '#e2e8f0', padding: '2px 5px', borderRadius: '4px' }}>Season, Episode, Title, VideoURL</code>
                </p>
              </div>
            )}
          </div>

          {/* ═══ RIGHT COLUMN ════════════════════ */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', minWidth: 0 }}>

            {/* Visual Assets */}
            <div style={card}>
              <h3 style={{ fontSize: '16px', fontWeight: 700, color: textMain, margin: '0 0 20px 0' }}>Visual Assets</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                {[
                  { label: 'Poster (Vertical)',   icon: Image, field: 'posterUrl',  placeholder: 'Paste poster CDN URL',  accept: 'image/*', isVideo: false },
                  { label: 'Banner (Horizontal)', icon: Image, field: 'bannerUrl',  placeholder: 'Paste banner CDN URL',  accept: 'image/*', isVideo: false },
                  { label: 'Trailer Video',       icon: Video, field: 'trailerUrl', placeholder: 'Paste trailer URL',     accept: 'video/*', isVideo: true  },
                  { label: 'Full Video',          icon: Video, field: 'videoUrl',   placeholder: 'Paste full video URL',  accept: 'video/*', isVideo: true  },
                ].map(({ label, icon: Icon, field, placeholder, accept, isVideo }) => {
                  const fileInputId = `file-${field}`;
                  return (
                    <div key={field}>
                      <label style={{ ...labelStyle, display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
                        <Icon size={13} /> {label}
                      </label>

                      {/* Drag-drop / click zone */}
                      <div
                        onClick={() => document.getElementById(fileInputId)?.click()}
                        onDragOver={(e) => { e.preventDefault(); e.currentTarget.style.borderColor = '#f97316'; e.currentTarget.style.background = 'rgba(249,115,22,0.06)'; }}
                        onDragLeave={(e) => { e.currentTarget.style.borderColor = border; e.currentTarget.style.background = 'transparent'; }}
                        onDrop={(e) => {
                          e.preventDefault();
                          e.currentTarget.style.borderColor = border;
                          e.currentTarget.style.background = 'transparent';
                          const file = e.dataTransfer.files[0];
                          if (file) { handleChange(field, file.name); toast.success(`${label}: ${file.name} selected`); }
                        }}
                        style={{
                          border: `2px dashed ${border}`, borderRadius: '12px',
                          padding: '20px 16px', textAlign: 'center',
                          cursor: 'pointer', marginBottom: '8px',
                          transition: 'border-color 0.2s, background 0.2s',
                          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px',
                        }}
                        onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#f97316'; }}
                        onMouseLeave={(e) => { e.currentTarget.style.borderColor = border; }}
                      >
                        <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: isDark ? 'rgba(249,115,22,0.1)' : 'rgba(249,115,22,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#f97316' }}>
                          <Upload size={16} />
                        </div>
                        <p style={{ fontSize: '12px', color: '#f97316', fontWeight: 600, margin: 0 }}>
                          Click or drag & drop to upload
                        </p>
                        <p style={{ fontSize: '11px', color: textMuted, margin: 0 }}>
                          {isVideo ? 'MP4, MKV, MOV' : 'JPG, PNG, WebP'} supported
                        </p>
                      </div>

                      {/* Hidden file input */}
                      <input
                        id={fileInputId}
                        type="file"
                        accept={accept}
                        style={{ display: 'none' }}
                        onChange={(e) => {
                          const file = e.target.files[0];
                          if (file) { handleChange(field, file.name); toast.success(`${label}: ${file.name} selected`); }
                        }}
                      />

                      {/* URL input */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <LinkIcon size={13} color={textMuted} style={{ flexShrink: 0 }} />
                        <input type="text" value={form[field]} onChange={(e) => handleChange(field, e.target.value)} placeholder={placeholder}
                          style={{ ...inputStyle, fontSize: '12px' }} onFocus={focusInput} onBlur={blurInput} />
                      </div>

                      {/* Preview if URL entered */}
                      {form[field] && !isVideo && (
                        <div style={{ marginTop: '8px', borderRadius: '10px', overflow: 'hidden', maxHeight: '80px', border: `1px solid ${border}` }}>
                          <img src={form[field]} alt={label} style={{ width: '100%', height: '80px', objectFit: 'cover' }} onError={(e) => { e.target.style.display = 'none'; }} />
                        </div>
                      )}
                      {form[field] && isVideo && (
                        <p style={{ fontSize: '11px', color: '#22c55e', marginTop: '6px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                          ✓ URL set: {form[field].length > 40 ? form[field].slice(0, 40) + '...' : form[field]}
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Summary card */}
            <div style={{ ...card, background: isDark ? 'rgba(249,115,22,0.06)' : 'rgba(249,115,22,0.04)', border: '1px solid rgba(249,115,22,0.2)' }}>
              <h3 style={{ fontSize: '14px', fontWeight: 700, color: '#f97316', margin: '0 0 14px 0' }}>Content Summary</h3>
              {[
                { label: 'Type',        value: tabs.find((t) => t.key === activeTab)?.label },
                { label: 'Genres',      value: form.genre.length ? form.genre.join(', ') : '—' },
                { label: 'Categories',  value: form.categories.length ? `${form.categories.length} selected` : '—' },
                { label: 'Cast',        value: `${form.cast.filter((c) => c.name).length} members` },
                ...(activeTab === 'series' ? [{ label: 'Episodes', value: `${episodes.length} episodes` }] : []),
                { label: 'Premium',     value: form.premium ? 'Yes' : 'Free' },
              ].map(({ label, value }) => (
                <div key={label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', padding: '7px 0', borderBottom: `1px solid ${isDark ? 'rgba(249,115,22,0.1)' : 'rgba(249,115,22,0.08)'}` }}>
                  <span style={{ fontSize: '12px', color: textMuted }}>{label}</span>
                  <span style={{ fontSize: '12px', fontWeight: 600, color: textMain, textAlign: 'right', maxWidth: '60%' }}>{value}</span>
                </div>
              ))}
            </div>

            {/* Publish Button */}
            <button
              onClick={handlePublish}
              onMouseEnter={(e) => { e.currentTarget.style.opacity = '0.88'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.opacity = '1';    e.currentTarget.style.transform = 'translateY(0)'; }}
              style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', padding: '15px', borderRadius: '14px', border: 'none', background: 'linear-gradient(135deg, #f97316, #ea580c)', color: '#fff', fontSize: '15px', fontWeight: 700, cursor: 'pointer', transition: 'opacity 0.2s, transform 0.2s', boxShadow: '0 8px 20px rgba(249,115,22,0.4)' }}
            >
              <Send size={16} /> Publish Content
            </button>
          </div>
        </div>

        <style>{`
          @media (max-width: 900px) { .add-content-grid { grid-template-columns: 1fr !important; } }
        `}</style>
      </div>
    </motion.div>
  );
}
