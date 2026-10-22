import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'
import { API_BASE } from '../../utils/apiBase'

const API = API_BASE
const getToken = () => localStorage.getItem('token')
const config = () => ({
  headers: { Authorization: `Bearer ${getToken()}` }
})

export const getDoctors = createAsyncThunk('doctors/getAll', async (params = {}, thunkAPI) => {
  try {
    const queryParams = new URLSearchParams(
      params.all
        ? { all: 'true' }
        : { page: params.page || 1, limit: params.limit || 10, search: params.search || '' }
    ).toString()
    const res = await axios.get(`${API}/doctors?${queryParams}`, config())
    return res.data
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response.data.message)
  }
})

export const getDoctor = createAsyncThunk('doctors/getOne', async (id, thunkAPI) => {
  try {
    const res = await axios.get(`${API}/doctors/${id}`, config())
    return res.data
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response.data.message)
  }
})

export const createDoctor = createAsyncThunk('doctors/create', async (data, thunkAPI) => {
  try {
    const res = await axios.post(`${API}/doctors`, data, config())
    return res.data
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response.data.message)
  }
})

export const updateDoctor = createAsyncThunk('doctors/update', async ({ id, data }, thunkAPI) => {
  try {
    const res = await axios.put(`${API}/doctors/${id}`, data, config())
    return res.data
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response.data.message)
  }
})

export const deleteDoctor = createAsyncThunk('doctors/delete', async (id, thunkAPI) => {
  try {
    await axios.delete(`${API}/doctors/${id}`, config())
    return id
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response.data.message)
  }
})

const doctorSlice = createSlice({
  name: 'doctors',
  initialState: {
    doctors: [],
    doctor: null,
    isLoading: false,
    error: null,
    total: 0,
    page: 1,
    pages: 1,
    pageSize: 10,
  },
  reducers: {
    clearDoctor: (state) => { state.doctor = null }
  },
  extraReducers: (builder) => {
    builder
      .addCase(getDoctors.pending, (state) => { state.isLoading = true })
      .addCase(getDoctors.fulfilled, (state, action) => {
        state.isLoading = false
        state.doctors = action.payload.data || action.payload
        state.total = action.payload.total || 0
        state.page = action.payload.page || 1
        state.pages = action.payload.pages || 1
        state.pageSize = action.payload.pageSize || 10
      })
      .addCase(getDoctors.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload
      })
      .addCase(getDoctor.fulfilled, (state, action) => {
        state.doctor = action.payload
      })
      .addCase(createDoctor.fulfilled, (state, action) => {
        state.doctors.push(action.payload.doctor)
      })
      .addCase(updateDoctor.fulfilled, (state, action) => {
        const index = state.doctors.findIndex(d => d._id === action.payload._id)
        if (index !== -1) state.doctors[index] = action.payload
      })
      .addCase(deleteDoctor.fulfilled, (state, action) => {
        state.doctors = state.doctors.filter(d => d._id !== action.payload)
      })
  }
})

export const { clearDoctor } = doctorSlice.actions
export default doctorSlice.reducer