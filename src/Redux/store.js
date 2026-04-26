import { configureStore } from '@reduxjs/toolkit'
import consultationReducer from './slices/consultationSlice'
import heroReducer from './slices/heroSlice'
import partnerReducer from './slices/partnerSlice'
import profileReducer from './slices/profileSlice'
import projectReducer from './slices/projectSlice'
import serviceReducer from './slices/serviceSlice'

export const store = configureStore({
  reducer: {
    consultations: consultationReducer,
    hero: heroReducer,
    partners: partnerReducer,
    profile: profileReducer,
    projects: projectReducer,
    services: serviceReducer,
  },
})
