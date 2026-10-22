import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { createDepartment, updateDepartment } from '../../features/departments/departmentSlice'
import { getDoctors } from '../../features/doctors/doctorSlice'

function DepartmentForm({ departmentToEdit, onClose }) {
  const dispatch = useDispatch()
  const { doctors } = useSelector((state) => state.doctors)

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    location: '',
    totalStaff: 0,
    headDoctorId: '',
  })

  const [error, setError] = useState('')

  useEffect(() => {
    dispatch(getDoctors({ all: true }))
  }, [dispatch])

  useEffect(() => {
    if (departmentToEdit) {
      setFormData({
        name: departmentToEdit.name || '',
        description: departmentToEdit.description || '',
        location: departmentToEdit.location || '',
        totalStaff: departmentToEdit.totalStaff || 0,
        headDoctorId: departmentToEdit.headDoctorId?._id || '',
      })
    }
  }, [departmentToEdit])

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    try {
      if (departmentToEdit) {
        await dispatch(updateDepartment({
          id: departmentToEdit._id,
          data: formData
        })).unwrap()
      } else {
        await dispatch(createDepartment(formData)).unwrap()
      }
      onClose()
    } catch (err) {
      setError(err || 'Something went wrong')
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
        borderRadius: '8px', width: '100%', maxWidth: '500px',
        maxHeight: '90vh', overflowY: 'auto'
      }}>
        <h3 style={{ color: '#2c3e50', marginBottom: '20px' }}>
          {departmentToEdit ? 'Edit Department' : 'Add Department'}
        </h3>

        {error && (
          <p style={{
            color: '#e74c3c', background: '#fdf0ed',
            padding: '10px', borderRadius: '4px', marginBottom: '12px'
          }}>{error}</p>
        )}

        <form onSubmit={handleSubmit}>

          <label style={labelStyle}>Department Name</label>
          <select name="name" value={formData.name}
            onChange={handleChange} required style={inputStyle}>
            <option value="">Select Department</option>
            {[
              'Cardiology', 'Neurology', 'Orthopedics', 'Pediatrics',
              'Dermatology', 'Gynecology', 'Oncology', 'Psychiatry',
              'Radiology', 'General Medicine', 'ENT', 'Ophthalmology',
              'Emergency', 'ICU', 'Pharmacy', 'Laboratory',
              'Physiotherapy', 'Dental', 'Urology', 'Nephrology'
            ].map(d => <option key={d} value={d}>{d}</option>)}
          </select>

          <label style={labelStyle}>Description</label>
          <textarea name="description" value={formData.description}
            onChange={handleChange} required rows={3}
            placeholder="Brief description of this department..."
            style={{ ...inputStyle, resize: 'vertical' }} />

          <label style={labelStyle}>Location / Floor</label>
          <input type="text" name="location" value={formData.location}
            onChange={handleChange} required style={inputStyle}
            placeholder="e.g. Floor 2, Wing A" />

          <label style={labelStyle}>Total Staff</label>
          <input type="number" name="totalStaff" value={formData.totalStaff}
            onChange={handleChange} min="0" style={inputStyle} />

          <label style={labelStyle}>Head Doctor (optional)</label>
          <select name="headDoctorId" value={formData.headDoctorId}
            onChange={handleChange} style={inputStyle}>
            <option value="">Select Head Doctor</option>
            {doctors?.map(d => (
              <option key={d._id} value={d._id}>
                Dr. {d.userId?.name} — {d.specialization}
              </option>
            ))}
          </select>

          <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
            <button type="submit" style={{
              flex: 1, padding: '10px', background: '#27ae60',
              color: 'white', border: 'none', borderRadius: '4px',
              cursor: 'pointer', fontWeight: '600'
            }}>
              {departmentToEdit ? 'Update Department' : 'Add Department'}
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

export default DepartmentForm