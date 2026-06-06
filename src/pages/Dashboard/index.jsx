import { useState } from 'react';
import { Users, UserCheck, UserX, Clock, IndianRupee, TrendingUp, Film, Activity, Eye, Film as FilmIcon, Tv, Clapperboard, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { StatusBadge } from '../../components/ui/Badge';
import RevenueChart from '../../components/charts/RevenueChart';
import UserGrowthChart from '../../components/charts/UserGrowthChart';
import DonutChart from '../../components/charts/DonutChart';
import UserProfileModal from '../../components/ui/UserProfileModal';
import { dashboardStats, recentUsers } from '../../constants/mockData';
import useThemeStore from '../../store/useThemeStore';

const kpiCards = [
  { key: 'totalUsers',      label: 'Total Users',      icon: Users,       color: '#3b82f6', bg: 'rgba(59,130,246,0.1)',  stat: dashboardStats.totalUsers },
  { key: 'activeUsers',     label: 'Active Today',     icon: Activity,    color: '#22c55e', bg: 'rgba(34,197,94,0.1)',   stat: dashboardStats.activeUsers },
  { key: 'subscribedUsers', label: 'Subscribed',       icon: UserCheck,   color: '#f97316', bg: 'rgba(249,115,22,0.1)',  stat: dashboardStats.subscribedUsers },
  { key: 'nonSubscribed',   label: 'Non-Subscribed',   icon: UserX,       color: '#94a3b8', bg: 'rgba(148,163,184,0.1)', stat: dashboardStats.nonSubscribed },
  { key: 'expiringSoon',    label: 'Expiring Soon',    icon: Clock,       color: '#eab308', bg: 'rgba(234,179,8,0.1)',   stat: dashboardStats.expiringSoon },
  { key: 'todayRevenue',    label: "Today's Revenue",  icon: IndianRupee, color: '#22c55e', bg: 'rgba(34,197,94,0.1)',   stat: dashboardStats.todayRevenue },
  { key: 'monthlyRevenue',  label: 'Monthly Revenue',  icon: TrendingUp,  color: '#8b5cf6', bg: 'rgba(139,92,246,0.1)',  stat: dashboardStats.monthlyRevenue },
  { key: 'totalContent',    label: 'Total Content',    icon: Film,        color: '#06b6d4', bg: 'rgba(6,182,212,0.1)',   stat: dashboardStats.totalContent },
];

const contentSummary = [
  { label: 'Movies',       count: 0, recent: '', icon: FilmIcon,     grad: ['#f97316', '#ea580c'] },
  { label: 'Web Series',   count: 0, recent: '', icon: Tv,           grad: ['#3b82f6', '#7c3aed'] },
  { label: 'Short Dramas', count: 0, recent: '', icon: Clapperboard, grad: ['#22c55e', '#0d9488'] },
];

export default function Dashboard() {
  const { isDark } = useThemeStore();
  const [hoveredRow, setHoveredRow] = useState(null);
  const [viewUser, setViewUser] = useState(null);

  /* ── Colour tokens ──────────────────────── */
  const bg        = isDark ? '#1E293B' : '#ffffff';
  const border    = isDark ? '#334155' : '#e2e8f0';
  const textMain  = isDark ? '#f1f5f9' : '#0f172a';
  const textMuted = isDark ? '#94a3b8' : '#64748b';
  const subtleBg  = isDark ? 'rgba(51,65,85,0.4)' : '#f8fafc';

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
          <h1 style={{ fontSize: '26px', fontWeight: 700, color: textMain, margin: 0, letterSpacing: '-0.03em' }}>Dashboard</h1>
          <p style={{ fontSize: '14px', color: textMuted, marginTop: '6px' }}>Overview of platform performance and analytics</p>
        </div>

        {/* ── KPI Cards — 4 col grid ─────────── */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0,1fr))', gap: '14px' }} className="kpi-grid">
          {kpiCards.map((card, i) => {
            const Icon = card.icon;
            const isRevenue = card.key.includes('Revenue') || card.key === 'todayRevenue';
            const val = isRevenue
              ? `₹${card.stat.value.toLocaleString('en-IN')}`
              : card.stat.value.toLocaleString('en-IN');
            const up = card.stat.trendUp;

            return (
              <motion.div
                key={card.key}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04, ease: 'easeOut' }}
                whileHover={{ y: -3, transition: { duration: 0.18 } }}
                style={{
                  background: bg,
                  border: `1px solid ${border}`,
                  borderRadius: '16px',
                  padding: '18px 20px',
                  boxSizing: 'border-box',
                  boxShadow: isDark ? 'none' : '0 1px 4px rgba(0,0,0,0.06)',
                  cursor: 'default',
                  position: 'relative',
                  overflow: 'hidden',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '14px',
                }}
              >
                {/* Top color stripe */}
                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '3px', background: card.color, borderRadius: '16px 16px 0 0', opacity: 0.8 }} />

                {/* Row 1: icon + trend */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{
                    width: '40px', height: '40px', borderRadius: '11px',
                    background: card.bg,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: card.color, flexShrink: 0,
                  }}>
                    <Icon size={19} />
                  </div>
                  <span style={{
                    display: 'inline-flex', alignItems: 'center', gap: '3px',
                    fontSize: '11px', fontWeight: 700,
                    color: up ? '#22c55e' : '#ef4444',
                    background: up ? 'rgba(34,197,94,0.1)' : 'rgba(239,68,68,0.1)',
                    padding: '3px 8px', borderRadius: '999px',
                  }}>
                    {up ? <ArrowUpRight size={11} /> : <ArrowDownRight size={11} />}
                    {card.stat.trend}
                  </span>
                </div>

                {/* Row 2: value + label */}
                <div>
                  <p style={{ fontSize: '22px', fontWeight: 800, color: textMain, margin: 0, letterSpacing: '-0.03em', lineHeight: 1 }}>
                    {val}
                  </p>
                  <p style={{ fontSize: '12px', color: textMuted, margin: '5px 0 0 0', fontWeight: 500 }}>{card.label}</p>
                </div>
              </motion.div>
            );
          })}
        </div>


        {/* ── Charts Row ──────────────────────── */}
        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0,2fr) minmax(0,1fr)', gap: '16px', alignItems: 'stretch' }} className="dash-charts">
          <div style={{ minWidth: 0, minHeight: '380px' }}><RevenueChart /></div>
          <div style={{ minWidth: 0 }}><DonutChart /></div>
        </div>

        {/* ── Growth + Content Summary ─────────── */}
        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0,2fr) minmax(0,1fr)', gap: '16px', alignItems: 'start' }} className="dash-charts">
          <div style={{ minWidth: 0, minHeight: '360px' }}><UserGrowthChart /></div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', minWidth: 0 }}>
            {contentSummary.map((item, i) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={item.label}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 + i * 0.1 }}
                  whileHover={{ y: -2 }}
                  style={{ background: bg, border: `1px solid ${border}`, borderRadius: '18px', padding: '18px 20px', boxSizing: 'border-box', display: 'flex', alignItems: 'center', gap: '16px', boxShadow: isDark ? 'none' : '0 1px 4px rgba(0,0,0,0.06)', cursor: 'default', transition: 'box-shadow 0.2s' }}
                >
                  <div style={{ width: '46px', height: '46px', borderRadius: '13px', flexShrink: 0, background: `linear-gradient(135deg, ${item.grad[0]}, ${item.grad[1]})`, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: `0 4px 14px ${item.grad[0]}35` }}>
                    <Icon size={21} color="#fff" />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px' }}>
                      <p style={{ fontSize: '13px', color: textMuted, margin: 0, fontWeight: 500 }}>{item.label}</p>
                      <p style={{ fontSize: '20px', fontWeight: 800, color: textMain, margin: 0, flexShrink: 0, letterSpacing: '-0.02em' }}>{item.count}</p>
                    </div>
                    <p style={{ fontSize: '11px', color: textMuted, marginTop: '5px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      Recent: <span style={{ color: '#f97316', fontWeight: 600 }}>{item.recent}</span>
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* ── Recent Users Table ───────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          style={{ background: bg, border: `1px solid ${border}`, borderRadius: '20px', overflow: 'hidden', boxShadow: isDark ? 'none' : '0 1px 4px rgba(0,0,0,0.06)' }}
        >
          <div style={{ padding: '20px 24px', borderBottom: `1px solid ${border}` }}>
            <h3 style={{ fontSize: '16px', fontWeight: 700, color: textMain, margin: 0 }}>Recently Joined Users</h3>
            <p style={{ fontSize: '12px', color: textMuted, marginTop: '4px' }}>Last 10 new registrations</p>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
              <thead>
                <tr style={{ background: subtleBg }}>
                  {['User', 'Mobile', 'Plan', 'Joined', 'Status', 'Action'].map((h, i) => (
                    <th key={h} style={{ padding: '12px 16px', textAlign: i === 5 ? 'right' : 'left', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: textMuted, whiteSpace: 'nowrap', borderBottom: `1px solid ${border}` }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {recentUsers.map((user, i) => (
                  <motion.tr
                    key={user.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.55 + i * 0.03 }}
                    onMouseEnter={() => setHoveredRow(user.id)}
                    onMouseLeave={() => setHoveredRow(null)}
                    style={{
                      background: hoveredRow === user.id
                        ? (isDark ? 'rgba(51,65,85,0.35)' : 'rgba(249,115,22,0.04)')
                        : 'transparent',
                      borderBottom: `1px solid ${border}`,
                      transition: 'background 0.15s',
                    }}
                  >
                    <td style={{ padding: '14px 16px', whiteSpace: 'nowrap' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div style={{ width: '34px', height: '34px', borderRadius: '50%', background: 'linear-gradient(135deg, #f97316, #ea580c)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '12px', fontWeight: 700, flexShrink: 0 }}>
                          {user.avatar}
                        </div>
                        <div>
                          <p style={{ fontSize: '13px', fontWeight: 700, color: textMain, margin: 0 }}>{user.name}</p>
                          <p style={{ fontSize: '11px', color: textMuted, marginTop: '2px' }}>{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: '14px 16px', color: textMuted, whiteSpace: 'nowrap', fontSize: '12px' }}>{user.mobile}</td>
                    <td style={{ padding: '14px 16px', whiteSpace: 'nowrap' }}>
                      <span style={{ fontSize: '11px', fontWeight: 600, padding: '3px 10px', borderRadius: '999px', background: user.plan === 'Free' ? (isDark ? '#334155' : '#f1f5f9') : 'rgba(249,115,22,0.12)', color: user.plan === 'Free' ? textMuted : '#f97316' }}>
                        {user.plan}
                      </span>
                    </td>
                    <td style={{ padding: '14px 16px', color: textMuted, whiteSpace: 'nowrap', fontSize: '12px' }}>{user.joinedDate}</td>
                    <td style={{ padding: '14px 16px' }}><StatusBadge status={user.status} /></td>
                    <td style={{ padding: '14px 16px', textAlign: 'right' }}>
                      <button
                        onClick={() => setViewUser(user)}
                        title="View Profile"
                        style={{ padding: '7px', borderRadius: '9px', background: 'none', border: 'none', color: textMuted, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.15s' }}
                        onMouseEnter={(e) => { e.currentTarget.style.background = isDark ? 'rgba(99,102,241,0.15)' : 'rgba(99,102,241,0.08)'; e.currentTarget.style.color = '#6366f1'; }}
                        onMouseLeave={(e) => { e.currentTarget.style.background = 'none'; e.currentTarget.style.color = textMuted; }}
                      >
                        <Eye size={15} />
                      </button>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>

        <style>{`
          @media (max-width: 1100px) { .kpi-grid { grid-template-columns: repeat(2, minmax(0,1fr)) !important; } }
          @media (max-width: 560px)  { .kpi-grid { grid-template-columns: 1fr !important; } }
          @media (max-width: 860px)  { .dash-charts { grid-template-columns: 1fr !important; } }
        `}</style>

        <UserProfileModal
          user={viewUser}
          isOpen={!!viewUser}
          onClose={() => setViewUser(null)}
        />
      </div>
    </motion.div>
  );
}
