const KEY = 'hexlet-chat:auth'

export const getAuth = () => {
  try {
    return JSON.parse(localStorage.getItem(KEY)) || null
  }
  catch (error) {
    console.log(error)
    return null
  }
}
export const setAuth = auth => localStorage.setItem(KEY, JSON.stringify(auth))
export const clearAuth = () => localStorage.removeItem(KEY)
export const isAuthenticated = () => Boolean(getAuth()?.token)
