import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getPatients, deletePatient } from '../../features/patients/patientSlice'
import Pagination from '../common/Pagination'

function PatientList({ onEdit }) {
  const dispatch = useDispatch()
  const { patients, isLoading, total, pages, page: currentPage, pageSize } = useSelector((state) => state.patients)
  
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')

  useEffect(() => {
    dispatch(getPatients({ page, limit: 10, search }))
  }, [dispatch, page, search])

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this patient?')) {
      dispatch(deletePatient(id))
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
          placeholder="Search by name, contact, blood group..."
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
          <div style={{ marginBottom: '12px' }}>⟳ Loading patients...</div>
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
                  <th style={th}>Gender</th>
                  <th style={th}>Blood Group</th>
                  <th style={th}>Contact</th>
                  <th style={th}>Status</th>
                  <th style={th}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {patients.length === 0 ? (
                  <tr>
                    <td colSpan="6" style={{
                      textAlign: 'center',
                      padding: '40px 20px',
                      color: '#7f8c8d',
                      fontSize: '15px',
                    }}>
                      {search ? 'No patients match your search' : 'No patients found'}
                    </td>
                  </tr>
                ) : (
                  patients.map((patient) => (
                    <tr
                      key={patient._id}
                      style={{
                        borderBottom: '1px solid #ecf0f1',
                        transition: 'background-color 0.2s ease',
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f4f6f9'}
                      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                    >
                      <td style={td}>{patient.userId?.name || 'N/A'}</td>
                      <td style={td}>{patient.gender}</td>
                      <td style={td}>{patient.bloodGroup}</td>
                      <td style={td}>{patient.contactNumber}</td>
                      <td style={td}>
                        <span style={{
                          background: '#eaf4fb',
                          color: '#2980b9',
                          padding: '4px 12px',
                          borderRadius: '12px',
                          fontSize: '12px',
                          fontWeight: '500',
                        }}>
                          {patient.currentHealthStatus}
                        </span>
                      </td>
                      <td style={td}>
                        <button
                          onClick={() => onEdit(patient)}
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
                          onClick={() => handleDelete(patient._id)}
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

export default PatientList