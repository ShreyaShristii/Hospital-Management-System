import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'
import { API_BASE } from '../../utils/apiBase'

const API = API_BASE
const getToken = () => localStorage.getItem('token')
const config = () => ({ headers: { Authorization: `Bearer ${getToken()}` } })

export const getAdmissions = createAsyncThunk('admissions/getAll', async (params = {}, thunkAPI) => {
  try {
    const queryParams = new URLSearchParams({
      page: params.page || 1,
      limit: params.limit || 10,
      search: params.search || '',
    }).toString()
    const res = await axios.get(`${API}/admissions?${queryParams}`, config())
    return res.data
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response?.data?.message || 'Failed to fetch admissions')
  }
})

export const createAdmission = createAsyncThunk('admissions/create', async (data, thunkAPI) => {
  try {
    const res = await axios.post(`${API}/admissions`, data, config())
    return res.data.admission
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response?.data?.message || 'Failed to admit patient')
  }
})

export const updateAdmission = createAsyncThunk('admissions/update', async ({ id, data }, thunkAPI) => {
  try {
    const res = await axios.put(`${API}/admissions/${id}`, data, config())
    return res.data.admission
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response?.data?.message || 'Failed to update admission')
  }
})

const admissionSlice = createSlice({
  name: 'admissions',
  initialState: {
    admissions: [],
    isLoading: false,
    error: null,
    total: 0,
    page: 1,
    pages: 1,
    pageSize: 10,
  },
  reducers: {
    clearAdmissionError: (state) => { state.error = null }
  },
  extraReducers: (builder) => {
    builder
      .addCase(getAdmissions.pending, (state) => { state.isLoading = true; state.error = null })
      .addCase(getAdmissions.fulfilled, (state, action) => {
        state.isLoading = false
        state.admissions = action.payload.data || action.payload
        state.total = action.payload.total || 0
        state.page = action.payload.page || 1
        state.pages = action.payload.pages || 1
        state.pageSize = action.payload.pageSize || 10
      })
      .addCase(getAdmissions.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload
      })
      .addCase(createAdmission.fulfilled, (state, action) => {
        state.admissions.unshift(action.payload)
      })
      .addCase(createAdmission.rejected, (state, action) => {
        state.error = action.payload
      })
      .addCase(updateAdmission.fulfilled, (state, action) => {
        const index = state.admissions.findIndex(a => a._id === action.payload._id)
        if (index !== -1) state.admissions[index] = action.payload
      })
      .addCase(updateAdmission.rejected, (state, action) => {
        state.error = action.payload
      })
  }
})

export const { clearAdmissionError } = admissionSlice.actions
export default admissionSlice.reducer