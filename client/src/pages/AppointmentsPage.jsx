import { useState } from 'react'
import { useSelector } from 'react-redux'
import PageLayout from '../components/common/PageLayout'
import AppointmentList from '../components/appointments/AppointmentList'
import AppointmentForm from '../components/appointments/AppointmentForm'
import AppointmentDetail from '../components/appointments/AppointmentDetail'

const TITLES = {
  patient: 'My Appointments',
  doctor: 'My Schedule',
  receptionist: 'Appointments',
  admin: 'All Appointments',
}

const SUBTITLES = {
  patient: 'View and manage your appointments',
  doctor: 'Your scheduled appointments',
  receptionist: 'Manage all patient appointments',
  admin: 'View and manage all appointments',
}

function AppointmentsPage() {
  const [showForm, setShowForm] = useState(false)
  const [appointmentToEdit, setAppointmentToEdit] = useState(null)
  const [viewingId, setViewingId] = useState(null)
  const { user } = useSelector((state) => state.auth)

  const handleEdit = (appointment) => {
    setAppointmentToEdit(appointment)
    setShowForm(true)
  }

  const handleClose = () => {
    setShowForm(false)
    setAppointmentToEdit(null)
  }

  const canBook = !['doctor', 'nurse', 'lab_staff', 'pharmacist'].includes(user?.role)

  return (
    <PageLayout
      title={TITLES[user?.role] || 'Appointments'}
      subtitle={SUBTITLES[user?.role]}
      actions={canBook && (
        <button className="btn btn-primary" onClick={() => setShowForm(true)}>+ Book Appointment</button>
      )}
    >
      <div className="surface">
        <AppointmentList onEdit={handleEdit} onView={setViewingId} />
      </div>

      {showForm && <AppointmentForm appointmentToEdit={appointmentToEdit} onClose={handleClose} />}
      {viewingId && <AppointmentDetail appointmentId={viewingId} onClose={() => setViewingId(null)} />}
    </PageLayout>
  )
}

export default AppointmentsPage
