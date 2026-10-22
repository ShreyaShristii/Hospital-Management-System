import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { updateUserProfile } from '../../features/auth/authSlice'
import { updatePatient, getPatients } from '../../features/patients/patientSlice'

function PatientEditForm({ patientId }) {
  const dispatch = useDispatch()
  const { user, isLoading: authLoading } = useSelector((state) => state.auth)
  const { patients } = useSelector((state) => state.patients)
  
  const patient = patients?.find((p) => p._id === patientId)
  
  const [formData, setFormData] = useState({
    // User fields
    name: '',
    email: '',
    phone: '',
    // Patient specific fields
    age: '',
    gender: '',
    bloodGroup: '',
    allergies: '',
    address: '',
    contactNumber: '',
    emergencyContact: '',
    currentHealthStatus: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  })

  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [showPasswordSection, setShowPasswordSection] = useState(false)

  useEffect(() => {
    if (user && patient) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        age: patient.age || '',
        gender: patient.gender || '',
        bloodGroup: patient.bloodGroup || '',
        allergies: patient.allergies || '',
        address: patient.address || '',
        contactNumber: patient.contactNumber || '',
        emergencyContact: patient.emergencyContact || '',
        currentHealthStatus: patient.currentHealthStatus || '',
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      })
    }
  }, [user, patient])

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
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

      // Update patient profile
      const patientSubmitData = {
        age: formData.age,
        gender: formData.gender,
        bloodGroup: formData.bloodGroup,
        allergies: formData.allergies,
        address: formData.address,
        contactNumber: formData.contactNumber,
        emergencyContact: formData.emergencyContact,
        currentHealthStatus: formData.currentHealthStatus,
      }

      await dispatch(updatePatient({ id: patientId, data: patientSubmitData })).unwrap()

      // Refetch patient data to ensure persistence
      await dispatch(getPatients({ all: true }))

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

  const styles = `
    .patient-edit-form {
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
    .form-group textarea,
    .form-group select {
      width: 100%;
      padding: 12px;
      border: 1.5px solid #d8e3ed;
      border-radius: 8px;
      font-size: 14px;
      font-family: inherit;
      box-sizing: border-box;
    }

    .form-group input:focus,
    .form-group textarea:focus,
    .form-group select:focus {
      outline: none;
      border-color: #0f2d4a;
      background: #f8fafc;
    }

    .form-row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 15px;
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

  if (!patient) {
    return <div>Loading...</div>
  }

  return (
    <>
      <style>{styles}</style>
      <form className="patient-edit-form" onSubmit={handleSubmit}>
        <h2 style={{ color: '#0f2d4a', marginBottom: '25px', fontSize: '22px' }}>Edit Patient Profile</h2>

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

        <div className="section-title">Health Information</div>

        <div className="form-row">
          <div className="form-group">
            <label>Age</label>
            <input
              type="number"
              name="age"
              value={formData.age}
              onChange={handleChange}
              placeholder="Enter your age"
            />
          </div>
          <div className="form-group">
            <label>Gender</label>
            <select name="gender" value={formData.gender} onChange={handleChange}>
              <option value="">Select gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Blood Group</label>
            <select name="bloodGroup" value={formData.bloodGroup} onChange={handleChange}>
              <option value="">Select blood group</option>
              <option value="A+">A+</option>
              <option value="A-">A-</option>
              <option value="B+">B+</option>
              <option value="B-">B-</option>
              <option value="AB+">AB+</option>
              <option value="AB-">AB-</option>
              <option value="O+">O+</option>
              <option value="O-">O-</option>
            </select>
          </div>
          <div className="form-group">
            <label>Health Status</label>
            <input
              type="text"
              name="currentHealthStatus"
              value={formData.currentHealthStatus}
              onChange={handleChange}
              placeholder="E.g., Healthy, Fair, Poor"
            />
          </div>
        </div>

        <div className="form-group">
          <label>Allergies</label>
          <textarea
            name="allergies"
            value={formData.allergies}
            onChange={handleChange}
            placeholder="List any allergies"
            rows="3"
          ></textarea>
        </div>

        <div className="section-divider"></div>

        <div className="section-title">Contact Information</div>

        <div className="form-group">
          <label>Address</label>
          <textarea
            name="address"
            value={formData.address}
            onChange={handleChange}
            placeholder="Enter your address"
            rows="3"
          ></textarea>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Contact Number</label>
            <input
              type="tel"
              name="contactNumber"
              value={formData.contactNumber}
              onChange={handleChange}
              placeholder="Enter contact number"
            />
          </div>
          <div className="form-group">
            <label>Emergency Contact</label>
            <input
              type="tel"
              name="emergencyContact"
              value={formData.emergencyContact}
              onChange={handleChange}
              placeholder="Enter emergency contact"
            />
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

export default PatientEditForm
