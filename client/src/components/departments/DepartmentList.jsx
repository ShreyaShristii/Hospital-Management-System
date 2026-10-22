import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getDepartments, deleteDepartment } from '../../features/departments/departmentSlice'
import Pagination from '../common/Pagination'

function DepartmentList({ onEdit }) {
  const dispatch = useDispatch()
  const { departments, isLoading, total, pages, page: currentPage, pageSize } = useSelector((state) => state.departments)

  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')

  useEffect(() => {
    dispatch(getDepartments({ page, limit: 10, search }))
  }, [dispatch, page, search])

  const handleDelete = (id) => {
    if (window.confirm('Delete this department?')) dispatch(deleteDepartment(id))
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
          placeholder="Search by department name, location..."
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
          <div style={{ marginBottom: '12px' }}>⟳ Loading departments...</div>
        </div>
      )}

      {/* Cards Grid */}
      {!isLoading && (
        <>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: '20px',
            marginBottom: '28px',
          }}>
            {departments.length === 0 ? (
              <div style={{
                gridColumn: '1/-1',
                textAlign: 'center',
                padding: '60px 20px',
                color: '#7f8c8d',
                fontSize: '15px',
              }}>
                {search ? 'No departments match your search' : 'No departments found. Add your first department!'}
              </div>
            ) : (
              departments.map((dept) => (
                <div
                  key={dept._id}
                  style={{
                    background: 'white',
                    borderRadius: '8px',
                    padding: '20px',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                    borderLeft: '4px solid #2980b9',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-4px)'
                    e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.12)'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)'
                    e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.08)'
                  }}
                >
                  <h4 style={{
                    color: '#2c3e50',
                    margin: '0 0 12px',
                    fontSize: '16px',
                    fontWeight: '600',
                  }}>
                    {dept.name}
                  </h4>

                  <div style={{
                    marginBottom: '12px',
                    color: '#7f8c8d',
                    fontSize: '13px',
                  }}>
                    <div style={{ marginBottom: '8px' }}>
                      <span style={{ fontWeight: '500', color: '#2c3e50' }}>Location:</span> {dept.location}
                    </div>
                    <div style={{ marginBottom: '8px' }}>
                      <span style={{ fontWeight: '500', color: '#2c3e50' }}>Head:</span> {dept.headDoctorId?.userId?.name || 'Not assigned'}
                    </div>
                    <div style={{ marginBottom: '8px' }}>
                      <span style={{ fontWeight: '500', color: '#2c3e50' }}>Staff:</span> {dept.totalStaff}
                    </div>
                  </div>

                  {dept.description && (
                    <p style={{
                      color: '#95a5a6',
                      fontSize: '12px',
                      margin: '12px 0',
                      lineHeight: '1.4',
                      fontStyle: 'italic',
                    }}>
                      {dept.description}
                    </p>
                  )}

                  <div style={{
                    display: 'flex',
                    gap: '8px',
                    marginTop: '16px',
                  }}>
                    <button
                      onClick={() => onEdit(dept)}
                      style={{
                        ...btn,
                        background: '#2980b9',
                        flex: 1,
                      }}
                      onMouseEnter={(e) => e.target.style.background = '#1f5f97'}
                      onMouseLeave={(e) => e.target.style.background = '#2980b9'}
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(dept._id)}
                      style={{
                        ...btn,
                        background: '#e74c3c',
                        flex: 1,
                      }}
                      onMouseEnter={(e) => e.target.style.background = '#c0392b'}
                      onMouseLeave={(e) => e.target.style.background = '#e74c3c'}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Pagination */}
          {departments.length > 0 && (
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
  padding: '8px 12px',
  color: 'white',
  border: 'none',
  borderRadius: '4px',
  cursor: 'pointer',
  fontSize: '13px',
  fontWeight: '500',
  transition: 'background-color 0.2s ease',
}

export default DepartmentList