import { TrendingUp, TrendingDown } from 'lucide-react';
import DashboardCard from './DashboardCard';

export default function StatCard({ icon: Icon, label, value, trend, trendUp, color = 'orange', index = 0 }) {
  const colorMap = {
    orange: { bg: 'bg-orange-500/10', icon: 'text-orange-500' },
    green: { bg: 'bg-emerald-500/10', icon: 'text-emerald-500' },
    blue: { bg: 'bg-blue-500/10', icon: 'text-blue-500' },
    red: { bg: 'bg-red-500/10', icon: 'text-red-500' },
    yellow: { bg: 'bg-yellow-500/10', icon: 'text-yellow-500' },
    purple: { bg: 'bg-purple-500/10', icon: 'text-purple-500' },
    cyan: { bg: 'bg-cyan-500/10', icon: 'text-cyan-500' },
    pink: { bg: 'bg-pink-500/10', icon: 'text-pink-500' },
  };

  const c = colorMap[color] || colorMap.orange;

  const formatValue = (val) => {
    if (typeof val === 'number') {
      if (val >= 10000000) return `₹${(val / 10000000).toFixed(1)}Cr`;
      if (val >= 100000) return `₹${(val / 100000).toFixed(1)}L`;
      if (val >= 1000) return val.toLocaleString('en-IN');
      return val.toString();
    }
    return val;
  };

  return (
    <DashboardCard
      hoverable
      whileHover={{ y: -2, transition: { duration: 0.2, ease: 'easeOut' } }}
      whileTap={{ scale: 0.99 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.4, ease: 'easeOut' }}
      className="group relative flex h-full min-h-[140px] min-w-0 flex-col justify-between overflow-hidden !rounded-[16px] !border !border-slate-700/70 !bg-[#1E293B] !p-6 !shadow-[0_1px_2px_rgba(15,23,42,0.12)] hover:!shadow-[0_12px_32px_rgba(15,23,42,0.24)]"
    >
      <div className="space-y-3">
        <div className="flex items-center justify-between gap-4">
          <span className="min-w-0 truncate text-[12px] font-medium uppercase tracking-[0.14em] text-slate-400 dark:text-slate-400">
            {label}
          </span>
          <div className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full ${c.bg} ${c.icon} ring-1 ring-white/5 transition-transform duration-300 group-hover:scale-105`}>
            <Icon size={18} strokeWidth={2} />
          </div>
        </div>

        <div className="text-left">
          <h3 className="text-[38px] font-bold leading-none tracking-[-0.04em] text-white tabular-nums sm:text-[40px] xl:text-[42px]">
            {formatValue(value)}
          </h3>
        </div>
      </div>

      {trend !== undefined && (
        <div className="mt-3 flex items-center gap-1.5 pt-3 border-t border-white/8">
          {trendUp ? (
            <TrendingUp size={14} className="text-emerald-500 flex-shrink-0" />
          ) : (
            <TrendingDown size={14} className="text-red-500 flex-shrink-0" />
          )}
          <span className={`text-sm font-medium ${trendUp ? 'text-emerald-400' : 'text-red-400'}`}>
            {Math.abs(trend)}%
          </span>
          <span className="whitespace-nowrap text-sm text-slate-400 dark:text-slate-500">vs last month</span>
        </div>
      )}
    </DashboardCard>
  );
}

