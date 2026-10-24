import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { createPaymentOrder, verifyPayment } from '../../features/bills/billSlice'
import { useToast } from '../common/Toast'

function PaymentModal({ bill, onClose, onSuccess }) {
  const dispatch = useDispatch()
  const { notify } = useToast()

  useEffect(() => {
    // Load Razorpay script dynamically
    const script = document.createElement('script')
    script.src = 'https://checkout.razorpay.com/v1/checkout.js'
    script.async = true
    document.body.appendChild(script)
    return () => document.body.removeChild(script)
  }, [])

  const handlePayment = async () => {
    // Step 1 — get order from backend
    const result = await dispatch(createPaymentOrder(bill._id))
    if (result.error) {
      notify('We could not start the payment. Please try again.', 'error')
      return
    }

    const { orderId, amount, currency, keyId } = result.payload

    // Step 2 — open Razorpay checkout
    const options = {
      key: keyId,
      amount,
      currency,
      name: 'Hospital Management System',
      description: `Bill Payment — ${bill.patientId?.userId?.name || 'Patient'}`,
      order_id: orderId,
      handler: async (response) => {
        // Step 3 — verify on backend
        const verifyResult = await dispatch(verifyPayment({
          razorpay_order_id: response.razorpay_order_id,
          razorpay_payment_id: response.razorpay_payment_id,
          razorpay_signature: response.razorpay_signature,
          billId: bill._id,
        }))

        if (verifyResult.meta.requestStatus === 'fulfilled') {
          notify('Payment successful. Your bill is now marked as paid.', 'success')
          onSuccess()
          onClose()
        } else {
          notify('Payment verification failed. If you were charged, contact support.', 'error')
        }
      },
      prefill: {
        name: bill.patientId?.userId?.name || '',
      },
      theme: { color: '#2c3e50' },
      modal: {
        ondismiss: () => onClose()
      }
    }

    const rzp = new window.Razorpay(options)
    rzp.open()
  }

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0,
      width: '100%', height: '100%',
      background: 'rgba(0,0,0,0.5)',
      display: 'flex', justifyContent: 'center', alignItems: 'center',
      zIndex: 1000
    }}>
      <div style={{
        background: 'white', padding: '30px',
        borderRadius: '8px', width: '420px'
      }}>
        <h3 style={{ color: '#2c3e50', marginBottom: '20px' }}>Confirm Payment</h3>

        <div style={{ background: '#f8f9fa', padding: '16px', borderRadius: '6px', marginBottom: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ color: '#7f8c8d' }}>Patient</span>
            <span style={{ fontWeight: '600' }}>{bill.patientId?.userId?.name || 'N/A'}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ color: '#7f8c8d' }}>Doctor</span>
            <span style={{ fontWeight: '600' }}>Dr. {bill.doctorId?.userId?.name || 'N/A'}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ color: '#7f8c8d' }}>Items</span>
            <span style={{ fontWeight: '600' }}>{bill.items?.length || 0} item(s)</span>
          </div>
          <div style={{
            display: 'flex', justifyContent: 'space-between',
            borderTop: '1px solid #dee2e6', paddingTop: '8px', marginTop: '8px'
          }}>
            <span style={{ color: '#2c3e50', fontWeight: '600' }}>Total Amount</span>
            <span style={{ fontWeight: '700', fontSize: '18px', color: '#27ae60' }}>₹{bill.amount}</span>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button onClick={handlePayment} style={{
            flex: 1, padding: '12px', background: '#27ae60',
            color: 'white', border: 'none', borderRadius: '4px',
            cursor: 'pointer', fontWeight: '600', fontSize: '15px'
          }}>
            Pay ₹{bill.amount}
          </button>
          <button onClick={onClose} style={{
            flex: 1, padding: '12px', background: '#e74c3c',
            color: 'white', border: 'none', borderRadius: '4px',
            cursor: 'pointer', fontWeight: '600'
          }}>
            Cancel
          </button>
        </div>

        <p style={{ color: '#95a5a6', fontSize: '12px', textAlign: 'center', marginTop: '12px' }}>
          Secured by Razorpay — UPI, Cards, NetBanking accepted
        </p>
      </div>
    </div>
  )
}

export default PaymentModal