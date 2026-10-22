import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getDoctors, deleteDoctor } from '../../features/doctors/doctorSlice'
import Pagination from '../common/Pagination'

function DoctorList({ onEdit }) {
  const dispatch = useDispatch()
  const { doctors, isLoading, total, pages, page: currentPage, pageSize } = useSelector((state) => state.doctors)

  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')

  useEffect(() => {
    dispatch(getDoctors({ page, limit: 10, search }))
  }, [dispatch, page, search])

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this doctor?')) {
      dispatch(deleteDoctor(id))
    }
  }

  const handleSearchChange = (e) => {
    setSearch(e.target.value)
    setPage(1)
  }

  const inputStyle = {
    padding: '10px 12px',
    border: '1px solid #ddd',
    borderRadius: '4px',
    fontSize: '14px',
    width: '100%',
    maxWidth: '300px',
    boxSizing: 'border-box',
    transition: 'border-color 0.2s ease',
  }

  return (
    <div>
      {/* Search Box */}
      <div style={{ marginBottom: '20px' }}>
        <input
          type="text"
          placeholder="Search by name, specialization, qualification..."
          value={search}
          onChange={handleSearchChange}
          style={inputStyle}
          onFocus={(e) => e.target.style.borderColor = '#2c3e50'}
          onBlur={(e) => e.target.style.borderColor = '#ddd'}
        />
      </div>

      {/* Loading State */}
      {isLoading && (
        <div style={{
          padding: '40px',
          textAlign: 'center',
          color: '#7f8c8d',
          fontSize: '15px',
        }}>
          <div style={{ marginBottom: '12px' }}>⟳ Loading doctors...</div>
        </div>
      )}

      {/* Table */}
      {!isLoading && (
        <>
          <div style={{ overflowX: 'auto', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: '#2c3e50', color: 'white' }}>
                  <th style={th}>Name</th>
                  <th style={th}>Specialization</th>
                  <th style={th}>Degree</th>
                  <th style={th}>Experience</th>
                  <th style={th}>Fee</th>
                  <th style={th}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {doctors.length === 0 ? (
                  <tr>
                    <td colSpan="6" style={{
                      textAlign: 'center',
                      padding: '40px 20px',
                      color: '#7f8c8d',
                      fontSize: '15px',
                    }}>
                      {search ? 'No doctors match your search' : 'No doctors found'}
                    </td>
                  </tr>
                ) : (
                  doctors.map((doctor) => (
                    <tr
                      key={doctor._id}
                      style={{
                        borderBottom: '1px solid #ecf0f1',
                        transition: 'background-color 0.2s ease',
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f4f6f9'}
                      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                    >
                      <td style={td}>{doctor.userId?.name || 'N/A'}</td>
                      <td style={td}>
                        <span style={{
                          background: '#eaf4fb',
                          color: '#2980b9',
                          padding: '4px 12px',
                          borderRadius: '12px',
                          fontSize: '12px',
                          fontWeight: '500',
                        }}>
                          {doctor.specialization}
                        </span>
                      </td>
                      <td style={td}>{doctor.degree}</td>
                      <td style={td}>{doctor.yearsOfExperience} yrs</td>
                      <td style={{ ...td, fontWeight: '600', color: '#27ae60' }}>
                        ₹{doctor.consultationFee}
                      </td>
                      <td style={td}>
                        <button
                          onClick={() => onEdit(doctor)}
                          style={{
                            ...btn,
                            background: '#2980b9',
                            marginRight: '6px',
                          }}
                          onMouseEnter={(e) => e.target.style.background = '#1f5f97'}
                          onMouseLeave={(e) => e.target.style.background = '#2980b9'}
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(doctor._id)}
                          style={{
                            ...btn,
                            background: '#e74c3c',
                          }}
                          onMouseEnter={(e) => e.target.style.background = '#c0392b'}
                          onMouseLeave={(e) => e.target.style.background = '#e74c3c'}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <Pagination
            total={total}
            page={page}
            pages={pages}
            pageSize={pageSize}
            onPageChange={setPage}
          />
        </>
      )}
    </div>
  )
}

const th = {
  padding: '14px 16px',
  textAlign: 'left',
  fontWeight: '600',
  fontSize: '13px',
}
const td = {
  padding: '12px 16px',
  fontSize: '14px',
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

export default DoctorList