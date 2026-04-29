import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App.jsx'
import { store } from './Redux/store'
import { sendAnalyticsEventBatch } from './Redux/thunks/analyticsThunks'
import { configureAnalyticsBatchSender } from './analytics/webAnalytics'

configureAnalyticsBatchSender(async (events) => {
  try {
    await store.dispatch(sendAnalyticsEventBatch(events)).unwrap()
    return true
  } catch (_error) {
    return false
  }
})

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </Provider>
  </StrictMode>,
)
