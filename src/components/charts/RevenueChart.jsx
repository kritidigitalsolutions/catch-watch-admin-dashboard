import { useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { revenueDataDaily, revenueDataWeekly, revenueDataMonthly, revenueDataYearly } from '../../constants/mockData';
import ChartCard from '../ui/ChartCard';
import useThemeStore from '../../store/useThemeStore';

const timeRanges = [
  { key: 'daily',   label: 'Daily',   data: revenueDataDaily },
  { key: 'weekly',  label: 'Weekly',  data: revenueDataWeekly },
  { key: 'monthly', label: 'Monthly', data: revenueDataMonthly },
  { key: 'yearly',  label: 'Yearly',  data: revenueDataYearly },
];

function CustomTooltip({ active, payload, label, isDark }) {
  if (!active || !payload?.length) return null;
  const bg     = isDark ? '#1E293B' : '#ffffff';
  const border = isDark ? '#334155' : '#e2e8f0';
  const muted  = isDark ? '#94a3b8' : '#64748b';
  return (
    <div style={{ background: bg, border: `1px solid ${border}`, borderRadius: '12px', padding: '12px 16px', boxShadow: '0 8px 24px rgba(0,0,0,0.15)' }}>
      <p style={{ fontSize: '11px', color: muted, margin: '0 0 6px 0' }}>{label}</p>
      <p style={{ fontSize: '14px', fontWeight: 700, color: '#f97316', margin: 0 }}>
        ₹{payload[0].value.toLocaleString('en-IN')}
      </p>
    </div>
  );
}

export default function RevenueChart() {
  const { isDark } = useThemeStore();
  const [activeRange, setActiveRange] = useState('daily');
  const currentData = timeRanges.find((r) => r.key === activeRange)?.data || revenueDataDaily;

  const tickColor  = isDark ? '#64748b' : '#94a3b8';
  const gridColor  = isDark ? '#334155' : '#e2e8f0';
  const tabBg      = isDark ? '#334155' : '#f1f5f9';
  const border     = isDark ? '#334155' : '#e2e8f0';
  const textMuted  = isDark ? '#94a3b8' : '#64748b';

  const headerActions = (
    <div style={{ display: 'flex', gap: '3px', background: tabBg, borderRadius: '10px', padding: '3px' }}>
      {timeRanges.map((range) => {
        const active = activeRange === range.key;
        return (
          <button
            key={range.key}
            onClick={() => setActiveRange(range.key)}
            style={{
              padding: '5px 12px', borderRadius: '7px', border: 'none',
              background: active ? 'linear-gradient(135deg, #f97316, #ea580c)' : 'transparent',
              color: active ? '#fff' : textMuted,
              fontSize: '12px', fontWeight: 600, cursor: 'pointer', transition: 'all 0.15s',
              boxShadow: active ? '0 2px 8px rgba(249,115,22,0.25)' : 'none',
            }}
          >
            {range.label}
          </button>
        );
      })}
    </div>
  );

  return (
    <ChartCard
      title="Revenue Overview"
      subtitle="Track income trends over time"
      headerActions={headerActions}
      chartHeight={300}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
    >
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={currentData} margin={{ top: 10, right: 16, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%"   stopColor="#f97316" stopOpacity={0.25} />
              <stop offset="100%" stopColor="#f97316" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke={gridColor} opacity={0.6} vertical={false} />
          <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: tickColor }} tickMargin={10} />
          <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: tickColor }} tickMargin={8}
            tickFormatter={(v) => {
              if (v >= 10000000) return `${(v / 10000000).toFixed(0)}Cr`;
              if (v >= 100000)   return `${(v / 100000).toFixed(0)}L`;
              if (v >= 1000)     return `${(v / 1000).toFixed(0)}K`;
              return v;
            }}
          />
          <Tooltip content={<CustomTooltip isDark={isDark} />} />
          <Area type="monotone" dataKey="revenue" stroke="#f97316" strokeWidth={2.5} fill="url(#revenueGrad)" animationDuration={700} />
        </AreaChart>
      </ResponsiveContainer>
    </ChartCard>
  );
}
