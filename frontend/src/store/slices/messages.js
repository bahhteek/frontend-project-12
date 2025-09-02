import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import api from "../../api"

export const fetchMessages = createAsyncThunk("messages/fetch", async () => {
  const { data } = await api.get("/api/v1/messages");
  return data;
});

const messagesSlice = createSlice({
  name: "messages",
  initialState: {
    list: [],
    status: "idle",
    error: null,
    sending: false,
    sendError: null,
  },
  reducers: {
    messageArrived: (st, { payload }) => {
      st.list.push(payload);
    },
    setSending: (st, { payload }) => {
      st.sending = payload;
      if (payload) st.sendError = null;
    },
    setSendError: (st, { payload }) => {
      st.sendError = payload || "Ошибка отправки";
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMessages.pending, (st) => {
        st.status = "loading";
        st.error = null;
      })
      .addCase(fetchMessages.fulfilled, (st, { payload }) => {
        st.status = "succeeded";
        st.list = payload;
      })
      .addCase(fetchMessages.rejected, (st, { error }) => {
        st.status = "failed";
        st.error = error.message;
      });
  },
});

export const { messageArrived, setSending, setSendError } =
  messagesSlice.actions;
export default messagesSlice.reducer;
