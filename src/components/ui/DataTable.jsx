import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Search, X, ChevronDown, ChevronUp } from 'lucide-react';
import useThemeStore from '../../store/useThemeStore';

export default function DataTable({
  columns,
  data,
  searchable = true,
  searchPlaceholder = 'Search...',
  pageSize = 10,
  onRowClick,
  actions,
  emptyMessage = 'No data found',
  filters,
  activeFilter,
  onFilterChange,
  filterFn,          // optional: (row) => boolean — applied before search
}) {
  const { isDark } = useThemeStore();
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [sortCol, setSortCol] = useState(null);
  const [sortDir, setSortDir] = useState('asc');
  const [hoveredRow, setHoveredRow] = useState(null);

  /* ── Colour tokens ───────────────── */
  const border    = isDark ? '#334155' : '#e2e8f0';
  const textMain  = isDark ? '#f1f5f9' : '#0f172a';
  const textMuted = isDark ? '#94a3b8' : '#64748b';
  const tableBg   = isDark ? '#1E293B' : '#ffffff';
  const headBg    = isDark ? 'rgba(51,65,85,0.5)' : '#f8fafc';
  const rowHover  = isDark ? 'rgba(51,65,85,0.4)' : 'rgba(249,115,22,0.04)';
  const inputBg   = isDark ? '#334155' : '#ffffff';
  const inputBorder = isDark ? '#475569' : '#d1d5db';

  const filteredData = useMemo(() => {
    let result = [...data];
    // Apply parent filter function first
    if (filterFn) result = result.filter(filterFn);
    // Then apply search
    if (search) {
      const q = search.toLowerCase();
      result = result.filter((row) =>
        columns.some((col) => {
          const val = col.accessor ? row[col.accessor] : '';
          return String(val).toLowerCase().includes(q);
        })
      );
    }
    if (sortCol) {
      result.sort((a, b) => {
        const aVal = a[sortCol] ?? '';
        const bVal = b[sortCol] ?? '';
        if (typeof aVal === 'number' && typeof bVal === 'number') {
          return sortDir === 'asc' ? aVal - bVal : bVal - aVal;
        }
        return sortDir === 'asc'
          ? String(aVal).localeCompare(String(bVal))
          : String(bVal).localeCompare(String(aVal));
      });
    }
    return result;
  }, [data, search, sortCol, sortDir, columns, filterFn]);

  const totalPages = Math.ceil(filteredData.length / pageSize);
  const paginatedData = filteredData.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const handleSort = (accessor) => {
    if (sortCol === accessor) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortCol(accessor);
      setSortDir('asc');
    }
  };

  return (
    <div style={{ width: '100%', boxSizing: 'border-box' }}>

      {/* ── Filter pills row ──────────── */}
      {filters && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '12px' }}>
          {filters.map((f) => {
            const active = activeFilter === f.value;
            return (
              <button
                key={f.value}
                onClick={() => onFilterChange?.(f.value)}
                style={{
                  display: 'flex', alignItems: 'center', gap: '6px',
                  padding: '7px 14px', borderRadius: '10px',
                  border: active ? 'none' : `1px solid ${border}`,
                  background: active
                    ? 'linear-gradient(135deg, #f97316, #ea580c)'
                    : isDark ? 'rgba(51,65,85,0.4)' : '#f8fafc',
                  color: active ? '#fff' : textMuted,
                  fontSize: '12px', fontWeight: 600,
                  cursor: 'pointer', transition: 'all 0.18s',
                  whiteSpace: 'nowrap',
                  boxShadow: active ? '0 4px 10px rgba(249,115,22,0.25)' : 'none',
                }}
                onMouseEnter={(e) => { if (!active) { e.currentTarget.style.background = isDark ? '#334155' : '#f1f5f9'; e.currentTarget.style.color = isDark ? '#f1f5f9' : '#0f172a'; }}}
                onMouseLeave={(e) => { if (!active) { e.currentTarget.style.background = isDark ? 'rgba(51,65,85,0.4)' : '#f8fafc'; e.currentTarget.style.color = textMuted; }}}
              >
                {f.label}
                {f.count !== undefined && (
                  <span style={{
                    background: active ? 'rgba(255,255,255,0.28)' : isDark ? 'rgba(71,85,105,0.8)' : '#e2e8f0',
                    color: active ? '#fff' : isDark ? '#cbd5e1' : '#475569',
                    fontSize: '10px', fontWeight: 700,
                    padding: '1px 7px', borderRadius: '999px',
                    lineHeight: '18px', minWidth: '18px', textAlign: 'center',
                  }}>
                    {f.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      )}

      {/* ── Search bar row ─────────────── */}
      {searchable && (
        <div style={{ position: 'relative', width: '100%', marginBottom: '20px' }}>
          {/* Search icon */}
          <div style={{
            position: 'absolute', left: '14px', top: '50%',
            transform: 'translateY(-50%)',
            display: 'flex', alignItems: 'center', pointerEvents: 'none',
            color: isDark ? '#64748b' : '#94a3b8',
          }}>
            <Search size={15} />
          </div>

          <input
            type="text"
            value={search}
            onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
            placeholder={searchPlaceholder}
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="off"
            spellCheck={false}
            name="table-search-field"
            id="datatable-search"
            style={{
              width: '100%',
              paddingLeft: '42px',
              paddingRight: search ? '40px' : '16px',
              paddingTop: '10px',
              paddingBottom: '10px',
              borderRadius: '12px',
              border: `1.5px solid ${isDark ? '#475569' : '#d1d5db'}`,
              background: isDark ? '#1e293b' : '#ffffff',
              color: isDark ? '#f1f5f9' : '#0f172a',
              fontSize: '13px',
              fontWeight: 400,
              outline: 'none',
              fontFamily: 'inherit',
              boxSizing: 'border-box',
              transition: 'border-color 0.2s, box-shadow 0.2s',
              boxShadow: isDark ? 'none' : '0 1px 3px rgba(0,0,0,0.06)',
              WebkitAppearance: 'none',
              MozAppearance: 'none',
              appearance: 'none',
            }}
            onFocus={(e) => {
              e.target.style.borderColor = '#f97316';
              e.target.style.boxShadow = '0 0 0 3px rgba(249,115,22,0.12)';
            }}
            onBlur={(e) => {
              e.target.style.borderColor = isDark ? '#475569' : '#d1d5db';
              e.target.style.boxShadow = isDark ? 'none' : '0 1px 3px rgba(0,0,0,0.06)';
            }}
          />

          {/* Clear button */}
          {search && (
            <button
              onClick={() => { setSearch(''); setCurrentPage(1); }}
              style={{
                position: 'absolute', right: '10px', top: '50%',
                transform: 'translateY(-50%)',
                background: isDark ? '#334155' : '#f1f5f9',
                border: 'none', cursor: 'pointer',
                color: isDark ? '#94a3b8' : '#64748b',
                display: 'flex', padding: '4px', borderRadius: '6px',
                transition: 'background 0.15s',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.background = isDark ? '#475569' : '#e2e8f0'; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = isDark ? '#334155' : '#f1f5f9'; }}
            >
              <X size={13} />
            </button>
          )}
        </div>
      )}

      {/* ── If no filters and no search, still add bottom margin ── */}
      {!filters && !searchable && <div style={{ marginBottom: '0px' }} />}


      {/* ── Table ────────────────────────────── */}
      <div style={{
        width: '100%', overflowX: 'auto',
        borderRadius: '16px',
        border: `1px solid ${border}`,
        background: tableBg,
        boxSizing: 'border-box',
      }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
          <thead>
            <tr style={{ background: headBg }}>
              {columns.map((col) => (
                <th
                  key={col.accessor || col.header}
                  onClick={() => col.sortable !== false && col.accessor && handleSort(col.accessor)}
                  style={{
                    padding: '14px 16px',
                    textAlign: 'left',
                    fontSize: '11px',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    letterSpacing: '0.1em',
                    color: textMuted,
                    whiteSpace: 'nowrap',
                    cursor: col.sortable !== false && col.accessor ? 'pointer' : 'default',
                    userSelect: 'none',
                    borderBottom: `1px solid ${border}`,
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                    {col.header}
                    {sortCol === col.accessor && (
                      sortDir === 'asc'
                        ? <ChevronUp size={13} style={{ color: '#f97316' }} />
                        : <ChevronDown size={13} style={{ color: '#f97316' }} />
                    )}
                  </div>
                </th>
              ))}
              {actions && (
                <th style={{
                  padding: '14px 16px',
                  textAlign: 'right',
                  fontSize: '11px', fontWeight: 700,
                  textTransform: 'uppercase', letterSpacing: '0.1em',
                  color: textMuted, whiteSpace: 'nowrap',
                  borderBottom: `1px solid ${border}`,
                }}>
                  Actions
                </th>
              )}
            </tr>
          </thead>

          <tbody>
            <AnimatePresence>
              {paginatedData.length === 0 ? (
                <tr>
                  <td
                    colSpan={columns.length + (actions ? 1 : 0)}
                    style={{
                      padding: '48px 16px',
                      textAlign: 'center',
                      color: textMuted,
                      fontSize: '14px',
                    }}
                  >
                    {emptyMessage}
                  </td>
                </tr>
              ) : (
                paginatedData.map((row, i) => (
                  <motion.tr
                    key={row.id || i}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.025 }}
                    onClick={() => onRowClick?.(row)}
                    onMouseEnter={() => setHoveredRow(row.id || i)}
                    onMouseLeave={() => setHoveredRow(null)}
                    style={{
                      background: hoveredRow === (row.id || i) ? rowHover : 'transparent',
                      cursor: onRowClick ? 'pointer' : 'default',
                      borderBottom: `1px solid ${border}`,
                      transition: 'background 0.15s',
                    }}
                  >
                    {columns.map((col) => (
                      <td
                        key={col.accessor || col.header}
                        style={{
                          padding: '14px 16px',
                          color: textMuted,
                          whiteSpace: 'nowrap',
                          verticalAlign: 'middle',
                        }}
                      >
                        {col.render ? col.render(row) : row[col.accessor]}
                      </td>
                    ))}
                    {actions && (
                      <td style={{ padding: '14px 16px', textAlign: 'right', verticalAlign: 'middle' }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '6px' }}>
                          {actions(row)}
                        </div>
                      </td>
                    )}
                  </motion.tr>
                ))
              )}
            </AnimatePresence>
          </tbody>
        </table>
      </div>

      {/* ── Pagination ───────────────────────── */}
      {totalPages > 1 && (
        <div style={{
          display: 'flex', alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap', gap: '12px',
          marginTop: '16px',
          padding: '0 2px',
        }}>
          <p style={{ fontSize: '12px', color: textMuted }}>
            Showing {(currentPage - 1) * pageSize + 1}–{Math.min(currentPage * pageSize, filteredData.length)} of {filteredData.length} entries
          </p>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              style={{
                width: '32px', height: '32px', borderRadius: '9px',
                border: `1px solid ${border}`,
                background: 'transparent', color: textMuted,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
                opacity: currentPage === 1 ? 0.35 : 1,
                transition: 'background 0.15s',
              }}
              onMouseEnter={(e) => { if (currentPage !== 1) e.currentTarget.style.background = isDark ? '#334155' : '#f1f5f9'; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
            >
              <ChevronLeft size={15} />
            </button>

            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              let page;
              if (totalPages <= 5) page = i + 1;
              else if (currentPage <= 3) page = i + 1;
              else if (currentPage >= totalPages - 2) page = totalPages - 4 + i;
              else page = currentPage - 2 + i;
              const isActive = currentPage === page;
              return (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  style={{
                    width: '32px', height: '32px', borderRadius: '9px',
                    border: isActive ? 'none' : `1px solid ${border}`,
                    background: isActive ? 'linear-gradient(135deg, #f97316, #ea580c)' : 'transparent',
                    color: isActive ? '#fff' : textMuted,
                    fontSize: '12px', fontWeight: isActive ? 700 : 400,
                    cursor: 'pointer',
                    transition: 'all 0.15s',
                    boxShadow: isActive ? '0 3px 8px rgba(249,115,22,0.3)' : 'none',
                  }}
                  onMouseEnter={(e) => { if (!isActive) e.currentTarget.style.background = isDark ? '#334155' : '#f1f5f9'; }}
                  onMouseLeave={(e) => { if (!isActive) e.currentTarget.style.background = 'transparent'; }}
                >
                  {page}
                </button>
              );
            })}

            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              style={{
                width: '32px', height: '32px', borderRadius: '9px',
                border: `1px solid ${border}`,
                background: 'transparent', color: textMuted,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
                opacity: currentPage === totalPages ? 0.35 : 1,
                transition: 'background 0.15s',
              }}
              onMouseEnter={(e) => { if (currentPage !== totalPages) e.currentTarget.style.background = isDark ? '#334155' : '#f1f5f9'; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
            >
              <ChevronRight size={15} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
