import { createSlice } from '@reduxjs/toolkit'
import { fetchPublicServiceById, fetchPublicServices } from '../thunks/serviceThunks'

const initialState = {
  items: [],
  status: 'idle',
  error: null,
  activeService: null,
  detailStatus: 'idle',
  detailError: null,
}

const serviceSlice = createSlice({
  name: 'services',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchPublicServices.pending, (state) => {
        state.status = 'loading'
        state.error = null
      })
      .addCase(fetchPublicServices.fulfilled, (state, action) => {
        state.status = 'loaded'
        state.items = action.payload || []
      })
      .addCase(fetchPublicServices.rejected, (state, action) => {
        state.status = 'error'
        state.error = action.payload || 'Unable to load services'
      })
      .addCase(fetchPublicServiceById.pending, (state) => {
        state.detailStatus = 'loading'
        state.detailError = null
        state.activeService = null
      })
      .addCase(fetchPublicServiceById.fulfilled, (state, action) => {
        state.detailStatus = 'loaded'
        state.activeService = action.payload
      })
      .addCase(fetchPublicServiceById.rejected, (state, action) => {
        state.detailStatus = 'error'
        state.detailError = action.payload || 'Unable to load service details'
        state.activeService = null
      })
  },
})

export const selectServices = (state) => state.services.items
export const selectServicesStatus = (state) => state.services.status
export const selectServicesError = (state) => state.services.error
export const selectActiveService = (state) => state.services.activeService
export const selectServiceDetailStatus = (state) => state.services.detailStatus
export const selectServiceDetailError = (state) => state.services.detailError

export default serviceSlice.reducer
