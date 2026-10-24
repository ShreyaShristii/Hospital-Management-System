import { Link } from 'react-router-dom'

function StatusPage({ code, title, message }) {
  return (
    <main
      id="main-content"
      style={{ minHeight: '100vh', display: 'grid', placeItems: 'center', padding: 24, background: 'var(--color-bg)' }}
    >
      <div className="surface" style={{ maxWidth: 440, width: '100%', textAlign: 'center', padding: 40 }}>
        <p style={{ fontFamily: 'var(--font-display)', fontSize: 56, color: 'var(--color-primary)', lineHeight: 1 }}>{code}</p>
        <h1 className="page-title" style={{ marginTop: 12 }}>{title}</h1>
        <p className="page-subtitle" style={{ marginBottom: 24 }}>{message}</p>
        <Link to="/dashboard" className="btn btn-primary" style={{ textDecoration: 'none' }}>Back to dashboard</Link>
      </div>
    </main>
  )
}

export default StatusPage
