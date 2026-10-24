import { useState } from 'react'
import PageLayout from '../components/common/PageLayout'
import DoctorList from '../components/doctors/DoctorList'
import DoctorForm from '../components/doctors/DoctorForm'

function DoctorsPage() {
  const [showForm, setShowForm] = useState(false)
  const [doctorToEdit, setDoctorToEdit] = useState(null)

  const handleEdit = (doctor) => {
    setDoctorToEdit(doctor)
    setShowForm(true)
  }

  const handleClose = () => {
    setShowForm(false)
    setDoctorToEdit(null)
  }

  return (
    <PageLayout
      title="Doctors"
      subtitle="Browse specialists and manage their profiles"
      actions={<button className="btn btn-primary" onClick={() => setShowForm(true)}>+ Add Doctor</button>}
    >
      <div className="surface">
        <DoctorList onEdit={handleEdit} />
      </div>
      {showForm && <DoctorForm doctorToEdit={doctorToEdit} onClose={handleClose} />}
    </PageLayout>
  )
}

export default DoctorsPage
