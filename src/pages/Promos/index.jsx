import { useState } from 'react';
import { Plus, Copy, Percent, IndianRupee } from 'lucide-react';
import { motion } from 'framer-motion';
import DataTable from '../../components/ui/DataTable';
import { StatusBadge } from '../../components/ui/Badge';
import Modal from '../../components/ui/Modal';
import { promoCodes } from '../../constants/mockData';
import toast from 'react-hot-toast';
import useThemeStore from '../../store/useThemeStore';

export default function Promos() {
  const { isDark } = useThemeStore();
  const [promos, setPromos] = useState(promoCodes);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ code: '', type: 'Percentage', discount: '', validFrom: '', validTo: '', maxUses: '', applicablePlans: [] });

  /* ── Colour tokens ──────────────────────── */
  const bg        = isDark ? '#1E293B' : '#ffffff';
  const border    = isDark ? '#334155' : '#e2e8f0';
  const textMain  = isDark ? '#f1f5f9' : '#0f172a';
  const textMuted = isDark ? '#94a3b8' : '#64748b';
  const inputBg   = isDark ? 'rgba(51,65,85,0.5)' : '#f8fafc';
  const hoverBg   = isDark ? 'rgba(51,65,85,0.6)' : '#f1f5f9';

  const copyCode = (code) => { navigator.clipboard.writeText(code); toast.success(`"${code}" copied!`); };
  const generateCode = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let code = 'CW';
    for (let i = 0; i < 6; i++) code += chars.charAt(Math.floor(Math.random() * chars.length));
    setForm((f) => ({ ...f, code }));
  };

  const handleCreate = () => {
    if (!form.code || !form.discount) { toast.error('Code and discount are required'); return; }
    setPromos((prev) => [{ id: Date.now(), ...form, discount: Number(form.discount), maxUses: Number(form.maxUses) || 100, usedCount: 0, status: 'Active' }, ...prev]);
    toast.success('Promo code created!');
    setShowModal(false);
    setForm({ code: '', type: 'Percentage', discount: '', validFrom: '', validTo: '', maxUses: '', applicablePlans: [] });
  };

  const toggleStatus = (id) => {
    setPromos((prev) => prev.map((p) => p.id === id ? { ...p, status: p.status === 'Active' ? 'Inactive' : 'Active' } : p));
    toast.success('Status updated');
  };

  /* ── Table columns ──────────────────────── */
  const columns = [
    {
      header: 'Code', accessor: 'code',
      render: (row) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontFamily: 'monospace', fontWeight: 700, color: '#f97316', fontSize: '13px' }}>{row.code}</span>
          <motion.button whileHover={{ scale: 1.2 }} whileTap={{ scale: 0.9 }}
            onClick={(e) => { e.stopPropagation(); copyCode(row.code); }}
            style={{ padding: '4px', borderRadius: '6px', background: 'none', border: 'none', cursor: 'pointer', color: textMuted, display: 'flex' }}
            onMouseEnter={(e) => { e.currentTarget.style.background = hoverBg; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = 'none'; }}>
            <Copy size={13} />
          </motion.button>
        </div>
      ),
    },
    {
      header: 'Type', accessor: 'type',
      render: (row) => (
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '11px', fontWeight: 600, padding: '3px 10px', borderRadius: '999px', background: 'rgba(59,130,246,0.1)', color: '#3b82f6' }}>
          {row.type === 'Percentage' ? <Percent size={11} /> : <IndianRupee size={11} />}
          {row.type}
        </span>
      ),
    },
    {
      header: 'Discount', accessor: 'discount',
      render: (row) => (
        <span style={{ fontSize: '14px', fontWeight: 700, color: textMain }}>
          {row.type === 'Percentage' ? `${row.discount}%` : `₹${row.discount}`}
        </span>
      ),
    },
    {
      header: 'Validity', sortable: false,
      render: (row) => (
        <div style={{ fontSize: '12px', color: textMuted, lineHeight: '1.6' }}>
          <p style={{ margin: 0 }}>{row.validFrom}</p>
          <p style={{ margin: 0, opacity: 0.75 }}>to {row.validTo}</p>
        </div>
      ),
    },
    {
      header: 'Usage', sortable: false,
      render: (row) => (
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '5px' }}>
            <span style={{ fontSize: '13px', fontWeight: 700, color: textMain }}>{row.usedCount}</span>
            <span style={{ fontSize: '11px', color: textMuted }}>/ {row.maxUses}</span>
          </div>
          <div style={{ width: '72px', height: '5px', background: isDark ? '#334155' : '#e2e8f0', borderRadius: '999px', overflow: 'hidden' }}>
            <div style={{ height: '100%', width: `${Math.min((row.usedCount / row.maxUses) * 100, 100)}%`, background: 'linear-gradient(90deg, #f97316, #ea580c)', borderRadius: '999px' }} />
          </div>
        </div>
      ),
    },
    { header: 'Status', accessor: 'status', render: (row) => <StatusBadge status={row.status} /> },
  ];

  const inputStyle = { width: '100%', padding: '10px 14px', borderRadius: '12px', border: `1px solid ${border}`, background: inputBg, color: textMain, fontSize: '13px', outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box', transition: 'border-color 0.2s, box-shadow 0.2s' };
  const focusInput = (e) => { e.target.style.borderColor = '#f97316'; e.target.style.boxShadow = '0 0 0 3px rgba(249,115,22,0.12)'; };
  const blurInput  = (e) => { e.target.style.borderColor = border;    e.target.style.boxShadow = 'none'; };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      style={{ flex: 1, overflowX: 'hidden', overflowY: 'auto', padding: '24px 24px 48px 24px', width: '100%', minWidth: 0, boxSizing: 'border-box' }}
    >
      <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '24px', minWidth: 0 }}>

        {/* ── Header ──────────────────────────── */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <h1 style={{ fontSize: '26px', fontWeight: 700, color: textMain, margin: 0, letterSpacing: '-0.03em' }}>Promo Codes & Vouchers</h1>
            <p style={{ fontSize: '14px', color: textMuted, marginTop: '6px' }}>Create and manage promotional codes</p>
          </div>
          <button onClick={() => setShowModal(true)}
            style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 20px', borderRadius: '12px', border: 'none', background: 'linear-gradient(135deg, #f97316, #ea580c)', color: '#fff', fontSize: '13px', fontWeight: 700, cursor: 'pointer', boxShadow: '0 4px 12px rgba(249,115,22,0.3)', transition: 'opacity 0.2s' }}
            onMouseEnter={(e) => { e.currentTarget.style.opacity = '0.88'; }}
            onMouseLeave={(e) => { e.currentTarget.style.opacity = '1'; }}>
            <Plus size={15} /> Create Promo
          </button>
        </div>

        {/* ── Table Card ──────────────────────── */}
        <div style={{ background: bg, border: `1px solid ${border}`, borderRadius: '20px', padding: '24px', boxSizing: 'border-box', boxShadow: isDark ? 'none' : '0 1px 4px rgba(0,0,0,0.06)', minWidth: 0, overflow: 'hidden' }}>
          <DataTable
            columns={columns}
            data={promos}
            searchPlaceholder="Search by code..."
            actions={(row) => (
              <button
                onClick={() => toggleStatus(row.id)}
                style={{
                  padding: '5px 12px', borderRadius: '8px', border: 'none', fontSize: '12px', fontWeight: 600, cursor: 'pointer', transition: 'background 0.15s',
                  background: row.status === 'Active' ? 'rgba(239,68,68,0.1)' : 'rgba(34,197,94,0.1)',
                  color: row.status === 'Active' ? '#ef4444' : '#22c55e',
                }}
                onMouseEnter={(e) => { e.currentTarget.style.opacity = '0.8'; }}
                onMouseLeave={(e) => { e.currentTarget.style.opacity = '1'; }}
              >
                {row.status === 'Active' ? 'Deactivate' : 'Activate'}
              </button>
            )}
          />
        </div>

        {/* ── Create Modal ─────────────────────── */}
        <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Create Promo Code" size="md">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, color: textMuted, marginBottom: '7px' }}>Promo Code *</label>
              <div style={{ display: 'flex', gap: '8px' }}>
                <input type="text" value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })} placeholder="e.g., SUMMER50" style={{ ...inputStyle, fontFamily: 'monospace', flex: 1 }} onFocus={focusInput} onBlur={blurInput} />
                <button onClick={generateCode}
                  style={{ padding: '10px 16px', borderRadius: '12px', border: `1px solid ${border}`, background: 'transparent', color: textMuted, fontSize: '13px', fontWeight: 600, cursor: 'pointer', whiteSpace: 'nowrap' }}>
                  Generate
                </button>
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, color: textMuted, marginBottom: '7px' }}>Type</label>
                <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })} style={inputStyle} onFocus={focusInput} onBlur={blurInput}>
                  <option value="Percentage">Percentage (%)</option>
                  <option value="Flat">Flat (₹)</option>
                </select>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, color: textMuted, marginBottom: '7px' }}>Discount *</label>
                <input type="number" value={form.discount} onChange={(e) => setForm({ ...form, discount: e.target.value })} placeholder={form.type === 'Percentage' ? '25' : '100'} style={inputStyle} onFocus={focusInput} onBlur={blurInput} />
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, color: textMuted, marginBottom: '7px' }}>Valid From</label>
                <input type="date" value={form.validFrom} onChange={(e) => setForm({ ...form, validFrom: e.target.value })} style={{ ...inputStyle, colorScheme: isDark ? 'dark' : 'light' }} onFocus={focusInput} onBlur={blurInput} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, color: textMuted, marginBottom: '7px' }}>Valid To</label>
                <input type="date" value={form.validTo} onChange={(e) => setForm({ ...form, validTo: e.target.value })} style={{ ...inputStyle, colorScheme: isDark ? 'dark' : 'light' }} onFocus={focusInput} onBlur={blurInput} />
              </div>
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, color: textMuted, marginBottom: '7px' }}>Max Uses</label>
              <input type="number" value={form.maxUses} onChange={(e) => setForm({ ...form, maxUses: e.target.value })} placeholder="500" style={inputStyle} onFocus={focusInput} onBlur={blurInput} />
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', paddingTop: '8px' }}>
              <button onClick={() => setShowModal(false)}
                style={{ padding: '9px 20px', borderRadius: '11px', border: `1px solid ${border}`, background: 'transparent', color: textMuted, fontSize: '13px', fontWeight: 600, cursor: 'pointer' }}>
                Cancel
              </button>
              <button onClick={handleCreate}
                style={{ padding: '9px 20px', borderRadius: '11px', border: 'none', background: 'linear-gradient(135deg, #f97316, #ea580c)', color: '#fff', fontSize: '13px', fontWeight: 700, cursor: 'pointer', boxShadow: '0 4px 12px rgba(249,115,22,0.3)' }}>
                Create Code
              </button>
            </div>
          </div>
        </Modal>

      </div>
    </motion.div>
  );
}
