import axios from 'axios'

// Registered once so every slice gets the token and a single 401 policy without per-slice plumbing.
export function setupAxios(store, logout) {
  axios.interceptors.request.use((config) => {
    const token = localStorage.getItem('token')
    if (token && !config.headers.Authorization) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  })

  axios.interceptors.response.use(
    (response) => response,
    (error) => {
      const isLoginCall = error.config?.url?.includes('/auth/login')
      if (error.response?.status === 401 && !isLoginCall && store.getState().auth.token) {
        store.dispatch(logout())
      }
      return Promise.reject(error)
    }
  )
}
