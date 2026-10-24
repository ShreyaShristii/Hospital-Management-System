function TableSkeleton({ rows = 6, columns = 5, label = 'Loading' }) {
  return (
    <div role="status" aria-live="polite" aria-busy="true">
      <span className="sr-only">{label}...</span>
      {Array.from({ length: rows }).map((_, r) => (
        <div
          key={r}
          aria-hidden="true"
          style={{
            display: 'grid',
            gridTemplateColumns: `repeat(${columns}, 1fr)`,
            gap: '16px',
            padding: '16px 8px',
            borderBottom: '1px solid var(--color-border)',
          }}
        >
          {Array.from({ length: columns }).map((__, c) => (
            <span key={c} className="skeleton" style={{ width: c === 0 ? '80%' : '60%' }} />
          ))}
        </div>
      ))}
    </div>
  )
}

export default TableSkeleton
