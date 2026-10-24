import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getLabTests, deleteLabTest } from '../../features/lab/labSlice'
import Pagination from '../common/Pagination'

function LabList({ onEdit }) {
  const dispatch = useDispatch()
  const { labs, isLoading, total, pages, pageSize } = useSelector((state) => state.lab)
  const { user } = useSelector((state) => state.auth)

  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('')

  useEffect(() => {
    const params = { page, limit: 10, search }
    if (statusFilter) params.status = statusFilter
    dispatch(getLabTests(params))
  }, [dispatch, page, search, statusFilter])

  const handleDelete = (id) => {
    if (window.confirm('Delete this lab test?')) dispatch(deleteLabTest(id))
  }

  const handleSearchChange = (e) => {
    setSearch(e.target.value)
    setPage(1)
  }

  const handleStatusChange = (e) => {
    setStatusFilter(e.target.value)
    setPage(1)
  }

  const statusColor = {
    'Requested': '#e67e22',
    'In Progress': '#2980b9',
    'Completed': '#27ae60',
  }

  const inputStyle = {
    padding: '10px 12px',
    border: '1px solid #ddd',
    borderRadius: '4px',
    fontSize: '14px',
    boxSizing: 'border-box',
    transition: 'border-color 0.2s ease',
  }

  return (
    <div>
      {/* Filters */}
      <div style={{ display: 'flex', gap: '12px', marginBottom: '20px', flexWrap: 'wrap', alignItems: 'center' }}>
        <input
          type="text"
          placeholder="Search by patient, doctor, test name..."
          value={search}
          onChange={handleSearchChange}
          style={{ ...inputStyle, flex: '1', minWidth: '250px' }}
          onFocus={(e) => e.target.style.borderColor = '#2c3e50'}
          onBlur={(e) => e.target.style.borderColor = '#ddd'}
        />
        <select
          value={statusFilter}
          onChange={handleStatusChange}
          style={{ ...inputStyle, minWidth: '150px' }}
        >
          <option value="">All Status</option>
          <option value="Requested">Requested</option>
          <option value="In Progress">In Progress</option>
          <option value="Completed">Completed</option>
        </select>
        {(search || statusFilter) && (
          <button
            onClick={() => { setSearch(''); setStatusFilter(''); setPage(1) }}
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
          <div>⟳ Loading lab tests...</div>
        </div>
      )}

      {/* Table */}
      {!isLoading && (
        <>
          <div style={{ overflowX: 'auto', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: '#2c3e50', color: 'white' }}>
                  <th style={th}>Patient</th>
                  <th style={th}>Doctor</th>
                  <th style={th}>Test Name</th>
                  <th style={th}>Status</th>
                  <th style={th}>Result</th>
                  <th style={th}>Requested Date</th>
                  <th style={th}>Completed Date</th>
                  <th style={th}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {labs.length === 0 ? (
                  <tr>
                    <td colSpan="8" style={{
                      textAlign: 'center',
                      padding: '40px 20px',
                      color: '#7f8c8d',
                      fontSize: '15px',
                    }}>
                      {search || statusFilter ? 'No lab tests match your filters' : 'No lab tests found'}
                    </td>
                  </tr>
                ) : (
                  labs.map((lab) => (
                    <tr
                      key={lab._id}
                      style={{
                        borderBottom: '1px solid #ecf0f1',
                        transition: 'background-color 0.2s ease',
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f4f6f9'}
                      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                    >
                      <td style={td}>{lab.patientId?.userId?.name || 'N/A'}</td>
                      <td style={td}>{lab.doctorId?.userId?.name || 'N/A'}</td>
                      <td style={td}>{lab.testName}</td>
                      <td style={td}>
                        <span style={{
                          background: statusColor[lab.status] || '#95a5a6',
                          color: 'white',
                          padding: '4px 12px',
                          borderRadius: '12px',
                          fontSize: '12px',
                          fontWeight: '500',
                        }}>
                          {lab.status}
                        </span>
                      </td>
                      <td style={td}>{lab.result || '—'}</td>
                      <td style={td}>
                        {lab.requestedDate
                          ? new Date(lab.requestedDate).toLocaleDateString('en-IN')
                          : '—'}
                      </td>
                      <td style={td}>
                        {lab.completedDate
                          ? new Date(lab.completedDate).toLocaleDateString('en-IN')
                          : '—'}
                      </td>
                      <td style={td}>
                        {(user?.role === 'lab_staff' || user?.role === 'doctor' || user?.role === 'admin') && (
                          <button
                            onClick={() => onEdit(lab)}
                            style={{
                              ...btn,
                              background: '#2980b9',
                              marginRight: '6px',
                            }}
                            onMouseEnter={(e) => e.target.style.background = '#1f5f97'}
                            onMouseLeave={(e) => e.target.style.background = '#2980b9'}
                          >
                            {user?.role === 'lab_staff' ? 'Upload Result' : 'Edit'}
                          </button>
                        )}
                        {user?.role === 'admin' && (
                          <button
                            onClick={() => handleDelete(lab._id)}
                            style={{
                              ...btn,
                              background: '#e74c3c',
                            }}
                            onMouseEnter={(e) => e.target.style.background = '#c0392b'}
                            onMouseLeave={(e) => e.target.style.background = '#e74c3c'}
                          >
                            Delete
                          </button>
                        )}
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

export default LabList