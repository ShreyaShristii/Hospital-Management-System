import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { createBill, updateBill } from '../../features/bills/billSlice'
import { getPatients } from '../../features/patients/patientSlice'
import { getDoctors } from '../../features/doctors/doctorSlice'

function BillForm({ billToEdit, onClose }) {
  const dispatch = useDispatch()
  const { patients } = useSelector((state) => state.patients)
  const { doctors } = useSelector((state) => state.doctors)

  const [formData, setFormData] = useState({
    patientId: '',
    doctorId: '',
    paymentMode: 'Cash',
    paymentStatus: 'Unpaid',
    paymentDate: '',
    amount: '',
  })

  const [items, setItems] = useState([
    { name: '', amount: '' }
  ])

  useEffect(() => {
    dispatch(getPatients({ all: true }))
    dispatch(getDoctors({ all: true }))
  }, [dispatch])

  useEffect(() => {
    if (billToEdit) {
      setFormData({
        patientId: billToEdit.patientId?._id || billToEdit.patientId || '',
        doctorId: billToEdit.doctorId?._id || billToEdit.doctorId || '',
        paymentMode: billToEdit.paymentMode || 'Cash',
        paymentStatus: billToEdit.paymentStatus || 'Unpaid',
        paymentDate: billToEdit.paymentDate?.split('T')[0] || '',
        amount: billToEdit.amount || '',
      })
      setItems(billToEdit.items?.length > 0
        ? billToEdit.items
        : [{ name: '', amount: '' }])
    }
  }, [billToEdit])

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleItemChange = (index, field, value) => {
    const updated = [...items]
    updated[index][field] = value
    setItems(updated)
    const total = updated.reduce((sum, item) => sum + (parseFloat(item.amount) || 0), 0)
    setFormData(prev => ({ ...prev, amount: total }))
  }

  const addItem = () => {
    setItems([...items, { name: '', amount: '' }])
  }

  const removeItem = (index) => {
    const updated = items.filter((_, i) => i !== index)
    setItems(updated)
    const total = updated.reduce((sum, item) => sum + (parseFloat(item.amount) || 0), 0)
    setFormData(prev => ({ ...prev, amount: total }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const payload = { ...formData, items }
    if (billToEdit) {
      dispatch(updateBill({ id: billToEdit._id, data: payload }))
    } else {
      dispatch(createBill(payload))
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
        borderRadius: '8px', width: '100%', maxWidth: '560px',
        maxHeight: '90vh', overflowY: 'auto'
      }}>
        <h3 style={{ color: '#2c3e50', marginBottom: '20px' }}>
          {billToEdit ? 'Edit Bill' : 'Generate Bill'}
        </h3>

        <form onSubmit={handleSubmit}>

          {/* Patient */}
          <label style={labelStyle}>Patient</label>
          <select name="patientId" value={formData.patientId}
            onChange={handleChange} required style={inputStyle}>
            <option value="">Select Patient</option>
            {patients?.map(p => (
              <option key={p._id} value={p._id}>
                {p.userId?.name || 'Unknown'}
              </option>
            ))}
          </select>

          {/* Doctor */}
          <label style={labelStyle}>Doctor</label>
          <select name="doctorId" value={formData.doctorId}
            onChange={handleChange} required style={inputStyle}>
            <option value="">Select Doctor</option>
            {doctors?.map(d => (
              <option key={d._id} value={d._id}>
                Dr. {d.userId?.name} — {d.specialization}
              </option>
            ))}
          </select>

          {/* Bill Items */}
          <div style={{ marginBottom: '12px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
              <label style={{ ...labelStyle, marginBottom: 0 }}>Bill Items</label>
              <button type="button" onClick={addItem} style={{
                padding: '4px 12px', background: '#2980b9',
                color: 'white', border: 'none', borderRadius: '4px',
                cursor: 'pointer', fontSize: '13px'
              }}>+ Add Item</button>
            </div>
            {items.map((item, index) => (
              <div key={index} style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
                <input
                  type="text"
                  placeholder="e.g. Consultation Fee"
                  value={item.name}
                  onChange={(e) => handleItemChange(index, 'name', e.target.value)}
                  style={{ flex: 2, padding: '8px', border: '1px solid #bdc3c7', borderRadius: '4px' }}
                />
                <input
                  type="number"
                  placeholder="Amount ₹"
                  value={item.amount}
                  onChange={(e) => handleItemChange(index, 'amount', e.target.value)}
                  style={{ flex: 1, padding: '8px', border: '1px solid #bdc3c7', borderRadius: '4px' }}
                />
                {items.length > 1 && (
                  <button type="button" onClick={() => removeItem(index)} style={{
                    padding: '8px', background: '#e74c3c',
                    color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer'
                  }}>Remove</button>
                )}
              </div>
            ))}
          </div>

          {/* Total */}
          <div style={{
            background: '#f8f9fa', padding: '12px', borderRadius: '4px',
            marginBottom: '12px', display: 'flex', justifyContent: 'space-between'
          }}>
            <span style={{ fontWeight: '600', color: '#2c3e50' }}>Total Amount:</span>
            <span style={{ fontWeight: '700', fontSize: '18px', color: '#27ae60' }}>
              ₹{formData.amount || 0}
            </span>
          </div>

          {/* Payment Mode */}
          <label style={labelStyle}>Payment Mode</label>
          <select name="paymentMode" value={formData.paymentMode}
            onChange={handleChange} style={inputStyle}>
            <option value="Cash">Cash</option>
            <option value="Card">Card</option>
            <option value="UPI">UPI</option>
          </select>

          {/* Payment Status */}
          <label style={labelStyle}>Payment Status</label>
          <select name="paymentStatus" value={formData.paymentStatus}
            onChange={handleChange} style={inputStyle}>
            <option value="Unpaid">Unpaid</option>
            <option value="Paid">Paid</option>
            <option value="Partial">Partial</option>
          </select>

          {/* Payment Date */}
          <label style={labelStyle}>Payment Date</label>
          <input type="date" name="paymentDate" value={formData.paymentDate}
            onChange={handleChange} style={inputStyle} />

          <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
            <button type="submit" style={{
              flex: 1, padding: '10px', background: '#27ae60',
              color: 'white', border: 'none', borderRadius: '4px',
              cursor: 'pointer', fontWeight: '600'
            }}>
              {billToEdit ? 'Update Bill' : 'Generate Bill'}
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

export default BillForm