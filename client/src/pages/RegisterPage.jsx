import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, Link } from 'react-router-dom'
import { registerUser, loginUser } from '../features/auth/authSlice'

const styles = `

  .register-root {
    min-height: 100vh;
    background: #f0f4f8;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 40px 20px;
    font-family: 'DM Sans', sans-serif;
  }

  .register-card {
    width: 100%;
    max-width: 760px;
    background: #ffffff;
    border-radius: 20px;
    padding: 48px;
    box-shadow: 0 10px 40px rgba(15, 45, 74, 0.08);
  }

  .register-header {
    text-align: center;
    margin-bottom: 40px;
  }

  .register-logo {
    width: 58px;
    height: 58px;
    margin: 0 auto 18px;
    background: #1a4f7a;
    border-radius: 14px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    font-size: 24px;
  }

  .register-title {
    font-family: 'Playfair Display', serif;
    font-size: 34px;
    color: #0f2d4a;
    margin: 0 0 10px;
  }

  .register-subtitle {
    color: #7a8fa6;
    font-size: 15px;
    line-height: 1.7;
    margin: 0;
  }

  .register-error {
    background: #fff0f0;
    border-left: 4px solid #e05252;
    color: #c0392b;
    padding: 14px 16px;
    border-radius: 8px;
    margin-bottom: 24px;
    font-size: 14px;
  }

  .register-section {
    margin-bottom: 36px;
    padding-bottom: 28px;
    border-bottom: 1px solid #e8eef5;
  }

  .register-section:last-of-type {
    border-bottom: none;
    margin-bottom: 24px;
  }

  .section-title {
    font-family: 'Playfair Display', serif;
    color: #0f2d4a;
    font-size: 24px;
    margin-bottom: 24px;
  }

  .register-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 22px;
  }

  .register-field {
    display: flex;
    flex-direction: column;
  }

  .register-field-full {
    grid-column: span 2;
  }

  .register-label {
    font-size: 12px;
    font-weight: 600;
    color: #4a6580;
    text-transform: uppercase;
    letter-spacing: 0.8px;
    margin-bottom: 8px;
  }

  .register-input,
  .register-select {
    width: 100%;
    padding: 13px 14px;
    border: 1.5px solid #d8e3ed;
    border-radius: 10px;
    background: #f8fafc;
    font-size: 14px;
    font-family: 'DM Sans', sans-serif;
    color: #0f2d4a;
    outline: none;
    transition: all 0.2s ease;
    box-sizing: border-box;
  }

  .register-input:focus,
  .register-select:focus {
    border-color: #1a4f7a;
    background: #fff;
  }

  .register-btn {
    width: 100%;
    padding: 14px;
    background: #1a4f7a;
    color: white;
    border: none;
    border-radius: 10px;
    font-size: 15px;
    font-weight: 600;
    font-family: 'DM Sans', sans-serif;
    cursor: pointer;
    transition: background 0.2s ease, transform 0.1s ease;
    margin-top: 8px;
  }

  .register-btn:hover:not(:disabled) {
    background: #153f61;
  }

  .register-btn:active:not(:disabled) {
    transform: scale(0.99);
  }

  .register-btn:disabled {
    background: #7aa3c0;
    cursor: not-allowed;
  }

  .register-footer {
    margin-top: 24px;
    text-align: center;
    color: #7a8fa6;
    font-size: 14px;
  }

  .register-footer a {
    color: #1a4f7a;
    font-weight: 600;
    text-decoration: none;
  }

  .register-footer a:hover {
    text-decoration: underline;
  }

  @media (max-width: 768px) {
    .register-card {
      padding: 32px 24px;
    }

    .register-grid {
      grid-template-columns: 1fr;
    }

    .register-field-full {
      grid-column: span 1;
    }

    .register-title {
      font-size: 28px;
    }
  }
`

