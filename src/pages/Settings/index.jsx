import { useState } from 'react';
import { User, Mail, Lock, Sun, Moon, Camera, Eye, EyeOff, ShieldCheck, Clock3, BadgeCheck, LaptopMinimal, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import useThemeStore from '../../store/useThemeStore';
import { adminProfile } from '../../constants/mockData';
import toast from 'react-hot-toast';

/* ─────────────────────────────────────────
   Inline styles — no Tailwind dependency
───────────────────────────────────────── */
const styles = {
  page: {
    flex: 1,
    overflowX: 'hidden',
    overflowY: 'auto',
    padding: '32px 32px 48px 32px',
    width: '100%',
    boxSizing: 'border-box',
  },
  inner: {
    maxWidth: '1100px',
    margin: '0 auto',
    display: 'flex',
    flexDirection: 'column',
    gap: '28px',
  },

  /* Page header */
  pageHeader: {
    marginBottom: '4px',
  },
  pageTitle: {
    fontSize: '26px',
    fontWeight: 700,
    letterSpacing: '-0.03em',
    margin: 0,
    lineHeight: 1.2,
  },
  pageSubtitle: {
    fontSize: '14px',
    marginTop: '6px',
    opacity: 0.6,
  },

  /* Card base */
  card: (isDark) => ({
    background: isDark ? '#1E293B' : '#ffffff',
    border: `1px solid ${isDark ? '#334155' : '#e2e8f0'}`,
    borderRadius: '20px',
    padding: '28px',
    boxShadow: isDark ? 'none' : '0 1px 4px rgba(0,0,0,0.07)',
    boxSizing: 'border-box',
    width: '100%',
  }),

  /* Profile hero card */
  profileCard: (isDark) => ({
    background: isDark ? '#1E293B' : '#ffffff',
    border: `1px solid ${isDark ? '#334155' : '#e2e8f0'}`,
    borderRadius: '20px',
    padding: '28px',
    boxSizing: 'border-box',
    width: '100%',
    boxShadow: isDark ? 'none' : '0 1px 4px rgba(0,0,0,0.07)',
  }),
  profileTop: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '20px',
    flexWrap: 'wrap',
  },
  avatarWrap: {
    position: 'relative',
    flexShrink: 0,
  },
  avatar: {
    width: '80px',
    height: '80px',
    borderRadius: '18px',
    background: 'linear-gradient(135deg, #f97316, #ea580c)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '28px',
    fontWeight: 700,
    color: '#fff',
    boxShadow: '0 8px 24px rgba(249,115,22,0.25)',
  },
  avatarOverlay: {
    position: 'absolute',
    inset: 0,
    borderRadius: '18px',
    background: 'rgba(0,0,0,0.4)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    opacity: 0,
    transition: 'opacity 0.2s',
  },
  profileInfo: {
    flex: 1,
    minWidth: 0,
  },
  profileNameRow: {
    display: 'flex',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: '12px',
    marginBottom: '4px',
  },
  profileName: {
    fontSize: '28px',
    fontWeight: 700,
    letterSpacing: '-0.03em',
    margin: 0,
    lineHeight: 1.1,
  },
  activeBadge: {
    display: 'inline-flex',
    alignItems: 'center',
    borderRadius: '999px',
    border: '1px solid rgba(34,197,94,0.3)',
    background: 'rgba(34,197,94,0.1)',
    padding: '3px 12px',
    fontSize: '11px',
    fontWeight: 600,
    color: '#22c55e',
  },
  profileRole: {
    fontSize: '14px',
    opacity: 0.55,
    marginBottom: '16px',
  },
  profileMetaGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
    gap: '12px',
    marginTop: '4px',
  },
  metaChip: (isDark) => ({
    background: isDark ? 'rgba(51,65,85,0.5)' : '#f8fafc',
    borderRadius: '14px',
    padding: '12px 16px',
  }),
  metaLabel: {
    fontSize: '10px',
    fontWeight: 600,
    textTransform: 'uppercase',
    letterSpacing: '0.15em',
    opacity: 0.5,
    marginBottom: '4px',
  },
  metaValue: {
    fontSize: '13px',
    fontWeight: 600,
  },

  /* Quick info pills on right */
  quickInfo: (isDark) => ({
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
    flexShrink: 0,
    minWidth: '200px',
  }),
  infoPill: (isDark) => ({
    background: isDark ? 'rgba(51,65,85,0.4)' : '#f8fafc',
    border: `1px solid ${isDark ? '#334155' : '#e2e8f0'}`,
    borderRadius: '14px',
    padding: '12px 16px',
  }),

  /* Two-column grid */
  twoCol: {
    display: 'grid',
    gridTemplateColumns: '1fr',
    gap: '28px',
  },

  /* Section card header */
  cardHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '14px',
    marginBottom: '24px',
  },
  iconBox: {
    width: '44px',
    height: '44px',
    borderRadius: '12px',
    background: 'rgba(249,115,22,0.1)',
    color: '#f97316',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  cardTitle: {
    fontSize: '17px',
    fontWeight: 600,
    margin: 0,
    letterSpacing: '-0.02em',
  },
  cardSubtitle: {
    fontSize: '13px',
    opacity: 0.55,
    marginTop: '3px',
  },

  /* Form fields */
  formGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    marginBottom: '18px',
  },
  label: (isDark) => ({
    fontSize: '13px',
    fontWeight: 500,
    color: isDark ? '#cbd5e1' : '#475569',
  }),
  input: (isDark) => ({
    width: '100%',
    padding: '11px 16px',
    borderRadius: '12px',
    border: `1px solid ${isDark ? '#334155' : '#e2e8f0'}`,
    background: isDark ? 'rgba(51,65,85,0.5)' : '#f8fafc',
    color: isDark ? '#fff' : '#0f172a',
    fontSize: '14px',
    outline: 'none',
    transition: 'border-color 0.2s, box-shadow 0.2s',
    boxSizing: 'border-box',
  }),

  btnRow: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '12px',
    marginTop: '4px',
  },

  /* Primary button */
  btnPrimary: {
    padding: '10px 22px',
    borderRadius: '12px',
    background: 'linear-gradient(135deg, #f97316, #ea580c)',
    color: '#fff',
    fontWeight: 600,
    fontSize: '14px',
    border: 'none',
    cursor: 'pointer',
    transition: 'opacity 0.2s, transform 0.15s',
    whiteSpace: 'nowrap',
  },
  btnOutline: (isDark) => ({
    padding: '10px 22px',
    borderRadius: '12px',
    background: 'transparent',
    color: isDark ? '#cbd5e1' : '#475569',
    fontWeight: 600,
    fontSize: '14px',
    border: `1px solid ${isDark ? '#334155' : '#e2e8f0'}`,
    cursor: 'pointer',
    transition: 'background 0.2s, border-color 0.2s',
    whiteSpace: 'nowrap',
  }),

  /* Expandable sub-section */
  subSection: (isDark) => ({
    marginTop: '20px',
    borderRadius: '16px',
    border: `1px solid ${isDark ? '#334155' : '#e2e8f0'}`,
    background: isDark ? 'rgba(51,65,85,0.3)' : '#f8fafc',
    padding: '20px',
  }),

  /* Password row */
  pwdRow: {
    background: 'transparent',
    border: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: '12px',
    padding: '16px',
    borderRadius: '14px',
  },
  pwdRowBox: (isDark) => ({
    borderRadius: '14px',
    border: `1px solid ${isDark ? '#334155' : '#e2e8f0'}`,
    background: isDark ? 'rgba(51,65,85,0.3)' : '#f8fafc',
    padding: '16px 20px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: '12px',
  }),

  /* Two grid for passwords */
  twoInputGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '16px',
  },

  /* OTP inputs */
  otpRow: {
    display: 'flex',
    justifyContent: 'center',
    gap: '10px',
    margin: '20px 0',
  },
  otpInput: (isDark) => ({
    width: '48px',
    height: '52px',
    borderRadius: '12px',
    border: `2px solid ${isDark ? '#334155' : '#e2e8f0'}`,
    background: isDark ? 'rgba(51,65,85,0.5)' : '#fff',
    color: isDark ? '#fff' : '#0f172a',
    fontSize: '18px',
    fontWeight: 600,
    textAlign: 'center',
    outline: 'none',
    transition: 'border-color 0.2s',
  }),

  /* Theme option card */
  themeCard: (isDark, active) => ({
    display: 'flex',
    alignItems: 'center',
    gap: '14px',
    padding: '16px',
    borderRadius: '14px',
    border: `1px solid ${active ? '#f97316' : isDark ? '#334155' : '#e2e8f0'}`,
    background: active
      ? isDark ? 'rgba(249,115,22,0.1)' : 'rgba(249,115,22,0.06)'
      : isDark ? 'rgba(51,65,85,0.3)' : '#f8fafc',
    cursor: 'pointer',
    transition: 'all 0.2s',
    width: '100%',
    textAlign: 'left',
    marginBottom: '10px',
    boxSizing: 'border-box',
  }),
  themeIconBox: (active) => ({
    width: '44px',
    height: '44px',
    borderRadius: '10px',
    background: active ? 'rgba(249,115,22,0.15)' : 'rgba(100,116,139,0.12)',
    color: active ? '#f97316' : '#64748b',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  }),

  /* Session info item */
  sessionItem: (isDark) => ({
    borderRadius: '14px',
    border: `1px solid ${isDark ? '#334155' : '#e2e8f0'}`,
    background: isDark ? 'rgba(51,65,85,0.3)' : '#f8fafc',
    padding: '16px 20px',
    marginBottom: '12px',
  }),
  sessionItemRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    marginBottom: '6px',
  },
};

