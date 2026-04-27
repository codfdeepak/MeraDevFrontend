import { createAsyncThunk } from '@reduxjs/toolkit'
import { API_URL } from '../../config/api'

export const fetchPublicProfile = createAsyncThunk(
  'profile/fetchPublicProfile',
  async (userId, { rejectWithValue }) => {
    try {
      const endpoint = userId ? `/api/profile/public/${userId}` : '/api/profile/public'
      const response = await fetch(`${API_URL}${endpoint}`)

      if (!response.ok) {
        throw new Error('Unable to load profile')
      }

      const data = await response.json()
      return data.profile || null
    } catch (error) {
      return rejectWithValue(error.message || 'Unable to load profile')
    }
  },
)
