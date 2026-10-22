import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'
import { API_BASE } from '../../utils/apiBase';

const API = API_BASE;
const getToken = () => localStorage.getItem('token')
const config = () => ({ headers: { Authorization: `Bearer ${getToken()}` } })

export const getBills = createAsyncThunk('bills/getAll', async (params = {}, thunkAPI) => {
  try {
    const queryParams = new URLSearchParams(
      params.all
        ? { all: 'true' }
        : { page: params.page || 1, limit: params.limit || 10, search: params.search || '' }
    ).toString()
    const res = await axios.get(`${API}/bills?${queryParams}`, config())
    return res.data
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response?.data?.message || 'Failed to fetch bills')
  }
})

export const createBill = createAsyncThunk('bills/create', async (data, thunkAPI) => {
  try {
    const res = await axios.post(`${API}/bills`, data, config())
    return res.data.bill
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response?.data?.message || 'Failed to create bill')
  }
})

export const updateBill = createAsyncThunk('bills/update', async ({ id, data }, thunkAPI) => {
  try {
    const res = await axios.put(`${API}/bills/${id}`, data, config())
    return res.data.bill
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response?.data?.message || 'Failed to update bill')
  }
})

export const deleteBill = createAsyncThunk('bills/delete', async (id, thunkAPI) => {
  try {
    await axios.delete(`${API}/bills/${id}`, config())
    return id
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response?.data?.message || 'Failed to delete bill')
  }
})

export const createPaymentOrder = createAsyncThunk(
  'bills/createOrder',
  async (billId, thunkAPI) => {
    try {
      const res = await axios.post(`${API}/payments/create-order`, { billId }, config())
      return res.data
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data?.message || 'Failed to create order')
    }
  }
)

export const verifyPayment = createAsyncThunk(
  'bills/verifyPayment',
  async (paymentData, thunkAPI) => {
    try {
      const res = await axios.post(`${API}/payments/verify`, paymentData, config())
      return res.data.bill
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data?.message || 'Payment verification failed')
    }
  }
)

const billSlice = createSlice({
  name: 'bills',
  initialState: {
    bills: [],
    isLoading: false,
    isPaymentLoading: false,  // separate loader for payment
    error: null,
    paymentError: null,
    total: 0,
    page: 1,
    pages: 1,
    pageSize: 10,
  },
  reducers: {
    clearBillError: (state) => { state.error = null },
    clearPaymentError: (state) => { state.paymentError = null },
  },
  extraReducers: (builder) => {
    builder

      // ── getBills ─────────────────────────────────────────────────────────
      .addCase(getBills.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(getBills.fulfilled, (state, action) => {
        state.isLoading = false
        state.bills = action.payload.data || action.payload
        state.total = action.payload.total || 0
        state.page = action.payload.page || 1
        state.pages = action.payload.pages || 1
        state.pageSize = action.payload.pageSize || 10
      })
      .addCase(getBills.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload
      })

      // ── createBill ────────────────────────────────────────────────────────
      .addCase(createBill.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(createBill.fulfilled, (state, action) => {
        state.isLoading = false
        state.bills.unshift(action.payload)
      })
      .addCase(createBill.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload
      })

      // ── updateBill ────────────────────────────────────────────────────────
      .addCase(updateBill.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(updateBill.fulfilled, (state, action) => {
        state.isLoading = false
        const index = state.bills.findIndex(b => b._id === action.payload._id)
        if (index !== -1) state.bills[index] = action.payload
      })
      .addCase(updateBill.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload
      })

      // ── deleteBill ────────────────────────────────────────────────────────
      .addCase(deleteBill.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(deleteBill.fulfilled, (state, action) => {
        state.isLoading = false
        state.bills = state.bills.filter(b => b._id !== action.payload)
      })
      .addCase(deleteBill.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload
      })

      // ── createPaymentOrder ────────────────────────────────────────────────
      .addCase(createPaymentOrder.pending, (state) => {
        state.isPaymentLoading = true
        state.paymentError = null
      })
      .addCase(createPaymentOrder.fulfilled, (state) => {
        state.isPaymentLoading = false
      })
      .addCase(createPaymentOrder.rejected, (state, action) => {
        state.isPaymentLoading = false
        state.paymentError = action.payload
      })

      // ── verifyPayment ─────────────────────────────────────────────────────
      .addCase(verifyPayment.pending, (state) => {
        state.isPaymentLoading = true
        state.paymentError = null
      })
      .addCase(verifyPayment.fulfilled, (state, action) => {
        state.isPaymentLoading = false
        // Update the bill in state to show Paid
        const index = state.bills.findIndex(b => b._id === action.payload._id)
        if (index !== -1) state.bills[index] = action.payload
      })
      .addCase(verifyPayment.rejected, (state, action) => {
        state.isPaymentLoading = false
        state.paymentError = action.payload
      })
  }
})

export const { clearBillError, clearPaymentError } = billSlice.actions
export default billSlice.reducer