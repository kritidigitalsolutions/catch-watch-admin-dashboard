import { useState } from 'react';
import { CalendarPlus } from 'lucide-react';
import { motion } from 'framer-motion';
import DataTable from '../../components/ui/DataTable';
import { StatusBadge } from '../../components/ui/Badge';
import Modal from '../../components/ui/Modal';
import { userPlans } from '../../constants/mockData';
import toast from 'react-hot-toast';
import useThemeStore from '../../store/useThemeStore';

export default function UserPlans() {
  const { isDark } = useThemeStore();
  const [plans, setPlans] = useState(userPlans);
  const [activeFilter, setActiveFilter] = useState('all');
  const [extendModal, setExtendModal] = useState({ open: false, plan: null });
  const [extendDays, setExtendDays] = useState(30);

  /* ── Colour tokens ──────────────────────── */
  const bg        = isDark ? '#1E293B' : '#ffffff';
  const border    = isDark ? '#334155' : '#e2e8f0';
  const textMain  = isDark ? '#f1f5f9' : '#0f172a';
  const textMuted = isDark ? '#94a3b8' : '#64748b';
  const inputBg   = isDark ? 'rgba(51,65,85,0.5)' : '#f8fafc';

  const filteredPlans = activeFilter === 'all' ? plans : plans.filter((p) => {
    if (activeFilter === 'active')   return p.status === 'Active';
    if (activeFilter === 'expiring') return p.status === 'Expiring Soon';
    if (activeFilter === 'expired')  return p.status === 'Expired';
    return true;
  });

  const filters = [
    { value: 'all',      label: 'All Plans',      count: plans.length },
    { value: 'active',   label: 'Active',          count: plans.filter((p) => p.status === 'Active').length },
    { value: 'expiring', label: 'Expiring Soon',   count: plans.filter((p) => p.status === 'Expiring Soon').length },
    { value: 'expired',  label: 'Expired',         count: plans.filter((p) => p.status === 'Expired').length },
  ];

  /* ── Table columns ──────────────────────── */
  const columns = [
    {
      header: '#', accessor: 'id',
      render: (row) => <span style={{ fontFamily: 'monospace', fontSize: '12px', color: textMuted }}>{row.id}</span>,
    },
    {
      header: 'User', accessor: 'userName',
      render: (row) => (
        <span style={{ fontSize: '13px', fontWeight: 700, color: textMain }}>{row.userName}</span>
      ),
    },
    {
      header: 'Plan', accessor: 'planName',
      render: (row) => (
        <span style={{ fontSize: '11px', fontWeight: 600, padding: '3px 10px', borderRadius: '999px', background: 'rgba(249,115,22,0.12)', color: '#f97316' }}>
          {row.planName}
        </span>
      ),
    },
    {
      header: 'Start Date', accessor: 'startDate',
      render: (row) => <span style={{ fontSize: '12px', color: textMuted }}>{row.startDate}</span>,
    },
    {
      header: 'End Date', accessor: 'endDate',
      render: (row) => <span style={{ fontSize: '12px', color: textMuted }}>{row.endDate}</span>,
    },
    {
      header: 'Amount', accessor: 'amountPaid',
      render: (row) => (
        <span style={{ fontSize: '14px', fontWeight: 700, color: textMain }}>₹{row.amountPaid}</span>
      ),
    },
    {
      header: 'Status', accessor: 'status',
      render: (row) => <StatusBadge status={row.status} />,
    },
  ];

  const handleExtend = () => {
    if (extendModal.plan) {
      const endDate = new Date(extendModal.plan.endDate);
      endDate.setDate(endDate.getDate() + extendDays);
      setPlans((prev) => prev.map((p) => p.id === extendModal.plan.id
        ? { ...p, endDate: endDate.toISOString().split('T')[0], status: 'Active' } : p));
      toast.success(`Extended ${extendModal.plan.userName}'s plan by ${extendDays} days`);
      setExtendModal({ open: false, plan: null });
    }
  };

  const inputStyle = {
    width: '100%', padding: '10px 14px', borderRadius: '12px',
    border: `1px solid ${border}`, background: inputBg, color: textMain,
    fontSize: '13px', outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box',
    transition: 'border-color 0.2s, box-shadow 0.2s',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      style={{ flex: 1, overflowX: 'hidden', overflowY: 'auto', padding: '24px 24px 48px 24px', width: '100%', minWidth: 0, boxSizing: 'border-box' }}
    >
      <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '24px', minWidth: 0 }}>

        {/* ── Header ──────────────────────────── */}
        <div>
          <h1 style={{ fontSize: '26px', fontWeight: 700, color: textMain, margin: 0, letterSpacing: '-0.03em' }}>User Plans</h1>
          <p style={{ fontSize: '14px', color: textMuted, marginTop: '6px' }}>View and manage user subscriptions</p>
        </div>

        {/* ── Table Card ──────────────────────── */}
        <div style={{ background: bg, border: `1px solid ${border}`, borderRadius: '20px', padding: '24px', boxSizing: 'border-box', boxShadow: isDark ? 'none' : '0 1px 4px rgba(0,0,0,0.06)', minWidth: 0, overflow: 'hidden' }}>
          <DataTable
            columns={columns}
            data={filteredPlans}
            searchPlaceholder="Search by user name..."
            filters={filters}
            activeFilter={activeFilter}
            onFilterChange={setActiveFilter}
            actions={(row) => (
              <button
                onClick={() => setExtendModal({ open: true, plan: row })}
                style={{
                  display: 'flex', alignItems: 'center', gap: '6px',
                  padding: '6px 12px', borderRadius: '9px',
                  border: `1px solid ${border}`, background: 'transparent',
                  color: textMuted, fontSize: '12px', fontWeight: 600,
                  cursor: 'pointer', transition: 'all 0.15s',
                }}
                onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(249,115,22,0.08)'; e.currentTarget.style.color = '#f97316'; e.currentTarget.style.borderColor = 'rgba(249,115,22,0.3)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = textMuted; e.currentTarget.style.borderColor = border; }}
              >
                <CalendarPlus size={13} /> Extend
              </button>
            )}
          />
        </div>

        {/* ── Extend Modal ─────────────────────── */}
        <Modal isOpen={extendModal.open} onClose={() => setExtendModal({ open: false, plan: null })} title="Extend Plan" size="sm">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <p style={{ fontSize: '13px', color: textMuted, margin: 0 }}>
              Extend <strong style={{ color: textMain }}>{extendModal.plan?.userName}</strong>'s {extendModal.plan?.planName} plan
            </p>
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, color: textMuted, marginBottom: '7px' }}>Extend by (days)</label>
              <input
                type="number"
                value={extendDays}
                onChange={(e) => setExtendDays(Number(e.target.value))}
                min={1}
                style={inputStyle}
                onFocus={(e) => { e.target.style.borderColor = '#f97316'; e.target.style.boxShadow = '0 0 0 3px rgba(249,115,22,0.12)'; }}
                onBlur={(e) => { e.target.style.borderColor = border; e.target.style.boxShadow = 'none'; }}
              />
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
              <button
                onClick={() => setExtendModal({ open: false, plan: null })}
                style={{ padding: '9px 20px', borderRadius: '11px', border: `1px solid ${border}`, background: 'transparent', color: textMuted, fontSize: '13px', fontWeight: 600, cursor: 'pointer' }}>
                Cancel
              </button>
              <button
                onClick={handleExtend}
                style={{ padding: '9px 20px', borderRadius: '11px', border: 'none', background: 'linear-gradient(135deg, #f97316, #ea580c)', color: '#fff', fontSize: '13px', fontWeight: 700, cursor: 'pointer', boxShadow: '0 4px 12px rgba(249,115,22,0.3)' }}>
                Extend Plan
              </button>
            </div>
          </div>
        </Modal>

      </div>
    </motion.div>
  );
}
