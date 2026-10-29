import { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { NavLink, Link, useLocation, useNavigate } from 'react-router-dom'
import { logout, fetchCurrentUser } from '../features/auth/authSlice'
import NotificationBell from './notifications/NotificationBell'
import './Navbar.css'

const dashboard = { label: 'Dashboard', path: '/dashboard' }

const ADMIN_SECTIONS = [
  { title: 'Overview', links: [dashboard] },
  {
    title: 'People',
    links: [
      { label: 'Patients', path: '/patients' },
      { label: 'Doctors', path: '/doctors' },
      { label: 'Staff', path: '/staff' },
    ],
  },
  {
    title: 'Hospital',
    links: [
      { label: 'Appointments', path: '/appointments' },
      { label: 'Admissions', path: '/admissions' },
      { label: 'Beds', path: '/beds' },
      { label: 'Departments', path: '/departments' },
    ],
  },
  {
    title: 'Clinical',
    links: [
      { label: 'EMR', path: '/emr' },
      { label: 'Lab Tests', path: '/lab' },
      { label: 'Pharmacy', path: '/pharmacy' },
    ],
  },
  {
    title: 'Finance & Feedback',
    links: [
      { label: 'Bills', path: '/bills' },
      { label: 'Reviews', path: '/reviews' },
    ],
  },
]

const NAV_LINKS = {
  doctor: [
    dashboard,
    { label: 'My Appointments', path: '/appointments' },
    { label: 'Patients', path: '/patients' },
    { label: 'EMR', path: '/emr' },
    { label: 'Lab Requests', path: '/lab' },
    { label: 'Pharmacy', path: '/pharmacy' },
    { label: 'My Reviews', path: '/reviews' },
  ],
  patient: [
    dashboard,
    { label: 'Book Appointment', path: '/appointments' },
    { label: 'My EMR', path: '/emr' },
    { label: 'Lab Results', path: '/lab' },
    { label: 'My Bills', path: '/bills' },
    { label: 'Reviews', path: '/reviews' },
  ],
  receptionist: [
    dashboard,
    { label: 'Patients', path: '/patients' },
    { label: 'Doctors', path: '/doctors' },
    { label: 'Appointments', path: '/appointments' },
    { label: 'Bills', path: '/bills' },
    { label: 'Admissions', path: '/admissions' },
    { label: 'Beds', path: '/beds' },
  ],
  nurse: [
    dashboard,
    { label: 'Patients', path: '/patients' },
    { label: 'Admissions', path: '/admissions' },
    { label: 'Lab Tests', path: '/lab' },
    { label: 'Pharmacy', path: '/pharmacy' },
  ],
  lab_staff: [dashboard, { label: 'Lab Tests', path: '/lab' }],
  pharmacist: [dashboard, { label: 'Pharmacy', path: '/pharmacy' }],
}

const PROFILE_PATH = {
  patient: '/patient-profile',
  doctor: '/doctor-profile',
  receptionist: '/staff-profile',
  nurse: '/staff-profile',
  lab_staff: '/staff-profile',
  pharmacist: '/staff-profile',
}

const roleLabel = (role) => (role || '').replace('_', ' ').replace(/^\w/, (c) => c.toUpperCase())
const initials = (name) =>
  (name || '?').split(' ').filter(Boolean).slice(0, 2).map((p) => p[0].toUpperCase()).join('')

function Navbar() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const location = useLocation()
  const { user } = useSelector((state) => state.auth)
  const [menuOpen, setMenuOpen] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const userMenuRef = useRef(null)

  // The token only carries id and role; load the display name once.
  useEffect(() => {
    if (user && !user.name) dispatch(fetchCurrentUser())
  }, [dispatch, user])

  useEffect(() => {
    setMenuOpen(false)
    setUserMenuOpen(false)
  }, [location.pathname])

  useEffect(() => {
    const onPointerDown = (e) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) setUserMenuOpen(false)
    }
    const onKeyDown = (e) => {
      if (e.key === 'Escape') {
        setUserMenuOpen(false)
        setMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', onPointerDown)
    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('mousedown', onPointerDown)
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [])

  const handleLogout = () => {
    dispatch(logout())
    navigate('/login')
  }

  const isAdmin = user?.role === 'admin'
  const links = NAV_LINKS[user?.role] || []
  const profilePath = PROFILE_PATH[user?.role] || '/profile'

  // Reserves room for the fixed sidebar on every page that renders the Navbar.
  useEffect(() => {
    document.body.classList.toggle('has-sidebar', isAdmin)
    return () => document.body.classList.remove('has-sidebar')
  }, [isAdmin])

  const brand = (
    <Link to="/dashboard" className="app-nav-brand" aria-label="HMS home">
      <span className="app-nav-logo" aria-hidden="true">H</span>
      <span className="app-nav-brand-text">HMS</span>
    </Link>
  )

  const toggle = (
    <button
      type="button"
      className="app-nav-toggle"
      aria-label={menuOpen ? 'Close menu' : 'Open menu'}
      aria-expanded={menuOpen}
      aria-controls="primary-navigation"
      onClick={() => setMenuOpen((o) => !o)}
    >
      <span aria-hidden="true">{menuOpen ? '\u2715' : '\u2630'}</span>
    </button>
  )

  const actions = (
    <div className="app-nav-actions">
      <NotificationBell />

      <div className="app-nav-user" ref={userMenuRef}>
        <button
          type="button"
          className="app-nav-user-btn"
          aria-haspopup="menu"
          aria-expanded={userMenuOpen}
          onClick={() => setUserMenuOpen((o) => !o)}
        >
          <span className="app-nav-avatar" aria-hidden="true">{initials(user?.name)}</span>
          <span className="app-nav-user-text">
            <span className="app-nav-user-name">{user?.name || 'Account'}</span>
            <span className="app-nav-user-role">{roleLabel(user?.role)}</span>
          </span>
        </button>

        {userMenuOpen && (
          <div className="app-nav-menu" role="menu">
            <Link role="menuitem" to={profilePath} className="app-nav-menu-item">My profile</Link>
            <Link role="menuitem" to="/profile" className="app-nav-menu-item">Account &amp; password</Link>
            <button role="menuitem" type="button" className="app-nav-menu-item is-danger" onClick={handleLogout}>
              Sign out
            </button>
          </div>
        )}
      </div>
    </div>
  )

  if (isAdmin) {
    return (
      <>
        <a href="#main-content" className="skip-link">Skip to main content</a>
        <header className="app-nav app-nav--admin">
          <div className="app-nav-inner">
            {toggle}
            <div className="app-nav-admin-brand">{brand}</div>
            {actions}
          </div>
        </header>

        {menuOpen && <div className="app-sidebar-backdrop" onClick={() => setMenuOpen(false)} aria-hidden="true" />}
        <aside className={`app-sidebar ${menuOpen ? 'is-open' : ''}`}>
          {brand}
          <nav id="primary-navigation" aria-label="Primary" className="app-sidebar-nav">
            {ADMIN_SECTIONS.map((section) => (
              <div key={section.title} className="app-sidebar-section">
                <p className="app-sidebar-heading">{section.title}</p>
                {section.links.map((link) => (
                  <NavLink
                    key={link.path}
                    to={link.path}
                    className={({ isActive }) => `app-sidebar-link ${isActive ? 'is-active' : ''}`}
                  >
                    {link.label}
                  </NavLink>
                ))}
              </div>
            ))}
          </nav>
        </aside>
      </>
    )
  }

  return (
    <>
      <a href="#main-content" className="skip-link">Skip to main content</a>
      <header className="app-nav">
        <div className="app-nav-inner">
          {brand}

          <nav
            id="primary-navigation"
            aria-label="Primary"
            className={`app-nav-links ${menuOpen ? 'is-open' : ''}`}
          >
            {links.map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                className={({ isActive }) => `app-nav-link ${isActive ? 'is-active' : ''}`}
              >
                {link.label}
              </NavLink>
            ))}
          </nav>

          {actions}
          {toggle}
        </div>
      </header>
    </>
  )
}

export default Navbar
