import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getMedicines, deleteMedicine } from '../../features/pharmacy/pharmacySlice'
import Pagination from '../common/Pagination'

function PharmacyList({ onEdit }) {
  const dispatch = useDispatch()
  const { medicines, isLoading, total, pages, page: currentPage, pageSize } = useSelector((state) => state.pharmacy)
  const { user } = useSelector((state) => state.auth)

  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const [stockFilter, setStockFilter] = useState('')

  useEffect(() => {
    const params = { page, limit: 10, search }
    if (stockFilter) params.stockStatus = stockFilter
    dispatch(getMedicines(params))
  }, [dispatch, page, search, stockFilter])

  const handleDelete = (id) => {
    if (window.confirm('Delete this medicine?')) dispatch(deleteMedicine(id))
  }

  const handleSearchChange = (e) => {
    setSearch(e.target.value)
    setPage(1)
  }

  const handleStockChange = (e) => {
    setStockFilter(e.target.value)
    setPage(1)
  }

  const getStockStatus = (stock, lowStockAlert) => {
    if (stock === 0) return { label: 'Out of Stock', color: '#e74c3c' }
    if (stock <= lowStockAlert) return { label: 'Low Stock', color: '#e67e22' }
    return { label: 'In Stock', color: '#27ae60' }
  }

  const getExpiryStatus = (expiryDate) => {
    const today = new Date()
    const expiry = new Date(expiryDate)
    const diffDays = Math.ceil((expiry - today) / (1000 * 60 * 60 * 24))
    if (diffDays < 0) return { label: 'Expired', color: '#e74c3c' }
    if (diffDays <= 30) return { label: `Expires in ${diffDays}d`, color: '#e67e22' }
    return { label: expiry.toLocaleDateString('en-IN'), color: '#27ae60' }
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
          placeholder="Search by medicine name, category, manufacturer..."
          value={search}
          onChange={handleSearchChange}
          style={{ ...inputStyle, flex: '1', minWidth: '250px' }}
          onFocus={(e) => e.target.style.borderColor = '#2c3e50'}
          onBlur={(e) => e.target.style.borderColor = '#ddd'}
        />
        <select
          value={stockFilter}
          onChange={handleStockChange}
          style={{ ...inputStyle, minWidth: '150px' }}
        >
          <option value="">All Stock Status</option>
          <option value="in-stock">In Stock</option>
          <option value="low-stock">Low Stock</option>
          <option value="out-of-stock">Out of Stock</option>
        </select>
        {(search || stockFilter) && (
          <button
            onClick={() => { setSearch(''); setStockFilter(''); setPage(1) }}
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
          <div>⟳ Loading medicines...</div>
        </div>
      )}

      {/* Table */}
      {!isLoading && (
        <>
          <div style={{ overflowX: 'auto', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: '#2c3e50', color: 'white' }}>
                  <th style={th}>Medicine Name</th>
                  <th style={th}>Category</th>
                  <th style={th}>Manufacturer</th>
                  <th style={th}>Stock</th>
                  <th style={th}>Price</th>
                  <th style={th}>Expiry</th>
                  <th style={th}>Status</th>
                  {(user?.role === 'admin' || user?.role === 'pharmacist') && (
                    <th style={th}>Actions</th>
                  )}
                </tr>
              </thead>
              <tbody>
                {medicines.length === 0 ? (
                  <tr>
                    <td colSpan={user?.role === 'admin' || user?.role === 'pharmacist' ? '8' : '7'} style={{
                      textAlign: 'center',
                      padding: '40px 20px',
                      color: '#7f8c8d',
                      fontSize: '15px',
                    }}>
                      {search || stockFilter ? 'No medicines match your filters' : 'No medicines found'}
                    </td>
                  </tr>
                ) : (
                  medicines.map((med) => {
                    const stockStatus = getStockStatus(med.stock, med.lowStockAlert)
                    const expiryStatus = getExpiryStatus(med.expiryDate)
                    return (
                      <tr
                        key={med._id}
                        style={{
                          borderBottom: '1px solid #ecf0f1',
                          transition: 'background-color 0.2s ease',
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f4f6f9'}
                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                      >
                        <td style={{ ...td, fontWeight: '600' }}>{med.medicineName}</td>
                        <td style={td}>
                          <span style={{
                            background: '#eaf4fb',
                            color: '#2980b9',
                            padding: '4px 12px',
                            borderRadius: '12px',
                            fontSize: '12px',
                            fontWeight: '500',
                          }}>
                            {med.category}
                          </span>
                        </td>
                        <td style={td}>{med.manufacturer}</td>
                        <td style={td}>
                          <span style={{ fontWeight: '600', color: stockStatus.color }}>
                            {med.stock}
                          </span>
                          <span style={{ color: '#7f8c8d', fontSize: '12px' }}>
                            {' '}(alert: {med.lowStockAlert})
                          </span>
                        </td>
                        <td style={{ ...td, fontWeight: '600', color: '#27ae60' }}>
                          ₹{med.price}
                        </td>
                        <td style={td}>
                          <span style={{ color: expiryStatus.color, fontSize: '13px', fontWeight: '500' }}>
                            {expiryStatus.label}
                          </span>
                        </td>
                        <td style={td}>
                          <span style={{
                            background: stockStatus.color,
                            color: 'white',
                            padding: '4px 12px',
                            borderRadius: '12px',
                            fontSize: '12px',
                            fontWeight: '500',
                          }}>
                            {stockStatus.label}
                          </span>
                        </td>
                        {(user?.role === 'admin' || user?.role === 'pharmacist') && (
                          <td style={td}>
                            <button
                              onClick={() => onEdit(med)}
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
                                onClick={() => handleDelete(med._id)}
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
                        )}
                      </tr>
                    )
                  })
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

export default PharmacyList