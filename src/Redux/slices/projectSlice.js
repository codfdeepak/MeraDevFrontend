import { createSlice } from '@reduxjs/toolkit'
import { fetchPublicProjects } from '../thunks/projectThunks'

const initialState = {
  items: [],
  status: 'idle',
  error: null,
}

const projectSlice = createSlice({
  name: 'projects',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchPublicProjects.pending, (state) => {
        state.status = 'loading'
        state.error = null
      })
      .addCase(fetchPublicProjects.fulfilled, (state, action) => {
        state.status = 'loaded'
        state.items = action.payload || []
      })
      .addCase(fetchPublicProjects.rejected, (state, action) => {
        state.status = 'error'
        state.error = action.payload || 'Unable to load projects'
      })
  },
})

export const selectProjects = (state) => state.projects.items
export const selectProjectsStatus = (state) => state.projects.status
export const selectProjectsError = (state) => state.projects.error

export default projectSlice.reducer
