import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getBeds, deleteBed } from '../../features/beds/bedSlice'
import Pagination from '../common/Pagination'

function BedList({ onEdit }) {
  const dispatch = useDispatch()
  const { beds, isLoading, total, pages, pageSize } = useSelector((state) => state.beds)
  const { user } = useSelector((state) => state.auth)

  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('')

  useEffect(() => {
    const params = { page, limit: 10, search }
    if (statusFilter) params.status = statusFilter
    dispatch(getBeds(params))
  }, [dispatch, page, search, statusFilter])

  const handleDelete = (id) => {
    if (window.confirm('Delete this bed?')) dispatch(deleteBed(id))
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
    Available: '#27ae60',
    Occupied: '#e74c3c',
  }

  // Summary counts
  const available = beds.filter(b => b.status === 'Available').length
  const occupied = beds.filter(b => b.status === 'Occupied').length

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
      {/* Summary */}
      <div style={{ display: 'flex', gap: '16px', marginBottom: '20px', flexWrap: 'wrap' }}>
        <div style={{
          background: '#eafaf1',
          border: '2px solid #27ae60',
          borderRadius: '8px',
          padding: '16px 24px',
          textAlign: 'center',
          flex: '1',
          minWidth: '150px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
        }}>
          <div style={{ fontSize: '28px', fontWeight: '700', color: '#27ae60' }}>{available}</div>
          <div style={{ fontSize: '13px', color: '#27ae60', fontWeight: '500' }}>Available</div>
        </div>
        <div style={{
          background: '#fdf0ed',
          border: '2px solid #e74c3c',
          borderRadius: '8px',
          padding: '16px 24px',
          textAlign: 'center',
          flex: '1',
          minWidth: '150px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
        }}>
          <div style={{ fontSize: '28px', fontWeight: '700', color: '#e74c3c' }}>{occupied}</div>
          <div style={{ fontSize: '13px', color: '#e74c3c', fontWeight: '500' }}>Occupied</div>
        </div>
        <div style={{
          background: '#eaf4fb',
          border: '2px solid #2980b9',
          borderRadius: '8px',
          padding: '16px 24px',
          textAlign: 'center',
          flex: '1',
          minWidth: '150px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
        }}>
          <div style={{ fontSize: '28px', fontWeight: '700', color: '#2980b9' }}>{total || beds.length}</div>
          <div style={{ fontSize: '13px', color: '#2980b9', fontWeight: '500' }}>Total</div>
        </div>
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: '12px', marginBottom: '20px', flexWrap: 'wrap', alignItems: 'center' }}>
        <input
          type="text"
          placeholder="Search by bed number, ward, room..."
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
          <option value="Available">Available</option>
          <option value="Occupied">Occupied</option>
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
          <div>⟳ Loading beds...</div>
        </div>
      )}

      {/* Table */}
      {!isLoading && (
        <>
          <div style={{ overflowX: 'auto', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: '#2c3e50', color: 'white' }}>
                  <th style={th}>Bed Number</th>
                  <th style={th}>Ward</th>
                  <th style={th}>Room</th>
                  <th style={th}>Status</th>
                  <th style={th}>Patient</th>
                  {user?.role === 'admin' && <th style={th}>Actions</th>}
                </tr>
              </thead>
              <tbody>
                {beds.length === 0 ? (
                  <tr>
                    <td colSpan={user?.role === 'admin' ? '6' : '5'} style={{
                      textAlign: 'center',
                      padding: '40px 20px',
                      color: '#7f8c8d',
                      fontSize: '15px',
                    }}>
                      {search || statusFilter ? 'No beds match your filters' : 'No beds found'}
                    </td>
                  </tr>
                ) : (
                  beds.map((bed) => (
                    <tr
                      key={bed._id}
                      style={{
                        borderBottom: '1px solid #ecf0f1',
                        transition: 'background-color 0.2s ease',
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f4f6f9'}
                      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                    >
                      <td style={{ ...td, fontWeight: '600' }}>{bed.bedNumber}</td>
                      <td style={td}>{bed.ward}</td>
                      <td style={td}>{bed.room}</td>
                      <td style={td}>
                        <span style={{
                          background: statusColor[bed.status] || '#95a5a6',
                          color: 'white',
                          padding: '4px 12px',
                          borderRadius: '12px',
                          fontSize: '12px',
                          fontWeight: '500',
                        }}>
                          {bed.status}
                        </span>
                      </td>
                      <td style={td}>
                        {bed.patientId?.userId?.name || bed.patientId?.name || '—'}
                      </td>
                      {user?.role === 'admin' && (
                        <td style={td}>
                          <button
                            onClick={() => onEdit(bed)}
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
                            onClick={() => handleDelete(bed._id)}
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
                      )}
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <Pagination
            total={total || beds.length}
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

export default BedList