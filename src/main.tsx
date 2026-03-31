import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { BrowserRouter, HashRouter } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import { store } from './redux/store.ts'
import { Provider } from 'react-redux'
import { AuthProvider } from './context/AuthContext.tsx'
import {
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query'

// khi build web thì sử dụng BrowserRouter còn khi build app PC thì sử dụng HashRouter
const queryClient = new QueryClient()
window.global = window;
createRoot(document.getElementById('root')!).render(
  <>
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <Provider store={store}>
          <AuthProvider>
            <App />
          </AuthProvider>
          <ToastContainer />
        </Provider>
        <ToastContainer />
      </QueryClientProvider>
    </BrowserRouter>

  </>,
)
