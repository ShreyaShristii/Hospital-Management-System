import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'

import { getPatients } from '../../features/patients/patientSlice'
import { getDoctors } from '../../features/doctors/doctorSlice'
import { getAppointments } from '../../features/appointments/appointmentSlice'
import { getBills } from '../../features/bills/billSlice'
import { getStaff } from '../../features/staff/staffSlice'

const styles = `

  .admin-dashboard {
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
    cursor: pointer;
    box-shadow: 0 10px 40px rgba(15, 45, 74, 0.08);
    transition: all 0.2s ease;
    border: 1px solid #e8eef5;
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

  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 22px;
  }

  .card-title {
    font-family: 'Playfair Display', serif;
    color: #0f2d4a;
    font-size: 28px;
    margin: 0;
  }

  .view-btn {
    background: transparent;
    border: 1.5px solid #1a4f7a;
    color: #1a4f7a;
    padding: 8px 16px;
    border-radius: 10px;
    font-size: 13px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s ease;
  }

  .view-btn:hover {
    background: #1a4f7a;
    color: white;
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

  .doctor-table {
    width: 100%;
    border-collapse: collapse;
  }

  .doctor-table thead {
    background: #f8fafc;
  }

  .doctor-th {
    padding: 14px 18px;
    text-align: left;
    color: #6d8299;
    font-size: 13px;
    font-weight: 600;
  }

  .doctor-td {
    padding: 16px 18px;
    color: #0f2d4a;
    font-size: 14px;
    border-bottom: 1px solid #edf2f7;
  }

  .empty-row {
    text-align: center;
    padding: 30px;
    color: #7a8fa6;
    font-size: 14px;
  }

  @media (max-width: 768px) {
    .admin-dashboard {
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

    .doctor-table {
      display: block;
      overflow-x: auto;
    }
  }
`

function AdminDashboard() {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const { patients } = useSelector((state) => state.patients)
  const { doctors } = useSelector((state) => state.doctors)
  const { appointments } = useSelector((state) => state.appointments)
  const { bills } = useSelector((state) => state.bills)
  const { staff } = useSelector((state) => state.staff)

  useEffect(() => {
    dispatch(getPatients({ all: true }))
    dispatch(getDoctors({ all: true }))
    dispatch(getAppointments({ all: true }))
    dispatch(getBills())
    dispatch(getStaff())
  }, [dispatch])

  const stats = [
    {
      label: 'Total Patients',
      value: patients?.length || 0,
      color: '#1a4f7a',
      path: '/patients',
    },
    {
      label: 'Total Doctors',
      value: doctors?.length || 0,
      color: '#1f8f5f',
      path: '/doctors',
    },
    {
      label: 'Appointments',
      value: appointments?.length || 0,
      color: '#7b4bb7',
      path: '/appointments',
    },
    {
      label: 'Bills',
      value: bills?.length || 0,
      color: '#d9822b',
      path: '/bills',
    },
    {
      label: 'Staff Members',
      value: staff?.length || 0,
      color: '#d14b4b',
      path: '/staff',
    },
  ]

  const quickActions = [
    {
      label: '+ Add Staff',
      path: '/staff',
      color: '#0f2d4a',
    },
    {
      label: '+ Add Patient',
      path: '/patients',
      color: '#1a4f7a',
    },
    {
      label: 'Manage Beds',
      path: '/beds',
      color: '#1f8f5f',
    },
    {
      label: 'Departments',
      path: '/departments',
      color: '#7b4bb7',
    },
  ]

  return (
    <>
      <style>{styles}</style>

      <div className="admin-dashboard">

        {/* Header */}
        <div className="dashboard-header">

          <h2 className="dashboard-title">
            Admin Dashboard
          </h2>

          <p className="dashboard-subtitle">
            Welcome back! Here's what's happening in your hospital today.
          </p>

        </div>

        {/* Stats */}
        <div className="stats-grid">

          {stats.map((stat) => (
            <div
              key={stat.label}
              className="stat-card"
              onClick={() => navigate(stat.path)}
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

          <div className="card-header">

            <h3 className="card-title">
              Quick Actions
            </h3>

            <button
              className="view-btn"
              onClick={() => navigate('/profile')}
            >
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

        {/* Recent Doctors */}
        <div className="dashboard-card">

          <div className="card-header">

            <h3 className="card-title">
              Recent Doctors
            </h3>

            <button
              className="view-btn"
              onClick={() => navigate('/doctors')}
            >
              View All
            </button>

          </div>

          <table className="doctor-table">

            <thead>
              <tr>
                <th className="doctor-th">Name</th>
                <th className="doctor-th">Specialization</th>
                <th className="doctor-th">Experience</th>
                <th className="doctor-th">Fee</th>
              </tr>
            </thead>

            <tbody>

              {doctors.slice(0, 5).map((doc) => (
                <tr key={doc._id}>

                  <td className="doctor-td">
                    {doc.userId?.name || 'N/A'}
                  </td>

                  <td className="doctor-td">
                    {doc.specialization}
                  </td>

                  <td className="doctor-td">
                    {doc.yearsOfExperience} yrs
                  </td>

                  <td className="doctor-td">
                    ₹{doc.consultationFee}
                  </td>

                </tr>
              ))}

              {doctors.length === 0 && (
                <tr>
                  <td
                    colSpan="4"
                    className="empty-row"
                  >
                    No doctors yet
                  </td>
                </tr>
              )}

            </tbody>

          </table>

        </div>

      </div>
    </>
  )
}

export default AdminDashboard