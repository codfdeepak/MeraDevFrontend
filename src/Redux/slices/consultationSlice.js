import { createSlice } from '@reduxjs/toolkit'
import { submitConsultationRequest } from '../thunks/consultationThunks'

const initialState = {
  submitStatus: 'idle',
  submitError: null,
  lastSubmitted: null,
}

const consultationSlice = createSlice({
  name: 'consultations',
  initialState,
  reducers: {
    resetConsultationState(state) {
      state.submitStatus = 'idle'
      state.submitError = null
      state.lastSubmitted = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(submitConsultationRequest.pending, (state) => {
        state.submitStatus = 'loading'
        state.submitError = null
      })
      .addCase(submitConsultationRequest.fulfilled, (state, action) => {
        state.submitStatus = 'succeeded'
        state.lastSubmitted = action.payload || null
      })
      .addCase(submitConsultationRequest.rejected, (state, action) => {
        state.submitStatus = 'failed'
        state.submitError = action.payload || 'Unable to submit consultation request'
      })
  },
})

export const { resetConsultationState } = consultationSlice.actions

export const selectConsultationSubmitStatus = (state) => state.consultations.submitStatus
export const selectConsultationSubmitError = (state) => state.consultations.submitError
export const selectLastConsultation = (state) => state.consultations.lastSubmitted

export default consultationSlice.reducer
