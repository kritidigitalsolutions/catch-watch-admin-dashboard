import { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AnimatePresence } from 'framer-motion';
import useThemeStore from './store/useThemeStore';
import useAppStore from './store/useAppStore';
import Sidebar from './components/layout/Sidebar';
import Navbar from './components/layout/Navbar';

// Pages
import Dashboard from './pages/Dashboard';
import UserManagement from './pages/Users';
import ContentLibrary from './pages/Content';
import AddContent from './pages/Content/AddContent';
import Subscriptions from './pages/Subscriptions';
import Promos from './pages/Promos';
import UserPlans from './pages/UserPlans';
import Notifications from './pages/Notifications';
import Legal from './pages/Legal';
import Settings from './pages/Settings';
import Login from './pages/Login';

/* ── Auth-only routes (no sidebar / navbar) ── */
const AUTH_PATHS = ['/login', '/forgot-password', '/reset-password'];

function AppShell() {
  const { isDark, initTheme } = useThemeStore();
  const { sidebarCollapsed } = useAppStore();
  const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 1024);
  const location = useLocation();

  useEffect(() => {
    initTheme();
    const handleResize = () => setIsDesktop(window.innerWidth >= 1024);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const pageBg = isDark ? '#0F172A' : '#F1F5F9';
  const isAuthPage = AUTH_PATHS.some((p) => location.pathname.startsWith(p));

  /* ── Auth pages — render fullscreen, no shell ── */
  if (isAuthPage) {
    return (
      <>
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route path="/login"            element={<Login />} />
            <Route path="/forgot-password"  element={<Login />} />
            <Route path="/reset-password"   element={<Login />} />
          </Routes>
        </AnimatePresence>

        <Toaster
          position="top-right"
          toastOptions={{
            duration: 3000,
            style: {
              borderRadius: '12px',
              padding: '12px 16px',
              fontSize: '14px',
              fontWeight: '500',
              background: '#1E293B',
              color: '#f1f5f9',
              border: '1px solid #334155',
              boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
            },
          }}
        />
      </>
    );
  }

  /* ── Protected pages — render with sidebar + navbar ── */
  return (
    <div style={{ minHeight: '100vh', background: pageBg, transition: 'background 0.3s' }}>
      <Sidebar />

      {/* Main Content */}
      <div
        style={{
          marginLeft: isDesktop ? (sidebarCollapsed ? 72 : 260) : 0,
          width: isDesktop ? `calc(100% - ${sidebarCollapsed ? 72 : 260}px)` : '100%',
          minHeight: '100vh',
          overflowX: 'hidden',
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
          transition: 'margin-left 0.3s, width 0.3s',
        }}
      >
        <Navbar />
        <main style={{ width: '100%', maxWidth: '100%', minWidth: 0, flex: 1, display: 'flex', flexDirection: 'column', overflow: 'auto' }}>
          <AnimatePresence mode="wait">
            <Routes location={location} key={location.pathname}>
              <Route path="/"               element={<Dashboard />} />
              <Route path="/dashboard"      element={<Dashboard />} />
              <Route path="/users"          element={<UserManagement />} />
              <Route path="/content"        element={<ContentLibrary />} />
              <Route path="/content/movies" element={<ContentLibrary />} />
              <Route path="/content/series" element={<ContentLibrary />} />
              <Route path="/content/dramas" element={<ContentLibrary />} />
              <Route path="/content/add"    element={<AddContent />} />
              <Route path="/subscriptions"  element={<Subscriptions />} />
              <Route path="/promos"         element={<Promos />} />
              <Route path="/user-plans"     element={<UserPlans />} />
              <Route path="/notifications"  element={<Notifications />} />
              <Route path="/legal"          element={<Legal />} />
              <Route path="/settings"       element={<Settings />} />
            </Routes>
          </AnimatePresence>
        </main>
      </div>

      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            borderRadius: '12px',
            padding: '12px 16px',
            fontSize: '14px',
            fontWeight: '500',
            background: isDark ? '#1E293B' : '#ffffff',
            color: isDark ? '#f1f5f9' : '#0f172a',
            border: `1px solid ${isDark ? '#334155' : '#e2e8f0'}`,
            boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
          },
          success: {
            iconTheme: { primary: '#22C55E', secondary: isDark ? '#1E293B' : '#fff' },
          },
          error: {
            iconTheme: { primary: '#EF4444', secondary: isDark ? '#1E293B' : '#fff' },
          },
        }}
      />
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppShell />
    </BrowserRouter>
  );
}