function RegisterPage() {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const { isLoading, error } = useSelector((state) => state.auth)

  const [formData, setFormData] = useState({
    name: '',
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    age: '',
    gender: '',
    bloodGroup: '',
    allergies: '',
    address: '',
    contactNumber: '',
    emergencyContact: '',
    currentHealthStatus: '',
  })

  const [formError, setFormError] = useState('')

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setFormError('')

    if (formData.password !== formData.confirmPassword) {
      setFormError('Passwords do not match')
      return
    }

    const result = await dispatch(registerUser({
      name: formData.name,
      username: formData.username,
      email: formData.email,
      password: formData.password,
      phone: formData.phone,
      role: 'patient',
      age: formData.age,
      gender: formData.gender,
      bloodGroup: formData.bloodGroup,
      allergies: formData.allergies,
      address: formData.address,
      contactNumber: formData.contactNumber,
      emergencyContact: formData.emergencyContact,
      currentHealthStatus: formData.currentHealthStatus,
    }))

    if (result.meta.requestStatus === 'fulfilled') {
      const loginResult = await dispatch(loginUser({
        email: formData.email,
        password: formData.password,
      }))

      if (loginResult.meta.requestStatus === 'fulfilled') {
        navigate('/dashboard')
      }
    }
  }

  return (
    <>
      <style>{styles}</style>

      <div className="register-root">

        <div className="register-card">

          <div className="register-header">

            <div className="register-logo">
              H
            </div>

            <h2 className="register-title">
              Patient Registration
            </h2>

            <p className="register-subtitle">
              Create your account to book appointments and manage
              your health records seamlessly.
            </p>

          </div>

          {(error || formError) && (
            <div className="register-error">
              {formError || error}
            </div>
          )}

          <form onSubmit={handleSubmit}>

            {/* Account Details */}
            <div className="register-section">

              <h3 className="section-title">
                Account Details
              </h3>

              <div className="register-grid">

                <div className="register-field">
                  <label className="register-label">
                    Full Name
                  </label>

                  <input
                    className="register-input"
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="register-field">
                  <label className="register-label">
                    Username
                  </label>

                  <input
                    className="register-input"
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="register-field">
                  <label className="register-label">
                    Email
                  </label>

                  <input
                    className="register-input"
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="register-field">
                  <label className="register-label">
                    Phone
                  </label>

                  <input
                    className="register-input"
                    type="text"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                  />
                </div>

                <div className="register-field">
                  <label className="register-label">
                    Password
                  </label>

                  <input
                    className="register-input"
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="register-field">
                  <label className="register-label">
                    Confirm Password
                  </label>

                  <input
                    className="register-input"
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                  />
                </div>

              </div>
            </div>

            {/* Medical Details */}
            <div className="register-section">

              <h3 className="section-title">
                Medical Details
              </h3>

              <div className="register-grid">

                <div className="register-field">
                  <label className="register-label">
                    Age
                  </label>

                  <input
                    className="register-input"
                    type="number"
                    name="age"
                    value={formData.age}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="register-field">
                  <label className="register-label">
                    Gender
                  </label>

                  <select
                    className="register-select"
                    name="gender"
                    value={formData.gender}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div className="register-field">
                  <label className="register-label">
                    Blood Group
                  </label>

                  <select
                    className="register-select"
                    name="bloodGroup"
                    value={formData.bloodGroup}
                    onChange={handleChange}
                  >
                    <option value="">Select Blood Group</option>
                    <option value="A+">A+</option>
                    <option value="A-">A-</option>
                    <option value="B+">B+</option>
                    <option value="B-">B-</option>
                    <option value="O+">O+</option>
                    <option value="O-">O-</option>
                    <option value="AB+">AB+</option>
                    <option value="AB-">AB-</option>
                  </select>
                </div>

                <div className="register-field">
                  <label className="register-label">
                    Current Health Status
                  </label>

                  <select
                    className="register-select"
                    name="currentHealthStatus"
                    value={formData.currentHealthStatus}
                    onChange={handleChange}
                  >
                    <option value="">Select Status</option>
                    <option value="Good">Good</option>
                    <option value="Fair">Fair</option>
                    <option value="Critical">Critical</option>
                    <option value="Stable">Stable</option>
                    <option value="Under Observation">
                      Under Observation
                    </option>
                  </select>
                </div>

                <div className="register-field register-field-full">
                  <label className="register-label">
                    Allergies
                  </label>

                  <input
                    className="register-input"
                    type="text"
                    name="allergies"
                    value={formData.allergies}
                    onChange={handleChange}
                    placeholder="None or list allergies"
                  />
                </div>

                <div className="register-field register-field-full">
                  <label className="register-label">
                    Address
                  </label>

                  <input
                    className="register-input"
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                  />
                </div>

                <div className="register-field">
                  <label className="register-label">
                    Contact Number
                  </label>

                  <input
                    className="register-input"
                    type="text"
                    name="contactNumber"
                    value={formData.contactNumber}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="register-field">
                  <label className="register-label">
                    Emergency Contact
                  </label>

                  <input
                    className="register-input"
                    type="text"
                    name="emergencyContact"
                    value={formData.emergencyContact}
                    onChange={handleChange}
                    required
                  />
                </div>

              </div>
            </div>

            <button
              className="register-btn"
              type="submit"
              disabled={isLoading}
            >
              {isLoading ? 'Registering...' : 'Register'}
            </button>

            <p className="register-footer">
              Already have an account?{' '}
              <Link to="/login">
                Login here
              </Link>
            </p>

          </form>

        </div>

      </div>
    </>
  )
}

export default RegisterPage