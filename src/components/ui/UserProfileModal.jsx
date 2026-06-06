import { motion, AnimatePresence } from 'framer-motion';
import { X, Phone, Mail, Calendar, CreditCard, User, Shield, Smartphone, Eye } from 'lucide-react';
import useThemeStore from '../../store/useThemeStore';
import { StatusBadge } from './Badge';

/* ─────────────────────────────────────────────────────────
   UserProfileModal — show full user profile card in a modal
   Props:
     user   : object  — the user row object
     isOpen : bool    — controls visibility
     onClose: fn      — close handler
──────────────────────────────────────────────────────── */
export default function UserProfileModal({ user, isOpen, onClose }) {
  const { isDark } = useThemeStore();

  const bg        = isDark ? '#1E293B' : '#ffffff';
  const bg2       = isDark ? '#0f172a' : '#f8fafc';
  const border    = isDark ? '#334155' : '#e2e8f0';
  const textMain  = isDark ? '#f1f5f9' : '#0f172a';
  const textMuted = isDark ? '#94a3b8' : '#64748b';
  const hoverBg   = isDark ? '#334155' : '#f1f5f9';

  if (!user) return null;

  const planColors = {
    Monthly:   { bg: 'rgba(249,115,22,0.12)',  text: '#f97316' },
    Quarterly: { bg: 'rgba(99,102,241,0.12)',  text: '#6366f1' },
    Annual:    { bg: 'rgba(34,197,94,0.12)',   text: '#22c55e' },
    Free:      { bg: isDark ? '#334155' : '#f1f5f9', text: textMuted },
  };
  const pc = planColors[user.plan] || planColors.Free;

  const signupIconMap = {
    Google: '🔵',
    Phone:  '📱',
    Email:  '📧',
    Apple:  '🍎',
  };

  const infoItems = [
    { icon: Mail,         label: 'Email',        value: user.email },
    { icon: Phone,        label: 'Mobile',        value: user.mobile },
    { icon: Smartphone,   label: 'Signup Via',    value: `${signupIconMap[user.signupVia] || '🔗'} ${user.signupVia}` },
    { icon: Calendar,     label: 'Joined',        value: user.joinedDate },
    { icon: CreditCard,   label: 'Current Plan',  value: user.plan },
    { icon: Shield,       label: 'Status',        value: user.status, isStatus: true },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          style={{
            position: 'fixed', inset: 0, zIndex: 100,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: '16px',
          }}
        >
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={onClose}
            style={{
              position: 'absolute', inset: 0,
              background: 'rgba(0,0,0,0.6)',
              backdropFilter: 'blur(6px)',
            }}
          />

          {/* Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.93, y: 28 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.93, y: 20 }}
            transition={{ type: 'spring', damping: 24, stiffness: 300 }}
            style={{
              position: 'relative',
              width: '100%', maxWidth: '480px',
              background: bg,
              border: `1px solid ${border}`,
              borderRadius: '24px',
              boxShadow: '0 32px 80px rgba(0,0,0,0.45)',
              overflow: 'hidden',
            }}
          >
            {/* ── Banner strip ────────────────── */}
            <div style={{
              height: '90px',
              background: 'linear-gradient(135deg, #f97316 0%, #ea580c 50%, #c2410c 100%)',
              position: 'relative',
            }}>
              {/* Pattern overlay */}
              <div style={{
                position: 'absolute', inset: 0,
                backgroundImage: 'radial-gradient(circle at 20% 50%, rgba(255,255,255,0.1) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(255,255,255,0.08) 0%, transparent 40%)',
              }} />

              {/* Close button */}
              <button
                onClick={onClose}
                style={{
                  position: 'absolute', top: '12px', right: '12px',
                  width: '32px', height: '32px',
                  background: 'rgba(0,0,0,0.25)',
                  border: 'none', borderRadius: '50%',
                  cursor: 'pointer', color: '#fff',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  transition: 'background 0.15s',
                }}
                onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(0,0,0,0.4)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(0,0,0,0.25)'; }}
              >
                <X size={15} />
              </button>
            </div>

            {/* ── Avatar ────────────────────── */}
            <div style={{
              position: 'absolute', top: '52px', left: '28px',
              width: '76px', height: '76px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #f97316, #c2410c)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: '#fff', fontSize: '24px', fontWeight: 800,
              border: `4px solid ${bg}`,
              boxShadow: '0 8px 24px rgba(249,115,22,0.4)',
              zIndex: 5,
              letterSpacing: '-0.02em',
            }}>
              {user.avatar}
            </div>

            {/* ── Body ──────────────────────── */}
            <div style={{ padding: '0 24px 24px 24px', marginTop: '44px' }}>

              {/* Name + plan badge */}
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '20px' }}>
                <div>
                  <h2 style={{ fontSize: '20px', fontWeight: 800, color: textMain, margin: 0, letterSpacing: '-0.02em' }}>
                    {user.name}
                  </h2>
                  <p style={{ fontSize: '12px', color: textMuted, marginTop: '4px' }}>#{user.id} · User Account</p>
                </div>
                <span style={{
                  fontSize: '12px', fontWeight: 700,
                  padding: '5px 14px', borderRadius: '999px',
                  background: pc.bg, color: pc.text,
                  marginTop: '4px', flexShrink: 0,
                }}>
                  {user.plan}
                </span>
              </div>

              {/* Info grid */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                {infoItems.map(({ icon: Icon, label, value, isStatus }) => (
                  <div
                    key={label}
                    style={{
                      display: 'flex', alignItems: 'center',
                      padding: '10px 14px',
                      borderRadius: '12px',
                      transition: 'background 0.15s',
                      gap: '12px',
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.background = isDark ? 'rgba(51,65,85,0.4)' : '#f8fafc'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
                  >
                    {/* Icon box */}
                    <div style={{
                      width: '34px', height: '34px',
                      borderRadius: '9px',
                      background: isDark ? 'rgba(249,115,22,0.1)' : 'rgba(249,115,22,0.07)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      color: '#f97316', flexShrink: 0,
                    }}>
                      <Icon size={14} />
                    </div>

                    {/* Label + value */}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ fontSize: '10px', fontWeight: 700, color: textMuted, textTransform: 'uppercase', letterSpacing: '0.07em', margin: 0 }}>{label}</p>
                      {isStatus ? (
                        <div style={{ marginTop: '3px' }}>
                          <StatusBadge status={value} />
                        </div>
                      ) : (
                        <p style={{ fontSize: '13px', fontWeight: 600, color: textMain, margin: '3px 0 0 0', wordBreak: 'break-word' }}>{value}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* ── Action strip ──────────────── */}
              <div style={{ display: 'flex', gap: '10px', marginTop: '16px' }}>
                <button
                  onClick={onClose}
                  style={{
                    flex: 1, padding: '11px',
                    borderRadius: '12px',
                    border: `1px solid ${border}`,
                    background: 'transparent',
                    color: textMuted, fontSize: '13px', fontWeight: 600,
                    cursor: 'pointer', transition: 'background 0.15s',
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = hoverBg; }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    navigator.clipboard?.writeText(`${user.name}\n${user.email}\n${user.mobile}`);
                    onClose();
                  }}
                  style={{
                    flex: 2, padding: '11px',
                    borderRadius: '12px', border: 'none',
                    background: 'linear-gradient(135deg, #f97316, #ea580c)',
                    color: '#fff', fontSize: '13px', fontWeight: 700,
                    cursor: 'pointer',
                    boxShadow: '0 4px 14px rgba(249,115,22,0.3)',
                    transition: 'opacity 0.2s',
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.opacity = '0.9'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.opacity = '1'; }}
                >
                  📋 Copy Contact Info
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
