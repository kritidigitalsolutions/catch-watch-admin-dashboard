import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import useThemeStore from '../../store/useThemeStore';

const backdropVariants = { hidden: { opacity: 0 }, visible: { opacity: 1 } };
const modalVariants = {
  hidden: { opacity: 0, scale: 0.95, y: 20 },
  visible: { opacity: 1, scale: 1, y: 0, transition: { type: 'spring', damping: 25, stiffness: 300 } },
  exit: { opacity: 0, scale: 0.95, y: 20, transition: { duration: 0.2 } },
};

const sizeMap = { sm: '440px', md: '560px', lg: '720px', xl: '960px', full: '1140px' };

export default function Modal({ isOpen, onClose, title, children, size = 'md', showClose = true }) {
  const { isDark } = useThemeStore();
  const bg      = isDark ? '#1E293B' : '#ffffff';
  const border  = isDark ? '#334155' : '#e2e8f0';
  const textMain = isDark ? '#f1f5f9' : '#0f172a';
  const textMuted = isDark ? '#94a3b8' : '#64748b';
  const hoverBg = isDark ? 'rgba(51,65,85,0.7)' : '#f1f5f9';

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          style={{ position: 'fixed', inset: 0, zIndex: 50, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px' }}
          initial="hidden" animate="visible" exit="hidden"
        >
          {/* Backdrop */}
          <motion.div
            variants={backdropVariants}
            style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }}
            onClick={onClose}
          />

          {/* Modal box */}
          <motion.div
            variants={modalVariants}
            style={{
              position: 'relative',
              width: '100%',
              maxWidth: sizeMap[size] || sizeMap.md,
              background: bg,
              border: `1px solid ${border}`,
              borderRadius: '20px',
              boxShadow: '0 25px 50px rgba(0,0,0,0.35)',
              maxHeight: '90vh',
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            {/* Header */}
            {(title || showClose) && (
              <div style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '18px 24px',
                borderBottom: `1px solid ${border}`,
                flexShrink: 0,
              }}>
                <h3 style={{ fontSize: '16px', fontWeight: 700, color: textMain, margin: 0, letterSpacing: '-0.01em' }}>
                  {title}
                </h3>
                {showClose && (
                  <motion.button
                    whileHover={{ scale: 1.1, rotate: 90 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={onClose}
                    style={{
                      width: '32px', height: '32px', borderRadius: '8px',
                      background: 'transparent', border: 'none',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      color: textMuted, cursor: 'pointer', transition: 'background 0.15s',
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.background = hoverBg; }}
                    onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
                  >
                    <X size={17} />
                  </motion.button>
                )}
              </div>
            )}

            {/* Body */}
            <div style={{ padding: '24px', overflowY: 'auto', flex: 1 }}>
              {children}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export function ConfirmModal({ isOpen, onClose, onConfirm, title = 'Confirm Action', message, confirmText = 'Confirm', variant = 'danger' }) {
  const { isDark } = useThemeStore();
  const border    = isDark ? '#334155' : '#e2e8f0';
  const textMuted = isDark ? '#94a3b8' : '#64748b';

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} size="sm">
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <p style={{ fontSize: '14px', color: textMuted, margin: 0, lineHeight: '1.6' }}>{message}</p>
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
          <motion.button
            whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
            onClick={onClose}
            style={{ padding: '9px 18px', borderRadius: '11px', border: `1px solid ${border}`, background: 'transparent', color: textMuted, fontSize: '13px', fontWeight: 600, cursor: 'pointer' }}
          >
            Cancel
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
            onClick={() => { onConfirm(); onClose(); }}
            style={{
              padding: '9px 18px', borderRadius: '11px', border: 'none',
              background: variant === 'danger' ? 'linear-gradient(135deg, #ef4444, #dc2626)' : 'linear-gradient(135deg, #f97316, #ea580c)',
              color: '#fff', fontSize: '13px', fontWeight: 700, cursor: 'pointer',
              boxShadow: variant === 'danger' ? '0 4px 12px rgba(239,68,68,0.3)' : '0 4px 12px rgba(249,115,22,0.3)',
            }}
          >
            {confirmText}
          </motion.button>
        </div>
      </div>
    </Modal>
  );
}
