import { useState } from 'react'
import PageLayout from '../components/common/PageLayout'
import PatientList from '../components/patients/PatientList'
import PatientForm from '../components/patients/PatientForm'

function PatientsPage() {
  const [showForm, setShowForm] = useState(false)
  const [patientToEdit, setPatientToEdit] = useState(null)

  const handleEdit = (patient) => {
    setPatientToEdit(patient)
    setShowForm(true)
  }

  const handleClose = () => {
    setShowForm(false)
    setPatientToEdit(null)
  }

  return (
    <PageLayout
      title="Patients"
      subtitle="Search, register and update patient records"
      actions={<button className="btn btn-primary" onClick={() => setShowForm(true)}>+ Add Patient</button>}
    >
      <div className="surface">
        <PatientList onEdit={handleEdit} />
      </div>
      {showForm && <PatientForm patientToEdit={patientToEdit} onClose={handleClose} />}
    </PageLayout>
  )
}

export default PatientsPage
