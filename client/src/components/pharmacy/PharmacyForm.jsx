import { useState, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { createMedicine, updateMedicine } from '../../features/pharmacy/pharmacySlice'

function PharmacyForm({ medicineToEdit, onClose }) {
  const dispatch = useDispatch()

  const [formData, setFormData] = useState({
    medicineName: '',
    category: '',
    manufacturer: '',
    stock: '',
    price: '',
    lowStockAlert: 10,
    expiryDate: '',
  })

  useEffect(() => {
    if (medicineToEdit) {
      setFormData({
        medicineName: medicineToEdit.medicineName || '',
        category: medicineToEdit.category || '',
        manufacturer: medicineToEdit.manufacturer || '',
        stock: medicineToEdit.stock || '',
        price: medicineToEdit.price || '',
        lowStockAlert: medicineToEdit.lowStockAlert || 10,
        expiryDate: medicineToEdit.expiryDate?.split('T')[0] || '',
      })
    }
  }, [medicineToEdit])

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (medicineToEdit) {
      dispatch(updateMedicine({ id: medicineToEdit._id, data: formData }))
    } else {
      dispatch(createMedicine(formData))
    }
    onClose()
  }

  const inputStyle = {
    width: '100%', padding: '8px',
    border: '1px solid #bdc3c7', borderRadius: '4px',
    boxSizing: 'border-box', marginBottom: '12px', fontSize: '14px'
  }

  const labelStyle = {
    display: 'block', marginBottom: '4px',
    color: '#2c3e50', fontWeight: '500', fontSize: '14px'
  }

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0,
      width: '100%', height: '100%',
      background: 'rgba(0,0,0,0.5)',
      display: 'flex', justifyContent: 'center', alignItems: 'center',
      zIndex: 1000,
      padding: '10px'
    }}>
      <div style={{
        background: 'white', padding: '30px',
        borderRadius: '8px', width: '100%', maxWidth: '500px',
        maxHeight: '90vh', overflowY: 'auto'
      }}>
        <h3 style={{ color: '#2c3e50', marginBottom: '20px' }}>
          {medicineToEdit ? 'Edit Medicine' : 'Add Medicine'}
        </h3>

        <form onSubmit={handleSubmit}>

          <label style={labelStyle}>Medicine Name</label>
          <input type="text" name="medicineName" value={formData.medicineName}
            onChange={handleChange} required style={inputStyle}
            placeholder="e.g. Paracetamol 500mg" />

          <label style={labelStyle}>Category</label>
          <select name="category" value={formData.category}
            onChange={handleChange} required style={inputStyle}>
            <option value="">Select Category</option>
            {[
              'Antibiotic', 'Analgesic', 'Antipyretic', 'Antiviral',
              'Antifungal', 'Antihistamine', 'Antacid', 'Antidiabetic',
              'Antihypertensive', 'Cardiac', 'Vitamin/Supplement',
              'Steroid', 'Vaccine', 'Injection', 'Syrup', 'Other'
            ].map(c => <option key={c} value={c}>{c}</option>)}
          </select>

          <label style={labelStyle}>Manufacturer</label>
          <input type="text" name="manufacturer" value={formData.manufacturer}
            onChange={handleChange} required style={inputStyle}
            placeholder="e.g. Sun Pharma" />

          <label style={labelStyle}>Stock (units)</label>
          <input type="number" name="stock" value={formData.stock}
            onChange={handleChange} required min="0" style={inputStyle} />

          <label style={labelStyle}>Price per unit (₹)</label>
          <input type="number" name="price" value={formData.price}
            onChange={handleChange} required min="0" style={inputStyle} />

          <label style={labelStyle}>Low Stock Alert (units)</label>
          <input type="number" name="lowStockAlert" value={formData.lowStockAlert}
            onChange={handleChange} min="0" style={inputStyle} />

          <label style={labelStyle}>Expiry Date</label>
          <input type="date" name="expiryDate" value={formData.expiryDate}
            onChange={handleChange} required style={inputStyle} />

          <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
            <button type="submit" style={{
              flex: 1, padding: '10px', background: '#27ae60',
              color: 'white', border: 'none', borderRadius: '4px',
              cursor: 'pointer', fontWeight: '600'
            }}>
              {medicineToEdit ? 'Update Medicine' : 'Add Medicine'}
            </button>
            <button type="button" onClick={onClose} style={{
              flex: 1, padding: '10px', background: '#e74c3c',
              color: 'white', border: 'none', borderRadius: '4px',
              cursor: 'pointer', fontWeight: '600'
            }}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default PharmacyForm