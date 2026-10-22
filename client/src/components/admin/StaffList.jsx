import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getDoctors, deleteDoctor } from '../../features/doctors/doctorSlice'
import { getStaff, deleteStaff } from '../../features/staff/staffSlice'

function StaffList() {
  const dispatch = useDispatch()
  const { doctors } = useSelector((state) => state.doctors)
  const { staff } = useSelector((state) => state.staff)

  useEffect(() => {
    dispatch(getDoctors({ all: true }))
    dispatch(getStaff())
  }, [dispatch])

  const handleDeleteDoctor = (id) => {
    if (window.confirm('Delete this doctor?')) dispatch(deleteDoctor(id))
  }

  const handleDeleteStaff = (id) => {
    if (window.confirm('Delete this staff member?')) dispatch(deleteStaff(id))
  }

  const roleColor = {
    doctor:       '#2980b9',
    nurse:        '#27ae60',
    receptionist: '#8e44ad',
    'lab staff':  '#e67e22',
    pharmacist:   '#e74c3c',
    administrator:'#7f8c8d',
  }

  const badge = (label) => {
    const key = label?.toLowerCase()
    return (
      <span style={{
        background: roleColor[key] || '#95a5a6',
        color: 'white', padding: '3px 10px',
        borderRadius: '12px', fontSize: '12px'
      }}>{label || 'Unknown'}</span>
    )
  }

  return (
    <div style={{ overflowX: 'auto' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ background: '#2c3e50', color: 'white' }}>
            <th style={th}>Name</th>
            <th style={th}>Email</th>
            <th style={th}>Role</th>
            <th style={th}>Details</th>
            <th style={th}>Actions</th>
          </tr>
        </thead>
        <tbody>

          {/* Doctors */}
          {doctors.map((doctor) => (
            <tr key={doctor._id} style={{ borderBottom: '1px solid #ecf0f1' }}>
              <td style={td}>{doctor.userId?.name || 'N/A'}</td>
              <td style={td}>{doctor.userId?.email || 'N/A'}</td>
              <td style={td}>{badge('Doctor')}</td>
              <td style={td}>
                {doctor.specialization} | {doctor.yearsOfExperience} yrs | ₹{doctor.consultationFee}
              </td>
              <td style={td}>
                <button onClick={() => handleDeleteDoctor(doctor._id)}
                  style={{ ...btn, background: '#e74c3c' }}>Delete</button>
              </td>
            </tr>
          ))}

          {/* Other Staff — position comes from Staff model */}
          {staff.map((member) => (
            <tr key={member._id} style={{ borderBottom: '1px solid #ecf0f1' }}>
              <td style={td}>{member.userId?.name || 'N/A'}</td>
              <td style={td}>{member.userId?.email || 'N/A'}</td>
              <td style={td}>{badge(member.position)}</td>
              <td style={td}>
                {member.department?.name
                  ? `Dept: ${member.department.name}`
                  : member.specialization
                    ? `Specialization: ${member.specialization}`
                    : 'No details'}
              </td>
              <td style={td}>
                <button onClick={() => handleDeleteStaff(member._id)}
                  style={{ ...btn, background: '#e74c3c' }}>Delete</button>
              </td>
            </tr>
          ))}

          {doctors.length === 0 && staff.length === 0 && (
            <tr>
              <td colSpan="5" style={{ textAlign: 'center', padding: '20px', color: '#7f8c8d' }}>
                No staff members found
              </td>
            </tr>
          )}

        </tbody>
      </table>
    </div>
  )
}

const th = { padding: '12px 16px', textAlign: 'left' }
const td = { padding: '12px 16px' }
const btn = { padding: '6px 12px', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }

export default StaffList