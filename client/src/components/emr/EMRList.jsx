import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getEMRs, deleteEMR } from '../../features/emr/emrSlice'
import Pagination from '../common/Pagination'

function EMRList({ onEdit, onView }) {
  const dispatch = useDispatch()
  const { emrs, isLoading, total, pages, page: currentPage, pageSize } = useSelector((state) => state.emr)
  const { user } = useSelector((state) => state.auth)

  const [search, setSearch] = useState('')
  const [fromDate, setFromDate] = useState('')
  const [toDate, setToDate] = useState('')
  const [page, setPage] = useState(1)

  useEffect(() => {
    const params = { page, limit: 10 }
    if (search) params.search = search
    if (fromDate) params.fromDate = fromDate
    if (toDate) params.toDate = toDate
    dispatch(getEMRs(params))
  }, [dispatch, search, fromDate, toDate, page])

  const handleDelete = (id) => {
    if (window.confirm('Delete this EMR record?')) dispatch(deleteEMR(id))
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
          placeholder="Search by patient, doctor, diagnosis..."
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1) }}
          style={{ ...inputStyle, flex: 1, minWidth: '250px' }}
          onFocus={(e) => e.target.style.borderColor = '#2c3e50'}
          onBlur={(e) => e.target.style.borderColor = '#ddd'}
        />
        <input
          type="date"
          value={fromDate}
          onChange={(e) => { setFromDate(e.target.value); setPage(1) }}
          style={inputStyle}
          title="From Date"
        />
        <input
          type="date"
          value={toDate}
          onChange={(e) => { setToDate(e.target.value); setPage(1) }}
          style={inputStyle}
          title="To Date"
        />
        {(search || fromDate || toDate) && (
          <button
            onClick={() => { setSearch(''); setFromDate(''); setToDate(''); setPage(1) }}
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
          <div>⟳ Loading records...</div>
        </div>
      )}

      {/* Table */}
      {!isLoading && (
        <>
          <div style={{ overflowX: 'auto', boxShadow: '0 1px 3px rgba(0,0,0,0.05)', marginBottom: '20px' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: '#2c3e50', color: 'white' }}>
                  <th style={th}>Patient</th>
                  <th style={th}>Doctor</th>
                  <th style={th}>Visit Date</th>
                  <th style={th}>Diagnosis</th>
                  <th style={th}>Symptoms</th>
                  <th style={th}>Follow Up</th>
                  <th style={th}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {emrs.length === 0 ? (
                  <tr>
                    <td colSpan="7" style={{
                      textAlign: 'center',
                      padding: '40px 20px',
                      color: '#7f8c8d',
                      fontSize: '15px',
                    }}>
                      {search || fromDate || toDate ? 'No records match your filters' : 'No records found'}
                    </td>
                  </tr>
                ) : (
                  emrs.map((emr) => (
                    <tr
                      key={emr._id}
                      style={{
                        borderBottom: '1px solid #ecf0f1',
                        transition: 'background-color 0.2s ease',
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f4f6f9'}
                      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                    >
                      <td style={td}>{emr.patientId?.userId?.name || 'N/A'}</td>
                      <td style={td}>Dr. {emr.doctorId?.userId?.name || 'N/A'}</td>
                      <td style={td}>{new Date(emr.visitDate).toLocaleDateString('en-IN')}</td>
                      <td style={td}>{emr.diagnosis}</td>
                      <td style={td}>
                        {emr.symptoms?.length > 0
                          ? emr.symptoms.slice(0, 2).map((s, i) => (
                            <span key={i} style={{
                              background: '#eaf4fb',
                              color: '#2980b9',
                              padding: '4px 8px',
                              borderRadius: '10px',
                              fontSize: '12px',
                              fontWeight: '500',
                              marginRight: '4px',
                              display: 'inline-block',
                            }}>
                              {s}
                            </span>
                          ))
                          : 'N/A'}
                        {emr.symptoms?.length > 2 && (
                          <span style={{ fontSize: '12px', color: '#7f8c8d', marginLeft: '4px' }}>
                            +{emr.symptoms.length - 2} more
                          </span>
                        )}
                      </td>
                      <td style={td}>
                        {emr.followUpDate
                          ? new Date(emr.followUpDate).toLocaleDateString('en-IN')
                          : <span style={{ color: '#bdc3c7' }}>—</span>}
                      </td>
                      <td style={td}>
                        <button
                          onClick={() => onView(emr._id)}
                          style={{
                            ...btn,
                            background: '#8e44ad',
                            marginRight: '6px',
                          }}
                          onMouseEnter={(e) => e.target.style.background = '#723a99'}
                          onMouseLeave={(e) => e.target.style.background = '#8e44ad'}
                        >
                          View
                        </button>
                        {user?.role === 'doctor' && (
                          <button
                            onClick={() => onEdit(emr)}
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
                        )}
                        {user?.role === 'admin' && (
                          <button
                            onClick={() => handleDelete(emr._id)}
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

export default EMRList