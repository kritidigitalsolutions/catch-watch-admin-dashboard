export default function ContentGrid({ children, cols = 3, gap = 'md', className = '' }) {
  const colClasses = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 xl:grid-cols-3',
    4: 'grid-cols-1 md:grid-cols-2 xl:grid-cols-4',
    '3-to-4': 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4',
  };

  const gapClasses = {
    xs: 'gap-4',
    sm: 'gap-5',
    md: 'gap-6',
    lg: 'gap-8',
  };

  const colClass = colClasses[cols] || colClasses[3];
  const gapClass = gapClasses[gap] || gapClasses.md;

  return (
    <div className={`grid ${colClass} ${gapClass} min-w-0 w-full ${className}`}>
      {children}
    </div>
  );
}

