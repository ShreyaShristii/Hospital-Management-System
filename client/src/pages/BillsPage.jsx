import { useState } from 'react'
import { useSelector } from 'react-redux'
import PageLayout from '../components/common/PageLayout'
import BillList from '../components/bills/BillList'
import BillForm from '../components/bills/BillForm'

function BillsPage() {
  const [showForm, setShowForm] = useState(false)
  const [billToEdit, setBillToEdit] = useState(null)
  const { user } = useSelector((state) => state.auth)

  const handleEdit = (bill) => {
    setBillToEdit(bill)
    setShowForm(true)
  }

  const handleClose = () => {
    setShowForm(false)
    setBillToEdit(null)
  }

  const isPatient = user?.role === 'patient'
  const canCreate = user?.role === 'admin' || user?.role === 'receptionist'

  return (
    <PageLayout
      title={isPatient ? 'My Bills' : 'Bills'}
      subtitle={isPatient ? 'View your billing history' : 'Generate and manage patient bills'}
      actions={canCreate && (
        <button className="btn btn-primary" onClick={() => setShowForm(true)}>+ Generate Bill</button>
      )}
    >
      <div className="surface">
        <BillList onEdit={handleEdit} />
      </div>
      {showForm && <BillForm billToEdit={billToEdit} onClose={handleClose} />}
    </PageLayout>
  )
}

export default BillsPage
