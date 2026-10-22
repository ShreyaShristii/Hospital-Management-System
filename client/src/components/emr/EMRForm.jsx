import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { createEMR, updateEMR } from '../../features/emr/emrSlice'
import { getPatients } from '../../features/patients/patientSlice'
import { getDoctors } from '../../features/doctors/doctorSlice'

function EMRForm({ emrToEdit, onClose }) {
  const dispatch = useDispatch()
  const { patients } = useSelector((state) => state.patients)
  const { doctors } = useSelector((state) => state.doctors)
  const { user } = useSelector((state) => state.auth)

  const [formData, setFormData] = useState({
    doctorId: '',
    patientId: '',
    appointmentId: '',
    visitDate: new Date().toISOString().split('T')[0],
    diagnosis: '',
    symptoms: '',       // comma separated input → array on submit
    notes: '',
    followUpDate: '',
    bloodPressure: '',
    temperature: '',
    weight: '',
    heartRate: '',
  })

  const [prescription, setPrescription] = useState([
    { medicine: '', dosage: '', frequency: '', duration: '', instructions: '' }
  ])

  useEffect(() => {
    dispatch(getPatients({ all: true }))
    dispatch(getDoctors({ all: true }))
  }, [dispatch])

  useEffect(() => {
    if (emrToEdit) {
      setFormData({
        doctorId: emrToEdit.doctorId?._id || '',
        patientId: emrToEdit.patientId?._id || '',
        appointmentId: emrToEdit.appointmentId?._id || '',
        visitDate: emrToEdit.visitDate?.split('T')[0] || '',
        diagnosis: emrToEdit.diagnosis || '',
        symptoms: emrToEdit.symptoms?.join(', ') || '',
        notes: emrToEdit.notes || '',
        followUpDate: emrToEdit.followUpDate?.split('T')[0] || '',
        bloodPressure: emrToEdit.bloodPressure || '',
        temperature: emrToEdit.temperature || '',
        weight: emrToEdit.weight || '',
        heartRate: emrToEdit.heartRate || '',
      })
      setPrescription(emrToEdit.prescription?.length > 0
        ? emrToEdit.prescription
        : [{ medicine: '', dosage: '', frequency: '', duration: '', instructions: '' }]
      )
    } else if (user?.role === 'doctor' && doctors.length > 0) {
      // Auto-select current doctor if they exist in the list
      const currentDoctor = doctors.find(d => d.userId === user.id)
      if (currentDoctor) {
        setFormData(prev => ({ ...prev, doctorId: currentDoctor._id }))
      } else if (doctors.length > 0) {
        setFormData(prev => ({ ...prev, doctorId: doctors[0]._id }))
      }
    }
  }, [emrToEdit, user, doctors])

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handlePrescriptionChange = (index, field, value) => {
    const updated = [...prescription]
    updated[index][field] = value
    setPrescription(updated)
  }

  const addMedicine = () => {
    setPrescription([...prescription, { medicine: '', dosage: '', frequency: '', duration: '', instructions: '' }])
  }

  const removeMedicine = (index) => {
    setPrescription(prescription.filter((_, i) => i !== index))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const payload = {
      ...formData,
      symptoms: formData.symptoms.split(',').map(s => s.trim()).filter(Boolean),
      prescription: prescription.filter(p => p.medicine),
    }
    if (emrToEdit) {
      dispatch(updateEMR({ id: emrToEdit._id, data: payload }))
    } else {
      dispatch(createEMR(payload))
    }
    onClose()
  }

  const input = {
    width: '100%', padding: '8px', border: '1px solid #bdc3c7',
    borderRadius: '4px', boxSizing: 'border-box',
    marginBottom: '12px', fontSize: '14px'
  }
  const label = {
    display: 'block', marginBottom: '4px',
    color: '#2c3e50', fontWeight: '500', fontSize: '14px'
  }
  const section = {
    background: '#f8f9fa', padding: '16px',
    borderRadius: '6px', marginBottom: '16px'
  }

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
      background: 'rgba(0,0,0,0.5)', display: 'flex',
      justifyContent: 'center', alignItems: 'center', zIndex: 1000
    }}>
      <div style={{
        background: 'white', padding: '30px', borderRadius: '8px',
        width: '680px', maxHeight: '90vh', overflowY: 'auto'
      }}>
        <h3 style={{ color: '#2c3e50', marginBottom: '20px' }}>
          {emrToEdit ? 'Edit Medical Record' : 'New Medical Record'}
        </h3>

        <form onSubmit={handleSubmit}>

          {/* Patient + Date */}
          <div style={section}>
            <h4 style={{ color: '#2c3e50', marginBottom: '12px', marginTop: 0 }}>Visit Info</h4>
            <label style={label}>Doctor</label>
            <select name="doctorId" value={formData.doctorId}
              onChange={handleChange} required style={input}>
              <option value="">Select Doctor</option>
              {doctors?.map(d => (
                <option key={d._id} value={d._id}>
                  {d.userId?.name || 'Unknown'} ({d.specialization})
                </option>
              ))}
            </select>
            <label style={label}>Patient</label>
            <select name="patientId" value={formData.patientId}
              onChange={handleChange} required style={input}>
              <option value="">Select Patient</option>
              {patients?.map(p => (
                <option key={p._id} value={p._id}>
                  {p.userId?.name || 'Unknown'}
                </option>
              ))}
            </select>
            <label style={label}>Visit Date</label>
            <input type="date" name="visitDate" value={formData.visitDate}
              onChange={handleChange} style={input} />
          </div>

          {/* Vitals */}
          <div style={section}>
            <h4 style={{ color: '#2c3e50', marginBottom: '12px', marginTop: 0 }}>Vitals</h4>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div>
                <label style={label}>Blood Pressure</label>
                <input type="text" name="bloodPressure" value={formData.bloodPressure}
                  onChange={handleChange} placeholder="e.g. 120/80" style={input} />
              </div>
              <div>
                <label style={label}>Temperature</label>
                <input type="text" name="temperature" value={formData.temperature}
                  onChange={handleChange} placeholder="e.g. 98.6°F" style={input} />
              </div>
              <div>
                <label style={label}>Weight</label>
                <input type="text" name="weight" value={formData.weight}
                  onChange={handleChange} placeholder="e.g. 70kg" style={input} />
              </div>
              <div>
                <label style={label}>Heart Rate</label>
                <input type="text" name="heartRate" value={formData.heartRate}
                  onChange={handleChange} placeholder="e.g. 72 bpm" style={input} />
              </div>
            </div>
          </div>

          {/* Diagnosis */}
          <div style={section}>
            <h4 style={{ color: '#2c3e50', marginBottom: '12px', marginTop: 0 }}>Diagnosis</h4>
            <label style={label}>Symptoms (comma separated)</label>
            <input type="text" name="symptoms" value={formData.symptoms}
              onChange={handleChange} placeholder="e.g. Fever, Headache, Cough" style={input} />
            <label style={label}>Diagnosis *</label>
            <input type="text" name="diagnosis" value={formData.diagnosis}
              onChange={handleChange} required placeholder="e.g. Viral Fever" style={input} />
            <label style={label}>Doctor's Notes</label>
            <textarea name="notes" value={formData.notes} onChange={handleChange}
              placeholder="Additional observations..." rows={3}
              style={{ ...input, resize: 'vertical' }} />
          </div>

          {/* Prescription */}
          <div style={section}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
              <h4 style={{ color: '#2c3e50', margin: 0 }}>Prescription</h4>
              <button type="button" onClick={addMedicine} style={{
                padding: '4px 12px', background: '#2980b9',
                color: 'white', border: 'none', borderRadius: '4px',
                cursor: 'pointer', fontSize: '13px'
              }}>+ Add Medicine</button>
            </div>
            {prescription.map((p, index) => (
              <div key={index} style={{
                background: 'white', padding: '12px', borderRadius: '6px',
                marginBottom: '10px', border: '1px solid #dee2e6'
              }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                  <div>
                    <label style={label}>Medicine *</label>
                    <input type="text" value={p.medicine} placeholder="Medicine name"
                      onChange={(e) => handlePrescriptionChange(index, 'medicine', e.target.value)}
                      style={{ ...input, marginBottom: '8px' }} />
                  </div>
                  <div>
                    <label style={label}>Dosage *</label>
                    <input type="text" value={p.dosage} placeholder="e.g. 500mg"
                      onChange={(e) => handlePrescriptionChange(index, 'dosage', e.target.value)}
                      style={{ ...input, marginBottom: '8px' }} />
                  </div>
                  <div>
                    <label style={label}>Frequency *</label>
                    <select value={p.frequency}
                      onChange={(e) => handlePrescriptionChange(index, 'frequency', e.target.value)}
                      style={{ ...input, marginBottom: '8px' }}>
                      <option value="">Select</option>
                      <option>Once a day</option>
                      <option>Twice a day</option>
                      <option>Three times a day</option>
                      <option>Four times a day</option>
                      <option>Every 6 hours</option>
                      <option>Every 8 hours</option>
                      <option>As needed</option>
                    </select>
                  </div>
                  <div>
                    <label style={label}>Duration *</label>
                    <input type="text" value={p.duration} placeholder="e.g. 5 days"
                      onChange={(e) => handlePrescriptionChange(index, 'duration', e.target.value)}
                      style={{ ...input, marginBottom: '8px' }} />
                  </div>
                  <div style={{ gridColumn: '1 / -1' }}>
                    <label style={label}>Instructions</label>
                    <input type="text" value={p.instructions} placeholder="e.g. After meals"
                      onChange={(e) => handlePrescriptionChange(index, 'instructions', e.target.value)}
                      style={{ ...input, marginBottom: '8px' }} />
                  </div>
                </div>
                {prescription.length > 1 && (
                  <button type="button" onClick={() => removeMedicine(index)} style={{
                    padding: '4px 10px', background: '#e74c3c', color: 'white',
                    border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '12px'
                  }}>Remove</button>
                )}
              </div>
            ))}
          </div>

          {/* Follow Up */}
          <div style={section}>
            <h4 style={{ color: '#2c3e50', marginBottom: '12px', marginTop: 0 }}>Follow Up</h4>
            <label style={label}>Follow Up Date</label>
            <input type="date" name="followUpDate" value={formData.followUpDate}
              onChange={handleChange} style={input}
              min={new Date().toISOString().split('T')[0]} />
          </div>

          <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
            <button type="submit" style={{
              flex: 1, padding: '10px', background: '#27ae60',
              color: 'white', border: 'none', borderRadius: '4px',
              cursor: 'pointer', fontWeight: '600'
            }}>
              {emrToEdit ? 'Update Record' : 'Save Record'}
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

export default EMRForm