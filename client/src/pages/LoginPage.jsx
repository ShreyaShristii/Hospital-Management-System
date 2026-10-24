import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, Link } from 'react-router-dom'
import { loginUser } from '../features/auth/authSlice'

import './LoginPage.css';

function LoginPage() {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const { isLoading, error } = useSelector((state) => state.auth)

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  })
  const [showPassword, setShowPassword] = useState(false)

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    dispatch(loginUser(formData)).then((result) => {
      if (result.meta.requestStatus === 'fulfilled') {
        navigate('/dashboard')
      }
    })
  }

  return (
    <>
      <div className="login-root">

        {/* Left Panel */}
        <div className="login-panel">

          <div className="login-logo">
            <div className="login-logo-icon">H</div>
            <span className="login-logo-text">HMS</span>
          </div>

          <h2 className="login-heading">Welcome back</h2>

          <p className="login-subheading">
            Sign in to your hospital account
          </p>

          {error && (
            <div className="login-error" id="login-error" role="alert">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>

            <div className="login-field">
              <label className="login-label" htmlFor="login-email">
                Email Address
              </label>

              <input
                id="login-email"
                className="login-input"
                type="email"
                name="email"
                autoComplete="username"
                autoFocus
                aria-invalid={Boolean(error)}
                aria-describedby={error ? 'login-error' : undefined}
                value={formData.email}
                onChange={handleChange}
                placeholder="you@hospital.com"
                required
              />
            </div>

            <div className="login-field">
              <label className="login-label" htmlFor="login-password">
                Password
              </label>

              <div style={{ position: 'relative' }}>
                <input
                  id="login-password"
                  className="login-input"
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  autoComplete="current-password"
                  aria-invalid={Boolean(error)}
                  aria-describedby={error ? 'login-error' : undefined}
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  style={{ paddingRight: '64px' }}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((s) => !s)}
                  aria-pressed={showPassword}
                  style={{
                    position: 'absolute', right: 8, top: '50%', transform: 'translateY(-50%)',
                    background: 'transparent', border: 'none', color: '#1a4f7a',
                    fontSize: 13, fontWeight: 600, padding: '4px 8px',
                  }}
                >
                  {showPassword ? 'Hide' : 'Show'}
                </button>
              </div>
            </div>

            <button
              className="login-btn"
              type="submit"
              disabled={isLoading}
            >
              {isLoading ? 'Signing in...' : 'Sign In'}
            </button>

          </form>

          <p className="login-register">
            New patient?{' '}
            <Link to="/register">
              Register here
            </Link>
          </p>

        </div>

        {/* Right Panel */}
        <div className="login-visual">

          <div className="login-visual-content">

            <h3 className="login-visual-title">
              Hospital Management System
            </h3>

            <p className="login-visual-desc">
              A unified platform for managing patients, doctors,
              appointments, pharmacy, lab reports, and billing —
              all in one place.
            </p>

          </div>

        </div>

      </div>
    </>
  )
}

export default LoginPage