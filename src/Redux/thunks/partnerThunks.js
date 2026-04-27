import { createAsyncThunk } from '@reduxjs/toolkit'
import { API_URL } from '../../config/api'

export const fetchPartners = createAsyncThunk('partners/fetchPartners', async (_, { rejectWithValue }) => {
  try {
    const response = await fetch(`${API_URL}/api/profile/partners`)

    if (!response.ok) {
      throw new Error('Unable to load partners')
    }

    const data = await response.json()
    return data.partners || []
  } catch (error) {
    return rejectWithValue(error.message || 'Unable to load partners')
  }
})
