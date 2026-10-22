import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getDoctors } from '../features/doctors/doctorSlice'
import { getStaff } from '../features/staff/staffSlice'
import Navbar from '../components/Navbar'
import ReviewList from '../components/reviews/ReviewList'
import ReviewForm from '../components/reviews/ReviewForm'

function ReviewsPage() {
  const dispatch = useDispatch()
  const [showForm, setShowForm] = useState(false)
  const [reviewToEdit, setReviewToEdit] = useState(null)
  const [filterType, setFilterType] = useState(null) // 'doctorId', 'staffId', or null
  const [filterId, setFilterId] = useState(null)
  
  const { user } = useSelector((state) => state.auth)
  const { doctors } = useSelector((state) => state.doctors)
  const { staff } = useSelector((state) => state.staff)

  // Get doctor or staff ID for the logged-in user
  useEffect(() => {
    if (user?.role === 'doctor') {
      dispatch(getDoctors({ all: true }))
    } else if (['nurse', 'receptionist', 'lab_staff', 'pharmacist'].includes(user?.role)) {
      dispatch(getStaff())
    }
  }, [user?.id, user?.role, dispatch])

  // Set filter when doctors or staff data loads
  useEffect(() => {
    if (user?.role === 'doctor' && doctors && doctors.length > 0) {
      const myDoctor = doctors.find(d => d.userId?._id === user.id || d.userId === user.id)
      if (myDoctor) {
        setFilterType('doctorId')
        setFilterId(myDoctor._id)
      }
    }
  }, [doctors, user?.id, user?.role])

  useEffect(() => {
    if (['nurse', 'receptionist', 'lab_staff', 'pharmacist'].includes(user?.role) && staff && staff.length > 0) {
      const myStaff = staff.find(s => s.userId?._id === user.id || s.userId === user.id)
      if (myStaff) {
        setFilterType('staffId')
        setFilterId(myStaff._id)
      }
    }
  }, [staff, user?.id, user?.role])

  const handleEdit = (review) => {
    setReviewToEdit(review)
    setShowForm(true)
  }

  const handleClose = () => {
    setShowForm(false)
    setReviewToEdit(null)
  }

  const canReview = user?.role === 'patient' || user?.role === 'admin'

  return (
    <div>
      <Navbar />
      <div style={{ padding: '30px', background: '#f4f6f9', minHeight: '100vh' }}>
        <div style={{
          display: 'flex', justifyContent: 'space-between',
          alignItems: 'center', marginBottom: '24px'
        }}>
          <div>
            <h2 style={{ color: '#2c3e50', marginBottom: '4px' }}>
              {filterType ? 'My Reviews' : 'Reviews'}
            </h2>
            <p style={{ color: '#7f8c8d', fontSize: '14px' }}>
              {user?.role === 'patient' && 'Reviews you have written'}
              {user?.role === 'admin' && 'View and manage all staff reviews'}
              {user?.role === 'doctor' && 'Reviews about you from patients'}
              {['nurse', 'receptionist', 'lab_staff', 'pharmacist'].includes(user?.role) && 'Reviews about you'}
            </p>
          </div>
          {canReview && (
            <button onClick={() => setShowForm(true)} style={{
              padding: '10px 20px', background: '#2c3e50',
              color: 'white', border: 'none', borderRadius: '4px',
              cursor: 'pointer', fontWeight: '600'
            }}>
              + Write Review
            </button>
          )}
        </div>

        <ReviewList onEdit={handleEdit} filterType={filterType} filterId={filterId} />

        {showForm && (
          <ReviewForm reviewToEdit={reviewToEdit} onClose={handleClose} />
        )}
      </div>
    </div>
  )
}

export default ReviewsPage