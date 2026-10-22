import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { updateUserProfile } from '../../features/auth/authSlice'
import { updateDoctor, getDoctors } from '../../features/doctors/doctorSlice'

function DoctorEditForm({ doctorId }) {
  const dispatch = useDispatch()
  const { user, isLoading: authLoading } = useSelector((state) => state.auth)
  const { doctors } = useSelector((state) => state.doctors)
  
  const doctor = doctors?.find((d) => d._id === doctorId)
  
  const [formData, setFormData] = useState({
    // User fields
    name: '',
    email: '',
    phone: '',
    // Doctor specific fields
    specialization: '',
    degree: '',
    yearsOfExperience: '',
    workingDays: [],
    workingHours: '',
    consultationFee: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  })

  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [showPasswordSection, setShowPasswordSection] = useState(false)

  useEffect(() => {
    if (user && doctor) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        specialization: doctor.specialization || '',
        degree: doctor.degree || '',
        yearsOfExperience: doctor.yearsOfExperience || '',
        workingDays: doctor.workingDays || [],
        workingHours: doctor.workingHours || '',
        consultationFee: doctor.consultationFee || '',
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      })
    }
  }, [user, doctor])

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    
    if (type === 'checkbox') {
      setFormData({
        ...formData,
        workingDays: checked
          ? [...formData.workingDays, value]
          : formData.workingDays.filter((day) => day !== value),
      })
    } else {
      setFormData({ ...formData, [name]: value })
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setMessage('')

    if (formData.newPassword || formData.currentPassword) {
      if (!formData.currentPassword) {
        setError('Current password is required to change password')
        return
      }
      if (formData.newPassword !== formData.confirmPassword) {
        setError('New passwords do not match')
        return
      }
      if (formData.newPassword.length < 6) {
        setError('New password must be at least 6 characters')
        return
      }
    }

    setIsLoading(true)

    try {
      // Update user profile
      const userSubmitData = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
      }
      if (formData.newPassword) {
        userSubmitData.currentPassword = formData.currentPassword
        userSubmitData.newPassword = formData.newPassword
      }
      
      await dispatch(updateUserProfile(userSubmitData)).unwrap()

      // Update doctor profile
      const doctorSubmitData = {
        specialization: formData.specialization,
        degree: formData.degree,
        yearsOfExperience: formData.yearsOfExperience,
        workingDays: formData.workingDays,
        workingHours: formData.workingHours,
        consultationFee: formData.consultationFee,
      }

      await dispatch(updateDoctor({ id: doctorId, data: doctorSubmitData })).unwrap()

      // Refetch doctor data to ensure persistence
      await dispatch(getDoctors({ all: true }))

      setMessage('Profile updated successfully!')
      setFormData({
        ...formData,
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      })

      setTimeout(() => setMessage(''), 3000)
    } catch (err) {
      setError(err || 'Failed to update profile')
    } finally {
      setIsLoading(false)
    }
  }

  const workingDaysOptions = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']

  const styles = `
    .doctor-edit-form {
      max-width: 600px;
      margin: 0 auto;
      background: #ffffff;
      padding: 30px;
      border-radius: 12px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    }

    .form-group {
      margin-bottom: 20px;
    }

    .form-group label {
      display: block;
      margin-bottom: 8px;
      color: #0f2d4a;
      font-weight: 600;
      font-size: 14px;
    }

    .form-group input,
    .form-group textarea {
      width: 100%;
      padding: 12px;
      border: 1.5px solid #d8e3ed;
      border-radius: 8px;
      font-size: 14px;
      font-family: inherit;
      box-sizing: border-box;
    }

    .form-group input:focus,
    .form-group textarea:focus {
      outline: none;
      border-color: #0f2d4a;
      background: #f8fafc;
    }

    .form-row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 15px;
    }

    .checkbox-group {
      display: flex;
      flex-wrap: wrap;
      gap: 15px;
      margin-top: 10px;
    }

    .checkbox-item {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .checkbox-item input[type="checkbox"] {
      width: 18px;
      height: 18px;
      cursor: pointer;
    }

    .checkbox-item label {
      margin: 0;
      font-weight: 500;
      cursor: pointer;
    }

    .section-divider {
      height: 1px;
      background: #e8eef5;
      margin: 25px 0;
    }

    .section-title {
      color: #0f2d4a;
      font-size: 16px;
      font-weight: 600;
      margin-bottom: 15px;
    }

    .button-group {
      display: flex;
      gap: 10px;
      margin-top: 25px;
    }

    .btn-submit {
      flex: 1;
      padding: 12px;
      background: #0f2d4a;
      color: white;
      border: none;
      border-radius: 8px;
      font-weight: 600;
      cursor: pointer;
      font-size: 14px;
      transition: background 0.2s;
    }

    .btn-submit:hover {
      background: #1a4f7a;
    }

    .btn-submit:disabled {
      background: #b0bcc8;
      cursor: not-allowed;
    }

    .alert {
      padding: 12px;
      border-radius: 8px;
      margin-bottom: 15px;
      font-size: 14px;
    }

    .alert-success {
      background: #d4edda;
      color: #155724;
      border: 1px solid #c3e6cb;
    }

    .alert-error {
      background: #f8d7da;
      color: #721c24;
      border: 1px solid #f5c6cb;
    }

    .password-section {
      background: #f8fafc;
      padding: 15px;
      border-radius: 8px;
      border: 1px solid #e8eef5;
    }

    .btn-toggle-password {
      padding: 10px 15px;
      background: #e8f1f8;
      color: #0f2d4a;
      border: 1px solid #d8e3ed;
      border-radius: 6px;
      font-weight: 600;
      cursor: pointer;
      font-size: 14px;
      transition: background 0.2s;
      margin-bottom: 15px;
    }

    .btn-toggle-password:hover {
      background: #d8e3ed;
    }
  `

  if (!doctor) {
    return <div>Loading...</div>
  }

  return (
    <>
      <style>{styles}</style>
      <form className="doctor-edit-form" onSubmit={handleSubmit}>
        <h2 style={{ color: '#0f2d4a', marginBottom: '25px', fontSize: '22px' }}>Edit Doctor Profile</h2>

        {message && <div className="alert alert-success">{message}</div>}
        {error && <div className="alert alert-error">{error}</div>}

        <div className="section-title">Personal Information</div>

        <div className="form-group">
          <label>Full Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Enter your full name"
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
            />
          </div>
          <div className="form-group">
            <label>Phone</label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="Enter your phone"
            />
          </div>
        </div>

        <div className="section-divider"></div>

        <div className="section-title">Professional Information</div>

        <div className="form-row">
          <div className="form-group">
            <label>Specialization</label>
            <input
              type="text"
              name="specialization"
              value={formData.specialization}
              onChange={handleChange}
              placeholder="E.g., Cardiology"
            />
          </div>
          <div className="form-group">
            <label>Degree</label>
            <input
              type="text"
              name="degree"
              value={formData.degree}
              onChange={handleChange}
              placeholder="E.g., MD, MBBS"
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Years of Experience</label>
            <input
              type="number"
              name="yearsOfExperience"
              value={formData.yearsOfExperience}
              onChange={handleChange}
              placeholder="Enter years"
            />
          </div>
          <div className="form-group">
            <label>Consultation Fee</label>
            <input
              type="number"
              name="consultationFee"
              value={formData.consultationFee}
              onChange={handleChange}
              placeholder="Enter fee amount"
            />
          </div>
        </div>

        <div className="form-group">
          <label>Working Hours</label>
          <input
            type="text"
            name="workingHours"
            value={formData.workingHours}
            onChange={handleChange}
            placeholder="E.g., 09:00 AM - 05:00 PM"
          />
        </div>

        <div className="form-group">
          <label>Working Days</label>
          <div className="checkbox-group">
            {workingDaysOptions.map((day) => (
              <div key={day} className="checkbox-item">
                <input
                  type="checkbox"
                  id={day}
                  name="workingDays"
                  value={day}
                  checked={formData.workingDays.includes(day)}
                  onChange={handleChange}
                />
                <label htmlFor={day}>{day}</label>
              </div>
            ))}
          </div>
        </div>

        <div className="section-divider"></div>

        <button
          type="button"
          className="btn-toggle-password"
          onClick={() => setShowPasswordSection(!showPasswordSection)}
        >
          {showPasswordSection ? '▼ Hide Password Settings' : '▶ Change Password (Optional)'}
        </button>

        {showPasswordSection && (
          <div className="password-section">
            <div className="form-group">
              <label>Current Password</label>
              <input
                type="password"
                name="currentPassword"
                value={formData.currentPassword}
                onChange={handleChange}
                placeholder="Enter current password"
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>New Password</label>
                <input
                  type="password"
                  name="newPassword"
                  value={formData.newPassword}
                  onChange={handleChange}
                  placeholder="Enter new password"
                />
              </div>
              <div className="form-group">
                <label>Confirm New Password</label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Confirm new password"
                />
              </div>
            </div>
          </div>
        )}

        <div className="button-group">
          <button type="submit" className="btn-submit" disabled={isLoading || authLoading}>
            {isLoading || authLoading ? 'Updating...' : 'Update Profile'}
          </button>
        </div>
      </form>
    </>
  )
}

export default DoctorEditForm
