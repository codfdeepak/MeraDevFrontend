import { createAsyncThunk } from '@reduxjs/toolkit'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'

export const fetchPublicServices = createAsyncThunk(
  'services/fetchPublicServices',
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_URL}/api/services`)

      if (!response.ok) {
        throw new Error('Unable to load services')
      }

      const data = await response.json()
      return data.services || []
    } catch (error) {
      return rejectWithValue(error.message || 'Unable to load services')
    }
  },
)

export const fetchPublicServiceById = createAsyncThunk(
  'services/fetchPublicServiceById',
  async (serviceId, { rejectWithValue }) => {
    try {
      if (!serviceId) {
        throw new Error('Service id is required')
      }

      const response = await fetch(`${API_URL}/api/services/${serviceId}`)
      if (!response.ok) {
        const data = await response.json().catch(() => ({}))
        throw new Error(data?.message || 'Unable to load service details')
      }

      const data = await response.json()
      return data.service || null
    } catch (error) {
      return rejectWithValue(error.message || 'Unable to load service details')
    }
  },
)