export default function Settings() {
  const { isDark, setTheme } = useThemeStore();
  const [profile, setProfile] = useState({ name: adminProfile.name, email: adminProfile.email });
  const [emailSection, setEmailSection] = useState({ show: false, newEmail: '', otpSent: false, otp: ['', '', '', '', '', ''] });
  const [passwordSection, setPasswordSection] = useState({ show: false, current: '', newPass: '', confirm: '', showPass: false, otpSent: false, otp: ['', '', '', '', '', ''] });
  const [resendTimer, setResendTimer] = useState(0);
  const [hoverAvatar, setHoverAvatar] = useState(false);

  const accountStatus = 'Active';
  const lastLogin = 'Today, 09:42 AM';

  const themeOptions = [
    { key: 'light', title: 'Light Mode', description: 'Bright, clean interface for daytime work.', icon: Sun, active: !isDark },
    { key: 'dark', title: 'Dark Mode', description: 'Low-glare interface for focused work.', icon: Moon, active: isDark },
  ];

  const handleUpdateProfile = () => {
    if (!profile.name.trim()) { toast.error('Name is required'); return; }
    toast.success('Profile updated successfully!');
  };

  const sendOtp = (type) => {
    if (type === 'email') setEmailSection((p) => ({ ...p, otpSent: true }));
    else setPasswordSection((p) => ({ ...p, otpSent: true }));
    setResendTimer(60);
    const interval = setInterval(() => {
      setResendTimer((t) => { if (t <= 1) { clearInterval(interval); return 0; } return t - 1; });
    }, 1000);
    toast.success('OTP sent to your email!');
  };

  const handleOtpChange = (type, index, value) => {
    if (value.length > 1) return;
    const setter = type === 'email' ? setEmailSection : setPasswordSection;
    setter((prev) => { const newOtp = [...prev.otp]; newOtp[index] = value; return { ...prev, otp: newOtp }; });
    if (value && index < 5) document.getElementById(`${type}-otp-${index + 1}`)?.focus();
  };

  const handleOtpKeyDown = (type, index, e) => {
    if (e.key === 'Backspace' && !e.target.value && index > 0)
      document.getElementById(`${type}-otp-${index - 1}`)?.focus();
  };

  const verifyEmailChange = () => {
    const code = emailSection.otp.join('');
    if (code.length !== 6) { toast.error('Enter complete OTP'); return; }
    toast.success('Email changed successfully!');
    setProfile((p) => ({ ...p, email: emailSection.newEmail }));
    setEmailSection({ show: false, newEmail: '', otpSent: false, otp: ['', '', '', '', '', ''] });
  };

  const verifyPasswordChange = () => {
    const code = passwordSection.otp.join('');
    if (code.length !== 6) { toast.error('Enter complete OTP'); return; }
    if (passwordSection.newPass !== passwordSection.confirm) { toast.error('Passwords do not match'); return; }
    if (passwordSection.newPass.length < 8) { toast.error('Password must be at least 8 characters'); return; }
    toast.success('Password changed successfully!');
    setPasswordSection({ show: false, current: '', newPass: '', confirm: '', showPass: false, otpSent: false, otp: ['', '', '', '', '', ''] });
  };

  const color = isDark ? '#fff' : '#0f172a';
  const mutedColor = isDark ? '#94a3b8' : '#64748b';

  const OTPInputGroup = ({ type, otp }) => (
    <div style={styles.otpRow}>
      {otp.map((digit, i) => (
        <input
          key={i}
          id={`${type}-otp-${i}`}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={digit}
          onChange={(e) => handleOtpChange(type, i, e.target.value.replace(/\D/, ''))}
          onKeyDown={(e) => handleOtpKeyDown(type, i, e)}
          style={styles.otpInput(isDark)}
          onFocus={(e) => (e.target.style.borderColor = '#f97316')}
          onBlur={(e) => (e.target.style.borderColor = isDark ? '#334155' : '#e2e8f0')}
        />
      ))}
    </div>
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      style={{
        flex: 1,
        overflowX: 'hidden',
        overflowY: 'auto',
        padding: '24px 24px 48px 24px',
        width: '100%',
        minWidth: 0,
        boxSizing: 'border-box',
      }}
    >
      <div style={{ width: '100%', maxWidth: '100%', display: 'flex', flexDirection: 'column', gap: '24px', minWidth: 0 }}>

        {/* ── Page Header ─────────────────────────── */}
        <div style={styles.pageHeader}>
          <h1 style={{ ...styles.pageTitle, color }}>Settings</h1>
          <p style={{ ...styles.pageSubtitle, color: mutedColor }}>Manage your admin account settings</p>
        </div>

        {/* ── Profile Hero Card ────────────────────── */}
        <div style={styles.profileCard(isDark)}>
          <div style={styles.profileTop}>
            {/* Avatar */}
            <div
              style={styles.avatarWrap}
              onMouseEnter={() => setHoverAvatar(true)}
              onMouseLeave={() => setHoverAvatar(false)}
            >
              <div style={styles.avatar}>{adminProfile.avatar}</div>
              <div style={{ ...styles.avatarOverlay, opacity: hoverAvatar ? 1 : 0 }}>
                <Camera size={20} color="#fff" />
              </div>
            </div>

            {/* Name + meta */}
            <div style={styles.profileInfo}>
              <div style={styles.profileNameRow}>
                <h2 style={{ ...styles.profileName, color }}>{profile.name}</h2>
                <span style={styles.activeBadge}>{accountStatus}</span>
              </div>
              <p style={{ ...styles.profileRole, color: mutedColor }}>{adminProfile.role}</p>

              <div style={styles.profileMetaGrid}>
                {[
                  { label: 'Member Since', value: adminProfile.joinedDate },
                  { label: 'Account Status', value: accountStatus },
                  { label: 'Last Login', value: lastLogin },
                ].map((item) => (
                  <div key={item.label} style={styles.metaChip(isDark)}>
                    <p style={{ ...styles.metaLabel, color: mutedColor }}>{item.label}</p>
                    <p style={{ ...styles.metaValue, color }}>{item.value}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick info pills */}
            <div style={styles.quickInfo(isDark)}>
              {[
                { label: 'EMAIL', value: profile.email },
                { label: 'ROLE', value: adminProfile.role },
              ].map((item) => (
                <div key={item.label} style={styles.infoPill(isDark)}>
                  <p style={{ ...styles.metaLabel, color: mutedColor }}>{item.label}</p>
                  <p style={{ ...styles.metaValue, color, wordBreak: 'break-all', fontSize: '13px' }}>{item.value}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Main Two-Column Grid ─────────────────── */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(0, 1.3fr) minmax(0, 1fr)',
          gap: '28px',
        }}
          className="settings-grid"
        >

          {/* Left Column */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>

            {/* Profile Information */}
            <div style={styles.card(isDark)}>
              <div style={styles.cardHeader}>
                <div style={styles.iconBox}><User size={19} /></div>
                <div>
                  <h3 style={{ ...styles.cardTitle, color }}>Profile Information</h3>
                  <p style={{ ...styles.cardSubtitle, color: mutedColor }}>Update your display name and account email.</p>
                </div>
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label(isDark)}>Display Name</label>
                <input
                  type="text"
                  value={profile.name}
                  onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                  style={styles.input(isDark)}
                  onFocus={(e) => { e.target.style.borderColor = '#f97316'; e.target.style.boxShadow = '0 0 0 3px rgba(249,115,22,0.15)'; }}
                  onBlur={(e) => { e.target.style.borderColor = isDark ? '#334155' : '#e2e8f0'; e.target.style.boxShadow = 'none'; }}
                />
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label(isDark)}>Email Address</label>
                <input
                  type="email"
                  value={profile.email}
                  readOnly
                  style={{ ...styles.input(isDark), opacity: 0.7, cursor: 'not-allowed' }}
                />
              </div>

              <div style={styles.btnRow}>
                <button
                  style={styles.btnPrimary}
                  onMouseEnter={(e) => (e.target.style.opacity = '0.88')}
                  onMouseLeave={(e) => (e.target.style.opacity = '1')}
                  onClick={handleUpdateProfile}
                >
                  Update Profile
                </button>
                <button
                  style={styles.btnOutline(isDark)}
                  onMouseEnter={(e) => { e.target.style.background = isDark ? 'rgba(51,65,85,0.6)' : '#f1f5f9'; e.target.style.borderColor = isDark ? '#475569' : '#cbd5e1'; }}
                  onMouseLeave={(e) => { e.target.style.background = 'transparent'; e.target.style.borderColor = isDark ? '#334155' : '#e2e8f0'; }}
                  onClick={() => setEmailSection((p) => ({ ...p, show: !p.show }))}
                >
                  {emailSection.show ? 'Cancel' : 'Change Email'}
                </button>
              </div>

              {emailSection.show && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  style={styles.subSection(isDark)}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                    <Mail size={15} color="#f97316" />
                    <h4 style={{ ...styles.cardTitle, fontSize: '14px', color }}>Email Address Verification</h4>
                  </div>
                  <p style={{ fontSize: '13px', color: mutedColor, marginBottom: '16px' }}>
                    Current: <strong style={{ color }}>{profile.email}</strong>
                  </p>

                  {!emailSection.otpSent ? (
                    <>
                      <div style={styles.formGroup}>
                        <label style={styles.label(isDark)}>New Email</label>
                        <input
                          type="email"
                          value={emailSection.newEmail}
                          onChange={(e) => setEmailSection((p) => ({ ...p, newEmail: e.target.value }))}
                          placeholder="Enter new email address"
                          style={styles.input(isDark)}
                          onFocus={(e) => { e.target.style.borderColor = '#f97316'; e.target.style.boxShadow = '0 0 0 3px rgba(249,115,22,0.15)'; }}
                          onBlur={(e) => { e.target.style.borderColor = isDark ? '#334155' : '#e2e8f0'; e.target.style.boxShadow = 'none'; }}
                        />
                      </div>
                      <button style={styles.btnPrimary} onClick={() => sendOtp('email')}>Send OTP</button>
                    </>
                  ) : (
                    <>
                      <p style={{ fontSize: '13px', color: mutedColor, marginBottom: '4px' }}>Enter the 6-digit OTP sent to your email</p>
                      <OTPInputGroup type="email" otp={emailSection.otp} />
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px' }}>
                        {resendTimer > 0
                          ? <p style={{ fontSize: '12px', color: mutedColor }}>Resend OTP in {resendTimer}s</p>
                          : <button onClick={() => sendOtp('email')} style={{ fontSize: '12px', fontWeight: 600, color: '#f97316', background: 'none', border: 'none', cursor: 'pointer' }}>Resend OTP</button>
                        }
                        <button style={styles.btnPrimary} onClick={verifyEmailChange}>Verify & Change Email</button>
                      </div>
                    </>
                  )}
                </motion.div>
              )}
            </div>

            {/* Account Security */}
            <div style={styles.card(isDark)}>
              <div style={styles.cardHeader}>
                <div style={styles.iconBox}><Lock size={19} /></div>
                <div>
                  <h3 style={{ ...styles.cardTitle, color }}>Account Security</h3>
                  <p style={{ ...styles.cardSubtitle, color: mutedColor }}>Update your password using a secure OTP flow.</p>
                </div>
              </div>

              <div style={styles.pwdRowBox(isDark)}>
                <div>
                  <p style={{ fontSize: '14px', fontWeight: 500, color, marginBottom: '4px' }}>Password</p>
                  <p style={{ fontSize: '13px', color: mutedColor }}>Use OTP verification to update your password securely.</p>
                </div>
                <button
                  style={styles.btnOutline(isDark)}
                  onMouseEnter={(e) => { e.target.style.background = isDark ? 'rgba(51,65,85,0.6)' : '#f1f5f9'; }}
                  onMouseLeave={(e) => { e.target.style.background = 'transparent'; }}
                  onClick={() => setPasswordSection((p) => ({ ...p, show: !p.show }))}
                >
                  {passwordSection.show ? 'Cancel' : 'Change Password'}
                </button>
              </div>

              {passwordSection.show && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  style={{ ...styles.subSection(isDark), marginTop: '16px' }}
                >
                  {!passwordSection.otpSent ? (
                    <>
                      <div style={styles.formGroup}>
                        <label style={styles.label(isDark)}>Current Password</label>
                        <div style={{ position: 'relative' }}>
                          <input
                            type={passwordSection.showPass ? 'text' : 'password'}
                            value={passwordSection.current}
                            onChange={(e) => setPasswordSection((p) => ({ ...p, current: e.target.value }))}
                            style={{ ...styles.input(isDark), paddingRight: '44px' }}
                            onFocus={(e) => { e.target.style.borderColor = '#f97316'; e.target.style.boxShadow = '0 0 0 3px rgba(249,115,22,0.15)'; }}
                            onBlur={(e) => { e.target.style.borderColor = isDark ? '#334155' : '#e2e8f0'; e.target.style.boxShadow = 'none'; }}
                          />
                          <button
                            onClick={() => setPasswordSection((p) => ({ ...p, showPass: !p.showPass }))}
                            style={{ position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: mutedColor, display: 'flex' }}
                          >
                            {passwordSection.showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                          </button>
                        </div>
                      </div>

                      <div style={styles.twoInputGrid}>
                        <div style={styles.formGroup}>
                          <label style={styles.label(isDark)}>New Password</label>
                          <input
                            type={passwordSection.showPass ? 'text' : 'password'}
                            value={passwordSection.newPass}
                            onChange={(e) => setPasswordSection((p) => ({ ...p, newPass: e.target.value }))}
                            placeholder="Min 8 characters"
                            style={styles.input(isDark)}
                            onFocus={(e) => { e.target.style.borderColor = '#f97316'; e.target.style.boxShadow = '0 0 0 3px rgba(249,115,22,0.15)'; }}
                            onBlur={(e) => { e.target.style.borderColor = isDark ? '#334155' : '#e2e8f0'; e.target.style.boxShadow = 'none'; }}
                          />
                        </div>
                        <div style={styles.formGroup}>
                          <label style={styles.label(isDark)}>Confirm Password</label>
                          <input
                            type={passwordSection.showPass ? 'text' : 'password'}
                            value={passwordSection.confirm}
                            onChange={(e) => setPasswordSection((p) => ({ ...p, confirm: e.target.value }))}
                            style={styles.input(isDark)}
                            onFocus={(e) => { e.target.style.borderColor = '#f97316'; e.target.style.boxShadow = '0 0 0 3px rgba(249,115,22,0.15)'; }}
                            onBlur={(e) => { e.target.style.borderColor = isDark ? '#334155' : '#e2e8f0'; e.target.style.boxShadow = 'none'; }}
                          />
                        </div>
                      </div>

                      <button style={styles.btnPrimary} onClick={() => sendOtp('password')}>Verify via OTP</button>
                    </>
                  ) : (
                    <>
                      <p style={{ fontSize: '13px', color: mutedColor, marginBottom: '4px' }}>Enter the 6-digit OTP sent to your email</p>
                      <OTPInputGroup type="password" otp={passwordSection.otp} />
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px' }}>
                        {resendTimer > 0
                          ? <p style={{ fontSize: '12px', color: mutedColor }}>Resend OTP in {resendTimer}s</p>
                          : <button onClick={() => sendOtp('password')} style={{ fontSize: '12px', fontWeight: 600, color: '#f97316', background: 'none', border: 'none', cursor: 'pointer' }}>Resend OTP</button>
                        }
                        <button style={styles.btnPrimary} onClick={verifyPasswordChange}>Verify & Change Password</button>
                      </div>
                    </>
                  )}
                </motion.div>
              )}
            </div>
          </div>

          {/* Right Column */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>

            {/* Appearance */}
            <div style={styles.card(isDark)}>
              <div style={styles.cardHeader}>
                <div style={styles.iconBox}><Sparkles size={19} /></div>
                <div>
                  <h3 style={{ ...styles.cardTitle, color }}>Appearance</h3>
                  <p style={{ ...styles.cardSubtitle, color: mutedColor }}>Choose the dashboard theme that fits your workflow.</p>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {themeOptions.map((option) => {
                  const Icon = option.icon;
                  return (
                    <button key={option.key} onClick={() => setTheme(option.key)} style={styles.themeCard(isDark, option.active)}>
                      <div style={styles.themeIconBox(option.active)}>
                        <Icon size={19} />
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px' }}>
                          <span style={{ fontSize: '14px', fontWeight: 600, color }}>{option.title}</span>
                          {option.active && (
                            <span style={{ background: '#f97316', color: '#fff', fontSize: '10px', fontWeight: 700, padding: '2px 10px', borderRadius: '999px', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                              Active
                            </span>
                          )}
                        </div>
                        <p style={{ fontSize: '13px', color: mutedColor, marginTop: '3px' }}>{option.description}</p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Session Management */}
            <div style={styles.card(isDark)}>
              <div style={styles.cardHeader}>
                <div style={styles.iconBox}><BadgeCheck size={19} /></div>
                <div>
                  <h3 style={{ ...styles.cardTitle, color }}>Session Management</h3>
                  <p style={{ ...styles.cardSubtitle, color: mutedColor }}>Review the current account session details.</p>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {[
                  { icon: Clock3, label: 'Last Login', value: lastLogin },
                  { icon: ShieldCheck, label: 'Account Status', value: accountStatus },
                ].map((item) => (
                  <div key={item.label} style={styles.sessionItem(isDark)}>
                    <div style={styles.sessionItemRow}>
                      <item.icon size={15} color="#f97316" />
                      <p style={{ fontSize: '13px', fontWeight: 600, color }}>{item.label}</p>
                    </div>
                    <p style={{ fontSize: '13px', color: mutedColor }}>{item.value}</p>
                  </div>
                ))}

                <div style={{ ...styles.sessionItem(isDark), background: isDark ? 'rgba(51,65,85,0.4)' : '#f1f5f9', borderStyle: 'none' }}>
                  <div style={styles.sessionItemRow}>
                    <LaptopMinimal size={15} color="#f97316" />
                    <p style={{ fontSize: '13px', fontWeight: 600, color }}>Current Device</p>
                  </div>
                  <p style={{ fontSize: '13px', color: mutedColor }}>Desktop browser session is active for this admin account.</p>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* Responsive style override */}
        <style>{`
          @media (max-width: 900px) {
            .settings-grid {
              grid-template-columns: 1fr !important;
            }
          }
          @media (max-width: 640px) {
            .settings-grid {
              grid-template-columns: 1fr !important;
            }
          }
        `}</style>

      </div>
    </motion.div>
  );
}
