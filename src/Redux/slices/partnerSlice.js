import { createSlice } from '@reduxjs/toolkit'
import { fetchPartners } from '../thunks/partnerThunks'

const initialState = {
  items: [],
  status: 'idle',
  error: null,
}

const partnerSlice = createSlice({
  name: 'partners',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchPartners.pending, (state) => {
        state.status = 'loading'
        state.error = null
      })
      .addCase(fetchPartners.fulfilled, (state, action) => {
        state.status = 'loaded'
        state.items = action.payload
      })
      .addCase(fetchPartners.rejected, (state, action) => {
        state.status = 'error'
        state.error = action.payload || 'Unable to load partners'
      })
  },
})

export const selectPartners = (state) => state.partners.items
export const selectPartnersStatus = (state) => state.partners.status
export const selectPartnersError = (state) => state.partners.error

export default partnerSlice.reducer
