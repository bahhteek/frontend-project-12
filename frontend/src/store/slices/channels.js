import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { toast } from 'react-toastify'
import api from '../../api'
import i18n from '../../i18n'
import filter from '../../profanity'

export const fetchChannels = createAsyncThunk(
  'channels/fetch',
  async () => (await api.get('/api/v1/channels')).data,
)

export const addChannel = createAsyncThunk(
  'channels/add',
  async name =>
    (await api.post('/api/v1/channels', { name: filter.clean(name) })).data,
)

export const renameChannel = createAsyncThunk(
  'channels/rename',
  async ({ id, name }) =>
    (await api.patch(`/api/v1/channels/${id}`, { name: filter.clean(name) }))
      .data,
)

export const removeChannel = createAsyncThunk(
  'channels/remove',
  async (id, { getState }) => {
    await api.delete(`/api/v1/channels/${id}`)
    const state = getState()
    const channels = state.channels.list.filter(
      c => String(c.id) !== String(id),
    )
    const general =
      channels.find(c => c.name?.toLowerCase() === 'general') || channels[0]
    return { id, nextId: general?.id ?? null }
  },
)

const initial = { list: [], status: 'idle', error: null }

const slice = createSlice({
  name: 'channels',
  initialState: initial,
  reducers: {},
  extraReducers: (b) => {
    b.addCase(fetchChannels.fulfilled, (st, { payload }) => {
      st.status = 'succeeded'
      st.list = payload
      st.error = null
    })
      .addCase(fetchChannels.pending, (st) => {
        st.status = 'loading'
        st.error = null
      })
      .addCase(fetchChannels.rejected, (st, { error }) => {
        st.status = 'failed'
        st.error = error.message
        toast.error(i18n.t('toasts.networkError'))
      })

      .addCase(addChannel.fulfilled, (st, { payload }) => {
        st.list.push(payload)
        toast.success(i18n.t('toasts.channelCreated'))
      })
      .addCase(addChannel.rejected, (st, { error }) => {
        st.error = error.message
        toast.error(i18n.t('toasts.channelCreateError'))
      })

      .addCase(renameChannel.fulfilled, (st, { payload }) => {
        const i = st.list.findIndex(c => String(c.id) === String(payload.id))
        if (i > -1) st.list[i] = payload
        toast.success(i18n.t('toasts.channelRenamed'))
      })
      .addCase(renameChannel.rejected, (st, { error }) => {
        st.error = error.message
        toast.error(i18n.t('toasts.channelRenameError'))
      })

      .addCase(removeChannel.fulfilled, (st, { payload }) => {
        st.list = st.list.filter(c => String(c.id) !== String(payload.id))
        toast.success(i18n.t('toasts.channelRemoved'))
      })
      .addCase(removeChannel.rejected, (st, { error }) => {
        st.error = error.message
        toast.error(i18n.t('toasts.channelRemoveError'))
      })
  },
})

export default slice.reducer
