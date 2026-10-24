import { useState } from 'react'
import { useSelector } from 'react-redux'
import PageLayout from '../components/common/PageLayout'
import AdmissionList from '../components/admissions/AdmissionList'
import AdmissionForm from '../components/admissions/AdmissionForm'

function AdmissionsPage() {
  const [showForm, setShowForm] = useState(false)
  const [admissionToEdit, setAdmissionToEdit] = useState(null)
  const { user } = useSelector((state) => state.auth)

  const handleEdit = (admission) => {
    setAdmissionToEdit(admission)
    setShowForm(true)
  }

  const handleClose = () => {
    setShowForm(false)
    setAdmissionToEdit(null)
  }

  const canAdmit = ['admin', 'receptionist', 'nurse'].includes(user?.role)

  return (
    <PageLayout
      title="Admissions"
      subtitle="Manage patient admissions and discharges"
      actions={canAdmit && (
        <button className="btn btn-primary" onClick={() => setShowForm(true)}>+ Admit Patient</button>
      )}
    >
      <div className="surface">
        <AdmissionList onEdit={handleEdit} />
      </div>
      {showForm && <AdmissionForm admissionToEdit={admissionToEdit} onClose={handleClose} />}
    </PageLayout>
  )
}

export default AdmissionsPage
