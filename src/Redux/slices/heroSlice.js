import { createSlice } from '@reduxjs/toolkit'
import { fetchPublicHeroSlides } from '../thunks/heroThunks'

const initialState = {
  items: [],
  status: 'idle',
  error: null,
}

const heroSlice = createSlice({
  name: 'hero',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchPublicHeroSlides.pending, (state) => {
        state.status = 'loading'
        state.error = null
      })
      .addCase(fetchPublicHeroSlides.fulfilled, (state, action) => {
        state.status = 'loaded'
        state.items = action.payload || []
      })
      .addCase(fetchPublicHeroSlides.rejected, (state, action) => {
        state.status = 'error'
        state.error = action.payload || 'Unable to load hero content'
      })
  },
})

export const selectHeroSlides = (state) => state.hero.items
export const selectHeroStatus = (state) => state.hero.status
export const selectHeroError = (state) => state.hero.error

export default heroSlice.reducer
