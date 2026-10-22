import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { getPatients } from '../../features/patients/patientSlice'

function NurseDashboard() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { patients } = useSelector((state) => state.patients)

  useEffect(() => {
    dispatch(getPatients({ all: true }))
  }, [dispatch])

  const critical = patients.filter(p => p.currentHealthStatus === 'Critical')
  const underObservation = patients.filter(p => p.currentHealthStatus === 'Under Observation')

  const stats = [
    { label: 'Total Patients', value: patients.length, color: '#2980b9' },
    { label: 'Critical', value: critical.length, color: '#e74c3c' },
    { label: 'Under Observation', value: underObservation.length, color: '#e67e22' },
  ]

  return (
    <div style={{ padding: '30px', background: '#f4f6f9', minHeight: '100vh' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px' }}>
        <div>
          <h2 style={{ color: '#2c3e50', marginBottom: '8px' }}>Nurse Dashboard</h2>
          <p style={{ color: '#7f8c8d', fontSize: '14px', margin: 0 }}>
            Monitor patient health and admissions.
          </p>
        </div>
        <button
          onClick={() => navigate('/staff-profile')}
          style={{
            padding: '8px 18px', background: 'none',
            border: '1.5px solid #2c3e50', borderRadius: '8px',
            color: '#2c3e50', cursor: 'pointer', fontSize: '13px', fontWeight: '600'
          }}>
          Edit Profile
        </button>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
        gap: '20px', marginBottom: '30px'
      }}>
        {stats.map((stat) => (
          <div key={stat.label} style={{
            background: 'white', borderRadius: '8px',
            padding: '24px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
            borderTop: `4px solid ${stat.color}`
          }}>
            <p style={{ color: '#7f8c8d', fontSize: '13px', marginBottom: '8px' }}>{stat.label}</p>
            <h3 style={{ fontSize: '36px', color: stat.color, margin: 0 }}>{stat.value}</h3>
          </div>
        ))}
      </div>

      <div style={{
        background: 'white', borderRadius: '8px',
        padding: '24px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
        marginBottom: '30px'
      }}>
        <h3 style={{ color: '#2c3e50', marginBottom: '16px' }}>Quick Actions</h3>
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          {[
            { label: 'View Patients', path: '/patients', color: '#2980b9' },
            { label: 'Admissions', path: '/admissions', color: '#27ae60' },
          ].map((action) => (
            <button key={action.label} onClick={() => navigate(action.path)} style={{
              padding: '10px 20px', background: action.color,
              color: 'white', border: 'none', borderRadius: '6px',
              cursor: 'pointer', fontWeight: '500', fontSize: '14px'
            }}>{action.label}</button>
          ))}
        </div>
      </div>

      {/* Critical Patients */}
      <div style={{
        background: 'white', borderRadius: '8px',
        padding: '24px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
      }}>
        <h3 style={{ color: '#e74c3c', marginBottom: '16px' }}>Critical Patients</h3>
        {critical.length === 0 ? (
          <p style={{ color: '#7f8c8d', textAlign: 'center', padding: '20px' }}>
            No critical patients
          </p>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#f8f9fa' }}>
                <th style={th}>Name</th>
                <th style={th}>Blood Group</th>
                <th style={th}>Contact</th>
                <th style={th}>Status</th>
              </tr>
            </thead>
            <tbody>
              {critical.map((p) => (
                <tr key={p._id} style={{ borderBottom: '1px solid #ecf0f1' }}>
                  <td style={td}>{p.userId?.name || 'N/A'}</td>
                  <td style={td}>{p.bloodGroup}</td>
                  <td style={td}>{p.contactNumber}</td>
                  <td style={td}>
                    <span style={{
                      background: '#e74c3c', color: 'white',
                      padding: '3px 10px', borderRadius: '12px', fontSize: '12px'
                    }}>Critical</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}

const th = { padding: '10px 16px', textAlign: 'left', color: '#7f8c8d', fontSize: '13px' }
const td = { padding: '10px 16px', fontSize: '14px' }

export default NurseDashboard