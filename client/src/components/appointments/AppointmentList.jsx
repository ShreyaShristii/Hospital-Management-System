import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getAppointments, deleteAppointment } from '../../features/appointments/appointmentSlice'
import Pagination from '../common/Pagination'

function AppointmentList({ onEdit, onView }) {
  const dispatch = useDispatch()
  const { appointments, isLoading, total, pages, pageSize } = useSelector((state) => state.appointments)
  const { user } = useSelector((state) => state.auth)

  const [search, setSearch] = useState('')
  const [status, setStatus] = useState('')
  const [date, setDate] = useState('')
  const [sortBy, setSortBy] = useState('appointmentDate')
  const [order, setOrder] = useState('desc')
  const [page, setPage] = useState(1)

  useEffect(() => {
    const params = { page, limit: 10, sortBy, order }
    if (status) params.status = status
    if (date) params.date = date
    if (search) params.search = search
    dispatch(getAppointments(params))
  }, [dispatch, search, status, date, sortBy, order, page])

  const handleDelete = (id) => {
    if (window.confirm('Cancel this appointment?')) dispatch(deleteAppointment(id))
  }

  const statusColor = {
    Scheduled: '#e67e22',
    Completed: '#27ae60',
    Cancelled: '#e74c3c',
    'No Show': '#95a5a6',
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
      {/* Search + Filter + Sort Bar */}
      <div style={{
        display: 'flex',
        gap: '12px',
        marginBottom: '20px',
        flexWrap: 'wrap',
        alignItems: 'center',
      }}>
        <input
          type="text"
          placeholder="Search by patient, doctor, reason..."
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1) }}
          style={{ ...inputStyle, flex: '1', minWidth: '250px' }}
          onFocus={(e) => e.target.style.borderColor = '#2c3e50'}
          onBlur={(e) => e.target.style.borderColor = '#ddd'}
        />
        <select
          value={status}
          onChange={(e) => { setStatus(e.target.value); setPage(1) }}
          style={{ ...inputStyle, minWidth: '150px' }}
        >
          <option value="">All Status</option>
          <option value="Scheduled">Scheduled</option>
          <option value="Completed">Completed</option>
          <option value="Cancelled">Cancelled</option>
          <option value="No Show">No Show</option>
        </select>
        <input
          type="date"
          value={date}
          onChange={(e) => { setDate(e.target.value); setPage(1) }}
          style={inputStyle}
        />
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          style={{ ...inputStyle, minWidth: '140px' }}
        >
          <option value="appointmentDate">Sort by Date</option>
          <option value="appointmentTime">Sort by Time</option>
          <option value="status">Sort by Status</option>
        </select>
        <select
          value={order}
          onChange={(e) => setOrder(e.target.value)}
          style={{ ...inputStyle, minWidth: '130px' }}
        >
          <option value="desc">Newest First</option>
          <option value="asc">Oldest First</option>
        </select>
        {(search || status || date) && (
          <button
            onClick={() => { setSearch(''); setStatus(''); setDate(''); setPage(1) }}
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
          <div>⟳ Loading appointments...</div>
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
                  <th style={th}>Specialization</th>
                  <th style={th}>Date</th>
                  <th style={th}>Time</th>
                  <th style={th}>Reason</th>
                  <th style={th}>Status</th>
                  <th style={th}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {appointments.length === 0 ? (
                  <tr>
                    <td colSpan="8" style={{
                      textAlign: 'center',
                      padding: '40px 20px',
                      color: '#7f8c8d',
                      fontSize: '15px',
                    }}>
                      {search || status || date ? 'No appointments match your filters' : 'No appointments found'}
                    </td>
                  </tr>
                ) : (
                  appointments.map((apt) => (
                    <tr
                      key={apt._id}
                      style={{
                        borderBottom: '1px solid #ecf0f1',
                        transition: 'background-color 0.2s ease',
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f4f6f9'}
                      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                    >
                      <td style={td}>{apt.patientId?.userId?.name || 'N/A'}</td>
                      <td style={td}>Dr. {apt.doctorId?.userId?.name || 'N/A'}</td>
                      <td style={td}>
                        <span style={{
                          background: '#eaf4fb',
                          color: '#2980b9',
                          padding: '4px 12px',
                          borderRadius: '12px',
                          fontSize: '12px',
                          fontWeight: '500',
                        }}>
                          {apt.doctorId?.specialization || 'N/A'}
                        </span>
                      </td>
                      <td style={td}>{new Date(apt.appointmentDate).toLocaleDateString('en-IN')}</td>
                      <td style={td}>{apt.appointmentTime}</td>
                      <td style={td}>{apt.reason || 'N/A'}</td>
                      <td style={td}>
                        <span style={{
                          background: statusColor[apt.status] || '#95a5a6',
                          color: 'white',
                          padding: '4px 12px',
                          borderRadius: '12px',
                          fontSize: '12px',
                          fontWeight: '500',
                        }}>
                          {apt.status}
                        </span>
                      </td>
                      <td style={td}>
                        {/* View — all roles */}
                        <button
                          onClick={() => onView(apt._id)}
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

                        {/* Reschedule + Cancel — only on Scheduled, non-doctors */}
                        {user?.role !== 'doctor' && apt.status === 'Scheduled' && (
                          <>
                            <button
                              onClick={() => onEdit(apt)}
                              style={{
                                ...btn,
                                background: '#2980b9',
                                marginRight: '6px',
                              }}
                              onMouseEnter={(e) => e.target.style.background = '#1f5f97'}
                              onMouseLeave={(e) => e.target.style.background = '#2980b9'}
                            >
                              Reschedule
                            </button>
                            <button
                              onClick={() => handleDelete(apt._id)}
                              style={{
                                ...btn,
                                background: '#e74c3c',
                              }}
                              onMouseEnter={(e) => e.target.style.background = '#c0392b'}
                              onMouseLeave={(e) => e.target.style.background = '#e74c3c'}
                            >
                              Cancel
                            </button>
                          </>
                        )}

                        {/* Doctor — update status only on Scheduled */}
                        {user?.role === 'doctor' && apt.status === 'Scheduled' && (
                          <button
                            onClick={() => onEdit(apt)}
                            style={{
                              ...btn,
                              background: '#27ae60',
                            }}
                            onMouseEnter={(e) => e.target.style.background = '#229954'}
                            onMouseLeave={(e) => e.target.style.background = '#27ae60'}
                          >
                            Update Status
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

export default AppointmentList