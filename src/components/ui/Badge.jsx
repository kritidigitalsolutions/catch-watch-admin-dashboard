import { motion } from 'framer-motion';
import useThemeStore from '../../store/useThemeStore';

/* ── Inline colour maps (no Tailwind dark:) ── */
const VARIANTS_DARK = {
  success: { bg: 'rgba(34,197,94,0.12)',   color: '#4ade80', border: 'rgba(34,197,94,0.2)' },
  danger:  { bg: 'rgba(239,68,68,0.12)',   color: '#f87171', border: 'rgba(239,68,68,0.2)' },
  warning: { bg: 'rgba(234,179,8,0.12)',   color: '#facc15', border: 'rgba(234,179,8,0.2)' },
  info:    { bg: 'rgba(59,130,246,0.12)',  color: '#60a5fa', border: 'rgba(59,130,246,0.2)' },
  gray:    { bg: 'rgba(148,163,184,0.12)', color: '#94a3b8', border: 'rgba(148,163,184,0.2)' },
  orange:  { bg: 'rgba(249,115,22,0.12)',  color: '#fb923c', border: 'rgba(249,115,22,0.2)' },
};

const VARIANTS_LIGHT = {
  success: { bg: '#dcfce7', color: '#15803d', border: '#86efac' },
  danger:  { bg: '#fee2e2', color: '#b91c1c', border: '#fca5a5' },
  warning: { bg: '#fef9c3', color: '#a16207', border: '#fde047' },
  info:    { bg: '#dbeafe', color: '#1d4ed8', border: '#93c5fd' },
  gray:    { bg: '#f1f5f9', color: '#475569', border: '#cbd5e1' },
  orange:  { bg: '#ffedd5', color: '#c2410c', border: '#fdba74' },
};

export default function Badge({ children, variant = 'gray', className = '' }) {
  const { isDark } = useThemeStore();
  const v = (isDark ? VARIANTS_DARK : VARIANTS_LIGHT)[variant] || (isDark ? VARIANTS_DARK : VARIANTS_LIGHT).gray;

  return (
    <motion.span
      initial={{ scale: 0.85, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        padding: '3px 10px',
        borderRadius: '999px',
        fontSize: '11px',
        fontWeight: 600,
        letterSpacing: '0.01em',
        background: v.bg,
        color: v.color,
        border: `1px solid ${v.border}`,
        whiteSpace: 'nowrap',
      }}
    >
      {children}
    </motion.span>
  );
}

export function StatusBadge({ status }) {
  const map = {
    'Active':        'success',
    'Published':     'success',
    'Sent':          'success',
    'Resolved':      'success',
    'Closed':        'gray',
    'Inactive':      'gray',
    'Draft':         'gray',
    'Free':          'gray',
    'Blocked':       'danger',
    'Expired':       'danger',
    'Deleted':       'danger',
    'Open':          'warning',
    'Expiring Soon': 'warning',
    'Coming Soon':   'info',
    'In Progress':   'info',
    'Scheduled':     'info',
  };
  return <Badge variant={map[status] || 'gray'}>{status}</Badge>;
}
