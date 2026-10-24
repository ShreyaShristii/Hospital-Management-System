import Navbar from '../Navbar'

function PageLayout({ title, subtitle, actions, children }) {
  return (
    <>
      <Navbar />
      <main id="main-content" className="page" tabIndex={-1}>
        <div className="page-inner">
          <div className="page-header">
            <div>
              <h1 className="page-title">{title}</h1>
              {subtitle && <p className="page-subtitle">{subtitle}</p>}
            </div>
            {actions && <div>{actions}</div>}
          </div>
          {children}
        </div>
      </main>
    </>
  )
}

export default PageLayout
