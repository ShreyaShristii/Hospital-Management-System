import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'
import { API_BASE } from '../../utils/apiBase'

const API = API_BASE
const getToken = () => localStorage.getItem('token')
const config = () => ({ headers: { Authorization: `Bearer ${getToken()}` } })

export const getReviews = createAsyncThunk('reviews/getAll', async (params = {}, thunkAPI) => {
  try {
    const queryParams = new URLSearchParams(
      params.all
        ? { all: 'true' }
        : { page: params.page || 1, limit: params.limit || 10, search: params.search || '' }
    ).toString()
    const res = await axios.get(`${API}/reviews?${queryParams}`, config())
    return res.data
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response?.data?.message || 'Failed to fetch reviews')
  }
})

export const createReview = createAsyncThunk('reviews/create', async (data, thunkAPI) => {
  try {
    const res = await axios.post(`${API}/reviews`, data, config())
    return res.data.review
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response?.data?.message || 'Failed to submit review')
  }
})

export const updateReview = createAsyncThunk('reviews/update', async ({ id, data }, thunkAPI) => {
  try {
    const res = await axios.put(`${API}/reviews/${id}`, data, config())
    return res.data.review
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response?.data?.message || 'Failed to update review')
  }
})

export const deleteReview = createAsyncThunk('reviews/delete', async (id, thunkAPI) => {
  try {
    await axios.delete(`${API}/reviews/${id}`, config())
    return id
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response?.data?.message || 'Failed to delete review')
  }
})

const reviewSlice = createSlice({
  name: 'reviews',
  initialState: {
    reviews: [],
    isLoading: false,
    error: null,
    total: 0,
    page: 1,
    pages: 1,
    pageSize: 10,
  },
  reducers: {
    clearReviewError: (state) => { state.error = null }
  },
  extraReducers: (builder) => {
    builder
      .addCase(getReviews.pending, (state) => { state.isLoading = true; state.error = null })
      .addCase(getReviews.fulfilled, (state, action) => {
        state.isLoading = false
        state.reviews = action.payload.data || action.payload
        state.total = action.payload.total || 0
        state.page = action.payload.page || 1
        state.pages = action.payload.pages || 1
        state.pageSize = action.payload.pageSize || 10
      })
      .addCase(getReviews.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload
      })
      .addCase(createReview.fulfilled, (state) => {
        // Don't manually add - let getReviews fetch all reviews instead
        // This ensures the complete list is always in sync with the server
        state.error = null
      })
      .addCase(createReview.rejected, (state, action) => {
        state.error = action.payload
      })
      .addCase(updateReview.fulfilled, (state, action) => {
        const index = state.reviews.findIndex(r => r._id === action.payload._id)
        if (index !== -1) state.reviews[index] = action.payload
      })
      .addCase(deleteReview.fulfilled, (state, action) => {
        state.reviews = state.reviews.filter(r => r._id !== action.payload)
      })
  }
})

export const { clearReviewError } = reviewSlice.actions
export default reviewSlice.reducer