import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { createReview, updateReview, getReviews } from '../../features/reviews/reviewSlice'
import { getStaff } from '../../features/staff/staffSlice'
import { getDoctors } from '../../features/doctors/doctorSlice'
import { getAppointments } from '../../features/appointments/appointmentSlice'

function ReviewForm({ reviewToEdit, onClose }) {
  const dispatch = useDispatch()
  const { user } = useSelector((state) => state.auth)
  const { staff } = useSelector((state) => state.staff)
  const { doctors } = useSelector((state) => state.doctors)
  const { appointments } = useSelector((state) => state.appointments)
  
  const [reviewType, setReviewType] = useState('doctor') // 'doctor' or 'staff'
  const [filteredDoctors, setFilteredDoctors] = useState([])
  const [filteredStaff, setFilteredStaff] = useState([])
  
  const [formData, setFormData] = useState({
    doctorId: '',
    staffId: '',
    rating: 5,
    comment: '',
    category: 'General',
    isAnonymous: false,
  })

  const [error, setError] = useState('')

  useEffect(() => {
    dispatch(getAppointments({ all: true }))
    dispatch(getDoctors({ all: true }))
    dispatch(getStaff())
  }, [dispatch])

  // Filter doctors based on patient's appointments
  useEffect(() => {
    if (appointments && doctors) {
      // Get unique doctorIds from patient's completed/scheduled appointments
      const appointmentList = Array.isArray(appointments) ? appointments : appointments?.appointments || []
      const doctorIds = new Set(
        appointmentList
          .filter(apt => apt.status === 'Completed' || apt.status === 'Scheduled')
          .map(apt => apt.doctorId?._id || apt.doctorId)
      )
      
      // Filter doctors that patient has interacted with
      const filtered = doctors.filter(doc => doctorIds.has(doc._id))
      setFilteredDoctors(filtered)
    }
  }, [appointments, doctors])

  // Filter staff - show all available staff
  useEffect(() => {
    if (staff && Array.isArray(staff)) {
      // Show all staff members with valid data
      const filtered = staff.filter(s => s && s._id && s.userId)
      setFilteredStaff(filtered)
    }
  }, [staff])

  useEffect(() => {
    if (reviewToEdit) {
      const isDoctor = reviewToEdit.doctorId
      setReviewType(isDoctor ? 'doctor' : 'staff')
      setFormData({
        doctorId: reviewToEdit.doctorId?._id || reviewToEdit.doctorId || '',
        staffId: reviewToEdit.staffId?._id || reviewToEdit.staffId || '',
        rating: reviewToEdit.rating || 5,
        comment: reviewToEdit.comment || '',
        category: reviewToEdit.category || 'General',
        isAnonymous: reviewToEdit.isAnonymous || false,
      })
    }
  }, [reviewToEdit])

  const handleChange = (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value
    setFormData({ ...formData, [e.target.name]: value })
  }

  const handleTypeChange = (type) => {
    setReviewType(type)
    setFormData({ ...formData, doctorId: '', staffId: '' })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    try {
      if (reviewToEdit) {
        await dispatch(updateReview({
          id: reviewToEdit._id,
          data: {
            rating: formData.rating,
            comment: formData.comment,
            category: formData.category,
          }
        })).unwrap()
      } else {
        // Validate that either doctorId or staffId is selected
        if (!formData.doctorId && !formData.staffId) {
          setError(`Please select a ${reviewType}`)
          return
        }
        // Only send the selected ID (doctor or staff), filter out empty strings
        const reviewData = {
          rating: formData.rating,
          comment: formData.comment,
          category: formData.category,
          isAnonymous: formData.isAnonymous,
        }
        if (formData.doctorId) {
          reviewData.doctorId = formData.doctorId
        }
        if (formData.staffId) {
          reviewData.staffId = formData.staffId
        }
        await dispatch(createReview(reviewData)).unwrap()
        // Refetch all reviews to show complete list
        await dispatch(getReviews()).unwrap()
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
          {reviewToEdit ? 'Edit Review' : 'Write a Review'}
        </h3>

        {error && (
          <p style={{
            color: '#e74c3c', background: '#fdf0ed',
            padding: '10px', borderRadius: '4px', marginBottom: '12px'
          }}>{error}</p>
        )}

        <form onSubmit={handleSubmit}>

          {/* Review Type Selection — only when creating */}
          {!reviewToEdit && (
            <>
              <label style={labelStyle}>Review Type</label>
              <div style={{ display: 'flex', gap: '10px', marginBottom: '12px' }}>
                <button
                  type="button"
                  onClick={() => handleTypeChange('doctor')}
                  style={{
                    flex: 1, padding: '8px', background: reviewType === 'doctor' ? '#27ae60' : '#ecf0f1',
                    color: reviewType === 'doctor' ? 'white' : '#2c3e50',
                    border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: '500'
                  }}>
                  Doctor
                </button>
                <button
                  type="button"
                  onClick={() => handleTypeChange('staff')}
                  style={{
                    flex: 1, padding: '8px', background: reviewType === 'staff' ? '#27ae60' : '#ecf0f1',
                    color: reviewType === 'staff' ? 'white' : '#2c3e50',
                    border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: '500'
                  }}>
                  Staff
                </button>
              </div>

              {/* Doctor Selection */}
              {reviewType === 'doctor' && (
                <>
                  <label style={labelStyle}>Doctor</label>
                  <select name="doctorId" value={formData.doctorId}
                    onChange={handleChange} style={inputStyle}>
                    <option value="">Select Doctor</option>
                    {filteredDoctors.length > 0 ? (
                      filteredDoctors.map(d => (
                        <option key={d._id} value={d._id}>
                          {d.userId?.name || 'Unknown'} — {d.specialization}
                        </option>
                      ))
                    ) : (
                      <option disabled>No doctors found. Schedule an appointment first!</option>
                    )}
                  </select>
                </>
              )}

              {/* Staff Selection */}
              {reviewType === 'staff' && (
                <>
                  <label style={labelStyle}>Staff Member</label>
                  <select name="staffId" value={formData.staffId}
                    onChange={handleChange} style={inputStyle}>
                    <option value="">Select Staff Member</option>
                    {filteredStaff && filteredStaff.length > 0 ? (
                      filteredStaff.map(s => (
                        <option key={s._id} value={s._id}>
                          {s.userId?.name || 'Unknown'} — {s.position || 'Unknown Position'}
                        </option>
                      ))
                    ) : (
                      <option disabled>No staff members available</option>
                    )}
                  </select>
                </>
              )}
            </>
          )}

          {/* Rating */}
          <label style={labelStyle}>Rating</label>
          <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
            {[1, 2, 3, 4, 5].map(star => (
              <button
                key={star}
                type="button"
                onClick={() => setFormData({ ...formData, rating: star })}
                style={{
                  width: '40px', height: '40px',
                  background: star <= formData.rating ? '#f39c12' : '#ecf0f1',
                  border: 'none', borderRadius: '4px',
                  fontSize: '14px', cursor: 'pointer',
                  color: star <= formData.rating ? 'white' : '#7f8c8d',
                  fontWeight: '600'
                }}>
                {star}
              </button>
            ))}
            <span style={{ alignSelf: 'center', color: '#7f8c8d', fontSize: '14px' }}>
              {formData.rating}/5
            </span>
          </div>

          {/* Category */}
          <label style={labelStyle}>Category</label>
          <select name="category" value={formData.category}
            onChange={handleChange} style={inputStyle}>
            <option value="General">General</option>
            <option value="Professionalism">Professionalism</option>
            <option value="Communication">Communication</option>
            <option value="Treatment Quality">Treatment Quality</option>
            <option value="Punctuality">Punctuality</option>
          </select>

          {/* Comment */}
          <label style={labelStyle}>Comment</label>
          <textarea name="comment" value={formData.comment}
            onChange={handleChange} rows={4}
            placeholder="Share your experience..."
            style={{ ...inputStyle, resize: 'vertical' }} />

          {/* Anonymous */}
          {!reviewToEdit && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
              <input type="checkbox" name="isAnonymous"
                checked={formData.isAnonymous}
                onChange={handleChange}
                id="anonymous" />
              <label htmlFor="anonymous" style={{ color: '#2c3e50', fontSize: '14px' }}>
                Submit anonymously
              </label>
            </div>
          )}

          <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
            <button type="submit" style={{
              flex: 1, padding: '10px', background: '#27ae60',
              color: 'white', border: 'none', borderRadius: '4px',
              cursor: 'pointer', fontWeight: '600'
            }}>
              {reviewToEdit ? 'Update Review' : 'Submit Review'}
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

export default ReviewForm