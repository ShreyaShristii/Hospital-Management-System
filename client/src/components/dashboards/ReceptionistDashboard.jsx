import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { getAppointments } from '../../features/appointments/appointmentSlice'
import { getPatients } from '../../features/patients/patientSlice'
import { getBills } from '../../features/bills/billSlice'

function ReceptionistDashboard() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { appointments } = useSelector((state) => state.appointments)
  const { patients } = useSelector((state) => state.patients)
  const { bills } = useSelector((state) => state.bills)

  useEffect(() => {
    dispatch(getAppointments({ all: true }))
    dispatch(getPatients({ all: true }))
    dispatch(getBills({ all: true }))
  }, [dispatch])

  const today = new Date().toISOString().split('T')[0]
  const todayAppointments = appointments.filter(a =>
    a.appointmentDate?.split('T')[0] === today
  )
  const pendingBills = bills.filter(b => b.paymentStatus === 'pending')

  const stats = [
    { label: "Today's Appointments", value: todayAppointments.length, color: '#2980b9' },
    { label: 'Total Patients', value: patients.length, color: '#27ae60' },
    { label: 'Pending Bills', value: pendingBills.length, color: '#e74c3c' },
    { label: 'Total Appointments', value: appointments.length, color: '#8e44ad' },
  ]

  return (
    <div style={{ padding: '30px', background: '#f4f6f9', minHeight: '100vh' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px' }}>
        <div>
          <h2 style={{ color: '#2c3e50', marginBottom: '8px' }}>Receptionist Dashboard</h2>
          <p style={{ color: '#7f8c8d', fontSize: '14px', margin: 0 }}>
            Manage appointments, patients and billing.
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
            { label: '+ New Appointment', path: '/appointments', color: '#2980b9' },
            { label: '+ Register Patient', path: '/patients', color: '#27ae60' },
            { label: 'Generate Bill', path: '/bills', color: '#e67e22' },
            { label: 'Manage Beds', path: '/beds', color: '#8e44ad' },
          ].map((action) => (
            <button key={action.label} onClick={() => navigate(action.path)} style={{
              padding: '10px 20px', background: action.color,
              color: 'white', border: 'none', borderRadius: '6px',
              cursor: 'pointer', fontWeight: '500', fontSize: '14px'
            }}>{action.label}</button>
          ))}
        </div>
      </div>
    </div>
  )
}

export default ReceptionistDashboard