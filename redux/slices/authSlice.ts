import { createSlice, PayloadAction } from '@reduxjs/toolkit'


// pull saved auth from localStorage if present
const saved = (() => {
  try {
    const json = localStorage.getItem('auth')
    return json ? JSON.parse(json) : null
  } catch {
    return null
  }
})()

export interface User {
  id: number
  name: string
  email: string
  email_verified_at: string | null
  username: string
  role_id: number
  employee_id: number | null
  status: string
  created_at: string
  updated_at: string
  deleted_at: string | null
}

interface AuthState {
  user: User | null
  token: string | null
  error: string | null
}

const initialState: AuthState = {
  user: saved?.user ?? null,
  token: saved?.token ?? null,
  error: null,
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials(state, action: PayloadAction<{ user: User; token: string }>) {
  state.user = action.payload.user
  state.token = action.payload.token
  state.error = null
  try {
    localStorage.setItem(
      'auth',
      JSON.stringify({ user: state.user, token: state.token })
    )
  } catch {}
}
,
    logout(state) {
      state.user = null
      state.token = null
      state.error = null
      localStorage.removeItem('auth')
    },
    setError(state, action: PayloadAction<string>) {
      state.error = action.payload
    },
  },
})

export const { setCredentials, logout, setError } = authSlice.actions
export default authSlice.reducer
