import { motion } from 'framer-motion';
import useThemeStore from '../../store/useThemeStore';

export default function ChartCard({ title, subtitle, headerActions, children, chartHeight = 320, ...props }) {
  const { isDark } = useThemeStore();
  const bg      = isDark ? '#1E293B' : '#ffffff';
  const border  = isDark ? '#334155' : '#e2e8f0';
  const textMain  = isDark ? '#f1f5f9' : '#0f172a';
  const textMuted = isDark ? '#94a3b8' : '#64748b';

  return (
    <motion.div
      {...props}
      style={{
        background: bg,
        border: `1px solid ${border}`,
        borderRadius: '20px',
        padding: '24px',
        boxSizing: 'border-box',
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
        overflow: 'hidden',
        minWidth: 0,
        width: '100%',
        height: '100%',
        boxShadow: isDark ? 'none' : '0 1px 4px rgba(0,0,0,0.06)',
      }}
    >
      {(title || subtitle || headerActions) && (
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '12px', flexShrink: 0 }}>
          <div style={{ minWidth: 0 }}>
            {title && (
              <h3 style={{ fontSize: '15px', fontWeight: 700, color: textMain, margin: 0, letterSpacing: '-0.01em' }}>
                {title}
              </h3>
            )}
            {subtitle && (
              <p style={{ fontSize: '12px', color: textMuted, marginTop: '4px' }}>
                {subtitle}
              </p>
            )}
          </div>
          {headerActions && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
              {headerActions}
            </div>
          )}
        </div>
      )}
      <div style={{ flex: 1, width: '100%', minWidth: 0, minHeight: `${chartHeight}px` }}>
        {children}
      </div>
    </motion.div>
  );
}
