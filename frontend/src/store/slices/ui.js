import { createSlice } from "@reduxjs/toolkit"
import { fetchChannels } from "./channels"

const uiSlice = createSlice({
  name: "ui",
  initialState: { activeChannelId: null },
  reducers: {
    setActiveChannel: (st, { payload }) => {
      st.activeChannelId = payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchChannels.fulfilled, (st, { payload }) => {
      if (!st.activeChannelId && payload.length)
        st.activeChannelId = payload[0].id;
    });
  },
});

export const { setActiveChannel } = uiSlice.actions;
export default uiSlice.reducer;
