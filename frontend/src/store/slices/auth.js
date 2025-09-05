import { createSlice } from '@reduxjs/toolkit'

const KEY = 'hexlet-chat:auth'

const initialAuth = (() => {
  try {
    return JSON.parse(localStorage.getItem(KEY)) || null
  } 
  catch (error) {
    console.log(error)
    return null
  }
})()

const slice = createSlice({
  name: 'auth',
  initialState: { user: initialAuth },
  reducers: {
    login: (st, { payload }) => {
      st.user = payload
      localStorage.setItem(KEY, JSON.stringify(payload))
    },
    logout: (st) => {
      st.user = null
      localStorage.removeItem(KEY)
    },
  },
})

export const { login, logout } = slice.actions
export default slice.reducer
