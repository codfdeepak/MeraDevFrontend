import { createAsyncThunk } from '@reduxjs/toolkit'
import { API_URL } from '../../config/api'

export const fetchPublicProjects = createAsyncThunk(
  'projects/fetchPublicProjects',
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_URL}/api/projects`)

      if (!response.ok) {
        throw new Error('Unable to load projects')
      }

      const data = await response.json()
      return data.projects || []
    } catch (error) {
      return rejectWithValue(error.message || 'Unable to load projects')
    }
  },
)
