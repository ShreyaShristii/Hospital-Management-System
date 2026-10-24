import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { createDoctor } from '../../features/doctors/doctorSlice'
import { createStaff } from '../../features/staff/staffSlice'
import { getDepartments } from '../../features/departments/departmentSlice'
import axios from 'axios'
import { API_BASE } from '../../utils/apiBase'

const API = API_BASE

function AddStaffForm({ onClose }) {
  const dispatch = useDispatch()
  const { departments } = useSelector((state) => state.departments)

  const [role, setRole] = useState('doctor')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const [formData, setFormData] = useState({
    name: '', username: '', email: '', password: '', phone: '',
    specialization: '', degree: '', yearsOfExperience: '',
    successRate: '', workingDays: [], workingHours: '', consultationFee: '',
    shift: '', departmentId: '',
  })

  useEffect(() => {
    dispatch(getDepartments({ all: true }))
  }, [dispatch])

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleDaysChange = (e) => {
    const val = e.target.value
    const days = formData.workingDays.includes(val)
      ? formData.workingDays.filter(d => d !== val)
      : [...formData.workingDays, val]
    setFormData({ ...formData, workingDays: days })
  }

  // Maps form role value → Staff model position enum value
  const roleToPosition = {
    nurse: 'Nurse',
    receptionist: 'Receptionist',
    lab_staff: 'Lab_Staff',
    pharmacist: 'Pharmacist',
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    setIsLoading(true)

    try {
      if (role === 'doctor') {
        await dispatch(createDoctor({
          name: formData.name,
          username: formData.username,
          email: formData.email,
          password: formData.password,
          phone: formData.phone,
          specialization: formData.specialization,
          degree: formData.degree,
          yearsOfExperience: formData.yearsOfExperience,
          successRate: formData.successRate,
          workingDays: formData.workingDays,
          workingHours: formData.workingHours,
          consultationFee: formData.consultationFee,
          departmentId: formData.departmentId,
        })).unwrap()

      } else {
        const userRes = await axios.post(`${API}/auth/staff-accounts`, {
          name: formData.name,
          username: formData.username,
          email: formData.email,
          password: formData.password,
          phone: formData.phone,
          role,
        })

        const userId = userRes.data.userId

        await dispatch(createStaff({
          userId,
          position: roleToPosition[role],   // e.g. 'Nurse', 'Receptionist'
          contactNumber: formData.phone,     // required field in Staff model
          department: formData.departmentId,
          ...(formData.shift && { shift: formData.shift }),
        })).unwrap()
      }

      setSuccess(
        `${role.charAt(0).toUpperCase() + role.slice(1)} added successfully! ` +
        `Credentials — Email: ${formData.email} | Password: ${formData.password}`
      )
      setFormData({
        name: '', username: '', email: '', password: '', phone: '',
        specialization: '', degree: '', yearsOfExperience: '',
        successRate: '', workingDays: [], workingHours: '', consultationFee: '',
        shift: '', departmentId: '',
      })

    } catch (err) {
      setError(typeof err === 'string' ? err : err?.message || 'Something went wrong')
    } finally {
      setIsLoading(false)
    }
  }

  const inputStyle = {
    width: '100%', padding: '8px',
    border: '1px solid #bdc3c7', borderRadius: '4px',
    boxSizing: 'border-box', marginBottom: '12px', fontSize: '14px'
  }
  const labelStyle = {
    display: 'block', marginBottom: '4px',
    color: '#2c3e50', fontWeight: '500', fontSize: '14px'
  }
  const sectionStyle = {
    borderBottom: '2px solid #ecf0f1', paddingBottom: '16px', marginBottom: '16px'
  }

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
      background: 'rgba(0,0,0,0.5)', display: 'flex',
      justifyContent: 'center', alignItems: 'center', zIndex: 1000,
      padding: '10px'
    }}>
      <div style={{
        background: 'white', padding: '30px', borderRadius: '8px',
        width: '100%', maxWidth: '540px', maxHeight: '90vh', overflowY: 'auto'
      }}>
        <h3 style={{ color: '#2c3e50', marginBottom: '20px' }}>Add Staff Member</h3>

        {error && (
          <p style={{
            color: '#e74c3c', background: '#fdf0ed',
            padding: '10px', borderRadius: '4px', marginBottom: '12px'
          }}>{error}</p>
        )}

        {success && (
          <p style={{
            color: '#27ae60', background: '#eafaf1',
            padding: '10px', borderRadius: '4px', marginBottom: '12px'
          }}>{success}</p>
        )}

        <form onSubmit={handleSubmit}>

          {/* Role */}
          <div style={sectionStyle}>
            <label style={labelStyle}>Role</label>
            <select value={role} onChange={(e) => setRole(e.target.value)} style={inputStyle}>
              <option value="doctor">Doctor</option>
              <option value="nurse">Nurse</option>
              <option value="receptionist">Receptionist</option>
              <option value="lab_staff">Lab Staff</option>
              <option value="pharmacist">Pharmacist</option>
            </select>
          </div>

          {/* Account Details */}
          <div style={sectionStyle}>
            <h4 style={{ color: '#2c3e50', marginBottom: '12px' }}>Account Details</h4>

            <label style={labelStyle}>Full Name</label>
            <input type="text" name="name" value={formData.name}
              onChange={handleChange} required style={inputStyle} />

            <label style={labelStyle}>Username</label>
            <input type="text" name="username" value={formData.username}
              onChange={handleChange} required style={inputStyle} />

            <label style={labelStyle}>Email</label>
            <input type="email" name="email" value={formData.email}
              onChange={handleChange} required style={inputStyle} />

            <label style={labelStyle}>Phone</label>
            <input type="text" name="phone" value={formData.phone}
              onChange={handleChange} required style={inputStyle} />

            <label style={labelStyle}>Password</label>
            <input type="password" name="password" value={formData.password}
              onChange={handleChange} required style={inputStyle} />
          </div>

          {/* Doctor Fields */}
          {role === 'doctor' && (
            <div style={sectionStyle}>
              <h4 style={{ color: '#2c3e50', marginBottom: '12px' }}>Professional Details</h4>

              <label style={labelStyle}>Specialization</label>
              <select name="specialization" value={formData.specialization}
                onChange={handleChange} required style={inputStyle}>
                <option value="">Select Specialization</option>
                {['Cardiology', 'Neurology', 'Orthopedics', 'Pediatrics', 'Dermatology',
                  'Gynecology', 'Oncology', 'Psychiatry', 'Radiology',
                  'General Medicine', 'ENT', 'Ophthalmology'].map(s => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>

              <label style={labelStyle}>Degree</label>
              <input type="text" name="degree" value={formData.degree}
                onChange={handleChange} required placeholder="e.g. MBBS, MD" style={inputStyle} />

              <label style={labelStyle}>Years of Experience</label>
              <input type="number" name="yearsOfExperience" value={formData.yearsOfExperience}
                onChange={handleChange} required min="0" style={inputStyle} />

              <label style={labelStyle}>Success Rate (%)</label>
              <input type="number" name="successRate" value={formData.successRate}
                onChange={handleChange} min="0" max="100" style={inputStyle} />

              <label style={labelStyle}>Working Hours</label>
              <input type="text" name="workingHours" value={formData.workingHours}
                onChange={handleChange} placeholder="e.g. 9AM - 5PM" style={inputStyle} />

              <label style={labelStyle}>Consultation Fee (₹)</label>
              <input type="number" name="consultationFee" value={formData.consultationFee}
                onChange={handleChange} required min="0" style={inputStyle} />

              <label style={labelStyle}>Working Days</label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '12px' }}>
                {days.map(day => (
                  <label key={day} style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '13px' }}>
                    <input type="checkbox" value={day}
                      checked={formData.workingDays.includes(day)}
                      onChange={handleDaysChange} />
                    {day.slice(0, 3)}
                  </label>
                ))}
              </div>

              <label style={labelStyle}>Department</label>
              <select name="departmentId" value={formData.departmentId}
                onChange={handleChange} style={inputStyle}>
                <option value="">Select Department</option>
                {departments?.map(dept => (
                  <option key={dept._id} value={dept._id}>{dept.name}</option>
                ))}
              </select>
            </div>
          )}

          {/* Non-Doctor Staff Fields */}
          {role !== 'doctor' && (
            <div style={sectionStyle}>
              <h4 style={{ color: '#2c3e50', marginBottom: '12px' }}>Work Details</h4>

              <label style={labelStyle}>Shift</label>
              <select name="shift" value={formData.shift}
                onChange={handleChange} style={inputStyle}>
                <option value="">Select Shift</option>
                <option value="Morning">Morning</option>
                <option value="Afternoon">Afternoon</option>
                <option value="Night">Night</option>
              </select>

              <label style={labelStyle}>Department</label>
              <select name="departmentId" value={formData.departmentId}
                onChange={handleChange} style={inputStyle}>
                <option value="">Select Department</option>
                {departments?.map(dept => (
                  <option key={dept._id} value={dept._id}>{dept.name}</option>
                ))}
              </select>
            </div>
          )}

          <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
            <button type="submit" disabled={isLoading} style={{
              flex: 1, padding: '10px', background: isLoading ? '#95a5a6' : '#27ae60',
              color: 'white', border: 'none', borderRadius: '4px',
              cursor: isLoading ? 'not-allowed' : 'pointer', fontWeight: '600'
            }}>
              {isLoading ? 'Adding...' : 'Add Staff'}
            </button>
            <button type="button" onClick={onClose} style={{
              flex: 1, padding: '10px', background: '#e74c3c',
              color: 'white', border: 'none', borderRadius: '4px',
              cursor: 'pointer', fontWeight: '600'
            }}>
              Cancel
            </button>
          </div>

        </form>
      </div>
    </div>
  )
}

export default AddStaffForm