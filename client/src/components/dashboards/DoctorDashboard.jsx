import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'

import { getAppointments } from '../../features/appointments/appointmentSlice'
import { getPatients } from '../../features/patients/patientSlice'

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&family=Playfair+Display:wght@600&display=swap');

  .doctor-dashboard {
    min-height: 100vh;
    background: #f0f4f8;
    padding: 40px;
    font-family: 'DM Sans', sans-serif;
  }

  .dashboard-header {
    margin-bottom: 34px;
  }

  .dashboard-title {
    font-family: 'Playfair Display', serif;
    font-size: 36px;
    color: #0f2d4a;
    margin: 0 0 10px;
  }

  .dashboard-subtitle {
    color: #7a8fa6;
    font-size: 15px;
    margin: 0;
  }

  .stats-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(210px, 1fr));
    gap: 24px;
    margin-bottom: 32px;
  }

  .stat-card {
    background: white;
    border-radius: 20px;
    padding: 28px;
    box-shadow: 0 10px 40px rgba(15, 45, 74, 0.08);
    border: 1px solid #e8eef5;
    transition: all 0.2s ease;
  }

  .stat-card:hover {
    transform: translateY(-4px);
  }

  .stat-label {
    color: #7a8fa6;
    font-size: 14px;
    margin-bottom: 14px;
    font-weight: 500;
  }

  .stat-value {
    font-size: 42px;
    font-weight: 700;
    margin: 0;
  }

  .dashboard-card {
    background: white;
    border-radius: 20px;
    padding: 28px;
    box-shadow: 0 10px 40px rgba(15, 45, 74, 0.08);
    margin-bottom: 32px;
  }

  .card-title {
    font-family: 'Playfair Display', serif;
    color: #0f2d4a;
    font-size: 28px;
    margin: 0 0 22px;
  }

  .actions-wrap {
    display: flex;
    flex-wrap: wrap;
    gap: 14px;
  }

  .action-btn {
    padding: 13px 22px;
    border: none;
    border-radius: 12px;
    color: white;
    font-size: 14px;
    font-weight: 600;
    font-family: 'DM Sans', sans-serif;
    cursor: pointer;
    transition: all 0.2s ease;
  }

  .action-btn:hover {
    transform: translateY(-2px);
    opacity: 0.95;
  }

  .appointments-table {
    width: 100%;
    border-collapse: collapse;
  }

  .appointments-table thead {
    background: #f8fafc;
  }

  .table-th {
    padding: 14px 18px;
    text-align: left;
    color: #6d8299;
    font-size: 13px;
    font-weight: 600;
  }

  .table-td {
    padding: 16px 18px;
    color: #0f2d4a;
    font-size: 14px;
    border-bottom: 1px solid #edf2f7;
  }

  .status-badge {
    display: inline-block;
    padding: 6px 12px;
    border-radius: 20px;
    color: white;
    font-size: 12px;
    font-weight: 600;
    text-transform: capitalize;
  }

  .empty-text {
    text-align: center;
    color: #7a8fa6;
    padding: 28px;
    font-size: 15px;
  }

  @media (max-width: 768px) {
    .doctor-dashboard {
      padding: 24px;
    }

    .dashboard-title {
      font-size: 30px;
    }

    .dashboard-card,
    .stat-card {
      padding: 22px;
    }

    .card-title {
      font-size: 24px;
    }

    .appointments-table {
      display: block;
      overflow-x: auto;
    }
  }
