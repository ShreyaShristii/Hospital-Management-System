import { useSelector } from 'react-redux'
import Navbar from '../components/Navbar'
import AdminDashboard from '../components/dashboards/AdminDashboard'
import DoctorDashboard from '../components/dashboards/DoctorDashboard'
import PatientDashboard from '../components/dashboards/PatientDashboard'
import ReceptionistDashboard from '../components/dashboards/ReceptionistDashboard'
import NurseDashboard from '../components/dashboards/NurseDashboard'
import LabDashboard from '../components/dashboards/LabDashboard'
import PharmacistDashboard from '../components/dashboards/PharmacistDashboard'

function DashboardPage() {
  const { user } = useSelector((state) => state.auth)

  const renderDashboard = () => {
    switch (user?.role) {
      case 'admin': return <AdminDashboard />
      case 'doctor': return <DoctorDashboard />
      case 'patient': return <PatientDashboard />
      case 'receptionist': return <ReceptionistDashboard />
      case 'nurse': return <NurseDashboard />
      case 'lab_staff': return <LabDashboard />
      case 'pharmacist': return <PharmacistDashboard />
      default: return <h2>Unknown Role</h2>
    }
  }

  return (
    <>
      <Navbar />
      <main id="main-content" tabIndex={-1}>{renderDashboard()}</main>
    </>
  )
}

export default DashboardPage