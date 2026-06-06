export default function SectionContainer({ title, description, actions, children, className = '' }) {
  return (
    <div className={`space-y-4 ${className}`}>
      {(title || description || actions) && (
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-1">
          <div className="max-w-3xl">
            {title && <h2 className="text-2xl sm:text-[28px] font-semibold text-slate-900 dark:text-white leading-tight tracking-[-0.03em]">{title}</h2>}
            {description && <p className="text-sm sm:text-[15px] text-slate-500 dark:text-slate-400 mt-2 leading-6">{description}</p>}
          </div>
          {actions && <div className="flex items-center gap-3 flex-shrink-0 sm:pb-1">{actions}</div>}
        </div>
      )}
      {children}
    </div>
  );
}

