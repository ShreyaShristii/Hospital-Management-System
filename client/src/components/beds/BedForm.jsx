import { useState, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { createBed, updateBed } from '../../features/beds/bedSlice'

function BedForm({ bedToEdit, onClose }) {
  const dispatch = useDispatch()

  const [formData, setFormData] = useState({
    bedNumber: '',
    ward: '',
    room: '',
    status: 'Available',
  })

  useEffect(() => {
    if (bedToEdit) {
      setFormData({
        bedNumber: bedToEdit.bedNumber || '',
        ward: bedToEdit.ward || '',
        room: bedToEdit.room || '',
        status: bedToEdit.status || 'Available',
      })
    }
  }, [bedToEdit])

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (bedToEdit) {
      dispatch(updateBed({ id: bedToEdit._id, data: formData }))
    } else {
      dispatch(createBed(formData))
    }
    onClose()
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
        borderRadius: '8px', width: '100%', maxWidth: '440px'
      }}>
        <h3 style={{ color: '#2c3e50', marginBottom: '20px' }}>
          {bedToEdit ? 'Edit Bed' : 'Add Bed'}
        </h3>

        <form onSubmit={handleSubmit}>

          <label style={labelStyle}>Bed Number</label>
          <input type="text" name="bedNumber" value={formData.bedNumber}
            onChange={handleChange} required style={inputStyle}
            placeholder="e.g. B-101" />

          <label style={labelStyle}>Ward</label>
          <select name="ward" value={formData.ward}
            onChange={handleChange} required style={inputStyle}>
            <option value="">Select Ward</option>
            {['General', 'ICU', 'Emergency', 'Pediatric',
              'Maternity', 'Surgical', 'Orthopedic',
              'Cardiac', 'Oncology', 'Psychiatric'].map(w => (
              <option key={w} value={w}>{w}</option>
            ))}
          </select>

          <label style={labelStyle}>Room</label>
          <input type="text" name="room" value={formData.room}
            onChange={handleChange} required style={inputStyle}
            placeholder="e.g. Room 101" />

          <label style={labelStyle}>Status</label>
          <select name="status" value={formData.status}
            onChange={handleChange} style={inputStyle}>
            <option value="Available">Available</option>
            <option value="Occupied">Occupied</option>
          </select>

          <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
            <button type="submit" style={{
              flex: 1, padding: '10px', background: '#27ae60',
              color: 'white', border: 'none', borderRadius: '4px',
              cursor: 'pointer', fontWeight: '600'
            }}>
              {bedToEdit ? 'Update Bed' : 'Add Bed'}
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

export default BedForm