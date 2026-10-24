import { useState } from 'react'
import { useSelector } from 'react-redux'
import PageLayout from '../components/common/PageLayout'
import DepartmentList from '../components/departments/DepartmentList'
import DepartmentForm from '../components/departments/DepartmentForm'

function DepartmentsPage() {
  const [showForm, setShowForm] = useState(false)
  const [departmentToEdit, setDepartmentToEdit] = useState(null)
  const { user } = useSelector((state) => state.auth)

  const handleEdit = (department) => {
    setDepartmentToEdit(department)
    setShowForm(true)
  }

  const handleClose = () => {
    setShowForm(false)
    setDepartmentToEdit(null)
  }

  return (
    <PageLayout
      title="Departments"
      subtitle="Manage hospital departments and their head doctors"
      actions={user?.role === 'admin' && (
        <button className="btn btn-primary" onClick={() => setShowForm(true)}>+ Add Department</button>
      )}
    >
      <DepartmentList onEdit={handleEdit} />
      {showForm && <DepartmentForm departmentToEdit={departmentToEdit} onClose={handleClose} />}
    </PageLayout>
  )
}

export default DepartmentsPage
