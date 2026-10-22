import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'
import { API_BASE } from '../../utils/apiBase'

const API = API_BASE
const getToken = () => localStorage.getItem('token')
const config = () => ({ headers: { Authorization: `Bearer ${getToken()}` } })

export const getDepartments = createAsyncThunk('departments/getAll', async (params = {}, thunkAPI) => {
  try {
    const queryParams = new URLSearchParams(
      params.all
        ? { all: 'true' }
        : { page: params.page || 1, limit: params.limit || 10, search: params.search || '' }
    ).toString()
    const res = await axios.get(`${API}/departments?${queryParams}`, config())
    return res.data
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response?.data?.message || 'Failed to fetch departments')
  }
})

export const createDepartment = createAsyncThunk('departments/create', async (data, thunkAPI) => {
  try {
    const res = await axios.post(`${API}/departments`, data, config())
    return res.data.department
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response?.data?.message || 'Failed to create department')
  }
})

export const updateDepartment = createAsyncThunk('departments/update', async ({ id, data }, thunkAPI) => {
  try {
    const res = await axios.put(`${API}/departments/${id}`, data, config())
    return res.data.department
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response?.data?.message || 'Failed to update department')
  }
})

export const deleteDepartment = createAsyncThunk('departments/delete', async (id, thunkAPI) => {
  try {
    await axios.delete(`${API}/departments/${id}`, config())
    return id
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response?.data?.message || 'Failed to delete department')
  }
})

const departmentSlice = createSlice({
  name: 'departments',
  initialState: {
    departments: [],
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
      .addCase(getDepartments.pending, (state) => { state.isLoading = true; state.error = null })
      .addCase(getDepartments.fulfilled, (state, action) => {
        state.isLoading = false
        state.departments = action.payload.data || action.payload
        state.total = action.payload.total || 0
        state.page = action.payload.page || 1
        state.pages = action.payload.pages || 1
        state.pageSize = action.payload.pageSize || 10
      })
      .addCase(getDepartments.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload
      })
      .addCase(createDepartment.fulfilled, (state, action) => {
        state.departments.unshift(action.payload)
      })
      .addCase(createDepartment.rejected, (state, action) => {
        state.error = action.payload
      })
      .addCase(updateDepartment.fulfilled, (state, action) => {
        const index = state.departments.findIndex(d => d._id === action.payload._id)
        if (index !== -1) state.departments[index] = action.payload
      })
      .addCase(deleteDepartment.fulfilled, (state, action) => {
        state.departments = state.departments.filter(d => d._id !== action.payload)
      })
  }
})

export default departmentSlice.reducer