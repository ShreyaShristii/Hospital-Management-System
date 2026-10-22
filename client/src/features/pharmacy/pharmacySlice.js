import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'
import { API_BASE } from '../../utils/apiBase'

const API = API_BASE

const getToken = () => localStorage.getItem('token')
const config = () => ({ headers: { Authorization: `Bearer ${getToken()}` } })

export const getMedicines = createAsyncThunk('pharmacy/getAll', async (params = {}, thunkAPI) => {
  try {
    const queryParams = new URLSearchParams({
      page: params.page || 1,
      limit: params.limit || 10,
      search: params.search || '',
    }).toString()
    const res = await axios.get(`${API}/pharmacy?${queryParams}`, config())
    return res.data
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response?.data?.message || 'Failed to fetch medicines')
  }
})

export const getLowStockMedicines = createAsyncThunk('pharmacy/getLowStock', async (_, thunkAPI) => {
  try {
    const res = await axios.get(`${API}/pharmacy/lowstock`, config())
    return res.data
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response?.data?.message || 'Failed to fetch low stock')
  }
})

export const createMedicine = createAsyncThunk('pharmacy/create', async (data, thunkAPI) => {
  try {
    const res = await axios.post(`${API}/pharmacy`, data, config())
    return res.data.medicine
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response?.data?.message || 'Failed to add medicine')
  }
})

export const updateMedicine = createAsyncThunk('pharmacy/update', async ({ id, data }, thunkAPI) => {
  try {
    const res = await axios.put(`${API}/pharmacy/${id}`, data, config())
    return res.data.medicine
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response?.data?.message || 'Failed to update medicine')
  }
})

export const deleteMedicine = createAsyncThunk('pharmacy/delete', async (id, thunkAPI) => {
  try {
    await axios.delete(`${API}/pharmacy/${id}`, config())
    return id
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response?.data?.message || 'Failed to delete medicine')
  }
})

const pharmacySlice = createSlice({
  name: 'pharmacy',
  initialState: {
    medicines: [],
    lowStock: [],
    isLoading: false,
    error: null,
    total: 0,
    page: 1,
    pages: 1,
    pageSize: 10,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getMedicines.pending, (state) => { state.isLoading = true; state.error = null })
      .addCase(getMedicines.fulfilled, (state, action) => {
        state.isLoading = false
        state.medicines = action.payload.data || action.payload
        state.total = action.payload.total || 0
        state.page = action.payload.page || 1
        state.pages = action.payload.pages || 1
        state.pageSize = action.payload.pageSize || 10
      })
      .addCase(getMedicines.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload
      })
      .addCase(getLowStockMedicines.fulfilled, (state, action) => {
        state.lowStock = action.payload
      })
      .addCase(createMedicine.fulfilled, (state, action) => {
        state.medicines.unshift(action.payload)
      })
      .addCase(updateMedicine.fulfilled, (state, action) => {
        const index = state.medicines.findIndex(m => m._id === action.payload._id)
        if (index !== -1) state.medicines[index] = action.payload
      })
      .addCase(deleteMedicine.fulfilled, (state, action) => {
        state.medicines = state.medicines.filter(m => m._id !== action.payload)
      })
  }
})

export default pharmacySlice.reducer