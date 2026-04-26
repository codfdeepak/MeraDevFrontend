import { createAsyncThunk } from '@reduxjs/toolkit'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'

export const fetchPublicHeroSlides = createAsyncThunk(
  'hero/fetchPublicHeroSlides',
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_URL}/api/hero`)

      if (!response.ok) {
        throw new Error('Unable to load hero content')
      }

      const data = await response.json()
      return data.slides || []
    } catch (error) {
      return rejectWithValue(error.message || 'Unable to load hero content')
    }
  },
)
