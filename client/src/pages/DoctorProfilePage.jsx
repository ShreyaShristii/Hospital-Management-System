import DoctorEditForm from '../components/doctors/DoctorEditForm'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { useEffect } from 'react'
import { getDoctors } from '../features/doctors/doctorSlice'

function DoctorProfilePage() {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { doctors } = useSelector((state) => state.doctors)
  const { user } = useSelector((state) => state.auth)

  useEffect(() => {
    if (!doctors || doctors.length === 0) {
      dispatch(getDoctors({ all: true }))
    }
  }, [dispatch, doctors])

  const myDoctor = doctors?.find((d) => d.userId?._id === user?.id)

  if (!myDoctor) {
    return (
      <div style={{ padding: '40px', textAlign: 'center' }}>
        <p>Loading doctor profile...</p>
      </div>
    )
  }

  return (
    <div style={{ minHeight: '100vh', background: '#f0f4f8' }}>
      {/* Navigation Bar */}
      <div style={{ background: '#0f2d4a', color: 'white', padding: '16px 40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2 style={{ margin: 0, fontSize: '18px', fontWeight: '600' }}>Edit Doctor Profile</h2>
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
        <DoctorEditForm doctorId={myDoctor._id} />
      </div>
    </div>
  )
}

export default DoctorProfilePage
