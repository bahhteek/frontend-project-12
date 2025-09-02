import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import api from "../../api"

export const fetchChannels = createAsyncThunk("channels/fetch", async () => {
  const { data } = await api.get("/api/v1/channels");
  return data;
});

const channelsSlice = createSlice({
  name: "channels",
  initialState: { list: [], status: "idle", error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchChannels.pending, (st) => {
        st.status = "loading";
        st.error = null;
      })
      .addCase(fetchChannels.fulfilled, (st, { payload }) => {
        st.status = "succeeded";
        st.list = payload;
      })
      .addCase(fetchChannels.rejected, (st, { error }) => {
        st.status = "failed";
        st.error = error.message;
      });
  },
});

export default channelsSlice.reducer;
