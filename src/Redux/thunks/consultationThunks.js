import { createAsyncThunk } from '@reduxjs/toolkit'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'

export const submitConsultationRequest = createAsyncThunk(
  'consultations/submitConsultationRequest',
  async (payload, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_URL}/api/consultations`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      })

      const data = await response.json().catch(() => ({}))
      if (!response.ok) {
        throw new Error(data?.message || 'Unable to submit consultation request')
      }

      return data.consultation
    } catch (error) {
      return rejectWithValue(error.message || 'Unable to submit consultation request')
    }
  },
)
