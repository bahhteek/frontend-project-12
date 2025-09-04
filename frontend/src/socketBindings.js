import { fetchChannels } from './store/slices/channels'
import { messageArrived } from './store/slices/messages'

export const bindSocketEvents = (socket, dispatch) => {
  socket.on('connect', () => {
  })

  socket.on('disconnect', () => {
  })

  socket.on('newMessage', (payload) => {
    dispatch(messageArrived(payload))
  })

  socket.on('newChannel', () => dispatch(fetchChannels()))
  socket.on('removeChannel', () => dispatch(fetchChannels()))
  socket.on('renameChannel', () => dispatch(fetchChannels()))
}
