import { io } from 'socket.io-client'
import { getAuth } from './auth'

export const createSocket = () => {
  const auth = getAuth()
  const socket = io('/', {
    path: '/socket.io',
    transports: ['websocket', 'polling'],
    auth: auth?.token ? { token: auth.token } : undefined,
    autoConnect: true,
    reconnection: true,
    reconnectionDelayMax: 5000,
  })
  return socket
}
