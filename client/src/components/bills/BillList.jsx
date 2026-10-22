import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getBills, deleteBill } from '../../features/bills/billSlice'
import PaymentModal from './PaymentModal'
import Pagination from '../common/Pagination'

function BillList({ onEdit }) {
  const dispatch = useDispatch()
  const { bills, isLoading, total, pages, page: currentPage, pageSize } = useSelector((state) => state.bills)
  const { user } = useSelector((state) => state.auth)
  const [payingBill, setPayingBill] = useState(null)
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('')

  useEffect(() => {
    const params = { page, limit: 10, search }
    if (statusFilter) params.status = statusFilter
    dispatch(getBills(params))
  }, [dispatch, page, search, statusFilter])

  const handleDelete = (id) => {
    if (window.confirm('Delete this bill?')) dispatch(deleteBill(id))
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
    Unpaid: '#e67e22',
    Paid: '#27ae60',
    Partial: '#2980b9',
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
          placeholder="Search by patient, doctor, bill amount..."
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
          <option value="Paid">Paid</option>
          <option value="Unpaid">Unpaid</option>
          <option value="Partial">Partial</option>
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
          <div>⟳ Loading bills...</div>
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
                  <th style={th}>Amount</th>
                  <th style={th}>Mode</th>
                  <th style={th}>Status</th>
                  <th style={th}>Date</th>
                  <th style={th}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {bills.length === 0 ? (
                  <tr>
                    <td colSpan="7" style={{
                      textAlign: 'center',
                      padding: '40px 20px',
                      color: '#7f8c8d',
                      fontSize: '15px',
                    }}>
                      {search || statusFilter ? 'No bills match your filters' : 'No bills found'}
                    </td>
                  </tr>
                ) : (
                  bills.map((bill) => (
                    <tr
                      key={bill._id}
                      style={{
                        borderBottom: '1px solid #ecf0f1',
                        transition: 'background-color 0.2s ease',
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f4f6f9'}
                      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                    >
                      <td style={td}>{bill.patientId?.userId?.name || 'N/A'}</td>
                      <td style={td}>Dr. {bill.doctorId?.userId?.name || 'N/A'}</td>
                      <td style={{ ...td, fontWeight: '600', color: '#27ae60' }}>
                        ₹{bill.amount}
                      </td>
                      <td style={td}>{bill.paymentMode || 'N/A'}</td>
                      <td style={td}>
                        <span style={{
                          background: statusColor[bill.paymentStatus] || '#95a5a6',
                          color: 'white',
                          padding: '4px 12px',
                          borderRadius: '12px',
                          fontSize: '12px',
                          fontWeight: '500',
                        }}>
                          {bill.paymentStatus}
                        </span>
                      </td>
                      <td style={td}>
                        {bill.paymentDate
                          ? new Date(bill.paymentDate).toLocaleDateString('en-IN')
                          : new Date(bill.createdAt).toLocaleDateString('en-IN')}
                      </td>
                      <td style={td}>
                        {(user?.role === 'admin' || user?.role === 'receptionist') && (
                          <>
                            <button
                              onClick={() => onEdit(bill)}
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
                            {user?.role === 'admin' && (
                              <button
                                onClick={() => handleDelete(bill._id)}
                                style={{
                                  ...btn,
                                  background: '#e74c3c',
                                  marginRight: '6px',
                                }}
                                onMouseEnter={(e) => e.target.style.background = '#c0392b'}
                                onMouseLeave={(e) => e.target.style.background = '#e74c3c'}
                              >
                                Delete
                              </button>
                            )}
                          </>
                        )}

                        {bill.paymentStatus !== 'Paid' &&
                          (user?.role === 'patient' || user?.role === 'admin' || user?.role === 'receptionist') && (
                            <button
                              onClick={() => setPayingBill(bill)}
                              style={{
                                ...btn,
                                background: '#27ae60',
                              }}
                              onMouseEnter={(e) => e.target.style.background = '#229954'}
                              onMouseLeave={(e) => e.target.style.background = '#27ae60'}
                            >
                              Pay Now
                            </button>
                          )}

                        {bill.paymentStatus === 'Paid' && (
                          <span style={{ color: '#27ae60', fontWeight: '600', fontSize: '13px' }}>
                            ✓ Paid
                          </span>
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

      {/* Payment Modal */}
      {payingBill && (
        <PaymentModal
          bill={payingBill}
          onClose={() => setPayingBill(null)}
          onSuccess={() => {
            setPayingBill(null)
            dispatch(getBills({ page, limit: 10, search, status: statusFilter }))
          }}
        />
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

export default BillList