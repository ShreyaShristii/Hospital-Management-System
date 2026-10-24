import { useState } from 'react'
import { useSelector } from 'react-redux'
import PageLayout from '../components/common/PageLayout'
import BedList from '../components/beds/BedList'
import BedForm from '../components/beds/BedForm'

function BedsPage() {
  const [showForm, setShowForm] = useState(false)
  const [bedToEdit, setBedToEdit] = useState(null)
  const { user } = useSelector((state) => state.auth)

  const handleEdit = (bed) => {
    setBedToEdit(bed)
    setShowForm(true)
  }

  const handleClose = () => {
    setShowForm(false)
    setBedToEdit(null)
  }

  return (
    <PageLayout
      title="Bed Management"
      subtitle="Manage hospital beds and ward assignments"
      actions={user?.role === 'admin' && (
        <button className="btn btn-primary" onClick={() => setShowForm(true)}>+ Add Bed</button>
      )}
    >
      <div className="surface">
        <BedList onEdit={handleEdit} />
      </div>
      {showForm && <BedForm bedToEdit={bedToEdit} onClose={handleClose} />}
    </PageLayout>
  )
}

export default BedsPage
