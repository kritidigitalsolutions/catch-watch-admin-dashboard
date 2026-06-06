import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, EyeOff, Mail, Lock, ArrowRight, RefreshCw, ChevronLeft, Shield } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import useThemeStore from '../../store/useThemeStore';

export default function Login() {
  const navigate               = useNavigate();
  const { isDark }             = useThemeStore();

  const [view, setView]         = useState('login');
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [otp, setOtp]           = useState(['', '', '', '', '', '']);
  const [newPass, setNewPass]   = useState('');
  const [confPass, setConfPass] = useState('');
  const [loading, setLoading]   = useState(false);
  const [countdown, setCountdown] = useState(0);

  /* ── Theme tokens ─────────────────────────── */
  const pageBg     = isDark
    ? 'linear-gradient(135deg, #0F172A 0%, #1E293B 50%, #0F172A 100%)'
    : 'linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 50%, #f8fafc 100%)';

  const cardBg     = isDark ? 'rgba(30,41,59,0.9)'   : 'rgba(255,255,255,0.95)';
  const cardBorder = isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)';
  const cardShadow = isDark ? '0 32px 80px rgba(0,0,0,0.5)' : '0 32px 80px rgba(0,0,0,0.14)';

  const textMain   = isDark ? '#f1f5f9'  : '#0f172a';
  const textMuted  = isDark ? '#64748b'  : '#64748b';
  const textSub    = isDark ? '#94a3b8'  : '#475569';

  const inputBg    = isDark ? '#0f172a'  : '#f8fafc';
  const inputBorder = isDark ? 'rgba(51,65,85,0.9)' : '#d1d5db';
  const inputColor = isDark ? '#f1f5f9'  : '#0f172a';
  const placeholderColor = isDark ? '#475569' : '#9ca3af';

  /* ── Helpers ───────────────────────────── */
  const startCountdown = () => {
    setCountdown(60);
    const id = setInterval(() => {
      setCountdown((c) => { if (c <= 1) { clearInterval(id); return 0; } return c - 1; });
    }, 1000);
  };

  const handleLogin = async () => {
    if (!email || !password) { toast.error('Please fill all fields'); return; }
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1200));
    setLoading(false);
    if (email === 'admin@catchwatchott.com' && password === 'Admin@123') {
      toast.success('Welcome back, Admin!');
      navigate('/dashboard');
    } else {
      toast.error('Invalid credentials');
    }
  };

  const handleSendOtp = async () => {
    if (!email) { toast.error('Enter your email first'); return; }
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1000));
    setLoading(false);
    toast.success(`OTP sent to ${email}`);
    startCountdown();
    setView('otp');
  };

  const handleVerifyOtp = async () => {
    const code = otp.join('');
    if (code.length < 6) { toast.error('Enter complete 6-digit OTP'); return; }
    setLoading(true);
    await new Promise((r) => setTimeout(r, 900));
    setLoading(false);
    if (code === '123456') {
      toast.success('OTP verified!');
      setView('reset');
    } else {
      toast.error('Invalid OTP. Try 123456 for demo');
    }
  };

  const handleResetPass = async () => {
    if (!newPass || !confPass) { toast.error('Fill both fields'); return; }
    if (newPass !== confPass)  { toast.error('Passwords do not match'); return; }
    if (newPass.length < 8)    { toast.error('Password must be at least 8 characters'); return; }
    setLoading(true);
    await new Promise((r) => setTimeout(r, 900));
    setLoading(false);
    toast.success('Password reset successfully!');
    setView('login');
    setPassword('');
  };

  const handleOtpChange = (val, idx) => {
    if (!/^\d*$/.test(val)) return;
    const next = [...otp];
    next[idx] = val.slice(-1);
    setOtp(next);
    if (val && idx < 5) document.getElementById(`otp-${idx + 1}`)?.focus();
  };

  const handleOtpKeyDown = (e, idx) => {
    if (e.key === 'Backspace' && !otp[idx] && idx > 0)
      document.getElementById(`otp-${idx - 1}`)?.focus();
  };

  /* ── Shared input style ──────────────── */
  const inputStyle = {
    width: '100%',
    padding: '13px 16px 13px 48px',
    borderRadius: '14px',
    border: `2px solid ${isDark ? '#334155' : '#e2e8f0'}`,
    backgroundColor: isDark ? '#0f172a' : '#ffffff',
    color: isDark ? '#f1f5f9' : '#0f172a',
    fontSize: '14px',
    fontWeight: 400,
    outline: 'none',
    fontFamily: 'inherit',
    boxSizing: 'border-box',
    transition: 'border-color 0.2s, box-shadow 0.2s',
    WebkitAppearance: 'none',
    MozAppearance: 'none',
    appearance: 'none',
    lineHeight: '1.5',
  };

  const labelStyle = {
    fontSize: '11px', fontWeight: 700, color: textMuted,
    marginBottom: '8px', display: 'block',
    letterSpacing: '0.07em', textTransform: 'uppercase',
  };

  const btnPrimary = {
    width: '100%', padding: '14px', borderRadius: '14px',
    border: 'none',
    background: loading ? (isDark ? 'rgba(249,115,22,0.4)' : 'rgba(249,115,22,0.5)') : 'linear-gradient(135deg, #f97316, #ea580c)',
    color: '#fff', fontSize: '14px', fontWeight: 700,
    cursor: loading ? 'not-allowed' : 'pointer',
    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
    boxShadow: '0 8px 24px rgba(249,115,22,0.35)',
    transition: 'opacity 0.2s, transform 0.15s',
  };

  const focusStyle = (e) => {
    e.target.style.borderColor = '#f97316';
    e.target.style.boxShadow   = isDark
      ? '0 0 0 3px rgba(249,115,22,0.2), inset 0 0 0 1px rgba(249,115,22,0.1)'
      : '0 0 0 3px rgba(249,115,22,0.15)';
  };
  const blurStyle = (e) => {
    e.target.style.borderColor = isDark ? '#334155' : '#e2e8f0';
    e.target.style.boxShadow   = 'none';
  };

  /* ── Themed field wrapper ────────────── */
  const Field = ({ label, children }) => (
    <div>
      <label style={labelStyle}>{label}</label>
      {children}
    </div>
  );

  return (
    <div style={{
      minHeight: '100vh', width: '100%',
      background: pageBg,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '24px', boxSizing: 'border-box',
      position: 'relative', overflow: 'hidden',
      transition: 'background 0.35s',
    }}>
      {/* Background decorations */}
      <div style={{ position: 'absolute', top: '-120px', right: '-120px', width: '400px', height: '400px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(249,115,22,0.12) 0%, transparent 70%)', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', bottom: '-100px', left: '-100px', width: '350px', height: '350px', borderRadius: '50%', background: isDark ? 'radial-gradient(circle, rgba(139,92,246,0.1) 0%, transparent 70%)' : 'radial-gradient(circle, rgba(99,102,241,0.08) 0%, transparent 70%)', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', top: '40%', left: '10%', width: '200px', height: '200px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(34,197,94,0.06) 0%, transparent 70%)', pointerEvents: 'none' }} />

      {/* ── Inject placeholder + autofill CSS ── */}
      <style>{`
        .login-input::placeholder {
          color: ${isDark ? '#475569' : '#9ca3af'} !important;
          opacity: 1;
        }
        /* Force autofill bg to match our theme */
        .login-input:-webkit-autofill {
          background-color: ${isDark ? '#0f172a' : '#ffffff'} !important;
          -webkit-box-shadow: 0 0 0 9999px ${isDark ? '#0f172a' : '#ffffff'} inset !important;
          -webkit-text-fill-color: ${isDark ? '#f1f5f9' : '#0f172a'} !important;
          caret-color: ${isDark ? '#f1f5f9' : '#0f172a'} !important;
        }
        .login-input:-webkit-autofill:focus {
          -webkit-box-shadow: 0 0 0 9999px ${isDark ? '#0f172a' : '#ffffff'} inset, 0 0 0 3px rgba(249,115,22,0.15) !important;
        }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>

      <AnimatePresence mode="wait">
        <motion.div
          key={view}
          initial={{ opacity: 0, y: 24, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -16, scale: 0.98 }}
          transition={{ duration: 0.28, ease: 'easeOut' }}
          style={{
            width: '100%', maxWidth: '430px',
            background: cardBg,
            backdropFilter: 'blur(24px)',
            WebkitBackdropFilter: 'blur(24px)',
            border: `1px solid ${cardBorder}`,
            borderRadius: '28px',
            padding: '40px 36px',
            boxSizing: 'border-box',
            boxShadow: cardShadow,
            position: 'relative', zIndex: 1,
            transition: 'background 0.35s, box-shadow 0.35s',
          }}
        >
          {/* ── Logo ── */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '32px' }}>
            <div style={{
              width: '44px', height: '44px', borderRadius: '12px',
              background: 'linear-gradient(135deg, #f97316, #ea580c)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 4px 16px rgba(249,115,22,0.35)', flexShrink: 0,
            }}>
              <span style={{ fontSize: '18px', fontWeight: 900, color: '#fff', letterSpacing: '-0.05em' }}>C</span>
            </div>
            <div>
              <p style={{ fontSize: '14px', fontWeight: 800, color: '#f97316', letterSpacing: '0.06em', margin: 0 }}>CATCH & WATCH</p>
              <p style={{ fontSize: '10px', color: textMuted, letterSpacing: '0.18em', textTransform: 'uppercase', marginTop: '2px' }}>Admin Panel</p>
            </div>
          </div>

          {/* ════════ LOGIN ════════ */}
          {view === 'login' && (
            <>
              <div style={{ marginBottom: '28px' }}>
                <h1 style={{ fontSize: '26px', fontWeight: 800, color: textMain, margin: 0, letterSpacing: '-0.03em' }}>Welcome back</h1>
                <p style={{ fontSize: '14px', color: textSub, marginTop: '6px' }}>Sign in to your admin dashboard</p>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
                {/* Email */}
                <Field label="Email Address">
                  <div style={{ position: 'relative' }}>
                    {/* Icon bg accent */}
                    <div style={{
                      position: 'absolute', left: '1px', top: '1px', bottom: '1px',
                      width: '44px', borderRadius: '12px 0 0 12px',
                      background: isDark ? 'rgba(249,115,22,0.08)' : 'rgba(249,115,22,0.06)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      pointerEvents: 'none', zIndex: 2,
                      borderRight: `1px solid ${isDark ? '#1e293b' : '#e2e8f0'}`,
                    }}>
                      <Mail size={15} color="#f97316" />
                    </div>
                    <input
                      type="email"
                      className="login-input"
                      placeholder="admin@catchwatchott.com"
                      value={email}
                      autoComplete="username"
                      onChange={(e) => setEmail(e.target.value)}
                      style={{ ...inputStyle, paddingLeft: '54px' }}
                      onFocus={focusStyle}
                      onBlur={blurStyle}
                      onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
                    />
                  </div>
                </Field>

                {/* Password */}
                <Field label="Password">
                  <div style={{ position: 'relative' }}>
                    {/* Icon bg accent */}
                    <div style={{
                      position: 'absolute', left: '1px', top: '1px', bottom: '1px',
                      width: '44px', borderRadius: '12px 0 0 12px',
                      background: isDark ? 'rgba(99,102,241,0.08)' : 'rgba(99,102,241,0.05)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      pointerEvents: 'none', zIndex: 2,
                      borderRight: `1px solid ${isDark ? '#1e293b' : '#e2e8f0'}`,
                    }}>
                      <Lock size={15} color="#6366f1" />
                    </div>
                    <input
                      type={showPass ? 'text' : 'password'}
                      className="login-input"
                      placeholder="Enter your password"
                      value={password}
                      autoComplete="current-password"
                      onChange={(e) => setPassword(e.target.value)}
                      style={{ ...inputStyle, paddingLeft: '54px', paddingRight: '44px' }}
                      onFocus={focusStyle}
                      onBlur={blurStyle}
                      onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
                    />
                    <button onClick={() => setShowPass(!showPass)}
                      style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: isDark ? '#475569' : '#94a3b8', display: 'flex', padding: '4px', zIndex: 2 }}>
                      {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </Field>

                {/* Forgot */}
                <div style={{ textAlign: 'right', marginTop: '-8px' }}>
                  <button onClick={() => setView('forgot')}
                    style={{ background: 'none', border: 'none', color: '#f97316', fontSize: '13px', fontWeight: 600, cursor: 'pointer' }}>
                    Forgot password?
                  </button>
                </div>

                {/* Submit */}
                <motion.button whileHover={{ opacity: loading ? 1 : 0.92, scale: loading ? 1 : 1.01 }} whileTap={{ scale: 0.98 }} onClick={handleLogin} style={btnPrimary}>
                  {loading ? <RefreshCw size={16} style={{ animation: 'spin 1s linear infinite' }} /> : <><span>Sign In</span><ArrowRight size={16} /></>}
                </motion.button>
              </div>

              {/* Demo hint */}
              <div style={{ marginTop: '20px', padding: '12px 16px', borderRadius: '12px', background: isDark ? 'rgba(249,115,22,0.07)' : 'rgba(249,115,22,0.06)', border: `1px solid ${isDark ? 'rgba(249,115,22,0.18)' : 'rgba(249,115,22,0.2)'}`, fontSize: '12px', color: textSub }}>
                <span style={{ color: '#f97316', fontWeight: 700 }}>Demo: </span>
                admin@catchwatchott.com / Admin@123
              </div>
            </>
          )}

          {/* ════════ FORGOT ════════ */}
          {view === 'forgot' && (
            <>
              <button onClick={() => setView('login')}
                style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'none', border: 'none', color: textMuted, cursor: 'pointer', fontSize: '13px', fontWeight: 600, padding: '0 0 20px 0' }}>
                <ChevronLeft size={16} /> Back to Login
              </button>
              <div style={{ marginBottom: '28px' }}>
                <div style={{ width: '52px', height: '52px', borderRadius: '14px', background: 'rgba(249,115,22,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}>
                  <Mail size={24} style={{ color: '#f97316' }} />
                </div>
                <h1 style={{ fontSize: '24px', fontWeight: 800, color: textMain, margin: 0 }}>Forgot Password?</h1>
                <p style={{ fontSize: '14px', color: textSub, marginTop: '8px', lineHeight: 1.6 }}>Enter your registered email. We'll send a 6-digit OTP to reset your password.</p>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <Field label="Email Address">
                  <div style={{ position: 'relative' }}>
                    <Mail size={16} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: textMuted, pointerEvents: 'none' }} />
                    <input type="email" className="login-input" placeholder="admin@catchwatchott.com" value={email}
                      autoComplete="username"
                      onChange={(e) => setEmail(e.target.value)}
                      style={{ ...inputStyle, paddingLeft: '44px' }}
                      onFocus={focusStyle} onBlur={blurStyle}
                      onKeyDown={(e) => e.key === 'Enter' && handleSendOtp()} />
                  </div>
                </Field>
                <motion.button whileHover={{ opacity: 0.9 }} whileTap={{ scale: 0.98 }} onClick={handleSendOtp} style={btnPrimary}>
                  {loading ? <RefreshCw size={16} style={{ animation: 'spin 1s linear infinite' }} /> : <><span>Send OTP</span><ArrowRight size={16} /></>}
                </motion.button>
              </div>
            </>
          )}

          {/* ════════ OTP ════════ */}
          {view === 'otp' && (
            <>
              <button onClick={() => setView('forgot')}
                style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'none', border: 'none', color: textMuted, cursor: 'pointer', fontSize: '13px', fontWeight: 600, padding: '0 0 20px 0' }}>
                <ChevronLeft size={16} /> Back
              </button>
              <div style={{ marginBottom: '28px' }}>
                <div style={{ width: '52px', height: '52px', borderRadius: '14px', background: 'rgba(34,197,94,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}>
                  <Shield size={24} style={{ color: '#22c55e' }} />
                </div>
                <h1 style={{ fontSize: '24px', fontWeight: 800, color: textMain, margin: 0 }}>Verify OTP</h1>
                <p style={{ fontSize: '14px', color: textSub, marginTop: '8px', lineHeight: 1.6 }}>
                  Enter the 6-digit code sent to <span style={{ color: '#f97316', fontWeight: 600 }}>{email}</span>
                </p>
              </div>

              <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', marginBottom: '24px' }}>
                {otp.map((digit, i) => (
                  <input
                    key={i}
                    id={`otp-${i}`}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOtpChange(e.target.value, i)}
                    onKeyDown={(e) => handleOtpKeyDown(e, i)}
                    style={{
                      width: '48px', height: '56px',
                      textAlign: 'center', fontSize: '22px', fontWeight: 700,
                      borderRadius: '14px',
                      border: digit ? '2px solid #f97316' : `1.5px solid ${inputBorder}`,
                      background: digit ? (isDark ? 'rgba(249,115,22,0.1)' : 'rgba(249,115,22,0.06)') : inputBg,
                      color: inputColor, outline: 'none',
                      transition: 'all 0.15s', fontFamily: 'inherit',
                    }}
                    onFocus={(e) => { e.target.style.borderColor = '#f97316'; e.target.style.boxShadow = '0 0 0 3px rgba(249,115,22,0.15)'; }}
                    onBlur={(e) => { e.target.style.boxShadow = 'none'; if (!digit) e.target.style.borderColor = inputBorder; }}
                  />
                ))}
              </div>

              <motion.button whileHover={{ opacity: 0.9 }} whileTap={{ scale: 0.98 }} onClick={handleVerifyOtp} style={{ ...btnPrimary, marginBottom: '16px' }}>
                {loading ? <RefreshCw size={16} style={{ animation: 'spin 1s linear infinite' }} /> : 'Verify OTP'}
              </motion.button>

              <div style={{ textAlign: 'center' }}>
                {countdown > 0 ? (
                  <p style={{ fontSize: '13px', color: textSub }}>Resend OTP in <span style={{ color: '#f97316', fontWeight: 700 }}>{countdown}s</span></p>
                ) : (
                  <button onClick={handleSendOtp} style={{ background: 'none', border: 'none', color: '#f97316', fontSize: '13px', fontWeight: 600, cursor: 'pointer' }}>Resend OTP</button>
                )}
              </div>

              <div style={{ marginTop: '12px', padding: '10px 14px', borderRadius: '10px', background: isDark ? 'rgba(34,197,94,0.07)' : 'rgba(34,197,94,0.06)', border: '1px solid rgba(34,197,94,0.2)', fontSize: '12px', color: textSub, textAlign: 'center' }}>
                Demo OTP: <span style={{ color: '#22c55e', fontWeight: 700, letterSpacing: '0.1em' }}>123456</span>
              </div>
            </>
          )}

          {/* ════════ RESET ════════ */}
          {view === 'reset' && (
            <>
              <div style={{ marginBottom: '28px' }}>
                <div style={{ width: '52px', height: '52px', borderRadius: '14px', background: 'rgba(139,92,246,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}>
                  <Lock size={24} style={{ color: '#8b5cf6' }} />
                </div>
                <h1 style={{ fontSize: '24px', fontWeight: 800, color: textMain, margin: 0 }}>New Password</h1>
                <p style={{ fontSize: '14px', color: textSub, marginTop: '8px' }}>Create a strong new password for your account.</p>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
                <Field label="New Password">
                  <div style={{ position: 'relative' }}>
                    <Lock size={16} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: textMuted, pointerEvents: 'none' }} />
                    <input type="password" className="login-input" placeholder="Min. 8 characters" value={newPass}
                      autoComplete="new-password"
                      onChange={(e) => setNewPass(e.target.value)}
                      style={{ ...inputStyle, paddingLeft: '44px' }}
                      onFocus={focusStyle} onBlur={blurStyle} />
                  </div>
                </Field>
                <Field label="Confirm Password">
                  <div style={{ position: 'relative' }}>
                    <Lock size={16} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: textMuted, pointerEvents: 'none' }} />
                    <input type="password" className="login-input" placeholder="Re-enter password" value={confPass}
                      autoComplete="new-password"
                      onChange={(e) => setConfPass(e.target.value)}
                      style={{ ...inputStyle, paddingLeft: '44px', borderColor: confPass && confPass !== newPass ? 'rgba(239,68,68,0.6)' : inputBorder }}
                      onFocus={focusStyle} onBlur={blurStyle} />
                    {confPass && confPass !== newPass && (
                      <p style={{ fontSize: '12px', color: '#ef4444', marginTop: '6px' }}>Passwords do not match</p>
                    )}
                  </div>
                </Field>
                <motion.button whileHover={{ opacity: 0.9 }} whileTap={{ scale: 0.98 }} onClick={handleResetPass} style={btnPrimary}>
                  {loading ? <RefreshCw size={16} style={{ animation: 'spin 1s linear infinite' }} /> : <><span>Reset Password</span><ArrowRight size={16} /></>}
                </motion.button>
              </div>
            </>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
