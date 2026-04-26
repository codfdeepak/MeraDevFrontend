import { createSlice } from '@reduxjs/toolkit'
import { fetchPublicProfile } from '../thunks/profileThunks'

const initialState = {
  profile: null,
  status: 'idle',
  error: null,
}

const profileSlice = createSlice({
  name: 'profile',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchPublicProfile.pending, (state) => {
        state.status = 'loading'
        state.error = null
        state.profile = null
      })
      .addCase(fetchPublicProfile.fulfilled, (state, action) => {
        state.status = 'loaded'
        state.profile = action.payload
      })
      .addCase(fetchPublicProfile.rejected, (state, action) => {
        state.status = 'error'
        state.error = action.payload || 'Unable to load profile'
        state.profile = null
      })
  },
})

export const selectProfile = (state) => state.profile.profile
export const selectProfileStatus = (state) => state.profile.status
export const selectProfileError = (state) => state.profile.error

export default profileSlice.reducer
