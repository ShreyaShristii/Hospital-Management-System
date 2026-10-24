import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Navbar from '../components/Navbar'
import PharmacyList from '../components/pharmacy/PharmacyList'
import PharmacyForm from '../components/pharmacy/PharmacyForm'
import { getLowStockMedicines } from '../features/pharmacy/pharmacySlice'

function PharmacyPage() {
  const [showForm, setShowForm] = useState(false)
  const [medicineToEdit, setMedicineToEdit] = useState(null)
  const { user } = useSelector((state) => state.auth)
  const { lowStock } = useSelector((state) => state.pharmacy)
  const dispatch = useDispatch()

  useEffect(() => {
    if (user?.role === 'admin' || user?.role === 'pharmacist') {
      dispatch(getLowStockMedicines())
    }
  }, [dispatch, user?.role])

  const handleEdit = (medicine) => {
    setMedicineToEdit(medicine)
    setShowForm(true)
  }

  const handleClose = () => {
    setShowForm(false)
    setMedicineToEdit(null)
  }

  const canManage = user?.role === 'admin' || user?.role === 'pharmacist'

  return (
    <div>
      <Navbar />
      <div style={{ padding: '30px', background: '#f4f6f9', minHeight: '100vh' }}>

        {/* Low Stock Alert Banner */}
        {canManage && lowStock.length > 0 && (
          <div style={{
            background: '#fdf0ed', border: '1px solid #e74c3c',
            borderRadius: '8px', padding: '12px 20px',
            marginBottom: '20px', display: 'flex',
            alignItems: 'center', gap: '10px'
          }}>
            <span style={{ fontSize: '12px', fontWeight: '700', color: '#e74c3c' }}>ALERT</span>
            <span style={{ color: '#e74c3c', fontWeight: '600' }}>
              {lowStock.length} medicine{lowStock.length > 1 ? 's' : ''} running low on stock:
            </span>
            <span style={{ color: '#c0392b', fontSize: '14px' }}>
              {lowStock.map(m => m.medicineName).join(', ')}
            </span>
          </div>
        )}

        <div style={{
          display: 'flex', justifyContent: 'space-between',
          alignItems: 'center', marginBottom: '24px'
        }}>
          <div>
            <h2 style={{ color: '#2c3e50', marginBottom: '4px' }}>
              {user?.role === 'doctor' ? 'Medicine Reference' : 'Pharmacy Inventory'}
            </h2>
            <p style={{ color: '#7f8c8d', fontSize: '14px' }}>
              {canManage && 'Manage medicine stock, prices and expiry dates'}
              {user?.role === 'doctor' && 'Browse available medicines for prescriptions'}
              {user?.role === 'nurse' && 'View medicine inventory'}
            </p>
          </div>
          {canManage && (
            <button onClick={() => setShowForm(true)} style={{
              padding: '10px 20px', background: '#2c3e50',
              color: 'white', border: 'none', borderRadius: '4px',
              cursor: 'pointer', fontWeight: '600'
            }}>
              + Add Medicine
            </button>
          )}
        </div>

        <div style={{
          background: 'white', borderRadius: '8px',
          padding: '24px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
        }}>
          <PharmacyList onEdit={handleEdit} />
        </div>

        {showForm && (
          <PharmacyForm medicineToEdit={medicineToEdit} onClose={handleClose} />
        )}
      </div>
    </div>
  )
}

export default PharmacyPage