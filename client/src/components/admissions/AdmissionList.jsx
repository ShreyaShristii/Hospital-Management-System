import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getAdmissions, updateAdmission } from '../../features/admissions/admissionSlice'
import Pagination from '../common/Pagination'

function AdmissionList({ onEdit }) {
  const dispatch = useDispatch()
  const { admissions, isLoading, total, pages, pageSize } = useSelector((state) => state.admissions)
  const { user } = useSelector((state) => state.auth)

  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('')

  useEffect(() => {
    const params = { page, limit: 10, search }
    if (statusFilter) params.status = statusFilter
    dispatch(getAdmissions(params))
  }, [dispatch, page, search, statusFilter])

  const handleDischarge = (id) => {
    if (window.confirm('Discharge this patient?')) {
      dispatch(updateAdmission({ id, data: { status: 'Discharged', dischargeDate: new Date() } }))
    }
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
    Admitted: '#2980b9',
    Discharged: '#27ae60',
    Transferred: '#8e44ad',
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
          placeholder="Search by patient, doctor, bed number..."
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
          <option value="Admitted">Admitted</option>
          <option value="Discharged">Discharged</option>
          <option value="Transferred">Transferred</option>
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
          <div>⟳ Loading admissions...</div>
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
                  <th style={th}>Bed</th>
                  <th style={th}>Ward</th>
                  <th style={th}>Reason</th>
                  <th style={th}>Admission Date</th>
                  <th style={th}>Discharge Date</th>
                  <th style={th}>Status</th>
                  <th style={th}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {admissions.length === 0 ? (
                  <tr>
                    <td colSpan="9" style={{
                      textAlign: 'center',
                      padding: '40px 20px',
                      color: '#7f8c8d',
                      fontSize: '15px',
                    }}>
                      {search || statusFilter ? 'No admissions match your filters' : 'No admissions found'}
                    </td>
                  </tr>
                ) : (
                  admissions.map((admission) => (
                    <tr
                      key={admission._id}
                      style={{
                        borderBottom: '1px solid #ecf0f1',
                        transition: 'background-color 0.2s ease',
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f4f6f9'}
                      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                    >
                      <td style={td}>{admission.patientId?.userId?.name || 'N/A'}</td>
                      <td style={td}>Dr. {admission.doctorId?.userId?.name || 'N/A'}</td>
                      <td style={td}>{admission.bedId?.bedNumber || 'N/A'}</td>
                      <td style={td}>{admission.bedId?.ward || 'N/A'}</td>
                      <td style={td}>{admission.reasonForAdmission}</td>
                      <td style={td}>
                        {new Date(admission.admissionDate).toLocaleDateString('en-IN')}
                      </td>
                      <td style={td}>
                        {admission.dischargeDate
                          ? new Date(admission.dischargeDate).toLocaleDateString('en-IN')
                          : '—'}
                      </td>
                      <td style={td}>
                        <span style={{
                          background: statusColor[admission.status] || '#95a5a6',
                          color: 'white',
                          padding: '4px 12px',
                          borderRadius: '12px',
                          fontSize: '12px',
                          fontWeight: '500',
                        }}>
                          {admission.status}
                        </span>
                      </td>
                      <td style={td}>
                        {admission.status === 'Admitted' && (
                          <button
                            onClick={() => handleDischarge(admission._id)}
                            style={{
                              ...btn,
                              background: '#27ae60',
                            }}
                            onMouseEnter={(e) => e.target.style.background = '#229954'}
                            onMouseLeave={(e) => e.target.style.background = '#27ae60'}
                          >
                            Discharge
                          </button>
                        )}
                        {(user?.role === 'admin' || user?.role === 'doctor') && (
                          <button
                            onClick={() => onEdit(admission)}
                            style={{
                              ...btn,
                              background: '#2980b9',
                              marginRight: admission.status === 'Admitted' ? '6px' : '0px',
                            }}
                            onMouseEnter={(e) => e.target.style.background = '#1f5f97'}
                            onMouseLeave={(e) => e.target.style.background = '#2980b9'}
                          >
                            Edit
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

export default AdmissionList