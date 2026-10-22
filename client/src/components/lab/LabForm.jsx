import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { createLabTest, updateLabTest } from '../../features/lab/labSlice'
import { getPatients } from '../../features/patients/patientSlice'
import { getDoctors } from '../../features/doctors/doctorSlice'

function LabForm({ labToEdit, onClose }) {
  const dispatch = useDispatch()
  const { user } = useSelector((state) => state.auth)
  const { patients } = useSelector((state) => state.patients)
  const { doctors } = useSelector((state) => state.doctors)

  const [formData, setFormData] = useState({
    patientId: '',
    doctorId: '',
    testName: '',
    status: 'Requested',
    result: '',
    reportUrl: '',
    completedDate: '',
  })

  useEffect(() => {
    dispatch(getPatients({ all: true }))
    dispatch(getDoctors({ all: true }))
  }, [dispatch])

  useEffect(() => {
    if (labToEdit) {
      setFormData({
        patientId: labToEdit.patientId?._id || labToEdit.patientId || '',
        doctorId: labToEdit.doctorId?._id || labToEdit.doctorId || '',
        testName: labToEdit.testName || '',
        status: labToEdit.status || 'Requested',
        result: labToEdit.result || '',
        reportUrl: labToEdit.reportUrl || '',
        completedDate: labToEdit.completedDate?.split('T')[0] || '',
      })
    }
  }, [labToEdit])

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    if (labToEdit) {
      // Lab staff only updates result, status, reportUrl, completedDate
      const updateData = user?.role === 'lab_staff'
        ? {
            status: formData.status,
            result: formData.result,
            reportUrl: formData.reportUrl,
            completedDate: formData.completedDate,
          }
        : formData

      dispatch(updateLabTest({ id: labToEdit._id, data: updateData }))
    } else {
      dispatch(createLabTest({
        patientId: formData.patientId,
        doctorId: formData.doctorId,
        testName: formData.testName,
      }))
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

  // Lab staff only sees result upload form
  if (user?.role === 'lab_staff' && labToEdit) {
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
          borderRadius: '8px', width: '480px'
        }}>
          <h3 style={{ color: '#2c3e50', marginBottom: '20px' }}>Upload Lab Result</h3>
          <p style={{ color: '#7f8c8d', marginBottom: '16px', fontSize: '14px' }}>
            <strong>Patient:</strong> {labToEdit.patientId?.userId?.name || 'N/A'}<br />
            <strong>Test:</strong> {labToEdit.testName}<br />
            <strong>Requested:</strong> {new Date(labToEdit.requestedDate).toLocaleDateString('en-IN')}
          </p>
          <form onSubmit={handleSubmit}>
            <label style={labelStyle}>Status</label>
            <select name="status" value={formData.status}
              onChange={handleChange} style={inputStyle}>
              <option value="Requested">Requested</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
            </select>

            <label style={labelStyle}>Result</label>
            <textarea name="result" value={formData.result}
              onChange={handleChange} rows={4}
              placeholder="Enter test result details..."
              style={{ ...inputStyle, resize: 'vertical' }} />

            <label style={labelStyle}>Report URL (optional)</label>
            <input type="text" name="reportUrl" value={formData.reportUrl}
              onChange={handleChange} placeholder="Link to report file"
              style={inputStyle} />

            <label style={labelStyle}>Completed Date</label>
            <input type="date" name="completedDate" value={formData.completedDate}
              onChange={handleChange} style={inputStyle} />

            <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
              <button type="submit" style={{
                flex: 1, padding: '10px', background: '#27ae60',
                color: 'white', border: 'none', borderRadius: '4px',
                cursor: 'pointer', fontWeight: '600'
              }}>Upload Result</button>
              <button type="button" onClick={onClose} style={{
                flex: 1, padding: '10px', background: '#e74c3c',
                color: 'white', border: 'none', borderRadius: '4px',
                cursor: 'pointer', fontWeight: '600'
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
          {labToEdit ? 'Edit Lab Test' : 'Order Lab Test'}
        </h3>

        <form onSubmit={handleSubmit}>

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

          <label style={labelStyle}>Ordering Doctor</label>
          <select name="doctorId" value={formData.doctorId}
            onChange={handleChange} required style={inputStyle}>
            <option value="">Select Doctor</option>
            {doctors?.map(d => (
              <option key={d._id} value={d._id}>
                Dr. {d.userId?.name} — {d.specialization}
              </option>
            ))}
          </select>

          <label style={labelStyle}>Test Name</label>
          <select name="testName" value={formData.testName}
            onChange={handleChange} required style={inputStyle}>
            <option value="">Select Test</option>
            {[
              'Complete Blood Count (CBC)',
              'Blood Sugar (Fasting)',
              'Blood Sugar (PP)',
              'HbA1c',
              'Lipid Profile',
              'Liver Function Test (LFT)',
              'Kidney Function Test (KFT)',
              'Thyroid Profile (TSH)',
              'Urine Routine',
              'ECG',
              'X-Ray',
              'Ultrasound',
              'MRI',
              'CT Scan',
              'COVID-19 RT-PCR',
              'Dengue NS1',
              'Malaria Test',
              'Other',
            ].map(t => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>

          {labToEdit && (
            <>
              <label style={labelStyle}>Status</label>
              <select name="status" value={formData.status}
                onChange={handleChange} style={inputStyle}>
                <option value="Requested">Requested</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
              </select>

              <label style={labelStyle}>Result</label>
              <textarea name="result" value={formData.result}
                onChange={handleChange} rows={4}
                placeholder="Enter test result..."
                style={{ ...inputStyle, resize: 'vertical' }} />

              <label style={labelStyle}>Report URL</label>
              <input type="text" name="reportUrl" value={formData.reportUrl}
                onChange={handleChange} style={inputStyle} />

              <label style={labelStyle}>Completed Date</label>
              <input type="date" name="completedDate" value={formData.completedDate}
                onChange={handleChange} style={inputStyle} />
            </>
          )}

          <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
            <button type="submit" style={{
              flex: 1, padding: '10px', background: '#27ae60',
              color: 'white', border: 'none', borderRadius: '4px',
              cursor: 'pointer', fontWeight: '600'
            }}>
              {labToEdit ? 'Update' : 'Order Test'}
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

export default LabForm