import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { getMyProfile } from '../../features/patients/patientSlice'
import { getLabTests } from '../../features/lab/labSlice'
import { fetchCurrentUser } from '../../features/auth/authSlice'

const styles = `

  .patient-dashboard {
    min-height: 100vh;
    background: #f0f4f8;
    padding: 40px;
    font-family: 'DM Sans', sans-serif;
  }

  .dashboard-header {
    margin-bottom: 32px;
  }

  .dashboard-title {
    font-family: 'Playfair Display', serif;
    font-size: 34px;
    color: #0f2d4a;
    margin: 0 0 10px;
  }

  .dashboard-subtitle {
    color: #7a8fa6;
    font-size: 15px;
    margin: 0;
  }

  .dashboard-grid {
    display: grid;
    grid-template-columns: 1.3fr 0.8fr;
    gap: 28px;
  }

  .dashboard-grid > .dashboard-card:nth-child(3) {
    grid-column: 1 / -1;
  }

  .dashboard-card {
    background: #ffffff;
    border-radius: 20px;
    padding: 28px;
    box-shadow: 0 10px 40px rgba(15, 45, 74, 0.08);
  }

  .card-title {
    font-family: 'Playfair Display', serif;
    color: #0f2d4a;
    font-size: 26px;
    margin-bottom: 24px;
  }

  .profile-table {
    width: 100%;
    border-collapse: collapse;
  }

  .profile-row {
    border-bottom: 1px solid #e8eef5;
  }

  .profile-row:last-child {
    border-bottom: none;
  }

  .profile-label {
    padding: 14px 0;
    color: #6d8299;
    font-size: 14px;
    font-weight: 600;
    width: 38%;
  }

  .profile-value {
    padding: 14px 0;
    color: #0f2d4a;
    font-size: 14px;
    font-weight: 500;
  }

  .loading-text {
    color: #7a8fa6;
    font-size: 15px;
  }

  .actions-container {
    display: flex;
    flex-direction: column;
    gap: 14px;
  }

  .action-btn {
    width: 100%;
    padding: 15px 18px;
    border: none;
    border-radius: 12px;
    background: #f8fafc;
    color: #0f2d4a;
    font-size: 14px;
    font-weight: 600;
    font-family: 'DM Sans', sans-serif;
    cursor: pointer;
    text-align: left;
    transition: all 0.2s ease;
    border: 1.5px solid #d8e3ed;
  }

  .action-btn:hover {
    background: #1a4f7a;
    color: white;
    border-color: #1a4f7a;
    transform: translateY(-1px);
  }

  @media (max-width: 900px) {
    .dashboard-grid {
      grid-template-columns: 1fr;
    }
  }

  @media (max-width: 768px) {
    .patient-dashboard {
      padding: 24px;
    }

    .dashboard-title {
      font-size: 28px;
    }

    .dashboard-card {
      padding: 22px;
    }

    .card-title {
      font-size: 22px;
    }
  }
`

