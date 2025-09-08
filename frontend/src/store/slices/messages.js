import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import api from '../../api'
import routes from '../../apiPaths'
import filter from '../../profanity'

export const fetchMessages = createAsyncThunk('messages/fetch', async () => {
  const { data } = await api.get(routes.messages);
  return data
})

export const sendMessage = createAsyncThunk(
  'messages/send',
  async ({ text, channelId, username }, { rejectWithValue }) => {
    try {
      const { data } = await api.post(routes.messages, {
        body: filter.clean(text),
        channelId: String(channelId),
        username,
      });
      return data
    }
    catch (error) {
      console.log(error)
      return rejectWithValue('Ошибка отправки')
    }
  },
)

const messagesSlice = createSlice({
  name: 'messages',
  initialState: {
    list: [],
    status: 'idle',
    error: null,
    sending: false,
    sendError: null,
  },
  reducers: {
    messageArrived: (st, { payload }) => {
      st.list.push(payload)
    },
    setSendError: (st, { payload }) => {
      st.sendError = payload || 'Ошибка отправки'
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMessages.pending, (st) => {
        st.status = 'loading'
        st.error = null
      })
      .addCase(fetchMessages.fulfilled, (st, { payload }) => {
        st.status = 'succeeded'
        st.list = payload
      })
      .addCase(fetchMessages.rejected, (st, { error }) => {
        st.status = 'failed'
        st.error = error.message
      })

      .addCase(sendMessage.pending, (st) => {
        st.sending = true
        st.sendError = null
      })
      .addCase(sendMessage.fulfilled, (st) => {
        st.sending = false
      })
      .addCase(sendMessage.rejected, (st, { payload }) => {
        st.sending = false
        st.sendError = payload
      })
  },
})

export const { messageArrived, setSendError } = messagesSlice.actions
export default messagesSlice.reducer
