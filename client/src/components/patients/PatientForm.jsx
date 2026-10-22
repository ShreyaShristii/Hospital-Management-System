import { useState, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { createPatient, updatePatient } from '../../features/patients/patientSlice'

function PatientForm({ patientToEdit, onClose }) {
  const dispatch = useDispatch()

  const [formData, setFormData] = useState({
    userEmail: '',
    age: '',
    gender: '',
    bloodGroup: '',
    allergies: '',
    address: '',
    contactNumber: '',
    emergencyContact: '',
    currentHealthStatus: '',
  })

  useEffect(() => {
    if (patientToEdit) {
      setFormData({
        userEmail: '',
        age: patientToEdit.age || '',
        gender: patientToEdit.gender || '',
        bloodGroup: patientToEdit.bloodGroup || '',
        allergies: patientToEdit.allergies || '',
        address: patientToEdit.address || '',
        contactNumber: patientToEdit.contactNumber || '',
        emergencyContact: patientToEdit.emergencyContact || '',
        currentHealthStatus: patientToEdit.currentHealthStatus || '',
      })
    }
  }, [patientToEdit])

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const payload = {
      age: formData.age,
      gender: formData.gender,
      bloodGroup: formData.bloodGroup,
      allergies: formData.allergies,
      address: formData.address,
      contactNumber: formData.contactNumber,
      emergencyContact: formData.emergencyContact,
      currentHealthStatus: formData.currentHealthStatus,
    }

    if (patientToEdit) {
      dispatch(updatePatient({ id: patientToEdit._id, data: payload }))
    } else {
      dispatch(createPatient({ ...payload, userEmail: formData.userEmail }))
    }
    onClose()
  }

  const inputStyle = {
    width: '100%',
    padding: '8px',
    border: '1px solid #bdc3c7',
    borderRadius: '4px',
    boxSizing: 'border-box',
    marginBottom: '12px'
  }

  const labelStyle = {
    display: 'block',
    marginBottom: '4px',
    color: '#2c3e50',
    fontWeight: '500'
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
        maxHeight: '85vh', overflowY: 'auto'
      }}>
        <h3 style={{ color: '#2c3e50', marginBottom: '20px' }}>
          {patientToEdit ? 'Edit Patient' : 'Add Patient'}
        </h3>

        <form onSubmit={handleSubmit}>

          {!patientToEdit && (
            <>
              <label style={labelStyle}>Patient Email</label>
              <input
                type="email"
                name="userEmail"
                value={formData.userEmail}
                onChange={handleChange}
                placeholder="Enter registered patient email"
                required
                style={inputStyle}
              />
            </>
          )}

          {/* Age */}
          <label style={labelStyle}>Age</label>
          <input
            type="number"
            name="age"
            value={formData.age}
            onChange={handleChange}
            required
            style={inputStyle}
          />

          {/* Gender */}
          <label style={labelStyle}>Gender</label>
          <select
            name="gender"
            value={formData.gender}
            onChange={handleChange}
            required
            style={inputStyle}>
            <option value="">Select Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>

          {/* Blood Group */}
          <label style={labelStyle}>Blood Group</label>
          <select
            name="bloodGroup"
            value={formData.bloodGroup}
            onChange={handleChange}
            style={inputStyle}>
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

          {/* Allergies */}
          <label style={labelStyle}>Allergies</label>
          <input
            type="text"
            name="allergies"
            value={formData.allergies}
            onChange={handleChange}
            placeholder="None or list allergies"
            style={inputStyle}
          />

          {/* Address */}
          <label style={labelStyle}>Address</label>
          <input
            type="text"
            name="address"
            value={formData.address}
            onChange={handleChange}
            style={inputStyle}
          />

          {/* Contact Number */}
          <label style={labelStyle}>Contact Number</label>
          <input
            type="text"
            name="contactNumber"
            value={formData.contactNumber}
            onChange={handleChange}
            required
            style={inputStyle}
          />

          {/* Emergency Contact */}
          <label style={labelStyle}>Emergency Contact</label>
          <input
            type="text"
            name="emergencyContact"
            value={formData.emergencyContact}
            onChange={handleChange}
            required
            style={inputStyle}
          />

          {/* Current Health Status */}
          <label style={labelStyle}>Current Health Status</label>
          <select
            name="currentHealthStatus"
            value={formData.currentHealthStatus}
            onChange={handleChange}
            style={inputStyle}>
            <option value="">Select Status</option>
            <option value="Good">Good</option>
            <option value="Fair">Fair</option>
            <option value="Critical">Critical</option>
            <option value="Stable">Stable</option>
            <option value="Under Observation">Under Observation</option>
          </select>

          {/* Buttons */}
          <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
            <button type="submit" style={{
              flex: 1, padding: '10px',
              background: '#27ae60', color: 'white',
              border: 'none', borderRadius: '4px', cursor: 'pointer',
              fontWeight: '600'
            }}>
              {patientToEdit ? 'Update Patient' : 'Add Patient'}
            </button>
            <button type="button" onClick={onClose} style={{
              flex: 1, padding: '10px',
              background: '#e74c3c', color: 'white',
              border: 'none', borderRadius: '4px', cursor: 'pointer',
              fontWeight: '600'
            }}>
              Cancel
            </button>
          </div>

        </form>
      </div>
    </div>
  )
}

export default PatientForm