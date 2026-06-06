import { useState } from 'react';
import { Plus, Edit, Trash2, Check, Zap } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Modal, { ConfirmModal } from '../../components/ui/Modal';
import { subscriptionPlans } from '../../constants/mockData';
import toast from 'react-hot-toast';
import useThemeStore from '../../store/useThemeStore';

export default function Subscriptions() {
  const { isDark } = useThemeStore();
  const [plans, setPlans] = useState(subscriptionPlans);
  const [showModal, setShowModal] = useState(false);
  const [editPlan, setEditPlan] = useState(null);
  const [deleteModal, setDeleteModal] = useState({ open: false, plan: null });
  const [form, setForm] = useState({ name: '', price: '', duration: '', features: '', trialDays: 0, isFeatured: false, discount: 0, status: 'Active' });

  /* ── Colour tokens ──────────────────────── */
  const bg        = isDark ? '#1E293B' : '#ffffff';
  const border    = isDark ? '#334155' : '#e2e8f0';
  const textMain  = isDark ? '#f1f5f9' : '#0f172a';
  const textMuted = isDark ? '#94a3b8' : '#64748b';
  const inputBg   = isDark ? 'rgba(51,65,85,0.5)' : '#f8fafc';
  const hoverBg   = isDark ? 'rgba(51,65,85,0.6)' : '#f1f5f9';
  const cardBg    = isDark ? '#1E293B' : '#ffffff';

  const openCreate = () => {
    setEditPlan(null);
    setForm({ name: '', price: '', duration: '', features: '', trialDays: 0, isFeatured: false, discount: 0, status: 'Active' });
    setShowModal(true);
  };

  const openEdit = (plan) => {
    setEditPlan(plan);
    setForm({ ...plan, features: plan.features.join('\n') });
    setShowModal(true);
  };

  const handleSave = () => {
    if (!form.name || !form.price) { toast.error('Name and price are required'); return; }
    const planData = {
      ...form,
      id: editPlan ? editPlan.id : Date.now(),
      price: Number(form.price),
      duration: Number(form.duration),
      trialDays: Number(form.trialDays),
      discount: Number(form.discount),
      features: typeof form.features === 'string' ? form.features.split('\n').filter(Boolean) : form.features,
    };
    if (editPlan) {
      setPlans((prev) => prev.map((p) => p.id === editPlan.id ? planData : p));
      toast.success('Plan updated!');
    } else {
      setPlans((prev) => [...prev, planData]);
      toast.success('Plan created!');
    }
    setShowModal(false);
  };

  const handleDelete = (plan) => {
    setPlans((prev) => prev.filter((p) => p.id !== plan.id));
    toast.success(`"${plan.name}" plan deleted`);
  };

  const toggleStatus = (id) => {
    setPlans((prev) => prev.map((p) => p.id === id ? { ...p, status: p.status === 'Active' ? 'Inactive' : 'Active' } : p));
  };

  const inputStyle = {
    width: '100%', padding: '10px 14px',
    borderRadius: '12px', border: `1px solid ${border}`,
    background: inputBg, color: textMain,
    fontSize: '13px', outline: 'none',
    fontFamily: 'inherit', boxSizing: 'border-box',
    transition: 'border-color 0.2s, box-shadow 0.2s',
  };
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
            <h1 style={{ fontSize: '26px', fontWeight: 700, color: textMain, margin: 0, letterSpacing: '-0.03em' }}>Subscription Plans</h1>
            <p style={{ fontSize: '14px', color: textMuted, marginTop: '6px' }}>Manage pricing plans for users</p>
          </div>
          <button
            onClick={openCreate}
            style={{
              display: 'flex', alignItems: 'center', gap: '8px',
              padding: '10px 20px', borderRadius: '12px', border: 'none',
              background: 'linear-gradient(135deg, #f97316, #ea580c)',
              color: '#fff', fontSize: '13px', fontWeight: 700,
              cursor: 'pointer', boxShadow: '0 4px 12px rgba(249,115,22,0.3)',
              transition: 'opacity 0.2s',
            }}
            onMouseEnter={(e) => { e.currentTarget.style.opacity = '0.88'; }}
            onMouseLeave={(e) => { e.currentTarget.style.opacity = '1'; }}
          >
            <Plus size={15} /> Create Plan
          </button>
        </div>

        {/* ── Plans Grid ───────────────────────── */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '20px' }}>
          <AnimatePresence>
            {plans.map((plan, i) => (
              <motion.div
                key={plan.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.92 }}
                transition={{ delay: i * 0.05 }}
                style={{
                  position: 'relative',
                  background: cardBg,
                  border: plan.isFeatured ? '1px solid rgba(249,115,22,0.4)' : `1px solid ${border}`,
                  borderRadius: '20px', padding: '24px',
                  boxSizing: 'border-box',
                  boxShadow: plan.isFeatured
                    ? '0 8px 24px rgba(249,115,22,0.12)'
                    : isDark ? 'none' : '0 1px 4px rgba(0,0,0,0.06)',
                  opacity: plan.status === 'Inactive' ? 0.6 : 1,
                  transition: 'box-shadow 0.2s',
                }}
              >
                {/* Featured badge */}
                {plan.isFeatured && (
                  <div style={{ position: 'absolute', top: '14px', right: '14px' }}>
                    <span style={{
                      display: 'inline-flex', alignItems: 'center', gap: '4px',
                      padding: '3px 10px', borderRadius: '999px',
                      background: 'linear-gradient(135deg, #f97316, #ea580c)',
                      color: '#fff', fontSize: '10px', fontWeight: 700, letterSpacing: '0.05em',
                    }}>
                      <Zap size={10} /> POPULAR
                    </span>
                  </div>
                )}

                {/* Discount badge */}
                {plan.discount > 0 && (
                  <div style={{ position: 'absolute', top: '14px', left: '14px' }}>
                    <span style={{
                      padding: '3px 10px', borderRadius: '999px',
                      background: '#22c55e', color: '#fff',
                      fontSize: '10px', fontWeight: 700,
                    }}>
                      -{plan.discount}%
                    </span>
                  </div>
                )}

                {/* Plan name */}
                <h3 style={{
                  fontSize: '18px', fontWeight: 700,
                  color: textMain, margin: '0 0 12px 0',
                  marginTop: (plan.isFeatured || plan.discount > 0) ? '20px' : '0',
                }}>
                  {plan.name}
                </h3>

                {/* Price */}
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px', marginBottom: '16px' }}>
                  <span style={{ fontSize: '32px', fontWeight: 800, color: '#f97316', lineHeight: 1 }}>₹{plan.price}</span>
                  <span style={{ fontSize: '13px', color: textMuted }}>/ {plan.duration} days</span>
                </div>

                {/* Trial */}
                {plan.trialDays > 0 && (
                  <p style={{ fontSize: '12px', color: '#f97316', fontWeight: 600, marginBottom: '14px' }}>
                    🎁 {plan.trialDays} days free trial
                  </p>
                )}

                {/* Features */}
                <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 20px 0', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {plan.features.map((f, idx) => (
                    <li key={idx} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: textMuted }}>
                      <Check size={13} color="#22c55e" style={{ flexShrink: 0 }} />
                      {f}
                    </li>
                  ))}
                </ul>

                {/* Status toggle */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                  <span style={{ fontSize: '12px', color: textMuted, fontWeight: 500 }}>Status</span>
                  <button
                    onClick={() => toggleStatus(plan.id)}
                    style={{
                      position: 'relative', width: '40px', height: '22px',
                      borderRadius: '999px', border: 'none', cursor: 'pointer',
                      background: plan.status === 'Active' ? '#22c55e' : isDark ? '#475569' : '#cbd5e1',
                      transition: 'background 0.2s',
                    }}
                  >
                    <motion.div
                      animate={{ x: plan.status === 'Active' ? 20 : 2 }}
                      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                      style={{
                        position: 'absolute', top: '3px',
                        width: '16px', height: '16px',
                        borderRadius: '50%', background: '#fff',
                        boxShadow: '0 1px 4px rgba(0,0,0,0.2)',
                      }}
                    />
                  </button>
                </div>

                {/* Actions */}
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button
                    onClick={() => openEdit(plan)}
                    onMouseEnter={(e) => { e.currentTarget.style.background = hoverBg; }}
                    onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
                    style={{
                      flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
                      padding: '8px 12px', borderRadius: '10px',
                      border: `1px solid ${border}`, background: 'transparent',
                      color: textMuted, fontSize: '12px', fontWeight: 600,
                      cursor: 'pointer', transition: 'background 0.15s',
                    }}
                  >
                    <Edit size={13} /> Edit
                  </button>
                  <button
                    onClick={() => setDeleteModal({ open: true, plan })}
                    onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(239,68,68,0.1)'; e.currentTarget.style.color = '#ef4444'; e.currentTarget.style.borderColor = 'rgba(239,68,68,0.3)'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = textMuted; e.currentTarget.style.borderColor = border; }}
                    style={{
                      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
                      padding: '8px 12px', borderRadius: '10px',
                      border: `1px solid ${border}`, background: 'transparent',
                      color: textMuted, fontSize: '12px', fontWeight: 600,
                      cursor: 'pointer', transition: 'all 0.15s',
                    }}
                  >
                    <Trash2 size={13} /> Delete
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* ── Create / Edit Modal ───────────── */}
        <Modal isOpen={showModal} onClose={() => setShowModal(false)} title={editPlan ? 'Edit Plan' : 'Create New Plan'} size="md">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, color: textMuted, marginBottom: '7px' }}>Plan Name *</label>
              <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="e.g., Monthly" style={inputStyle} onFocus={focusInput} onBlur={blurInput} />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, color: textMuted, marginBottom: '7px' }}>Price (₹) *</label>
                <input type="number" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} placeholder="149" style={inputStyle} onFocus={focusInput} onBlur={blurInput} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, color: textMuted, marginBottom: '7px' }}>Duration (days)</label>
                <input type="number" value={form.duration} onChange={(e) => setForm({ ...form, duration: e.target.value })} placeholder="30" style={inputStyle} onFocus={focusInput} onBlur={blurInput} />
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, color: textMuted, marginBottom: '7px' }}>Trial Days</label>
                <input type="number" value={form.trialDays} onChange={(e) => setForm({ ...form, trialDays: e.target.value })} placeholder="7" style={inputStyle} onFocus={focusInput} onBlur={blurInput} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, color: textMuted, marginBottom: '7px' }}>Discount %</label>
                <input type="number" value={form.discount} onChange={(e) => setForm({ ...form, discount: e.target.value })} placeholder="0" style={inputStyle} onFocus={focusInput} onBlur={blurInput} />
              </div>
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, color: textMuted, marginBottom: '7px' }}>Features (one per line)</label>
              <textarea
                value={typeof form.features === 'string' ? form.features : form.features.join('\n')}
                onChange={(e) => setForm({ ...form, features: e.target.value })}
                rows={4} placeholder={"Unlimited Movies\nHD Quality\n2 Devices"}
                style={{ ...inputStyle, resize: 'none', lineHeight: '1.6' }}
                onFocus={focusInput} onBlur={blurInput}
              />
            </div>
            <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', fontSize: '13px', color: textMain }}>
              <input type="checkbox" checked={form.isFeatured} onChange={(e) => setForm({ ...form, isFeatured: e.target.checked })}
                style={{ width: '16px', height: '16px', accentColor: '#f97316' }} />
              Mark as Featured (Popular)
            </label>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', paddingTop: '8px' }}>
              <button onClick={() => setShowModal(false)}
                style={{ padding: '9px 20px', borderRadius: '11px', border: `1px solid ${border}`, background: 'transparent', color: textMuted, fontSize: '13px', fontWeight: 600, cursor: 'pointer' }}>
                Cancel
              </button>
              <button onClick={handleSave}
                style={{ padding: '9px 20px', borderRadius: '11px', border: 'none', background: 'linear-gradient(135deg, #f97316, #ea580c)', color: '#fff', fontSize: '13px', fontWeight: 700, cursor: 'pointer', boxShadow: '0 4px 12px rgba(249,115,22,0.3)' }}>
                {editPlan ? 'Update Plan' : 'Create Plan'}
              </button>
            </div>
          </div>
        </Modal>

        <ConfirmModal
          isOpen={deleteModal.open}
          onClose={() => setDeleteModal({ open: false, plan: null })}
          onConfirm={() => deleteModal.plan && handleDelete(deleteModal.plan)}
          title="Delete Plan"
          message={`Are you sure you want to delete the "${deleteModal.plan?.name}" plan?`}
          confirmText="Delete Plan"
        />
      </div>
    </motion.div>
  );
}
