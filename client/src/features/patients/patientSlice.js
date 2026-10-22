import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'
import { API_BASE } from '../../utils/apiBase'

const API = API_BASE
const getToken = () => localStorage.getItem('token')

const config = () => ({
  headers: { Authorization: `Bearer ${getToken()}` }
})

// Get all patients
export const getPatients = createAsyncThunk('patients/getAll', async (params = {}, thunkAPI) => {
  try {
    const queryParams = new URLSearchParams(
      params.all
        ? { all: 'true' }
        : { page: params.page || 1, limit: params.limit || 10, search: params.search || '' }
    ).toString()
    const res = await axios.get(`${API}/patients?${queryParams}`, config())
    return res.data
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response.data.message)
  }
})

// Get current user's patient profile
export const getMyProfile = createAsyncThunk('patients/getMyProfile', async (_, thunkAPI) => {
  try {
    const res = await axios.get(`${API}/patients/me`, config())
    return res.data
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response.data.message)
  }
})

// Get single patient
export const getPatient = createAsyncThunk('patients/getOne', async (id, thunkAPI) => {
  try {
    const res = await axios.get(`${API}/patients/${id}`, config())
    return res.data
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response.data.message)
  }
})

// Create patient
export const createPatient = createAsyncThunk('patients/create', async (data, thunkAPI) => {
  try {
    const res = await axios.post(`${API}/patients`, data, config())
    return res.data
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response.data.message)
  }
})

// Update patient
export const updatePatient = createAsyncThunk('patients/update', async ({ id, data }, thunkAPI) => {
  try {
    const res = await axios.put(`${API}/patients/${id}`, data, config())
    return res.data
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response.data.message)
  }
})

// Delete patient
export const deletePatient = createAsyncThunk('patients/delete', async (id, thunkAPI) => {
  try {
    await axios.delete(`${API}/patients/${id}`, config())
    return id
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response.data.message)
  }
})

const patientSlice = createSlice({
  name: 'patients',
  initialState: {
    patients: [],
    patient: null,
    isLoading: false,
    error: null,
    total: 0,
    page: 1,
    pages: 1,
    pageSize: 10,
  },
  reducers: {
    clearPatient: (state) => {
      state.patient = null
    }
  },
  extraReducers: (builder) => {
    builder
      // Get all
      .addCase(getPatients.pending, (state) => { state.isLoading = true })
      .addCase(getPatients.fulfilled, (state, action) => {
        state.isLoading = false
        state.patients = action.payload.data || action.payload
        state.total = action.payload.total || 0
        state.page = action.payload.page || 1
        state.pages = action.payload.pages || 1
        state.pageSize = action.payload.pageSize || 10
      })
      .addCase(getPatients.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload
      })
      // Get my profile
      .addCase(getMyProfile.pending, (state) => { state.isLoading = true })
      .addCase(getMyProfile.fulfilled, (state, action) => {
        state.isLoading = false
        state.patient = action.payload
      })
      .addCase(getMyProfile.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload
      })
      // Get one
      .addCase(getPatient.fulfilled, (state, action) => {
        state.patient = action.payload
      })
      // Create
      .addCase(createPatient.fulfilled, (state, action) => {
        const createdPatient = action.payload?.patient || action.payload
        state.patients.push(createdPatient)
      })
      // Update
      .addCase(updatePatient.fulfilled, (state, action) => {
        const updatedPatient = action.payload?.patient || action.payload
        const index = state.patients.findIndex(p => p._id === updatedPatient._id)
        if (index !== -1) state.patients[index] = updatedPatient
      })
      // Delete
      .addCase(deletePatient.fulfilled, (state, action) => {
        state.patients = state.patients.filter(p => p._id !== action.payload)
      })
  }
})

export const { clearPatient } = patientSlice.actions
export default patientSlice.reducer