import { useState, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { createDoctor, updateDoctor } from '../../features/doctors/doctorSlice'

function DoctorForm({ doctorToEdit, onClose }) {
  const dispatch = useDispatch()

  const [formData, setFormData] = useState({
    name: '',
    username: '',
    email: '',
    password: '',
    phone: '',
    specialization: '',
    degree: '',
    yearsOfExperience: '',
    successRate: '',
    workingDays: [],
    workingHours: '',
    consultationFee: '',
  })

  useEffect(() => {
    if (doctorToEdit) {
      setFormData({
        name: doctorToEdit.userId?.name || '',
        username: doctorToEdit.userId?.username || '',
        email: doctorToEdit.userId?.email || '',
        password: '',
        phone: doctorToEdit.userId?.phone || '',
        specialization: doctorToEdit.specialization || '',
        degree: doctorToEdit.degree || '',
        yearsOfExperience: doctorToEdit.yearsOfExperience || '',
        successRate: doctorToEdit.successRate || '',
        workingDays: doctorToEdit.workingDays || [],
        workingHours: doctorToEdit.workingHours || '',
        consultationFee: doctorToEdit.consultationFee || '',
      })
    }
  }, [doctorToEdit])

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

  const handleSubmit = (e) => {
    e.preventDefault()
    if (doctorToEdit) {
      dispatch(updateDoctor({ id: doctorToEdit._id, data: formData }))
    } else {
      dispatch(createDoctor(formData))
    }
    onClose()
  }

  const inputStyle = {
    width: '100%', padding: '8px',
    border: '1px solid #bdc3c7',
    borderRadius: '4px', boxSizing: 'border-box',
    marginBottom: '12px'
  }

  const labelStyle = {
    display: 'block', marginBottom: '4px',
    color: '#2c3e50', fontWeight: '500'
  }

  const sectionStyle = {
    borderBottom: '2px solid #ecf0f1',
    paddingBottom: '16px',
    marginBottom: '16px'
  }

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0,
      width: '100%', height: '100%',
      background: 'rgba(0,0,0,0.5)',
      display: 'flex', justifyContent: 'center', alignItems: 'center',
      zIndex: 1000,
      padding: '10px'
    }}>
      <div style={{
        background: 'white', padding: '30px',
        borderRadius: '8px', width: '100%', maxWidth: '520px',
        maxHeight: '85vh', overflowY: 'auto'
      }}>
        <h3 style={{ color: '#2c3e50', marginBottom: '20px' }}>
          {doctorToEdit ? 'Edit Doctor' : 'Add Doctor'}
        </h3>

        <form onSubmit={handleSubmit}>

          {/* Account Details — only show when adding new doctor */}
          {!doctorToEdit && (
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
                onChange={handleChange} style={inputStyle} />

              <label style={labelStyle}>Password</label>
              <input type="password" name="password" value={formData.password}
                onChange={handleChange} required style={inputStyle} />
            </div>
          )}

          {/* Professional Details */}
          <div style={sectionStyle}>
            <h4 style={{ color: '#2c3e50', marginBottom: '12px' }}>Professional Details</h4>

            <label style={labelStyle}>Specialization</label>
            <select name="specialization" value={formData.specialization}
              onChange={handleChange} required style={inputStyle}>
              <option value="">Select Specialization</option>
              {['Cardiology', 'Neurology', 'Orthopedics', 'Pediatrics',
                'Dermatology', 'Gynecology', 'Oncology', 'Psychiatry',
                'Radiology', 'General Medicine', 'ENT', 'Ophthalmology'].map(s => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>

            <label style={labelStyle}>Degree</label>
            <input type="text" name="degree" value={formData.degree}
              onChange={handleChange} required style={inputStyle}
              placeholder="e.g. MBBS, MD" />

            <label style={labelStyle}>Years of Experience</label>
            <input type="number" name="yearsOfExperience" value={formData.yearsOfExperience}
              onChange={handleChange} required style={inputStyle} />

            <label style={labelStyle}>Success Rate (%)</label>
            <input type="number" name="successRate" value={formData.successRate}
              onChange={handleChange} style={inputStyle} />

            <label style={labelStyle}>Working Hours</label>
            <input type="text" name="workingHours" value={formData.workingHours}
              onChange={handleChange} placeholder="e.g. 9AM - 5PM" style={inputStyle} />

            <label style={labelStyle}>Consultation Fee (₹)</label>
            <input type="number" name="consultationFee" value={formData.consultationFee}
              onChange={handleChange} required style={inputStyle} />

            <label style={labelStyle}>Working Days</label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '12px' }}>
              {days.map(day => (
                <label key={day} style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <input
                    type="checkbox"
                    value={day}
                    checked={formData.workingDays.includes(day)}
                    onChange={handleDaysChange}
                  />
                  {day.slice(0, 3)}
                </label>
              ))}
            </div>
          </div>

          <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
            <button type="submit" style={{
              flex: 1, padding: '10px',
              background: '#27ae60', color: 'white',
              border: 'none', borderRadius: '4px',
              cursor: 'pointer', fontWeight: '600'
            }}>
              {doctorToEdit ? 'Update Doctor' : 'Add Doctor'}
            </button>
            <button type="button" onClick={onClose} style={{
              flex: 1, padding: '10px',
              background: '#e74c3c', color: 'white',
              border: 'none', borderRadius: '4px',
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

export default DoctorForm