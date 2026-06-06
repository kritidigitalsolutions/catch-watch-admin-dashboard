import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { subscriptionDistribution } from '../../constants/mockData';
import ChartCard from '../ui/ChartCard';
import useThemeStore from '../../store/useThemeStore';

function CustomTooltip({ active, payload, isDark }) {
  if (!active || !payload?.length) return null;
  const bg     = isDark ? '#1E293B' : '#ffffff';
  const border = isDark ? '#334155' : '#e2e8f0';
  const textMain = isDark ? '#f1f5f9' : '#0f172a';
  return (
    <div style={{ background: bg, border: `1px solid ${border}`, borderRadius: '12px', padding: '12px 16px', boxShadow: '0 8px 24px rgba(0,0,0,0.15)' }}>
      <p style={{ fontSize: '11px', fontWeight: 700, color: payload[0].payload.color, margin: '0 0 4px 0' }}>{payload[0].name}</p>
      <p style={{ fontSize: '14px', fontWeight: 700, color: textMain, margin: 0 }}>
        {payload[0].value.toLocaleString('en-IN')} users
      </p>
    </div>
  );
}

export default function DonutChart() {
  const { isDark } = useThemeStore();
  const textMain  = isDark ? '#f1f5f9' : '#0f172a';
  const textMuted = isDark ? '#94a3b8' : '#64748b';
  const border    = isDark ? '#334155' : '#e2e8f0';
  const total = subscriptionDistribution.reduce((sum, item) => sum + item.value, 0);

  return (
    <ChartCard
      title="Subscription Distribution"
      subtitle="User subscription status breakdown"
      chartHeight={240}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.35 }}
    >
      {/* Chart + center label */}
      <div style={{ position: 'relative', width: '100%', height: '220px', flexShrink: 0 }}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={subscriptionDistribution}
              cx="50%" cy="50%"
              innerRadius={62} outerRadius={90}
              paddingAngle={3}
              dataKey="value"
              animationDuration={800}
              animationBegin={200}
            >
              {subscriptionDistribution.map((entry, i) => (
                <Cell key={i} fill={entry.color} stroke="transparent" style={{ cursor: 'pointer', opacity: 1 }} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip isDark={isDark} />} />
          </PieChart>
        </ResponsiveContainer>

        {/* Center label */}
        <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', pointerEvents: 'none' }}>
          <div style={{ textAlign: 'center' }}>
            <p style={{ fontSize: '22px', fontWeight: 800, color: textMain, margin: 0, letterSpacing: '-0.02em' }}>
              {total.toLocaleString('en-IN')}
            </p>
            <p style={{ fontSize: '10px', color: textMuted, marginTop: '3px', fontWeight: 500 }}>Total Users</p>
          </div>
        </div>
      </div>

      {/* Legend */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px 16px', borderTop: `1px solid ${border}`, paddingTop: '14px' }}>
        {subscriptionDistribution.map((item) => (
          <div key={item.name} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px', minWidth: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '7px', minWidth: 0, overflow: 'hidden' }}>
              <div style={{ width: '9px', height: '9px', borderRadius: '50%', background: item.color, flexShrink: 0 }} />
              <p style={{ fontSize: '11px', color: textMuted, margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.name}</p>
            </div>
            <p style={{ fontSize: '11px', fontWeight: 700, color: textMain, margin: 0, flexShrink: 0 }}>{item.value.toLocaleString('en-IN')}</p>
          </div>
        ))}
      </div>
    </ChartCard>
  );
}
