import DashboardCard from './DashboardCard';

export default function TableCard({ title, subtitle, headerActions, children, className = '', ...props }) {
  return (
    <DashboardCard className={`p-0 overflow-hidden ${className}`} {...props}>
      {(title || subtitle || headerActions) && (
        <div className="px-6 py-5 border-b border-slate-200 dark:border-brand-slate flex items-center justify-between gap-4 flex-shrink-0">
          <div className="max-w-2xl">
            {title && <h3 className="text-lg font-semibold text-slate-900 dark:text-white leading-tight tracking-[-0.02em]">{title}</h3>}
            {subtitle && <p className="text-sm text-slate-500 dark:text-slate-400 mt-1.5 leading-6">{subtitle}</p>}
          </div>
          {headerActions && <div className="flex items-center gap-2 flex-shrink-0">{headerActions}</div>}
        </div>
      )}
      <div className="overflow-x-auto w-full">
        {children}
      </div>
    </DashboardCard>
  );
}