function PatientDashboard() {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const { user } = useSelector((state) => state.auth)
  const { patient, isLoading } = useSelector((state) => state.patients)
  const { labs } = useSelector((state) => state.lab)

  useEffect(() => {
    // Restore full user data on page refresh (in case only token info is available)
    dispatch(fetchCurrentUser())
    
    // Fetch current user's patient profile
    dispatch(getMyProfile())
    dispatch(getLabTests({ all: true }))
  }, [dispatch])

  const myProfile = patient
  return (
    <>
      <style>{styles}</style>

      <div className="patient-dashboard">

        <div className="dashboard-header">

          <h2 className="dashboard-title">
            Welcome, {user?.name}
          </h2>

          <p className="dashboard-subtitle">
            Manage your appointments, health records,
            prescriptions, and billing information.
          </p>

        </div>

        <div className="dashboard-grid">

          {/* Profile Card */}
          <div className="dashboard-card">

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 className="card-title" style={{ margin: 0 }}>
                My Profile
              </h3>
              <button
                onClick={() => navigate('/patient-profile')}
                style={{
                  padding: '6px 16px', background: 'none',
                  border: '1.5px solid #0f2d4a', borderRadius: '8px',
                  color: '#0f2d4a', cursor: 'pointer', fontSize: '13px', fontWeight: '600'
                }}>
                Edit
              </button>
            </div>

            {myProfile ? (
              <table className="profile-table">
                <tbody>

                  {[
                    { label: 'Name', value: user?.name },
                    { label: 'Email', value: user?.email },
                    { label: 'Phone', value: user?.phone },
                    { label: 'Age', value: myProfile?.age },
                    { label: 'Gender', value: myProfile?.gender },
                    { label: 'Blood Group', value: myProfile?.bloodGroup },
                    { label: 'Allergies', value: myProfile?.allergies?.length ? myProfile.allergies.join(', ') : 'None' },
                    { label: 'Address', value: myProfile?.address },
                    { label: 'Contact', value: myProfile?.contactNumber },
                    { label: 'Emergency Contact', value: myProfile?.emergencyContact },
                    { label: 'Health Status', value: myProfile?.currentHealthStatus },
                  ].map((row) => (
                    <tr
                      key={row.label}
                      className="profile-row"
                    >
                      <td className="profile-label">
                        {row.label}
                      </td>

                      <td className="profile-value">
                        {row.value || 'N/A'}
                      </td>
                    </tr>
                  ))}

                </tbody>
              </table>
            ) : isLoading ? (
              <p className="loading-text">
                Loading profile...
              </p>
            ) : (
              <p className="loading-text">
                Profile not found...
              </p>
            )}

          </div>

          {/* Quick Actions */}
          <div className="dashboard-card">

            <h3 className="card-title">
              Quick Actions
            </h3>

            <div className="actions-container">

              {[
                {
                  label: 'Book Appointment',
                  path: '/appointments',
                },
                {
                  label: 'View My EMR',
                  path: '/emr',
                },
                {
                  label: 'View Lab Results',
                  path: '/lab',
                },
                {
                  label: 'View Prescriptions',
                  path: '/emr',
                },
                {
                  label: 'View My Bills',
                  path: '/bills',
                },
              ].map((action) => (
                <button
                  key={action.label}
                  className="action-btn"
                  onClick={() => (
                    window.location.href = action.path
                  )}
                >
                  {action.label}
                </button>
              ))}

            </div>

          </div>

          {/* Lab Results Card */}
          <div className="dashboard-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 className="card-title" style={{ margin: 0 }}>My Lab Tests</h3>
              <button
                onClick={() => window.location.href = '/lab'}
                style={{
                  padding: '6px 16px', background: 'none',
                  border: '1.5px solid #0f2d4a', borderRadius: '8px',
                  color: '#0f2d4a', cursor: 'pointer', fontSize: '13px', fontWeight: '600'
                }}>
                View All
              </button>
            </div>

            {labs && labs.length === 0 ? (
              <p style={{ color: '#7a8fa6', fontSize: '14px' }}>No lab tests ordered yet</p>
            ) : (
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ background: '#f0f4f8' }}>
                    <th style={th}>Test Name</th>
                    <th style={th}>Ordered By</th>
                    <th style={th}>Status</th>
                    <th style={th}>Result</th>
                    <th style={th}>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {labs?.slice(0, 5).map((lab) => (
                    <tr key={lab._id} style={{ borderBottom: '1px solid #e8eef5' }}>
                      <td style={td}>{lab.testName}</td>
                      <td style={td}>Dr. {lab.doctorId?.userId?.name || 'N/A'}</td>
                      <td style={td}>
                        <span style={{
                          background:
                            lab.status === 'Completed' ? '#27ae60' :
                            lab.status === 'In Progress' ? '#2980b9' : '#e67e22',
                          color: 'white', padding: '3px 10px',
                          borderRadius: '12px', fontSize: '12px'
                        }}>
                          {lab.status}
                        </span>
                      </td>
                      <td style={td}>{lab.result || '—'}</td>
                      <td style={td}>{new Date(lab.requestedDate).toLocaleDateString('en-IN')}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

        </div>

      </div>
    </>
  )
}

const th = { padding: '10px 16px', textAlign: 'left', color: '#6d8299', fontSize: '13px', fontWeight: '600' }
const td = { padding: '10px 16px', fontSize: '14px', color: '#0f2d4a' }

export default PatientDashboard