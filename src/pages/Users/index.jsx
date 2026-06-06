import { useState } from 'react';
import { Trash2, Ban, Eye } from 'lucide-react';
import { motion } from 'framer-motion';
import DataTable from '../../components/ui/DataTable';
import { StatusBadge } from '../../components/ui/Badge';
import { ConfirmModal } from '../../components/ui/Modal';
import UserProfileModal from '../../components/ui/UserProfileModal';
import { allUsers } from '../../constants/mockData';
import toast from 'react-hot-toast';
import useThemeStore from '../../store/useThemeStore';

export default function UserManagement() {
  const { isDark } = useThemeStore();
  const [users, setUsers] = useState(allUsers);
  const [deleteModal, setDeleteModal] = useState({ open: false, user: null });
  const [activeFilter, setActiveFilter] = useState('all');
  const [viewUser, setViewUser] = useState(null);

  /* ── Colour tokens ──────────────────────── */
  const bg        = isDark ? '#1E293B' : '#ffffff';
  const border    = isDark ? '#334155' : '#e2e8f0';
  const textMain  = isDark ? '#f1f5f9' : '#0f172a';
  const textMuted = isDark ? '#94a3b8' : '#64748b';
  const hoverBg   = isDark ? 'rgba(51,65,85,0.5)' : '#f1f5f9';

  const filteredUsers = activeFilter === 'all' ? users : users.filter((u) => {
    if (activeFilter === 'active')     return u.status === 'Active';
    if (activeFilter === 'inactive')   return u.status === 'Inactive' || u.status === 'Blocked';
    if (activeFilter === 'subscribed') return u.plan !== 'Free';
    if (activeFilter === 'free')       return u.plan === 'Free';
    return true;
  });

  const filters = [
    { value: 'all',        label: 'All Users',  count: users.length },
    { value: 'active',     label: 'Active',     count: users.filter((u) => u.status === 'Active').length },
    { value: 'subscribed', label: 'Subscribed', count: users.filter((u) => u.plan !== 'Free').length },
    { value: 'free',       label: 'Free',       count: users.filter((u) => u.plan === 'Free').length },
    { value: 'inactive',   label: 'Blocked',    count: users.filter((u) => u.status === 'Blocked').length },
  ];

  /* ── Table columns ──────────────────────── */
  const columns = [
    {
      header: '#', accessor: 'id',
      render: (row) => <span style={{ fontFamily: 'monospace', fontSize: '12px', color: textMuted }}>{row.id}</span>,
    },
    {
      header: 'User', accessor: 'name',
      render: (row) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ width: '34px', height: '34px', borderRadius: '50%', background: 'linear-gradient(135deg, #f97316, #ea580c)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '12px', fontWeight: 700, flexShrink: 0 }}>
            {row.avatar}
          </div>
          <div>
            <p style={{ fontSize: '13px', fontWeight: 700, color: textMain, margin: 0 }}>{row.name}</p>
            <p style={{ fontSize: '11px', color: textMuted, marginTop: '2px' }}>{row.email}</p>
          </div>
        </div>
      ),
    },
    {
      header: 'Mobile', accessor: 'mobile',
      render: (row) => <span style={{ fontSize: '12px', color: textMuted }}>{row.mobile}</span>,
    },
    {
      header: 'Signup', accessor: 'signupVia',
      render: (row) => (
        <span style={{ fontSize: '11px', fontWeight: 600, padding: '3px 10px', borderRadius: '999px', background: isDark ? '#334155' : '#f1f5f9', color: textMuted }}>
          {row.signupVia}
        </span>
      ),
    },
    {
      header: 'Plan', accessor: 'plan',
      render: (row) => (
        <span style={{ fontSize: '11px', fontWeight: 600, padding: '3px 10px', borderRadius: '999px', background: row.plan === 'Free' ? (isDark ? '#334155' : '#f1f5f9') : 'rgba(249,115,22,0.12)', color: row.plan === 'Free' ? textMuted : '#f97316' }}>
          {row.plan}
        </span>
      ),
    },
    {
      header: 'Joined', accessor: 'joinedDate',
      render: (row) => <span style={{ fontSize: '12px', color: textMuted }}>{row.joinedDate}</span>,
    },
    {
      header: 'Status', accessor: 'status',
      render: (row) => <StatusBadge status={row.status} />,
    },
  ];

  const handleDelete = (user) => {
    setUsers((prev) => prev.filter((u) => u.id !== user.id));
    toast.success(`${user.name} deleted successfully`);
  };

  const handleBlock = (user) => {
    setUsers((prev) => prev.map((u) => u.id === user.id ? { ...u, status: u.status === 'Blocked' ? 'Active' : 'Blocked' } : u));
    toast.success(`${user.name} ${user.status === 'Blocked' ? 'unblocked' : 'blocked'}`);
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
          <h1 style={{ fontSize: '26px', fontWeight: 700, color: textMain, margin: 0, letterSpacing: '-0.03em' }}>User Management</h1>
          <p style={{ fontSize: '14px', color: textMuted, marginTop: '6px' }}>Manage all registered users</p>
        </div>

        {/* ── Table Card ──────────────────────── */}
        <div style={{ background: bg, border: `1px solid ${border}`, borderRadius: '20px', padding: '24px', boxSizing: 'border-box', boxShadow: isDark ? 'none' : '0 1px 4px rgba(0,0,0,0.06)', minWidth: 0, overflow: 'hidden' }}>
          <DataTable
            columns={columns}
            data={filteredUsers}
            searchPlaceholder="Search by name, email, mobile..."
            filters={filters}
            activeFilter={activeFilter}
            onFilterChange={(val) => { setActiveFilter(val); }}
            actions={(row) => (
              <>
                {/* View */}
                <motion.button
                  whileHover={{ scale: 1.15 }} whileTap={{ scale: 0.9 }}
                  title="View Profile"
                  onClick={() => setViewUser(row)}
                  style={{ padding: '7px', borderRadius: '9px', background: 'none', border: 'none', color: textMuted, cursor: 'pointer', display: 'flex' }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = isDark ? 'rgba(99,102,241,0.15)' : 'rgba(99,102,241,0.08)'; e.currentTarget.style.color = '#6366f1'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = 'none'; e.currentTarget.style.color = textMuted; }}
                >
                  <Eye size={15} />
                </motion.button>

                {/* Block / Unblock */}
                <motion.button
                  whileHover={{ scale: 1.15 }} whileTap={{ scale: 0.9 }}
                  onClick={() => handleBlock(row)}
                  title={row.status === 'Blocked' ? 'Unblock User' : 'Block User'}
                  style={{ padding: '7px', borderRadius: '9px', background: row.status === 'Blocked' ? 'rgba(234,179,8,0.12)' : 'none', border: 'none', color: row.status === 'Blocked' ? '#eab308' : textMuted, cursor: 'pointer', display: 'flex', transition: 'all 0.15s' }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(234,179,8,0.15)'; e.currentTarget.style.color = '#eab308'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = row.status === 'Blocked' ? 'rgba(234,179,8,0.12)' : 'none'; e.currentTarget.style.color = row.status === 'Blocked' ? '#eab308' : textMuted; }}
                >
                  <Ban size={15} />
                </motion.button>

                {/* Delete */}
                <motion.button
                  whileHover={{ scale: 1.15 }} whileTap={{ scale: 0.9 }}
                  onClick={() => setDeleteModal({ open: true, user: row })}
                  title="Delete User"
                  style={{ padding: '7px', borderRadius: '9px', background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', display: 'flex', transition: 'background 0.15s' }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(239,68,68,0.1)'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = 'none'; }}
                >
                  <Trash2 size={15} />
                </motion.button>
              </>
            )}
          />
        </div>

        <ConfirmModal
          isOpen={deleteModal.open}
          onClose={() => setDeleteModal({ open: false, user: null })}
          onConfirm={() => deleteModal.user && handleDelete(deleteModal.user)}
          title="Delete User"
          message={`Are you sure you want to delete "${deleteModal.user?.name}"? This action cannot be undone.`}
          confirmText="Delete User"
        />

        <UserProfileModal
          user={viewUser}
          isOpen={!!viewUser}
          onClose={() => setViewUser(null)}
        />
      </div>
    </motion.div>
  );
}
