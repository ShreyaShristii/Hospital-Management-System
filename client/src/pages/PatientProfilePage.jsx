import PatientEditForm from '../components/patients/PatientEditForm'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { useEffect } from 'react'
import { getPatients } from '../features/patients/patientSlice'

function PatientProfilePage() {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { patients, isLoading } = useSelector((state) => state.patients)
  const { user } = useSelector((state) => state.auth)

  useEffect(() => {
    if (!patients || patients.length === 0) {
      dispatch(getPatients({ all: true }))
    }
  }, [dispatch, patients])

  const myPatient = patients?.find(
    (p) => p.userId?._id === user?.id || p.userId?.email === user?.email
  )

  if (!myPatient) {
    return (
      <div style={{ padding: '40px', textAlign: 'center' }}>
        <p>Loading patient profile...</p>
      </div>
    )
  }

  return (
    <div style={{ minHeight: '100vh', background: '#f0f4f8' }}>
      {/* Navigation Bar */}
      <div style={{ background: '#0f2d4a', color: 'white', padding: '16px 40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2 style={{ margin: 0, fontSize: '18px', fontWeight: '600' }}>Edit Patient Profile</h2>
        <button
          onClick={() => navigate('/dashboard')}
          style={{
            background: 'none', border: 'none', color: 'white',
            cursor: 'pointer', fontSize: '14px', fontWeight: '500',
            textDecoration: 'underline'
          }}
        >
          ← Back to Dashboard
        </button>
      </div>
      
      <div style={{ padding: '40px 20px' }}>
        <PatientEditForm patientId={myPatient._id} />
      </div>
    </div>
  )
}

export default PatientProfilePage
