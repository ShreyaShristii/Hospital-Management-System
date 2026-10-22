import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { createAppointment, updateAppointment } from '../../features/appointments/appointmentSlice'
import { getDoctors } from '../../features/doctors/doctorSlice'

function AppointmentForm({ appointmentToEdit, onClose }) {
  const dispatch = useDispatch()
  const { user } = useSelector((state) => state.auth)
  const { doctors } = useSelector((state) => state.doctors)
  const { patients } = useSelector((state) => state.patients)

  const [formData, setFormData] = useState({
    patientId: '',
    doctorId: '',
    appointmentDate: '',
    appointmentTime: '',
    reason: '',
    status: 'Scheduled',
  })

  useEffect(() => {
    dispatch(getDoctors({ all: true }))
  }, [dispatch])

  useEffect(() => {
    if (appointmentToEdit) {
      setFormData({
        patientId: appointmentToEdit.patientId?._id || appointmentToEdit.patientId || '',
        doctorId: appointmentToEdit.doctorId?._id || appointmentToEdit.doctorId || '',
        appointmentDate: appointmentToEdit.appointmentDate?.split('T')[0] || '',
        appointmentTime: appointmentToEdit.appointmentTime || '',
        reason: appointmentToEdit.reason || '',
        status: appointmentToEdit.status || 'Scheduled',
      })
    }
  }, [appointmentToEdit])

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (appointmentToEdit) {
      if (user?.role === 'doctor') {
        dispatch(updateAppointment({
          id: appointmentToEdit._id,
          updatedData: { status: formData.status }
        }))
      } else {
        dispatch(updateAppointment({
          id: appointmentToEdit._id,
          updatedData: formData
        }))
      }
    } else {
      const data = user?.role === 'patient'
        ? { doctorId: formData.doctorId, appointmentDate: formData.appointmentDate, appointmentTime: formData.appointmentTime, reason: formData.reason }
        : formData
      dispatch(createAppointment(data))
    }
    onClose()
  }

  const inputStyle = {
    width: '100%', padding: '8px',
    border: '1px solid #bdc3c7',
    borderRadius: '4px', boxSizing: 'border-box',
    marginBottom: '12px', fontSize: '14px'
  }

  const labelStyle = {
    display: 'block', marginBottom: '4px',
    color: '#2c3e50', fontWeight: '500', fontSize: '14px'
  }

  // Doctor only sees status update
  if (user?.role === 'doctor' && appointmentToEdit) {
    return (
      <div style={{
        position: 'fixed', top: 0, left: 0,
        width: '100%', height: '100%',
        background: 'rgba(0,0,0,0.5)',
        display: 'flex', justifyContent: 'center', alignItems: 'center',
        zIndex: 1000
      }}>
        <div style={{
          background: 'white', padding: '30px',
          borderRadius: '8px', width: '400px'
        }}>
          <h3 style={{ color: '#2c3e50', marginBottom: '20px' }}>Update Appointment Status</h3>
          <p style={{ color: '#7f8c8d', marginBottom: '16px' }}>
            Patient: {appointmentToEdit.patientId?.userId?.name || 'N/A'}<br />
            Date: {new Date(appointmentToEdit.appointmentDate).toLocaleDateString('en-IN')}<br />
            Time: {appointmentToEdit.appointmentTime}
          </p>
          <form onSubmit={handleSubmit}>
            <label style={labelStyle}>Status</label>
            <select name="status" value={formData.status}
              onChange={handleChange} style={inputStyle}>
              <option value="Scheduled">Scheduled</option>
              <option value="Completed">Completed</option>
              <option value="Cancelled">Cancelled</option>
              <option value="No Show">No Show</option>
            </select>
            <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
              <button type="submit" style={{
                flex: 1, padding: '10px', background: '#27ae60',
                color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer'
              }}>Update</button>
              <button type="button" onClick={onClose} style={{
                flex: 1, padding: '10px', background: '#e74c3c',
                color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer'
              }}>Cancel</button>
            </div>
          </form>
        </div>
      </div>
    )
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
          {appointmentToEdit ? 'Edit Appointment' : 'Book Appointment'}
        </h3>

        <form onSubmit={handleSubmit}>

          {(user?.role === 'admin' || user?.role === 'receptionist') && (
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
            </>
          )}

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

          <label style={labelStyle}>Appointment Date</label>
          <input type="date" name="appointmentDate"
            value={formData.appointmentDate}
            onChange={handleChange} required style={inputStyle}
            min={new Date().toISOString().split('T')[0]}
          />

          <label style={labelStyle}>Appointment Time</label>
          <select name="appointmentTime" value={formData.appointmentTime}
            onChange={handleChange} required style={inputStyle}>
            <option value="">Select Time</option>
            {['09:00 AM','09:30 AM','10:00 AM','10:30 AM','11:00 AM','11:30 AM',
              '12:00 PM','12:30 PM','02:00 PM','02:30 PM','03:00 PM','03:30 PM',
              '04:00 PM','04:30 PM','05:00 PM'].map(t => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>

          <label style={labelStyle}>Reason for Visit</label>
          <input type="text" name="reason" value={formData.reason}
            onChange={handleChange} required style={inputStyle}
            placeholder="e.g. Fever, Checkup, Follow-up" />

          {appointmentToEdit && (user?.role === 'admin' || user?.role === 'receptionist') && (
            <>
              <label style={labelStyle}>Status</label>
              <select name="status" value={formData.status}
                onChange={handleChange} style={inputStyle}>
                <option value="Scheduled">Scheduled</option>
                <option value="Completed">Completed</option>
                <option value="Cancelled">Cancelled</option>
                <option value="No Show">No Show</option>
              </select>
            </>
          )}

          <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
            <button type="submit" style={{
              flex: 1, padding: '10px', background: '#27ae60',
              color: 'white', border: 'none', borderRadius: '4px',
              cursor: 'pointer', fontWeight: '600'
            }}>
              {appointmentToEdit ? 'Update' : 'Book Appointment'}
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

export default AppointmentForm