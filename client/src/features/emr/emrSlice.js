import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'
import { API_BASE } from '../../utils/apiBase'

const API = API_BASE
const getToken = () => localStorage.getItem('token')
const config = () => ({ headers: { Authorization: `Bearer ${getToken()}` } })

export const getEMRs = createAsyncThunk('emr/getAll', async (params = {}, thunkAPI) => {
  try {
    const queryParams = new URLSearchParams({
      page: params.page || 1,
      limit: params.limit || 10,
      search: params.search || '',
    }).toString()
    const res = await axios.get(`${API}/emrs?${queryParams}`, config())
    return res.data
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response?.data?.message || 'Failed to fetch EMRs')
  }
})

export const getEMRById = createAsyncThunk('emr/getById', async (id, thunkAPI) => {
  try {
    const res = await axios.get(`${API}/emrs/${id}`, config())
    return res.data
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response?.data?.message || 'Failed to fetch EMR')
  }
})

export const createEMR = createAsyncThunk('emr/create', async (data, thunkAPI) => {
  try {
    const res = await axios.post(`${API}/emrs`, data, config())
    return res.data.emr
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response?.data?.message || 'Failed to create EMR')
  }
})

export const updateEMR = createAsyncThunk('emr/update', async ({ id, data }, thunkAPI) => {
  try {
    const res = await axios.put(`${API}/emrs/${id}`, data, config())
    return res.data.emr
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response?.data?.message || 'Failed to update EMR')
  }
})

export const deleteEMR = createAsyncThunk('emr/delete', async (id, thunkAPI) => {
  try {
    await axios.delete(`${API}/emrs/${id}`, config())
    return id
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response?.data?.message || 'Failed to delete EMR')
  }
})

const emrSlice = createSlice({
  name: 'emr',
  initialState: {
    emrs: [],
    selectedEMR: null,
    total: 0,
    page: 1,
    pages: 1,
    pageSize: 10,
    isLoading: false,
    error: null,
  },
  reducers: {
    clearSelectedEMR: (state) => { state.selectedEMR = null },
    clearEMRError: (state) => { state.error = null },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getEMRs.pending, (state) => { state.isLoading = true; state.error = null })
      .addCase(getEMRs.fulfilled, (state, action) => {
        state.isLoading = false
        state.emrs = action.payload.data || action.payload
        state.total = action.payload.total || 0
        state.page = action.payload.page || 1
        state.pages = action.payload.pages || 1
        state.pageSize = action.payload.pageSize || 10
      })
      .addCase(getEMRs.rejected, (state, action) => { state.isLoading = false; state.error = action.payload })

      .addCase(getEMRById.pending, (state) => { state.isLoading = true })
      .addCase(getEMRById.fulfilled, (state, action) => {
        state.isLoading = false
        state.selectedEMR = action.payload
      })
      .addCase(getEMRById.rejected, (state, action) => { state.isLoading = false; state.error = action.payload })

      .addCase(createEMR.fulfilled, (state, action) => {
        state.emrs.unshift(action.payload)
        state.total += 1
      })
      .addCase(updateEMR.fulfilled, (state, action) => {
        const index = state.emrs.findIndex(e => e._id === action.payload._id)
        if (index !== -1) state.emrs[index] = action.payload
      })
      .addCase(deleteEMR.fulfilled, (state, action) => {
        state.emrs = state.emrs.filter(e => e._id !== action.payload)
        state.total -= 1
      })
  }
})

export const { clearSelectedEMR, clearEMRError } = emrSlice.actions
export default emrSlice.reducer