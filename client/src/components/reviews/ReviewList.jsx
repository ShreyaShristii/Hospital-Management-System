import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getReviews, deleteReview } from '../../features/reviews/reviewSlice'
import Pagination from '../common/Pagination'

function ReviewList({ onEdit, filterType, filterId }) {
  const dispatch = useDispatch()
  const { reviews, isLoading, total, pages, pageSize } = useSelector((state) => state.reviews)
  const { user } = useSelector((state) => state.auth)

  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('')

  useEffect(() => {
    const params = { page, limit: 10, search }
    if (categoryFilter) params.category = categoryFilter
    dispatch(getReviews(params))
  }, [dispatch, page, search, categoryFilter])

  const handleDelete = (id) => {
    if (window.confirm('Delete this review?')) dispatch(deleteReview(id))
  }

  const handleSearchChange = (e) => {
    setSearch(e.target.value)
    setPage(1)
  }

  const handleCategoryChange = (e) => {
    setCategoryFilter(e.target.value)
    setPage(1)
  }

  const renderStars = (rating) => {
    const stars = Array.from({ length: 5 }, (_, i) => (
      i < rating ? '★' : '☆'
    )).join('')
    return stars
  }

  const categoryColor = {
    'Professionalism': '#2980b9',
    'Communication': '#27ae60',
    'Treatment Quality': '#8e44ad',
    'Punctuality': '#e67e22',
    'General': '#95a5a6',
  }

  const inputStyle = {
    padding: '10px 12px',
    border: '1px solid #ddd',
    borderRadius: '4px',
    fontSize: '14px',
    boxSizing: 'border-box',
    transition: 'border-color 0.2s ease',
  }

  // Filter reviews based on user role and filter criteria
  let filteredReviews = reviews
  if (filterType === 'doctorId' && filterId) {
    filteredReviews = reviews.filter(r => r.doctorId?._id === filterId)
  } else if (filterType === 'staffId' && filterId) {
    filteredReviews = reviews.filter(r => r.staffId?._id === filterId)
  }

  return (
    <div>
      {/* Filters */}
      <div style={{ display: 'flex', gap: '12px', marginBottom: '20px', flexWrap: 'wrap', alignItems: 'center' }}>
        <input
          type="text"
          placeholder="Search by name, comment..."
          value={search}
          onChange={handleSearchChange}
          style={{ ...inputStyle, flex: '1', minWidth: '250px' }}
          onFocus={(e) => e.target.style.borderColor = '#2c3e50'}
          onBlur={(e) => e.target.style.borderColor = '#ddd'}
        />
        <select
          value={categoryFilter}
          onChange={handleCategoryChange}
          style={{ ...inputStyle, minWidth: '180px' }}
        >
          <option value="">All Categories</option>
          <option value="Professionalism">Professionalism</option>
          <option value="Communication">Communication</option>
          <option value="Treatment Quality">Treatment Quality</option>
          <option value="Punctuality">Punctuality</option>
          <option value="General">General</option>
        </select>
        {(search || categoryFilter) && (
          <button
            onClick={() => { setSearch(''); setCategoryFilter(''); setPage(1) }}
            style={{
              ...inputStyle,
              background: '#e74c3c',
              color: 'white',
              border: 'none',
              cursor: 'pointer',
              fontWeight: '500',
            }}
            onMouseEnter={(e) => e.target.style.background = '#c0392b'}
            onMouseLeave={(e) => e.target.style.background = '#e74c3c'}
          >
            Clear Filters
          </button>
        )}
      </div>

      {/* Loading State */}
      {isLoading && (
        <div style={{ padding: '40px', textAlign: 'center', color: '#7f8c8d' }}>
          <div>⟳ Loading reviews...</div>
        </div>
      )}

      {/* Reviews List */}
      {!isLoading && (
        <>
          {filteredReviews.length === 0 ? (
            <div style={{
              textAlign: 'center',
              padding: '60px 20px',
              color: '#7f8c8d',
              fontSize: '15px',
            }}>
              {search || categoryFilter ? 'No reviews match your filters' : 'No reviews found'}
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '20px' }}>
              {filteredReviews.map((review) => {
                // Determine if this is a doctor or staff review
                const isDoctor = review.doctorId && !review.staffId
                const name = isDoctor
                  ? review.doctorId?.userId?.name || 'Unknown Doctor'
                  : review.staffId?.userId?.name || 'Unknown Staff'
                const position = isDoctor
                  ? review.doctorId?.specialization || ''
                  : review.staffId?.position || ''

                return (
                  <div
                    key={review._id}
                    style={{
                      background: 'white',
                      borderRadius: '8px',
                      padding: '20px',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
                      borderLeft: `4px solid ${categoryColor[review.category] || '#95a5a6'}`,
                      transition: 'all 0.2s ease',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.10)'
                      e.currentTarget.style.transform = 'translateY(-2px)'
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.06)'
                      e.currentTarget.style.transform = 'translateY(0)'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <div style={{ flex: 1 }}>
                        {/* Staff/Doctor name */}
                        <h4 style={{
                          color: '#2c3e50',
                          margin: '0 0 8px',
                          fontSize: '15px',
                          fontWeight: '600',
                        }}>
                          {name}
                          {position && (
                            <span style={{
                              color: '#7f8c8d',
                              fontWeight: '400',
                              fontSize: '13px',
                            }}>
                              {' — '}{position}
                            </span>
                          )}
                        </h4>

                        {/* Rating stars */}
                        <div style={{
                          fontSize: '18px',
                          marginBottom: '10px',
                          color: '#f39c12',
                          letterSpacing: '2px',
                        }}>
                          {renderStars(review.rating)}
                          <span style={{
                            color: '#2c3e50',
                            fontSize: '13px',
                            fontWeight: '600',
                            marginLeft: '8px',
                          }}>
                            {review.rating}/5
                          </span>
                        </div>

                        {/* Category badge */}
                        <span style={{
                          background: categoryColor[review.category] || '#95a5a6',
                          color: 'white',
                          padding: '4px 12px',
                          borderRadius: '12px',
                          fontSize: '12px',
                          fontWeight: '500',
                          marginBottom: '12px',
                          display: 'inline-block',
                        }}>
                          {review.category}
                        </span>

                        {/* Comment */}
                        {review.comment && (
                          <p style={{
                            color: '#2c3e50',
                            fontSize: '14px',
                            margin: '12px 0 0',
                            lineHeight: '1.5',
                            fontStyle: 'italic',
                          }}>
                            "{review.comment}"
                          </p>
                        )}

                        {/* Reviewer info */}
                        <p style={{
                          color: '#95a5a6',
                          fontSize: '12px',
                          margin: '10px 0 0',
                        }}>
                          By: {review.isAnonymous ? 'Anonymous User' : review.reviewerId?.name || 'Unknown'}
                          {' • '}
                          {new Date(review.createdAt).toLocaleDateString('en-IN')}
                        </p>
                      </div>

                      {/* Actions */}
                      {(user?.role === 'admin' || review.reviewerId?._id === user?.id) && (
                        <div style={{ display: 'flex', gap: '6px', flexShrink: 0, marginLeft: '16px' }}>
                          <button
                            onClick={() => onEdit(review)}
                            style={{
                              ...btn,
                              background: '#2980b9',
                            }}
                            onMouseEnter={(e) => e.target.style.background = '#1f5f97'}
                            onMouseLeave={(e) => e.target.style.background = '#2980b9'}
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(review._id)}
                            style={{
                              ...btn,
                              background: '#e74c3c',
                            }}
                            onMouseEnter={(e) => e.target.style.background = '#c0392b'}
                            onMouseLeave={(e) => e.target.style.background = '#e74c3c'}
                          >
                            Delete
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          )}

          {/* Pagination */}
          {filteredReviews.length > 0 && (
            <Pagination
              total={total}
              page={page}
              pages={pages}
              pageSize={pageSize}
              onPageChange={setPage}
            />
          )}
        </>
      )}
    </div>
  )
}

const btn = {
  padding: '6px 12px',
  color: 'white',
  border: 'none',
  borderRadius: '4px',
  cursor: 'pointer',
  fontSize: '13px',
  fontWeight: '500',
  transition: 'background-color 0.2s ease',
}

export default ReviewList