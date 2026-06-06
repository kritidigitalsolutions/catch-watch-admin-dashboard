import { useState } from 'react';
import { Send, Trash2, Clock, Users, UserCheck, UserX, Bell } from 'lucide-react';
import { motion } from 'framer-motion';
import DataTable from '../../components/ui/DataTable';
import { StatusBadge } from '../../components/ui/Badge';
import { ConfirmModal } from '../../components/ui/Modal';
import { notifications } from '../../constants/mockData';
import toast from 'react-hot-toast';
import useThemeStore from '../../store/useThemeStore';

const audiences = [
  { value: 'All Users',       icon: Users,     label: 'All Users' },
  { value: 'Subscribed',      icon: UserCheck,  label: 'Subscribed' },
  { value: 'Non-Subscribed',  icon: UserX,      label: 'Non-Subscribed' },
  { value: 'Expiring Soon',   icon: Clock,      label: 'Expiring Soon' },
];

export default function Notifications() {
  const { isDark } = useThemeStore();
  const [notifList, setNotifList]     = useState(notifications);
  const [deleteModal, setDeleteModal] = useState({ open: false, item: null });
  const [form, setForm] = useState({
    title: '', message: '', audience: 'All Users',
    imageUrl: '', scheduleFor: '', sendNow: true,
  });

  /* ── Colour tokens ──────────────────────── */
  const bg        = isDark ? '#1E293B' : '#ffffff';
  const border    = isDark ? '#334155' : '#e2e8f0';
  const textMain  = isDark ? '#f1f5f9' : '#0f172a';
  const textMuted = isDark ? '#94a3b8' : '#64748b';
  const inputBg   = isDark ? 'rgba(51,65,85,0.5)' : '#f8fafc';
  const hoverBg   = isDark ? 'rgba(51,65,85,0.6)' : '#f1f5f9';

  /* ── Handlers ───────────────────────────── */
  const handleSend = () => {
    if (!form.title || !form.message) { toast.error('Title and message are required'); return; }
    const newNotif = {
      id: Date.now(),
      title: form.title,
      message: form.message,
      audience: form.audience,
      imageUrl: form.imageUrl,
      sentAt: form.sendNow ? new Date().toISOString().replace('T', ' ').slice(0, 16) : null,
      scheduledFor: !form.sendNow ? form.scheduleFor : null,
      sentCount: form.sendNow ? (form.audience === 'All Users' ? 24580 : 8945) : 0,
      openRate: 0,
      status: form.sendNow ? 'Sent' : 'Scheduled',
    };
    setNotifList((prev) => [newNotif, ...prev]);
    toast.success(form.sendNow ? 'Notification sent!' : 'Notification scheduled!');
    setForm({ title: '', message: '', audience: 'All Users', imageUrl: '', scheduleFor: '', sendNow: true });
  };

  const handleDelete = (item) => {
    setNotifList((prev) => prev.filter((n) => n.id !== item.id));
    toast.success('Notification deleted');
  };

  /* ── Table columns ──────────────────────── */
  const columns = [
    {
      header: 'Notification', accessor: 'title',
      render: (row) => (
        <div style={{ maxWidth: '220px' }}>
          <p style={{ fontWeight: 600, color: textMain, fontSize: '13px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {row.title}
          </p>
          <p style={{ fontSize: '12px', color: textMuted, marginTop: '3px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {row.message}
          </p>
        </div>
      ),
    },
    {
      header: 'Audience', accessor: 'audience',
      render: (row) => (
        <span style={{
          fontSize: '11px', fontWeight: 600,
          padding: '3px 10px', borderRadius: '999px',
          background: 'rgba(59,130,246,0.1)', color: '#3b82f6',
        }}>
          {row.audience}
        </span>
      ),
    },
    {
      header: 'Sent / Scheduled', accessor: 'sentAt',
      render: (row) => (
        <span style={{ fontSize: '12px', color: textMuted }}>
          {row.sentAt || row.scheduledFor || '—'}
        </span>
      ),
    },
    {
      header: 'Reach', accessor: 'sentCount',
      render: (row) => (
        <span style={{ fontSize: '13px', fontWeight: 600, color: textMain }}>
          {row.sentCount.toLocaleString('en-IN')}
        </span>
      ),
    },
    {
      header: 'Open Rate', accessor: 'openRate',
      render: (row) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{
            width: '60px', height: '5px',
            background: isDark ? '#334155' : '#e2e8f0',
            borderRadius: '999px', overflow: 'hidden', flexShrink: 0,
          }}>
            <div style={{
              height: '100%', width: `${row.openRate}%`,
              background: 'linear-gradient(90deg, #22c55e, #16a34a)',
              borderRadius: '999px',
            }} />
          </div>
          <span style={{ fontSize: '12px', fontWeight: 600, color: textMuted }}>
            {row.openRate}%
          </span>
        </div>
      ),
    },
    {
      header: 'Status', accessor: 'status',
      render: (row) => <StatusBadge status={row.status} />,
    },
  ];

  /* ── Input style ────────────────────────── */
  const inputStyle = {
    width: '100%',
    padding: '10px 14px',
    borderRadius: '12px',
    border: `1px solid ${border}`,
    background: inputBg,
    color: textMain,
    fontSize: '13px',
    outline: 'none',
    fontFamily: 'inherit',
    boxSizing: 'border-box',
    transition: 'border-color 0.2s, box-shadow 0.2s',
  };

  const focusInput  = (e) => { e.target.style.borderColor = '#f97316'; e.target.style.boxShadow = '0 0 0 3px rgba(249,115,22,0.12)'; };
  const blurInput   = (e) => { e.target.style.borderColor = border;    e.target.style.boxShadow = 'none'; };

  /* ── Card style ─────────────────────────── */
  const card = {
    background: bg,
    border: `1px solid ${border}`,
    borderRadius: '20px',
    padding: '24px',
    boxSizing: 'border-box',
    boxShadow: isDark ? 'none' : '0 1px 4px rgba(0,0,0,0.06)',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      style={{
        flex: 1,
        overflowX: 'hidden',
        overflowY: 'auto',
        padding: '24px 24px 48px 24px',
        width: '100%',
        minWidth: 0,
        boxSizing: 'border-box',
      }}
    >
      <div style={{ width: '100%', maxWidth: '100%', display: 'flex', flexDirection: 'column', gap: '24px', minWidth: 0 }}>

        {/* ── Page Header ─────────────────────── */}
        <div>
          <h1 style={{ fontSize: '26px', fontWeight: 700, color: textMain, margin: 0, letterSpacing: '-0.03em' }}>
            Push Notifications
          </h1>
          <p style={{ fontSize: '14px', color: textMuted, marginTop: '6px' }}>
            Compose and send notifications to your users
          </p>
        </div>

        {/* ── Two Column Grid ──────────────────── */}
        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 280px) minmax(0, 1fr)', gap: '20px', alignItems: 'start', width: '100%' }}
          className="notif-grid"
        >

          {/* ── LEFT: Compose Panel ─────────────── */}
          <div style={{ ...card, minWidth: 0, overflow: 'hidden' }}>

            {/* Card header */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
              <div style={{
                width: '42px', height: '42px', borderRadius: '12px',
                background: 'rgba(249,115,22,0.1)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: '#f97316', flexShrink: 0,
              }}>
                <Bell size={19} />
              </div>
              <div>
                <h3 style={{ fontSize: '16px', fontWeight: 700, color: textMain, margin: 0 }}>Compose</h3>
                <p style={{ fontSize: '12px', color: textMuted, marginTop: '2px' }}>Create a new notification</p>
              </div>
            </div>

            {/* Form fields */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>

              {/* Title */}
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, color: isDark ? '#cbd5e1' : '#475569', marginBottom: '7px' }}>
                  Title <span style={{ color: '#f97316' }}>*</span>
                </label>
                <input
                  type="text"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  placeholder="Notification title"
                  style={inputStyle}
                  onFocus={focusInput} onBlur={blurInput}
                />
              </div>

              {/* Message */}
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, color: isDark ? '#cbd5e1' : '#475569', marginBottom: '7px' }}>
                  Message <span style={{ color: '#f97316' }}>*</span>
                </label>
                <textarea
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  placeholder="Write your notification message..."
                  rows={3}
                  style={{ ...inputStyle, resize: 'none', lineHeight: '1.6' }}
                  onFocus={focusInput} onBlur={blurInput}
                />
              </div>

              {/* Target Audience */}
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, color: isDark ? '#cbd5e1' : '#475569', marginBottom: '10px' }}>
                  Target Audience
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                  {audiences.map((a) => {
                    const Icon = a.icon;
                    const active = form.audience === a.value;
                    return (
                      <button
                        key={a.value}
                        onClick={() => setForm({ ...form, audience: a.value })}
                        onMouseEnter={(e) => { if (!active) e.currentTarget.style.background = hoverBg; }}
                        onMouseLeave={(e) => { if (!active) e.currentTarget.style.background = isDark ? 'rgba(51,65,85,0.3)' : '#f8fafc'; }}
                        style={{
                          display: 'flex', alignItems: 'center', gap: '8px',
                          padding: '9px 12px',
                          borderRadius: '11px',
                          border: active ? 'none' : `1px solid ${border}`,
                          background: active
                            ? 'linear-gradient(135deg, #f97316, #ea580c)'
                            : isDark ? 'rgba(51,65,85,0.3)' : '#f8fafc',
                          color: active ? '#fff' : textMuted,
                          fontSize: '12px', fontWeight: 600,
                          cursor: 'pointer',
                          transition: 'all 0.18s',
                          boxShadow: active ? '0 4px 10px rgba(249,115,22,0.25)' : 'none',
                          textAlign: 'left',
                        }}
                      >
                        <Icon size={13} />
                        {a.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Image URL */}
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, color: isDark ? '#cbd5e1' : '#475569', marginBottom: '7px' }}>
                  Image URL <span style={{ fontSize: '11px', color: textMuted, fontWeight: 400 }}>(optional)</span>
                </label>
                <input
                  type="text"
                  value={form.imageUrl}
                  onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
                  placeholder="https://..."
                  style={inputStyle}
                  onFocus={focusInput} onBlur={blurInput}
                />
              </div>

              {/* Send / Schedule toggle */}
              <div style={{
                display: 'flex', gap: '6px',
                background: isDark ? '#334155' : '#f1f5f9',
                borderRadius: '12px', padding: '4px',
              }}>
                {[
                  { label: 'Send Now', value: true },
                  { label: 'Schedule', value: false },
                ].map((opt) => {
                  const active = form.sendNow === opt.value;
                  return (
                    <button
                      key={String(opt.value)}
                      onClick={() => setForm({ ...form, sendNow: opt.value })}
                      style={{
                        flex: 1, padding: '8px',
                        borderRadius: '9px', border: 'none',
                        background: active ? 'linear-gradient(135deg, #f97316, #ea580c)' : 'transparent',
                        color: active ? '#fff' : textMuted,
                        fontSize: '12px', fontWeight: 600,
                        cursor: 'pointer',
                        transition: 'all 0.18s',
                        boxShadow: active ? '0 3px 8px rgba(249,115,22,0.25)' : 'none',
                      }}
                    >
                      {opt.label}
                    </button>
                  );
                })}
              </div>

              {/* Schedule datetime */}
              {!form.sendNow && (
                <input
                  type="datetime-local"
                  value={form.scheduleFor}
                  onChange={(e) => setForm({ ...form, scheduleFor: e.target.value })}
                  style={{ ...inputStyle, colorScheme: isDark ? 'dark' : 'light' }}
                  onFocus={focusInput} onBlur={blurInput}
                />
              )}

              {/* Send button */}
              <button
                onClick={handleSend}
                onMouseEnter={(e) => { e.currentTarget.style.opacity = '0.88'; e.currentTarget.style.transform = 'translateY(-1px)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.opacity = '1'; e.currentTarget.style.transform = 'translateY(0)'; }}
                style={{
                  width: '100%',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                  padding: '12px',
                  borderRadius: '12px', border: 'none',
                  background: 'linear-gradient(135deg, #f97316, #ea580c)',
                  color: '#fff', fontSize: '14px', fontWeight: 700,
                  cursor: 'pointer',
                  transition: 'opacity 0.2s, transform 0.2s',
                  boxShadow: '0 6px 16px rgba(249,115,22,0.35)',
                  marginTop: '4px',
                }}
              >
                <Send size={15} />
                {form.sendNow ? 'Send Notification' : 'Schedule Notification'}
              </button>
            </div>
          </div>

          {/* ── RIGHT: History Table ─────────── */}
          <div style={{ ...card, minWidth: 0, overflow: 'hidden' }}>
            <div style={{ marginBottom: '20px' }}>
              <h3 style={{ fontSize: '16px', fontWeight: 700, color: textMain, margin: 0 }}>
                Notification History
              </h3>
              <p style={{ fontSize: '13px', color: textMuted, marginTop: '4px' }}>
                All sent and scheduled notifications
              </p>
            </div>

            <DataTable
              columns={columns}
              data={notifList}
              searchPlaceholder="Search notifications..."
              pageSize={6}
              actions={(row) => (
                <motion.button
                  whileHover={{ scale: 1.15 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setDeleteModal({ open: true, item: row })}
                  style={{
                    padding: '7px', borderRadius: '9px',
                    background: 'none', border: 'none',
                    color: '#ef4444', cursor: 'pointer',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    transition: 'background 0.15s',
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(239,68,68,0.1)'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = 'none'; }}
                >
                  <Trash2 size={15} />
                </motion.button>
              )}
            />
          </div>
        </div>

        {/* ── Delete Confirm Modal ─────────────── */}
        <ConfirmModal
          isOpen={deleteModal.open}
          onClose={() => setDeleteModal({ open: false, item: null })}
          onConfirm={() => deleteModal.item && handleDelete(deleteModal.item)}
          title="Delete Notification"
          message="Are you sure you want to delete this notification from history?"
          confirmText="Delete"
        />

        {/* Responsive */}
        <style>{`
          @media (max-width: 860px) {
            .notif-grid { grid-template-columns: 1fr !important; }
          }
        `}</style>

      </div>
    </motion.div>
  );
}
