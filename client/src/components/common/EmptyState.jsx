function EmptyState({ title, description, action, variant = 'empty' }) {
  const isError = variant === 'error'
  return (
    <div className={`state-box ${isError ? 'error' : ''}`} role={isError ? 'alert' : undefined}>
      <div className="state-box-icon" aria-hidden="true">
        <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          {isError
            ? <><circle cx="12" cy="12" r="9" /><path d="M12 7v6M12 16.5v.5" /></>
            : <><path d="M4 7h16M4 12h16M4 17h10" /></>}
        </svg>
      </div>
      <p className="state-box-title">{title}</p>
      {description && <p style={{ maxWidth: 380, fontSize: 14 }}>{description}</p>}
      {action && <div style={{ marginTop: 8 }}>{action}</div>}
    </div>
  )
}

export default EmptyState
