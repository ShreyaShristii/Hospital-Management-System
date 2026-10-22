import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { createAdmission, updateAdmission } from '../../features/admissions/admissionSlice'
import { getPatients } from '../../features/patients/patientSlice'
import { getDoctors } from '../../features/doctors/doctorSlice'
import { getAvailableBeds } from '../../features/beds/bedSlice'

function AdmissionForm({ admissionToEdit, onClose }) {
  const dispatch = useDispatch()
  const { patients } = useSelector((state) => state.patients)
  const { doctors } = useSelector((state) => state.doctors)
  const { availableBeds } = useSelector((state) => state.beds)

  const [formData, setFormData] = useState({
    patientId: '',
    doctorId: '',
    bedId: '',
    reason: '',
    status: 'Admitted',
  })

  const [error, setError] = useState('')

  useEffect(() => {
    dispatch(getPatients({ all: true }))
    dispatch(getDoctors({ all: true }))
    dispatch(getAvailableBeds())
  }, [dispatch])

  useEffect(() => {
    if (admissionToEdit) {
      setFormData({
        patientId: admissionToEdit.patientId?._id || admissionToEdit.patientId || '',
        doctorId: admissionToEdit.doctorId?._id || admissionToEdit.doctorId || '',
        bedId: admissionToEdit.bedId?._id || admissionToEdit.bedId || '',
        reason: admissionToEdit.reason || '',
        status: admissionToEdit.status || 'Admitted',
      })
    }
  }, [admissionToEdit])

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    try {
      if (admissionToEdit) {
        await dispatch(updateAdmission({
          id: admissionToEdit._id,
          data: { status: formData.status, reason: formData.reason }
        })).unwrap()
      } else {
        await dispatch(createAdmission(formData)).unwrap()
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
          {admissionToEdit ? 'Edit Admission' : 'Admit Patient'}
        </h3>

        {error && (
          <p style={{
            color: '#e74c3c', background: '#fdf0ed',
            padding: '10px', borderRadius: '4px', marginBottom: '12px'
          }}>{error}</p>
        )}

        <form onSubmit={handleSubmit}>

          {/* Patient — only when creating */}
          {!admissionToEdit && (
            <>
              <label style={labelStyle}>Patient</label>
              <select name="patientId" value={formData.patientId}
                onChange={handleChange} required style={inputStyle}>
                <option value="">Select Patient</option>
                {patients?.map(p => (
                  <option key={p._id} value={p._id}>
                    {p.userId?.name || 'Unknown'}
                  </option>
                ))}
              </select>

              <label style={labelStyle}>Doctor</label>
              <select name="doctorId" value={formData.doctorId}
                onChange={handleChange} required style={inputStyle}>
                <option value="">Select Doctor</option>
                {doctors?.map(d => (
                  <option key={d._id} value={d._id}>
                    Dr. {d.userId?.name} — {d.specialization}
                  </option>
                ))}
              </select>

              <label style={labelStyle}>Available Bed</label>
              <select name="bedId" value={formData.bedId}
                onChange={handleChange} required style={inputStyle}>
                <option value="">Select Bed</option>
                {availableBeds?.map(b => (
                  <option key={b._id} value={b._id}>
                    {b.bedNumber} — {b.ward} — {b.room}
                  </option>
                ))}
              </select>
            </>
          )}

          <label style={labelStyle}>Reason for Admission</label>
          <textarea name="reason" value={formData.reason}
            onChange={handleChange} required rows={3}
            placeholder="e.g. Post-surgery recovery, Fever observation..."
            style={{ ...inputStyle, resize: 'vertical' }} />

          {/* Status — only when editing */}
          {admissionToEdit && (
            <>
              <label style={labelStyle}>Status</label>
              <select name="status" value={formData.status}
                onChange={handleChange} style={inputStyle}>
                <option value="Admitted">Admitted</option>
                <option value="Discharged">Discharged</option>
                <option value="Transferred">Transferred</option>
              </select>
            </>
          )}

          <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
            <button type="submit" style={{
              flex: 1, padding: '10px', background: '#27ae60',
              color: 'white', border: 'none', borderRadius: '4px',
              cursor: 'pointer', fontWeight: '600'
            }}>
              {admissionToEdit ? 'Update' : 'Admit Patient'}
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

export default AdmissionForm