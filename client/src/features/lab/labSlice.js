import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'
import { API_BASE } from '../../utils/apiBase'

const API = API_BASE
const getToken = () => localStorage.getItem('token')
const config = () => ({ headers: { Authorization: `Bearer ${getToken()}` } })

export const getLabTests = createAsyncThunk('lab/getAll', async (params = {}, thunkAPI) => {
  try {
    const queryParams = new URLSearchParams(
      params.all
        ? { all: 'true' }
        : { page: params.page || 1, limit: params.limit || 10, search: params.search || '' }
    ).toString()
    const res = await axios.get(`${API}/labs?${queryParams}`, config())
    return res.data
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response?.data?.message || 'Failed to fetch lab tests')
  }
})

export const createLabTest = createAsyncThunk('lab/create', async (data, thunkAPI) => {
  try {
    const res = await axios.post(`${API}/labs`, data, config())
    return res.data.lab
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response?.data?.message || 'Failed to order lab test')
  }
})

export const updateLabTest = createAsyncThunk('lab/update', async ({ id, data }, thunkAPI) => {
  try {
    const res = await axios.put(`${API}/labs/${id}`, data, config())
    return res.data.lab
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response?.data?.message || 'Failed to update lab test')
  }
})

export const deleteLabTest = createAsyncThunk('lab/delete', async (id, thunkAPI) => {
  try {
    await axios.delete(`${API}/labs/${id}`, config())
    return id
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response?.data?.message || 'Failed to delete lab test')
  }
})

const labSlice = createSlice({
  name: 'lab',
  initialState: {
    labs: [],
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
      .addCase(getLabTests.pending, (state) => { state.isLoading = true; state.error = null })
      .addCase(getLabTests.fulfilled, (state, action) => {
        state.isLoading = false
        state.labs = action.payload.data || action.payload
        state.total = action.payload.total || 0
        state.page = action.payload.page || 1
        state.pages = action.payload.pages || 1
        state.pageSize = action.payload.pageSize || 10
      })
      .addCase(getLabTests.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload
      })
      .addCase(createLabTest.fulfilled, (state, action) => {
        state.labs.unshift(action.payload)
      })
      .addCase(updateLabTest.fulfilled, (state, action) => {
        const index = state.labs.findIndex(l => l._id === action.payload._id)
        if (index !== -1) state.labs[index] = action.payload
      })
      .addCase(deleteLabTest.fulfilled, (state, action) => {
        state.labs = state.labs.filter(l => l._id !== action.payload)
      })
  }
})

export default labSlice.reducer