`

function DoctorDashboard() {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const { user } = useSelector((state) => state.auth)
  const { appointments } = useSelector((state) => state.appointments)
  const { patients } = useSelector((state) => state.patients)

  useEffect(() => {
    dispatch(getAppointments({ all: true }))
    dispatch(getPatients({ all: true }))
  }, [dispatch])

  const today = new Date().toISOString().split('T')[0]

  const todayAppointments = appointments.filter(
    (a) => a.appointmentDate?.split('T')[0] === today
  )

  const pendingAppointments = appointments.filter(
    (a) => a.status === 'pending'
  )

  const completedAppointments = appointments.filter(
    (a) => a.status === 'completed'
  )

  const stats = [
    {
      label: "Today's Appointments",
      value: todayAppointments.length,
      color: '#1a4f7a',
    },
    {
      label: 'Pending',
      value: pendingAppointments.length,
      color: '#d9822b',
    },
    {
      label: 'Completed',
      value: completedAppointments.length,
      color: '#1f8f5f',
    },
    {
      label: 'Total Patients',
      value: patients.length,
      color: '#7b4bb7',
    },
  ]

  const quickActions = [
    {
      label: 'My Appointments',
      path: '/appointments',
      color: '#1a4f7a',
    },
    {
      label: 'Write EMR',
      path: '/emr',
      color: '#7b4bb7',
    },
    {
      label: 'Lab Requests',
      path: '/lab',
      color: '#d9822b',
    },
    {
      label: 'My Patients',
      path: '/patients',
      color: '#1f8f5f',
    },
  ]

  return (
    <>
      <style>{styles}</style>

      <div className="doctor-dashboard">

        {/* Header */}
        <div className="dashboard-header">

          <h2 className="dashboard-title">
            Good Morning, Dr. {user?.name}
          </h2>

          <p className="dashboard-subtitle">
            Here's your schedule and appointments for today.
          </p>

        </div>

        {/* Stats */}
        <div className="stats-grid">

          {stats.map((stat) => (
            <div
              key={stat.label}
              className="stat-card"
            >
              <p className="stat-label">
                {stat.label}
              </p>

              <h3
                className="stat-value"
                style={{ color: stat.color }}
              >
                {stat.value}
              </h3>
            </div>
          ))}

        </div>

        {/* Quick Actions */}
        <div className="dashboard-card">

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h3 className="card-title" style={{ margin: 0 }}>
              Quick Actions
            </h3>
            <button
              onClick={() => navigate('/doctor-profile')}
              style={{
                padding: '6px 16px', background: 'none',
                border: '1.5px solid #0f2d4a', borderRadius: '8px',
                color: '#0f2d4a', cursor: 'pointer', fontSize: '13px', fontWeight: '600'
              }}>
              Edit Profile
            </button>
          </div>

          <div className="actions-wrap">

            {quickActions.map((action) => (
              <button
                key={action.label}
                className="action-btn"
                onClick={() => navigate(action.path)}
                style={{
                  background: action.color,
                }}
              >
                {action.label}
              </button>
            ))}

          </div>

        </div>

        {/* Today's Appointments */}
        <div className="dashboard-card">

          <h3 className="card-title">
            Today's Appointments
          </h3>

          {todayAppointments.length === 0 ? (
            <p className="empty-text">
              No appointments today
            </p>
          ) : (
            <table className="appointments-table">

              <thead>
                <tr>
                  <th className="table-th">Patient</th>
                  <th className="table-th">Time</th>
                  <th className="table-th">Reason</th>
                  <th className="table-th">Status</th>
                </tr>
              </thead>

              <tbody>

                {todayAppointments.map((apt) => (
                  <tr key={apt._id}>

                    <td className="table-td">
                      {apt.patientId?.userId?.name || 'N/A'}
                    </td>

                    <td className="table-td">
                      {apt.appointmentTime}
                    </td>

                    <td className="table-td">
                      {apt.reason}
                    </td>

                    <td className="table-td">

                      <span
                        className="status-badge"
                        style={{
                          background:
                            apt.status === 'completed'
                              ? '#1f8f5f'
                              : apt.status === 'pending'
                              ? '#d9822b'
                              : '#d14b4b',
                        }}
                      >
                        {apt.status}
                      </span>

                    </td>

                  </tr>
                ))}

              </tbody>

            </table>
          )}

        </div>

      </div>
    </>
  )
}

export default DoctorDashboard