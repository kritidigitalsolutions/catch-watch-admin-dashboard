import { useState, useEffect } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, ChevronDown, LogOut } from 'lucide-react';
import useAppStore from '../../store/useAppStore';
import useThemeStore from '../../store/useThemeStore';
import navItems from '../../constants/navItems';
import toast from 'react-hot-toast';

export default function Sidebar() {
  const { sidebarCollapsed, toggleSidebar, sidebarMobileOpen, setMobileSidebarOpen } = useAppStore();
  const { isDark }   = useThemeStore();
  const location     = useLocation();
  const navigate     = useNavigate();
  const [openMenus, setOpenMenus]     = useState({});
  const [hoverItem, setHoverItem]     = useState(null);
  const [logoutHover, setLogoutHover] = useState(false);

  const groupedNav = [
    { title: 'Main Navigation',    items: navItems.filter((i) => ['Dashboard','User Management','Content Library','Add Content'].includes(i.label)) },
    { title: 'Business Management',items: navItems.filter((i) => ['Subscriptions','Promo & Vouchers','User Plans'].includes(i.label)) },
    { title: 'Operations',         items: navItems.filter((i) => ['Notifications','Legal & Support','Settings'].includes(i.label)) },
  ];

  const sidebarVariants = {
    expanded:  { width: 256, transition: { type: 'spring', damping: 22, stiffness: 200 } },
    collapsed: { width: 72,  transition: { type: 'spring', damping: 22, stiffness: 200 } },
  };

  const isActive = (path) => {
    if (path === '/' || path === '/dashboard')
      return location.pathname === '/' || location.pathname === '/dashboard';
    return location.pathname.startsWith(path);
  };

  const toggleMenu = (label) => setOpenMenus((p) => ({ ...p, [label]: !p[label] }));

  useEffect(() => {
    navItems.forEach((item) => {
      if (item.children) {
        const hasActiveChild = item.children.some((c) => location.pathname === c.path);
        if (hasActiveChild) setOpenMenus((p) => ({ ...p, [item.label]: true }));
      }
    });
  }, [location.pathname]);

  /* ── Tokens ── */
  const bg       = isDark ? '#1E293B' : '#ffffff';
  const border   = isDark ? '#334155' : '#e2e8f0';
  const textMain = isDark ? '#f1f5f9' : '#0f172a';
  const textMuted= isDark ? '#94a3b8' : '#64748b';
  const hoverBg  = isDark ? 'rgba(51,65,85,0.7)' : '#f1f5f9';
  const activeBg = isDark ? 'rgba(249,115,22,0.12)' : 'rgba(249,115,22,0.09)';

  const navItemStyle = (active, isHovered) => ({
    position: 'relative', display: 'flex', alignItems: 'center',
    height: '44px', width: '100%', borderRadius: '12px',
    padding: '0 14px', gap: '12px', cursor: 'pointer',
    transition: 'background 0.18s, color 0.18s',
    background: active ? activeBg : isHovered ? hoverBg : 'transparent',
    border: active ? '1px solid rgba(249,115,22,0.18)' : '1px solid transparent',
    color: active ? '#f97316' : isHovered ? textMain : textMuted,
    boxSizing: 'border-box', userSelect: 'none',
    justifyContent: sidebarCollapsed ? 'center' : 'flex-start',
  });

  const iconWrapStyle = (active) => ({
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    width: '28px', height: '28px', borderRadius: '8px', flexShrink: 0,
    background: active ? 'rgba(249,115,22,0.14)' : 'transparent',
    color: active ? '#f97316' : 'inherit', transition: 'background 0.18s',
  });

  const childItemStyle = (active, isHovered) => ({
    display: 'flex', alignItems: 'center', height: '38px', borderRadius: '10px',
    padding: '0 12px', cursor: 'pointer', fontSize: '13.5px',
    fontWeight: active ? 600 : 400, transition: 'background 0.18s, color 0.18s',
    background: active ? activeBg : isHovered ? hoverBg : 'transparent',
    color: active ? '#f97316' : isHovered ? textMain : textMuted,
    border: active ? '1px solid rgba(249,115,22,0.15)' : '1px solid transparent',
    boxSizing: 'border-box',
  });

  return (
    <>
      {/* Mobile Overlay */}
      <AnimatePresence>
        {sidebarMobileOpen && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => setMobileSidebarOpen(false)}
            style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 40, display: 'none' }}
            className="lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* ── Sidebar ── */}
      <motion.aside
        variants={sidebarVariants}
        animate={sidebarCollapsed ? 'collapsed' : 'expanded'}
        style={{
          position: 'fixed', inset: '0 auto 0 0', zIndex: 50,
          height: '100vh', background: bg,
          borderRight: `1px solid ${border}`,
          display: 'flex', flexDirection: 'column',
          overflow: 'hidden',
          boxShadow: isDark ? 'none' : '2px 0 12px rgba(0,0,0,0.06)',
        }}
      >

        {/* Logo */}
        <div style={{
          flexShrink: 0, borderBottom: `1px solid ${border}`,
          padding: sidebarCollapsed ? '20px 0' : '20px',
          display: 'flex', alignItems: 'center',
          justifyContent: sidebarCollapsed ? 'center' : 'flex-start',
          gap: '12px', minHeight: '72px', boxSizing: 'border-box',
        }}>
          <img src="/logo.jpg" alt="Logo"
            style={{ width: '38px', height: '38px', borderRadius: '10px', objectFit: 'cover', flexShrink: 0, boxShadow: '0 2px 8px rgba(249,115,22,0.2)' }}
          />
          <AnimatePresence mode="wait">
            {!sidebarCollapsed && (
              <motion.div key="logo-text"
                initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -8 }} transition={{ duration: 0.18 }}
                style={{ overflow: 'hidden', minWidth: 0 }}
              >
                <p style={{ fontSize: '13px', fontWeight: 700, letterSpacing: '0.1em', color: '#f97316', whiteSpace: 'nowrap', lineHeight: 1 }}>CATCH & WATCH</p>
                <p style={{ fontSize: '10px', fontWeight: 500, letterSpacing: '0.18em', color: textMuted, marginTop: '4px', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>Admin Panel</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Navigation */}
        <nav style={{ flex: 1, overflowY: 'auto', overflowX: 'hidden', padding: '16px 12px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {groupedNav.map((group) => (
            <div key={group.title} style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              {!sidebarCollapsed && (
                <p style={{ fontSize: '10px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.2em', color: textMuted, opacity: 0.65, padding: '0 6px', marginBottom: '6px' }}>
                  {group.title}
                </p>
              )}
              {sidebarCollapsed && <div style={{ height: '1px', background: border, margin: '2px 6px 8px 6px', opacity: 0.5 }} />}

              <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
                {group.items.map((item) => {
                  const Icon = item.icon;
                  const hasChildren = !!item.children;
                  const isOpen = openMenus[item.label];
                  const active = isActive(item.path);
                  const isHov = hoverItem === item.label;

                  if (hasChildren) {
                    return (
                      <div key={item.label}>
                        <div
                          onClick={() => toggleMenu(item.label)}
                          onMouseEnter={() => setHoverItem(item.label)}
                          onMouseLeave={() => setHoverItem(null)}
                          style={{ ...navItemStyle(active, isHov), justifyContent: sidebarCollapsed ? 'center' : 'space-between' }}
                        >
                          {active && <motion.div layoutId="activeBar" style={{ position: 'absolute', left: 0, top: '50%', transform: 'translateY(-50%)', width: '3px', height: '22px', background: '#f97316', borderRadius: '0 4px 4px 0' }} transition={{ type: 'spring', damping: 20, stiffness: 300 }} />}
                          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', minWidth: 0 }}>
                            <div style={iconWrapStyle(active)}><Icon size={18} /></div>
                            {!sidebarCollapsed && <span style={{ fontSize: '14px', fontWeight: 500, whiteSpace: 'nowrap', color: 'inherit' }}>{item.label}</span>}
                          </div>
                          {!sidebarCollapsed && (
                            <motion.div animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: 0.2 }} style={{ color: textMuted, flexShrink: 0 }}>
                              <ChevronDown size={15} />
                            </motion.div>
                          )}
                        </div>
                        <AnimatePresence initial={false}>
                          {isOpen && !sidebarCollapsed && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.2, ease: 'easeInOut' }}
                              style={{ overflow: 'hidden' }}
                            >
                              <div style={{ marginLeft: '16px', marginTop: '4px', paddingLeft: '12px', borderLeft: `2px solid ${border}`, display: 'flex', flexDirection: 'column', gap: '3px', paddingBottom: '4px' }}>
                                {item.children.map((child) => {
                                  const childActive = location.pathname === child.path;
                                  const childKey = `child-${child.label}`;
                                  return (
                                    <NavLink key={child.label} to={child.path} onClick={() => setMobileSidebarOpen(false)} style={{ textDecoration: 'none' }}>
                                      <div onMouseEnter={() => setHoverItem(childKey)} onMouseLeave={() => setHoverItem(null)} style={childItemStyle(childActive, hoverItem === childKey)}>
                                        {child.label}
                                      </div>
                                    </NavLink>
                                  );
                                })}
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    );
                  }

                  return (
                    <NavLink key={item.label} to={item.path} onClick={() => setMobileSidebarOpen(false)} style={{ textDecoration: 'none', display: 'block' }}>
                      <div onMouseEnter={() => setHoverItem(item.label)} onMouseLeave={() => setHoverItem(null)} style={navItemStyle(active, isHov)}>
                        {active && <motion.div layoutId="activeBar" style={{ position: 'absolute', left: 0, top: '50%', transform: 'translateY(-50%)', width: '3px', height: '22px', background: '#f97316', borderRadius: '0 4px 4px 0' }} transition={{ type: 'spring', damping: 20, stiffness: 300 }} />}
                        <div style={iconWrapStyle(active)}><Icon size={18} /></div>
                        <AnimatePresence mode="wait">
                          {!sidebarCollapsed && (
                            <motion.span key="label" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.15 }}
                              style={{ fontSize: '14px', fontWeight: 500, whiteSpace: 'nowrap', color: 'inherit', overflow: 'hidden' }}>
                              {item.label}
                            </motion.span>
                          )}
                        </AnimatePresence>
                      </div>
                    </NavLink>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        {/* ── Professional Footer ── */}
        <div style={{ flexShrink: 0, borderTop: `1px solid ${border}`, padding: '12px' }}>

          {/* Admin info row — expanded only */}
          {!sidebarCollapsed && (
            <div style={{
              display: 'flex', alignItems: 'center', gap: '10px',
              padding: '10px 12px', borderRadius: '12px',
              background: isDark ? 'rgba(51,65,85,0.3)' : '#f8fafc',
              border: `1px solid ${border}`, marginBottom: '8px',
            }}>
              <div style={{
                width: '34px', height: '34px', borderRadius: '10px',
                background: 'linear-gradient(135deg, #f97316, #ea580c)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: '#fff', fontSize: '12px', fontWeight: 700, flexShrink: 0,
                boxShadow: '0 3px 8px rgba(249,115,22,0.3)',
              }}>AU</div>
              <div style={{ minWidth: 0, flex: 1 }}>
                <p style={{ fontSize: '13px', fontWeight: 700, color: textMain, margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>Admin</p>
                <p style={{ fontSize: '10px', color: textMuted, margin: '2px 0 0 0', letterSpacing: '0.04em' }}>Super Admin</p>
              </div>
            </div>
          )}

          {/* Logout button */}
          <button
            onClick={() => { toast.success('Logged out successfully'); navigate('/login'); }}
            onMouseEnter={() => setLogoutHover(true)}
            onMouseLeave={() => setLogoutHover(false)}
            style={{
              width: '100%', display: 'flex', alignItems: 'center',
              justifyContent: sidebarCollapsed ? 'center' : 'flex-start',
              gap: '9px', padding: '10px 14px', borderRadius: '11px',
              background: logoutHover ? 'rgba(239,68,68,0.12)' : 'transparent',
              border: `1px solid ${logoutHover ? 'rgba(239,68,68,0.35)' : 'rgba(239,68,68,0.2)'}`,
              color: '#ef4444', cursor: 'pointer',
              fontSize: '13px', fontWeight: 600,
              transition: 'all 0.18s', boxSizing: 'border-box',
              marginBottom: '8px',
            }}
          >
            <LogOut size={15} style={{ flexShrink: 0 }} />
            {!sidebarCollapsed && <span>Logout</span>}
          </button>

          {/* Collapse toggle */}
          <div style={{ display: 'none' }} className="lg:block">
            <button
              onClick={toggleSidebar}
              onMouseEnter={(e) => { e.currentTarget.style.background = hoverBg; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
              style={{
                width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                gap: '8px', padding: '8px', borderRadius: '10px',
                background: 'transparent', border: `1px solid ${border}`,
                color: textMuted, cursor: 'pointer',
                fontSize: '12px', fontWeight: 500,
                transition: 'background 0.18s', boxSizing: 'border-box',
              }}
            >
              {sidebarCollapsed ? <ChevronRight size={15} /> : <><ChevronLeft size={15} /><span>Collapse</span></>}
            </button>
          </div>
        </div>

      </motion.aside>
    </>
  );
}
