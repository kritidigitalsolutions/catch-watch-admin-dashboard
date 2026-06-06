import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sun, Moon, Bell, Menu, X, Settings, LogOut, ChevronDown, User } from 'lucide-react';
import useThemeStore from '../../store/useThemeStore';
import useAppStore from '../../store/useAppStore';
import { adminProfile } from '../../constants/mockData';
import { useLocation, useNavigate } from 'react-router-dom';
import navItems from '../../constants/navItems';

export default function Navbar() {
  const { isDark, toggleTheme } = useThemeStore();
  const { toggleMobileSidebar, sidebarMobileOpen } = useAppStore();
  const location  = useLocation();
  const navigate  = useNavigate();
  const [dropOpen, setDropOpen] = useState(false);
  const dropRef   = useRef(null);

  const currentPage = navItems.find((item) => {
    if (item.path === '/') return location.pathname === '/';
    return location.pathname.startsWith(item.path);
  });

  /* Close dropdown on outside click */
  useEffect(() => {
    const handler = (e) => { if (dropRef.current && !dropRef.current.contains(e.target)) setDropOpen(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const bg        = isDark ? 'rgba(30,41,59,0.95)' : 'rgba(255,255,255,0.95)';
  const border    = isDark ? '#334155' : '#e2e8f0';
  const textMain  = isDark ? '#f1f5f9' : '#0f172a';
  const textMuted = isDark ? '#94a3b8' : '#64748b';
  const hoverBg   = isDark ? 'rgba(51,65,85,0.7)' : '#f1f5f9';
  const dropBg    = isDark ? '#1E293B' : '#ffffff';

  const iconBtnStyle = {
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    width: '38px', height: '38px', borderRadius: '10px',
    border: 'none', background: 'transparent', color: textMuted,
    cursor: 'pointer', transition: 'background 0.18s, color 0.18s', flexShrink: 0,
  };

  return (
    <header style={{
      height: '64px', display: 'flex', alignItems: 'center',
      justifyContent: 'space-between', padding: '0 24px',
      background: bg, backdropFilter: 'blur(16px)',
      WebkitBackdropFilter: 'blur(16px)',
      borderBottom: `1px solid ${border}`,
      position: 'sticky', top: 0, zIndex: 30,
      boxSizing: 'border-box', gap: '16px',
    }}>

      {/* ── Left ─────────────────────────────── */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', minWidth: 0 }}>
        <button
          onClick={toggleMobileSidebar}
          style={{ ...iconBtnStyle, display: 'none' }}
          className="lg:hidden"
          onMouseEnter={(e) => { e.currentTarget.style.background = hoverBg; }}
          onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
        >
          {sidebarMobileOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
        <img src="/logo.jpg" alt="Catch & Watch"
          style={{ width: '32px', height: '32px', borderRadius: '8px', objectFit: 'cover', display: 'none' }}
          className="lg:hidden"
        />
        <h2 style={{ fontSize: '17px', fontWeight: 600, color: textMain, margin: 0, letterSpacing: '-0.01em', whiteSpace: 'nowrap' }}>
          {currentPage?.label || 'Dashboard'}
        </h2>
      </div>

      {/* ── Right ─────────────────────────────── */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>

        {/* Notification bell */}
        <motion.button whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.92 }}
          style={{ ...iconBtnStyle, position: 'relative' }}
          onMouseEnter={(e) => { e.currentTarget.style.background = hoverBg; }}
          onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
        >
          <Bell size={19} style={{ color: textMuted }} />
          <span style={{
            position: 'absolute', top: '8px', right: '8px',
            width: '8px', height: '8px',
            background: '#f97316', borderRadius: '50%',
            border: `2px solid ${isDark ? '#1E293B' : '#fff'}`,
          }} />
        </motion.button>

        {/* Theme toggle */}
        <motion.button whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.92 }}
          onClick={toggleTheme} style={iconBtnStyle}
          onMouseEnter={(e) => { e.currentTarget.style.background = hoverBg; }}
          onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
        >
          <motion.div
            key={isDark ? 'moon' : 'sun'}
            initial={{ rotate: -90, opacity: 0 }}
            animate={{ rotate: 0, opacity: 1 }}
            exit={{ rotate: 90, opacity: 0 }}
            transition={{ duration: 0.28 }}
            style={{ display: 'flex' }}
          >
            {isDark ? <Sun size={19} style={{ color: '#facc15' }} /> : <Moon size={19} style={{ color: textMuted }} />}
          </motion.div>
        </motion.button>

        {/* Divider */}
        <div style={{ width: '1px', height: '32px', background: border, margin: '0 4px', flexShrink: 0 }} />

        {/* ── AU Avatar Dropdown ────────────────── */}
        <div ref={dropRef} style={{ position: 'relative' }}>
          <button
            onClick={() => setDropOpen((p) => !p)}
            style={{
              display: 'flex', alignItems: 'center', gap: '8px',
              padding: '4px 8px 4px 4px',
              borderRadius: '12px',
              border: `1px solid ${dropOpen ? 'rgba(249,115,22,0.3)' : 'transparent'}`,
              background: dropOpen ? (isDark ? 'rgba(249,115,22,0.08)' : 'rgba(249,115,22,0.05)') : 'transparent',
              cursor: 'pointer', transition: 'all 0.18s',
            }}
            onMouseEnter={(e) => { e.currentTarget.style.background = isDark ? 'rgba(51,65,85,0.5)' : '#f1f5f9'; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = dropOpen ? (isDark ? 'rgba(249,115,22,0.08)' : 'rgba(249,115,22,0.05)') : 'transparent'; }}
          >
            <div style={{
              width: '34px', height: '34px', borderRadius: '9px',
              background: 'linear-gradient(135deg, #f97316, #ea580c)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: '#fff', fontSize: '13px', fontWeight: 700, flexShrink: 0,
              boxShadow: '0 4px 10px rgba(249,115,22,0.3)',
            }}>
              {adminProfile.avatar}
            </div>
            <div style={{ display: 'none', textAlign: 'left' }} className="sm:block">
              <p style={{ fontSize: '12px', fontWeight: 700, color: textMain, margin: 0, lineHeight: 1.2 }}>{adminProfile.name || 'Admin'}</p>
              <p style={{ fontSize: '10px', color: textMuted, marginTop: '2px' }}>{adminProfile.role}</p>
            </div>
            <motion.div animate={{ rotate: dropOpen ? 180 : 0 }} transition={{ duration: 0.2 }}>
              <ChevronDown size={14} style={{ color: textMuted }} />
            </motion.div>
          </button>

          {/* Dropdown menu */}
          <AnimatePresence>
            {dropOpen && (
              <motion.div
                initial={{ opacity: 0, y: -8, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -8, scale: 0.95 }}
                transition={{ duration: 0.15, ease: 'easeOut' }}
                style={{
                  position: 'absolute', right: 0, top: 'calc(100% + 8px)',
                  width: '200px',
                  background: dropBg,
                  border: `1px solid ${border}`,
                  borderRadius: '16px',
                  padding: '8px',
                  boxShadow: isDark ? '0 16px 40px rgba(0,0,0,0.4)' : '0 8px 32px rgba(0,0,0,0.12)',
                  zIndex: 999,
                  boxSizing: 'border-box',
                }}
              >
                {/* Profile info */}
                <div style={{ padding: '10px 12px', borderBottom: `1px solid ${border}`, marginBottom: '6px' }}>
                  <p style={{ fontSize: '13px', fontWeight: 700, color: textMain, margin: 0 }}>{adminProfile.name}</p>
                  <p style={{ fontSize: '11px', color: textMuted, marginTop: '3px' }}>{adminProfile.role}</p>
                </div>

                {/* Menu items */}
                {[
                  { icon: User,     label: 'My Profile',  action: () => { navigate('/settings'); setDropOpen(false); } },
                  { icon: Settings, label: 'Settings',    action: () => { navigate('/settings'); setDropOpen(false); } },
                ].map((item) => (
                  <button
                    key={item.label}
                    onClick={item.action}
                    style={{
                      width: '100%', display: 'flex', alignItems: 'center', gap: '10px',
                      padding: '10px 12px', borderRadius: '10px', border: 'none',
                      background: 'transparent', color: textMuted,
                      fontSize: '13px', fontWeight: 500, cursor: 'pointer',
                      transition: 'background 0.15s, color 0.15s',
                      textAlign: 'left', boxSizing: 'border-box',
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.background = hoverBg; e.currentTarget.style.color = textMain; }}
                    onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = textMuted; }}
                  >
                    <item.icon size={15} />
                    {item.label}
                  </button>
                ))}

                {/* Divider */}
                <div style={{ height: '1px', background: border, margin: '6px 0' }} />

                {/* Logout */}
                <button
                  onClick={() => { navigate('/login'); setDropOpen(false); }}
                  style={{
                    width: '100%', display: 'flex', alignItems: 'center', gap: '10px',
                    padding: '10px 12px', borderRadius: '10px', border: 'none',
                    background: 'transparent', color: '#ef4444',
                    fontSize: '13px', fontWeight: 600, cursor: 'pointer',
                    transition: 'background 0.15s',
                    textAlign: 'left', boxSizing: 'border-box',
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(239,68,68,0.08)'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
                >
                  <LogOut size={15} />
                  Logout
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
}
