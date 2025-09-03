import { createSlice } from "@reduxjs/toolkit"
import { addChannel, fetchChannels, removeChannel } from "./channels"

const uiSlice = createSlice({
  name: "ui",
  initialState: { activeChannelId: null, modal: null },
  reducers: {
    setActiveChannel: (st, { payload }) => {
      st.activeChannelId = payload;
    },
    openModal: (st, { payload }) => {
      st.modal = payload;
    },
    closeModal: (st) => {
      st.modal = null;
    },
  },
  extraReducers: (b) => {
    b.addCase(fetchChannels.fulfilled, (st, { payload }) => {
      if (!st.activeChannelId && payload.length) {
        const g = payload.find((c) => c.name?.toLowerCase() === "general");
        st.activeChannelId = g ? g.id : payload[0].id;
      }
    });
    b.addCase(addChannel.fulfilled, (st, { payload }) => {
      st.activeChannelId = payload.id;
    });
    b.addCase(removeChannel.fulfilled, (st, { payload }) => {
      if (String(st.activeChannelId) === String(payload.id)) {
        st.activeChannelId = payload.nextId;
      }
    });
  },
});

export const { setActiveChannel, openModal, closeModal } = uiSlice.actions;
export default uiSlice.reducer;
