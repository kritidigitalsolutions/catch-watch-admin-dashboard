import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts';
import { userGrowthData } from '../../constants/mockData';
import useThemeStore from '../../store/useThemeStore';

function CustomTooltip({ active, payload, label, isDark }) {
  if (!active || !payload?.length) return null;
  const bg     = isDark ? '#0F172A' : '#ffffff';
  const border = isDark ? '#334155' : '#e2e8f0';
  const muted  = isDark ? '#94a3b8' : '#64748b';
  return (
    <div style={{ background: bg, border: `1px solid ${border}`, borderRadius: '12px', padding: '12px 16px', boxShadow: '0 8px 24px rgba(0,0,0,0.18)' }}>
      <p style={{ fontSize: '11px', color: muted, margin: '0 0 8px 0', fontWeight: 500 }}>{label}</p>
      {payload.map((entry, i) => (
        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: i > 0 ? '5px' : 0 }}>
          <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: entry.color, flexShrink: 0 }} />
          <p style={{ fontSize: '12px', fontWeight: 700, color: entry.color, margin: 0 }}>
            {entry.name}: <span style={{ color: isDark ? '#f1f5f9' : '#0f172a' }}>{Number(entry.value).toLocaleString('en-IN')}</span>
          </p>
        </div>
      ))}
    </div>
  );
}

export default function UserGrowthChart() {
  const { isDark } = useThemeStore();

  const bg       = isDark ? '#1E293B' : '#ffffff';
  const border   = isDark ? '#334155' : '#e2e8f0';
  const textMain = isDark ? '#f1f5f9' : '#0f172a';
  const textMuted = isDark ? '#94a3b8' : '#64748b';
  const tickColor = isDark ? '#64748b' : '#94a3b8';
  const gridColor = isDark ? 'rgba(51,65,85,0.8)' : 'rgba(226,232,240,0.8)';

  return (
    <div style={{
      background: bg,
      border: `1px solid ${border}`,
      borderRadius: '20px',
      padding: '24px',
      boxSizing: 'border-box',
      height: '100%',
      minHeight: '340px',
      display: 'flex',
      flexDirection: 'column',
      gap: '16px',
      boxShadow: isDark ? 'none' : '0 1px 4px rgba(0,0,0,0.06)',
    }}>
      {/* Header */}
      <div>
        <h3 style={{ fontSize: '15px', fontWeight: 700, color: textMain, margin: 0 }}>User Growth</h3>
        <p style={{ fontSize: '12px', color: textMuted, marginTop: '4px' }}>30-day rolling window — Total vs Active users</p>
      </div>

      {/* Chart */}
      <div style={{ flex: 1, minHeight: '220px', width: '100%' }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={userGrowthData} margin={{ top: 8, right: 16, left: -10, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke={gridColor} vertical={false} />
            <XAxis
              dataKey="day"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 11, fill: tickColor }}
              tickMargin={8}
              interval="preserveStartEnd"
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 11, fill: tickColor }}
              tickMargin={6}
              width={42}
              tickFormatter={(v) => v >= 1000 ? `${(v / 1000).toFixed(0)}K` : v}
            />
            <Tooltip content={<CustomTooltip isDark={isDark} />} />
            <Line
              type="monotone"
              dataKey="total"
              name="Total Users"
              stroke="#f97316"
              strokeWidth={2.5}
              dot={{ r: 4, fill: '#f97316', stroke: '#fff', strokeWidth: 2 }}
              activeDot={{ r: 6, fill: '#f97316', stroke: '#fff', strokeWidth: 2 }}
              animationDuration={800}
            />
            <Line
              type="monotone"
              dataKey="active"
              name="Active Users"
              stroke="#22c55e"
              strokeWidth={2.5}
              dot={{ r: 4, fill: '#22c55e', stroke: '#fff', strokeWidth: 2 }}
              activeDot={{ r: 6, fill: '#22c55e', stroke: '#fff', strokeWidth: 2 }}
              animationDuration={800}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Legend */}
      <div style={{ display: 'flex', gap: '20px', justifyContent: 'flex-end' }}>
        {[
          { label: 'Total Users',  color: '#f97316' },
          { label: 'Active Users', color: '#22c55e' },
        ].map((l) => (
          <div key={l.label} style={{ display: 'flex', alignItems: 'center', gap: '7px' }}>
            <div style={{ width: '20px', height: '3px', background: l.color, borderRadius: '2px' }} />
            <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: l.color }} />
            <span style={{ fontSize: '11px', fontWeight: 600, color: textMuted }}>{l.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
